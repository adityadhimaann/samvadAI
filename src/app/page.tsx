'use client';

import React, { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { AuthModal } from '@/components/auth/auth-modal';
import { useChatStore } from '@/store/chat';
import { useAuthStore } from '@/store/auth';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [mounted, setMounted] = useState(false);
  const { hasHydrated, setHasHydrated } = useChatStore();

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
    setHasHydrated(true);
  }, [setHasHydrated]);

  // Prevent hydration mismatch by not rendering until mounted and hydrated
  if (!mounted || !hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen w-full bg-white dark:bg-slate-900 overflow-hidden">
      {/* Desktop layout - sidebar as part of normal layout flow */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0">
        <Sidebar
          isOpen={true}
          onClose={() => {}}
          className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
      </div>
      
      {/* Mobile sidebar - positioned absolutely and shown on demand */}
      <div className="lg:hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
      </div>
      
      {/* Chat and main content */}
      <div 
        className="flex flex-1 flex-col min-w-0 h-full bg-white dark:bg-slate-900"
      >
        {/* Header - highest z-index in the layout */}
        <div style={{ position: 'relative', zIndex: 1000 }}>
          <Header 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onShowAuth={() => setShowAuthModal(true)}
            className="flex-shrink-0"
          />
        </div>

        {/* Chat interface */}
        <main 
          className="flex-1 flex flex-col min-w-0 h-full min-h-0 bg-white dark:bg-slate-900"
          style={{ position: 'relative', zIndex: 49 }}
        >
          <div className="flex-1 min-h-0 min-w-0 h-full">
            <ChatInterface className="h-full" />
          </div>
        </main>
      </div>

      {/* Auth Modal - highest z-index */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
