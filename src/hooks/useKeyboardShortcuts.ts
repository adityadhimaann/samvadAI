import { useEffect } from 'react';
import { useChatStore } from '@/store/chat';

interface KeyboardShortcuts {
  onNewConversation?: () => void;
  onFocusInput?: () => void;
  onToggleTheme?: () => void;
  onToggleSidebar?: () => void;
}

export function useKeyboardShortcuts({
  onNewConversation,
  onFocusInput,
  onToggleTheme,
  onToggleSidebar,
}: KeyboardShortcuts = {}) {
  const { createConversation, setCurrentConversation, theme, setTheme } = useChatStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in an input field
      const target = event.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true';

      // Ctrl+N: New conversation
      if (event.ctrlKey && event.key === 'n' && !isInputField) {
        event.preventDefault();
        if (onNewConversation) {
          onNewConversation();
        } else {
          const newId = createConversation('New Chat');
          setCurrentConversation(newId);
        }
      }

      // Ctrl+/: Focus message input
      if (event.ctrlKey && event.key === '/' && !isInputField) {
        event.preventDefault();
        if (onFocusInput) {
          onFocusInput();
        } else {
          // Try to focus the message input
          const messageInput = document.querySelector('textarea[placeholder*="message"], input[placeholder*="message"]') as HTMLElement;
          if (messageInput) {
            messageInput.focus();
          }
        }
      }

      // Ctrl+T: Toggle theme
      if (event.ctrlKey && event.key === 't' && !isInputField) {
        event.preventDefault();
        if (onToggleTheme) {
          onToggleTheme();
        } else {
          setTheme(theme === 'light' ? 'dark' : 'light');
        }
      }

      // Ctrl+B: Toggle sidebar
      if (event.ctrlKey && event.key === 'b' && !isInputField) {
        event.preventDefault();
        if (onToggleSidebar) {
          onToggleSidebar();
        }
      }

      // Escape: Close modals and overlays
      if (event.key === 'Escape') {
        // This will be handled by individual modal components
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createConversation, setCurrentConversation, theme, setTheme, onNewConversation, onFocusInput, onToggleTheme, onToggleSidebar]);
}

// Export keyboard shortcut information for display in help
export const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl+N', description: 'Create new conversation' },
  { key: 'Ctrl+/', description: 'Focus message input' },
  { key: 'Ctrl+T', description: 'Toggle theme' },
  { key: 'Ctrl+B', description: 'Toggle sidebar' },
  { key: 'Enter', description: 'Send message' },
  { key: 'Shift+Enter', description: 'New line in message' },
  { key: 'Escape', description: 'Close modal/overlay' },
] as const;