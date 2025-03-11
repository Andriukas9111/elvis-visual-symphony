
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logError } from '@/utils/errorLogger';

interface Props {
  children: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error
    logError(error, {
      context: `component:${this.props.componentName || 'unknown'}`,
      additionalData: {
        componentStack: errorInfo.componentStack
      }
    });
    
    this.setState({ errorInfo });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="bg-red-900/20 border border-red-500/50 rounded-md p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-red-300">Component Error</h3>
              <p className="text-sm text-white/70 mt-1">
                An error occurred in the {this.props.componentName || 'component'}.
              </p>
            </div>
          </div>
          
          <div className="bg-black/30 p-4 rounded border border-white/10 font-mono text-sm whitespace-pre-wrap text-white/80">
            {this.state.error?.message}
            {this.state.errorInfo?.componentStack ? (
              <div className="mt-2 pt-2 border-t border-white/10">
                {this.state.errorInfo.componentStack}
              </div>
            ) : null}
          </div>
          
          <Button 
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            variant="outline" 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
