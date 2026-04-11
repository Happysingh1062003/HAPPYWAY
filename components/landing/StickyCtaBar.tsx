'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';

export default function StickyCtaBar() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > 400);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Link
            href="/signup"
            className="flex items-center px-8 py-3.5 rounded-full bg-[#162544]/90 backdrop-blur-md border border-white/10 text-white text-sm font-medium shadow-[0_8px_32px_rgba(10,22,40,0.6)] hover:bg-[#1D3461]/90 transition-colors"
          >
            Get it for $10
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
