/**
 * Glowing liquid CTA — Blue theme baked in, used for Explore Cue+.
 * Spec-perfect: 6-layer inset box-shadow, ::before liquid-flow at
 * mix-blend color-dodge, ::after diagonal light-sweep at overlay,
 * hover lift + scale, prefers-reduced-motion pauses the animations.
 * Class names namespaced with `cue-cta-` so they can't collide.
 */
export function CueCtaButton({
  href,
  children,
  size = "lg",
}: {
  href: string
  children: React.ReactNode
  /** "lg" — full 22px×64px hero CTA. "sm" — compact nav variant. */
  size?: "lg" | "sm"
}) {
  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`cue-cta-btn ${size === "sm" ? "cue-cta-btn--sm" : ""}`}
      >
        <span>{children}</span>
      </a>
      <style>{`
        .cue-cta-btn {
          --btn-text: #0F3775;
          --btn-bg: #2581FF;
          --btn-glow-inner-1: #1674F7;
          --btn-glow-inner-2: #6EB4FF;
          --btn-glow-inner-3: rgba(22, 116, 247, 0.6);
          --btn-glow-outer: rgba(37, 129, 255, 0.2);
          --btn-glow-hover: rgba(37, 129, 255, 0.3);

          position: relative;
          display: inline-block;
          overflow: hidden;
          text-decoration: none;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.6);

          padding: 22px 64px;
          border-radius: 999px;

          font-family: inherit;
          font-size: 26px;
          font-weight: 500;
          letter-spacing: -0.3px;
          color: var(--btn-text);

          background: var(--btn-bg);

          box-shadow:
            inset 0 -16px 24px rgba(255, 255, 255, 0.95),
            inset 0   6px 16px rgba(255, 255, 255, 0.80),
            inset 10px 0 20px rgba(255, 255, 255, 0.70),
            inset -10px 0 20px rgba(255, 255, 255, 0.70),
            0 10px 20px rgba(0, 0, 0, 0.30),
            0 4px 12px var(--btn-glow-outer);

          transition:
            transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, box-shadow;
        }

        .cue-cta-btn > span {
          position: relative;
          z-index: 2;
          text-shadow: 0 1px 3px rgba(255, 255, 255, 0.7);
        }

        .cue-cta-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            radial-gradient(120% 120% at 30% 20%, var(--btn-glow-inner-1) 0%, transparent 60%),
            radial-gradient(120% 120% at 70% 80%, var(--btn-glow-inner-2) 0%, transparent 50%),
            radial-gradient(100% 100% at 50% 50%, var(--btn-glow-inner-3) 0%, transparent 80%);
          background-size: 200% 200%;
          z-index: 1;
          pointer-events: none;
          mix-blend-mode: color-dodge;
          opacity: 0.95;
          animation: cueCtaLiquid 4s infinite alternate ease-in-out;
        }

        .cue-cta-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255, 255, 255, 0.2) 45%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0.2) 55%,
            transparent 80%
          );
          background-size: 200% 100%;
          z-index: 1;
          pointer-events: none;
          mix-blend-mode: overlay;
          animation: cueCtaSweep 3.5s infinite linear;
        }

        @keyframes cueCtaLiquid {
          0%   { background-position: 0% 0%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 100%; }
        }
        @keyframes cueCtaSweep {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .cue-cta-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow:
            inset 0 -10px 20px rgba(255, 255, 255, 0.95),
            inset 0   8px 20px rgba(255, 255, 255, 0.85),
            inset 8px 0 20px rgba(255, 255, 255, 0.65),
            inset -8px 0 20px rgba(255, 255, 255, 0.65),
            0 15px 30px rgba(0, 0, 0, 0.40),
            0 8px 24px var(--btn-glow-hover);
        }
        .cue-cta-btn:active {
          transform: translateY(1px) scale(0.98);
          box-shadow:
            inset 0 -6px 12px rgba(255, 255, 255, 0.90),
            inset 0  4px 10px rgba(255, 255, 255, 0.80),
            inset 4px 0 10px rgba(255, 255, 255, 0.60),
            inset -4px 0 10px rgba(255, 255, 255, 0.60),
            0 5px 10px rgba(0, 0, 0, 0.20),
            0 2px 6px var(--btn-glow-outer);
        }

        /* Compact nav variant — shrunk padding + font, same 6-layer
           glow (inset shadow spreads scale down naturally). */
        .cue-cta-btn--sm {
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0;
          box-shadow:
            inset 0 -8px 14px rgba(255, 255, 255, 0.95),
            inset 0  3px 10px rgba(255, 255, 255, 0.80),
            inset 6px 0 12px rgba(255, 255, 255, 0.65),
            inset -6px 0 12px rgba(255, 255, 255, 0.65),
            0 4px 10px rgba(0, 0, 0, 0.25),
            0 2px 8px var(--btn-glow-outer);
        }
        .cue-cta-btn--sm:hover {
          box-shadow:
            inset 0 -6px 12px rgba(255, 255, 255, 0.95),
            inset 0  4px 12px rgba(255, 255, 255, 0.85),
            inset 5px 0 12px rgba(255, 255, 255, 0.65),
            inset -5px 0 12px rgba(255, 255, 255, 0.65),
            0 6px 14px rgba(0, 0, 0, 0.35),
            0 4px 12px var(--btn-glow-hover);
        }
        .cue-cta-btn--sm:active {
          box-shadow:
            inset 0 -4px 10px rgba(255, 255, 255, 0.90),
            inset 0  2px 8px rgba(255, 255, 255, 0.80),
            inset 3px 0 8px rgba(255, 255, 255, 0.60),
            inset -3px 0 8px rgba(255, 255, 255, 0.60),
            0 2px 6px rgba(0, 0, 0, 0.20),
            0 1px 4px var(--btn-glow-outer);
        }

        @media (max-width: 520px) {
          .cue-cta-btn { padding: 18px 44px; font-size: 22px; }
          .cue-cta-btn--sm { padding: 6px 14px; font-size: 12px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cue-cta-btn,
          .cue-cta-btn::before,
          .cue-cta-btn::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  )
}
