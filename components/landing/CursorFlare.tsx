'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  life: number;
  maxLife: number;
  hue: number;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export default function CursorFlare() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const trail = useRef<TrailPoint[]>([]);
  const mouse = useRef({ x: -500, y: -500 });
  const smoothMouse = useRef({ x: -500, y: -500 });
  const prevMouse = useRef({ x: -500, y: -500 });
  const velocity = useRef({ x: 0, y: 0 });
  const animId = useRef<number>(0);
  const lastSpawn = useRef(0);
  const isActive = useRef(false);

  const spawnParticles = useCallback((x: number, y: number, speed: number) => {
    const count = Math.min(Math.floor(speed / 8) + 1, 4);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const force = Math.random() * 2 + 0.5;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * force + velocity.current.x * 0.15,
        vy: Math.sin(angle) * force + velocity.current.y * 0.15,
        radius: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.6 + 0.3,
        life: 0,
        maxLife: Math.random() * 40 + 30,
        hue: 210 + Math.random() * 30, // blue range
      });
    }
    // Cap
    if (particles.current.length > 80) {
      particles.current = particles.current.slice(-80);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      isActive.current = true;
    };

    const handleMouseLeave = () => {
      isActive.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Smooth interpolation for trailing effect
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.12;
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.12;

      // Calculate velocity
      velocity.current.x = mouse.current.x - prevMouse.current.x;
      velocity.current.y = mouse.current.y - prevMouse.current.y;
      const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
      prevMouse.current.x = mouse.current.x;
      prevMouse.current.y = mouse.current.y;

      if (isActive.current) {
        // Add trail points
        const now = performance.now();
        if (now - lastSpawn.current > 16) {
          trail.current.push({
            x: mouse.current.x,
            y: mouse.current.y,
            age: 0,
          });
          if (trail.current.length > 50) trail.current.shift();
          lastSpawn.current = now;
        }

        // Spawn particles on movement
        if (speed > 3) {
          spawnParticles(mouse.current.x, mouse.current.y, speed);
        }
      }

      // ═══ Layer 1: Aurora trail ═══
      if (trail.current.length > 2) {
        for (let t = 0; t < trail.current.length; t++) {
          trail.current[t].age++;
        }
        trail.current = trail.current.filter(p => p.age < 60);

        ctx.save();
        for (let i = 1; i < trail.current.length; i++) {
          const p = trail.current[i];
          const progress = p.age / 60;
          const alpha = (1 - progress) * 0.08;
          const radius = 60 + progress * 40;

          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
          grd.addColorStop(0, `rgba(96, 165, 250, ${alpha})`);
          grd.addColorStop(0.5, `rgba(59, 130, 246, ${alpha * 0.4})`);
          grd.addColorStop(1, 'rgba(37, 99, 235, 0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // ═══ Layer 2: Main cursor glow (multi-ring) ═══
      if (isActive.current) {
        const sx = smoothMouse.current.x;
        const sy = smoothMouse.current.y;

        // Outer nebula
        const outerSize = 200 + speed * 2;
        const g1 = ctx.createRadialGradient(sx, sy, 0, sx, sy, outerSize);
        g1.addColorStop(0, 'rgba(96, 165, 250, 0.08)');
        g1.addColorStop(0.3, 'rgba(59, 130, 246, 0.04)');
        g1.addColorStop(0.6, 'rgba(37, 99, 235, 0.015)');
        g1.addColorStop(1, 'rgba(30, 58, 138, 0)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, w, h);

        // Inner bright core
        const g2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, 60);
        g2.addColorStop(0, 'rgba(147, 197, 253, 0.15)');
        g2.addColorStop(0.4, 'rgba(96, 165, 250, 0.06)');
        g2.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(sx, sy, 60, 0, Math.PI * 2);
        ctx.fill();

        // Ring pulse
        const ringPhase = (performance.now() % 2000) / 2000;
        const ringRadius = 30 + ringPhase * 80;
        const ringAlpha = (1 - ringPhase) * 0.12;
        ctx.beginPath();
        ctx.arc(sx, sy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(96, 165, 250, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ═══ Layer 3: Floating particles ═══
      particles.current = particles.current.filter((p) => {
        p.life++;
        if (p.life > p.maxLife) return false;

        const progress = p.life / p.maxLife;

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.vy -= 0.02; // slight float upward

        // Fade
        const alpha = p.opacity * (1 - easeInCubic(progress));
        const size = p.radius * (1 - progress * 0.5);

        // Glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
        grd.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${alpha * 0.5})`);
        grd.addColorStop(1, `hsla(${p.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 80%, ${alpha})`;
        ctx.fill();

        return true;
      });

      animId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId.current);
    };
  }, [spawnParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      aria-hidden="true"
    />
  );
}

function easeInCubic(t: number) {
  return t * t * t;
}
