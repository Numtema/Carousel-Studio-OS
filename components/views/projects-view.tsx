'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolderKanban, Plus, Clock, ArrowRight, CheckCircle2, X, Sparkles, Loader2 } from 'lucide-react';
import { useAppStore, Project } from '@/store/app-store';

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'Numtema Carousel Series', status: 'Active', updated: '2 hours ago', flows: 12 },
  { id: '2', name: 'Product Launch Teaser', status: 'Paused', updated: '3 days ago', flows: 4 },
  { id: '3', name: 'Educational Guide', status: 'Completed', updated: '1 week ago', flows: 8 },
  { id: '4', name: 'Client Case Study', status: 'Active', updated: '4 hours ago', flows: 22 },
];

export function ProjectsView() {
  const { activeProject, setActiveProject } = useAppStore();
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectPrompt, setNewProjectPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateProject = async () => {
    if (!newProjectPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectPrompt.split(' ').slice(0, 3).join(' ') + '...', // Mock name generation
      status: 'Active',
      updated: 'Just now',
      flows: 0
    };
    
    setProjects([newProject, ...projects]);
    setActiveProject(newProject);
    setIsGenerating(false);
    setIsCreating(false);
    setNewProjectPrompt('');
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FolderKanban className="text-clay" />
            Projects
          </h2>
          <p className="text-text-secondary text-sm mt-1">Manage your creative workspaces.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-clay hover:bg-[#A34629] text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => {
            const isActive = activeProject?.id === project.id;
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveProject(project)}
                className={`group bg-surface rounded-[2rem] border p-6 transition-all cursor-pointer flex flex-col h-56 relative overflow-hidden ${
                  isActive ? 'border-clay shadow-[0_0_20px_rgba(204,88,51,0.1)]' : 'border-border hover:border-text-secondary/30'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-clay/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex justify-between items-start mb-4">
                  <span className={`text-xs font-mono uppercase tracking-widest px-2 py-1 rounded-md ${
                    project.status === 'Active' ? 'bg-moss/20 text-moss border border-moss/30' :
                    project.status === 'Completed' ? 'bg-text-primary/10 text-text-primary border border-text-primary/20' :
                    'bg-text-secondary/10 text-text-secondary border border-text-secondary/20'
                  }`}>
                    {project.status}
                  </span>
                  
                  {isActive && (
                    <CheckCircle2 size={20} className="text-clay" />
                  )}
                </div>
                
                <h3 className={`relative z-10 text-xl font-bold mb-2 transition-colors ${isActive ? 'text-clay' : 'group-hover:text-clay'}`}>
                  {project.name}
                </h3>
                
                <div className="relative z-10 mt-auto flex flex-col gap-2 text-sm text-text-secondary">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>Updated {project.updated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FolderKanban size={14} />
                    <span>{project.flows} Flows Generated</span>
                  </div>
                </div>

                <div className={`absolute bottom-6 right-6 transition-all ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${isActive ? 'bg-clay' : 'bg-surface border border-border text-text-primary'}`}>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-[2rem] p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsCreating(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border">
                  <Sparkles size={18} className="text-clay" />
                </div>
                <h3 className="text-2xl font-bold">Create Project</h3>
              </div>

              <p className="text-text-secondary mb-6">
                Describe the project you want to build. The AI will set up the initial workspace and context.
              </p>

              <textarea
                value={newProjectPrompt}
                onChange={(e) => setNewProjectPrompt(e.target.value)}
                placeholder="e.g., A 10-slide educational carousel about generative AI..."
                className="w-full h-32 bg-background border border-border rounded-2xl p-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-clay/50 transition-colors resize-none mb-6"
              />

              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-3 rounded-full font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateProject}
                  disabled={!newProjectPrompt.trim() || isGenerating}
                  className="px-6 py-3 bg-clay hover:bg-[#A34629] text-white rounded-full font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Create Workspace
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
