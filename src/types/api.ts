export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StreamResponse {
  id: string;
  content: string;
  isComplete: boolean;
  timestamp: string;
}

export interface RateLimitInfo {
  remaining: number;
  reset: number;
  limit: number;
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    gemini: boolean;
    database: boolean;
    voice: boolean;
  };
}

export interface VoiceProcessRequest {
  audioData: string;
  language?: string;
  format?: 'webm' | 'wav' | 'mp3';
}

export interface VoiceProcessResponse {
  text: string;
  confidence: number;
  language: string;
}
