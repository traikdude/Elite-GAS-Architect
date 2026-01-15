import React, { useState } from 'react';
import { HotkeyNode } from '../types';
import { HOTKEY_DATA } from '../constants';
import { ChevronRight, ChevronDown, Copy, Hash } from 'lucide-react';

const TreeNode: React.FC<{ node: HotkeyNode; depth: number }> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(node.code);
  };

  return (
    <div className="select-none">
      <div
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
          ${isOpen ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}
          ${depth === 0 ? 'mb-2 mt-2' : ''}
        `}
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
      >
        <div className="w-4 h-4 flex items-center justify-center text-slate-500">
          {hasChildren && (
            isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          )}
        </div>
        
        <span className="font-mono text-emerald-400 font-bold min-w-[3rem]">
          {node.code}
        </span>
        
        <div className="flex-1">
          <span className="text-slate-200 font-medium">{node.title}</span>
          {node.description && (
            <span className="text-slate-500 text-sm ml-2 hidden sm:inline">
               — {node.description}
            </span>
          )}
        </div>

        <button 
          onClick={handleCopy}
          className="p-1.5 text-slate-500 hover:text-emerald-400 hover:bg-slate-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Copy Code"
        >
          <Copy size={14} />
        </button>
      </div>

      {isOpen && hasChildren && (
        <div className="border-l border-slate-700 ml-[1.1rem]">
          {node.children!.map((child) => (
            <TreeNode key={child.code} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const HotkeyReference: React.FC = () => {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <Hash className="text-emerald-500" />
          Navigation System
        </h2>
        <p className="text-slate-400 mt-2">
          Comprehensive index of Google Apps Script capabilities.
          Use these codes in the Architect chat for precise context.
        </p>
      </div>

      <div className="space-y-1">
        {HOTKEY_DATA.map((node) => (
          <TreeNode key={node.code} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
};

export default HotkeyReference;
