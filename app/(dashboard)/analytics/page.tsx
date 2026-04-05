'use client';

import { Card } from '@/components/ui/Card';
import { cn, CRITERION_LABELS, getScoreColor } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useState } from 'react';

// Demo chart data
const SCORE_HISTORY = [
  { date: 'Jan', score: 28 }, { date: 'Feb', score: 32 }, { date: 'Mar', score: 38 },
  { date: 'Apr', score: 42 }, { date: 'May', score: 48 }, { date: 'Jun', score: 52 },
  { date: 'Jul', score: 55 }, { date: 'Aug', score: 58 }, { date: 'Sep', score: 60 },
  { date: 'Oct', score: 62 },
];

const CRITERION_SCORES: Record<string, number> = {
  scholarly_articles: 82, awards: 65, original_contributions: 78,
  press: 72, judging: 58, critical_role: 35,
  membership: 45, high_salary: 20, commercial_success: 0,
};

const GAPS = {
  critical: [
    { criterion: 'high_salary', current: 0, recommended: 2, action: 'Gather salary comparison data and industry compensation surveys' },
    { criterion: 'commercial_success', current: 0, recommended: 2, action: 'Document revenue impact, product adoption metrics, or market influence' },
  ],
  moderate: [
    { criterion: 'critical_role', current: 1, recommended: 3, action: 'Obtain org charts and letters from leadership detailing your unique role' },
    { criterion: 'membership', current: 1, recommended: 2, action: 'Apply for membership in selective professional associations' },
  ],
  strong: [
    { criterion: 'scholarly_articles', current: 3, recommended: 3, action: 'Continue publishing — consider review articles' },
    { criterion: 'original_contributions', current: 3, recommended: 3, action: 'Document citations and downstream impact of your work' },
    { criterion: 'press', current: 3, recommended: 2, action: 'Strong coverage — maintain media relationships' },
  ],
};

const ACTIVITY_WEEKS = Array.from({ length: 52 }, (_weekVal, _weekIdx) =>
  Array.from({ length: 7 }, (_dayVal, _dayIdx) => {
    const rand = Math.random();
    return rand < 0.6 ? 0 : rand < 0.8 ? 1 : rand < 0.9 ? 2 : 3;
  })
);

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'30' | '60' | '90'>('90');

  const chartHeight = 200;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Section 1 — Score Over Time */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl">Approval probability over time</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Your score trajectory</p>
          </div>
          <div className="flex gap-1 bg-[var(--bg-muted)] rounded-lg p-1">
            {(['30', '60', '90'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                  period === p ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-tertiary)]'
                )}
              >
                {p}d
              </button>
            ))}
          </div>
        </div>

        {/* Simple SVG chart */}
        <div className="relative" style={{ height: chartHeight + 40 }}>
          <svg width="100%" height={chartHeight + 40} className="overflow-visible">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(val => (
              <g key={val}>
                <line
                  x1="40" y1={chartHeight - (val / 100) * chartHeight + 10}
                  x2="100%" y2={chartHeight - (val / 100) * chartHeight + 10}
                  stroke="var(--border)" strokeDasharray="4 4"
                />
                <text
                  x="32" y={chartHeight - (val / 100) * chartHeight + 14}
                  fill="var(--text-tertiary)" fontSize="10" textAnchor="end" fontFamily="JetBrains Mono"
                >
                  {val}
                </text>
              </g>
            ))}

            {/* Line + Area */}
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={getScoreColor(62)} stopOpacity="0.2" />
                <stop offset="100%" stopColor={getScoreColor(62)} stopOpacity="0" />
              </linearGradient>
            </defs>

            {SCORE_HISTORY.length > 0 && (
              <>
                <path
                  d={`M ${SCORE_HISTORY.map((d, i) => {
                    const x = 50 + (i / (SCORE_HISTORY.length - 1)) * (100 - 8) * 7;
                    const y = chartHeight - (d.score / 100) * chartHeight + 10;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')} L ${50 + ((SCORE_HISTORY.length - 1) / (SCORE_HISTORY.length - 1)) * (100 - 8) * 7} ${chartHeight + 10} L 50 ${chartHeight + 10} Z`}
                  fill="url(#scoreGrad)"
                />
                <path
                  d={SCORE_HISTORY.map((d, i) => {
                    const x = 50 + (i / (SCORE_HISTORY.length - 1)) * (100 - 8) * 7;
                    const y = chartHeight - (d.score / 100) * chartHeight + 10;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none" stroke={getScoreColor(62)} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                />
                {SCORE_HISTORY.map((d, i) => {
                  const x = 50 + (i / (SCORE_HISTORY.length - 1)) * (100 - 8) * 7;
                  const y = chartHeight - (d.score / 100) * chartHeight + 10;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="var(--bg-card)" stroke={getScoreColor(d.score)} strokeWidth="2" />
                      <text x={x} y={chartHeight + 30} fill="var(--text-tertiary)" fontSize="10" textAnchor="middle" fontFamily="DM Sans">
                        {d.date}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>
      </Card>

      {/* Section 2 — Criterion Breakdown */}
      <Card padding="lg">
        <h2 className="font-serif text-xl mb-6">Criterion breakdown</h2>
        <div className="space-y-3">
          {Object.entries(CRITERION_SCORES)
            .sort((a, b) => b[1] - a[1])
            .map(([key, score]) => (
              <div key={key} className="flex items-center gap-4">
                <span className="text-sm text-[var(--text-secondary)] w-40 flex-shrink-0 truncate">
                  {CRITERION_LABELS[key]}
                </span>
                <div className="flex-1 h-6 bg-[var(--bg-muted)] rounded-md overflow-hidden relative">
                  <div
                    className="h-full rounded-md transition-all duration-700 ease-out"
                    style={{ width: `${score}%`, backgroundColor: getScoreColor(score) }}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs font-medium text-[var(--text-primary)]">
                    {score}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Section 3 — Smart Progress */}
      <Card padding="lg">
        <h2 className="font-serif text-xl mb-4">Smart progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-[var(--bg-muted)]">
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Current pace</p>
            <p className="font-serif text-2xl mb-1">March 2026</p>
            <p className="text-sm text-[var(--text-secondary)]">Estimated petition-ready date</p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--green-bg)]">
            <p className="text-xs text-[var(--green)] uppercase tracking-wider mb-1">Accelerated (3x actions/week)</p>
            <p className="font-serif text-2xl text-[var(--green)] mb-1">November 2025</p>
            <p className="text-sm text-[var(--text-secondary)]">4 months faster</p>
          </div>
        </div>
      </Card>

      {/* Section 4 — Gap Analysis */}
      <div>
        <h2 className="font-serif text-xl mb-4">Gap analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Critical */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[var(--red)]" />
              <h3 className="text-sm font-medium text-[var(--red)]">Critical gaps</h3>
            </div>
            <div className="space-y-3">
              {GAPS.critical.map((gap, i) => (
                <Card key={i} padding="sm" className="p-3 border-[var(--red)] border-opacity-30">
                  <p className="text-sm font-medium mb-1">{CRITERION_LABELS[gap.criterion]}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mb-2">{gap.current}/{gap.recommended} items</p>
                  <p className="text-xs text-[var(--text-secondary)]">{gap.action}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Moderate */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-[var(--amber)]" />
              <h3 className="text-sm font-medium text-[var(--amber)]">Moderate gaps</h3>
            </div>
            <div className="space-y-3">
              {GAPS.moderate.map((gap, i) => (
                <Card key={i} padding="sm" className="p-3">
                  <p className="text-sm font-medium mb-1">{CRITERION_LABELS[gap.criterion]}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mb-2">{gap.current}/{gap.recommended} items</p>
                  <p className="text-xs text-[var(--text-secondary)]">{gap.action}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Strong */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-[var(--green)]" />
              <h3 className="text-sm font-medium text-[var(--green)]">Strong areas</h3>
            </div>
            <div className="space-y-3">
              {GAPS.strong.map((gap, i) => (
                <Card key={i} padding="sm" className="p-3">
                  <p className="text-sm font-medium mb-1">{CRITERION_LABELS[gap.criterion]}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mb-2">{gap.current}/{gap.recommended} items</p>
                  <p className="text-xs text-[var(--text-secondary)]">{gap.action}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 5 — Activity Heatmap */}
      <Card padding="lg">
        <h2 className="font-serif text-xl mb-4">Activity heatmap</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">Your evidence-building activity over the past year</p>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-[3px]" style={{ minWidth: 'max-content' }}>
            {ACTIVITY_WEEKS.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((level, di) => {
                  const colors = ['var(--bg-muted)', 'var(--green-bg)', 'rgba(22,163,74,0.4)', 'var(--green)'];
                  return (
                    <div
                      key={di}
                      className="w-[11px] h-[11px] rounded-sm transition-colors"
                      style={{ backgroundColor: colors[level] }}
                      title={`${level} contribution${level !== 1 ? 's' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-[var(--text-tertiary)]">
            <span>Less</span>
            {[0, 1, 2, 3].map(level => {
              const colors = ['var(--bg-muted)', 'var(--green-bg)', 'rgba(22,163,74,0.4)', 'var(--green)'];
              return <div key={level} className="w-[11px] h-[11px] rounded-sm" style={{ backgroundColor: colors[level] }} />;
            })}
            <span>More</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
