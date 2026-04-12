'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const PARTICLE_COUNT = 40;
const SPEED = 0.015;

interface ParticleState {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  angle: number;
  angularVel: number;
  speed: number;
}

export default function ParticleBackground() {
  const [mounted, setMounted] = useState(false);
  const particlesRef = useRef<ParticleState[]>([]);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);

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

  const animate = useCallback(() => {
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.angularVel += (Math.random() - 0.5) * 0.004;
      p.angularVel *= 0.98;
      p.angle += p.angularVel;

      p.x += Math.cos(p.angle) * SPEED * p.speed;
      p.y += Math.sin(p.angle) * SPEED * p.speed;

      if (p.x < -2) p.x = 102;
      if (p.x > 102) p.x = -2;
      if (p.y < -2) p.y = 102;
      if (p.y > 102) p.y = -2;

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
  );
}
