'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: "What is the HAPPYWAY platform?",
    answer: "It is a comprehensive dashboard designed specifically for founders, engineers, researchers, and creatives to seamlessly manage and track evidence for their O-1 or EB-1 visa journey."
  },
  {
    question: "How does the evidence tracker work?",
    answer: "Our platform allows you to systematically upload, categorize, and organize your documents mapped against specific USCIS criteria (like awards, publications, and high remuneration), ensuring complete visibility over your petition's strength."
  },
  {
    question: "Is this suitable for my specific visa type?",
    answer: "Absolutely. The platform is deeply architected around the shared 'extraordinary ability' criteria utilized across the top-tier EB-1A, EB-1B, and O-1 visa categories."
  },
  {
    question: "Is my sensitive data secure?",
    answer: "Security is our highest priority. All your sensitive immigration documents, forms, and personal details are encrypted and stored in fully secure, modern cloud infrastructure."
  },
  {
    question: "Does it offer AI-powered assistance?",
    answer: "Yes, our intelligent tools assist in reviewing your documentation flow, helping to identify which visa criteria you are closest to fulfilling and suggesting potential gaps."
  },
  {
    question: "What is the pricing model?",
    answer: "Access to the platform is available for a simple, flat rate of $5 per month, allowing unlimited evidence uploads and comprehensive profile tracking over time."
  },
  {
    question: "Can I export my evidence for final submission?",
    answer: "Not yet — but it's on our roadmap. As our user base grows, we plan to introduce advanced features like evidence export, attorney-ready formatting, and more. Stay tuned!"
  },
  {
    question: "Will I get access to future platform updates?",
    answer: "Of course. All future feature modules, AI upgrades, and UI enhancements are automatically included for all active users at no additional cost."
  },
  {
    question: "Is this a replacement for an immigration lawyer?",
    answer: "No, the HAPPYWAY platform is built to empower you and streamline the overwhelming preparation phase. We strongly advise working alongside a qualified immigration attorney to finalize and file your USCIS petition."
  },
  {
    question: "Why did you build this platform?",
    answer: "I'm personally preparing for an extraordinary ability visa myself. Going through the process, I realized there was no single place where extraordinary professionals could organize their evidence, track milestones, and collaborate — so I decided to build one. HappyWay is born from real experience and built for people like us."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="relative py-16 md:py-32 px-4 md:px-6">
      <div className="max-w-[960px] mx-auto">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center text-xs font-bold tracking-[0.3em] uppercase text-[#38BDF8] mb-4"
        >
          FAQS
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center text-2xl md:text-[3rem] lg:text-[3.5rem] font-medium text-white tracking-tight mb-10 md:mb-16 leading-tight"
        >
          Questions Answered
        </motion.h2>

        {/* Accordion */}
        <div className="flex flex-col gap-2 md:gap-3">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              className="rounded-2xl border border-white/[0.07] bg-transparent overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="flex items-center justify-between w-full px-5 md:px-8 py-5 md:py-8 text-left cursor-pointer group"
                aria-expanded={openIndex === i}
              >
                <span className="text-white text-[15px] md:text-[20px] font-medium pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 md:px-8 pb-5 md:pb-8">
                      <p className="text-white/80 text-[14px] md:text-[17px] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="flex justify-center mt-12"
        >
          <button className="relative px-8 py-3.5 rounded-full bg-white/5 border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)_inset]">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"></div>
            Get it for $5/month
          </button>
        </motion.div>
      </div>
    </section>
  );
}
