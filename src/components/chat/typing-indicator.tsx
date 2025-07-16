import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex w-full gap-3 px-4 py-3">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Bot className="h-4 w-4" />
      </div>

      {/* Typing animation */}
      <div className="flex items-center space-x-2">
        <div className="rounded-lg bg-muted px-3 py-2">
          <div className="flex items-center space-x-1">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
