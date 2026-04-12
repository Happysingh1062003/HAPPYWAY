'use client';

import { motion } from 'framer-motion';
import OrbLogo from './OrbLogo';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

const PARTICLE_COUNT = 40;
const SPEED = 0.015; // very slow base speed (% per frame)

interface ParticleState {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  angle: number;       // current direction in radians
  angularVel: number;  // how fast the direction changes
  speed: number;       // individual speed multiplier
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const particlesRef = useRef<ParticleState[]>([]);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  // Initialize particles once
  useEffect(() => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      baseOpacity: Math.random() * 0.5 + 0.15,
      angle: Math.random() * Math.PI * 2,
      angularVel: (Math.random() - 0.5) * 0.02,
      speed: Math.random() * 0.5 + 0.75,
    }));
    setMounted(true);
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Slowly steer direction randomly
      p.angularVel += (Math.random() - 0.5) * 0.004;
      p.angularVel *= 0.98; // dampen to avoid spinning
      p.angle += p.angularVel;

      // Move
      p.x += Math.cos(p.angle) * SPEED * p.speed;
      p.y += Math.sin(p.angle) * SPEED * p.speed;

      // Wrap around edges smoothly
      if (p.x < -2) p.x = 102;
      if (p.x > 102) p.x = -2;
      if (p.y < -2) p.y = 102;
      if (p.y > 102) p.y = -2;

      // Apply position to DOM node
      const el = dotsRef.current[i];
      if (el) {
        el.style.left = `${p.x}%`;
        el.style.top = `${p.y}%`;
      }
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted, animate]);

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-6">

      {/* Floating star particles — slow random drift */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {mounted &&
          particlesRef.current.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => { dotsRef.current[i] = el; }}
              className="absolute rounded-full bg-white"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                opacity: p.baseOpacity,
                transition: 'opacity 2s ease',
              }}
            />
          ))}
      </div>

      {/* Inner Centered Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
        
        {/* Orb Logo with subtle aura */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mb-6 md:mb-12"
        >
          <div className="absolute inset-[-30px] md:inset-[-40px] rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.15)_0%,_rgba(37,99,235,0.05)_40%,_transparent_70%)] blur-[8px] pointer-events-none" />
          <OrbLogo size={100} />
        </motion.div>

        {/* Intro text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-white/80 font-light tracking-[0.15em] md:tracking-[0.25em] text-xs md:text-base uppercase mb-3 md:mb-5 text-center"
        >
          INTRODUCING HAPPYWAY
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center text-white max-w-[1100px] px-2"
          style={{
            fontFamily: '"Satoshi", sans-serif',
            fontSize: 'clamp(2.5rem, 10vw, 80px)',
            letterSpacing: '-0.02em',
            lineHeight: '0.95em',
            fontWeight: 400,
          }}
        >
          Build your{' '}
          <span
            className="font-bold italic text-white"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            extraordinary
          </span>{' '}
          case that stands out
        </motion.h1>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-wrap justify-center items-center gap-3 md:gap-4 mt-8 md:mt-12 w-full"
        >
          <Link
            href="/login"
            className="px-6 md:px-8 py-3 md:py-3.5 bg-white text-[#0A0A0B] text-sm md:text-base font-semibold rounded-full hover:bg-white/90 transition-colors shadow-sm"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 md:px-8 py-3 md:py-3.5 bg-white/5 backdrop-blur-md border border-white/10 text-white text-sm md:text-base font-semibold rounded-full hover:bg-white/10 transition-all"
          >
            Sign Up
          </Link>
        </motion.div>
      </div>

      {/* Scroll down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 cursor-pointer hover:text-white transition-colors z-20"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-xs uppercase tracking-[0.2em] font-light">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

