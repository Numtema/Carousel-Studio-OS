'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, Terminal, Settings2, Loader2, Square, Plus, Trash2, Image as ImageIcon, Edit2, ArrowRight, Download } from 'lucide-react';
import Markdown from 'react-markdown';
import Image from 'next/image';
import { useFlowStore } from '@/store/flow-store';
import { useAppStore } from '@/store/app-store';

export function StudioView() {
  const { messages, startFlow, flowState, stopFlow, slides, theme, templateStyle, setTheme, addSlide, updateSlide, removeSlide, generateImageForSlide, editImageForSlide } = useFlowStore();
  const { chatInput, setChatInput } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [editingImagePrompt, setEditingImagePrompt] = useState<{slideId: string, prompt: string} | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!chatInput.trim() || flowState === 'running') return;
    const userMsg = chatInput;
    setChatInput('');
    await startFlow(userMsg);
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left Column: Chat & Settings */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-1/3 flex flex-col gap-4"
      >
        <div className="flex-1 bg-surface rounded-[2.5rem] border border-border p-6 flex flex-col shadow-lg overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border">
                <Sparkles size={16} className="text-clay" />
              </div>
              <h2 className="text-lg font-bold">Carousel Chat</h2>
            </div>
            {flowState === 'running' && (
              <button onClick={stopFlow} className="p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors">
                <Square size={14} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                <div className={`px-4 py-3 text-sm max-w-[90%] ${
                  msg.role === 'user' 
                    ? 'bg-background border border-border rounded-2xl rounded-tr-sm self-end' 
                    : msg.role === 'system'
                    ? 'bg-transparent border border-border rounded-2xl text-text-secondary self-start font-mono text-xs'
                    : 'bg-moss/20 border border-moss/30 rounded-2xl rounded-tl-sm self-start'
                }`}>
                  <div className="markdown-body prose prose-invert prose-sm max-w-none prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-pre:rounded-xl">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>
              </div>
            ))}
            {flowState === 'running' && (
              <div className="self-start bg-moss/20 border border-moss/30 rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[90%] flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-moss" />
                <span className="text-text-secondary">Processing flow...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="mt-4 relative">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your carousel..." 
              className="w-full bg-background border border-border rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-clay/50 transition-colors text-text-primary placeholder:text-text-secondary"
              disabled={flowState === 'running'}
            />
            <button 
              onClick={handleSend}
              disabled={flowState === 'running' || !chatInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-clay rounded-full flex items-center justify-center hover:bg-[#A34629] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} className="text-white ml-1" />
            </button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-surface rounded-[2rem] border border-border p-6 shadow-lg">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Settings2 size={16} className="text-clay"/> Theme Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary block mb-1">Start Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={theme.colors.start} onChange={(e) => setTheme({ colors: { ...theme.colors, start: e.target.value } })} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0" />
                <span className="text-xs font-mono">{theme.colors.start}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-text-secondary block mb-1">End Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={theme.colors.end} onChange={(e) => setTheme({ colors: { ...theme.colors, end: e.target.value } })} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0" />
                <span className="text-xs font-mono">{theme.colors.end}</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-text-secondary block mb-1">Font Family</label>
              <input type="text" value={theme.fontFamily} onChange={(e) => setTheme({ fontFamily: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-clay" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Carousel Editor */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 bg-surface rounded-[3rem] border border-border flex flex-col shadow-lg overflow-hidden relative"
      >
        {/* Abstract Hero Visual */}
        <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none overflow-hidden z-0 opacity-40">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[80px] animate-pulse" />
          <div className="absolute top-10 right-10 w-80 h-80 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px]" />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[120px]" />
        </div>

        <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/50 relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-border" />
              <div className="w-3 h-3 rounded-full bg-border" />
              <div className="w-3 h-3 rounded-full bg-border" />
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="text-xs font-mono text-text-secondary flex items-center gap-2">
              <Terminal size={14} />
              <span>Carousel Editor: {slides.length} Slides</span>
            </div>
          </div>
          
          <button 
            onClick={() => addSlide({})}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border hover:border-clay text-xs font-medium transition-colors"
          >
            <Plus size={14} /> Add Slide
          </button>
        </div>

        <div className="flex-1 bg-background/50 relative overflow-x-auto overflow-y-hidden flex items-center p-8 gap-8 no-scrollbar z-10">
          {slides.length === 0 ? (
            <div className="w-full text-center text-text-secondary">
              <p>No slides yet. Describe your carousel in the chat to generate.</p>
            </div>
          ) : (
            slides.map((slide, index) => {
              const isHandwritten = templateStyle === 'handwritten';
              const slideStyle = isHandwritten 
                ? { backgroundColor: '#f8f5f0', fontFamily: 'var(--font-caveat)', color: '#1e3a8a' }
                : { background: `linear-gradient(to bottom, ${theme.colors.start}, ${theme.colors.end})`, fontFamily: theme.fontFamily, color: 'white' };

              return (
              <div key={slide.id} id={`slide-export-${slide.id}`} className={`flex-shrink-0 w-[360px] h-[640px] rounded-3xl overflow-hidden relative group shadow-2xl border border-border/50 flex flex-col ${isHandwritten ? 'text-[#1e3a8a]' : 'text-white'}`} style={slideStyle}>
                
                {/* Slide Number Badge */}
                <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full z-20 ${isHandwritten ? 'bg-black/5 text-[#1e3a8a]' : 'bg-black/40 backdrop-blur-md text-white'}`}>
                  {slide.slide_number} / {slides.length}
                </div>

                {/* Delete Button */}
                <button onClick={() => removeSlide(slide.id)} className="absolute top-4 left-4 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </button>

                {/* Download Button */}
                <button onClick={() => useFlowStore.getState().downloadSlideAsPNG(slide.id, index)} className="absolute top-4 left-12 bg-blue-500/80 hover:bg-blue-500 text-white p-1.5 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download size={14} />
                </button>

                {/* Image Area */}
                <div className={`h-[40%] relative overflow-hidden flex items-center justify-center shrink-0 ${isHandwritten ? '' : 'bg-black/20'}`}>
                  {slide.image_base64 ? (
                    <Image src={`data:image/png;base64,${slide.image_base64}`} alt="Slide visual" fill className={`object-cover ${isHandwritten ? 'mix-blend-multiply opacity-90' : 'opacity-80 mix-blend-overlay'}`} referrerPolicy="no-referrer" />
                  ) : (
                    <div className={`${isHandwritten ? 'text-[#1e3a8a]/50' : 'text-white/50'} flex flex-col items-center gap-2 p-4 text-center`}>
                      <ImageIcon size={32} />
                      <p className="text-xs font-sans">{slide.image_prompt || 'No image prompt'}</p>
                    </div>
                  )}
                  
                  {/* Image Generation Overlay */}
                  {slide.isGeneratingImage && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30">
                      <Loader2 size={24} className="animate-spin text-white" />
                    </div>
                  )}

                  {/* Image Actions Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-20">
                    {!slide.image_base64 ? (
                      <button 
                        onClick={() => generateImageForSlide(slide.id, slide.image_prompt || 'Abstract cinematic background')}
                        className="px-4 py-2 bg-clay text-white rounded-full text-xs font-medium flex items-center gap-2 font-sans"
                      >
                        <Sparkles size={14} /> Generate Image
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2 w-3/4 font-sans">
                        <input 
                          type="text" 
                          placeholder="Edit prompt (e.g. Add a retro filter)" 
                          className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-clay"
                          value={editingImagePrompt?.slideId === slide.id ? editingImagePrompt.prompt : ''}
                          onChange={(e) => setEditingImagePrompt({ slideId: slide.id, prompt: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button 
                          onClick={() => {
                            if (editingImagePrompt?.slideId === slide.id && editingImagePrompt.prompt) {
                              editImageForSlide(slide.id, editingImagePrompt.prompt);
                              setEditingImagePrompt(null);
                            }
                          }}
                          className="px-4 py-2 bg-clay text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2"
                        >
                          <Edit2 size={14} /> Apply Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Area */}
                <div className={`flex-1 p-6 flex flex-col justify-end z-10 ${isHandwritten ? '' : 'bg-gradient-to-t from-black/80 to-transparent'}`}>
                  <textarea 
                    value={slide.headline}
                    onChange={(e) => updateSlide(slide.id, { headline: e.target.value })}
                    className={`bg-transparent border-none font-bold text-3xl mb-2 resize-y focus:outline-none focus:ring-1 focus:ring-black/10 rounded p-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isHandwritten ? 'text-[#1e3a8a] leading-tight' : 'text-white'}`}
                    rows={2}
                    placeholder="Headline"
                  />
                  <textarea 
                    value={slide.body_text}
                    onChange={(e) => updateSlide(slide.id, { body_text: e.target.value })}
                    className={`bg-transparent border-none text-xl resize-y focus:outline-none focus:ring-1 focus:ring-black/10 rounded p-1 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isHandwritten ? 'text-[#1e3a8a]/90 leading-snug' : 'text-white/90 text-sm'}`}
                    placeholder="Body text"
                  />
                  
                  {/* Pagination Dots */}
                  <div className="flex justify-between items-center mt-4 shrink-0">
                    <div className="flex gap-1.5">
                      {slides.map((_, dotIndex) => (
                        <div 
                          key={dotIndex} 
                          className={`h-1.5 rounded-full transition-all ${dotIndex === index ? (isHandwritten ? 'w-4 bg-[#1e3a8a]' : 'w-4 bg-white') : (isHandwritten ? 'w-1.5 bg-[#1e3a8a]/30' : 'w-1.5 bg-white/40')}`}
                        />
                      ))}
                    </div>
                    {index < slides.length - 1 && (
                      <div className={`flex items-center gap-1 text-xs font-medium uppercase tracking-wider font-sans ${isHandwritten ? 'text-[#1e3a8a]/60' : 'text-white/60'}`}>
                        Swipe <ArrowRight size={12} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )})
          )}
        </div>
      </motion.div>
    </div>
  );
}
