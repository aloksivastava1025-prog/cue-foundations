"use client";


/**
 * Cue Foundations · Glossy Slider Call Button
 * ────────────────────────────────────────────
 * A dark pill button whose acid-green slider expands on hover, swapping a dotted arrow icon for a phone icon while the label fades away.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/glossy-slider-call-button.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue172
 *
 * Original Cue ID: cue172
 * Category: Buttons
 * ────────────────────────────────────────────
 */

/* ============================================================================
   BookCallButton — glossy black pill with an expanding acid-green slider
   ----------------------------------------------------------------------------
   Rest: green pill tucked left with a dotted right-arrow, "Book a call" label
   Hover: slider expands to fill, arrow slides out right, phone-ringing icon
   slides in from the left and grows into place, label fades out.
   Zero JS, zero deps. Requires Inter (Google Fonts) in the target project.
   ============================================================================ */

type Props = { label?: string };

export default function BookCallButton({ label = "Book a call" }: Props) {
  return (
    <>
      <style>{`
        .book-btn {
          position: relative;
          width: 280px;
          height: 76px;
          background: #101010;
          border: 3px solid #333333;
          border-radius: 999px;
          cursor: pointer;
          display: flex;
          align-items: center;
          box-shadow:
            inset 0 4px 8px  rgba(0, 0, 0, 0.80),
            inset 0 1px 1px  rgba(255, 255, 255, 0.15),
            0 15px 30px       rgba(0, 0, 0, 0.25);
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          font-family: 'Inter', sans-serif;
        }

        .book-btn .slider {
          position: absolute;
          left: 6px; top: 6px; bottom: 6px;
          width: 96px;
          background: linear-gradient(180deg, #A4FF3B, #72D80B);
          border-radius: 999px;
          transition: width 0.65s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex; align-items: center; justify-content: center;
          z-index: 2;
          box-shadow:
            inset 0  3px 5px rgba(255, 255, 255, 0.60),
            inset 0 -3px 5px rgba(0, 0, 0, 0.25),
            0     4px 12px  rgba(0, 0, 0, 0.30);
        }
        .book-btn:hover .slider { width: calc(100% - 12px); }

        .book-btn .icon-arrow {
          position: absolute;
          width: 32px; height: 32px;
          color: #111;
          opacity: 1;
          transform: translateX(0);
          transition: opacity 0.40s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .book-btn:hover .icon-arrow {
          opacity: 0;
          transform: translateX(40px);
        }

        .book-btn .icon-phone {
          position: absolute;
          width: 26px; height: 26px;
          color: #111;
          opacity: 0;
          transform: translateX(-40px) scale(0.7);
          transition: opacity 0.45s ease 0.10s, transform 0.60s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .book-btn:hover .icon-phone {
          opacity: 1;
          transform: translateX(0) scale(1);
        }

        .book-btn .text {
          position: absolute;
          left: 122px;
          color: #ffffff;
          font-size: 20px;
          font-weight: 500;
          letter-spacing: -0.3px;
          transition: opacity 0.35s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 1;
        }
        .book-btn:hover .text {
          opacity: 0;
          transform: translateX(-15px);
        }

        @media (prefers-reduced-motion: reduce) {
          .book-btn *, .book-btn .slider { transition: none !important; }
        }
      `}</style>

      <div className="book-btn" role="button" tabIndex={0}>
        <div className="slider">
          {/* Dotted right-arrow */}
          <svg className="icon-arrow" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {/* Shaft */}
            <circle cx="6"  cy="12" r="1.5" />
            <circle cx="10" cy="12" r="1.5" />
            <circle cx="14" cy="12" r="1.5" />
            <circle cx="18" cy="12" r="1.5" />
            {/* Top wing */}
            <circle cx="14" cy="8"  r="1.5" />
            <circle cx="10" cy="4"  r="1.5" />
            {/* Bottom wing */}
            <circle cx="14" cy="16" r="1.5" />
            <circle cx="10" cy="20" r="1.5" />
          </svg>

          {/* Phone ringing */}
          <svg
            className="icon-phone"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15.05 5 A 5 5 0 0 1 19 8.95" />
            <path d="M15.05 1 A 9 9 0 0 1 23 8.94" />
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
        <div className="text">{label}</div>
      </div>
    </>
  );
}
