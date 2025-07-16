import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chat';
import { FiEdit3, FiSearch, FiSettings, FiHelpCircle, FiTrash2, FiMoreHorizontal } from 'react-icons/fi';
import { BiLibrary } from 'react-icons/bi';
import { SamvadIcon } from '@/components/ui/samvad-icon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
  const { 
    conversations, 
    currentConversationId, 
    setCurrentConversation, 
    createConversation, 
    deleteConversation,
    clearAllConversations 
  } = useChatStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const handleNewChat = () => {
    const newId = createConversation('New Chat');
    setCurrentConversation(newId);
    onClose(); // Close sidebar on mobile after creating new chat
  };

  const handleConversationSelect = (conversationId: string) => {
    setCurrentConversation(conversationId);
    onClose(); // Close sidebar on mobile after selection
  };

  const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent conversation selection
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(conversationId);
    }
  };

  const handleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
    }
  };

  const handleSettings = () => {
    setShowSettings(!showSettings);
    // You can implement a settings modal here
    alert('Settings functionality - implement as needed');
  };

  const handleHelp = () => {
    setShowHelp(!showHelp);
    // You can implement a help modal here
    alert('Help & FAQ functionality - implement as needed');
  };

  const handleLibrary = () => {
    setShowLibrary(!showLibrary);
    // You can implement library functionality here
    alert('Library functionality - implement as needed');
  };

  const handleUpgrade = () => {
    // You can implement upgrade functionality here
    alert('Upgrade plan functionality - implement as needed');
  };

  const handleClearAllChats = () => {
    if (window.confirm('Are you sure you want to clear all conversations? This action cannot be undone.')) {
      clearAllConversations();
    }
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.messages.some(message => 
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-background border-r border-border flex flex-col transition-transform duration-300 ease-in-out z-50",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <SamvadIcon className="text-primary" size="md" />
            <span className="font-semibold text-lg">SamvadGPT</span>
          </div>
          <button 
            onClick={handleNewChat}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="Start new chat"
          >
            <FiEdit3 className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-secondary rounded-lg border border-transparent focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation.id)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm",
                  currentConversationId === conversation.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-secondary"
                )}
              >
                <span className="truncate flex-1">{conversation.title}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    className="p-1 hover:bg-destructive/20 rounded-md text-destructive"
                    title="Delete chat"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <button 
            onClick={handleClearAllChats}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
          >
            <FiTrash2 className="h-4 w-4" />
            Clear all conversations
          </button>
          <button 
            onClick={handleSettings}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
          >
            <FiSettings className="h-4 w-4" />
            Settings
          </button>
          <button 
            onClick={handleHelp}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
          >
            <FiHelpCircle className="h-4 w-4" />
            Help & FAQ
          </button>
        </div>
      </div>
    </>
  );
}
