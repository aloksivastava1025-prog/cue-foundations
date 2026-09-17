/**
 * Cue Foundations · Flex-Grow Benefits Reveal
 * ────────────────────────────────────────────
 * A four-card benefits row where hovering expands a card via flex-grow and cross-fades from a mosaic closed state to a detailed opened pane.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/flex-grow-benefits-reveal.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue069
 *
 * Original Cue ID: cue069
 * Category: Sections & Layouts
 * ────────────────────────────────────────────
 */

/**
 * Cue Benefits Section — Flex-Grow Hover Reveal Cards (blue variant)
 *
 * Pure CSS interaction. Zero JS state.
 *
 * Usage:
 *   import CueBenefits from './CueBenefits';
 *   <CueBenefits />
 *
 * Or with custom copy:
 *   <CueBenefits
 *     eyebrow="Why Cue"
 *     headline={['Ship premium sites,', 'not prompt scavenger hunts']}
 *     blurb="..."
 *     items={[...]}
 *   />
 *
 * Fonts (add to global head or app layout):
 *   <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..900;1,9..40,400..900&display=swap" rel="stylesheet">
 *   Geist self-hosted from Google's static CDN via @font-face (already embedded in the CSS block below).
 */

import React from 'react';

export interface BenefitItem {
  num: string;
  title: string;
  desc: string;
  mosaic: string;   // closed-state background image
  chat: string;     // opened-state hero image (usually same for all)
}

interface CueBenefitsProps {
  eyebrow?: string;
  headline?: [string, string];
  blurb?: string;
  items?: BenefitItem[];
}

const CHAT_IMG   = 'https://framerusercontent.com/images/2MEG3woz70bTopuFKzgkWTZ8Wk.png';
const MOSAIC_1   = 'https://framerusercontent.com/images/ienddKMr5YHn8OtJfjhZUVFgCo.png';
const MOSAIC_2   = 'https://framerusercontent.com/images/sdp9AiOfotrZg64RT2mspNduuM.png';
const MOSAIC_3   = 'https://framerusercontent.com/images/R0ysj5aZ9R2YoXztXqL6eynb9Uo.png';

const DEFAULT_ITEMS: BenefitItem[] = [
  { num: '01.', title: 'Awwwards-tier craft', mosaic: MOSAIC_1, chat: CHAT_IMG,
    desc: 'Every section is pulled from Site-of-the-Day winners — hyper-polished, spring-driven, and calibrated to feel premium out of the box.' },
  { num: '02.', title: 'Paste-ready prompts', mosaic: MOSAIC_2, chat: CHAT_IMG,
    desc: 'Bolt, v0, Cursor — pixel-perfect prompts land the exact layout, motion, and copy on the first shot. No re-prompting.' },
  { num: '03.', title: 'Working code, always', mosaic: MOSAIC_2, chat: CHAT_IMG,
    desc: 'HTML, CSS, JS, React — every component ships production-ready. Drop in, wire up, ship this weekend. No half-finished abstractions.' },
  { num: '04.', title: 'Grows with the web', mosaic: MOSAIC_3, chat: CHAT_IMG,
    desc: 'Every new SOTD site adds fresh components. The library expands as the web\'s craft ceiling rises — you never fall behind trend.' },
];

export default function CueBenefits({
  eyebrow = 'Why Cue',
  headline = ['Ship premium sites,', 'not prompt scavenger hunts'],
  blurb = 'Most component libraries hand you generic building blocks. Cue hands you Awwwards-tier sections — paste-ready, animation-perfect, and production-grade from the first render.',
  items = DEFAULT_ITEMS,
}: CueBenefitsProps) {
  return (
    <>
      <style>{CSS}</style>
      <section className="cb-section">
        <div className="cb-header">
          <div className="cb-header-left">
            <p className="cb-eyebrow">{eyebrow}</p>
            <h2 className="cb-title">
              {headline[0]}<br />{headline[1]}
            </h2>
          </div>
          <p className="cb-blurb">{blurb}</p>
        </div>

        <div className="cb-cards">
          {items.map((item, i) => (
            <article key={i} className="cb-card" tabIndex={0}>
              {/* Closed */}
              <div className="cb-closed">
                <div className="cb-num">{item.num}</div>
                <div className="cb-mosaic-wrap">
                  <img src={item.mosaic} className="cb-mosaic" alt="" />
                </div>
                <h3 className="cb-closed-title">{item.title}</h3>
              </div>

              {/* Opened */}
              <div className="cb-opened">
                <img src={item.chat} className="cb-chat" alt="" />
                <div className="cb-opened-body">
                  <h3 className="cb-opened-title">{item.title}</h3>
                  <p className="cb-opened-desc">{item.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

const CSS = `
@font-face {
  font-family: 'Geist';
  src: url('https://fonts.gstatic.com/s/geist/v5/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOM4mJPby1QNtA.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Geist';
  src: url('https://fonts.gstatic.com/s/geist/v5/gyBhhwUxId8gMGYQMKR3pzfaWI_RQuQ4mJPby1QNtA.woff2') format('woff2');
  font-weight: 600; font-style: normal; font-display: swap;
}

.cb-section {
  width: 100%; max-width: 1240px; margin: 0 auto;
  padding: 80px 20px;
  display: flex; flex-direction: column; gap: 40px;
  font-family: 'Geist', system-ui, sans-serif;
  color: #16233d;
  background: #f2f5fb;
}
.cb-header {
  display: flex; flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
  width: 100%;
}
@media (min-width: 768px) {
  .cb-header { flex-direction: row; align-items: flex-end; gap: 0; }
}
.cb-header-left { display: flex; flex-direction: column; gap: 12px; }
.cb-eyebrow {
  color: #3358df;
  font-weight: 600; font-size: 14px;
  text-transform: uppercase; letter-spacing: 0.02em;
  margin: 0;
}
.cb-title {
  font-family: 'DM Sans', sans-serif;
  font-weight: 500; font-size: 40px; line-height: 1.05;
  color: #16233d; margin: 0;
}
@media (min-width: 768px) { .cb-title { font-size: 52px; } }
.cb-blurb {
  color: #5e6472; font-size: 16px; line-height: 1.2;
  max-width: 420px; margin: 0;
}

.cb-cards {
  display: flex; flex-direction: column; gap: 12px;
  height: 500px; width: 100%;
}
@media (min-width: 768px) { .cb-cards { flex-direction: row; height: 420px; } }

.cb-card {
  flex: 1; position: relative;
  border-radius: 12px; background: #e6ecf7;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden; cursor: pointer;
  outline: none;
}
.cb-card:hover, .cb-card:focus-within {
  flex: 1.25;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 12px 24px 0 rgba(51, 88, 223, 0.10);
}

.cb-closed {
  position: absolute; inset: 0;
  padding: 20px 20px 40px;
  display: flex; flex-direction: column; justify-content: space-between;
  transition: opacity 0.4s ease, transform 0.4s ease;
  opacity: 1; transform: translateY(0);
}
.cb-card:hover .cb-closed,
.cb-card:focus-within .cb-closed {
  opacity: 0; transform: translateY(-10px); pointer-events: none;
}

.cb-opened {
  position: absolute; inset: 0;
  padding: 8px;
  display: flex; flex-direction: column;
  opacity: 0; transform: translateY(10px); pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.cb-card:hover .cb-opened,
.cb-card:focus-within .cb-opened {
  opacity: 1; transform: translateY(0); pointer-events: auto;
}

.cb-num {
  font-family: 'DM Sans', sans-serif;
  font-weight: 500; font-size: 52px;
  color: #c8d3e5; line-height: 1;
}
.cb-mosaic-wrap { flex: 1; position: relative; margin: 16px 0; }
.cb-mosaic {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  mix-blend-mode: multiply;
  filter: hue-rotate(190deg) saturate(1.1);
}
.cb-closed-title {
  font-family: 'DM Sans', sans-serif;
  font-weight: 500; font-size: 20px;
  color: #16233d; margin: 0;
}

.cb-chat {
  width: 100%; aspect-ratio: 1.56 / 1;
  object-fit: cover; border-radius: 12px;
  filter: hue-rotate(190deg) saturate(1.1);
}
.cb-opened-body {
  flex: 1; display: flex; flex-direction: column;
  justify-content: center; padding: 0 16px; gap: 8px;
}
.cb-opened-title {
  font-family: 'DM Sans', sans-serif;
  font-weight: 500; font-size: 32px; line-height: 1.1;
  color: #16233d; margin: 0;
}
.cb-opened-desc {
  font-size: 14px; line-height: 1.2;
  color: #5e6472; margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .cb-card, .cb-closed, .cb-opened { transition: opacity 0.2s ease !important; transform: none !important; }
}
`;
