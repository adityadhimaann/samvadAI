'use client';

import React, { useState } from 'react';
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
  const { hasHydrated } = useChatStore();

  // Prevent hydration mismatch by not rendering until hydrated
  if (!hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen bg-white dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      {/* Chat and main content */}
      <div className="flex flex-1 flex-col bg-white dark:bg-slate-900 min-w-0">
        {/* Header */}
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onShowAuth={() => setShowAuthModal(true)}
        />

        {/* Chat interface */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 min-h-0 min-w-0">
            <ChatInterface />
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
