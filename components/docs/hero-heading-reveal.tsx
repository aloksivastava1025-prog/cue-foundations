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
          background: linear-gradient(
            90deg,
            transparent 0%,
            transparent 24%,
            #c679c4 27%,
            #fa3d1d 30%,
            #ffb005 33%,
            #e1e1fe 36%,
            #0358f7 39%,
            #2D2D2D 43%,
            #2D2D2D 100%
          );
          background-size: 250% 100%;
          background-position: 0% 0;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          will-change: background-position;
          animation: cue-hero-reveal-sweep 1.6s cubic-bezier(0.65, 0, 0.35, 1) 120ms forwards;
        }
        @keyframes cue-hero-reveal-sweep {
          from { background-position: 0% 0; }
          to   { background-position: 100% 0; }
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
