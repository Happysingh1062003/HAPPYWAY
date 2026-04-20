'use client';

import { motion } from 'framer-motion';

export function AnimatedGauge({ score, size = 260, label = "Approval Probability" }: { score: number; size?: number; label?: string }) {
  return (
    <div className="relative flex flex-col justify-end pt-4" style={{ width: size, height: size * 0.8 }} role="meter">
      <div className="mt-auto flex flex-col">
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="flex items-start"
        >
          {/* Brutalist Massive Typography */}
          <span className="text-[7.5rem] font-mono tracking-tighter text-[var(--text-primary)] leading-[0.75] font-semibold">{score}</span>
          <span className="text-2xl font-mono text-[var(--text-tertiary)] ml-1 mt-1">%</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-5"
        >
           <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--text-secondary)] leading-tight block">{label}</span>
        </motion.div>

        {/* Hairline Progress Track */}
        <div className="w-full h-px bg-[var(--border)] mt-6 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="absolute top-0 left-0 bottom-0 bg-[var(--text-primary)]"
          />
        </div>
      </div>
    </div>
  );
}
