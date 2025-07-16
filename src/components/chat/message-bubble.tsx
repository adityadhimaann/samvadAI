import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { IoPersonCircle } from 'react-icons/io5';
import { RiRobot2Fill } from 'react-icons/ri';

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export function MessageBubble({ message, className }: MessageBubbleProps) {
  const isAI = message.sender === 'ai';
  const isError = message.status === 'error';
  const isSending = message.status === 'sending';

  if (isAI) {
    // AI messages on the left - Enhanced styling
    return (
      <div className={cn('w-full flex items-start gap-3 px-2 py-2', className)}>
        {/* Enhanced AI Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <RiRobot2Fill className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Enhanced AI Message content */}
        <div className="flex-1 max-w-[85%]">
          <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            SamvadGPT
          </div>
          <div className={cn(
            'rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border',
            'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900',
            'border-slate-200 dark:border-slate-700',
            'prose prose-sm dark:prose-invert max-w-none',
            'hover:shadow-md transition-all duration-200',
            'break-words', // Prevent text overflow
            isError && 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800 text-destructive',
            isSending && 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-muted-foreground animate-pulse'
          )}>
            {message.content}
          </div>
          <div className="text-xs text-muted-foreground mt-1 opacity-70 flex items-center gap-1">
            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>

        {/* Enhanced Status indicator for AI */}
        {isSending && (
          <div className="flex items-center gap-1 mt-8">
            <div className="h-2 w-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    );
  } else {
    // User messages on the right - Enhanced styling
    return (
      <div className={cn('w-full flex items-start gap-3 px-2 py-2 justify-end', className)}>
        {/* Enhanced User Message content */}
        <div className="flex flex-col items-end max-w-[85%]">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
            You
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          </div>
          <div className="rounded-2xl rounded-tr-md bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-3 text-white shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-400 break-words">
            {message.content}
          </div>
          <div className="text-xs text-muted-foreground mt-1 opacity-70 flex items-center gap-1">
            {new Date(message.timestamp).toLocaleTimeString()}
            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
          </div>
        </div>

        {/* Enhanced User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <IoPersonCircle className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    );
  }
}
