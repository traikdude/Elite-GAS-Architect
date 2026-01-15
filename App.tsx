import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import HotkeyReference from './components/HotkeyReference';
import Troubleshooter from './components/Troubleshooter';
import TemplateLibrary from './components/TemplateLibrary';
import { ViewState, ScriptTemplate } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.CHAT);
  const [draftTemplate, setDraftTemplate] = useState<Partial<ScriptTemplate> | null>(null);

  const handleSaveSnippet = (code: string) => {
    setDraftTemplate({
      title: "New Snippet",
      code: code,
      description: "Saved from chat conversation.",
      tags: ["Snippet"]
    });
    setCurrentView(ViewState.TEMPLATES);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-emerald-500/30">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">
              ELITE <span className="text-emerald-500">APPS SCRIPT</span> ARCHITECT
            </h1>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
              Unified Development System
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500">
             <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                System Active
             </div>
             <span>v1.0.0</span>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {currentView === ViewState.CHAT && (
            <ChatInterface onSaveSnippet={handleSaveSnippet} />
          )}
          {currentView === ViewState.REFERENCE && <HotkeyReference />}
          {currentView === ViewState.TEMPLATES && (
            <TemplateLibrary 
              initialDraft={draftTemplate} 
              onClearDraft={() => setDraftTemplate(null)} 
            />
          )}
          {currentView === ViewState.TROUBLESHOOT && <Troubleshooter />}
        </div>
      </main>
    </div>
  );
};

export default App;