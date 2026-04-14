'use client';

import type { LucideIcon } from 'lucide-react';

import { cn, formatDate } from '@/lib/utils';
import { Compass, BookOpen, Feather, Anchor, Radio, Scale, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { motion } from 'framer-motion';

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
  theme: string;
  tierStyles: { bg: string; text: string; };
}

const BADGES: BadgeData[] = [
  { id: '1', name: 'The Genesis', description: 'Established strategic foundation.', details: 'You have successfully taken the first step toward structuring your extraordinary case.', icon: Compass, earned: true, earnedDate: '2024-01-05', progress: 1, total: 1, theme: 'gray', tierStyles: { bg: 'bg-[#C0C0C0]', text: 'text-zinc-900' } },
  { id: '2', name: 'Peer Assessed', description: 'Expertise recognized formally.', details: 'Your work has been rigorously reviewed and recognized closely by elite peers in your specific field.', icon: BookOpen, earned: true, earnedDate: '2024-03-10', progress: 1, total: 1, theme: 'yellow', tierStyles: { bg: 'bg-[#F39C12]', text: 'text-amber-950' } },
  { id: '4', name: 'Alpha Operator', description: 'Verified critical leadership.', details: 'Demonstrated undeniable evidence of taking leading roles in highly distinguished organizations.', icon: Anchor, earned: true, earnedDate: '2024-06-15', progress: 1, total: 1, theme: 'emerald', tierStyles: { bg: 'bg-[#10B981]', text: 'text-emerald-950' } },
  { id: '5', name: 'The Spotlight', description: 'Major international press secured.', details: 'Featured prominently and unequivocally in major global publications regarding your professional work.', icon: Radio, earned: true, earnedDate: '2024-08-20', progress: 1, total: 1, theme: 'rose', tierStyles: { bg: 'bg-[#E84A5F]', text: 'text-rose-100' } },
  { id: '6', name: 'Global Judge', description: 'Adjudicated industry peers.', details: 'Served officially as an elite judge for international competitions and leading journal publications.', icon: Scale, earned: true, earnedDate: '2024-09-02', progress: 1, total: 1, theme: 'purple', tierStyles: { bg: 'bg-[#AE7BCA]', text: 'text-purple-100' } },
  { id: '10', name: 'Market Top 1%', description: 'Exceptional remuneration documented.', details: 'Verifiable evidence of demanding an exceptionally high salary compared to others in your discipline.', icon: Award, earned: false, progress: 0, total: 1, theme: 'gray', tierStyles: { bg: 'bg-[#6B7280]', text: 'text-gray-900' } },
  { id: '11', name: 'Commercially Unrivaled', description: 'Box office and sales success.', details: 'Tangible proof of massive commercial successes in the performing arts or vast market product sales.', icon: Award, earned: false, progress: 0, total: 1, theme: 'cyan', tierStyles: { bg: 'bg-[#0E7490]', text: 'text-cyan-900' } },
  { id: '3', name: 'The Vanguard', description: 'Scholarly publications citing.', details: 'Authored scholarly articles that have established a deeply significant citation footprint globally.', icon: Feather, earned: false, progress: 45, total: 100, theme: 'sky', tierStyles: { bg: 'bg-[#0284C7]', text: 'text-sky-50' } },
  { id: '7', name: 'Unassailable', description: 'Flawless strength achieved.', details: 'Secured absolutely compelling evidence across a minimum of three distinct USCIS criteria.', icon: ShieldCheck, earned: false, progress: 78, total: 100, theme: 'yellow', tierStyles: { bg: 'bg-[#EAB308]', text: 'text-yellow-950' } },
  { id: '8', name: 'The Benchmark', description: 'Original contribution documented.', details: 'Introduced a globally significant, original scientific, engineering, or business contribution.', icon: Sparkles, earned: false, progress: 0, total: 1, theme: 'pink', tierStyles: { bg: 'bg-[#FF0080]', text: 'text-fuchsia-100' } },
  { id: '9', name: 'Extraordinary', description: 'Final I-140 Visa Approval.', details: 'The ultimate achievement. USCIS has formally approved your EB-1A Extraordinary Ability petition.', icon: Award, earned: false, progress: 0, total: 1, theme: 'gold', tierStyles: { bg: 'bg-[#D4AF37]', text: 'text-yellow-950' } },
];

const BadgeSVG = ({ theme, isActive }: { theme: string, isActive: boolean }) => {
  const gradients: Record<string, string[]> = {
    gray: ['#6B7280', '#4B5563', '#374151', '#111827'],
    yellow: ['#B45309', '#92400E', '#78350F', '#451A03'],
    emerald: ['#059669', '#047857', '#065F46', '#022C22'],
    rose: ['#BE123C', '#9F1239', '#881337', '#4C0519'],
    purple: ['#7E22CE', '#6B21A8', '#581C87', '#3B0764'],
    sky: ['#0369A1', '#075985', '#0C4A6E', '#082F49'],
    pink: ['#BE185D', '#9D174D', '#831843', '#500724'],
    cyan: ['#0E7490', '#155E75', '#164E63', '#083344'],
    gold: ['#EAB308', '#B45309', '#78350F', '#451A03'],
  };
  const stops = gradients[theme] || gradients.sky;
  const idPrefix = `grad-${theme}`;
  
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width={64} height={64} className={`absolute inset-0 flex-shrink-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-30 grayscale-[50%]'}`}>
      <defs>
         <radialGradient id={`${idPrefix}-main`} cx="35%" cy="30%" r="70%" fx="35%" fy="30%">
          <stop offset="0%" stopColor={stops[0]}/>
          <stop offset="40%" stopColor={stops[1]}/>
          <stop offset="70%" stopColor={stops[2]}/>
          <stop offset="100%" stopColor={stops[3]}/>
        </radialGradient>
        <radialGradient id="specGradCommon" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)"/>
          <stop offset="60%" stopColor="rgba(255,255,255,0.1)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <circle cx="128" cy="128" r="110" fill={`url(#${idPrefix}-main)`} />
      <ellipse cx="102" cy="70" rx="44" ry="33" fill="url(#specGradCommon)" />
    </svg>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

// Simple Static Badge Component
function StaticBadge({ badge, isActive }: { badge: BadgeData; isActive: boolean }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-16 h-16 rounded-full flex-shrink-0",
        !isActive && "grayscale"
      )}
    >
      <BadgeSVG theme={badge.theme} isActive={isActive} />
    </div>
  );
}

export default function BadgesPage() {
  const earned = BADGES.filter(b => b.earned);
  const inProgress = BADGES.filter(b => !b.earned);

  return (
    <div className="space-y-12 pb-10 perspective-1000">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="font-display text-3xl tracking-tight">Milestones</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          {earned.length} of {BADGES.length} extraordinary achievements secured to your vault.
        </p>
      </motion.div>

      {/* Secured Segment */}
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-[0.15em] mb-4">Secured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {earned.map(badge => (
            <motion.div key={badge.id} variants={itemVariants}>
              <div className="group relative flex flex-col p-6 gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-strong)] transition-colors h-full shadow-[var(--shadow-xs)]">
                <div className="relative flex items-center gap-5 z-10">
                  <StaticBadge badge={badge} isActive={true} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white tracking-tight mb-0.5">{badge.name}</h3>
                    <p className="text-[11px] text-[var(--brand)] font-medium uppercase tracking-widest truncate">{badge.description}</p>
                  </div>
                </div>
                <div className="relative z-10 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-zinc-400 leading-relaxed mb-5">{badge.details}</p>
                  <div className="mt-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/5 text-[10px] font-medium text-white shadow-sm font-mono uppercase tracking-wider backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] shadow-[0_0_8px_var(--brand)] animate-pulse"></span>
                      Secured {formatDate(badge.earnedDate!)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Analyzing Segment */}
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-[0.15em] mb-4">Analyzing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {inProgress.map(badge => (
            <motion.div key={badge.id} variants={itemVariants}>
              <div className="group relative flex flex-col p-6 gap-4 rounded-lg border border-dashed border-[var(--border-strong)] bg-transparent opacity-60 hover:opacity-100 hover:border-solid transition-all h-full">
                <div className="relative flex items-center gap-5 z-10">
                  <StaticBadge badge={badge} isActive={false} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-zinc-300 tracking-tight mb-0.5">{badge.name}</h3>
                    <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-widest truncate">{badge.description}</p>
                  </div>
                </div>
                <div className="relative z-10 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-zinc-500 leading-relaxed mb-5">{badge.details}</p>
                  
                  <div className="mt-auto w-full">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-widest">In Progress</p>
                      <p className="text-[10px] font-mono text-[var(--text-tertiary)]">{badge.progress}/{badge.total}</p>
                    </div>
                    {badge.total > 1 && (
                      <div className="w-full h-1.5 bg-white/5 overflow-hidden rounded-full shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((badge.progress / badge.total) * 100, 100)}%` }}
                          transition={{ duration: 1.5, delay: 0.5, type: 'spring' }}
                          className="h-full bg-zinc-500 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
