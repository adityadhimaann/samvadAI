import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '@/lib/config';
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/utils';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({ model: config.gemini.model });

// In-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'localhost';
  return ip;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.maxRequests;

  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, reset: resetTime };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, reset: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, reset: record.resetTime };
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is properly configured
    if (!config.gemini.apiKey || config.gemini.apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gemini API key is not configured. Please add your API key to the .env.local file.',
          instructions: 'Get your API key from https://aistudio.google.com/ and add GEMINI_API_KEY=your_key_here to .env.local'
        },
        { status: 500 }
      );
    }
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    const rateLimit = checkRateLimit(rateLimitKey);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.',
          rateLimitInfo: rateLimit
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': config.rateLimit.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.reset.toString(),
          }
        }
      );
    }

    const body = await request.json();
    const { message, conversationHistory = [], personality = 'helpful' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedMessage = sanitizeInput(message);
    
    if (sanitizedMessage.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Build conversation context
    let context = '';
    if (conversationHistory.length > 0) {
      context = conversationHistory
        .slice(-10) // Keep last 10 messages for context
        .map((msg: { sender: string; content: string }) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
    }

    // Personality-based system prompt with forced Hinglish responses
    const personalityPrompts = {
      formal: 'You are a professional and formal AI assistant. Provide clear, structured responses.',
      casual: 'You are a friendly and casual AI assistant. Keep responses conversational and relaxed.',
      humorous: 'You are a witty and humorous AI assistant. Add appropriate humor to your responses while being helpful.',
      helpful: 'You are a helpful and supportive AI assistant. Focus on being useful and informative.'
    };

    const systemPrompt = `${personalityPrompts[personality as keyof typeof personalityPrompts]} 
You can understand questions in any language (English, Hindi, or any other language), but you MUST always respond in Hinglish (Hindi-English mix). 
Hinglish means mixing Hindi and English words naturally in your responses, like "Main aapki help kar sakta hun with this problem" or "Yeh bahut interesting question hai, let me explain."
No matter what language the user speaks in, always reply in Hinglish only. This is very important.
Keep responses concise but informative and natural in Hinglish style.`;

    const prompt = context 
      ? `${systemPrompt}\n\nConversation History:\n${context}\n\nUser: ${sanitizedMessage}\nAssistant:`
      : `${systemPrompt}\n\nUser: ${sanitizedMessage}\nAssistant:`;

    // Check if streaming is requested
    const isStreaming = request.headers.get('Accept') === 'text/stream';

    if (isStreaming) {
      // Streaming response
      const result = await model.generateContentStream(prompt);
      
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            let fullResponse = '';
            for await (const chunk of result.stream) {
              const text = chunk.text();
              fullResponse += text;
              const data = JSON.stringify({
                content: text,
                fullContent: fullResponse,
                isComplete: false,
                timestamp: new Date().toISOString(),
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
            
            // Send completion signal with full response
            const completeData = JSON.stringify({
              content: '',
              fullContent: fullResponse,
              isComplete: true,
              timestamp: new Date().toISOString(),
            });
            controller.enqueue(encoder.encode(`data: ${completeData}\n\n`));
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            const errorData = JSON.stringify({
              error: error instanceof Error ? error.message : 'An error occurred while generating the response',
              isComplete: true,
              timestamp: new Date().toISOString(),
            });
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-RateLimit-Limit': config.rateLimit.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.reset.toString(),
        },
      });
    } else {
      // Non-streaming response
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json(
        {
          success: true,
          data: {
            content: text,
            timestamp: new Date().toISOString(),
          },
        },
        {
          headers: {
            'X-RateLimit-Limit': config.rateLimit.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.reset.toString(),
          }
        }
      );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle specific Gemini API errors
    if (error instanceof Error && error.message.includes('API_KEY_INVALID')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid API key. Please check your Gemini API key in the .env.local file.',
          instructions: 'Get a valid API key from https://aistudio.google.com/'
        },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message.includes('QUOTA_EXCEEDED')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'API quota exceeded. Please check your Gemini API usage limits.'
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred while processing your request. Please try again.' 
      },
      { status: 500 }
    );
  }
}
