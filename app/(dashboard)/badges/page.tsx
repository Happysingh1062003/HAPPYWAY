'use client';

import type { LucideIcon } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Compass, BookOpen, Feather, Anchor, Radio, Scale, ShieldCheck, Sparkles, Award } from 'lucide-react';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  details: string;
  icon: LucideIcon;
  earned: boolean;
  earnedDate?: string;
  progress: number;
  total: number;
}

const BADGES: BadgeData[] = [
  { id: '1', name: 'The Genesis', description: 'Established strategic foundation.', details: 'You have successfully taken the first step toward structuring your extraordinary case.', icon: Compass, earned: true, earnedDate: '2024-01-05', progress: 1, total: 1 },
  { id: '2', name: 'Peer Assessed', description: 'Expertise recognized formally.', details: 'Your work has been rigorously reviewed and recognized closely by elite peers in your specific field.', icon: BookOpen, earned: true, earnedDate: '2024-03-10', progress: 1, total: 1 },
  { id: '4', name: 'Alpha Operator', description: 'Verified critical leadership.', details: 'Demonstrated undeniable evidence of taking leading roles in highly distinguished organizations.', icon: Anchor, earned: true, earnedDate: '2024-06-15', progress: 1, total: 1 },
  { id: '5', name: 'The Spotlight', description: 'Major international press secured.', details: 'Featured prominently and unequivocally in major global publications regarding your professional work.', icon: Radio, earned: true, earnedDate: '2024-08-20', progress: 1, total: 1 },
  { id: '6', name: 'Global Judge', description: 'Adjudicated industry peers.', details: 'Served officially as an elite judge for international competitions and leading journal publications.', icon: Scale, earned: true, earnedDate: '2024-09-02', progress: 1, total: 1 },
  { id: '10', name: 'Market Top 1%', description: 'Exceptional remuneration documented.', details: 'Verifiable evidence of demanding an exceptionally high salary compared to others in your discipline.', icon: Award, earned: false, progress: 0, total: 1 },
  { id: '11', name: 'Commercially Unrivaled', description: 'Box office and sales success.', details: 'Tangible proof of massive commercial successes in the performing arts or vast market product sales.', icon: Award, earned: false, progress: 0, total: 1 },
  { id: '3', name: 'The Vanguard', description: 'Scholarly publications citing.', details: 'Authored scholarly articles that have established a deeply significant citation footprint globally.', icon: Feather, earned: false, progress: 45, total: 100 },
  { id: '7', name: 'Unassailable', description: 'Flawless strength achieved.', details: 'Secured absolutely compelling evidence across a minimum of three distinct USCIS criteria.', icon: ShieldCheck, earned: false, progress: 78, total: 100 },
  { id: '8', name: 'The Benchmark', description: 'Original contribution documented.', details: 'Introduced a globally significant, original scientific, engineering, or business contribution.', icon: Sparkles, earned: false, progress: 0, total: 1 },
  { id: '9', name: 'Extraordinary', description: 'Final I-140 Visa Approval.', details: 'The ultimate achievement. USCIS has formally approved your EB-1A Extraordinary Ability petition.', icon: Award, earned: false, progress: 0, total: 1 },
];

export default function BadgesPage() {
  const earned = BADGES.filter(b => b.earned);
  const inProgress = BADGES.filter(b => !b.earned);

  return (
    <div className="max-w-[1200px] mx-auto py-8 animate-fade-in space-y-24">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl md:text-2xl font-light tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-serif)' }}>Milestones</h1>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-[var(--border)] text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
           {earned.length}/{BADGES.length} Secured
        </div>
      </div>

      {/* Secured Segment */}
      <section>
        <h2 className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-10 border-b border-[var(--border)] pb-4">Secured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
          {earned.map(badge => (
            <div key={badge.id} className="group relative flex items-start gap-5">
              <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-[var(--text-primary)] flex items-center justify-center">
                <badge.icon className="w-8 h-8 text-[var(--bg)]" strokeWidth={1} />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">{badge.name}</h3>
                <p className="text-[11px] text-[var(--text-secondary)] font-serif italic mt-1.5">{badge.description}</p>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-6 font-mono tracking-widest uppercase">
                  {formatDate(badge.earnedDate!)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analyzing Segment */}
      <section>
        <h2 className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-10 border-b border-[var(--border)] pb-4">Analyzing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
          {inProgress.map(badge => (
            <div key={badge.id} className="group relative flex items-start gap-5 opacity-60 hover:opacity-100 transition-opacity">
              <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 border border-[var(--border)] flex items-center justify-center bg-transparent">
                <badge.icon className="w-8 h-8 text-[var(--text-tertiary)]" strokeWidth={1} />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">{badge.name}</h3>
                <p className="text-[11px] text-[var(--text-secondary)] font-serif italic mt-1.5">{badge.description}</p>
                
                <div className="mt-6 flex flex-col gap-1.5">
                  <p className="text-[10px] text-[var(--text-tertiary)] font-mono tracking-widest uppercase">
                    Progress: {badge.progress} / {badge.total}
                  </p>
                  {badge.total > 1 && (
                    <div className="w-full h-[1px] bg-[var(--border)]">
                      <div 
                        className="h-full bg-[var(--text-tertiary)] transition-all"
                        style={{ width: `${Math.min((badge.progress / badge.total) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
