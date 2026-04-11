'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  'Unlimited evidence tracking',
  'AI-powered case building',
  'Real-time progress timeline',
  'Attorney collaboration tools',
  'All future features included',
  '24/7 premium support',
];

export default function PricingSection() {
  return (
    <section className="relative py-24 md:py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
        className="relative max-w-[1200px] mx-auto rounded-[20px] md:rounded-[32px] overflow-hidden border border-white/10 bg-[#000000]"
        style={{ cursor: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='%2338BDF8'><filter id='g'><feDropShadow dx='0' dy='0' stdDeviation='1.5' flood-color='%2338BDF8'/></filter><g transform='rotate(-135 12 12)' filter='url(%23g)'><path d='M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H14v4h4v-4h3l2-2v-2h-10.35zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/></g></svg>\") 6 6, auto" }}
      >
        {/* User Uploaded Background with Motion Pulse */}
        <motion.div
          animate={{ scale: [1, 1.02, 1], filter: ['brightness(1)', 'brightness(1.15)', 'brightness(1)'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[url('/Pricing_bg.jpg')] bg-cover bg-bottom bg-no-repeat mix-blend-screen opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black" />
        </motion.div>

        <div className="relative z-10 pt-12 pb-10 md:pt-20 md:pb-16 px-6 md:px-16 flex flex-col items-center">
          {/* Price heading */}
          <h2 className="text-[2rem] md:text-[3rem] tracking-tight mb-8 md:mb-12 flex items-baseline gap-2 justify-center">
            <span style={{ fontFamily: 'var(--font-serif)' }} className="font-semibold text-white">for</span>
            <span
              className="text-[#38BDF8] font-semibold text-[3.5rem] md:text-[4.5rem]"
              style={{ fontFamily: 'var(--font-serif)', textShadow: '0 0 24px rgba(56,189,248,0.5)' }}
            >
              5$
            </span>
            <span className="text-white/60 text-xl md:text-2xl font-medium tracking-normal ml-1 mb-2">/month</span>
          </h2>

          {/* Feature checklist */}
          <div className="flex flex-col gap-4 md:gap-5 mb-10 md:mb-16 items-start w-fit mx-auto">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className="flex items-center gap-4"
              >
                <Check className="w-[18px] h-[18px] text-white flex-shrink-0" strokeWidth={2} />
                <span className="text-[#F3F4F6] font-medium text-[1.1rem] tracking-tight">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-6 w-full">
            {/* White Get Now CTA */}
            <Link
              href="/signup"
              style={{ cursor: "inherit" }}
              className="px-8 py-3.5 bg-white text-black text-sm font-bold rounded-full shadow-[0_0_24px_rgba(255,255,255,0.2)] hover:bg-white/90 hover:scale-105 transition-all w-fit mx-auto"
            >
              Get Now
            </Link>
          </div>
        </div>
      </motion.div>

    </section>
  );
}
