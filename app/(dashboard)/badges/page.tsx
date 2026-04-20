'use client';

import type { LucideIcon } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Compass, BookOpen, Feather, Anchor, Radio, Scale, ShieldCheck, Sparkles, Award, CheckCircle, Lock } from 'lucide-react';

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
    <div className="max-w-[1100px] mx-auto space-y-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-[var(--border)] pb-6">
        <h1 className="text-xl font-medium text-[var(--text-primary)]">Milestones</h1>
        <div className="px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--bg-muted)] text-[11px] font-mono text-[var(--text-secondary)]">
           {earned.length} / {BADGES.length} SECURED
        </div>
      </div>

      {/* Secured Segment */}
      <section>
        <h2 className="text-sm font-medium text-[var(--text-primary)] mb-6">Secured Milestones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {earned.map(badge => (
            <div key={badge.id} className="card p-5 relative">
              <div className="absolute top-5 right-5">
                <CheckCircle className="w-4 h-4 text-[var(--text-primary)]" />
              </div>

              <div className="mb-4">
                <badge.icon className="w-5 h-5 text-[var(--text-secondary)]" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-sm font-medium text-[var(--text-primary)] leading-tight mb-2">{badge.name}</h3>
              <p className="text-xs text-[var(--text-tertiary)] mb-4">{badge.description}</p>
              
              <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest">Achieved</span>
                <span className="text-[11px] font-mono text-[var(--text-primary)]">
                  {formatDate(badge.earnedDate!)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* In Progress Segment */}
      <section>
        <h2 className="text-sm font-medium text-[var(--text-primary)] mb-6">In Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inProgress.map(badge => {
            const pct = badge.total > 1 ? Math.min((badge.progress / badge.total) * 100, 100) : 0;
            const isLocked = badge.progress === 0 && badge.total === 1;

            return (
              <div key={badge.id} className={cn("card p-5", isLocked && "opacity-50 grayscale")}>
                
                <div className="flex justify-between items-start mb-4">
                  <badge.icon className="w-5 h-5 text-[var(--text-tertiary)]" strokeWidth={1.5} />
                  {isLocked && <Lock className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />}
                </div>

                <h3 className="text-sm font-medium text-[var(--text-primary)] leading-tight mb-2">{badge.name}</h3>
                <p className="text-xs text-[var(--text-tertiary)] mb-6">{badge.description}</p>
                
                {badge.total > 1 && (
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-mono text-[var(--text-tertiary)]">{badge.progress} / {badge.total}</span>
                       <span className="text-[10px] font-mono text-[var(--text-primary)]">{Math.round(pct)}%</span>
                    </div>
                    <div className="w-full h-1 bg-[var(--bg-muted)] overflow-hidden">
                      <div 
                        className="h-full bg-[var(--text-primary)] transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {badge.total === 1 && !isLocked && (
                  <div className="mt-auto pt-4 border-t border-[var(--border)]">
                    <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest">In Progress</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
