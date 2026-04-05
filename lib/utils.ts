import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isBefore, addDays } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM d, yyyy');
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getScoreColor(score: number): string {
  if (score < 40) return 'var(--score-low)';
  if (score < 70) return 'var(--score-mid)';
  return 'var(--score-high)';
}

export function getScoreLabel(score: number): string {
  if (score < 20) return 'Very Low';
  if (score < 40) return 'Low';
  if (score < 60) return 'Moderate';
  if (score < 80) return 'Strong';
  return 'Very Strong';
}

export function getDeadlineStatus(deadline: Date | string): 'urgent' | 'soon' | 'normal' {
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const now = new Date();
  if (isBefore(d, addDays(now, 7))) return 'urgent';
  if (isBefore(d, addDays(now, 30))) return 'soon';
  return 'normal';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export const CRITERION_LABELS: Record<string, string> = {
  awards: 'Awards',
  membership: 'Membership',
  press: 'Press',
  judging: 'Judging',
  original_contributions: 'Original Contributions',
  scholarly_articles: 'Scholarly Articles',
  critical_role: 'Critical Role',
  high_salary: 'High Salary',
  commercial_success: 'Commercial Success',
};

export const CRITERION_DESCRIPTIONS: Record<string, string> = {
  awards: 'Nationally or internationally recognized awards or prizes for excellence',
  membership: 'Membership in associations requiring outstanding achievements',
  press: 'Published material in major media about you and your work',
  judging: 'Participation as a judge of the work of others in your field',
  original_contributions: 'Original scientific, scholarly, or business contributions of major significance',
  scholarly_articles: 'Authorship of scholarly articles in professional journals or major media',
  critical_role: 'Employment in a critical or essential capacity for distinguished organizations',
  high_salary: 'High salary or remuneration relative to others in the field',
  commercial_success: 'Commercial successes in the performing arts or comparable evidence',
};

export const FIELD_LABELS: Record<string, string> = {
  ai_ml: 'AI/ML',
  biotech: 'Biotech',
  finance: 'Finance',
  law: 'Law',
  medicine: 'Medicine',
  arts: 'Arts',
  engineering: 'Engineering',
  research: 'Research',
  entrepreneurship: 'Entrepreneurship',
  other: 'Other',
};

export const VISA_LABELS: Record<string, string> = {
  o1a: 'O-1A',
  o1b: 'O-1B',
  eb1a: 'EB-1A',
  eb1b: 'EB-1B',
  eb2_niw: 'EB-2 NIW',
  not_sure: 'Not sure yet',
};
