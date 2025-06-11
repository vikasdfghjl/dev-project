import React from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface AsyncErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onRetry?: () => void;
}

/**
 * Specialized Error Boundary for async operations like API calls
 * Provides retry functionality and specific error handling for async errors
 */
export const AsyncErrorBoundary: React.FC<AsyncErrorBoundaryProps> = ({
  children,
  fallback,
  onRetry,
}) => {
  const handleError = (error: Error) => {
    // Log async errors with additional context
    console.error("Async operation error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  };

  const customFallback = fallback || (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <svg
        className="w-16 h-16 text-muted-foreground dark:text-slate-600 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-lg font-medium text-foreground dark:text-slate-200 mb-2">
        Unable to load content
      </h3>
      <p className="text-muted-foreground dark:text-slate-400 mb-4 max-w-md">
        There was a problem loading this content. This might be due to a network
        issue or server problem.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-primary-foreground font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try Again
        </button>
      )}
    </div>
  );

  return (
    <ErrorBoundary fallback={customFallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};
