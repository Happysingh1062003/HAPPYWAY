'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Archive, BarChart3, Users, Award, Layers, Compass, ArrowRight, Moon, Sun, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useEffect, useState, useRef } from 'react';

const FEATURES = [
  { icon: Archive, title: 'Evidence vault', description: 'Organize every document by USCIS criterion with AI-powered analysis and strength scoring.' },
  { icon: BarChart3, title: 'Smart analytics', description: 'Track your approval probability in real time with gap analysis and actionable insights.' },
  { icon: Users, title: 'Collaboration network', description: 'Find co-authors, reviewers, and mentors from a curated community of extraordinary professionals.' },
  { icon: Award, title: 'Milestone badges', description: 'Earn credentials as you build your case — stay motivated and track your journey.' },
  { icon: Layers, title: 'Resource library', description: 'Store and share templates, guides, prompts, and everything useful for your petition.' },
  { icon: Compass, title: 'Opportunity feed', description: 'Discover awards, grants, speaking calls, and fellowships matched to your profile.' },
];

const STEPS = [
  { num: '01', title: 'Upload your evidence', description: 'Add documents, publications, awards, and press coverage to your vault.' },
  { num: '02', title: 'Track your progress', description: 'AI analyzes your evidence and shows your approval probability in real time.' },
  { num: '03', title: 'File with confidence', description: 'Know exactly when you\'re petition-ready with comprehensive gap analysis.' },
];

const FIELDS = ['AI/ML', 'Biotech', 'Finance', 'Law', 'Engineering', 'Arts', 'Medicine', 'Research'];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const mountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    setMounted(mountedRef.current);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-xs font-medium tracking-[0.15em] uppercase">HappyWay</span>
          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center text-center px-6 pt-14">
        <div className="max-w-3xl animate-fade-in-up">
          <h1 className="font-serif italic text-5xl sm:text-6xl md:text-7xl leading-[1.05] mb-6">
            Prove your<br />extraordinary ability.
          </h1>
          <p className="text-lg sm:text-xl font-light text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            The platform built for O-1A and EB-1 aspirants to organize evidence, track progress, and connect with a community of extraordinary professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8">
                Get started free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg" className="text-base px-8">
                See how it works
              </Button>
            </a>
          </div>
          <p className="text-sm text-[var(--text-tertiary)]">
            Join 2,400+ professionals building their case
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl mb-3">Everything you need to build your case</h2>
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto">Six integrated tools designed specifically for immigration excellence.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="card p-6 hover:border-[var(--border-strong)] transition-all duration-200 group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-muted)] flex items-center justify-center mb-4 group-hover:bg-[var(--accent)] group-hover:text-[var(--text-inverse)] transition-all duration-200">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-medium mb-2 font-sans">{feature.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[var(--bg-muted)] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl mb-3">How it works</h2>
            <p className="text-[var(--text-secondary)]">Three steps to petition readiness.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center md:text-left">
                <span className="font-mono text-4xl font-medium text-[var(--text-tertiary)] block mb-4">{step.num}</span>
                <h3 className="text-lg font-medium mb-2 font-sans">{step.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-[var(--text-tertiary)] mb-6">
            Built for extraordinary professionals across every field
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {FIELDS.map(field => (
              <span key={field} className="px-4 py-2 rounded-full border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-colors">
                {field}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace CTA */}
      <section className="bg-[var(--accent)] text-[var(--text-inverse)] py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif italic text-3xl sm:text-4xl mb-4">Already approved?<br />Share your story.</h2>
          </div>
          <div>
            <p className="text-lg opacity-80 mb-6 leading-relaxed">
              Upload your petition documents and earn — approved holders on HAPPYWAY make $200–$2,000 from their case files.
            </p>
            <Link href="/signup?role=approved_holder">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--text-inverse)] text-[var(--accent)] rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
                Start selling <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl max-w-3xl mx-auto mb-8 leading-tight">
          Your extraordinary ability deserves extraordinary organization.
        </h2>
        <Link href="/signup">
          <Button size="lg" className="text-base px-8">
            Start for free <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <span className="text-xs font-medium tracking-[0.15em] uppercase">HappyWay</span>
            <p className="text-xs text-[var(--text-tertiary)] mt-2">Built for the world&apos;s most exceptional people.</p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Product</p>
              <a href="#features" className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Features</a>
              <Link href="/marketplace" className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Marketplace</Link>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Legal</p>
              <a href="#" className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Privacy</a>
              <a href="#" className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Terms</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-tertiary)]">© {new Date().getFullYear()} HappyWay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
