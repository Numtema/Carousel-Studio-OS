import { create } from 'zustand';
import { GoogleGenAI } from '@google/genai';
import JSZip from 'jszip';
import * as htmlToImage from 'html-to-image';

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';
export type FlowState = 'idle' | 'running' | 'paused' | 'completed' | 'error';
export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface Artifact {
  id: string;
  name: string;
  type: 'json' | 'markdown' | 'folder' | 'zip' | 'html';
  time: string;
  status: 'pending' | 'success' | 'error';
  content?: string;
}

export interface Slide {
  id: string;
  slide_number: number;
  headline: string;
  body_text: string;
  image_prompt?: string;
  image_base64?: string;
  isGeneratingImage?: boolean;
}

export interface CarouselTheme {
  colors: { start: string, end: string };
  fontFamily: string;
  tone: string;
}

export type TemplateStyle = 'cinematic' | 'handwritten';

interface FlowStore {
  flowState: FlowState;
  activeNode: string | null;
  nodeStatuses: Record<string, NodeStatus>;
  artifacts: Artifact[];
  messages: { role: 'user' | 'model' | 'system', text: string }[];
  deviceMode: DeviceMode;
  
  slides: Slide[];
  theme: CarouselTheme;
  templateStyle: TemplateStyle;

  setDeviceMode: (mode: DeviceMode) => void;
  setTheme: (theme: Partial<CarouselTheme>) => void;
  setTemplateStyle: (style: TemplateStyle) => void;
  addSlide: (slide: Partial<Slide>) => void;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
  removeSlide: (id: string) => void;
  
  startFlow: (intent: string) => Promise<void>;
  generateImageForSlide: (slideId: string, prompt: string) => Promise<void>;
  editImageForSlide: (slideId: string, prompt: string) => Promise<void>;
  stopFlow: () => void;
  setNodeStatus: (nodeId: string, status: NodeStatus) => void;
  addArtifact: (artifact: Artifact) => void;
  addMessage: (msg: { role: 'user' | 'model' | 'system', text: string }) => void;
  resetFlow: () => void;
  exportBuild: () => Promise<void>;
  downloadSlideAsPNG: (slideId: string, index: number) => Promise<void>;
}

const initialNodeStatuses: Record<string, NodeStatus> = {
  '1': 'idle', '2': 'idle', '3': 'idle', '4': 'idle', '5': 'idle',
  '6': 'idle', '7': 'idle', '8': 'idle', '9': 'idle'
};

const executeWithRetry = async (fn: () => Promise<any>, addMessage: any, maxRetries = 3) => {
  let retries = maxRetries;
  while (retries > 0) {
    try {
      return await fn();
    } catch (error: any) {
      const errorMessage = error.message || '';
      const isRateLimit = error.status === 429 || error.status === 'RESOURCE_EXHAUSTED' || errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota');
      
      const match = errorMessage.match(/Please retry in ([\d.]+)s/);
      const isHardQuota = errorMessage.includes('quota') && !match;

      if (isRateLimit && retries > 1 && !isHardQuota) {
        retries--;
        let waitTime = 10000; // default 10s wait
        if (match && match[1]) {
          waitTime = Math.ceil(parseFloat(match[1])) * 1000 + 1000;
        }
        addMessage({ role: 'system', text: `Rate limit hit. Retrying in ${Math.round(waitTime/1000)} seconds... (${retries} retries left)` });
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        // If it's a hard quota or we're out of retries, throw immediately
        let niceMessage = errorMessage;
        try {
          // Try to extract JSON if it's embedded in a string
          const jsonMatch = errorMessage.match(/\{.*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : errorMessage;
          const parsed = JSON.parse(jsonStr);
          if (parsed.error && parsed.error.message) {
            niceMessage = parsed.error.message;
          }
        } catch (e) {
          // Not JSON, keep original
        }
        throw new Error(niceMessage);
      }
    }
  }
  throw new Error('Failed after retries');
};

export const useFlowStore = create<FlowStore>((set, get) => ({
  flowState: 'idle',
  activeNode: null,
  nodeStatuses: { ...initialNodeStatuses },
  artifacts: [],
  messages: [
    { role: 'system', text: 'Carousel Studio OS initialized. Describe the carousel you want to create.' }
  ],
  deviceMode: 'desktop',
  
  slides: [],
  theme: {
    colors: { start: '#081237', end: '#0B2A9B' },
    fontFamily: 'Inter',
    tone: 'educational_cinematic'
  },
  templateStyle: 'cinematic',

  setDeviceMode: (mode) => set({ deviceMode: mode }),
  setTheme: (themeUpdate) => set((state) => ({ theme: { ...state.theme, ...themeUpdate } })),
  setTemplateStyle: (style) => set({ templateStyle: style }),
  
  addSlide: (slide) => set((state) => ({
    slides: [...state.slides, {
      id: Date.now().toString(),
      slide_number: state.slides.length + 1,
      headline: slide.headline || 'New Slide',
      body_text: slide.body_text || '',
      image_prompt: slide.image_prompt || '',
      ...slide
    }]
  })),
  
  updateSlide: (id, updates) => set((state) => ({
    slides: state.slides.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  
  removeSlide: (id) => set((state) => ({
    slides: state.slides.filter(s => s.id !== id).map((s, i) => ({ ...s, slide_number: i + 1 }))
  })),

  setNodeStatus: (nodeId, status) => set((state) => ({
    nodeStatuses: { ...state.nodeStatuses, [nodeId]: status }
  })),

  addArtifact: (artifact) => set((state) => ({
    artifacts: [artifact, ...state.artifacts]
  })),

  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, msg]
  })),

  stopFlow: () => set({ flowState: 'idle', activeNode: null, nodeStatuses: { ...initialNodeStatuses } }),

  resetFlow: () => set({
    flowState: 'idle',
    activeNode: null,
    nodeStatuses: { ...initialNodeStatuses },
    artifacts: [],
    slides: [],
    messages: [{ role: 'system', text: 'Flow reset. Ready for new intent.' }]
  }),

  exportBuild: async () => {
    const { slides, theme, addMessage } = get();
    if (slides.length === 0) {
      addMessage({ role: 'system', text: 'Export failed: No slides available.' });
      return;
    }

    addMessage({ role: 'system', text: 'Packaging export build...' });
    
    try {
      const zip = new JSZip();
      
      zip.file('carousel-data.json', JSON.stringify({ theme, slides }, null, 2));
      
      // Capture each slide as a PNG
      for (let index = 0; index < slides.length; index++) {
        const slide = slides[index];
        const element = document.getElementById(`slide-export-${slide.id}`);
        
        if (element) {
          // Temporarily hide UI elements we don't want in the export
          const buttons = element.querySelectorAll('button');
          buttons.forEach(btn => btn.style.display = 'none');
          
          const textareas = element.querySelectorAll('textarea');
          textareas.forEach(ta => ta.style.resize = 'none');
          
          const dataUrl = await htmlToImage.toPng(element, {
            pixelRatio: 2,
            backgroundColor: 'transparent',
          });
          
          // Restore UI elements
          buttons.forEach(btn => btn.style.display = '');
          textareas.forEach(ta => ta.style.resize = '');
          
          const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
          zip.file(`slide_${index + 1}_full.png`, base64Data, { base64: true });
        }

        // Also save the raw image if it exists
        if (slide.image_base64) {
          const rawBase64Data = slide.image_base64.replace(/^data:image\/\w+;base64,/, '');
          zip.file(`slide_${index + 1}_raw_image.png`, rawBase64Data, { base64: true });
        }
      }

      zip.file('README.md', '# Carousel Export\n\nGenerated by Carousel Studio OS.');

      const content = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'carousel-export.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addMessage({ role: 'system', text: 'Export downloaded successfully.' });
    } catch (error: any) {
      console.error('Export error:', error);
      addMessage({ role: 'system', text: `Export failed: ${error.message}` });
    }
  },

  generateImageForSlide: async (slideId: string, prompt: string) => {
    const { updateSlide, addMessage } = get();
    updateSlide(slideId, { isGeneratingImage: true });
    addMessage({ role: 'system', text: `Generating image for slide with prompt: "${prompt}"...` });

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key missing');
      const ai = new GoogleGenAI({ apiKey });

      const response = await executeWithRetry(() => ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4",
          }
        }
      }), addMessage);

      let newBase64 = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
          newBase64 = part.inlineData.data;
          break;
        }
      }

      if (newBase64) {
        updateSlide(slideId, { image_base64: newBase64, isGeneratingImage: false });
        addMessage({ role: 'system', text: `Image generated successfully.` });
      } else {
        throw new Error('No image returned');
      }
    } catch (error: any) {
      console.error(error);
      addMessage({ role: 'system', text: `Image generation failed: ${error.message}` });
      updateSlide(slideId, { isGeneratingImage: false });
    }
  },

  editImageForSlide: async (slideId: string, prompt: string) => {
    const { slides, updateSlide, addMessage } = get();
    const slide = slides.find(s => s.id === slideId);
    if (!slide || !slide.image_base64) return;

    updateSlide(slideId, { isGeneratingImage: true });
    addMessage({ role: 'system', text: `Editing image for slide ${slide.slide_number} with prompt: "${prompt}"...` });

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key missing');
      const ai = new GoogleGenAI({ apiKey });

      const base64Data = slide.image_base64.replace(/^data:image\/\w+;base64,/, '');

      const response = await executeWithRetry(() => ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/png',
              },
            },
            { text: prompt },
          ],
        },
      }), addMessage);

      let newBase64 = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
          newBase64 = part.inlineData.data;
          break;
        }
      }

      if (newBase64) {
        updateSlide(slideId, { image_base64: newBase64, isGeneratingImage: false });
        addMessage({ role: 'system', text: `Image edited successfully for slide ${slide.slide_number}.` });
      } else {
        throw new Error('No image returned');
      }
    } catch (error: any) {
      console.error(error);
      addMessage({ role: 'system', text: `Image edit failed: ${error.message}` });
      updateSlide(slideId, { isGeneratingImage: false });
    }
  },

  downloadSlideAsPNG: async (slideId: string, index: number) => {
    const { addMessage } = get();
    try {
      const element = document.getElementById(`slide-export-${slideId}`);
      if (!element) throw new Error('Slide element not found');

      const buttons = element.querySelectorAll('button');
      buttons.forEach(btn => btn.style.display = 'none');
      
      const textareas = element.querySelectorAll('textarea');
      textareas.forEach(ta => ta.style.resize = 'none');
      
      const dataUrl = await htmlToImage.toPng(element, {
        pixelRatio: 2,
        backgroundColor: 'transparent',
      });
      
      buttons.forEach(btn => btn.style.display = '');
      textareas.forEach(ta => ta.style.resize = '');
      
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `slide_${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      addMessage({ role: 'system', text: `Slide ${index + 1} downloaded as PNG.` });
    } catch (error: any) {
      console.error('Download error:', error);
      addMessage({ role: 'system', text: `Download failed: ${error.message}` });
    }
  },

  startFlow: async (intent: string) => {
    const { addMessage, setNodeStatus, addArtifact } = get();
    
    set({
      flowState: 'running',
      activeNode: '1',
      nodeStatuses: { ...initialNodeStatuses, '1': 'running' },
    });

    addMessage({ role: 'user', text: intent });

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key missing');
      const ai = new GoogleGenAI({ apiKey });

      setNodeStatus('1', 'success');
      
      set({ activeNode: '2' });
      setNodeStatus('2', 'running');
      setNodeStatus('3', 'running');
      
      addMessage({ role: 'system', text: 'Analyzing intent and generating carousel structure...' });
      
      set({ activeNode: '4' });
      setNodeStatus('2', 'success');
      setNodeStatus('3', 'success');
      setNodeStatus('4', 'running');

      const response = await executeWithRetry(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User intent: ${intent}\n\nCreate a carousel structure for an Instagram post (usually 5-10 slides). Return ONLY a valid JSON object with this structure:
{
  "theme": {
    "colors": { "start": "#HEX", "end": "#HEX" },
    "fontFamily": "Inter",
    "tone": "educational"
  },
  "slides": [
    {
      "headline": "...",
      "body_text": "...",
      "image_prompt": "Detailed prompt for an image generator (e.g. 3D brain glowing blue)"
    }
  ]
}`,
        config: {
          responseMimeType: 'application/json',
        }
      }), addMessage);

      if (!response) throw new Error('Failed to generate content after retries');

      const text = response.text || '{}';
      const data = JSON.parse(text);
      
      if (data.theme) {
        set({ theme: data.theme });
      }
      
      if (data.slides && Array.isArray(data.slides)) {
        const newSlides = data.slides.map((s: any, i: number) => ({
          id: Date.now().toString() + i,
          slide_number: i + 1,
          headline: s.headline || '',
          body_text: s.body_text || '',
          image_prompt: s.image_prompt || '',
        }));
        set({ slides: newSlides });
      }

      addArtifact({
        id: Date.now().toString(),
        name: 'carousel-blueprint.json',
        type: 'json',
        time: new Date().toLocaleTimeString(),
        status: 'success',
        content: JSON.stringify(data, null, 2)
      });

      addMessage({ role: 'model', text: `Carousel structure generated successfully with ${data.slides?.length || 0} slides.` });

      setNodeStatus('4', 'success');
      set({ activeNode: '8' });
      setNodeStatus('8', 'success');
      set({ activeNode: '9' });
      setNodeStatus('9', 'success');
      
      set({ flowState: 'completed', activeNode: null });

    } catch (error: any) {
      console.error(error);
      addMessage({ role: 'system', text: `Error: ${error.message}` });
      set({ flowState: 'error' });
      if (get().activeNode) {
        setNodeStatus(get().activeNode as string, 'error');
      }
    }
  }
}));
