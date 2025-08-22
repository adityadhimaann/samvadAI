import React, { useState } from 'react';
import { FiEdit, FiCode, FiBookOpen, FiBriefcase, FiZap, FiHeart } from 'react-icons/fi';
import { useAuthStore } from '@/store/auth';
import { SamvadIcon } from '@/components/ui/samvad-icon';
import { cn } from '@/lib/utils';

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
}

const suggestionCategories = {
  writing: {
    name: 'Writing & Content',
    icon: FiEdit,
    suggestions: [
      { title: "Write a professional email", description: "for following up on a job application" },
      { title: "Create engaging social media content", description: "for a small business launch" },
      { title: "Draft a compelling blog post", description: "about sustainable living tips" },
      { title: "Write a product description", description: "that converts browsers into buyers" },
    ]
  },
  coding: {
    name: 'Programming & Tech',
    icon: FiCode,
    suggestions: [
      { title: "Build a React component", description: "for a todo list with local storage" },
      { title: "Write Python code", description: "to analyze CSV data and create charts" },
      { title: "Create a REST API", description: "with authentication and CRUD operations" },
      { title: "Debug this JavaScript error", description: "and explain the solution step by step" },
    ]
  },
  learning: {
    name: 'Learning & Education',
    icon: FiBookOpen,
    suggestions: [
      { title: "Explain machine learning", description: "concepts in simple terms with examples" },
      { title: "Teach me about blockchain", description: "and how cryptocurrencies work" },
      { title: "Break down complex physics", description: "like quantum mechanics for beginners" },
      { title: "Help me understand economics", description: "concepts like inflation and GDP" },
    ]
  },
  business: {
    name: 'Business & Career',
    icon: FiBriefcase,
    suggestions: [
      { title: "Create a business plan", description: "for a food delivery startup" },
      { title: "Prepare for job interviews", description: "with common questions and answers" },
      { title: "Develop a marketing strategy", description: "for a new mobile app launch" },
      { title: "Write a project proposal", description: "that gets stakeholder buy-in" },
    ]
  },
  creative: {
    name: 'Creative & Fun',
    icon: FiZap,
    suggestions: [
      { title: "Plan a perfect weekend", description: "with activities for the whole family" },
      { title: "Create a workout routine", description: "for home exercises without equipment" },
      { title: "Design a meal plan", description: "for healthy eating on a budget" },
      { title: "Write a short story", description: "about time travel with a twist ending" },
    ]
  },
  personal: {
    name: 'Personal Development',
    icon: FiHeart,
    suggestions: [
      { title: "Help me build better habits", description: "for productivity and wellness" },
      { title: "Create a learning schedule", description: "to master a new skill in 30 days" },
      { title: "Plan my career path", description: "with achievable milestones and goals" },
      { title: "Improve my communication", description: "skills for better relationships" },
    ]
  }
};

export function WelcomeScreen({ onSendMessage }: WelcomeScreenProps) {
  const { user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState<keyof typeof suggestionCategories>('writing');
  
  const handleSuggestionClick = (suggestion: { title: string; description: string }) => {
    const fullPrompt = `${suggestion.title} ${suggestion.description}`;
    onSendMessage(fullPrompt);
  };

  const getGreeting = () => {
    if (user) {
      return `Hey, ${user.name}. Ready to dive in?`;
    }
    return "Welcome! Ready to dive in?";
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
      <div className="max-w-4xl w-full text-center">
        {/* Welcome message */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <SamvadIcon className="text-white" size="lg" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">{getGreeting()}</h1>
          <p className="text-slate-600 dark:text-slate-400">
            I'm here to help with writing, coding, learning, business, creativity, and personal development.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {Object.entries(suggestionCategories).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key as keyof typeof suggestionCategories)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                  activeCategory === key
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                )}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {suggestionCategories[activeCategory].suggestions.map((suggestion, index) => {
            const Icon = suggestionCategories[activeCategory].icon;
            return (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="group p-4 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-green-500/50 transition-all hover:shadow-sm bg-white dark:bg-slate-800"
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium group-hover:text-green-500 transition-colors text-slate-900 dark:text-white">
                      {suggestion.title}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {suggestion.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="text-xs text-slate-500 dark:text-slate-500">
          SamvadGPT can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
}