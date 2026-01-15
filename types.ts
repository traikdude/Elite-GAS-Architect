export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  isError?: boolean;
  timestamp: number;
}

export interface HotkeyNode {
  code: string;
  title: string;
  description?: string;
  children?: HotkeyNode[];
}

export enum ViewState {
  CHAT = 'CHAT',
  REFERENCE = 'REFERENCE',
  TROUBLESHOOT = 'TROUBLESHOOT',
  TEMPLATES = 'TEMPLATES'
}

export interface ScriptTemplate {
  title: string;
  code: string;
  description: string;
  tags: string[];
}