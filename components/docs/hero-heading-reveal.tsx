/**
 * Cue Kit hero headline — pure opacity + translate fade-in.
 * Deliberately boring: no background-clip: text, no dual layers,
 * no gradients. Text is always solid #2D2D2D, animation only nudges
 * opacity and Y. On any slow load, cache miss, or font swap, the
 * headline still renders correctly — the only "failure mode" is
 * seeing solid text instantly, which is fine.
 */
export function HeroHeadingReveal({ children }: { children: string }) {
  return (
    <>
      <h1 className="cue-hero-reveal mb-5 text-[28px] font-medium leading-[1.15] tracking-tight text-[#2D2D2D] md:text-[44px]">
        {children}
      </h1>
      <style>{`
        .cue-hero-reveal {
          opacity: 0;
          transform: translateY(8px);
          animation: cue-hero-fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 100ms forwards;
        }
        @keyframes cue-hero-fade-in {
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cue-hero-reveal {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </>
  )
}
