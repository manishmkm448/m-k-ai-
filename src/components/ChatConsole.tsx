import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Terminal,
  Cpu,
  Sparkles,
  Wifi,
  WifiOff,
  ShieldCheck,
  Trash2,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { ArcReactor } from './ArcReactor';
import { ConversationItem, MessageItem, UserAccount, AIMode } from '../types';
import { api } from '../services/api';

interface ChatConsoleProps {
  user: UserAccount;
  activeConversation: ConversationItem | null;
  onRefreshConversations: () => void;
  onSelectConversation: (conv: ConversationItem) => void;
  onRequestAutomation: (actionType: string, target?: string) => void;
}

export const ChatConsole: React.FC<ChatConsoleProps> = ({
  user,
  activeConversation,
  onRefreshConversations,
  onSelectConversation,
  onRequestAutomation,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [currentProvider, setCurrentProvider] = useState<string>('gemini');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<'hi-IN' | 'en-US'>('en-US');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<{ name: string; base64: string; mimeType: string } | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [reactorStatus, setReactorStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking' | 'offline'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      setMessages(activeConversation.messages || []);
    } else {
      setMessages([
        {
          id: 'welcome_msg',
          role: 'assistant',
          content: `**Namaste ${user.displayName}! M.K AI system initialized.**\n\nI am your sovereign personal AI ecosystem created exclusively by **Manish Meena** (*Your Intelligence. Your Control.*).\n\n• **Platform Node:** ${user.devicePlatform.toUpperCase()} (${user.deviceName})\n• **Active AI Mode:** ${user.preferences.aiMode.toUpperCase()}\n• **Memory Vault:** Synchronized & isolated strictly to this account\n• **Languages:** Fluent English, Hindi (हिंदी), and natural Hinglish.\n\nCommand me to automate tasks, scan network ports, index documents, write code, or query planetary intelligence.`,
          timestamp: new Date().toISOString(),
          providerUsed: user.preferences.aiMode === 'offline' ? 'ollama' : 'gemini',
          modelUsed: user.preferences.aiMode === 'offline' ? 'local-offline' : user.preferences.geminiModel,
        },
      ]);
    }
  }, [activeConversation, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamBuffer]);

  // Web Speech API Voice Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setReactorStatus('listening');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);

        // Wake word trigger
        if (transcript.toLowerCase().includes('mk ai') || transcript.toLowerCase().includes('m.k ai')) {
          console.log('[Wake Word Detected] M.K AI triggered via voice');
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
        setReactorStatus('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
        setReactorStatus('idle');
      };

      recognitionRef.current = recognition;
    }
  }, [speechLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome/Edge or type text.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setReactorStatus('idle');
    } else {
      try {
        recognitionRef.current.lang = speechLanguage;
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Text-To-Speech Synthesis
  const speakText = (text: string, msgId: string) => {
    if (!window.speechSynthesis) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      setReactorStatus('idle');
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown before speaking
    const cleanText = text
      .replace(/[*#`_\[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .slice(0, 400);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = user.preferences.speechSpeed || 1.0;
    utterance.pitch = user.preferences.speechPitch || 1.0;
    utterance.volume = user.preferences.speechVolume || 1.0;

    // Pick Hindi or English voice if available
    const voices = window.speechSynthesis.getVoices();
    const isHindiText = /[\u0900-\u097F]/.test(text) || user.preferences.language === 'hi';
    const matchingVoice = voices.find((v) =>
      isHindiText ? v.lang.includes('hi') || v.lang.includes('IN') : v.lang.includes('en')
    );
    if (matchingVoice) utterance.voice = matchingVoice;

    utterance.onstart = () => {
      setSpeakingMessageId(msgId);
      setReactorStatus('speaking');
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
      setReactorStatus('idle');
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
      setReactorStatus('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content && !attachment) return;

    // If attachment exists, handle vision query
    if (attachment) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_u_${Date.now()}`,
          role: 'user',
          content: content || 'Analyze this attached image file.',
          timestamp: new Date().toISOString(),
          attachments: [{ type: 'image', name: attachment.name, data: attachment.base64 }],
        },
      ]);
      setInputText('');
      const att = attachment;
      setAttachment(null);
      setIsStreaming(true);
      setReactorStatus('thinking');

      try {
        const res = await api.analyzeVision(att.base64, content, att.mimeType);
        const assistantMsg: MessageItem = {
          id: `msg_a_${Date.now()}`,
          role: 'assistant',
          content: res.analysis,
          timestamp: new Date().toISOString(),
          providerUsed: 'gemini',
          modelUsed: 'gemini-3.8-flash-vision',
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (autoSpeak) speakText(res.analysis, assistantMsg.id);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_err_${Date.now()}`,
            role: 'assistant',
            content: `Vision error: ${err.message}`,
            timestamp: new Date().toISOString(),
            providerUsed: 'local_fallback',
          },
        ]);
      } finally {
        setIsStreaming(false);
        setReactorStatus('idle');
      }
      return;
    }

    // Normal text message
    const userMsg: MessageItem = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsStreaming(true);
    setStreamBuffer('');
    setReactorStatus('thinking');

    await api.sendChatMessageStream({
      conversationId: activeConversation?.id,
      message: content,
      requestedMode: user.preferences.aiMode,
      requestedProvider: user.preferences.primaryProvider,
      onChunk: (chunk) => {
        setStreamBuffer((prev) => prev + chunk);
      },
      onDone: ({ message, conversationId }) => {
        setStreamBuffer('');
        setIsStreaming(false);
        setReactorStatus('idle');
        setMessages((prev) => [...prev, message]);
        onRefreshConversations();
        if (autoSpeak) speakText(message.content, message.id);
      },
      onError: (errMsg) => {
        setIsStreaming(false);
        setStreamBuffer('');
        setReactorStatus('idle');
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_err_${Date.now()}`,
            role: 'assistant',
            content: `⚠️ Protocol issue: ${errMsg}`,
            timestamp: new Date().toISOString(),
            providerUsed: 'local_fallback',
          },
        ]);
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAttachment({
        name: file.name,
        base64,
        mimeType: file.type || 'image/jpeg',
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/90 relative overflow-hidden">
      {/* Top Protocol Status Bar */}
      <div className="h-12 border-b border-cyan-950/60 bg-slate-900/60 backdrop-blur-md px-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider text-cyan-300 font-display">
              {activeConversation ? activeConversation.title : 'DEFAULT QUANTUM BUFFER'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 font-mono">
            {user.preferences.aiMode === 'offline' ? (
              <>
                <WifiOff className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-bold">OFFLINE LOCAL</span>
              </>
            ) : user.preferences.primaryProvider === 'groq' ? (
              <>
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400 font-bold">GROQ LPU CLOUD</span>
              </>
            ) : user.preferences.primaryProvider === 'gemini' ? (
              <>
                <Wifi className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-400 font-bold">ONLINE GEMINI 3.8</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span className="text-blue-300 font-bold">AUTO SOVEREIGN</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Auto-Speak Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors border ${
              autoSpeak
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title="Auto-speak incoming messages"
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden md:inline text-[11px]">Auto TTS</span>
          </button>

          {/* Language Selector */}
          <select
            value={speechLanguage}
            onChange={(e) => setSpeechLanguage(e.target.value as any)}
            className="bg-slate-900 border border-slate-700/80 rounded px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="en-US">English (US)</option>
            <option value="hi-IN">Hindi (हिंदी / Hinglish)</option>
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {/* Arc Reactor Visualizer Header in Empty / Fresh State */}
        {messages.length <= 1 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ArcReactor
              status={reactorStatus}
              mode={user.preferences.aiMode}
              isAudioActive={isListening || speakingMessageId !== null}
              size="md"
            />
            <h2 className="text-lg font-bold text-slate-100 mt-4 tracking-wider font-display">
              M.K AI PROTOCOL MATRIX
            </h2>
            <p className="text-xs text-cyan-400/80 font-mono mt-1">
              Your Intelligence. Your Control. — Created by Manish Meena
            </p>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 max-w-xl w-full text-left">
              {[
                { label: 'Hindi / Hinglish Greeting', query: 'Namaste M.K AI! Aaj ka system status bataiye.' },
                { label: 'Full System Diagnostic', query: 'Run complete system diagnostic on this node.' },
                { label: 'Kali Linux Cyber Scan', query: 'Simulate Kali Linux port audit on target 127.0.0.1' },
                { label: 'Private Memory Query', query: 'List my private memory records and creator facts.' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.query)}
                  className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all text-xs group text-left"
                >
                  <div className="text-cyan-400 font-semibold group-hover:text-cyan-300 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    {item.label}
                  </div>
                  <div className="text-slate-400 text-[11px] truncate mt-0.5">{item.query}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render Conversation Messages */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-4xl mx-auto w-full`}
            >
              {/* Message Header Info */}
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-slate-400">
                <span className={isUser ? 'text-slate-300 font-semibold' : 'text-cyan-400 font-semibold flex items-center gap-1'}>
                  {!isUser && <Sparkles className="w-3 h-3 text-cyan-400" />}
                  {isUser ? user.displayName : 'M.K AI'}
                </span>
                <span>•</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                {!isUser && msg.providerUsed && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase flex items-center gap-1 ${
                      msg.providerUsed === 'groq'
                        ? 'bg-amber-950/70 text-amber-300 border border-amber-800/40'
                        : msg.providerUsed === 'gemini'
                        ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/40'
                        : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40'
                    }`}
                  >
                    {msg.providerUsed === 'groq' ? (
                      <>
                        <Zap className="w-2.5 h-2.5 text-amber-400" />
                        <span>Groq LPU ({msg.modelUsed || 'Llama 3.3'})</span>
                      </>
                    ) : msg.providerUsed === 'gemini' ? (
                      <>
                        <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                        <span>Gemini 3.8</span>
                      </>
                    ) : (
                      'Offline Engine'
                    )}
                  </span>
                )}
              </div>

              {/* Message Bubble Card */}
              <div
                className={`relative group rounded-2xl px-5 py-4 max-w-[90%] md:max-w-[80%] leading-relaxed shadow-lg transition-all ${
                  isUser
                    ? 'bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/80 text-slate-100 rounded-tr-xs'
                    : 'bg-slate-900/90 border border-cyan-500/25 text-slate-100 rounded-tl-xs glow-cyan/10'
                }`}
              >
                {/* Image Attachment Preview if user sent image */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mb-3">
                    {msg.attachments.map((att, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-slate-700 max-w-xs">
                        <img src={att.data} alt={att.name} className="w-full h-auto object-cover max-h-48" />
                        <div className="text-[10px] p-1 bg-slate-950 text-slate-400 truncate">{att.name}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Content Body */}
                <div className="whitespace-pre-wrap text-sm md:text-base selection:bg-cyan-500/30">
                  {msg.content}
                </div>

                {/* Automation Action Badge / Card */}
                {msg.automationAction && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-950/80 border border-cyan-500/40 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        SYSTEM ACTION: {msg.automationAction.actionType.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          msg.automationAction.status === 'executed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/40'
                            : 'bg-amber-950 text-amber-400 border border-amber-700/40'
                        }`}
                      >
                        {msg.automationAction.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-mono bg-slate-900 p-2 rounded border border-slate-800">
                      <code>{msg.automationAction.command}</code>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          onRequestAutomation(
                            msg.automationAction!.actionType,
                            msg.automationAction!.command
                          )
                        }
                        className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        Execute Directive
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Toolbar on Hover */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speakText(msg.content, msg.id)}
                        className={`p-1.5 rounded hover:bg-slate-800 hover:text-cyan-300 transition-colors flex items-center gap-1 ${
                          speakingMessageId === msg.id ? 'text-cyan-400 bg-cyan-950/60' : ''
                        }`}
                        title="Speak Message via TTS"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">
                          {speakingMessageId === msg.id ? 'Speaking...' : 'Listen'}
                        </span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="p-1.5 rounded hover:bg-slate-800 hover:text-cyan-300 transition-colors flex items-center gap-1"
                        title="Copy to Clipboard"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[11px] text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono">
                      Isolated Node: {user.devicePlatform.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Streaming Buffer Render */}
        {isStreaming && (
          <div className="flex flex-col items-start max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-cyan-400">
              <span className="animate-spin text-cyan-400">⚡</span>
              <span>SYNTHESIZING DIRECTIVE...</span>
            </div>
            <div className="rounded-2xl rounded-tl-xs px-5 py-4 max-w-[85%] bg-slate-900/90 border border-cyan-500/40 text-slate-100 glow-cyan">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {streamBuffer || 'Engaging sovereign neural routing...'}
                <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse align-middle" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview Chip */}
      {attachment && (
        <div className="px-4 py-2 bg-slate-900 border-t border-cyan-900/50 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <img src={attachment.base64} alt="preview" className="w-8 h-8 rounded object-cover border border-cyan-500" />
            <span className="text-xs text-slate-200 font-mono truncate max-w-xs">{attachment.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Vision Multi-modal Ready
            </span>
          </div>
          <button
            onClick={() => setAttachment(null)}
            className="text-slate-400 hover:text-red-400 p-1 text-xs"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Input Deck */}
      <div className="p-3 sm:p-4 bg-slate-900/80 border-t border-cyan-950/80 backdrop-blur-md z-10 shrink-0">
        <div className="max-w-4xl mx-auto flex items-end gap-2 bg-slate-950 rounded-2xl border border-cyan-500/30 p-2 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
            title="Attach Image for Vision / OCR"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Voice Input Microphone */}
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-900'
            }`}
            title={isListening ? 'Stop Listening' : 'Speak Directive (Hindi/English)'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              isListening
                ? 'Listening to speech...'
                : user.preferences.language === 'hi'
                ? 'M.K AI ko aadesh dijiye (Hindi / Hinglish)...'
                : 'Transmit command to M.K AI (Hindi / English / Hinglish)...'
            }
            rows={1}
            className="flex-1 bg-transparent border-0 text-sm text-slate-100 placeholder-slate-500 resize-none py-2 px-1 focus:outline-none min-h-[38px] max-h-32"
          />

          {/* Transmit / Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={(!inputText.trim() && !attachment) || isStreaming}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md shadow-cyan-500/20"
            title="Transmit Directive"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Micro-footer credentials */}
        <div className="max-w-4xl mx-auto flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2 px-2">
          <span>CREATOR: MANISH MEENA • TAGLINE: YOUR INTELLIGENCE. YOUR CONTROL.</span>
          <span className="hidden sm:inline">ZERO TELEMETRY LEAKAGE GUARANTEED</span>
        </div>
      </div>
    </div>
  );
};
