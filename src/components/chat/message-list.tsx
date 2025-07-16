import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MessageBubble } from './message-bubble';
import { useChatStore } from '@/store/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmptyState } from '@/components/empty-state';

interface MessageListProps {
  className?: string;
}

export function MessageList({ className }: MessageListProps) {
  const { getCurrentConversation } = useChatStore();
  const conversation = getCurrentConversation();
  const messages = conversation?.messages || [];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className={cn('flex-1 flex items-center justify-center p-8', className)}>
        <EmptyState 
          title="No messages yet"
          description="Start a conversation by typing a message below."
          icon="💬"
        />
      </div>
    );
  }

  return (
    <div 
      ref={scrollContainerRef}
      className={cn('flex-1 overflow-y-auto h-full', className)}
      style={{ 
        maxHeight: 'calc(100vh - 200px)', // Ensure proper height calculation
        minHeight: '200px'
      }}
    >
      <div className="flex flex-col gap-2 p-4 pb-8">
        {messages.map((message, index) => (
          <div
            key={`${message.id}-${index}`} // More stable key
            className={cn(
              'w-full', // Ensure full width to prevent zigzag
              { 'opacity-60': message.status === 'sending' }
            )}
          >
            <MessageBubble message={message} />
          </div>
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
}
