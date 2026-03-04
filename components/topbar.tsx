'use client';

import Image from 'next/image';
import { useAppStore } from '@/store/app-store';
import { useFlowStore } from '@/store/flow-store';
import { motion } from 'motion/react';
import { ChevronDown, Zap, Download, Loader2, Moon, Sun, User } from 'lucide-react';

export function TopBar() {
  const { isSidebarCollapsed, theme, toggleTheme, activeProject, setActiveView } = useAppStore();
  const { flowState, activeNode, exportBuild } = useFlowStore();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        left: isSidebarCollapsed ? 112 : 300 
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-4 right-8 z-40 h-16 bg-surface/80 backdrop-blur-xl border border-border rounded-full px-6 flex items-center justify-between shadow-lg"
    >
      {/* Left section: Project selector & Status */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setActiveView('projects')}
          className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-clay transition-colors"
        >
          <span className="opacity-50">Project:</span>
          <span>{activeProject ? activeProject.name : 'Select Project'}</span>
          <ChevronDown size={14} className="opacity-50" />
        </button>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
          <div className={`w-2 h-2 rounded-full ${flowState === 'running' ? 'bg-clay animate-pulse shadow-[0_0_8px_var(--clay)]' : 'bg-moss shadow-[0_0_8px_var(--moss)]'}`} />
          <span>{flowState === 'running' ? 'SYSTEM PROCESSING' : 'SYSTEM OPERATIONAL'}</span>
        </div>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border text-xs font-mono text-text-secondary">
          {flowState === 'running' ? <Loader2 size={12} className="text-clay animate-spin" /> : <Zap size={12} className="text-clay" />}
          <span>NODE: {activeNode ? activeNode : 'IDLE'}</span>
        </div>

        <button 
          onClick={exportBuild}
          disabled={flowState !== 'completed'}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-clay hover:bg-[#A34629] text-white text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(204,88,51,0.3)] disabled:opacity-50 disabled:pointer-events-none"
        >
          <Download size={14} />
          <span>Export Build</span>
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button 
          onClick={() => setActiveView('settings')}
          className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors overflow-hidden relative"
        >
          <Image src="https://picsum.photos/seed/avatar/100/100" alt="User Avatar" fill className="object-cover" referrerPolicy="no-referrer" />
        </button>
      </div>
    </motion.header>
  );
}
