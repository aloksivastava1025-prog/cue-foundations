/**
 * Cue Foundations · Sticker Collage Peel Footer
 * ────────────────────────────────────────────
 * A fixed blue footer with hand-drawn CSS stickers and a giant springy letter-pop wordmark is revealed as the main content peels upward on scroll.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/sticker-collage-peel-footer.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue062
 *
 * Original Cue ID: cue062
 * Category: Sections & Layouts
 * ────────────────────────────────────────────
 */

/**
 * Truus Gen-Z Footer Reveal — React + TypeScript
 *
 * Scroll-peel footer. Main content covers 100vh; as you scroll, main-content
 * peels UP and reveals the fixed sticker-collage footer beneath.
 *
 * Usage:
 *   import TruusFooter from './TruusFooter';
 *   <TruusFooter
 *     brand="truus"
 *     mainChildren={<YourPageContent />}
 *   />
 */

import React, { useEffect, useRef } from 'react';

interface TruusFooterProps {
  brand?: string;                                // giant background wordmark
  mainChildren?: React.ReactNode;                // your page above the fold
  navLogo?: string;
  navCenter?: string;
  contactEmail?: string;
  location?: [string, string];                   // ["Street", "City ZIP"]
  socials?: string[];                            // ["in", "ig", "tk"]
}

export default function TruusFooter({
  brand = 'footer',
  mainChildren,
  navLogo = 'truus',
  navCenter = 'truus',
  contactEmail = 'hello@youragency.com',
  location = ['123 Creative Street', 'Design District, NY 10001'],
  socials = ['in', 'ig', 'tk'],
}: TruusFooterProps) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spacer = spacerRef.current;
    const giant = giantRef.current;
    if (!spacer || !giant) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          giant.classList.toggle('visible', entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(spacer);
    return () => observer.disconnect();
  }, []);

  const brandLetters = [...brand];

  return (
    <>
      <style>{CSS}</style>

      <div className="tz-main-content">
        <div className="tz-navbar">
          <div className="tz-nav-logo-left">
            <div className="tz-starburst" />
            {navLogo}
          </div>
          <div className="tz-nav-logo-center">{navCenter}</div>
          <div className="tz-nav-icon-right">→</div>
        </div>
        {mainChildren ?? <div className="tz-scroll-prompt">scroll down</div>}
      </div>

      <div className="tz-footer-spacer" ref={spacerRef} />

      <div className="tz-footer-fixed-wrapper">
        <footer className="tz-footer">
          {/* Top 3-column contact grid */}
          <div className="tz-footer-top">
            <div className="tz-col">
              <div className="tz-pill">start a project</div>
              <h2>let's build something amazing together</h2>
            </div>
            <div className="tz-col">
              <div className="tz-pill">location</div>
              <p>{location[0]}</p>
              <p>{location[1]}</p>
              <div className="tz-link-underline">Google Maps</div>
            </div>
            <div className="tz-col">
              <div className="tz-pill">say hello</div>
              <p>{contactEmail}</p>
              <p>slide into our DMs*</p>
              <div className="tz-subtext">*we're allergic to phone calls. just text us.</div>
              <div className="tz-social-icons">
                {socials.map(s => <div key={s} className="tz-social-icon">{s}</div>)}
              </div>
            </div>
          </div>

          {/* Bottom canvas — giant text + stickers */}
          <div className="tz-footer-bottom">
            <div className="tz-giant-text" ref={giantRef}>
              {brandLetters.map((ch, i) => <span key={i}>{ch}</span>)}
            </div>

            {/* 6 stickers + credits */}
            <div className="tz-sticker tz-st-bam"><span>BAM</span></div>
            <div className="tz-sticker tz-st-smiley"><div className="tz-smile" /></div>
            <div className="tz-sticker tz-st-heart">
              <svg viewBox="0 0 100 100">
                <path d="M50,90 Q50,90 20,60 A20,20 0 0,1 50,30 A20,20 0 0,1 80,60 Q80,60 50,90 Z"
                      fill="#8b1e3f" stroke="#f4efe9" strokeWidth="4"/>
                <path d="M20,20 L25,10 L30,20 L40,25 L30,30 L25,40 L20,30 L10,25 Z" fill="#f4efe9"/>
                <path d="M80,30 L83,20 L86,30 L96,33 L86,36 L83,46 L80,36 L70,33 Z"
                      fill="#f4efe9" transform="scale(0.6) translate(50, -10)"/>
              </svg>
            </div>
            <div className="tz-sticker tz-st-hands"><div className="tz-inner-heart" /></div>
            <div className="tz-sticker tz-st-100">100</div>
            <div className="tz-sticker tz-st-camera">
              <div className="tz-lens" />
              <div className="tz-flash" />
            </div>
            <div className="tz-sticker tz-st-credits">credits</div>
          </div>
        </footer>
      </div>
    </>
  );
}

const CSS = `
:root {
  --bg-beige: #ffffff;
  --truus-blue: #4d66f0;
  --text-black: #111111;
  --text-white: #ffffff;
  --st-orange: #ff5722;
  --st-pink:   #eb8ba6;
  --st-maroon: #8b1e3f;
  --st-green:  #1a644c;
}

.tz-main-content {
  background: var(--bg-beige);
  min-height: 100vh;
  position: relative;
  z-index: 10;
  padding-bottom: 50px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  font-family: 'Inter', -apple-system, sans-serif;
  color: var(--text-black);
}

.tz-navbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 30px 40px;
  font-weight: 900; font-size: 24px; letter-spacing: -1px;
}
.tz-nav-logo-left { display: flex; align-items: center; position: relative; }
.tz-starburst {
  position: absolute; left: -15px; top: -5px; z-index: -1;
  width: 30px; height: 30px; background: var(--st-orange);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
.tz-nav-logo-center { font-family: 'Pacifico', cursive; font-size: 32px; letter-spacing: 0; }
.tz-nav-icon-right {
  width: 28px; height: 28px;
  background: var(--text-black); border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  color: var(--bg-beige); font-size: 14px;
}

.tz-scroll-prompt {
  display: flex; justify-content: center; align-items: center;
  height: 100vh;
  font-size: 16px; font-weight: 500;
  opacity: 0.4; text-align: center; text-transform: lowercase;
}

.tz-footer-spacer { height: 100vh; pointer-events: none; }

.tz-footer-fixed-wrapper {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 1;
  height: 100vh;
  background: var(--bg-beige);
  display: flex; flex-direction: column;
  font-family: 'Inter', -apple-system, sans-serif;
}

.tz-footer {
  background: var(--truus-blue);
  border-radius: 32px;
  padding: 60px 40px;
  color: var(--text-white);
  position: relative;
  flex: 1;
  margin: 40px 6px 6px 6px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex; flex-direction: column;
}

.tz-footer-top {
  display: flex; justify-content: space-between; align-items: flex-start;
  z-index: 20; position: relative;
}
.tz-col { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
.tz-pill {
  background: #fff; color: var(--text-black);
  font-size: 14px; font-weight: 800;
  padding: 8px 16px; border-radius: 20px;
  margin-bottom: 20px;
}
.tz-col h2, .tz-col p {
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 800; margin: 0; line-height: 1.2; letter-spacing: -0.5px;
}
.tz-link-underline {
  font-size: 16px; font-weight: 500; margin-top: 20px;
  text-decoration: underline; text-underline-offset: 4px; cursor: pointer;
}
.tz-subtext { font-size: 11px; font-weight: 500; margin-top: 15px; opacity: 0.9; }
.tz-social-icons { display: flex; gap: 10px; margin-top: 15px; }
.tz-social-icon {
  width: 28px; height: 28px;
  border: 2px solid var(--text-white);
  border-radius: 5px;
  display: flex; justify-content: center; align-items: center;
  font-size: 12px; font-weight: bold;
}

.tz-footer-bottom {
  position: absolute; inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.tz-giant-text {
  position: absolute;
  bottom: -5vw; left: 50%;
  transform: translateX(-50%) rotate(-4deg);
  font-family: 'Pacifico', cursive;
  font-size: 32vw;
  color: var(--bg-beige);
  line-height: 1; white-space: nowrap;
  z-index: 1;
  letter-spacing: -2vw;
  -webkit-font-smoothing: antialiased;
}
.tz-giant-text span {
  display: inline-block;
  opacity: 0;
  transform: translateY(100px) scale(0.8) rotate(10deg);
  transition:
    opacity 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.tz-giant-text.visible span { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
.tz-giant-text.visible span:nth-child(1) { transition-delay: 0.0s; }
.tz-giant-text.visible span:nth-child(2) { transition-delay: 0.1s; }
.tz-giant-text.visible span:nth-child(3) { transition-delay: 0.2s; }
.tz-giant-text.visible span:nth-child(4) { transition-delay: 0.3s; }
.tz-giant-text.visible span:nth-child(5) { transition-delay: 0.4s; }
.tz-giant-text.visible span:nth-child(6) { transition-delay: 0.5s; }

.tz-sticker {
  position: absolute;
  z-index: 5;
  pointer-events: auto;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.tz-sticker:hover { transform: scale(1.15) rotate(5deg); }

.tz-st-bam {
  bottom: 8%; left: 3%;
  width: 100px; height: 100px;
  background: var(--st-orange);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  display: flex; justify-content: center; align-items: center;
  transform: rotate(-15deg);
}
.tz-st-bam span { color: var(--text-white); font-weight: 900; font-size: 22px; transform: rotate(15deg); }

.tz-st-smiley {
  bottom: 25%; left: 22%;
  width: 90px; height: 90px;
  background: #8fa5f2;
  border-radius: 50%;
  border: 4px solid var(--bg-beige);
}
.tz-st-smiley::before, .tz-st-smiley::after {
  content: ''; position: absolute; top: 25px;
  width: 10px; height: 18px;
  border: 3px solid var(--bg-beige); border-radius: 50%; border-bottom: 0;
}
.tz-st-smiley::before { left: 20px; }
.tz-st-smiley::after  { right: 20px; }
.tz-smile {
  position: absolute; bottom: 15px; left: 15px; right: 15px; height: 35px;
  border: 3px solid var(--bg-beige); border-top: 0;
  border-radius: 0 0 40px 40px;
}

.tz-st-heart { bottom: 12%; left: 45%; width: 90px; height: 80px; transform: rotate(10deg); }
.tz-st-heart svg { width: 100%; height: 100%; }

.tz-st-hands {
  bottom: 3%; left: 55%;
  width: 90px; height: 70px;
  background: var(--st-green);
  border-radius: 40px;
  border: 4px solid var(--bg-beige);
  transform: rotate(-10deg);
  display: flex; justify-content: center; align-items: center;
}
.tz-inner-heart {
  position: relative;
  width: 25px; height: 25px;
  border: 3px solid var(--bg-beige);
  transform: rotate(45deg);
  border-radius: 50% 50% 0 0;
  border-bottom: 0; border-left: 0;
  margin-top: 10px;
}
.tz-inner-heart::before {
  content: ''; position: absolute;
  width: 25px; height: 25px;
  border: 3px solid var(--bg-beige);
  border-radius: 50% 50% 0 0; border-bottom: 0; border-right: 0;
  top: -3px; left: -22px;
}

.tz-st-100 {
  bottom: 30%; right: 25%;
  width: 80px; height: 60px;
  background: var(--st-pink);
  border-radius: 15px;
  border: 4px solid var(--bg-beige);
  transform: rotate(-15deg);
  display: flex; justify-content: center; align-items: center;
  font-style: italic; font-weight: 900; font-size: 38px;
  color: var(--st-maroon);
}

.tz-st-camera {
  bottom: 10%; right: 10%;
  width: 90px; height: 70px;
  background: var(--text-black);
  border-radius: 15px;
  border: 4px solid var(--bg-beige);
  transform: rotate(15deg);
}
.tz-lens {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 35px; height: 35px;
  border: 3px solid var(--bg-beige); border-radius: 50%;
}
.tz-flash {
  position: absolute; top: 10px; right: 15px;
  width: 10px; height: 10px;
  background: var(--bg-beige); border-radius: 2px;
}
.tz-st-camera::before {
  content: ''; position: absolute; top: -30px; left: -20px;
  width: 50px; height: 50px; background: #f1c40f;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  z-index: -1; transform: rotate(-20deg);
}

.tz-st-credits {
  bottom: 15px; right: -5px;
  background: var(--text-black); color: var(--text-white);
  font-size: 11px; font-weight: bold; padding: 6px 12px; border-radius: 12px;
}

@media (max-width: 900px) {
  .tz-footer-top { flex-direction: column; gap: 32px; }
}
@media (max-width: 600px) {
  .tz-sticker { transform: scale(0.8); }
  .tz-footer { padding: 40px 24px; }
  .tz-giant-text { font-size: 40vw; }
}
@media (prefers-reduced-motion: reduce) {
  .tz-giant-text span { transition: none !important; opacity: 1 !important; transform: none !important; }
  .tz-sticker { transition: none !important; }
}
`;
