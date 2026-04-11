'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
  "Engineer",
  "Doctor",
  "Artist",
  "Scientist",
  "Founder",
  "Entrepreneur",
  "Anyone"
];

const getArticle = (word: string) => {
  if (word === "Anyone") return "";
  return ['A', 'E', 'I', 'O', 'U'].includes(word[0]) ? "an " : "a ";
};

export default function CalloutSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-24 md:py-36 px-6 overflow-hidden">
      {/* Unique multi-layered blue/cyan aurora glow — hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true">
        {/* Deep blue base layer */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-[400px] w-[1000px] h-[1000px] bg-[radial-gradient(ellipse_at_center,_rgba(29,78,216,0.35)_0%,_rgba(30,58,138,0.15)_40%,_transparent_70%)] blur-[60px]" />
        {/* Bright sky-blue core highlight */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-[200px] w-[600px] h-[800px] bg-[radial-gradient(ellipse_at_center,_rgba(56,189,248,0.25)_0%,_rgba(59,130,246,0.15)_40%,_transparent_70%)] blur-[40px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto text-center">
        {/* Small animated title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center w-full gap-1 md:gap-3 text-white/40 text-[1.15rem] md:text-[2rem] lg:text-[2.25rem] mb-1 md:mb-12 tracking-tight"
        >
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span>If you&apos;re {getArticle(ROLES[index])}</span>
            <span className="relative inline-block h-[1.4em] min-w-[120px] md:min-w-[200px] overflow-hidden font-medium text-white">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute left-0 right-0 text-center md:text-left whitespace-nowrap"
                >
                  {ROLES[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </motion.div>

        {/* Large callout text */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[1.5rem] sm:text-[2rem] md:text-[3rem] lg:text-[4rem] xl:text-[4.5rem] leading-[1.15] font-light text-white tracking-tight mb-10 md:mb-16 px-1"
        >
          Use this powerful platform to manage your{' '}
          <span
            className="text-[#38BDF8] italic font-medium"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            evidence
          </span>
          , track your{' '}
          <span
            className="text-[#38BDF8] italic font-medium"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            progress
          </span>
          , and unlock{' '}
          <span
            className="text-[#38BDF8] italic font-medium"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            opportunities
          </span>{' '}
          for your O-1 or EB-1 journey.
        </motion.h2>

      </div>
    </section>
  );
}
