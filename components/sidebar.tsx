'use client';

import { useAppStore, ViewType } from '@/store/app-store';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  GitBranch, 
  Layers, 
  Archive, 
  FileText, 
  Folder, 
  UploadCloud, 
  Sliders,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'studio', label: 'Studio', icon: Sparkles },
  { id: 'flows', label: 'Flows', icon: GitBranch },
  { id: 'components', label: 'Components', icon: Layers },
  { id: 'artifacts', label: 'Artifacts', icon: Archive },
  { id: 'templates', label: 'Templates', icon: FileText },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'exports', label: 'Exports', icon: UploadCloud },
  { id: 'settings', label: 'Settings', icon: Sliders },
];

export function Sidebar() {
  const { activeView, setActiveView, isSidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarCollapsed ? 80 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-[calc(100vh-2rem)] bg-surface/80 backdrop-blur-xl border border-border rounded-[2.5rem] m-4 p-4 shadow-2xl overflow-hidden z-50"
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between mb-8 px-2 mt-2">
        {!isSidebarCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xl font-bold tracking-tight text-text-primary"
          >
            CAROUSEL<span className="font-light text-text-secondary">OS</span>
          </motion.div>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-background transition-colors text-text-secondary hover:text-text-primary"
        >
          {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "relative flex items-center w-full p-3 rounded-2xl transition-all duration-300 group",
                isActive ? "text-text-primary bg-background" : "text-text-secondary hover:text-text-primary hover:bg-background"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-clay rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="flex items-center justify-center w-8 h-8">
                <Icon size={20} className={cn("transition-transform duration-300 group-hover:scale-110", isActive && "text-clay")} />
              </div>
              
              {!isSidebarCollapsed && (
                <span className="ml-3 font-medium text-sm">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </motion.aside>
  );
}
