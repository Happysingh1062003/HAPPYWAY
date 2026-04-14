'use client';

export function AnimatedGauge({ score }: { score: number }) {
  return (
    <div className="relative w-48 h-48 flex-shrink-0" role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label="Approval probability">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <linearGradient id="scoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#666666" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="100" cy="100" r="85" fill="none" stroke="var(--bg-muted)" strokeWidth="14" />
        <circle
          cx="100" cy="100" r="85" fill="none"
          stroke="url(#scoreGlow)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 85}`}
          strokeDashoffset={`${2 * Math.PI * 85 * (1 - score / 100)}`}
          className="transition-all duration-1000 ease-out"
          style={{ filter: 'url(#glow)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold text-[var(--brand)]">
          {score}%
        </span>
        <span className="text-xs text-[var(--text-tertiary)] mt-1 font-medium">probability</span>
      </div>
    </div>
  );
}
