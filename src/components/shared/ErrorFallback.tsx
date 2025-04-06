import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { AlertTriangle } from 'lucide-react';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-lg font-semibold text-destructive">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="mt-6">
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
} 