import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Help & FAQ</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">How do I start a new chat?</h3>
            <p>Click the "New Chat" button in the header or sidebar to start a new conversation.</p>
          </div>
          <div>
            <h3 className="font-semibold">How do I change the theme?</h3>
            <p>You can toggle between light and dark mode by clicking the sun/moon icon in the header, or by changing the theme in the settings menu.</p>
          </div>
          <div>
            <h3 className="font-semibold">How do I change the chat personality?</h3>
            <p>You can change the chat personality in the settings menu. The available options are Casual, Formal, and Humorous.</p>
          </div>
          <div>
            <h3 className="font-semibold">How do I clear my chat history?</h3>
            <p>You can clear your entire chat history by clicking the "Clear All Chat History" button in the settings menu. This action cannot be undone.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
