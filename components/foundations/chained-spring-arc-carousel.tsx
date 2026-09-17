/**
 * Cue Foundations · Chained Spring Arc Carousel
 * ────────────────────────────────────────────
 * A 10-card fanned wheel carousel where scroll input triggers a chained spring ripple, propagating tension outward from the leading card like a plucked string.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/chained-spring-arc-carousel.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue063
 *
 * Original Cue ID: cue063
 * Category: Sliders & Marquees
 * ────────────────────────────────────────────
 */

/**
 * Chained Spring Arc Carousel — React + TypeScript
 *
 * 10-card fanned wheel with 2-phase spring physics (entrance fan-out + chained scroll).
 * All physics runs in a ref-backed rAF loop — zero React re-renders per frame.
 *
 * Usage:
 *   import ArcCarousel from './ArcCarousel';
 *   <ArcCarousel
 *     images={[...10 urls...]}
 *     labels={['PORTRAIT', 'STREET', ...]}
 *     initialIndex={4}
 *   />
 */

import React, { useEffect, useRef, useState } from 'react';

interface ArcCarouselProps {
  images?: string[];
  labels?: string[];
  initialIndex?: number;
  gapAngle?: number;                                 // default 16°
  stiffness?: number;                                // default 0.2
  damping?: number;                                  // default 0.4
}

const DEFAULT_IMAGES = [
  'https://i.pinimg.com/736x/aa/07/71/aa0771966b0d5b5060bf2c658c04b189.jpg',
  'https://i.pinimg.com/736x/d6/d3/c9/d6d3c9cdf076cbfe41366bc5ee34f1ec.jpg',
  'https://i.pinimg.com/736x/cd/31/03/cd31039a8e616b2cd2dae9bda9be4160.jpg',
  'https://i.pinimg.com/736x/06/33/8c/06338cdd05ce56b4963126ef315542c0.jpg',
  'https://i.pinimg.com/736x/2f/0a/2d/2f0a2d773f714c183741931a3830f826.jpg',
  'https://i.pinimg.com/1200x/37/e9/12/37e9126981c7ced8e86baa206673c6c8.jpg',
  'https://i.pinimg.com/736x/d6/d3/c9/d6d3c9cdf076cbfe41366bc5ee34f1ec.jpg',
  'https://i.pinimg.com/736x/cd/31/03/cd31039a8e616b2cd2dae9bda9be4160.jpg',
  'https://i.pinimg.com/736x/06/33/8c/06338cdd05ce56b4963126ef315542c0.jpg',
  'https://i.pinimg.com/736x/2f/0a/2d/2f0a2d773f714c183741931a3830f826.jpg',
];
const DEFAULT_LABELS = ['PORTRAIT','STREET','URBAN','FASHION','VINTAGE','NATURE','MINIMAL','CLASSIC','MODERN','EDGY'];

export default function ArcCarousel({
  images = DEFAULT_IMAGES,
  labels = DEFAULT_LABELS,
  initialIndex = 4,
  gapAngle = 16,
  stiffness = 0.2,
  damping = 0.4,
}: ArcCarouselProps) {
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);
  const [labelVisible, setLabelVisible] = useState(false);

  const cardsElRef = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef({
    activeIndex: initialIndex,
    cards: images.map(() => ({ angle: 0, velocity: 0 })),
    isIntro: true,
    introFanning: false,
    isScrolling: false,
  });
  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    : false;

  // Seed z-index once on mount
  useEffect(() => {
    cardsElRef.current.forEach((el, i) => {
      if (el) el.style.zIndex = String(images.length - Math.abs(i - initialIndex));
    });

    // Enable fan-out after slide-up arrival
    let fanTimer: ReturnType<typeof setTimeout> | undefined;
    if (reducedMotion) {
      // Snap straight to final positions
      const st = stateRef.current;
      st.cards.forEach((c, i) => {
        c.angle = (i - st.activeIndex) * gapAngle;
        c.velocity = 0;
      });
      st.isIntro = false;
      setLabelVisible(true);
    } else {
      fanTimer = setTimeout(() => { stateRef.current.introFanning = true; }, 1000);
    }

    // Physics loop
    const step = () => {
      const st = stateRef.current;

      if (st.isIntro) {
        if (st.introFanning) {
          let settled = true;
          for (let i = 0; i < st.cards.length; i++) {
            const target = (i - st.activeIndex) * gapAngle;
            const force = (target - st.cards[i].angle) * 0.01;
            st.cards[i].velocity += force;
            st.cards[i].velocity *= 0.88;
            st.cards[i].angle    += st.cards[i].velocity;
            if (Math.abs(target - st.cards[i].angle) > 0.5 || Math.abs(st.cards[i].velocity) > 0.5) {
              settled = false;
            }
          }
          if (settled) {
            st.isIntro = false;
            setLabelVisible(true);
          }
        }
      } else {
        // Chained spring — leader = last card
        const n = st.cards.length;
        const leaderIdx = n - 1;
        const leaderTarget = (leaderIdx - st.activeIndex) * gapAngle;
        const leader = st.cards[leaderIdx];
        leader.velocity += (leaderTarget - leader.angle) * stiffness;
        leader.velocity *= damping;
        leader.angle    += leader.velocity;

        for (let i = leaderIdx - 1; i >= 0; i--) {
          const cur  = st.cards[i];
          const next = st.cards[i + 1];
          const target = next.angle - gapAngle;
          cur.velocity += (target - cur.angle) * stiffness;
          cur.velocity *= damping;
          cur.angle    += cur.velocity;
        }
      }

      // Write transforms + detect closest-to-zero
      let minAbs = Infinity;
      let closest = 0;
      st.cards.forEach((c, i) => {
        const el = cardsElRef.current[i];
        if (el) el.style.transform = `rotate(${c.angle}deg) translateY(-800px)`;
        if (Math.abs(c.angle) < minAbs) {
          minAbs = Math.abs(c.angle);
          closest = i;
        }
      });

      if (!st.isIntro) setFocusedIndex(prev => prev === closest ? prev : closest);

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    // Wheel handler
    const onWheel = (e: WheelEvent) => {
      const st = stateRef.current;
      if (st.isIntro) return;
      if (Math.abs(e.deltaY) < 15) return;
      if (st.isScrolling) return;
      if (e.deltaY > 0) st.activeIndex = Math.max(0, st.activeIndex - 1);
      else              st.activeIndex = Math.min(images.length - 1, st.activeIndex + 1);
      st.isScrolling = true;
      setTimeout(() => { st.isScrolling = false; }, 400);
    };
    window.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (fanTimer) clearTimeout(fanTimer);
      window.removeEventListener('wheel', onWheel);
    };
  }, [images.length, initialIndex, gapAngle, stiffness, damping, reducedMotion]);

  return (
    <>
      <style>{CSS}</style>

      <div className="ac-global-label" style={{ opacity: labelVisible ? 1 : 0 }}>
        <div className="ac-gl-num">{String(focusedIndex + 1).padStart(2, '0')}</div>
        <div className="ac-gl-name">{labels[focusedIndex]}</div>
      </div>

      <div className="ac-carousel-wrapper">
        <div className="ac-arch" />
        <div className="ac-pivot">
          {images.map((src, i) => (
            <div key={i} className="ac-card" ref={el => (cardsElRef.current[i] = el)}>
              <div className="ac-card-inner" style={{ backgroundImage: `url('${src}')` }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const CSS = `
.ac-carousel-wrapper {
  position: absolute;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  display: flex; justify-content: center; align-items: center;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

.ac-arch {
  position: absolute;
  bottom: -600px;
  width: 1600px; height: 800px;
  background: #d4d4d4;
  border-radius: 50% 50% 0 0;
  z-index: 1;
}

.ac-pivot {
  position: absolute;
  bottom: -600px;
  width: 0; height: 0;
  z-index: 5;
  transform: translateY(100vh);
  opacity: 0;
  animation: ac-slideUpArrival 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes ac-slideUpArrival {
  to { transform: translateY(0); opacity: 1; }
}

.ac-card {
  position: absolute;
  width: 220px; height: 340px;
  left: -110px;
  bottom: -170px;
  will-change: transform;
  display: flex; justify-content: center;
}

.ac-card-inner {
  position: absolute; inset: 0;
  border-radius: 6px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  overflow: hidden;
  background-size: cover; background-position: center;
  background-color: #fff;
  transform: translateY(0);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.ac-card:hover .ac-card-inner {
  transform: translateY(-40px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
}

.ac-global-label {
  position: fixed;
  top: 12%; left: 50%;
  transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center;
  gap: 8px;
  z-index: 20;
  text-align: center;
  transition: opacity 0.8s ease;
  font-family: 'Inter', sans-serif;
}
.ac-gl-num  { font-size: 56px; font-weight: 300; color: #111; letter-spacing: -2px; line-height: 1; }
.ac-gl-name { font-size: 13px; font-weight: 600; color: #777; text-transform: uppercase; letter-spacing: 5px; }

@media (max-width: 900px) {
  .ac-card { width: 160px; height: 240px; left: -80px; bottom: -120px; }
  .ac-arch { width: 1200px; height: 600px; bottom: -450px; }
  .ac-pivot { bottom: -450px; }
}
@media (prefers-reduced-motion: reduce) {
  .ac-pivot { animation: none !important; opacity: 1 !important; transform: none !important; }
  .ac-card-inner { transition: none !important; }
}
`;
