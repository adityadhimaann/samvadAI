// Environment configuration with validation
export const config = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY!,
    model: 'gemini-1.5-flash',
    maxTokens: 4096,
    temperature: 0.7,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    environment: process.env.NODE_ENV || 'development',
  },
  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  security: {
    encryptionSecret: process.env.ENCRYPTION_SECRET,
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
  voice: {
    maxRecordingTime: 300000, // 5 minutes
    supportedFormats: ['webm', 'wav', 'mp3'],
  },
} as const;

// Validate required environment variables
export function validateConfig() {
  const requiredVars = [
    'GEMINI_API_KEY',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Default AI personality settings
export const defaultPersonality = {
  mode: 'helpful' as const,
  responseStyle: 'conversational' as const,
  language: 'hinglish' as const,
};

// Default voice settings
export const defaultVoiceSettings = {
  isEnabled: false,
  language: 'hinglish' as const,
  rate: 1,
  pitch: 1,
  volume: 0.8,
};

// Chat configuration defaults
export const chatDefaults = {
  maxMessages: 1000,
  autoScroll: true,
  showTimestamps: true,
  enableVoice: false,
  personality: defaultPersonality,
  voiceSettings: defaultVoiceSettings,
  // New default settings
  animationSpeed: 'normal' as const,
  voiceLanguage: 'en-US',
  autoSubmitVoice: false,
};
