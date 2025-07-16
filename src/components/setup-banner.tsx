import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';

interface SetupBannerProps {
  onDismiss: () => void;
}

export function SetupBanner({ onDismiss }: SetupBannerProps) {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-950/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              API Configuration Required
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Add your Gemini API key to start chatting
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://aistudio.google.com/', '_blank')}
            className="text-yellow-800 dark:text-yellow-200 border-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Get API Key
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
