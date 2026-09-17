/**
 * Cue Foundations · Split Panel Image-Synced FAQ/Features
 * ────────────────────────────────────────────
 * A two-panel FAQ accordion where opening a question cross-fades a de-blurring poster-style image on the right using pure CSS grid-row transitions.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/split-panel-image-synced-faq-features.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue122
 *
 * Original Cue ID: cue122
 * Category: Sections & Layouts
 * ────────────────────────────────────────────
 */

import { useState } from "react";

/* ============================================================
   FaqAccordion — single-file React (TSX) drop-in.
   Split-panel tab switcher: 5 accordion items on the left, a
   soft-blur Pinterest image on the right that cross-fades to
   match the currently open item. Single-open state.

   Usage:  <FaqAccordion />   (all copy + images baked in)
           <FaqAccordion items={CUSTOM} />
   Requires: React 18+
   ============================================================ */

const PROXY = "https://wsrv.nl/?url=";

export type FaqItem = {
  num: string;
  question: string;
  answer: string;
  img: string;
};

const DEFAULT_ITEMS: FaqItem[] = [
  {
    num: "01",
    question: "What are these components?",
    answer:
      "These are carefully crafted Framer components focused on smooth motion, clean structure, and modern interaction patterns. Each component is built to feel intentional, lightweight, and ready to drop into real projects without extra setup.",
    img: PROXY + encodeURIComponent("i.pinimg.com/1200x/97/86/c7/9786c75cf0594852c0097f263268f1b9.jpg"),
  },
  {
    num: "02",
    question: "Can I customize them?",
    answer:
      "Every prop, color, and timing curve is exposed at the top of each file so you can wire it to your own design tokens without touching internals. Nothing is hardcoded — swap fonts, spacing, and durations and the motion stays balanced.",
    img: PROXY + encodeURIComponent("i.pinimg.com/1200x/3d/2e/90/3d2e90b8d9f0f2212c4bb0d4cb00d1ab.jpg"),
  },
  {
    num: "03",
    question: "Are they responsive?",
    answer:
      "Every component ships with a mobile breakpoint. Touch handlers, layout, and typography all adapt down to 320 px without losing the feel or the timing that makes the interaction read on desktop.",
    img: PROXY + encodeURIComponent("i.pinimg.com/1200x/a7/2c/6b/a72c6b401485df6e19218348f3fb2130.jpg"),
  },
  {
    num: "04",
    question: "Can I use them commercially?",
    answer:
      "Yes. Use them in production sites, client work, or personal projects. Attribution is appreciated but not required. Redistributing the collection itself as a template is the only thing off-limits.",
    img: PROXY + encodeURIComponent("i.pinimg.com/1200x/86/d7/70/86d77085718d949e7052ecc12a0d6114.jpg"),
  },
  {
    num: "05",
    question: "Do they work well together?",
    answer:
      "They're built on the same tokens, spacing scale, and easing curves — designed to compose. A hero, a filter row, and a CTA from this library will feel like they were made together.",
    img: PROXY + encodeURIComponent("i.pinimg.com/736x/e8/89/cc/e889ccd45a9edd0642d42b53b6d597d0.jpg"),
  },
];

type Props = {
  eyebrow?: string;
  items?: FaqItem[];
  defaultOpen?: number;
};

export default function FaqAccordion({
  eyebrow = "tab switcher",
  items = DEFAULT_ITEMS,
  defaultOpen = 0,
}: Props) {
  const [active, setActive] = useState<number | null>(defaultOpen);
  const [lastImg, setLastImg] = useState<number>(defaultOpen);

  const onClick = (i: number) => {
    if (active === i) {
      setActive(null);
      return;
    }
    setActive(i);
    setLastImg(i);
  };

  return (
    <>
      <style>{CSS}</style>

      <div className="fa-stage">
        <aside className="fa-panel-left">
          <span className="fa-eyebrow">{eyebrow}</span>

          <div className="fa-faq">
            {items.map((it, i) => (
              <div
                key={it.num}
                className={`fa-item${active === i ? " open" : ""}`}
              >
                <button className="fa-row" type="button" onClick={() => onClick(i)}>
                  <span className="fa-num">{it.num}</span>
                  <span className="fa-q">{it.question}</span>
                  <span className="fa-icon">
                    <span className="fa-v"></span>
                    <span className="fa-h"></span>
                  </span>
                </button>
                <div className="fa-body">
                  <span className="fa-spacer1"></span>
                  <div className="fa-content-wrap">
                    <div className="fa-content">
                      <p>{it.answer}</p>
                    </div>
                  </div>
                  <span className="fa-spacer2"></span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <aside className="fa-panel-right">
          {items.map((it, i) => (
            <img
              key={it.num}
              className={lastImg === i ? "active" : ""}
              src={it.img}
              alt=""
              draggable={false}
            />
          ))}
        </aside>
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;700&family=Inter+Tight:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; }
html, body { height: 100%; margin: 0; padding: 0; }
body {
  min-height: 100vh;
  font-family: 'Inter Tight', 'Inter', -apple-system, sans-serif;
  background: #000;
  color: #fff;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

.fa-stage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100vh;
}

/* ============ LEFT PANEL ============ */
.fa-panel-left {
  position: relative;
  background: #000;
  padding: 56px 72px;
  display: flex; flex-direction: column;
}
.fa-eyebrow {
  font-family: 'Geist Mono', 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: auto;
}
.fa-faq { margin-top: 0; }
.fa-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.20);
}
.fa-row {
  appearance: none;
  border: none; background: transparent;
  width: 100%;
  display: grid;
  grid-template-columns: 40px 1fr 22px;
  column-gap: 24px;
  align-items: center;
  padding: 22px 0;
  cursor: pointer;
  color: #fff;
  text-align: left;
  opacity: 0.30;
  transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  font-family: inherit;
}
.fa-item.open .fa-row { opacity: 1; }
.fa-item:not(.open):hover .fa-row { opacity: 0.55; }

.fa-num {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  line-height: 1;
}
.fa-q {
  font-family: 'Inter Tight', 'Inter', sans-serif;
  font-size: 18px;
  letter-spacing: -0.01em;
  line-height: 1;
}

.fa-icon {
  position: relative;
  width: 14px; height: 14px;
  justify-self: end;
  display: inline-block;
}
.fa-icon .fa-v, .fa-icon .fa-h {
  position: absolute;
  background: #fff;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.fa-icon .fa-v { left: 50%; top: 0;  width: 1px; height: 100%; transform: translateX(-50%); }
.fa-icon .fa-h { left: 0;  top: 50%; width: 100%; height: 1px; transform: translateY(-50%); }
.fa-item.open .fa-icon .fa-v { transform: translateX(-50%) rotate(90deg); }
.fa-item.open .fa-icon .fa-h { transform: translateY(-50%) rotate(180deg); }

.fa-body {
  display: grid;
  grid-template-columns: 40px 1fr 22px;
  column-gap: 24px;
}
.fa-content-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.fa-item.open .fa-content-wrap { grid-template-rows: 1fr; }
.fa-content { overflow: hidden; min-height: 0; }
.fa-body p {
  padding: 0 0 26px 0;
  margin: 0;
  font-family: 'Inter Tight', 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.48;
  letter-spacing: -0.005em;
  color: rgba(255, 255, 255, 0.6);
}

/* ============ RIGHT PANEL ============ */
.fa-panel-right {
  position: relative;
  overflow: hidden;
  background: #0E1214;
}
.fa-panel-right img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  filter: blur(28px) saturate(1.15);
  transform: scale(1.18);
  opacity: 0;
  transition:
    opacity   0.8s cubic-bezier(0.22, 1, 0.36, 1),
    transform 1.2s cubic-bezier(0.22, 1, 0.36, 1),
    filter    0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.fa-panel-right img.active {
  opacity: 1;
  transform: scale(1.10);
}
.fa-panel-right::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(80% 60% at 60% 40%,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.04) 55%,
    rgba(0,  10,  20, 0.20) 100%);
  mix-blend-mode: overlay;
  pointer-events: none;
}

@media (max-width: 900px) {
  .fa-stage { grid-template-columns: 1fr; grid-template-rows: 1fr 40vh; }
  .fa-panel-left { padding: 32px 24px; }
  .fa-q { font-size: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .fa-content-wrap, .fa-row, .fa-icon .fa-v, .fa-icon .fa-h {
    transition-duration: 0.15s !important;
  }
}
`;
