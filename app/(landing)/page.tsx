'use client';

import HeroSection from '@/components/landing/HeroSection';
import ProblemsSection from '@/components/landing/ProblemsSection';
import MarqueeSection from '@/components/landing/MarqueeSection';
import CalloutSection from '@/components/landing/CalloutSection';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import Link from 'next/link';
import OrbLogo from '@/components/landing/OrbLogo';
import SmoothScroll from '@/components/SmoothScroll';

export default function LandingPage() {
  return (
    <SmoothScroll>
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* Sections */}
      <HeroSection />
      <ProblemsSection />
      <MarqueeSection />
      <CalloutSection />
      <PricingSection />
      <FAQSection />

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 md:py-10 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <OrbLogo size={18} />
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} HappyWay. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-white/30 text-sm hover:text-white/60 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="text-white/30 text-sm hover:text-white/60 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>

    </div>
    </SmoothScroll>
  );
}
