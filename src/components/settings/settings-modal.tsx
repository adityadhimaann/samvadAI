import React from 'react';
import { useSettingsStore } from '@/store/settings';
import { useChatStore } from '@/store/chat';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme, clearAllConversations } = useChatStore();
  const { personality, setPersonality } = useSettingsStore();

  if (!isOpen) return null;

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value as 'light' | 'dark');
  };

  const handlePersonalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPersonality(e.target.value as 'formal' | 'casual' | 'humorous');
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      clearAllConversations();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Theme</h3>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={handleThemeChange} />
                <span>Light</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={handleThemeChange} />
                <span>Dark</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Chat Personality</h3>
            <select value={personality} onChange={handlePersonalityChange} className="w-full p-2 border rounded-md bg-white dark:bg-slate-700">
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="humorous">Humorous</option>
            </select>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
            <button
              onClick={handleClearHistory}
              className="w-full p-2 border rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Clear All Chat History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
