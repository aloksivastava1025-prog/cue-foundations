/**
 * Cue Foundations · Collapsing Cards Accordion
 * ────────────────────────────────────────────
 * A five-image horizontal accordion where hovering a card expands it with smooth flex transitions while others collapse to vertical wordmarks.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/collapsing-cards-accordion.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue115
 *
 * Original Cue ID: cue115
 * Category: Gallery & Images
 * ────────────────────────────────────────────
 */

import { useState } from "react";

/* ============================================================
   CollapsingCards — single-file React (TSX) component.
   5-card horizontal accordion. Hover / click swaps the active
   card with a smooth flex transition. Drop into any React 18+
   app; mount <CollapsingCards />.
   ============================================================ */

type Card = {
  idx: number;
  wordmark: string;
  title: string;
  img: string;
};

const CARDS: Card[] = [
  {
    idx: 1,
    wordmark: "Aether",
    title: "Aether — a study in warmth",
    img: "https://i.pinimg.com/1200x/97/86/c7/9786c75cf0594852c0097f263268f1b9.jpg",
  },
  {
    idx: 2,
    wordmark: "Marrow",
    title: "Marrow — texture and shadow",
    img: "https://i.pinimg.com/1200x/3d/2e/90/3d2e90b8d9f0f2212c4bb0d4cb00d1ab.jpg",
  },
  {
    idx: 3,
    wordmark: "Kite",
    title: "Kite — light as a whisper",
    img: "https://i.pinimg.com/1200x/a7/2c/6b/a72c6b401485df6e19218348f3fb2130.jpg",
  },
  {
    idx: 4,
    wordmark: "Lume",
    title: "Lume — a slow evening",
    img: "https://i.pinimg.com/1200x/86/d7/70/86d77085718d949e7052ecc12a0d6114.jpg",
  },
  {
    idx: 5,
    wordmark: "Halo",
    title: "Halo — reaching for calm",
    img: "https://i.pinimg.com/736x/e8/89/cc/e889ccd45a9edd0642d42b53b6d597d0.jpg",
  },
];

const ArrowIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export default function CollapsingCards() {
  const [activeIdx, setActiveIdx] = useState(1);

  return (
    <>
      <style>{CSS}</style>
      <div className="cc-cards">
        {CARDS.map(c => (
          <div
            key={c.idx}
            className={`cc-card ${activeIdx === c.idx ? "active" : ""}`}
            onMouseEnter={() => setActiveIdx(c.idx)}
            onClick={() => setActiveIdx(c.idx)}
          >
            <div className="cc-img" style={{ backgroundImage: `url('${c.img}')` }} />
            <div className="cc-v-title">{c.wordmark}</div>
            <div className="cc-content">
              <div className="cc-idx">{String(c.idx).padStart(2, "0")} / 05</div>
              <div className="cc-meta">
                <div className="cc-title">{c.title}</div>
                <a href="#" className="cc-cta" onClick={e => e.stopPropagation()}>
                  View {ArrowIcon}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; }
html, body { height: 100%; margin: 0; padding: 0; }
body {
  height: 100vh;
  background: #0A0A0B;
  color: #FFFFFF;
  font-family: 'Inter', -apple-system, sans-serif;
  display: flex; align-items: center; justify-content: center;
  padding: 32px;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Card row — fills viewport */
.cc-cards {
  display: flex; gap: 10px;
  width: 100%; max-width: 1280px;
  height: 100%;
}

.cc-card {
  position: relative;
  flex: 0.7;
  min-width: 92px;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: flex 0.75s cubic-bezier(0.2, 1, 0.3, 1);
  will-change: flex;
  background: #1a1a1c;
}
.cc-card.active { flex: 2.6; }

.cc-img {
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.04);
  transition: transform 0.9s cubic-bezier(0.2, 1, 0.3, 1),
              filter    0.75s cubic-bezier(0.2, 1, 0.3, 1);
  filter: grayscale(30%) brightness(0.75);
}
.cc-card.active .cc-img { transform: scale(1); filter: grayscale(0%) brightness(0.92); }

.cc-card::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(to top,
    rgba(0,0,0,0.65) 0%,
    rgba(0,0,0,0.28) 35%,
    rgba(0,0,0,0.10) 60%,
    rgba(0,0,0,0.40) 100%);
  pointer-events: none;
}

.cc-content {
  position: relative; z-index: 2;
  height: 100%;
  padding: 22px;
  display: flex; flex-direction: column;
  color: #fff;
}
.cc-idx {
  font-size: 11px; letter-spacing: 0.14em;
  color: rgba(255,255,255,0.72); font-weight: 500;
}
.cc-meta {
  margin-top: auto;
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 12px;
}
.cc-title {
  font-size: 22px; font-weight: 500;
  letter-spacing: -0.015em;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.35s ease 0.15s,
              transform 0.5s cubic-bezier(0.2, 1, 0.3, 1) 0.15s;
}
.cc-card.active .cc-title { opacity: 1; transform: translateY(0); }

.cc-v-title {
  position: absolute;
  left: 22px; bottom: 22px;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 13px; font-weight: 500;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(255,255,255,0.85);
  transition: opacity 0.3s ease;
  z-index: 2;
}
.cc-card.active .cc-v-title { opacity: 0; }

.cc-cta {
  font-size: 11px; letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.85); font-weight: 500;
  text-decoration: none;
  display: inline-flex; align-items: center; gap: 6px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.35s ease 0.2s,
              transform 0.5s cubic-bezier(0.2, 1, 0.3, 1) 0.2s;
}
.cc-card.active .cc-cta { opacity: 1; transform: translateY(0); }
.cc-cta svg { width: 12px; height: 12px; }

@media (max-width: 900px) {
  .cc-title { font-size: 18px; }
}
@media (max-width: 640px) {
  body { padding: 16px; }
  .cc-cards { flex-direction: column; gap: 6px; }
  .cc-card { flex: 0.8; min-height: 0; }
  .cc-card.active { flex: 3; }
  .cc-v-title { writing-mode: horizontal-tb; transform: none; left: 16px; bottom: 14px; }
  .cc-content { padding: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .cc-card, .cc-img, .cc-title, .cc-cta, .cc-v-title { transition-duration: 0.15s !important; }
}
`;
