/**
 * Cue Foundations · Dynamic Notch Activity Indicator
 * ────────────────────────────────────────────
 * A macOS-style notch that morphs width and accent color to visualize live agent states like reading, writing, and running commands.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/dynamic-notch-activity-indicator.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue072
 *
 * Original Cue ID: cue072
 * Category: Utilities & Scripts
 * ────────────────────────────────────────────
 */

/**
 * Dynamic Notch — Real-Time Agent Activity Indicator
 *
 * Zero deps. Pure CSS + a width-measurement trick.
 *
 * Usage — auto-cycle demo reel:
 *   <DynamicNotch />
 *
 * Usage — controlled from parent (drive from real agent events):
 *   <DynamicNotch controlled state={{ type:'reading', color:'#ff99a8', top:'Read utils.ts 42 lines', bottom:'Reading files' }} />
 *
 * Font (add to global head):
 *   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
 */

import React, { useEffect, useRef, useState } from 'react';

type AgentType = 'scanning' | 'reading' | 'planning' | 'writing' | 'terminal' | 'success';

export interface NotchState {
  type: AgentType;
  color: string;
  top?: string;         // static top text
  bottom: string;       // bottom label
  files?: string[];
  file?: string;
  commands?: string[];
  duration?: number;    // ms, used only in auto-cycle mode
}

interface DynamicNotchProps {
  states?: NotchState[];
  active?: boolean;              // parent can retract
  controlled?: boolean;          // if true, `state` prop drives it (no auto cycle)
  state?: NotchState;
  onCycle?: (i: number, s: NotchState) => void;
}

const DEFAULT_STATES: NotchState[] = [
  { type: 'scanning', top: 'Analyzing 14,204 tokens',   bottom: 'Thinking',      color: '#ffc18f', duration: 2500 },
  { type: 'reading',  files: ['__root.tsx','app-sidebar.tsx','api/auth.ts','tooltip.tsx','utils.ts'], bottom: 'Reading files',  color: '#ff99a8', duration: 4500 },
  { type: 'planning', top: 'Synthesizing knowledge',    bottom: 'Drafting plan', color: '#c299ff', duration: 2500 },
  { type: 'writing',  file: 'DynamicNotch.html',        bottom: 'Writing code',  color: '#82ff9e', duration: 5000 },
  { type: 'terminal', commands: ['npm run lint','tsc --noEmit','vite build','vitest run'], bottom: 'Running checks', color: '#ffeb85', duration: 3500 },
  { type: 'success',  top: 'Task completed successfully', bottom: 'Done',        color: '#8ab4ff', duration: 3000 },
];

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function measureWidth(top: string, bottom: string): number {
  const ghost = document.createElement('div');
  ghost.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:"Inter",sans-serif;padding:0 28px;display:flex;flex-direction:column';
  ghost.innerHTML = `
    <div style="font-size:13px;font-weight:500;">${top}</div>
    <div style="display:flex;gap:10px;font-size:15px;font-weight:600;">
      <div style="width:14px;"></div><div>${bottom}</div>
    </div>`;
  document.body.appendChild(ghost);
  const w = ghost.offsetWidth + 12;
  document.body.removeChild(ghost);
  return w;
}

export default function DynamicNotch({
  states = DEFAULT_STATES,
  active = true,
  controlled = false,
  state,
  onCycle,
}: DynamicNotchProps) {
  const notchRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [topHtml, setTopHtml] = useState('Initializing…');
  const [bottomText, setBottomText] = useState('Agent booting');
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(-1);

  function applyColor(hex: string) {
    const notch = notchRef.current;
    if (!notch) return;
    notch.style.setProperty('--glow-color', hex);
    notch.style.setProperty('--glow-color-dim', hexToRgba(hex, 0.15));
  }

  function setContentOpacity(v: number) {
    if (contentRef.current) contentRef.current.style.opacity = String(v);
  }

  function enterState(s: NotchState) {
    if (tickerRef.current) { clearInterval(tickerRef.current); tickerRef.current = null; }
    setContentOpacity(0);

    setTimeout(() => {
      applyColor(s.color);
      setBottomText(s.bottom);

      if (s.type === 'scanning' || s.type === 'planning' || s.type === 'success') {
        if (notchRef.current) notchRef.current.style.width = measureWidth(s.top || '', s.bottom) + 'px';
        setTopHtml(s.top || '');
      } else if (s.type === 'reading' && s.files) {
        if (notchRef.current) notchRef.current.style.width = measureWidth('Read app-sidebar.tsx 999 lines', s.bottom) + 'px';
        let fileIdx = 0, lines = 10;
        const tick = () => {
          const f = s.files![fileIdx % s.files!.length];
          lines += Math.floor(Math.random() * 40) + 12;
          setTopHtml(`Read ${f} <span style="opacity:0.6">${lines} lines</span>`);
          fileIdx++;
          if (fileIdx % 3 === 0) lines = 10;
        };
        tick();
        tickerRef.current = setInterval(tick, 180);
      } else if (s.type === 'writing' && s.file) {
        if (notchRef.current) notchRef.current.style.width = measureWidth('Update DynamicNotch.html +999 lines', s.bottom) + 'px';
        let written = 0;
        const tick = () => {
          written += Math.floor(Math.random() * 6) + 1;
          setTopHtml(`Update ${s.file} <span style="opacity:0.6;color:#82ff9e">+${written} lines</span>`);
        };
        tick();
        tickerRef.current = setInterval(tick, 90);
      } else if (s.type === 'terminal' && s.commands) {
        if (notchRef.current) notchRef.current.style.width = measureWidth('> vite build 850ms', s.bottom) + 'px';
        let cmdIdx = 0;
        const tick = () => {
          const cmd = s.commands![cmdIdx % s.commands!.length];
          const ms = Math.floor(Math.random() * 600) + 120;
          setTopHtml(`> ${cmd} <span style="opacity:0.6">${ms}ms</span>`);
          cmdIdx++;
        };
        tick();
        tickerRef.current = setInterval(tick, 800);
      }

      setContentOpacity(1);
    }, 250);
  }

  useEffect(() => {
    if (!controlled) return;
    if (state) enterState(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlled, state]);

  useEffect(() => {
    if (controlled) return;
    let cancelled = false;
    const step = () => {
      if (cancelled) return;
      indexRef.current = (indexRef.current + 1) % states.length;
      const s = states[indexRef.current];
      enterState(s);
      onCycle?.(indexRef.current, s);
      cycleTimerRef.current = setTimeout(step, s.duration ?? 3000);
    };
    const kickoff = setTimeout(step, 800);
    return () => {
      cancelled = true;
      clearTimeout(kickoff);
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlled, states]);

  return (
    <>
      <style>{CSS}</style>
      <div className="dn-bezel" />
      <div ref={notchRef} className={`dn-notch ${active ? 'active' : ''}`}>
        <div ref={contentRef} className="dn-content">
          <div className="dn-top" dangerouslySetInnerHTML={{ __html: topHtml }} />
          <div className="dn-bottom-row">
            <div className="dn-pixel">
              <span/><span/><span/>
              <span/><span/><span/>
              <span/><span/><span/>
            </div>
            <div className="dn-bottom">{bottomText}</div>
          </div>
        </div>
      </div>
    </>
  );
}

const CSS = `
.dn-bezel {
  position: absolute; top: 0; left: 0; right: 0;
  height: 14px; background: #000; z-index: 10;
}
.dn-notch {
  position: absolute;
  top: 14px; left: 50%;
  transform: translate(-50%, -100%);
  background: #000;
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
  height: 58px; padding: 0 28px;
  display: flex; align-items: center; justify-content: center;
  z-index: 9;
  --glow-color: #ff99a8;
  --glow-color-dim: rgba(255,153,168,0.15);
  box-shadow:
    0 15px 35px rgba(0,0,0,0.10),
    0 25px 60px var(--glow-color-dim);
  transition:
    width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.6s ease;
  will-change: width, transform;
  font-family: 'Inter', system-ui, sans-serif;
}
.dn-notch.active { transform: translate(-50%, 0); }

.dn-notch::before,
.dn-notch::after {
  content: '';
  position: absolute; top: -1px;
  width: 20px; height: 20px;
  background: transparent; pointer-events: none;
}
.dn-notch::before {
  right: 100%;
  border-top-right-radius: 20px;
  box-shadow: 10px -10px 0 10px #000;
}
.dn-notch::after {
  left: 100%;
  border-top-left-radius: 20px;
  box-shadow: -10px -10px 0 10px #000;
}

.dn-content {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 6px; width: 100%;
  white-space: nowrap;
  transition: opacity 0.2s ease;
  opacity: 1;
}
.dn-top {
  color: #8c8c8c; font-size: 13px; font-weight: 500;
  letter-spacing: -0.2px;
  font-variant-numeric: tabular-nums;
}
.dn-bottom-row {
  display: flex; align-items: center; gap: 10px;
}
.dn-pixel {
  width: 14px; height: 14px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1px;
  color: var(--glow-color);
  filter: drop-shadow(0 0 6px currentColor);
}
.dn-pixel span {
  background: currentColor;
  border-radius: 0.5px;
  animation: dn-flicker 1s infinite alternate ease-in-out;
}
.dn-pixel span:nth-child(5) { opacity: 0; animation: none; }
.dn-pixel span:nth-child(1) { animation-delay: 0.1s; }
.dn-pixel span:nth-child(2) { animation-delay: 0.8s; }
.dn-pixel span:nth-child(3) { animation-delay: 0.3s; }
.dn-pixel span:nth-child(4) { animation-delay: 0.9s; }
.dn-pixel span:nth-child(6) { animation-delay: 0.4s; }
.dn-pixel span:nth-child(7) { animation-delay: 0.7s; }
.dn-pixel span:nth-child(8) { animation-delay: 0.2s; }
.dn-pixel span:nth-child(9) { animation-delay: 0.6s; }
@keyframes dn-flicker {
  0%, 15%   { opacity: 0.1; }
  85%, 100% { opacity: 1; }
}
.dn-bottom {
  font-size: 15px; font-weight: 600; letter-spacing: 0.1px;
  background: linear-gradient(110deg,
    #ffffff 0%,
    rgba(255,255,255,0.7) 20%,
    var(--glow-color) 40%,
    #ffffff 60%,
    rgba(255,255,255,0.7) 80%,
    var(--glow-color) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
          background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: dn-shimmer 3s linear infinite;
}
@keyframes dn-shimmer { to { background-position: -200% center; } }

@media (max-width: 480px) {
  .dn-top { font-size: 12px; }
  .dn-bottom { font-size: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .dn-pixel span, .dn-bottom { animation: none !important; }
  .dn-notch { transition: width 0.2s ease, transform 0.2s ease !important; }
}
`;
