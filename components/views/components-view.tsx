'use client';

import { motion } from 'motion/react';
import { Layers, Lock, Unlock, Activity, Zap } from 'lucide-react';
import { useFlowStore } from '@/store/flow-store';

export function ComponentsView() {
  const { slides } = useFlowStore();

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Layers className="text-clay" />
            Morsel Library
          </h2>
          <p className="text-text-secondary text-sm mt-1">Reusable, high-fidelity component artifacts.</p>
        </div>
        <button className="px-4 py-2 bg-background hover:bg-surface border border-border rounded-full text-sm font-medium transition-colors text-text-primary">
          + New Morsel
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {slides.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary">
            <Layers size={48} className="mb-4 opacity-20" />
            <p>No components extracted yet.</p>
            <p className="text-sm opacity-60">Generate a blueprint in the Studio to populate the library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((morsel, i) => (
              <motion.div
                key={morsel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-surface rounded-[2rem] border border-border p-6 hover:shadow-2xl hover:border-text-secondary/50 transition-all duration-300 flex flex-col justify-between h-64 overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">Slide {morsel.slide_number}</span>
                    <h3 className="text-xl font-bold text-text-primary">{morsel.headline.substring(0, 30)}...</h3>
                  </div>
                  <button className="p-2 rounded-full bg-background text-text-secondary hover:text-text-primary transition-colors">
                    <Unlock size={16} />
                  </button>
                </div>

                <div className="relative z-10 flex flex-col gap-3 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Activity size={14} className="text-clay" />
                    <span>Interaction: High</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Zap size={14} className="text-moss" />
                    <span>Animation: Standard</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
