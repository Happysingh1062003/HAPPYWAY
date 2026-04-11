'use client';

import { motion } from 'framer-motion';
import { Upload, BarChart3, Rocket } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Evidence',
    description:
      'Seamlessly add documents, awards, publications, and recommendation letters. Our system automatically categorizes them against USCIS criteria.',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Track Your Progress',
    description:
      'Watch your petition strength grow in real-time. Our AI identifies gaps and suggests next steps so you never miss a crucial piece of evidence.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Build Your Case',
    description:
      'Export an attorney-ready evidence package. Collaborate with your legal team directly on the platform and file with absolute confidence.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-20 md:py-36 px-4 md:px-6 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(56,189,248,0.06)_0%,_transparent_70%)] blur-[40px]" />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto">
        {/* Animated pulse anchor */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-0 mb-8"
        >
          {/* Left line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-[1px] bg-gradient-to-l from-[#38BDF8]/60 to-transparent origin-right"
          />
          {/* Pulsing dot */}
          <div className="relative mx-3">
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 w-3 h-3 rounded-full bg-[#38BDF8]/40"
            />
            <div className="w-3 h-3 rounded-full bg-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.6)]" />
          </div>
          {/* Right line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-[1px] bg-gradient-to-r from-[#38BDF8]/60 to-transparent origin-left"
          />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center text-2xl md:text-[2.8rem] lg:text-[3.2rem] font-medium text-white tracking-tight mb-4 md:mb-6 leading-tight"
        >
          Three steps to extraordinary
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center text-white/40 text-sm md:text-lg max-w-[540px] mx-auto mb-12 md:mb-20 tracking-tight"
        >
          From uploading your first document to filing your petition — we make the overwhelming, simple.
        </motion.p>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 * i }}
                className="group relative rounded-[20px] md:rounded-[24px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 md:p-10 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500"
              >
                {/* Subtle top-edge highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-[24px]" />

                {/* Step number */}
                <span className="text-[#38BDF8]/30 text-6xl md:text-7xl font-black absolute top-6 right-8 select-none leading-none tracking-tighter">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center mb-8 group-hover:bg-[#38BDF8]/15 group-hover:border-[#38BDF8]/30 transition-all duration-500">
                  <Icon className="w-5 h-5 text-[#38BDF8]" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-white text-xl md:text-[1.35rem] font-semibold tracking-tight mb-4 leading-snug">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-white/50 text-[15px] leading-relaxed tracking-tight">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Connecting line (desktop only) */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:block absolute top-[60%] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#38BDF8]/20 to-transparent origin-left"
          style={{ zIndex: 0 }}
        />
      </div>
    </section>
  );
}
