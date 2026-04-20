'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MoreVertical, MessageSquare, Upload, FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { formatBytes } from '@/lib/utils';
import toast from 'react-hot-toast';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/vault': 'Evidence Vault',
  '/analytics': 'Analytics',
  '/resources': 'Resources',
  '/badges': 'Badges',
  '/network': 'Network',
  '/marketplace': 'Marketplace',
  '/opportunities': 'Opportunities',
};

export function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || 'Dashboard';
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim() && !selectedFile) {
      toast.error('Please provide some feedback or attach a file.');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedbackOpen(false);
      setFeedbackText('');
      setSelectedFile(null);
      toast.success('Thank you! Your feedback has been submitted.');
    }, 1000);
  };

  return (
    <>
      <header className="h-14 flex items-center justify-between px-6 sticky top-0 z-30 bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-tertiary)]">HappySingh106</span>
          <span className="text-[var(--text-tertiary)]">\</span>
          <span className="text-sm font-semibold text-[var(--text-primary)]">{title}</span>
        </div>

        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {/* Three Dot Menu Trigger */}
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-1.5 rounded-[var(--radius-md)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-150 outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Options Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-10 right-0 w-48 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] py-1 z-40 animate-fade-in origin-top-right">
              <button 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors text-left outline-none"
                onClick={() => {
                  setDropdownOpen(false);
                  setFeedbackOpen(true);
                }}
              >
                <MessageSquare className="w-4 h-4" />
                Feedback
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Feedback Modal */}
      <Modal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        title="Submit Feedback"
        size="md"
      >
        <div className="space-y-5">
          <p className="text-sm text-[var(--text-secondary)]">We value your input. Let us know how we can improve HappyWay.</p>
          
          <Textarea
            label="Your Feedback"
            placeholder="Describe your issue or suggestion..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            maxChars={1000}
          />

          <div className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Attachment (Optional)</span>
            <div 
              className="border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center hover:border-[var(--text-tertiary)] transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <FileText className="w-6 h-6 text-[var(--text-primary)] mb-2" />
                  <p className="text-sm font-medium text-[var(--text-primary)]">{selectedFile.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{formatBytes(selectedFile.size)} • Click to switch</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-6 h-6 text-[var(--text-tertiary)] mb-2" />
                  <p className="text-sm text-[var(--text-secondary)]">Click or drag a file to upload</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] mt-4">
            <Button variant="secondary" onClick={() => setFeedbackOpen(false)}>Cancel</Button>
            <Button loading={isSubmitting} onClick={handleFeedbackSubmit}>Submit Feedback</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
