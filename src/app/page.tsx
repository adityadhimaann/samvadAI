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
    <div className="flex h-screen bg-white dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0 bg-white dark:bg-slate-900">
        {/* Header */}
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onShowAuth={() => setShowAuthModal(true)}
        />

        {/* Chat interface */}
        <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6">
          <div className="w-full max-w-3xl flex-1 flex flex-col rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
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
