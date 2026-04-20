'use client';

import { Card } from '@/components/ui/Card';
import { cn, CRITERION_LABELS } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Info, TrendingUp, Zap, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Demo chart data
const SCORE_HISTORY = [
  { date: 'Jan', score: 28 }, { date: 'Feb', score: 32 }, { date: 'Mar', score: 38 },
  { date: 'Apr', score: 42 }, { date: 'May', score: 48 }, { date: 'Jun', score: 52 },
  { date: 'Jul', score: 55 }, { date: 'Aug', score: 58 }, { date: 'Sep', score: 60 },
  { date: 'Oct', score: 62 },
];

// Projected trajectories (Psychology: Loss Aversion)
const SCORE_PROJECTION = [
  { date: 'Nov', score: 65, decay: 62, optimal: 75 },
  { date: 'Dec', score: 68, decay: 60, optimal: 85 },
  { date: 'Jan', score: 70, decay: 58, optimal: 92 },
];

const CRITERION_SCORES: Record<string, number> = {
  scholarly_articles: 82, awards: 65, original_contributions: 78,
  press: 72, judging: 58, critical_role: 35,
  membership: 45, high_salary: 20, commercial_success: 0,
};

const GAPS = {
  critical: [
    { criterion: 'high_salary', risk: 'Probability drops 15% without tier-1 anchor data', action: 'Gather salary comparison data immediately' },
    { criterion: 'commercial_success', risk: 'Petition stalls at RFE (Request for Evidence)', action: 'Document revenue impact ASAP' },
  ],
  moderate: [
    { criterion: 'critical_role', risk: 'Limits overall petition authority', action: 'Obtain org charts and leadership recommendation letters' },
  ]
};

const ACTIVITY_WEEKS = Array.from({ length: 52 }, (_weekVal, _weekIdx) =>
  Array.from({ length: 7 }, (_dayVal, _dayIdx) => {
    const rand = Math.random();
    return rand < 0.6 ? 0 : rand < 0.8 ? 1 : rand < 0.9 ? 2 : 3;
  })
);

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'30' | '60' | '90'>('90');
  const chartHeight = 220;

  // Radar Chart Math
  const criteriaKeys = Object.keys(CRITERION_SCORES);
  const numCriteria = criteriaKeys.length;
  const radarRadius = 80;
  const radarCenter = 100;
  const angleStep = (Math.PI * 2) / numCriteria;

  const points = criteriaKeys.map((key, i) => {
    const score = CRITERION_SCORES[key];
    const r = (score / 100) * radarRadius;
    const x = (radarCenter + r * Math.sin(i * angleStep)).toFixed(2);
    const y = (radarCenter - r * Math.cos(i * angleStep)).toFixed(2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <motion.div className="max-w-[1100px] mx-auto space-y-8 py-2" variants={containerVariants} initial="hidden" animate="show">
      
      {/* ─── Trajectory & Loss Aversion ─── */}
      <motion.div variants={itemVariants}>
        <Card padding="lg" className="border-[var(--border-strong)] relative overflow-hidden">
          {/* Subtle warning gradient tint */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--red)] opacity-[0.03] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="text-base font-semibold">Approval Trajectory Pipeline</h2>
              <p className="text-sm text-[var(--text-tertiary)] mt-1">Predictive modeling of your petition success based on current velocity</p>
            </div>
            <div className="flex gap-1 bg-[var(--bg-muted)] p-1 rounded-[var(--radius-md)] border border-[var(--border)]">
              {(['30', '60', '90'] as const).map(p => (
                <button
                  key={p} onClick={() => setPeriod(p)}
                  className={cn(
                    'px-3 py-1 text-xs font-medium rounded-[var(--radius-sm)] transition-colors',
                    period === p ? 'bg-[var(--bg)] text-[var(--text-primary)] border border-[var(--border-strong)] shadow-sm' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] border border-transparent'
                  )}
                >
                  {p}d
                </button>
              ))}
            </div>
          </div>

          <div className="relative" style={{ height: chartHeight + 40 }}>
            <svg width="100%" height={chartHeight + 40} className="overflow-visible">
              {[0, 25, 50, 75, 100].map(val => (
                <g key={val}>
                  <line x1="40" y1={chartHeight - (val / 100) * chartHeight + 10} x2="100%" y2={chartHeight - (val / 100) * chartHeight + 10} stroke="var(--border)" strokeDasharray="4 4" />
                  <text x="30" y={chartHeight - (val / 100) * chartHeight + 14} fill="var(--text-tertiary)" fontSize="11" textAnchor="end" fontFamily="var(--font-mono)">{val}</text>
                </g>
              ))}

              {/* Historical Line */}
              <motion.path
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
                d={SCORE_HISTORY.map((d, i) => {
                  const x = 50 + (i / (SCORE_HISTORY.length + SCORE_PROJECTION.length - 1)) * (100 - 8) * 7;
                  const y = chartHeight - (d.score / 100) * chartHeight + 10;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />

              {/* Optimal Projection (Goal) */}
              <motion.path
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
                d={`M ${50 + ((SCORE_HISTORY.length - 1) / (SCORE_HISTORY.length + SCORE_PROJECTION.length - 1)) * (100 - 8) * 7} ${chartHeight - (SCORE_HISTORY[SCORE_HISTORY.length - 1].score / 100) * chartHeight + 10} ` + 
                SCORE_PROJECTION.map((d, i) => {
                  const x = 50 + ((i + SCORE_HISTORY.length) / (SCORE_HISTORY.length + SCORE_PROJECTION.length - 1)) * (100 - 8) * 7;
                  const y = chartHeight - (d.optimal / 100) * chartHeight + 10;
                  return `L ${x} ${y}`;
                }).join(' ')}
                fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 4"
              />

              {/* Decay Projection (Risk) */}
              <motion.path
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
                d={`M ${50 + ((SCORE_HISTORY.length - 1) / (SCORE_HISTORY.length + SCORE_PROJECTION.length - 1)) * (100 - 8) * 7} ${chartHeight - (SCORE_HISTORY[SCORE_HISTORY.length - 1].score / 100) * chartHeight + 10} ` + 
                SCORE_PROJECTION.map((d, i) => {
                  const x = 50 + ((i + SCORE_HISTORY.length) / (SCORE_HISTORY.length + SCORE_PROJECTION.length - 1)) * (100 - 8) * 7;
                  const y = chartHeight - (d.decay / 100) * chartHeight + 10;
                  return `L ${x} ${y}`;
                }).join(' ')}
                fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 4"
              />

              {/* Labels for projections */}
              <text x="100%" y={chartHeight - (SCORE_PROJECTION[2].optimal / 100) * chartHeight + 10} fill="var(--accent)" fontSize="11" textAnchor="end" transform="translate(0, -10)">Action Plan</text>
              <text x="100%" y={chartHeight - (SCORE_PROJECTION[2].decay / 100) * chartHeight + 10} fill="var(--red)" fontSize="11" textAnchor="end" transform="translate(0, 15)">Inaction</text>

            </svg>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ─── Profile Radar (Visual Identity) ─── */}
        <motion.div variants={itemVariants}>
          <Card padding="lg" className="h-full flex flex-col justify-center items-center">
             <h2 className="text-base font-semibold w-full mb-6">Profile Shape Assessment</h2>
             <div className="relative" style={{ width: 200, height: 200 }}>
                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                  {/* Grid Web */}
                  {[0.25, 0.5, 0.75, 1].map(scale => (
                     <polygon 
                        key={scale}
                        points={criteriaKeys.map((_, i) => `${(radarCenter + radarRadius * scale * Math.sin(i * angleStep)).toFixed(2)},${(radarCenter - radarRadius * scale * Math.cos(i * angleStep)).toFixed(2)}`).join(' ')}
                        fill="none" stroke="var(--border)" strokeWidth="1"
                     />
                  ))}
                  {/* Axes */}
                  {criteriaKeys.map((_, i) => (
                     <line 
                        key={i} x1={radarCenter} y1={radarCenter} 
                        x2={(radarCenter + radarRadius * Math.sin(i * angleStep)).toFixed(2)} 
                        y2={(radarCenter - radarRadius * Math.cos(i * angleStep)).toFixed(2)} 
                        stroke="var(--border)" strokeWidth="1"
                     />
                  ))}
                  {/* Data Polygon */}
                  <motion.polygon 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                    points={points} 
                    fill="var(--bg-muted)" 
                    stroke="var(--text-primary)" strokeWidth="2" 
                    className="transform origin-center"
                  />
                  {/* Axis Labels */}
                  {criteriaKeys.map((key, i) => {
                     const isTop = Math.cos(i * angleStep) > 0.5;
                     const x = (radarCenter + (radarRadius + 15) * Math.sin(i * angleStep)).toFixed(2);
                     const y = (radarCenter - (radarRadius + 15) * Math.cos(i * angleStep)).toFixed(2);
                     return (
                        <text key={i} x={x} y={y} fontSize="8" fill="var(--text-secondary)" textAnchor="middle" dominantBaseline="middle">
                           {CRITERION_LABELS[key].substring(0, 8)}..
                        </text>
                     );
                  })}
                </svg>
             </div>
             <p className="text-xs text-[var(--text-tertiary)] mt-6 text-center">Your profile is highly skewed towards academic metrics. Need diversification to avoid narrow pigeon-holing.</p>
          </Card>
        </motion.div>

        {/* ─── Risks & Gaps (Zeigarnik + Loss Aversion) ─── */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-base font-semibold mb-2">Vulnerabilities Preventing Approval</h2>
          
          <div className="space-y-3">
            {GAPS.critical.map((gap, i) => (
              <div key={i} className="card p-4 border-[var(--red)] border-l-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-[var(--red)]" />
                  <p className="text-sm font-medium text-[var(--text-primary)]">{CRITERION_LABELS[gap.criterion]}</p>
                </div>
                <p className="text-xs font-semibold text-[var(--red)] mb-2 mt-2 font-mono">RISK: {gap.risk}</p>
                <div className="flex gap-2 items-center bg-[var(--bg-muted)] p-2 rounded text-xs text-[var(--text-secondary)]">
                   <Zap className="w-3.5 h-3.5 text-[var(--accent)]" /> {gap.action}
                </div>
              </div>
            ))}
            
            {GAPS.moderate.map((gap, i) => (
              <div key={i} className="card p-4 border-[var(--border)] border-l-4">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="w-4 h-4 text-[var(--text-tertiary)]" />
                  <p className="text-sm font-medium text-[var(--text-primary)]">{CRITERION_LABELS[gap.criterion]}</p>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mb-2 mt-2 font-mono">RISK: {gap.risk}</p>
                <div className="flex gap-2 items-center bg-[var(--bg-muted)] p-2 rounded text-xs text-[var(--text-secondary)]">
                   <TrendingUp className="w-3.5 h-3.5" /> {gap.action}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
