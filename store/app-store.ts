import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewType = 'studio' | 'flows' | 'components' | 'artifacts' | 'templates' | 'projects' | 'exports' | 'settings';

export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Completed';
  updated: string;
  flows: number;
}

interface AppState {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeView: 'studio',
      setActiveView: (view) => set({ activeView: view }),
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      theme: 'dark',
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (typeof window !== 'undefined') {
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return { theme: newTheme };
      }),
      activeProject: null,
      setActiveProject: (project) => set({ activeProject: project }),
      chatInput: '',
      setChatInput: (input) => set({ chatInput: input }),
    }),
    {
      name: 'carousel-studio-storage',
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }
  )
);
