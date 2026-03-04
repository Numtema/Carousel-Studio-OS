'use client';

import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { useAppStore } from '@/store/app-store';
import { StudioView } from '@/components/views/studio-view';
import { FlowsView } from '@/components/views/flows-view';
import { ComponentsView } from '@/components/views/components-view';
import { ArtifactsView } from '@/components/views/artifacts-view';
import { TemplatesView } from '@/components/views/templates-view';
import { ProjectsView } from '@/components/views/projects-view';
import { SettingsView } from '@/components/views/settings-view';

export default function Home() {
  const { activeView } = useAppStore();

  const renderView = () => {
    switch (activeView) {
      case 'studio':
        return <StudioView />;
      case 'flows':
        return <FlowsView />;
      case 'components':
        return <ComponentsView />;
      case 'artifacts':
        return <ArtifactsView />;
      case 'templates':
        return <TemplatesView />;
      case 'projects':
        return <ProjectsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <div className="flex items-center justify-center h-full text-text-secondary">View not implemented yet.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 relative flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 pt-24 no-scrollbar">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
