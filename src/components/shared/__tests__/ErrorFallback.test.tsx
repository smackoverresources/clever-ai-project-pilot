import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorFallback } from '../ErrorFallback';
import { render } from '@/test/utils';

describe('ErrorFallback', () => {
  const mockError = new Error('Test error message');
  const mockResetErrorBoundary = vi.fn();

  it('renders error message and retry button', () => {
    render(
      <ErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('calls resetErrorBoundary when retry button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <ErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1);
  });

  it('displays fallback message when error has no message', () => {
    render(
      <ErrorFallback
        error={new Error()}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });
}); 