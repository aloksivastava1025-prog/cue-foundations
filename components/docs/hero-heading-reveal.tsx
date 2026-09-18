/**
 * Cue Kit hero headline — rainbow color-band sweep reveal, pure
 * CSS. Uses `background-clip: text` + a wider-than-container
 * gradient whose position animates via CSS keyframes. Compositor-
 * optimized — the browser can offload the animation to GPU, so
 * it doesn't fight the main thread when the user scrolls.
 *
 * Rainbow stops (transparent → 5 colors → solid text color) sit
 * in the same order as the Framer source so the visual identity
 * stays close to the paid product.
 */
export function HeroHeadingReveal({ children }: { children: string }) {
  return (
    <>
      <h1
        className="cue-hero-reveal mb-5 text-[28px] font-medium leading-[1.15] tracking-tight md:text-[44px]"
      >
        {children}
      </h1>
      <style>{`
        .cue-hero-reveal {
          /* Gradient (left→right in image): TEXT — rainbow band —
             transparent. Combined with the animation that slides
             bg-position from 100% → 0%, the reveal front travels
             LEFT→RIGHT across the headline (leftmost characters see
             solid TEXT first). */
          background: linear-gradient(
            90deg,
            #2D2D2D 0%,
            #2D2D2D 57%,
            #0358f7 61%,
            #e1e1fe 64%,
            #ffb005 67%,
            #fa3d1d 70%,
            #c679c4 73%,
            transparent 76%,
            transparent 100%
          );
          background-size: 250% 100%;
          background-position: 100% 0;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          will-change: background-position;
          animation: cue-hero-reveal-sweep 1.6s cubic-bezier(0.65, 0, 0.35, 1) 120ms forwards;
        }
        @keyframes cue-hero-reveal-sweep {
          from { background-position: 100% 0; }
          to   { background-position: 0% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cue-hero-reveal {
            animation: none;
            background: none;
            color: #2D2D2D;
            -webkit-text-fill-color: initial;
          }
        }
      `}</style>
    </>
  )
}
