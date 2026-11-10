export type DevicePlatform = 'windows' | 'kali' | 'android' | 'ios' | 'web';

export type AIMode = 'online' | 'offline' | 'auto';

export type LanguagePreference = 'en' | 'hi' | 'hinglish';

export type AIProvider = 'gemini' | 'groq' | 'ollama' | 'auto';

export interface UserPreferences {
  language: LanguagePreference;
  aiMode: AIMode;
  primaryProvider: AIProvider;
  geminiModel: string;
  groqModel: string;
  ollamaEndpoint: string;
  ollamaModel: string;
  speechSpeed: number;
  speechVolume: number;
  speechPitch: number;
  voiceGender: 'female' | 'male';
  wakeWordEnabled: boolean;
  streamResponses: boolean;
  holographicTheme: 'cyan' | 'blue' | 'emerald' | 'amber';
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  displayName: string;
  devicePlatform: DevicePlatform;
  deviceName: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLoginAt: string;
  preferences: UserPreferences;
  customInstructions: string;
}

export interface MemoryItem {
  id: string;
  userId: string;
  category: 'fact' | 'preference' | 'instruction' | 'context' | 'project';
  key: string;
  value: string;
  confidence: number;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationAction {
  actionType: string;
  command: string;
  status: 'pending' | 'approved' | 'executed' | 'cancelled';
  result?: string;
  description?: string;
}

export interface MessageItem {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  providerUsed?: 'gemini' | 'groq' | 'ollama' | 'local_fallback';
  modelUsed?: string;
  citations?: Array<{ title: string; url: string; snippet: string }>;
  attachments?: Array<{ type: string; name: string; url?: string; data?: string }>;
  automationAction?: AutomationAction;
}

export interface ConversationItem {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: MessageItem[];
  pinned?: boolean;
}

export interface PluginItem {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  enabled: boolean;
  permissions: string[];
  config: Record<string, any>;
}

export interface SystemStatus {
  cpuUsage: number;
  ramUsage: string;
  battery: number;
  isCharging: boolean;
  activePlatform: DevicePlatform;
  onlineApiStatus: 'connected' | 'offline' | 'checking';
  offlineEngineStatus: 'ready' | 'simulated' | 'disconnected';
  memoryCount: number;
}
