import React from 'react';
import { ViewState } from '../types';
import { Terminal, Book, AlertTriangle, ShieldCheck, LayoutTemplate } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: ViewState.CHAT, icon: Terminal, label: 'Architect' },
    { id: ViewState.REFERENCE, icon: Book, label: 'Reference' },
    { id: ViewState.TEMPLATES, icon: LayoutTemplate, label: 'Templates' },
    { id: ViewState.TROUBLESHOOT, icon: AlertTriangle, label: 'Debug' },
  ];

  return (
    <div className="w-20 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-6 gap-6 h-screen sticky top-0">
      <div className="mb-4">
        <ShieldCheck className="w-10 h-10 text-emerald-400" />
      </div>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`p-3 rounded-xl transition-all duration-200 group relative ${
            currentView === item.id
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <item.icon className="w-6 h-6" />
          <span className="absolute left-16 bg-slate-800 text-slate-200 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Sidebar;