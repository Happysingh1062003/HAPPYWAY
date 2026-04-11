'use client';

import { X } from 'lucide-react';
import { useEffect, useCallback } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}

export function Drawer({ isOpen, onClose, title, children, width = '480px' }: DrawerProps) {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        aria-label="Close drawer"
      />
      <div
        className="relative h-full bg-[var(--bg-card)] border-l border-[var(--border)] shadow-[var(--shadow-xl)] animate-slide-in-right overflow-y-auto"
        style={{ width, maxWidth: '100vw' }}
      >
        {title && (
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-card)]">
            <h2 className="text-lg font-display">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-150"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
