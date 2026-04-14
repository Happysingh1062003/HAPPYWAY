import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CRITERION_LABELS, formatRelative } from '@/lib/utils';
import { Archive, Compass, Users, Plus, ArrowRight, TrendingUp, Zap, Target } from 'lucide-react';
import Link from 'next/link';
import { AnimatedGauge } from '@/components/dashboard/AnimatedGauge';

const BadgeSVG = ({ earned = false }: { earned: boolean }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width={44} height={44} className={`flex-shrink-0 transition-all duration-500 ${earned ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}>
      <circle cx="128" cy="128" r="110" fill="transparent" stroke="var(--text-primary)" strokeWidth="12" />
      <circle cx="128" cy="128" r="70" fill="var(--text-primary)" />
    </svg>
  );
};

// Demo data
const DEMO_SCORE = 62;
const DEMO_EVIDENCE_COUNT = 14;
const DEMO_CRITERIA_COVERED = 6;
const DEMO_LEVEL = 'Field Contributor';
const DEMO_XP = 2450;

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
  { name: 'Published Author', theme: 'blue', progress: 3, total: 1, earned: true, color: '#3B82F6' },
  { name: 'Award Winner', theme: 'amber', progress: 2, total: 1, earned: true, color: '#F59E0B' },
  { name: 'Evidence Builder', theme: 'purple', progress: 14, total: 20, earned: false, color: '#8B5CF6' },
  { name: 'Visa Ready', theme: 'green', progress: 62, total: 75, earned: false, color: '#10B981' },
  { name: 'Community Contributor', theme: 'red', progress: 2, total: 5, earned: false, color: '#EF4444' },
];

const QUICK_ACTIONS = [
  { href: '/vault', title: 'Add evidence', desc: 'Upload documents to your vault', icon: Plus },
  { href: '/resources', title: 'Add resource', desc: 'Save useful links and documents', icon: Plus },
  { href: '/opportunities', title: 'Find opportunities', desc: 'Discover awards, grants, and more', icon: Compass },
  { href: '/network', title: 'Connect', desc: 'Find collaborators and mentors', icon: Users },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Row 1 — Score + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Approval Gauge */}
        <Card className="lg:col-span-8" padding="lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <AnimatedGauge score={DEMO_SCORE} />

            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display text-3xl mb-2 text-gradient">Approval probability</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Based on {DEMO_EVIDENCE_COUNT} evidence items across {DEMO_CRITERIA_COVERED} criteria
              </p>
              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                <Badge variant="default" pill>Moderate strength</Badge>
                <Badge variant="default" pill>3 gaps remaining</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Stat Cards 2x2 */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          <Card padding="md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center">
                <Archive className="w-3.5 h-3.5 text-[var(--text-primary)]" />
              </div>
            </div>
            <span className="font-mono text-2xl font-bold">{DEMO_EVIDENCE_COUNT}</span>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5 font-medium">Evidence</p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center">
                <Target className="w-3.5 h-3.5 text-[var(--text-primary)]" />
              </div>
            </div>
            <span className="font-mono text-2xl font-bold">{DEMO_CRITERIA_COVERED}<span className="text-sm text-[var(--text-tertiary)] font-medium">/9</span></span>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5 font-medium">Criteria</p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-[var(--text-primary)]" />
              </div>
            </div>
            <span className="text-sm font-semibold">{DEMO_LEVEL}</span>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5 font-medium">Level</p>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-[var(--text-primary)]" />
              </div>
            </div>
            <span className="font-mono text-2xl font-bold">{DEMO_XP.toLocaleString()}</span>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5 font-medium">XP</p>
          </Card>
        </div>
      </div>

      {/* Row 2 — Criterion Heatmap */}
      <div>
        <h2 className="font-display text-xl mb-5 text-gradient">Evidence coverage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(CRITERION_LABELS).map(([key, label]) => {
            const data = DEMO_CRITERION_DATA[key] || { count: 0, score: 0 };
            const isEmpty = data.count === 0;

            return (
              <Link href={`/vault?criterion=${key}`} key={key}>
                <div
                  className={`p-4 rounded-[var(--radius-lg)] transition-all duration-200 cursor-pointer group hover:shadow-[var(--shadow-sm)] ${
                    isEmpty 
                      ? 'bg-[var(--bg-muted)] border-[1.5px] border-dashed border-[var(--border-strong)] opacity-60 hover:border-[var(--text-primary)] hover:opacity-80' 
                      : 'bg-[var(--bg-card)] border-[1.5px] border-solid border-[var(--border)] hover:border-[var(--text-primary)]'
                  }`}
                >
                  <p className="text-xs md:text-sm font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--brand)] transition-colors">{label}</p>
                  <p className={`font-mono text-xl font-bold ${
                    isEmpty ? 'text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'
                  }`}>
                    {data.count}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] font-medium">
                    {data.count === 1 ? 'item' : 'items'}
                  </p>
                  {isEmpty && (
                    <div className="mt-2 text-[0.65rem] uppercase tracking-wider text-[var(--text-primary)] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-3 h-3" /> Add Evidence
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Row 3 — Recent + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-8" padding="lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl text-gradient">Recent activity</h2>
            <Link href="/vault" className="text-xs font-medium text-[var(--brand)] hover:text-[var(--text-tertiary)] transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {DEMO_RECENT.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 px-3 -mx-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--brand-soft)] flex items-center justify-center">
                    <Archive className="w-4 h-4 text-[var(--brand)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-[var(--brand)] transition-colors">{item.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{CRITERION_LABELS[item.criterion]}</p>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-tertiary)] hidden sm:block font-medium">
                  {formatRelative(item.date)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="font-display text-xl mb-2 text-gradient">Quick actions</h2>
          {QUICK_ACTIONS.map((action, i) => (
            <Link href={action.href} key={i}>
              <Card padding="sm" className="flex items-center gap-3 p-4 mb-2 shadow-glow-hover transition-all bg-[var(--bg-card)] group hover:-translate-y-[2px] active:scale-[0.98]">
                <div className={`w-10 h-10 rounded-xl bg-[var(--bg-muted)] flex items-center justify-center group-hover:bg-[var(--text-primary)] transition-colors`}>
                  <action.icon className={`w-4 h-4 text-[var(--text-primary)] group-hover:text-[var(--bg-card)] transition-colors`} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{action.title}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{action.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Row 4 — Badge Progress */}
      <div>
        <h2 className="font-display text-xl mb-5 text-gradient">Milestone progress</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory">
          {DEMO_BADGES.map((badge, i) => (
            <Card key={i} padding="md" className="min-w-[220px] flex-shrink-0 snap-start">
              <div className="flex items-center gap-3 mb-4">
                <BadgeSVG earned={badge.earned} />
                <div>
                  <p className="text-sm font-semibold">{badge.name}</p>
                  {badge.earned ? (
                    <Badge variant="default" className="text-[10px]">Earned</Badge>
                  ) : (
                    <span className="text-xs text-[var(--text-tertiary)] font-medium">{badge.progress}/{badge.total}</span>
                  )}
                </div>
              </div>
              {!badge.earned && (
                <div className="w-full h-2 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-[var(--text-primary)]"
                    style={{ width: `${Math.min((badge.progress / badge.total) * 100, 100)}%` }}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
