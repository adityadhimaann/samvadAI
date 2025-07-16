import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthState, LoginCredentials, SignupCredentials } from '@/types/auth';
import { generateId } from '@/lib/utils';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

// Mock users database (in production, this would be a real database)
const mockUsers = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@samvadgpt.com',
    password: 'demo123',
    createdAt: new Date('2024-01-01'),
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user in mock database
          const foundUser = mockUsers.find(
            u => u.email === credentials.email && u.password === credentials.password
          );
          
          if (!foundUser) {
            throw new Error('Invalid email or password');
          }
          
          const user: User = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            createdAt: foundUser.createdAt,
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
          throw error;
        }
      },

      signup: async (credentials: SignupCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // Validate passwords match
          if (credentials.password !== credentials.confirmPassword) {
            throw new Error('Passwords do not match');
          }
          
          // Check if email already exists
          const existingUser = mockUsers.find(u => u.email === credentials.email);
          if (existingUser) {
            throw new Error('Email already exists');
          }
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create new user
          const newUser = {
            id: generateId(),
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
            createdAt: new Date(),
          };
          
          // Add to mock database
          mockUsers.push(newUser);
          
          const user: User = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Signup failed',
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Convert serialized date strings back to Date objects
        if (state?.user?.createdAt) {
          state.user.createdAt = new Date(state.user.createdAt);
        }
      },
    }
  )
);
