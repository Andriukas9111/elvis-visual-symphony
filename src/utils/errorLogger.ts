
type ErrorLogLevel = 'info' | 'warning' | 'error';

interface ErrorLogOptions {
  level?: ErrorLogLevel;
  context?: string;
  additionalData?: Record<string, any>;
}

/**
 * A utility function for logging errors with consistent formatting
 * and optional context information.
 */
export const logError = (
  error: Error | string,
  options: ErrorLogOptions = {}
) => {
  const { 
    level = 'error', 
    context = 'application', 
    additionalData = {} 
  } = options;
  
  const timestamp = new Date().toISOString();
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  const logObject = {
    timestamp,
    level,
    context,
    message: errorMessage,
    stack: errorStack,
    ...additionalData
  };
  
  // Color formatting for console
  const colors = {
    info: '\x1b[36m%s\x1b[0m', // cyan
    warning: '\x1b[33m%s\x1b[0m', // yellow
    error: '\x1b[31m%s\x1b[0m' // red
  };
  
  // Log to console with appropriate level
  switch (level) {
    case 'info':
      if (process.env.NODE_ENV !== 'production') {
        console.info(colors.info, `[${context.toUpperCase()}] [INFO]`, logObject);
      }
      break;
    case 'warning':
      console.warn(colors.warning, `[${context.toUpperCase()}] [WARNING]`, logObject);
      break;
    case 'error':
      console.error(colors.error, `[${context.toUpperCase()}] [ERROR]`, logObject);
      break;
    default:
      console.log(`[${context.toUpperCase()}]`, logObject);
  }
  
  // Here you could add additional reporting to external services
  // such as Sentry, LogRocket, etc.
  
  return logObject;
};

/**
 * A higher-order function that wraps a function in a try/catch block
 * and logs any errors that occur during execution.
 */
export const withErrorLogging = <T extends (...args: any[]) => any>(
  fn: T,
  options: ErrorLogOptions = {}
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      return fn(...args);
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), {
        ...options,
        additionalData: {
          ...options.additionalData,
          arguments: args.map(arg => 
            typeof arg === 'object' ? 
              (arg === null ? null : Object.keys(arg)) : 
              typeof arg
          )
        }
      });
      throw error;
    }
  };
};

/**
 * A utility function to create an error boundary component wrapper
 * that catches and logs errors in React components.
 */
export const createComponentErrorLogger = (
  componentName: string,
  fallback?: React.ReactNode
) => {
  return (error: Error) => {
    logError(error, {
      context: `component:${componentName}`,
      level: 'error'
    });
    
    // Return fallback UI if provided
    return fallback;
  };
};
