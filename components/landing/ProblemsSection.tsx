'use client';

import { motion } from 'framer-motion';
import { Folders, Activity, Rocket } from 'lucide-react';
const FEATURES = [
  {
    icon: Folders,
    num: '01',
    title: 'Manage Evidence',
    description: 'Securely store and organize all your proofs, documents, and key assets in one beautifully designated workspace. No clutter, just clarity.',
    image: '/images/manage.png',
  },
  {
    icon: Activity,
    num: '02',
    title: 'Track Progress',
    description: 'Keep tabs on your milestones. Our intuitive platform helps you visualize your journey smoothly from start to finish.',
    image: '/images/track.png',
  },
  {
    icon: Rocket,
    num: '03',
    title: 'Unlock Opportunities',
    description: 'Present your completed case flawlessly to stakeholders to win approvals and grab new opportunities with absolute confidence.',
    image: '/images/unlock.png',
  },
];

export default function ProblemsSection() {
  return (
    <section className="relative py-20 md:py-48 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Minimalist Header */}
        <div className="flex flex-col items-start mb-14 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-6"
            style={{ fontFamily: '"Satoshi", sans-serif' }}
          >
            FEATURES
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.1] max-w-2xl"
            style={{ fontFamily: '"Satoshi", sans-serif' }}
          >
            All you need is this.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/60 text-base md:text-xl mt-5 md:mt-8 max-w-2xl leading-relaxed font-light"
          >
            HappyWay isn&apos;t just a portfolio builder. It&apos;s a comprehensive workspace designed to centralize your assets, monitor your milestones, and help you present your work elegantly to the world.
          </motion.p>
        </div>

        {/* Border-Driven Minimalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-16">
          {FEATURES.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="group flex flex-col items-start border-t border-white/15 pt-8"
            >
              <div className="flex items-center justify-between w-full mb-10">
                <span className="text-white/20 font-light text-xl" style={{ fontFamily: 'var(--font-mono)' }}>
                  {item.num} {'//'}
                </span>
                <item.icon className="w-5 h-5 text-white/30 group-hover:text-white transition-colors duration-500" strokeWidth={1} />
              </div>
              <h3 className="text-white font-medium text-2xl mb-4 tracking-tight" style={{ fontFamily: '"Satoshi", sans-serif' }}>
                {item.title}
              </h3>
              <p className="text-white/60 text-base leading-relaxed font-light">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
