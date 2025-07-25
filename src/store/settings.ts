import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type Personality = 'formal' | 'casual' | 'humorous';

interface SettingsState {
  theme: Theme;
  personality: Personality;
  setTheme: (theme: Theme) => void;
  setPersonality: (personality: Personality) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      personality: 'casual',
      setTheme: (theme) => set({ theme }),
      setPersonality: (personality) => set({ personality }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
