import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function APIStatusIndicator() {
  const [status, setStatus] = React.useState<'checking' | 'configured' | 'error' | 'not-configured'>('checking');
  const [error, setError] = React.useState<string>('');
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by only showing status after client mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    const checkAPIStatus = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        if (data.services?.gemini) {
          setStatus('configured');
        } else {
          setStatus('not-configured');
        }
      } catch (error) {
        setStatus('error');
        setError('Failed to check API status');
      }
    };

    checkAPIStatus();
  }, [mounted]);

  const statusConfig = {
    checking: {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      text: 'Checking API status...',
      className: 'text-muted-foreground',
    },
    configured: {
      icon: <CheckCircle className="h-4 w-4" />,
      text: 'API configured and ready',
      className: 'text-green-600 dark:text-green-400',
    },
    'not-configured': {
      icon: <AlertCircle className="h-4 w-4" />,
      text: 'API key not configured',
      className: 'text-yellow-600 dark:text-yellow-400',
    },
    error: {
      icon: <AlertCircle className="h-4 w-4" />,
      text: `Error: ${error}`,
      className: 'text-red-600 dark:text-red-400',
    },
  };

  // Use consistent rendering regardless of mount state
  const currentStatus = mounted ? status : 'checking';
  const config = statusConfig[currentStatus];

  return (
    <div className={`flex items-center gap-2 text-sm ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}
