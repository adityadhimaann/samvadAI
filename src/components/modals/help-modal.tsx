import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { FiChevronDown, FiChevronRight, FiMessageCircle, FiSettings, FiMic, FiDownload, FiUpload } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { KEYBOARD_SHORTCUTS } from '@/hooks/useKeyboardShortcuts';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('getting-started');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: FiMessageCircle },
    { id: 'features', label: 'Features', icon: FiSettings },
    { id: 'voice', label: 'Voice & Audio', icon: FiMic },
    { id: 'data', label: 'Data & Privacy', icon: FiDownload },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: FiUpload },
  ];

  const faqData: FAQItem[] = [
    {
      category: 'getting-started',
      question: 'How do I start a conversation?',
      answer: 'Simply type your message in the input field at the bottom of the screen and press Enter or click the Send button. SamvadGPT will respond in real-time using Google Gemini AI.'
    },
    {
      category: 'getting-started',
      question: 'What languages does SamvadGPT support?',
      answer: 'SamvadGPT supports English, Hindi, and Hinglish (a mix of Hindi and English). You can ask questions in any of these languages, and the AI will respond appropriately in Hinglish format.'
    },
    {
      category: 'getting-started',
      question: 'How do I create a new conversation?',
      answer: 'Click the "New Chat" button in the sidebar or use the keyboard shortcut Ctrl+N to start a fresh conversation. Each conversation maintains its own context and history.'
    },
    {
      category: 'features',
      question: 'Can I delete conversations?',
      answer: 'Yes! Hover over any conversation in the sidebar and click the trash icon to delete it. You can also clear all conversations at once using the "Clear all conversations" button at the bottom of the sidebar.'
    },
    {
      category: 'features',
      question: 'How do I switch between light and dark themes?',
      answer: 'Use the theme toggle button in the header (sun/moon icon) or go to Settings > Appearance to change themes. You can also use the keyboard shortcut Ctrl+T.'
    },
    {
      category: 'features',
      question: 'Can I search through my conversations?',
      answer: 'Yes! Use the search bar at the top of the sidebar to find conversations by title or content. The search is real-time and will filter your conversations as you type.'
    },
    {
      category: 'features',
      question: 'What keyboard shortcuts are available?',
      answer: 'Key shortcuts include: Ctrl+N (new conversation), Ctrl+T (toggle theme), Ctrl+/ (focus message input), Enter (send message), and Shift+Enter (new line in message).'
    },
    {
      category: 'voice',
      question: 'How do I use voice input?',
      answer: 'Enable voice mode in Settings > Voice, then click the microphone icon in the message input area. Speak your message clearly and it will be converted to text automatically.'
    },
    {
      category: 'voice',
      question: 'Which languages are supported for voice input?',
      answer: 'Voice input supports English (US/UK) and Hindi (India). You can change the voice language in Settings > Voice > Voice Language.'
    },
    {
      category: 'voice',
      question: 'Can I auto-send messages after voice input?',
      answer: 'Yes! Enable "Auto-submit after voice input" in Settings > Voice to automatically send your message once voice recognition is complete.'
    },
    {
      category: 'data',
      question: 'Where are my conversations stored?',
      answer: 'All conversations are stored locally in your browser\'s storage. No conversation data is sent to external servers except for AI processing through Google Gemini API.'
    },
    {
      category: 'data',
      question: 'Can I export my conversations?',
      answer: 'Yes! Go to Settings > Data and click "Export Data" to download all your conversations as a JSON file. This is useful for backup or transferring to another device.'
    },
    {
      category: 'data',
      question: 'How do I import conversations from another device?',
      answer: 'Use the "Import Data" feature in Settings > Data to upload a previously exported JSON file. This will restore all your conversations from the backup.'
    },
    {
      category: 'data',
      question: 'Is my data private and secure?',
      answer: 'Yes! Conversations are stored locally on your device. Only the messages you send are processed by Google Gemini AI for generating responses. No personal data is permanently stored on external servers.'
    },
    {
      category: 'troubleshooting',
      question: 'The AI is not responding. What should I do?',
      answer: 'Check your internet connection and ensure your Google Gemini API key is properly configured. If the problem persists, try refreshing the page or creating a new conversation.'
    },
    {
      category: 'troubleshooting',
      question: 'I\'m getting API errors. How do I fix this?',
      answer: 'API errors usually indicate an issue with your Google Gemini API key. Ensure you have a valid API key from Google AI Studio (aistudio.google.com) and it\'s properly set in your environment variables.'
    },
    {
      category: 'troubleshooting',
      question: 'Voice input is not working. What can I do?',
      answer: 'Ensure your browser has microphone permissions enabled for this site. Check that voice input is enabled in Settings > Voice and your microphone is working properly.'
    },
    {
      category: 'troubleshooting',
      question: 'The app looks broken or doesn\'t load properly.',
      answer: 'Try clearing your browser cache and cookies for this site, then refresh the page. If issues persist, try using a different browser or check for browser updates.'
    },
    {
      category: 'troubleshooting',
      question: 'How do I reset the application to default settings?',
      answer: 'Go to Settings > Data and click "Clear All Data" to reset the application completely. This will delete all conversations and restore default settings.'
    }
  ];

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQ = faqData.filter(item => item.category === activeCategory);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help & FAQ" size="lg">
      <div className="flex h-[600px]">
        {/* Categories Sidebar */}
        <div className="w-48 border-r border-slate-200 dark:border-slate-800 p-4">
          <nav className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left",
                    activeCategory === category.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* FAQ Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">
                {categories.find(cat => cat.id === activeCategory)?.label}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {activeCategory === 'getting-started' && 'Learn the basics of using SamvadGPT'}
                {activeCategory === 'features' && 'Discover all the features and capabilities'}
                {activeCategory === 'voice' && 'Everything about voice input and audio features'}
                {activeCategory === 'data' && 'Information about data storage, privacy, and export'}
                {activeCategory === 'troubleshooting' && 'Solutions to common problems and issues'}
              </p>
            </div>

            <div className="space-y-3">
              {filteredFAQ.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-medium">{item.question}</span>
                    {expandedItems.has(index) ? (
                      <FiChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                      <FiChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                  
                  {expandedItems.has(index) && (
                    <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="pt-3 text-sm text-slate-600 dark:text-slate-400">
                        {item.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Tips Section */}
            {activeCategory === 'getting-started' && (
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Quick Tips</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Use descriptive conversation titles by editing them after creation</li>
                  <li>• Try asking follow-up questions to build on previous responses</li>
                  <li>• Use voice input for hands-free interaction</li>
                  <li>• Export your conversations regularly for backup</li>
                  <li>• Explore keyboard shortcuts for faster navigation</li>
                </ul>
              </div>
            )}

            {/* Contact Section */}
            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h4 className="font-medium mb-2">Need More Help?</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                If you can\'t find the answer you\'re looking for, here are additional resources:
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-medium">Documentation:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">
                    Check the README.md file for detailed setup instructions
                  </span>
                </li>
                <li>
                  <span className="font-medium">API Issues:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">
                    Visit Google AI Studio for API key management
                  </span>
                </li>
                <li>
                  <span className="font-medium">Browser Issues:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">
                    Try clearing cache or using an incognito window
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}