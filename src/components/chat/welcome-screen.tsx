import React from 'react';
import { FiMessageSquare, FiEdit, FiCode, FiHelpCircle } from 'react-icons/fi';
import { useAuthStore } from '@/store/auth';
import { SamvadIcon } from '@/components/ui/samvad-icon';

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
}

const suggestions = [
  {
    icon: FiMessageSquare,
    title: "Help me write",
    description: "a professional email to a client",
  },
  {
    icon: FiCode,
    title: "Write code",
    description: "for a simple calculator app",
  },
  {
    icon: FiEdit,
    title: "Create a plan",
    description: "for a weekend trip to the mountains",
  },
  {
    icon: FiHelpCircle,
    title: "Explain concepts",
    description: "like machine learning basics",
  },
];

export function WelcomeScreen({ onSendMessage }: WelcomeScreenProps) {
  const { user } = useAuthStore();
  
  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
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
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Welcome message */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <SamvadIcon className="text-white" size="lg" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-2">{getGreeting()}</h1>
          <p className="text-muted-foreground">
            I'm here to help with writing, learning, brainstorming, and more.
          </p>
        </div>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="group p-4 text-left rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-sm bg-card"
            >
              <div className="flex items-start gap-3">
                <suggestion.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium group-hover:text-primary transition-colors">
                    {suggestion.title}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {suggestion.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Additional info */}
        <div className="text-xs text-muted-foreground">
          SamvadGPT can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
}
