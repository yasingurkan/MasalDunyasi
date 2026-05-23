'use client';

import { useEffect, useState } from 'react';

// ── Küçük arka plan yıldızları ────────────────────────────────────────────
interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: string;
  delay: string;
  opacity: number;
  dx: string;
  dy: string;
  driftDur: string;
  driftDelay: string;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top:  `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() < 0.15 ? 3 : Math.random() < 0.4 ? 2 : 1,
    duration:   `${(2  + Math.random() * 4).toFixed(2)}s`,
    delay:      `${(Math.random() * 6).toFixed(2)}s`,
    opacity:    0.3 + Math.random() * 0.7,
    dx:         `${((Math.random() - 0.5) * 28).toFixed(1)}px`,
    dy:         `${((Math.random() - 0.5) * 28).toFixed(1)}px`,
    driftDur:   `${(18 + Math.random() * 22).toFixed(1)}s`,
    driftDelay: `${(-(Math.random() * 30)).toFixed(1)}s`,
  }));
}

// ── Yörüngede dönen gezegenler ────────────────────────────────────────────
const PLANETS = [
  {
    id: 'p1',
    // Büyük mor gezegen — sol üst bölge
    topPct: 35, leftPct: 25,
    size: 64,
    bg:     'radial-gradient(circle at 33% 33%, #c084fc, #7e22ce 55%, #3b0764)',
    shadow: '0 0 45px 18px rgba(126,34,206,0.55), 0 0 90px 30px rgba(107,33,168,0.25)',
    anim:   'orbit-p1',
    dur:    '55s',
    delay:  '0s',
  },
  {
    id: 'p2',
    // Altın gezegen — sağ alt bölge
    topPct: 62, leftPct: 74,
    size: 44,
    bg:     'radial-gradient(circle at 33% 33%, #fde68a, #d97706 55%, #78350f)',
    shadow: '0 0 35px 14px rgba(217,119,6,0.55), 0 0 70px 25px rgba(245,158,11,0.2)',
    anim:   'orbit-p2',
    dur:    '40s',
    delay:  '-18s',
  },
  {
    id: 'p3',
    // Camgöbeği gezegen — orta üst
    topPct: 20, leftPct: 60,
    size: 30,
    bg:     'radial-gradient(circle at 33% 33%, #67e8f9, #0891b2 55%, #164e63)',
    shadow: '0 0 25px 10px rgba(8,145,178,0.55), 0 0 50px 20px rgba(6,182,212,0.2)',
    anim:   'orbit-p3',
    dur:    '29s',
    delay:  '-10s',
  },
  {
    id: 'p4',
    // Pembe gezegen — sol alt
    topPct: 73, leftPct: 18,
    size: 22,
    bg:     'radial-gradient(circle at 33% 33%, #f9a8d4, #db2777 55%, #831843)',
    shadow: '0 0 20px 8px rgba(219,39,119,0.55), 0 0 40px 15px rgba(236,72,153,0.2)',
    anim:   'orbit-p4',
    dur:    '46s',
    delay:  '-25s',
  },
  {
    id: 'p5',
    // Yeşil hızlı yörüngeci — sağ üst
    topPct: 45, leftPct: 84,
    size: 16,
    bg:     'radial-gradient(circle at 33% 33%, #6ee7b7, #059669 55%, #064e3b)',
    shadow: '0 0 15px 6px rgba(5,150,105,0.55), 0 0 30px 12px rgba(16,185,129,0.2)',
    anim:   'orbit-p5',
    dur:    '22s',
    delay:  '-5s',
  },
] as const;

// ── Bileşen ───────────────────────────────────────────────────────────────
export default function StarBackground() {
  const [stars, setStars]               = useState<Star[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', onChange);

    setStars(generateStars(80 + Math.floor(Math.random() * 21)));
    return () => mql.removeEventListener('change', onChange);
  }, []);

  if (stars.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Küçük titreşen + sürüklenen yıldızlar */}
      {stars.map((star) => (
        <span
          key={star.id}
          className={reducedMotion ? undefined : 'star-drift'}
          style={{
            position: 'absolute',
            top:  star.top,
            left: star.left,
            ...(!reducedMotion && {
              ['--dx'         as string]: star.dx,
              ['--dy'         as string]: star.dy,
              ['--drift-dur'  as string]: star.driftDur,
              ['--drift-delay'as string]: star.driftDelay,
            }),
          }}
        >
          <span
            className={reducedMotion ? undefined : 'star'}
            style={{
              display:         'block',
              width:           star.size,
              height:          star.size,
              borderRadius:    '50%',
              backgroundColor: '#FEF9C3',
              opacity:         reducedMotion ? star.opacity * 0.6 : star.opacity,
              ...(!reducedMotion && {
                ['--duration' as string]: star.duration,
                ['--delay'    as string]: star.delay,
              }),
            }}
          />
        </span>
      ))}

      {/* Yörüngede dönen gezegenler */}
      {!reducedMotion && PLANETS.map((planet) => (
        <div
          key={planet.id}
          style={{
            position:    'absolute',
            top:         `${planet.topPct}%`,
            left:        `${planet.leftPct}%`,
            marginTop:   -planet.size / 2,
            marginLeft:  -planet.size / 2,
            width:       planet.size,
            height:      planet.size,
            borderRadius:'50%',
            background:  planet.bg,
            boxShadow:   planet.shadow,
            animation:   `${planet.anim} ${planet.dur} linear infinite`,
            animationDelay: planet.delay,
            willChange:  'transform',
          }}
        />
      ))}
    </div>
  );
}
