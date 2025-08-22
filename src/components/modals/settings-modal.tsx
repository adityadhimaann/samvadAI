import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useChatStore } from '@/store/chat';
import { FiMoon, FiSun, FiMonitor, FiVolume2, FiVolumeX, FiDownload, FiUpload } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { 
    theme, 
    setTheme, 
    isVoiceMode, 
    setVoiceMode, 
    config, 
    updateConfig,
    exportConversations,
    conversations,
    clearAllConversations,
  } = useChatStore();

  const [activeTab, setActiveTab] = useState<'appearance' | 'voice' | 'data' | 'about'>('appearance');

  const handleExportData = () => {
    const data = exportConversations();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `samvadgpt-conversations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data) && data.length > 0) {
          // Validate the data structure
          const isValid = data.every(conv => 
            conv.id && conv.title && Array.isArray(conv.messages)
          );
          
          if (isValid) {
            if (window.confirm('This will replace all your current conversations. Are you sure?')) {
              clearAllConversations();
              // Import conversations logic would go here
              // For now, just show success message
              alert('Import functionality is ready for implementation with your preferred data storage method.');
            }
          } else {
            alert('Invalid file format. Please select a valid SamvadGPT export file.');
          }
        } else {
          alert('No valid conversations found in the file.');
        }
      } catch (error) {
        alert('Error reading file. Please make sure it\'s a valid JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset the input
    event.target.value = '';
  };

  const tabs = [
    { id: 'appearance' as const, label: 'Appearance', icon: FiSun },
    { id: 'voice' as const, label: 'Voice', icon: FiVolume2 },
    { id: 'data' as const, label: 'Data', icon: FiDownload },
    { id: 'about' as const, label: 'About', icon: FiMonitor },
  ];

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: FiSun },
    { value: 'dark' as const, label: 'Dark', icon: FiMoon },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="lg">
      <div className="flex h-[500px]">
        {/* Sidebar */}
        <div className="w-48 border-r border-slate-200 dark:border-slate-800 p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Theme</h3>
                <div className="grid grid-cols-2 gap-3">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                          theme === option.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{option.label}</span>
                        {theme === option.value && (
                          <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Animation Speed</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Control the speed of UI animations and transitions
                </p>
                <select 
                  value={config.animationSpeed || 'normal'}
                  onChange={(e) => updateConfig({ animationSpeed: e.target.value as 'slow' | 'normal' | 'fast' })}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-background"
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Voice Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Voice Input</label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Enable speech-to-text for message input
                      </p>
                    </div>
                    <button
                      onClick={() => setVoiceMode(!isVoiceMode)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isVoiceMode
                          ? "bg-primary/10 text-primary"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {isVoiceMode ? <FiVolume2 className="h-5 w-5" /> : <FiVolumeX className="h-5 w-5" />}
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Voice Language</label>
                    <select 
                      value={config.voiceLanguage || 'en-US'}
                      onChange={(e) => updateConfig({ voiceLanguage: e.target.value })}
                      className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-background"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="hi-IN">Hindi (India)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Auto-submit after voice input
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.autoSubmitVoice || false}
                        onChange={(e) => updateConfig({ autoSubmitVoice: e.target.checked })}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Automatically send message after voice input
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Data Management</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h4 className="font-medium mb-2">Export Conversations</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Download all your conversations as a JSON file for backup or transfer.
                    </p>
                    <button
                      onClick={handleExportData}
                      disabled={conversations.length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiDownload className="h-4 w-4" />
                      Export Data ({conversations.length} conversations)
                    </button>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h4 className="font-medium mb-2">Import Conversations</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Import conversations from a previously exported JSON file.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="import-file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                      <label
                        htmlFor="import-file"
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 cursor-pointer"
                      >
                        <FiUpload className="h-4 w-4" />
                        Import Data
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                    <h4 className="font-medium mb-2 text-destructive">Clear All Data</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Permanently delete all conversations and reset the application.
                    </p>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete all conversations? This action cannot be undone.')) {
                          clearAllConversations();
                          onClose();
                        }
                      }}
                      className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">About SamvadGPT</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Version</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">1.0.0</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Real-time AI conversations with Google Gemini</li>
                      <li>• Multi-language support (English, Hindi, Hinglish)</li>
                      <li>• Voice input and output capabilities</li>
                      <li>• Dark/Light theme support</li>
                      <li>• Conversation management and export</li>
                      <li>• Mobile-responsive design</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Technology Stack</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Next.js 14 & React 18</li>
                      <li>• TypeScript for type safety</li>
                      <li>• Tailwind CSS for styling</li>
                      <li>• Zustand for state management</li>
                      <li>• Google Gemini AI API</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Storage</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Conversations are stored locally in your browser. No data is sent to external servers except for AI processing.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">New conversation</span>
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Ctrl+N</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Focus message input</span>
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Ctrl+/</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Toggle theme</span>
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Ctrl+T</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}