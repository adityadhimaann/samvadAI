export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  isTyping?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  isVoiceMode: boolean;
  theme: 'light' | 'dark';
}

export interface VoiceSettings {
  isEnabled: boolean;
  language: 'en' | 'hi' | 'hinglish';
  rate: number;
  pitch: number;
  volume: number;
}

export interface AIPersonality {
  mode: 'formal' | 'casual' | 'humorous' | 'helpful';
  responseStyle: 'concise' | 'detailed' | 'conversational';
  language: 'en' | 'hi' | 'hinglish';
}

export interface ChatConfig {
  maxMessages: number;
  autoScroll: boolean;
  showTimestamps: boolean;
  enableVoice: boolean;
  personality: AIPersonality;
  voiceSettings: VoiceSettings;
  // New settings for enhanced functionality
  animationSpeed: 'slow' | 'normal' | 'fast';
  voiceLanguage: string;
  autoSubmitVoice: boolean;
}
