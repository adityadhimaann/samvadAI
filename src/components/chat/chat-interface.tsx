import React from 'react';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { useChatStore } from '@/store/chat';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { WelcomeScreen } from './welcome-screen';

interface ChatInterfaceProps {
  className?: string;
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const { 
    addMessage, 
    updateMessage, 
    setLoading, 
    setError, 
    isLoading,
    error,
    getCurrentConversation,
    createConversation,
    config 
  } = useChatStore();

  const currentConversation = getCurrentConversation();
  const hasMessages = currentConversation?.messages && currentConversation.messages.length > 0;

  const handleSendMessage = async (content: string) => {
    try {
      setError(null);
      setLoading(true);

      // Create conversation if none exists
      if (!currentConversation) {
        createConversation('New Chat');
      }

      // Add user message
      const userMessageId = addMessage({
        content,
        sender: 'user',
        status: 'sent',
      });

      // Get conversation history for context
      const conversation = getCurrentConversation();
      const conversationHistory = conversation?.messages || [];

      // Make API call to get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/stream',
        },
        body: JSON.stringify({
          message: content,
          conversationHistory: conversationHistory.slice(-10),
          personality: config.personality.mode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      if (response.headers.get('Content-Type') === 'text/stream') {
        await handleStreamingResponse(response);
      } else {
        // Handle non-streaming response
        const data = await response.json();
        if (data.success) {
          addMessage({
            content: data.data.content,
            sender: 'ai',
            status: 'sent',
          });
        } else {
          throw new Error(data.error || 'Failed to get AI response');
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      // Format error message for display
      let errorResponse = errorMessage;
      
      // Add specific instructions for common errors
      if (errorMessage.includes('API key')) {
        errorResponse = `API Key Error: Please check your Gemini API key configuration.
        
1. Get your free API key from https://aistudio.google.com/
2. Add it to your .env.local file:
   GEMINI_API_KEY=your_key_here
3. Restart the development server
4. Try sending a message again`;
      } else if (errorMessage.includes('QUOTA_EXCEEDED')) {
        errorResponse = `API Quota Exceeded: You've reached your Gemini API usage limit.
        
Please check your API usage in the Google AI Studio dashboard.`;
      } else if (errorMessage.includes('Rate limit')) {
        errorResponse = `Rate Limit Reached: Please wait a moment before sending more messages.
        
This helps prevent overloading the system.`;
      }
      
      addMessage({
        content: errorResponse,
        sender: 'ai',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStreamingResponse = async (response: Response) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) {
      throw new Error('Failed to read streaming response');
    }

    let messageId: string | null = null;
    let accumulatedContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                throw new Error(data.error);
              }
              
              if (data.content || data.isComplete) {
                if (!messageId) {
                  // Create new AI message and get its ID
                  messageId = addMessage({
                    content: data.content || '',
                    sender: 'ai',
                    status: 'sending',
                  });
                  accumulatedContent = data.content || '';
                } else {
                  // Update existing message
                  if (data.content) {
                    accumulatedContent += data.content;
                  }
                  
                  // Use fullContent if available for better reliability
                  const contentToShow = data.fullContent || accumulatedContent;
                  
                  updateMessage(messageId, {
                    content: contentToShow,
                    status: data.isComplete ? 'sent' : 'sending',
                  });
                  
                  if (data.fullContent) {
                    accumulatedContent = data.fullContent;
                  }
                }
              }
              
              if (data.isComplete) {
                break;
              }
            } catch (parseError) {
              console.error('Failed to parse streaming data:', parseError);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

  return (
    <div className={cn("flex h-full flex-col relative min-w-0", className)}>
      {/* Error display */}
      {error && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertCircle className="h-4 w-4" />
          <span className="ml-2">{error}</span>
        </Alert>
      )}

      {/* Chat content */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        {hasMessages ? (
          <MessageList className="flex-1 min-h-0" />
        ) : (
          <WelcomeScreen onSendMessage={handleSendMessage} />
        )}
      </div>

      {/* Message input */}
      <div className="flex-shrink-0 border-t bg-background">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
