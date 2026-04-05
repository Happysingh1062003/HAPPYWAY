'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CRITERION_LABELS, getScoreColor, formatRelative } from '@/lib/utils';
import { Archive, Compass, Users, Plus, ArrowRight, TrendingUp, Zap, Target } from 'lucide-react';
import Link from 'next/link';

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
  { name: 'Published Author', icon: '📚', progress: 3, total: 1, earned: true, color: '#2563EB' },
  { name: 'Award Winner', icon: '🏆', progress: 2, total: 1, earned: true, color: '#D97706' },
  { name: 'Evidence Builder', icon: '🗄️', progress: 14, total: 20, earned: false, color: '#65A30D' },
  { name: 'Visa Ready', icon: '🛡️', progress: 62, total: 75, earned: false, color: '#16A34A' },
  { name: 'Community Contributor', icon: '🔗', progress: 2, total: 5, earned: false, color: '#8B5CF6' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Row 1 — Score + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Approval Gauge */}
        <Card className="lg:col-span-8" padding="lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Circular Gauge */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="85" fill="none" stroke="var(--bg-muted)" strokeWidth="12" />
                <circle
                  cx="100" cy="100" r="85" fill="none"
                  stroke={getScoreColor(DEMO_SCORE)}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 85}`}
                  strokeDashoffset={`${2 * Math.PI * 85 * (1 - DEMO_SCORE / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-4xl font-medium" style={{ color: getScoreColor(DEMO_SCORE) }}>
                  {DEMO_SCORE}%
                </span>
                <span className="text-xs text-[var(--text-tertiary)] mt-1">probability</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="font-serif text-2xl mb-2">Approval probability</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Based on {DEMO_EVIDENCE_COUNT} evidence items across {DEMO_CRITERIA_COVERED} criteria
              </p>
              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                <Badge variant="amber" pill>Moderate strength</Badge>
                <Badge variant="blue" pill>3 gaps remaining</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Stat Cards 2x2 */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Archive className="w-4 h-4 text-[var(--text-tertiary)]" />
              <span className="text-xs text-[var(--text-secondary)]">Evidence</span>
            </div>
            <span className="font-mono text-2xl font-medium">{DEMO_EVIDENCE_COUNT}</span>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[var(--text-tertiary)]" />
              <span className="text-xs text-[var(--text-secondary)]">Criteria</span>
            </div>
            <span className="font-mono text-2xl font-medium">{DEMO_CRITERIA_COVERED}<span className="text-sm text-[var(--text-tertiary)]">/9</span></span>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[var(--text-tertiary)]" />
              <span className="text-xs text-[var(--text-secondary)]">Level</span>
            </div>
            <span className="text-sm font-medium">{DEMO_LEVEL}</span>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[var(--text-tertiary)]" />
              <span className="text-xs text-[var(--text-secondary)]">XP</span>
            </div>
            <span className="font-mono text-2xl font-medium">{DEMO_XP.toLocaleString()}</span>
          </Card>
        </div>
      </div>

      {/* Row 2 — Criterion Heatmap */}
      <div>
        <h2 className="font-serif text-xl mb-4">Evidence coverage</h2>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(CRITERION_LABELS).map(([key, label]) => {
            const data = DEMO_CRITERION_DATA[key] || { count: 0, score: 0 };
            const bg = data.count === 0 ? 'var(--red-bg)' : data.count <= 2 ? 'var(--amber-bg)' : 'var(--green-bg)';
            const textColor = data.count === 0 ? 'var(--red)' : data.count <= 2 ? 'var(--amber)' : 'var(--green)';

            return (
              <Link href={`/vault?criterion=${key}`} key={key}>
                <div
                  className="p-3 md:p-4 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] transition-all duration-150 cursor-pointer group"
                  style={{ backgroundColor: bg }}
                >
                  <p className="text-xs md:text-sm font-medium text-[var(--text-primary)] mb-1 group-hover:underline underline-offset-2">{label}</p>
                  <p className="font-mono text-lg md:text-xl font-medium" style={{ color: textColor }}>
                    {data.count}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {data.count === 1 ? 'item' : 'items'}
                  </p>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">Recent activity</h2>
            <Link href="/vault" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {DEMO_RECENT.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center">
                    <Archive className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{CRITERION_LABELS[item.criterion]}</p>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-tertiary)] hidden sm:block">{formatRelative(item.date)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="font-serif text-lg mb-1">Quick actions</h2>
          <Link href="/vault">
            <Card padding="sm" className="flex items-center gap-3 p-3 mb-2 hover:bg-[var(--bg-hover)]">
              <div className="w-9 h-9 rounded-lg bg-[var(--green-bg)] flex items-center justify-center">
                <Plus className="w-4 h-4 text-[var(--green)]" />
              </div>
              <div>
                <p className="text-sm font-medium">Add evidence</p>
                <p className="text-xs text-[var(--text-tertiary)]">Upload documents to your vault</p>
              </div>
            </Card>
          </Link>
          <Link href="/resources">
            <Card padding="sm" className="flex items-center gap-3 p-3 mb-2 hover:bg-[var(--bg-hover)]">
              <div className="w-9 h-9 rounded-lg bg-[var(--blue-bg)] flex items-center justify-center">
                <Plus className="w-4 h-4 text-[var(--blue)]" />
              </div>
              <div>
                <p className="text-sm font-medium">Add resource</p>
                <p className="text-xs text-[var(--text-tertiary)]">Save useful links and documents</p>
              </div>
            </Card>
          </Link>
          <Link href="/opportunities">
            <Card padding="sm" className="flex items-center gap-3 p-3 mb-2 hover:bg-[var(--bg-hover)]">
              <div className="w-9 h-9 rounded-lg bg-[var(--amber-bg)] flex items-center justify-center">
                <Compass className="w-4 h-4 text-[var(--amber)]" />
              </div>
              <div>
                <p className="text-sm font-medium">Find opportunities</p>
                <p className="text-xs text-[var(--text-tertiary)]">Discover awards, grants, and more</p>
              </div>
            </Card>
          </Link>
          <Link href="/network">
            <Card padding="sm" className="flex items-center gap-3 p-3 hover:bg-[var(--bg-hover)]">
              <div className="w-9 h-9 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center">
                <Users className="w-4 h-4 text-[var(--text-secondary)]" />
              </div>
              <div>
                <p className="text-sm font-medium">Connect</p>
                <p className="text-xs text-[var(--text-tertiary)]">Find collaborators and mentors</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Row 4 — Badge Progress */}
      <div>
        <h2 className="font-serif text-xl mb-4">Milestone progress</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {DEMO_BADGES.map((badge, i) => (
            <Card key={i} padding="md" className="min-w-[200px] flex-shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: badge.color + '15', color: badge.color }}
                >
                  {badge.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{badge.name}</p>
                  {badge.earned ? (
                    <Badge variant="green" className="text-[10px]">Earned</Badge>
                  ) : (
                    <span className="text-xs text-[var(--text-tertiary)]">{badge.progress}/{badge.total}</span>
                  )}
                </div>
              </div>
              {!badge.earned && (
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((badge.progress / badge.total) * 100, 100)}%`, backgroundColor: badge.color }}
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
