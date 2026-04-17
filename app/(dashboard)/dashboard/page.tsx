import { CRITERION_LABELS, formatRelative } from '@/lib/utils';
import { ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';

// Demo data
const DEMO_SCORE = 62;
const DEMO_EVIDENCE_COUNT = 14;
const DEMO_CRITERIA_COVERED = 6;

const DEMO_CRITERION_DATA: Record<string, { count: number; score: number }> = {
  awards: { count: 2, score: 65 },
  membership: { count: 1, score: 45 },
  press: { count: 3, score: 72 },
  judging: { count: 2, score: 58 },
  original_contributions: { count: 3, score: 78 },
  scholarly_articles: { count: 3, score: 82 },
  critical_role: { count: 0, score: 0 },
  high_salary: { count: 0, score: 0 },
  commercial_success: { count: 0, score: 0 },
};

const DEMO_RECENT = [
  { title: 'IEEE Best Paper Award 2024', criterion: 'awards', date: new Date(Date.now() - 86400000) },
  { title: 'Nature Machine Intelligence Publication', criterion: 'scholarly_articles', date: new Date(Date.now() - 172800000) },
  { title: 'TechCrunch Feature Article', criterion: 'press', date: new Date(Date.now() - 345600000) },
  { title: 'ACM Conference Review Panel', criterion: 'judging', date: new Date(Date.now() - 518400000) },
  { title: 'Patent: Neural Architecture Search', criterion: 'original_contributions', date: new Date(Date.now() - 691200000) },
];

const DEMO_BADGES = [
  { name: 'Published Author', progress: 3, total: 1, earned: true },
  { name: 'Award Winner', progress: 2, total: 1, earned: true },
  { name: 'Evidence Builder', progress: 14, total: 20, earned: false },
  { name: 'Visa Ready', progress: 62, total: 75, earned: false },
  { name: 'Community Contributor', progress: 2, total: 5, earned: false },
];

export default function DashboardPage() {
  return (
    <div className="max-w-[960px] mx-auto space-y-16 py-4 animate-fade-in">

      {/* ─── Overview ─── */}
      <section>
        <div className="border-b border-[var(--border)] pb-10 mb-10">
          <p className="text-xs font-mono text-[var(--text-tertiary)] mb-6 tracking-wide uppercase">Overview</p>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl md:text-7xl font-light tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-body)' }}>
              {DEMO_SCORE}%
            </span>
            <span className="text-sm text-[var(--text-tertiary)] font-light">approval probability</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-0 border-b border-[var(--border)]">
          <div className="py-6 pr-6">
            <span className="text-3xl md:text-4xl font-light tracking-tight text-[var(--text-primary)]">{DEMO_EVIDENCE_COUNT}</span>
            <p className="text-xs text-[var(--text-tertiary)] mt-1 font-mono">Evidence</p>
          </div>
          <div className="py-6 px-6 border-x border-[var(--border)]">
            <span className="text-3xl md:text-4xl font-light tracking-tight text-[var(--text-primary)]">{DEMO_CRITERIA_COVERED}<span className="text-lg text-[var(--text-tertiary)]">/9</span></span>
            <p className="text-xs text-[var(--text-tertiary)] mt-1 font-mono">Criteria</p>
          </div>
          <div className="py-6 pl-6">
            <span className="text-3xl md:text-4xl font-light tracking-tight text-[var(--text-primary)]">3</span>
            <p className="text-xs text-[var(--text-tertiary)] mt-1 font-mono">Gaps</p>
          </div>
        </div>
      </section>

      {/* ─── Evidence Coverage ─── */}
      <section>
        <div className="flex items-baseline justify-between mb-8">
          <p className="text-xs font-mono text-[var(--text-tertiary)] tracking-wide uppercase">Evidence Coverage</p>
          <Link href="/vault" className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors font-mono flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {Object.entries(CRITERION_LABELS).map(([key, label], i) => {
            const data = DEMO_CRITERION_DATA[key] || { count: 0, score: 0 };
            const isEmpty = data.count === 0;

            return (
              <Link href={`/vault?criterion=${key}`} key={key}>
                <div
                  className={`group py-6 pr-6 ${
                    i % 3 !== 0 ? 'pl-6 border-l border-[var(--border)]' : ''
                  } ${i < 6 ? 'border-b border-[var(--border)]' : ''} ${
                    isEmpty ? 'opacity-40' : ''
                  } hover:opacity-100 transition-opacity duration-200`}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs text-[var(--text-secondary)] font-medium">{label}</span>
                    {isEmpty && (
                      <Plus className="w-3 h-3 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <span className={`text-2xl font-light tracking-tight ${
                    isEmpty ? 'text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'
                  }`}>
                    {data.count}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)] ml-1.5 font-mono">
                    {data.count === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── Recent Activity ─── */}
      <section>
        <div className="flex items-baseline justify-between mb-8">
          <p className="text-xs font-mono text-[var(--text-tertiary)] tracking-wide uppercase">Recent Activity</p>
          <Link href="/vault" className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors font-mono flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div>
          {DEMO_RECENT.map((item, i) => (
            <div
              key={i}
              className="flex items-baseline justify-between py-4 border-b border-[var(--border)] group hover:bg-[var(--bg-hover)] transition-colors -mx-2 px-2"
            >
              <div className="flex items-baseline gap-4 min-w-0">
                <span className="text-[10px] font-mono text-[var(--text-tertiary)] flex-shrink-0 w-8 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</p>
                  <p className="text-xs text-[var(--text-tertiary)] font-mono mt-0.5">{CRITERION_LABELS[item.criterion]}</p>
                </div>
              </div>
              <span className="text-xs text-[var(--text-tertiary)] font-mono flex-shrink-0 ml-4 hidden sm:block">
                {formatRelative(item.date)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Milestones ─── */}
      <section>
        <p className="text-xs font-mono text-[var(--text-tertiary)] tracking-wide uppercase mb-8">Milestones</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {DEMO_BADGES.map((badge, i) => (
            <div
              key={i}
              className={`py-5 ${i % 3 !== 0 ? 'sm:pl-6 sm:border-l border-[var(--border)]' : ''} ${
                i < 3 ? 'border-b border-[var(--border)]' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">{badge.name}</span>
                {badge.earned ? (
                  <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider">Earned</span>
                ) : (
                  <span className="text-xs font-mono text-[var(--text-tertiary)]">{badge.progress}/{badge.total}</span>
                )}
              </div>
              {!badge.earned && (
                <div className="w-full h-[2px] bg-[var(--bg-muted)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--text-primary)] transition-all duration-700"
                    style={{ width: `${Math.min((badge.progress / badge.total) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Quick Actions ─── */}
      <section className="pb-8">
        <p className="text-xs font-mono text-[var(--text-tertiary)] tracking-wide uppercase mb-6">Actions</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/vault"
            className="px-5 py-2.5 text-xs font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors"
          >
            + Add Evidence
          </Link>
          <Link
            href="/resources"
            className="px-5 py-2.5 text-xs font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors"
          >
            + Add Resource
          </Link>
          <Link
            href="/opportunities"
            className="px-5 py-2.5 text-xs font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors"
          >
            Find Opportunities
          </Link>
          <Link
            href="/network"
            className="px-5 py-2.5 text-xs font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors"
          >
            Connect
          </Link>
        </div>
      </section>

    </div>
  );
}
