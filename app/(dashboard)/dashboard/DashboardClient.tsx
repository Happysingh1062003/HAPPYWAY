'use client';

import { CRITERION_LABELS, formatRelative } from '@/lib/utils';
import { Plus, Target, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedGauge } from '@/components/dashboard/AnimatedGauge';
import { type ScoreProfile } from '@/lib/score';

export interface RecentActivityItem {
  id: string;
  title: string;
  criterion: string;
  date: Date;
}

interface DashboardClientProps {
  scoreProfile: ScoreProfile;
  recentActivity: RecentActivityItem[];
}

const QUICK_ACTIONS = [
  { href: '/vault', label: 'Upload Evidence', icon: Plus, desc: 'Add new items to your vault' },
  { href: '/opportunities', label: 'Discover Grants', icon: Target, desc: 'High-probability matches' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function DashboardClient({ scoreProfile, recentActivity }: DashboardClientProps) {
  const { overallScore, criteriaCovered, totalEvidenceCount, criterionData } = scoreProfile;

  return (
    <motion.div 
      className="max-w-[1100px] mx-auto space-y-8 py-2"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >

      {/* ─── Hero: Zeigarnik Effect & Motivation ─── */}
      <motion.section variants={itemVariants} className="flex flex-col md:flex-row gap-6 items-stretch">
        
        {/* Main Gauge (Zeigarnik Open Loop) */}
        <div className="card p-6 flex flex-col items-center justify-center flex-shrink-0 w-full md:w-[340px]">
          <AnimatedGauge score={overallScore} size={220} label="Current Approval Probability" />
        </div>

        {/* Stats Grid (Loss Aversion / Goal Gradient) */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          <div className="card p-5 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[var(--text-secondary)]" />
                  <p className="text-sm font-medium text-[var(--text-secondary)]">Criteria Met</p>
                </div>
                <span className="text-[10px] text-[var(--text-tertiary)] font-mono">GOAL: 3</span>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex items-end gap-3">
                <span className="stat-number">{criteriaCovered}<span className="text-xl text-[var(--text-tertiary)] ml-1">/ 9</span></span>
              </div>
              
              {/* Goal Gradient Visual */}
              <div className="w-full flex gap-1 mt-3 mb-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-sm ${i < criteriaCovered ? 'bg-[var(--text-primary)]' : i < 3 ? 'bg-[var(--red)] opacity-50' : 'bg-[var(--bg-muted)]'}`} />
                ))}
              </div>
              <p className="text-[10px] text-[var(--text-tertiary)]">{criteriaCovered >= 3 ? 'You have exceeded the minimum required criteria.' : 'You must meet at least 3 criteria.'}</p>
            </div>
          </div>
          
          <div className="card p-5 flex flex-col justify-between flex-1">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[var(--text-secondary)]" />
              <p className="text-sm font-medium text-[var(--text-secondary)]">Total Evidence Count</p>
            </div>
            <div className="mt-auto">
              <span className="stat-number">{totalEvidenceCount}</span>
              <p className="text-[10px] text-[var(--text-tertiary)] mt-2">Volume does not equal strength. High quality required.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── Evidence Coverage ─── */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Evidence Health by Category</h2>
          <Link href="/vault" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
            View Vault
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(CRITERION_LABELS).map(([key, label]) => {
            const data = criterionData[key] || { count: 0, score: 0 };
            const isEmpty = data.count === 0;
            // Psychological color coding: Stark white for strong, dim for empty, red for missing/weak
            const scoreColor = isEmpty ? 'var(--bg-muted)' : data.score >= 70 ? 'var(--text-primary)' : data.score >= 40 ? 'var(--text-secondary)' : 'var(--red)';

            // Qualitative assessment labels instead of arbitrary numbers
            const scoreLabel = isEmpty ? 'Missing' : data.score >= 75 ? 'Strong' : data.score >= 40 ? 'Moderate' : 'Weak';

            return (
              <Link href={`/vault?criterion=${key}`} key={key}>
                <div className={`card p-5 group ${isEmpty ? 'opacity-60 hover:opacity-100' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
                    <span 
                      className="text-[10px] uppercase font-mono" 
                      style={{ color: isEmpty ? 'var(--text-tertiary)' : scoreColor }}
                    >
                      {scoreLabel}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className={`text-2xl font-semibold tracking-tight ${isEmpty ? 'text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'}`}>
                      {data.count}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {data.count === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-[var(--bg-muted)] overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-[75%] w-px bg-[var(--text-primary)] z-10 opacity-30" />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${isEmpty ? 0 : data.score}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      className="h-full transition-colors"
                      style={{ backgroundColor: scoreColor }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ─── Recent Activity (Social Proof / Self Proof) ─── */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Your Momentum</h2>
            <Link href="/vault" className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              See full log ↗
            </Link>
          </div>

          <div className="card p-0 overflow-hidden divide-y divide-[var(--border)]">
            {recentActivity.length === 0 ? (
               <div className="p-8 text-center text-sm text-[var(--text-secondary)]">No recent activity detected. Upload evidence to begin calculating your approval probability.</div>
            ) : null}
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-[var(--bg-hover)] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</p>
                    <p className="text-[10px] uppercase font-mono text-[var(--text-tertiary)] mt-1 tracking-wider">
                      {CRITERION_LABELS[item.criterion as keyof typeof CRITERION_LABELS] || item.criterion}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-tertiary)] flex-shrink-0 ml-4 font-mono hidden sm:block">
                  {formatRelative(item.date)}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ─── Quick Actions ─── */}
        <motion.section variants={itemVariants}>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="card p-4 hover:bg-[var(--bg-muted)] transition-colors h-full flex flex-col justify-center items-center text-center">
                  <action.icon className="w-6 h-6 text-[var(--text-primary)] mb-3" />
                  <p className="text-sm font-medium text-[var(--text-primary)]">{action.label}</p>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-1">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
