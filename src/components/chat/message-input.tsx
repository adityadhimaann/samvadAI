import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { IoSend } from 'react-icons/io5';
import { VscLoading } from 'react-icons/vsc';
import { BsMicFill, BsMicMuteFill } from 'react-icons/bs';
import { FiPaperclip, FiImage, FiX } from 'react-icons/fi';
import { useChatStore } from '@/store/chat';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export function MessageInput({ onSendMessage, disabled, className }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { isVoiceMode, setVoiceMode } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      let finalMessage = message.trim();
      if (attachedFiles.length > 0) {
        const fileNames = attachedFiles.map(f => f.name).join(', ');
        finalMessage += `\n\n[Attached files: ${fileNames}]`;
      }
      onSendMessage(finalMessage);
      setMessage('');
      setAttachedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleImageAttach = () => {
    imageInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleVoiceToggle = async () => {
    if (!isVoiceMode) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          setIsRecording(true);
          setVoiceMode(true);
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setTimeout(() => {
            setIsRecording(false);
            stream.getTracks().forEach(track => track.stop());
            setMessage(prev => prev + (prev ? ' ' : '') + '[Voice input recorded]');
          }, 3000);
        } else {
          alert('Voice recording is not supported in your browser');
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Could not access microphone. Please check permissions.');
        setIsRecording(false);
        setVoiceMode(false);
      }
    } else {
      setIsRecording(false);
      setVoiceMode(false);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [message]);

  return (
    <div className={cn("border-t bg-background", className)}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Attached files preview */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm">
                <span className="truncate max-w-32">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Remove file"
                >
                  <FiX className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end gap-2 bg-background border border-border rounded-3xl px-4 py-2 shadow-sm focus-within:border-primary/50 transition-colors">
            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept=".txt,.doc,.docx,.pdf,.json,.csv"
            />
            <input
              ref={imageInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />

            {/* Attachment button */}
            <button
              type="button"
              onClick={handleFileAttach}
              className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
              title="Attach files"
              disabled={disabled}
            >
              <FiPaperclip className="h-4 w-4" />
            </button>

            {/* Message input */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Recording..." : "Ask anything"}
              rows={1}
              disabled={disabled || isRecording}
              className={cn(
                "flex-1 resize-none bg-transparent border-0 focus:outline-none placeholder:text-muted-foreground",
                "scrollbar-thin max-h-32 py-2",
                isRecording && "text-primary"
              )}
              style={{ minHeight: '24px' }}
            />

            {/* Right side buttons */}
            <div className="flex items-center gap-1">
              {/* Image upload */}
              <button
                type="button"
                onClick={handleImageAttach}
                className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
                title="Upload image"
                disabled={disabled}
              >
                <FiImage className="h-4 w-4" />
              </button>

              {/* Voice input */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={cn(
                  "flex-shrink-0 p-2 transition-colors rounded-lg hover:bg-secondary",
                  isRecording ? "text-red-500 animate-pulse" : 
                  isVoiceMode ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                title={isRecording ? "Recording..." : isVoiceMode ? "Stop voice input" : "Start voice input"}
                disabled={disabled}
              >
                {isVoiceMode || isRecording ? (
                  <BsMicFill className="h-4 w-4" />
                ) : (
                  <BsMicMuteFill className="h-4 w-4" />
                )}
              </button>

              {/* Send button */}
              <button
                type="submit"
                disabled={(!message.trim() && attachedFiles.length === 0) || disabled || isRecording}
                className={cn(
                  "flex-shrink-0 p-2 rounded-lg transition-all",
                  (message.trim() || attachedFiles.length > 0) && !disabled && !isRecording
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    : "text-muted-foreground cursor-not-allowed"
                )}
                title="Send message"
              >
                {disabled ? (
                  <VscLoading className="h-4 w-4 animate-spin" />
                ) : (
                  <IoSend className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Footer text */}
          <div className="text-center mt-2">
            <p className="text-xs text-muted-foreground">
              SamvadGPT can make mistakes. Check important info.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
