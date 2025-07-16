import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FiMenu, FiEdit, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { useChatStore } from '@/store/chat';

interface HeaderProps {
  onToggleSidebar: () => void;
  className?: string;
}

export function Header({ onToggleSidebar, className }: HeaderProps) {
  const { theme, setTheme, createConversation, setCurrentConversation } = useChatStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleNewChat = () => {
    const newId = createConversation('New Chat');
    setCurrentConversation(newId);
  };

  const handleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className={cn(
      "flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur-sm relative",
      className
    )}>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-secondary rounded-lg transition-colors lg:hidden"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        
        {/* SamvadGPT-style logo and title with dropdown */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <HiSparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-center gap-2 relative">
            <span className="font-semibold text-lg">SamvadGPT</span>
            <button
              onClick={handleUserMenu}
              className="p-1 hover:bg-secondary rounded transition-colors"
              title="User menu"
            >
              <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* User dropdown menu - positioned directly below the dropdown arrow */}
            {showUserMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => {
                      setTheme(theme === 'dark' ? 'light' : 'dark');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
                  >
                    {theme === 'dark' ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </button>
                  
                  <button 
                    onClick={() => {
                      handleNewChat();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
                  >
                    <FiEdit className="h-4 w-4" />
                    New chat
                  </button>
                  
                  <div className="border-t border-border my-1" />
                  
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      alert('Profile settings - implement as needed');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
                  >
                    <FiUser className="h-4 w-4" />
                    Profile
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      alert('Sign out - implement authentication');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-destructive"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <FiSun className="h-5 w-5" />
          ) : (
            <FiMoon className="h-5 w-5" />
          )}
        </button>

        {/* New chat button */}
        <button 
          onClick={handleNewChat}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title="Start new chat"
        >
          <FiEdit className="h-5 w-5" />
        </button>

        {/* User menu button */}
        <button 
          onClick={handleUserMenu}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title="User options"
        >
          <FiUser className="h-5 w-5" />
        </button>
      </div>

      {/* Close menu when clicking outside */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
