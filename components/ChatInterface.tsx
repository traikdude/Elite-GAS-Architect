import React, { useState, useEffect, useRef, useMemo } from 'react';
import { sendMessageStream } from '../services/geminiService';
import { ChatMessage, HotkeyNode } from '../types';
import { HOTKEY_DATA } from '../constants';
import { Send, Bot, User, RefreshCw, Copy, Check, Hash, AlertCircle, Bookmark } from 'lucide-react';

interface ChatInterfaceProps {
  onSaveSnippet: (code: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSaveSnippet }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Autocomplete State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionFilter, setSuggestionFilter] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Flatten hotkeys for search
  const allHotkeys = useMemo(() => {
    const flatten = (nodes: HotkeyNode[]): { code: string; title: string; description?: string }[] => {
        let res: { code: string; title: string; description?: string }[] = [];
        for (const node of nodes) {
            res.push({ code: node.code, title: node.title, description: node.description });
            if (node.children) {
                res = res.concat(flatten(node.children));
            }
        }
        return res;
    };
    return flatten(HOTKEY_DATA);
  }, []);

  const filteredHotkeys = useMemo(() => {
    if (!suggestionFilter) return allHotkeys.slice(0, 8);
    const lowerFilter = suggestionFilter.toLowerCase();
    return allHotkeys.filter(h => 
        h.code.toLowerCase().includes(lowerFilter) || 
        h.title.toLowerCase().includes(lowerFilter)
    ).slice(0, 8);
  }, [allHotkeys, suggestionFilter]);

  // Auto-resize textarea logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: 'init',
        role: 'model',
        content: `**Elite Apps Script Architect Online.**\n\nReady for Directive.\n\nPriority Protocols:\n1. 🟢 Direct Implementation (Low Friction)\n2. 🟡 Context Verification\n3. 🔴 Staged Delivery\n\nState your requirement or use a Hotkey (e.g., G11 for Sheets).`,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    const modelMsg: ChatMessage = {
      id: modelMsgId,
      role: 'model',
      content: '', // Start empty for streaming
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, modelMsg]);

    try {
      const stream = sendMessageStream(userMsg.content);
      
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === modelMsgId ? { ...msg, content: fullText } : msg
          )
        );
      }
    } catch (error: any) {
      console.error("Chat Interaction Error:", error);
      
      let displayError = "⚠️ Connection disrupted. System offline.";
      const errString = (error?.toString() || '').toLowerCase();
      const errMessage = (error?.message || '').toLowerCase();
      const combinedErr = errString + " " + errMessage;

      if (combinedErr.includes('api_key') || combinedErr.includes('403') || combinedErr.includes('401')) {
         displayError = "⚠️ Authorization Error: Invalid or missing API Key. Check your configuration.";
      } else if (combinedErr.includes('429') || combinedErr.includes('quota') || combinedErr.includes('resource exhausted')) {
         displayError = "⚠️ Quota Exceeded: Request limit reached. Please stand by before retrying.";
      } else if (combinedErr.includes('503') || combinedErr.includes('500') || combinedErr.includes('overloaded')) {
         displayError = "⚠️ System Overload: Neural models at capacity. Retrying recommended.";
      } else if (combinedErr.includes('fetch failed') || combinedErr.includes('network') || combinedErr.includes('connection')) {
         displayError = "⚠️ Uplink Failed: Network connection unstable or blocked.";
      } else if (combinedErr.includes('safety') || combinedErr.includes('blocked')) {
         displayError = "⚠️ Safety Protocol: Request flagged by safety filters. Refine directive.";
      } else if (errMessage) {
         displayError = `⚠️ System Error: ${error.message}`;
      }

      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === modelMsgId 
            ? { ...msg, content: displayError, isError: true } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);

    const cursor = e.target.selectionStart;
    const textBefore = val.slice(0, cursor);
    const match = textBefore.match(/(?:^|\s)#(\w*)$/);

    if (match) {
        setShowSuggestions(true);
        setSuggestionFilter(match[1]);
        setSuggestionIndex(0);
    } else {
        setShowSuggestions(false);
    }
  };

  const insertHotkey = (hotkey: { code: string }) => {
    if (!textareaRef.current) return;
    
    const cursor = textareaRef.current.selectionStart;
    const textBefore = input.slice(0, cursor);
    const match = textBefore.match(/(?:^|\s)#(\w*)$/);
    
    if (match) {
        const matchIndex = match.index! + (match[0].startsWith(' ') ? 1 : 0);
        const prefix = input.slice(0, matchIndex);
        const suffix = input.slice(cursor);
        
        // Inserting just the code without the hash, as per conventional "use a hotkey" usage
        const newValue = `${prefix}${hotkey.code} ${suffix}`;
        setInput(newValue);
        setShowSuggestions(false);
        
        // Defer focus to ensure UI updates first
        setTimeout(() => {
            const newCursorPos = prefix.length + hotkey.code.length + 1;
            textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
            textareaRef.current?.focus();
        }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && filteredHotkeys.length > 0) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSuggestionIndex(prev => (prev - 1 + filteredHotkeys.length) % filteredHotkeys.length);
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSuggestionIndex(prev => (prev + 1) % filteredHotkeys.length);
            return;
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            insertHotkey(filteredHotkeys[suggestionIndex]);
            return;
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            setShowSuggestions(false);
            return;
        }
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onSaveSnippet={onSaveSnippet} />
        ))}
        {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 ml-4 animate-pulse">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full delay-75"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full delay-150"></div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {showSuggestions && filteredHotkeys.length > 0 && (
                <div className="absolute bottom-full left-0 mb-3 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-20 flex flex-col max-h-64">
                    <div className="px-3 py-2 bg-slate-800 border-b border-slate-700 text-xs font-semibold text-slate-400 flex items-center gap-2">
                        <Hash size={12} className="text-emerald-500"/>
                        HOTKEY LIBRARY
                    </div>
                    <div className="overflow-y-auto">
                        {filteredHotkeys.map((hk, idx) => (
                            <button
                                key={hk.code}
                                onClick={() => insertHotkey(hk)}
                                className={`w-full text-left px-4 py-3 border-b border-slate-800/50 flex items-center gap-3 transition-colors ${
                                    idx === suggestionIndex 
                                        ? 'bg-emerald-500/10' 
                                        : 'hover:bg-slate-800'
                                }`}
                            >
                                <span className={`font-mono font-bold text-sm ${idx === suggestionIndex ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {hk.code}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-medium truncate ${idx === suggestionIndex ? 'text-slate-200' : 'text-slate-400'}`}>
                                        {hk.title}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Describe your automation need or type '#' for hotkeys..."
              className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl py-4 pl-4 pr-12 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none min-h-[56px] max-h-48 overflow-y-auto transition-all"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-3 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
             <span className="text-xs text-slate-600 font-mono">Elite Architect System v1.0 • Gemini Powered</span>
             <span className={`text-xs font-mono transition-colors ${input.length > 1000 ? 'text-amber-500' : 'text-slate-600'}`}>
                {input.length} chars
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for rendering messages with code blocks
const MessageBubble: React.FC<{ message: ChatMessage, onSaveSnippet: (code: string) => void }> = ({ message, onSaveSnippet }) => {
  const isUser = message.role === 'user';
  
  // Basic Markdown Parsing for Code Blocks
  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const content = part.slice(3, -3).replace(/^(javascript|js|bash|json)?\n/, '');
        return <CodeBlock key={index} code={content} onSave={onSaveSnippet} />;
      }
      // Handle bold text roughly
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <div className={`flex gap-4 max-w-4xl mx-auto ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-slate-700' 
            : message.isError 
                ? 'bg-red-900/20 text-red-500' 
                : 'bg-emerald-900/50 text-emerald-400'
      }`}>
        {isUser ? <User size={16} /> : message.isError ? <AlertCircle size={16} /> : <Bot size={16} />}
      </div>
      
      <div className={`flex-1 min-w-0 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block text-slate-200 ${
            isUser 
                ? 'bg-slate-800 rounded-2xl rounded-tr-sm py-3 px-5' 
                : message.isError 
                    ? 'bg-red-950/20 border border-red-900/40 rounded-lg p-4 text-red-300' 
                    : ''
        }`}>
           {isUser ? message.content : renderContent(message.content)}
        </div>
        <div className="text-xs text-slate-600 mt-1 font-mono">
            {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

const CodeBlock: React.FC<{ code: string, onSave: (code: string) => void }> = ({ code, onSave }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 bg-[#0d1117] rounded-lg border border-slate-700 overflow-hidden text-left">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400">script.gs</span>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => onSave(code)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                title="Save to Snippets"
            >
                <Bookmark size={14} />
                <span className="hidden sm:inline">Save</span>
            </button>
            <div className="w-px h-3 bg-slate-700"></div>
            <button 
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
            </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm text-slate-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default ChatInterface;