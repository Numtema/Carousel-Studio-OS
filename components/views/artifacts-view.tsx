'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Archive, FileJson, FileCode, FileImage, Download, Eye, RefreshCw, Code, X } from 'lucide-react';
import { useFlowStore, Artifact } from '@/store/flow-store';

export function ArtifactsView() {
  const { artifacts } = useFlowStore();
  const [viewingArtifact, setViewingArtifact] = useState<Artifact | null>(null);

  const handleDownload = (artifact: Artifact) => {
    if (!artifact.content) return;
    const blob = new Blob([artifact.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = artifact.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col gap-6 max-w-4xl mx-auto relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Archive className="text-clay" />
            Artifact Registry
          </h2>
          <p className="text-text-secondary text-sm mt-1">Timeline of generated outputs for current flow.</p>
        </div>
      </div>

      <div className="flex-1 bg-surface rounded-[3rem] border border-border p-8 shadow-lg overflow-y-auto no-scrollbar relative">
        <div className="absolute left-12 top-12 bottom-12 w-px bg-border" />

        <div className="space-y-8 relative z-10">
          {artifacts.length === 0 && (
            <div className="text-text-secondary text-center mt-10">No artifacts generated yet. Start a flow in the Studio.</div>
          )}
          {artifacts.map((artifact, i) => (
            <motion.div
              key={artifact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-6 group"
            >
              {/* Timeline Node */}
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border z-10">
                <div className={`w-2 h-2 rounded-full ${artifact.status === 'success' ? 'bg-moss' : artifact.status === 'error' ? 'bg-red-500' : 'bg-clay animate-pulse'}`} />
              </div>

              {/* Artifact Card */}
              <div className="flex-1 bg-background rounded-2xl border border-border p-4 flex items-center justify-between hover:border-text-secondary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center border border-border">
                    {artifact.type === 'json' && <FileJson size={20} className="text-text-secondary" />}
                    {artifact.type === 'markdown' && <FileCode size={20} className="text-text-secondary" />}
                    {artifact.type === 'folder' && <FileImage size={20} className="text-text-secondary" />}
                    {artifact.type === 'zip' && <Archive size={20} className="text-text-secondary" />}
                    {artifact.type === 'html' && <Code size={20} className="text-text-secondary" />}
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-medium">{artifact.name}</h3>
                    <p className="text-xs text-text-secondary mt-1">{artifact.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {artifact.content && (
                    <button 
                      onClick={() => setViewingArtifact(artifact)}
                      className="p-2 rounded-full bg-surface hover:bg-background border border-transparent hover:border-border text-text-secondary hover:text-text-primary transition-colors" 
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  {artifact.content && (
                    <button 
                      onClick={() => handleDownload(artifact)}
                      className="p-2 rounded-full bg-surface hover:bg-background border border-transparent hover:border-border text-text-secondary hover:text-text-primary transition-colors" 
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                  )}
                  <button className="p-2 rounded-full bg-surface hover:bg-background border border-transparent hover:border-border text-text-secondary hover:text-text-primary transition-colors" title="Regenerate">
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Artifact Viewer Modal */}
      <AnimatePresence>
        {viewingArtifact && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border rounded-[2rem] w-full max-w-4xl max-h-full flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-background/50">
                <div className="flex items-center gap-3">
                  <FileCode size={20} className="text-clay" />
                  <h3 className="font-mono font-medium">{viewingArtifact.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownload(viewingArtifact)}
                    className="p-2 rounded-full hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <Download size={18} />
                  </button>
                  <button 
                    onClick={() => setViewingArtifact(null)}
                    className="p-2 rounded-full hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6 bg-background">
                <pre className="text-sm font-mono text-text-secondary whitespace-pre-wrap break-words">
                  {viewingArtifact.content}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
