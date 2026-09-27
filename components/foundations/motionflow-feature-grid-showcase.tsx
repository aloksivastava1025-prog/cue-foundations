/**
 * Cue Foundations · MotionFlow Feature Grid Showcase
 * ────────────────────────────────────────────
 * A three-card feature grid with masked split-line headline reveal, staggered fade-ups, and live animated UI mockups per card.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/motionflow-feature-grid-showcase.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue187
 *
 * Original Cue ID: cue187
 * Category: Sections & Layouts
 * ────────────────────────────────────────────
 */

import { useEffect, useState } from "react";

/**
 * MotionFlowFeatures — 3-card feature grid with a split-line reveal on the
 * headline, staggered fade-up on desc/CTA/cards, and live mockups inside each
 * card: an animated progress bar with synced counter (Card 1), a CRM stat
 * card with bar chart (Card 2), and stacked campaign event pills (Card 3).
 *
 * Everything is self-contained — inline <style>, no external CSS. Only the
 * Card 2 avatar comes from an Unsplash URL (swap via prop for production).
 */

export default function MotionFlowFeatures({
  titleLines = ["Creating stunning videos is hard.", "MotionFlow makes it effortless."],
  description = "MotionFlow connects everything that helps you succeed in visual storytelling - in one place to make rendering easier than you think.",
  ctaLabel = "Start creating",
  onCtaClick,
  avatarSrc = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&h=100",
}: {
  titleLines?: string[];
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  avatarSrc?: string;
}) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setPercent(60); return; }
    const start = performance.now() + 1200;   // matches the CSS fillBar delay
    const duration = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = Math.max(0, now - start);
      const p = Math.min(1, elapsed / duration);
      setPercent(Math.floor(p * 60));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>{css}</style>
      <section className="mff-section">
        <div className="mff-header">
          <h2 className="mff-title">
            {titleLines.map((line, i) => (
              <span key={i} className="mff-line-wrapper">
                <span
                  className="mff-line-text"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>
          <div className="mff-header-content">
            <p className="mff-desc">{description}</p>
            <button type="button" className="mff-cta" onClick={onCtaClick}>
              {ctaLabel}
            </button>
          </div>
        </div>

        <div className="mff-grid">
          {/* CARD 1 — Render Engine */}
          <div className="mff-card">
            <div className="mff-card-header">
              <div className="mff-card-label">Render Engine</div>
              <h3 className="mff-card-title">Launch your own 3D renders in seconds</h3>
            </div>

            <div className="mff-card-visual">
              <div className="mff-c1-mock">
                <div className="mff-mock-title">Everyday cinematic magic</div>
                <div className="mff-mock-desc">Effortless, sharp, and made for high-res</div>
                <div className="mff-mock-boxes">
                  <div className="mff-mock-box" style={{ background: "#E8DFD5" }} />
                  <div className="mff-mock-box" style={{ background: "#E0DBD5" }} />
                </div>
              </div>

              <div className="mff-progress-pill">
                <div className="mff-progress-info">
                  <span>Rendering your scene</span>
                  <span className="mff-progress-percent">{percent}%</span>
                </div>
                <div className="mff-progress-track">
                  <div className="mff-progress-fill">
                    <div className="mff-progress-thumb" />
                  </div>
                  <div className="mff-progress-dots">
                    <div /><div /><div /><div />
                  </div>
                </div>
              </div>
            </div>

            <div className="mff-card-footer">
              <CheckItem>Launch branded environments in lightning speeds.</CheckItem>
              <CheckItem>Track rendering progress automatically.</CheckItem>
            </div>
          </div>

          {/* CARD 2 — Asset Manager */}
          <div className="mff-card">
            <div className="mff-card-header">
              <div className="mff-card-label">Asset Manager</div>
              <h3 className="mff-card-title">Manage 3D assets in one place</h3>
            </div>

            <div className="mff-card-visual">
              <div className="mff-c2-wrap">
                <div className="mff-social-pills">
                  <div className="mff-s-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                    Blender
                  </div>
                  <div className="mff-s-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                    Cinema4D
                  </div>
                  <div className="mff-s-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L2 22h20L12 2z"/></svg>
                    Maya
                  </div>
                </div>

                <div className="mff-crm">
                  <div className="mff-crm-header">
                    <div className="mff-crm-user">
                      <img src={avatarSrc} alt="" className="mff-crm-avatar" />
                      <span className="mff-crm-username">@creative_pro</span>
                    </div>
                    <div className="mff-crm-dots">...</div>
                  </div>
                  <div className="mff-crm-sub">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 13, height: 13, strokeWidth: 2 }}>
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    <span>120 nodes active</span>
                  </div>
                  <div className="mff-crm-stats">
                    <div className="mff-rate">
                      <span className="mff-rate-value">12.4s</span>
                      <span className="mff-rate-label">render time</span>
                    </div>
                    <div className="mff-bars">
                      <div className="mff-bar" style={{ height: "40%" }} />
                      <div className="mff-bar mff-bar-active" style={{ height: "100%" }} />
                      <div className="mff-bar" style={{ height: "60%" }} />
                      <div className="mff-bar" style={{ height: "45%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mff-card-footer">
              <CheckItem>View performance at a glance to spot slow nodes.</CheckItem>
              <CheckItem>Use custom tags and fields to stay organized.</CheckItem>
            </div>
          </div>

          {/* CARD 3 ��� Timelines */}
          <div className="mff-card">
            <div className="mff-card-header">
              <div className="mff-card-label">Timelines</div>
              <h3 className="mff-card-title">Launch render queues in minutes</h3>
            </div>

            <div className="mff-card-visual">
              <div className="mff-c3-wrap">
                <div className="mff-camp mff-offset-left">
                  <div className="mff-camp-icon mff-orange">
                    <svg viewBox="0 0 24 24"><polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/></svg>
                  </div>
                  <div className="mff-camp-text">
                    <span>Queue started</span>
                    <small>Frame cache</small>
                  </div>
                  <span className="mff-camp-time">2m ago</span>
                </div>

                <div className="mff-camp mff-purple">
                  <span>321.46k</span>
                  <small>Frames rendered</small>
                </div>

                <div className="mff-camp mff-offset-right">
                  <div className="mff-camp-icon mff-green">
                    <svg viewBox="0 0 24 24"><polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/></svg>
                  </div>
                  <div className="mff-camp-text">
                    <span>Queue finished</span>
                    <small>Final output</small>
                  </div>
                  <span className="mff-camp-time">1m ago</span>
                </div>
              </div>
            </div>

            <div className="mff-card-footer">
              <CheckItem>Use ready-made templates for cinematic shots.</CheckItem>
              <CheckItem>Track frames, compositions all in one place.</CheckItem>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="mff-check">
      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>{children}</span>
    </div>
  );
}

const css = `
.mff-section {
  width: 100%;
  max-width: 1240px;
  padding: 24px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #000;
  box-sizing: border-box;
}

@keyframes mffMaskUp {
  0%   { transform: translateY(120%) rotate(2deg); opacity: 0; transform-origin: left bottom; }
  100% { transform: translateY(0)    rotate(0);    opacity: 1; transform-origin: left bottom; }
}
@keyframes mffFadeUp {
  0%   { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0);    opacity: 1; }
}
@keyframes mffFillBar { 0% { width: 0%; } 100% { width: 60%; } }
@keyframes mffPulse {
  0%   { box-shadow: 0 0 0 0 rgba(145,123,245,0.4); }
  100% { box-shadow: 0 0 0 8px rgba(145,123,245,0); }
}

.mff-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  gap: 40px;
}

.mff-title {
  flex: 1.2;
  font-size: 46px;
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: #111;
  margin: 0;
}
.mff-line-wrapper {
  overflow: hidden;
  display: block;
  width: 100%;
  padding-bottom: 5px;
  margin-bottom: -5px;
}
.mff-line-text {
  display: block;
  transform: translateY(120%);
  opacity: 0;
  animation: mffMaskUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.mff-header-content {
  flex: 1;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-top: 8px;
}
.mff-desc, .mff-cta, .mff-card {
  opacity: 0;
  animation: mffFadeUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.mff-desc { animation-delay: 0.3s; font-size: 13px; color: #555; line-height: 1.5; margin: 0; }
.mff-cta  {
  animation-delay: 0.4s;
  background: #000;
  color: #FFF;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.2s, background 0.2s;
}
.mff-cta:hover { background: #222; transform: translateY(-1px); }

.mff-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.mff-card:nth-child(1) { animation-delay: 0.5s; }
.mff-card:nth-child(2) { animation-delay: 0.6s; }
.mff-card:nth-child(3) { animation-delay: 0.7s; }

.mff-card {
  background: #F7F7F9;
  border-radius: 24px;
  padding: 24px 24px 32px 24px;
  display: flex;
  flex-direction: column;
  height: 440px;
  position: relative;
  overflow: hidden;
}
.mff-card-header { margin-bottom: 20px; z-index: 2; }
.mff-card-label {
  font-size: 11px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}
.mff-card-title {
  font-size: 20px;
  font-weight: 600;
  color: #111;
  line-height: 1.3;
  letter-spacing: -0.02em;
  margin: 0;
}
.mff-card-visual {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.mff-card-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 2;
}
.mff-check {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 13px;
  color: #444;
  line-height: 1.4;
}
.mff-check svg {
  width: 14px;
  height: 14px;
  stroke: #111;
  margin-top: 2px;
  flex-shrink: 0;
  stroke-width: 2.5;
}

/* Card 1 */
.mff-c1-mock {
  position: absolute;
  top: 15%;
  width: 200px;
  height: 200px;
  background: #FFF;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.04);
  padding: 20px;
  opacity: 0.6;
  filter: blur(2px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transform: scale(0.95);
}
.mff-mock-title { font-size: 14px; font-weight: 600; color: #333; text-align: center; margin-bottom: 8px; }
.mff-mock-desc  { font-size: 10px; color: #888; text-align: center; line-height: 1.4; }
.mff-mock-boxes { display: flex; gap: 8px; margin-top: 10px; }
.mff-mock-box   { flex: 1; height: 80px; background: #EEE; border-radius: 8px; }

.mff-progress-pill {
  position: relative;
  background: #FFF;
  border-radius: 16px;
  padding: 20px 24px;
  width: 110%;
  box-shadow: 0 16px 40px rgba(0,0,0,0.08);
  z-index: 3;
  box-sizing: border-box;
}
.mff-progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #111;
}
.mff-progress-info span:last-child { color: #888; }
.mff-progress-track {
  background: #F0F0F5;
  height: 16px;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
}
.mff-progress-fill {
  background: linear-gradient(90deg, #6953ED, #917BF5);
  height: 100%;
  border-radius: 8px;
  width: 0%;
  position: relative;
  box-shadow: 0 6px 16px rgba(105,83,237,0.4);
  animation: mffFillBar 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 1.2s;
}
.mff-progress-thumb {
  width: 10px;
  height: 10px;
  background: #FFF;
  border-radius: 50%;
  position: absolute;
  right: 3px;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  animation: mffPulse 1.5s infinite;
}
.mff-progress-dots {
  position: absolute;
  right: 12px;
  display: flex;
  gap: 4px;
}
.mff-progress-dots div { width: 4px; height: 4px; background: #D1D1D6; border-radius: 50%; }

/* Card 2 */
.mff-c2-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}
.mff-social-pills { display: flex; gap: 8px; }
.mff-s-pill {
  background: #FFF;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.mff-s-pill svg { width: 12px; height: 12px; }

.mff-crm {
  background: #FFF;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  box-shadow: 0 16px 40px rgba(0,0,0,0.06);
  box-sizing: border-box;
}
.mff-crm-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.mff-crm-user   { display: flex; align-items: center; gap: 10px; }
.mff-crm-avatar { width: 28px; height: 28px; border-radius: 50%; background: #F0F0F0; object-fit: cover; }
.mff-crm-username { font-size: 13px; font-weight: 500; color: #111; }
.mff-crm-dots {
  color: #CCC;
  letter-spacing: 2px;
  font-weight: bold;
  margin-top: -8px;
}
.mff-crm-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #888;
  margin-bottom: 24px;
  padding-left: 38px;
  margin-top: -16px;
}
.mff-crm-stats { display: flex; justify-content: space-between; align-items: flex-end; }
.mff-rate { display: flex; flex-direction: column; }
.mff-rate-value {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: #111;
  line-height: 1;
  margin-bottom: 4px;
}
.mff-rate-label { font-size: 11px; color: #888; }

.mff-bars { display: flex; align-items: flex-end; gap: 8px; height: 48px; }
.mff-bar  { width: 16px; background: #E6E8FC; border-radius: 8px; }
.mff-bar-active { background: #7362F3; }

/* Card 3 */
.mff-c3-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  align-items: center;
}
.mff-camp {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.05);
  background: #FFF;
  width: 90%;
  position: relative;
  box-sizing: border-box;
}
.mff-offset-left  { transform: translateX(-10%); }
.mff-offset-right { transform: translateX(10%); width: 85%; }
.mff-camp-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}
.mff-orange { background: #FFEBD6; color: #F97316; }
.mff-green  { background: #DCFCE7; color: #22C55E; }
.mff-camp-icon svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; }

.mff-camp-text { display: flex; flex-direction: column; gap: 2px; }
.mff-camp-text span  { font-size: 12px; font-weight: 500; color: #111; }
.mff-camp-text small { font-size: 10px; color: #888; }
.mff-camp-time {
  margin-left: auto;
  font-size: 10px;
  color: #AAA;
}

.mff-purple {
  background: #7362F3;
  color: #FFF;
  box-shadow: 0 12px 24px rgba(115,98,243,0.2);
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
}
.mff-purple span  { font-size: 13px; font-weight: 600; }
.mff-purple small { font-size: 13px; color: rgba(255,255,255,0.8); }

/* Responsive */
@media (max-width: 1023px) {
  .mff-grid { grid-template-columns: repeat(2, 1fr); }
  .mff-card:nth-child(3) { grid-column: 1 / -1; }
  .mff-header { flex-direction: column; gap: 24px; }
  .mff-title { font-size: 40px; }
}
@media (max-width: 640px) {
  .mff-title { font-size: 32px; letter-spacing: -0.02em; }
  .mff-grid { grid-template-columns: 1fr; }
  .mff-card:nth-child(3) { grid-column: auto; }
  .mff-card { height: 380px; }
  .mff-progress-pill { width: 100%; }
  .mff-offset-left, .mff-offset-right { transform: none; width: 100%; }
  .mff-card-title { font-size: 18px; }
  .mff-check { font-size: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .mff-line-text, .mff-desc, .mff-cta, .mff-card {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .mff-progress-fill { animation: none !important; width: 60% !important; }
  .mff-progress-thumb { animation: none !important; }
}
`;
