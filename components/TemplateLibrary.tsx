import React, { useState, useMemo, useEffect } from 'react';
import { SCRIPT_TEMPLATES } from '../templates';
import { ScriptTemplate } from '../types';
import { LayoutTemplate, Search, Copy, Check, Plus, X, Save, Code } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'elite_gas_custom_templates';

interface TemplateLibraryProps {
    initialDraft?: Partial<ScriptTemplate> | null;
    onClearDraft?: () => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ initialDraft, onClearDraft }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Custom Templates State (Persisted)
  const [customTemplates, setCustomTemplates] = useState<ScriptTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load custom templates", e);
      return [];
    }
  });

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    code: ''
  });

  // Effect to handle incoming draft (from Chat "Save as Snippet")
  useEffect(() => {
    if (initialDraft) {
        setFormData({
            title: initialDraft.title || '',
            description: initialDraft.description || '',
            tags: initialDraft.tags ? initialDraft.tags.join(', ') : '',
            code: initialDraft.code || ''
        });
        setIsModalOpen(true);
        if (onClearDraft) onClearDraft();
    }
  }, [initialDraft, onClearDraft]);

  // Combine default and custom templates
  const allTemplates = useMemo(() => {
    return [...customTemplates, ...SCRIPT_TEMPLATES];
  }, [customTemplates]);

  // Extract unique tags from ALL templates
  const allTags = useMemo(() => {
    return Array.from(new Set(allTemplates.flatMap(t => t.tags))).sort();
  }, [allTemplates]);

  const filteredTemplates = allTemplates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? t.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleSave = () => {
    if (!formData.title.trim() || !formData.code.trim()) return;

    const newTemplate: ScriptTemplate = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      code: formData.code, // Keep code formatting
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    const updated = [newTemplate, ...customTemplates];
    setCustomTemplates(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    
    // Reset and Close
    setFormData({ title: '', description: '', tags: '', code: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 h-full overflow-y-auto relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
           <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <LayoutTemplate className="text-emerald-500" />
            Template Library
          </h2>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Production-ready patterns for common automation tasks. 
            Browse, create, and adapt scripts to your needs.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20"
        >
          <Plus size={18} />
          Create Template
        </button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Search templates..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
            />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
            <button 
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${!selectedTag ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
            >
                All
            </button>
            {allTags.map(tag => (
                <button 
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${tag === selectedTag ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
                >
                    {tag}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template, idx) => (
            <TemplateCard key={idx} template={template} isCustom={customTemplates.includes(template)} />
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
          <div className="text-center py-12 text-slate-500">
              <p>No templates found matching your criteria.</p>
              <button 
                onClick={() => {setSearch(''); setSelectedTag(null);}}
                className="mt-4 text-emerald-400 hover:underline"
              >
                  Clear filters
              </button>
          </div>
      )}

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-100">Create Custom Template</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Template Title *</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Slack Automatic Reporter"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Briefly describe what this script does..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="e.g., Sheets, API, Slack"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Script Code *</label>
                <div className="relative">
                  <textarea 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="// Paste your Google Apps Script code here..."
                    className="w-full h-64 bg-[#0d1117] border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 resize-y"
                  />
                  <Code className="absolute right-4 top-4 text-slate-700" size={20} />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-2xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={!formData.title.trim() || !formData.code.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                <Save size={18} />
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TemplateCard: React.FC<{ template: ScriptTemplate, isCustom?: boolean }> = ({ template, isCustom }) => {
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(template.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div 
            onClick={() => setExpanded(!expanded)}
            className={`bg-slate-800/50 border ${isCustom ? 'border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]' : 'border-slate-700'} rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all cursor-pointer group flex flex-col ${expanded ? 'row-span-2 shadow-2xl bg-slate-800' : ''}`}
        >
            <div className="p-5 flex-1 relative">
                {isCustom && (
                    <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-1 rounded-bl-lg font-bold tracking-wider">
                        CUSTOM
                    </div>
                )}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors pr-6">{template.title}</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-slate-900/50 text-slate-500 border border-slate-700/50">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            
            {expanded ? (
                <div className="p-4 bg-slate-950 border-t border-slate-700 animate-in fade-in duration-200">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Source Code</span>
                         <button 
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded transition-colors"
                        >
                            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                     </div>
                     <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-3 bg-slate-900 rounded-lg border border-slate-800 max-h-60 custom-scrollbar">
                        <code>{template.code}</code>
                     </pre>
                </div>
            ) : (
                <div className="px-5 py-3 bg-slate-800/30 border-t border-slate-700/50 flex justify-between items-center group-hover:bg-slate-800/80 transition-colors">
                    <span className="text-xs text-slate-500 font-medium">Click to view code</span>
                    <button 
                        onClick={handleCopy}
                        className="text-slate-500 hover:text-emerald-400 transition-colors p-1"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check size={16} className="text-emerald-400"/> : <Copy size={16} />}
                    </button>
                </div>
            )}
        </div>
    )
}

export default TemplateLibrary;