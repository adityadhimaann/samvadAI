import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, CheckCircle } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface SetupGuideProps {
  onClose?: () => void;
}

export function SetupGuide({ onClose }: SetupGuideProps) {
  const [copiedStep, setCopiedStep] = React.useState<number | null>(null);
  
  const copyToClipboardWithFeedback = async (text: string, step: number) => {
    try {
      await copyToClipboard(text);
      setCopiedStep(step);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          🚀 Quick Setup Guide
        </h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        To start chatting with the AI, you need to configure your Google Gemini API key. It's free and takes just 2 minutes!
      </p>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
            1
          </div>
          <div className="flex-1 space-y-2">
            <p className="font-medium">Get your free API key</p>
            <p className="text-sm text-muted-foreground">
              Visit Google AI Studio to create your free API key
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => window.open('https://aistudio.google.com/', '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
              Open AI Studio
            </Button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
            2
          </div>
          <div className="flex-1 space-y-2">
            <p className="font-medium">Add API key to environment file</p>
            <p className="text-sm text-muted-foreground">
              Copy this line to your <code className="bg-muted px-1 rounded">.env.local</code> file and replace with your actual key:
            </p>
            <div className="bg-muted rounded p-2 font-mono text-sm flex items-center justify-between">
              <code>GEMINI_API_KEY=your_actual_api_key_here</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboardWithFeedback('GEMINI_API_KEY=your_actual_api_key_here', 2)}
              >
                {copiedStep === 2 ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
            3
          </div>
          <div className="flex-1 space-y-2">
            <p className="font-medium">Restart the development server</p>
            <p className="text-sm text-muted-foreground">
              Stop the server with <code className="bg-muted px-1 rounded">Ctrl+C</code> and restart:
            </p>
            <div className="bg-muted rounded p-2 font-mono text-sm flex items-center justify-between">
              <code>npm run dev</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboardWithFeedback('npm run dev', 3)}
              >
                {copiedStep === 3 ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded p-3">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Tip:</strong> The Google Gemini API has a generous free tier with 15 requests per minute and 1,500 requests per day. Perfect for testing and development!
        </p>
      </div>
    </div>
  );
}
