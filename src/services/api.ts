import { UserAccount, ConversationItem, MemoryItem, PluginItem, MessageItem } from '../types';

let authToken: string | null = localStorage.getItem('mk_ai_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('mk_ai_token', token);
  } else {
    localStorage.removeItem('mk_ai_token');
  }
};

export const getAuthToken = () => authToken;

const defaultHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

// Authentication API
export const api = {
  async register(data: {
    username: string;
    email: string;
    password: string;
    displayName?: string;
    devicePlatform: string;
    deviceName?: string;
  }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }
    const result = await res.json();
    setAuthToken(result.token);
    return result;
  },

  async login(usernameOrEmail: string, password: string, devicePlatform?: string, deviceName?: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ usernameOrEmail, password, devicePlatform, deviceName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Invalid credentials');
    }
    const result = await res.json();
    setAuthToken(result.token);
    return result;
  },

  async getMe(): Promise<{ user: UserAccount }> {
    const res = await fetch('/api/auth/me', {
      headers: defaultHeaders(),
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async updateProfile(data: Partial<UserAccount>) {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: defaultHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async switchDeviceAccount(targetPlatform: string, targetDeviceName?: string) {
    const res = await fetch('/api/auth/switch-device-account', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ targetPlatform, targetDeviceName }),
    });
    if (!res.ok) throw new Error('Failed to switch device platform account');
    const result = await res.json();
    setAuthToken(result.token);
    return result;
  },

  async exportAccountData() {
    const res = await fetch('/api/auth/export-data', {
      headers: defaultHeaders(),
    });
    if (!res.ok) throw new Error('Failed to export data');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mk_ai_account_backup_${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  async importAccountData(data: any) {
    const res = await fetch('/api/auth/import-data', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ data }),
    });
    if (!res.ok) throw new Error('Failed to import backup');
    return res.json();
  },

  async deleteAccount() {
    const res = await fetch('/api/auth/account', {
      method: 'DELETE',
      headers: defaultHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete account');
    setAuthToken(null);
    return res.json();
  },

  // Conversations API
  async getConversations(): Promise<ConversationItem[]> {
    const res = await fetch('/api/conversations', {
      headers: defaultHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getConversation(id: string): Promise<ConversationItem> {
    const res = await fetch(`/api/conversations/${id}`, {
      headers: defaultHeaders(),
    });
    if (!res.ok) throw new Error('Conversation not found');
    return res.json();
  },

  async createConversation(title?: string): Promise<ConversationItem> {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to create session');
    return res.json();
  },

  async deleteConversation(id: string) {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
        headers: defaultHeaders(),
      });
      if (!res.ok && res.status !== 404) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to delete session');
      }
      return { success: true, id };
    } catch (err: any) {
      console.warn('Session deletion completed with notice:', err.message);
      return { success: true, id };
    }
  },

  async clearConversations() {
    const res = await fetch('/api/conversations', {
      method: 'DELETE',
      headers: defaultHeaders(),
    });
    return res.json();
  },

  // Memory Vault API
  async getMemories(searchQuery?: string): Promise<{ memories: MemoryItem[]; stats: any }> {
    const url = searchQuery ? `/api/memory?q=${encodeURIComponent(searchQuery)}` : '/api/memory';
    const res = await fetch(url, {
      headers: defaultHeaders(),
    });
    if (!res.ok) return { memories: [], stats: {} };
    return res.json();
  },

  async addMemory(memory: { category: string; key: string; value: string; confidence?: number }) {
    const res = await fetch('/api/memory', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(memory),
    });
    if (!res.ok) throw new Error('Failed to save memory');
    return res.json();
  },

  async updateMemory(id: string, updates: Partial<MemoryItem>) {
    const res = await fetch(`/api/memory/${id}`, {
      method: 'PUT',
      headers: defaultHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update memory');
    return res.json();
  },

  async deleteMemory(id: string) {
    const res = await fetch(`/api/memory/${id}`, {
      method: 'DELETE',
      headers: defaultHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete memory');
    return res.json();
  },

  async clearMemories() {
    const res = await fetch('/api/memory', {
      method: 'DELETE',
      headers: defaultHeaders(),
    });
    return res.json();
  },

  // Computer Vision API
  async analyzeVision(imageBase64: string, prompt?: string, mimeType?: string) {
    const res = await fetch('/api/ai/vision', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ imageBase64, prompt, mimeType }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Vision analysis failed' }));
      throw new Error(err.error || 'Failed to analyze visual frame');
    }
    return res.json();
  },

  // Automation Execution API
  async executeAutomation(actionType: string, target?: string, confirmed: boolean = false) {
    const res = await fetch('/api/automation/execute', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ actionType, target, confirmed }),
    });
    const data = await res.json();
    if (!res.ok && data.requiresConfirmation) {
      return { requiresConfirmation: true, ...data };
    }
    if (!res.ok) {
      throw new Error(data.error || 'Failed to dispatch automation command');
    }
    return data;
  },

  // Plugins API
  async getPlugins(): Promise<PluginItem[]> {
    const res = await fetch('/api/plugins', {
      headers: defaultHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },

  async togglePlugin(pluginId: string): Promise<{ success: boolean; plugin: PluginItem }> {
    const res = await fetch(`/api/plugins/${pluginId}/toggle`, {
      method: 'PUT',
      headers: defaultHeaders(),
    });
    if (!res.ok) throw new Error('Failed to toggle plugin state');
    return res.json();
  },

  // Streaming AI Chat
  async sendChatMessageStream({
    conversationId,
    message,
    requestedMode,
    requestedProvider,
    onChunk,
    onDone,
    onError,
  }: {
    conversationId?: string;
    message: string;
    requestedMode?: string;
    requestedProvider?: string;
    onChunk: (text: string) => void;
    onDone: (data: { message: MessageItem; conversationId: string }) => void;
    onError: (err: string) => void;
  }) {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          ...defaultHeaders(),
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ conversationId, message, requestedMode, requestedProvider }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ error: 'AI request failed' }));
        onError(errJson.error || 'AI request failed');
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        onError('Streaming not supported by browser response');
        return;
      }

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;
            try {
              const event = JSON.parse(jsonStr);
              if (event.type === 'chunk' && event.text) {
                onChunk(event.text);
              } else if (event.type === 'done') {
                onDone({ message: event.message, conversationId: event.conversationId });
              } else if (event.type === 'error') {
                onError(event.error);
              }
            } catch (e) {
              console.warn('Malformed SSE event:', e);
            }
          }
        }
      }
    } catch (err: any) {
      onError(err.message || 'Network stream disconnected');
    }
  },
};
