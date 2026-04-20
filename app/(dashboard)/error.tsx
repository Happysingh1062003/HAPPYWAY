'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[Dashboard Error Boundary]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center space-y-6">
      <div className="w-12 h-12 rounded-full bg-[var(--bg-muted)] border border-[var(--border)] flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-[var(--danger)]" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-medium tracking-tight text-[var(--text-primary)]">Something went wrong</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          We encountered an unexpected error while loading this page.
        </p>
      </div>
      <Button onClick={() => reset()} size="md" variant="secondary">
        Try again
      </Button>
    </div>
  );
}
