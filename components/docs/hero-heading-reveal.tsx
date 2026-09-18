/**
 * Cue Kit hero headline — rainbow shine sweep, pure CSS.
 * Two-layer render: (1) base text always solid so nothing depends
 * on the animation to be readable; (2) an aria-hidden overlay clip-
 * masked to the same text carries the rainbow gradient and sweeps
 * across on load. Prior single-layer implementation used
 * `color: transparent` on the base, which left the headline blank
 * during slow font swaps and made the whole line "snap in" when
 * the animation finally fired.
 */
export function HeroHeadingReveal({ children }: { children: string }) {
  return (
    <>
      <h1 className="cue-hero-reveal-wrap mb-5 text-[28px] font-medium leading-[1.15] tracking-tight md:text-[44px]">
        <span className="cue-hero-base">{children}</span>
        <span aria-hidden="true" className="cue-hero-shine">{children}</span>
      </h1>
      <style>{`
        .cue-hero-reveal-wrap {
          position: relative;
          display: inline-block;
          color: #2D2D2D;
        }
        .cue-hero-base {
          position: relative;
          z-index: 1;
        }
        .cue-hero-shine {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent 40%,
            #0358f7 45%,
            #e1e1fe 48%,
            #ffb005 51%,
            #fa3d1d 54%,
            #c679c4 57%,
            transparent 62%
          );
          background-size: 250% 100%;
          background-position: 100% 0;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          will-change: background-position;
          animation: cue-hero-shine-sweep 1.4s cubic-bezier(0.65, 0, 0.35, 1) 200ms 1 both;
        }
        @keyframes cue-hero-shine-sweep {
          from { background-position: 100% 0; }
          to   { background-position: -20% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cue-hero-shine { display: none; }
        }
      `}</style>
    </>
  )
}
