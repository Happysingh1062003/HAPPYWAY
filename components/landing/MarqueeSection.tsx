'use client';

import { motion } from 'framer-motion';

const ROW_1 = [
  'Engineers',
  'Founders',
  'Scientists',
  'Researchers',
  'Artists',
  'Athletes',
  'Doctors',
  'Entrepreneurs',
  'Architects',
  'Musicians',
];

const ROW_2 = [
  'O-1 Visa',
  'EB-1A',
  'EB-1B',
  'Extraordinary Ability',
  'Outstanding Researcher',
  'Published Work',
  'National Awards',
  'High Salary',
  'Critical Role',
  'Major Contributions',
];

function MarqueeRow({
  items,
  direction = 'left',
  duration = 40,
  muted = false,
}: {
  items: string[];
  direction?: 'left' | 'right';
  duration?: number;
  muted?: boolean;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden w-full">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex items-center gap-6 md:gap-10 whitespace-nowrap w-fit"
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`text-[2rem] md:text-[3rem] lg:text-[3.8rem] font-semibold tracking-tight select-none flex items-center gap-6 md:gap-10 ${
              muted ? 'text-white/[0.07]' : 'text-white/[0.12]'
            }`}
          >
            {item}
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]/40 flex-shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function MarqueeSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(56,189,248,0.05)_0%,_transparent_70%)] blur-[60px]" />
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        <MarqueeRow items={ROW_1} direction="left" duration={35} />
        <MarqueeRow items={ROW_2} direction="right" duration={45} muted />
      </div>
    </section>
  );
}
