'use client';

import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn, formatDate } from '@/lib/utils';
import { Compass, BookOpen, Feather, Anchor, Radio, Scale, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
  earnedDate?: string;
  progress: number;
  total: number;
  tierStyles: {
    bg: string;
    border: string;
    text: string;
  };
}

const BADGES: BadgeData[] = [
  { id: '1', name: 'The Genesis', description: 'Established strategic foundation.', icon: Compass, earned: true, earnedDate: '2024-01-05', progress: 1, total: 1, 
    tierStyles: { bg: 'bg-gradient-to-br from-[#E5E4E2] via-[#C0C0C0] to-[#8C8C8C]', border: 'border-[#E5E4E2]/50', text: 'text-zinc-900' } }, // 1. Platinum / Silver
  { id: '2', name: 'Peer Assessed', description: 'Expertise recognized formally.', icon: BookOpen, earned: true, earnedDate: '2024-03-10', progress: 1, total: 1, 
    tierStyles: { bg: 'bg-gradient-to-br from-[#FFD700] via-[#F39C12] to-[#B9770E]', border: 'border-[#FFD700]/50', text: 'text-amber-950' } }, // 2. Gold
  { id: '4', name: 'Alpha Operator', description: 'Verified critical leadership.', icon: Anchor, earned: true, earnedDate: '2024-06-15', progress: 1, total: 1, 
    tierStyles: { bg: 'bg-gradient-to-br from-[#6EE7B7] via-[#10B981] to-[#047857]', border: 'border-[#10B981]/50', text: 'text-emerald-950' } }, // 3. Jade / Emerald
  { id: '5', name: 'The Spotlight', description: 'Major international press secured.', icon: Radio, earned: true, earnedDate: '2024-08-20', progress: 1, total: 1, 
    tierStyles: { bg: 'bg-gradient-to-br from-[#FDA403] via-[#E84A5F] to-[#2B2E4A]', border: 'border-[#E84A5F]/50', text: 'text-rose-100' } }, // 4. Ruby / Blood Moon
  { id: '6', name: 'Global Judge', description: 'Adjudicated industry peers.', icon: Scale, earned: true, earnedDate: '2024-09-02', progress: 1, total: 1, 
    tierStyles: { bg: 'bg-gradient-to-br from-[#D8B4E2] via-[#AE7BCA] to-[#6A3093]', border: 'border-[#AE7BCA]/50', text: 'text-purple-100' } }, // 5. Amethyst / Purple
  { id: '3', name: 'The Vanguard', description: 'Scholarly publications citing.', icon: Feather, earned: false, progress: 45, total: 100, 
    tierStyles: { bg: 'bg-gradient-to-b from-[#7DD3FC] via-[#0284C7] to-[#0C4A6E]', border: 'border-[#0284C7]/50', text: 'text-sky-50' } }, // 6. Sapphire / Deep Blue
  { id: '7', name: 'Unassailable', description: 'Flawless strength achieved.', icon: ShieldCheck, earned: false, progress: 78, total: 100, 
    tierStyles: { bg: 'bg-gradient-to-b from-[#FDE047] via-[#EAB308] to-[#A16207]', border: 'border-[#EAB308]/50', text: 'text-yellow-950' } }, // 7. Topaz / Amber
  { id: '8', name: 'The Benchmark', description: 'Original contribution documented.', icon: Sparkles, earned: false, progress: 0, total: 1, 
    tierStyles: { bg: 'bg-gradient-to-tr from-[#FF0080] via-[#7928CA] to-[#FF0080]', border: 'border-[#7928CA]/50', text: 'text-fuchsia-100' } }, // 8. Neon Magenta
  { id: '9', name: 'Extraordinary', description: 'Final I-140 Visa Approval.', icon: Award, earned: false, progress: 0, total: 1, 
    tierStyles: { bg: 'bg-gradient-to-tr from-[#00F2FE] via-[#4FACFE] to-[#00F2FE]', border: 'border-[#4FACFE]/50', text: 'text-cyan-950' } }, // 9. Diamond / Cyan Glow
];

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

// Advanced 3D Hover Component
function TiltBadge({ badge, isActive }: { badge: BadgeData; isActive: boolean }) {
  const Icon = badge.icon;
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Damped springs for smooth physical movement
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  // Map mouse position mathematically to 3D rotation outputs
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);
  
  // Specular gleam calculation relative to mouse tilt
  const glareOpacity = useTransform(mouseXSpring, [-0.5, 0.5], [0, 0.5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate normalized -0.5 to 0.5 positions
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);  y.set(0); 
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.15, zIndex: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative flex items-center justify-center w-16 h-16 rounded-[1.25rem] flex-shrink-0 cursor-crosshair",
        "shadow-2xl border backdrop-blur-xl",
        badge.tierStyles.bg,
        badge.tierStyles.border,
        !isActive && "opacity-40 grayscale"
      )}
    >
      {/* 3D Depth Inner Shadow */}
      <div className="absolute inset-0 rounded-[1.25rem] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] pointer-events-none mix-blend-overlay" />
      
      {/* Dynamic Specular Glare matching mouse tilt */}
      <motion.div 
        style={{ opacity: glareOpacity }}
        className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none rotate-45 scale-150 mix-blend-overlay"
      />

      {/* Pulsing Core Icon */}
      <motion.div 
        animate={{ filter: isActive ? ["brightness(1)", "brightness(1.5)", "brightness(1)"] : "brightness(1)" }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "translateZ(30px)" }} // Pop out in 3D space
      >
         <Icon className={cn("w-7 h-7 drop-shadow-md", badge.tierStyles.text)} strokeWidth={1.5} />
      </motion.div>
    </motion.div>
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
        <h1 className="font-serif text-3xl tracking-tight">Milestones</h1>
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
              <Card className="relative flex items-center gap-5 p-5 group transition-colors duration-500 hover:border-[var(--text-tertiary)] bg-[var(--bg-card)]/50 backdrop-blur-xl border border-[var(--border)] overflow-hidden">
                <TiltBadge badge={badge} isActive={true} />
                <div className="flex-1 min-w-0 z-10">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1 truncate">{badge.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-3 truncate">{badge.description}</p>
                  <div className="inline-flex shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] items-center rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-2.5 py-0.5 text-[10px] font-medium text-[var(--text-primary)]">
                    Secured {formatDate(badge.earnedDate!)}
                  </div>
                </div>
              </Card>
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
              <Card className="relative flex items-center gap-5 p-5 bg-[var(--bg-subtle)] border border-dashed border-[var(--border)] overflow-hidden">
                <TiltBadge badge={badge} isActive={false} />
                <div className="flex-1 min-w-0 z-10">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] truncate">{badge.name}</h3>
                    <motion.span 
                      animate={{ opacity: [0.5, 1, 0.5] }} 
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-[10px] font-mono text-[var(--text-tertiary)] flex-shrink-0"
                    >
                      {badge.progress}/{badge.total}
                    </motion.span>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mb-4 truncate">{badge.description}</p>
                  
                  {badge.total > 1 && (
                    <div className="w-full h-1.5 rounded-full bg-[var(--border)]/50 overflow-hidden relative shadow-inner">
                       {/* Animated Tracking Line targeting the explicit border color of the badge to tie layouts together */}
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((badge.progress / badge.total) * 100, 100)}%` }}
                        transition={{ duration: 1.5, delay: 0.5, type: 'spring' }}
                        className={cn("absolute top-0 left-0 h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]", badge.tierStyles.bg)} 
                      />
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
