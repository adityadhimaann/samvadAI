import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ChatState, Conversation, Message, ChatConfig } from '@/types/chat';
import { generateId } from '@/lib/utils';
import { chatDefaults } from '@/lib/config';

export interface ChatStore extends ChatState {
  config: ChatConfig;
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  // Actions
  createConversation: (title?: string) => string;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'> & { id?: string }) => string;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;
  setCurrentConversation: (conversationId: string | null) => void;
  deleteConversation: (conversationId: string) => void;
  clearAllConversations: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setVoiceMode: (enabled: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  updateConfig: (updates: Partial<ChatConfig>) => void;
  getCurrentConversation: () => Conversation | null;
  exportConversations: () => Conversation[];
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      conversations: [],
      currentConversationId: null,
      isLoading: false,
      error: null,
      isVoiceMode: false,
      theme: 'light',
      config: chatDefaults,
      hasHydrated: false,

      // Hydration action
      setHasHydrated: (hydrated) => {
        set({ hasHydrated: hydrated });
      },

      // Actions
      createConversation: (title = 'New Conversation') => {
        const id = generateId();
        const conversation: Conversation = {
          id,
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversationId: id,
        }));

        return id;
      },

      addMessage: (messageData) => {
        const { currentConversationId } = get();
        
        if (!currentConversationId) {
          // Create a new conversation if none exists
          const conversationId = get().createConversation();
          set({ currentConversationId: conversationId });
        }

        const messageId = messageData.id || generateId();
        const message: Message = {
          ...messageData,
          id: messageId,
          timestamp: new Date(),
        };

        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === state.currentConversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date(),
                }
              : conv
          ),
        }));

        return messageId;
      },

      updateMessage: (messageId, updates) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === state.currentConversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                  ),
                  updatedAt: new Date(),
                }
              : conv
          ),
        }));
      },

      deleteMessage: (messageId) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === state.currentConversationId
              ? {
                  ...conv,
                  messages: conv.messages.filter((msg) => msg.id !== messageId),
                  updatedAt: new Date(),
                }
              : conv
          ),
        }));
      },

      setCurrentConversation: (conversationId) => {
        set({ currentConversationId: conversationId });
      },

      deleteConversation: (conversationId) => {
        set((state) => {
          const newConversations = state.conversations.filter(
            (conv) => conv.id !== conversationId
          );
          const newCurrentId =
            state.currentConversationId === conversationId
              ? newConversations.length > 0
                ? newConversations[0].id
                : null
              : state.currentConversationId;

          return {
            conversations: newConversations,
            currentConversationId: newCurrentId,
          };
        });
      },

      clearAllConversations: () => {
        set({
          conversations: [],
          currentConversationId: null,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      setVoiceMode: (enabled) => {
        set({ isVoiceMode: enabled });
      },

      setTheme: (theme) => {
        set({ theme });
        
        // Update document class for theme (only on client)
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },

      updateConfig: (updates) => {
        set((state) => ({
          config: { ...state.config, ...updates },
        }));
      },

      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get();
        return conversations.find((conv) => conv.id === currentConversationId) || null;
      },

      exportConversations: () => {
        return get().conversations;
      },
    }),
    {
      name: 'chat-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        theme: state.theme,
        config: state.config,
      }),
      onRehydrateStorage: () => (state) => {
        // Convert serialized date strings back to Date objects
        if (state?.conversations) {
          state.conversations = state.conversations.map(conv => ({
            ...conv,
            createdAt: conv.createdAt instanceof Date ? conv.createdAt : new Date(conv.createdAt),
            updatedAt: conv.updatedAt instanceof Date ? conv.updatedAt : new Date(conv.updatedAt),
            messages: conv.messages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
            })),
          }));
        }
        
        // Set hydration flag and apply theme
        if (state) {
          state.hasHydrated = true;
          // Apply theme to document after hydration (only on client)
          if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', state.theme === 'dark');
          }
        }
      },
    }
  )
);
