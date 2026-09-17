/**
 * Cue Foundations · Dynamic Island Feedback Notch
 * ────────────────────────────────────────────
 * A header-mounted notch that drops down, expands into a hoverable emoji poll, then slides away after submission with mode and theme switching.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/dynamic-island-feedback-notch.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue096
 *
 * Original Cue ID: cue096
 * Category: Utilities & Scripts
 * ────────────────────────────────────────────
 */

/**
 * Dynamic Notch Poll — Header-Dropped Feedback Bubble with V1/V2 Modes + Dark
 *
 * Zero external deps. Pure CSS transitions + a small state machine.
 *
 * Usage:
 *   <DynamicNotchPoll />
 *
 *   <DynamicNotchPoll
 *     question="How do you like the new Dashboard?"
 *     options={[
 *       { label: 'Excellent', emoji: '🤩' },
 *       { label: 'Good',      emoji: '🙂' },
 *       { label: 'Average',   emoji: '😐' },
 *       { label: 'Poor',      emoji: '😕' },
 *       { label: 'Terrible',  emoji: '😫' },
 *     ]}
 *     compactText="Quick question for you 👋"
 *     successText="Thanks for your feedback!"
 *     mode="horizontal"
 *     theme="dark"
 *     autoStartMs={500}
 *     onSubmit={(opt) => console.log(opt)}
 *   />
 *
 * Font (add to global head):
 *   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
 */

import React, { useEffect, useRef, useState } from 'react';

export interface PollOption { label: string; emoji: string; }
export type NotchMode = 'vertical' | 'horizontal';
export type NotchTheme = 'light' | 'dark';

interface DynamicNotchPollProps {
  question?: string;
  options?: PollOption[];
  compactText?: string;
  successText?: string;
  mode?: NotchMode;
  theme?: NotchTheme;
  autoStartMs?: number;
  onSubmit?: (option: PollOption) => void;
}

const DEFAULT_OPTIONS: PollOption[] = [
  { label: 'Excellent', emoji: '🤩' },
  { label: 'Good',      emoji: '🙂' },
  { label: 'Average',   emoji: '😐' },
  { label: 'Poor',      emoji: '😕' },
  { label: 'Terrible',  emoji: '😫' },
];

export default function DynamicNotchPoll({
  question = 'How do you like the new Dashboard?',
  options = DEFAULT_OPTIONS,
  compactText = 'Quick question for you 👋',
  successText = 'Thanks for your feedback!',
  mode = 'vertical',
  theme = 'light',
  autoStartMs = 500,
  onSubmit,
}: DynamicNotchPollProps) {
  const [active, setActive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setActive(true), autoStartMs);
    return () => clearTimeout(t);
  }, [autoStartMs]);

  function handleMouseEnter() {
    if (submittedRef.current || !active) return;
    setExpanded(true);
  }
  function handleMouseLeave() {
    if (submittedRef.current) return;
    setExpanded(false);
  }
  function handlePick(opt: PollOption) {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    onSubmit?.(opt);
    setTimeout(() => {
      setExpanded(false);
      setActive(false);
      setHidden(true);
    }, 1500);
  }
  function resetNotch() {
    submittedRef.current = false;
    setHidden(false); setSubmitted(false); setExpanded(false); setActive(false);
    setTimeout(() => setActive(true), 50);
  }

  const bodyClass = [
    mode === 'horizontal' ? 'dnp-horizontal' : '',
    theme === 'dark' ? 'dnp-dark' : '',
  ].filter(Boolean).join(' ');

  const notchClass = [
    'dnp-notch',
    active ? 'active' : '',
    expanded ? 'expanded' : '',
    submitted ? 'submitted' : '',
    hidden ? 'hide' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <style>{CSS}</style>
      <div className={`dnp-scope ${bodyClass}`}>
        <div className="dnp-header">
          <div className="dnp-header-left">
            <div className="dnp-brand">◆ Acme Corp</div>
            <div className="dnp-tabs">
              <span>Commands</span>
              <span>Logs</span>
              <span>Metrics</span>
            </div>
          </div>

          <div className="dnp-container">
            <div
              className={notchClass}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Compact */}
              <div className="dnp-content dnp-compact">
                <svg className="dnp-icon dnp-icon-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>{compactText}</span>
              </div>

              {/* Expanded poll */}
              <div className="dnp-content dnp-expanded-poll">
                <div className="dnp-poll-header">{question}</div>
                <div className="dnp-poll-options">
                  {options.map((opt) => (
                    <button key={opt.label} className="dnp-poll-btn" onClick={(e) => { e.stopPropagation(); handlePick(opt); }}>
                      <span>{opt.label}</span>
                      <span className="dnp-emoji">{opt.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Success */}
              <div className="dnp-content dnp-success-msg">
                <svg className="dnp-icon-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>{successText}</span>
              </div>
            </div>
          </div>
        </div>

        {hidden && (
          <button className="dnp-restart" onClick={resetNotch}>Show Notch Again</button>
        )}
      </div>
    </>
  );
}

const CSS = `
@property --dnp-notch-gap {
  syntax: '<length>';
  initial-value: 160px;
  inherits: true;
}
.dnp-scope {
  font-family: 'Inter', sans-serif;
  background: #FAFAFA;
  color: #333;
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
}
.dnp-header {
  position: relative;
  height: 50px;
  background: #FFFFFF;
  display: flex; align-items: center;
  padding: 0 32px;
  transition: --dnp-notch-gap 0.6s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s;
}
.dnp-scope.dnp-horizontal .dnp-header:has(.dnp-notch.expanded) {
  --dnp-notch-gap: 530px;
}
.dnp-header-left {
  display: flex; align-items: center; gap: 24px;
}
.dnp-brand { font-weight: 600; letter-spacing: -0.02em; }
.dnp-tabs { display: flex; gap: 20px; margin-left: 20px; }
.dnp-tabs span {
  color: #888; font-size: 14px; font-weight: 500;
  cursor: pointer; transition: color 0.2s;
}
.dnp-tabs span:hover { color: #000; }

.dnp-container {
  position: absolute; top: 0; left: 50%;
  transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center;
  z-index: 100;
}
.dnp-notch {
  background: linear-gradient(180deg, #1A1A1A 0%, #000000 100%);
  box-shadow:
    inset 0 -1px 1px rgba(255,255,255,0.25),
    inset 1px 0 1px rgba(255,255,255,0.08),
    inset -1px 0 1px rgba(255,255,255,0.08),
    0 12px 24px rgba(0,0,0,0.15);
  height: 0; width: 280px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
  transition:
    height 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    width 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    border-radius 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.6s ease,
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.4s ease;
  cursor: default;
}
.dnp-notch.active { height: 50px; }
.dnp-notch.expanded {
  height: 440px; width: 320px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow:
    inset 0 -1px 1px rgba(255,255,255,0.20),
    inset 1px 0 1px rgba(255,255,255,0.05),
    inset -1px 0 1px rgba(255,255,255,0.05),
    0 30px 60px rgba(0,0,0,0.3);
}
.dnp-scope:not(.dnp-horizontal) .dnp-notch.expanded {
  transition:
    height 1s cubic-bezier(0.16, 1, 0.3, 1),
    width 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    border-radius 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.6s ease,
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.4s ease;
}
.dnp-scope.dnp-horizontal .dnp-notch {
  transition:
    height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
    width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-radius 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.6s ease,
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.4s ease;
}
.dnp-scope.dnp-horizontal .dnp-notch.expanded {
  height: 84px; width: 1020px;
  border-bottom-left-radius: 42px;
  border-bottom-right-radius: 42px;
  box-shadow:
    inset 0 -1px 1px rgba(255,255,255,0.15),
    inset 1px 0 1px rgba(255,255,255,0.05),
    inset -1px 0 1px rgba(255,255,255,0.05),
    0 40px 80px rgba(0,0,0,0.4),
    0 20px 40px rgba(0,0,0,0.2);
}
.dnp-notch.hide {
  height: 0 !important;
  opacity: 0;
  transform: translateY(-20px);
  pointer-events: none;
}

.dnp-notch::before,
.dnp-notch::after {
  content: '';
  position: absolute; top: 0;
  width: 16px; height: 16px;
  opacity: 0; transition: opacity 0.3s ease;
  pointer-events: none;
}
.dnp-notch.active::before, .dnp-notch.active::after { opacity: 1; }
.dnp-notch::before {
  left: -16px;
  background: radial-gradient(circle at 0 100%, transparent 16px, #1A1A1A 16px);
}
.dnp-notch::after {
  right: -16px;
  background: radial-gradient(circle at 100% 100%, transparent 16px, #1A1A1A 16px);
}

.dnp-content {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s ease, transform 0.4s ease;
}

.dnp-compact { gap: 10px; }
.dnp-compact span { color: #fff; font-size: 14.5px; font-weight: 500; }
.dnp-notch.active:not(.expanded):not(.hide) .dnp-compact {
  opacity: 1; pointer-events: auto; transition-delay: 0.3s;
}
.dnp-notch.expanded .dnp-compact {
  opacity: 0; transform: translateY(-20px); transition-delay: 0s;
}

.dnp-expanded-poll {
  flex-direction: column;
  padding: 30px 24px;
  box-sizing: border-box;
  justify-content: flex-start;
  transform: translateY(20px);
  transition:
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    padding 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.dnp-notch.expanded:not(.submitted) .dnp-expanded-poll {
  opacity: 1; transform: translateY(0); pointer-events: auto; transition-delay: 0.2s;
}
.dnp-poll-header {
  color: #fff; font-size: 16px; font-weight: 600;
  margin-bottom: 24px; text-align: center; letter-spacing: -0.01em;
  opacity: 0; translate: 0 10px;
  transition:
    opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    translate 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    margin 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.dnp-scope:not(.dnp-horizontal) .dnp-notch.expanded:not(.submitted) .dnp-poll-header {
  opacity: 1; translate: 0 0; transition-delay: 0.1s, 0.1s, 0s;
}
.dnp-poll-options {
  display: flex; flex-direction: column; gap: 10px; width: 100%;
  transition: flex-direction 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.dnp-poll-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 14.5px; font-weight: 500;
  cursor: pointer; text-align: left;
  display: flex; justify-content: space-between; align-items: center;
  white-space: nowrap;
  opacity: 0; translate: 0 15px;
  transition:
    opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    translate 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.2s, border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
}
.dnp-scope:not(.dnp-horizontal) .dnp-notch.expanded:not(.submitted) .dnp-poll-btn {
  opacity: 1; translate: 0 0;
}
.dnp-scope:not(.dnp-horizontal) .dnp-notch.expanded:not(.submitted) .dnp-poll-btn:nth-child(1) { transition-delay: 0.15s, 0.15s, 0s, 0s, 0s, 0s; }
.dnp-scope:not(.dnp-horizontal) .dnp-notch.expanded:not(.submitted) .dnp-poll-btn:nth-child(2) { transition-delay: 0.25s, 0.25s, 0s, 0s, 0s, 0s; }
.dnp-scope:not(.dnp-horizontal) .dnp-notch.expanded:not(.submitted) .dnp-poll-btn:nth-child(3) { transition-delay: 0.35s, 0.35s, 0s, 0s, 0s, 0s; }
.dnp-scope:not(.dnp-horizontal) .dnp-notch.expanded:not(.submitted) .dnp-poll-btn:nth-child(4) { transition-delay: 0.45s, 0.45s, 0s, 0s, 0s, 0s; }
.dnp-scope:not(.dnp-horizontal) .dnp-notch.expanded:not(.submitted) .dnp-poll-btn:nth-child(5) { transition-delay: 0.55s, 0.55s, 0s, 0s, 0s, 0s; }

.dnp-poll-btn:hover {
  background: rgba(255,255,255,0.15);
  transform: scale(1.03);
  border-color: rgba(255,255,255,0.3);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.dnp-emoji { font-size: 18px; }

/* Horizontal V2 */
.dnp-scope.dnp-horizontal .dnp-expanded-poll {
  flex-direction: row;
  padding: 0 48px;
  align-items: center; justify-content: center;
}
.dnp-scope.dnp-horizontal .dnp-poll-header {
  margin-bottom: 0; margin-right: 20px;
  font-size: 15.5px; color: rgba(255,255,255,0.85);
  flex-shrink: 0;
}
.dnp-scope.dnp-horizontal .dnp-poll-options {
  flex-direction: row; gap: 12px; width: auto;
}
.dnp-scope.dnp-horizontal .dnp-poll-btn {
  padding: 10px 16px;
  border-radius: 100px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  gap: 8px;
}
.dnp-scope.dnp-horizontal .dnp-poll-btn:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.3);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
}
.dnp-scope.dnp-horizontal .dnp-notch.expanded:not(.submitted) .dnp-poll-header {
  opacity: 1; translate: 0 0; transition-delay: 0.1s, 0.1s, 0s;
}
.dnp-scope.dnp-horizontal .dnp-notch.expanded:not(.submitted) .dnp-poll-btn:nth-child(1) { opacity: 1; translate: 0 0; transition-delay: 0.15s, 0.15s, 0s, 0s, 0s, 0s; }
.dnp-scope.dnp-horizontal .dnp-notch.expanded:not(.submitted) .dnp-poll-btn:nth-child(2) { opacity: 1; translate: 0 0; transition-delay: 0.20s, 0.20s, 0s, 0s, 0s, 0s; }
.dnp-scope.dnp-horizontal .dnp-notch.expanded:not(.submitted) .dnp-poll-btn:nth-child(3) { opacity: 1; translate: 0 0; transition-delay: 0.25s, 0.25s, 0s, 0s, 0s, 0s; }
.dnp-scope.dnp-horizontal .dnp-notch.expanded:not(.submitted) .dnp-poll-btn:nth-child(4) { opacity: 1; translate: 0 0; transition-delay: 0.30s, 0.30s, 0s, 0s, 0s, 0s; }
.dnp-scope.dnp-horizontal .dnp-notch.expanded:not(.submitted) .dnp-poll-btn:nth-child(5) { opacity: 1; translate: 0 0; transition-delay: 0.35s, 0.35s, 0s, 0s, 0s, 0s; }

.dnp-success-msg { flex-direction: column; gap: 12px; transform: scale(0.9); }
.dnp-success-msg span { color: #fff; font-size: 16px; font-weight: 600; }
.dnp-scope.dnp-horizontal .dnp-success-msg { flex-direction: row; }
.dnp-notch.submitted .dnp-success-msg {
  opacity: 1; transform: scale(1); pointer-events: auto; transition-delay: 0.2s;
}
.dnp-notch.submitted .dnp-expanded-poll {
  opacity: 0; transform: scale(0.95); pointer-events: none; transition-delay: 0s;
}

.dnp-icon { width: 18px; height: 18px; }
.dnp-icon-pulse {
  color: #7B61FF;
  animation: dnp-pulse 2s infinite alternate;
}
.dnp-icon-success { width: 28px; height: 28px; color: #34D399; }
@keyframes dnp-pulse {
  0%   { opacity: 0.7; transform: scale(0.95); }
  100% { opacity: 1;   transform: scale(1.05); }
}

.dnp-restart {
  position: fixed; bottom: 40px; left: 50%;
  transform: translateX(-50%);
  background: #000; color: #fff;
  border: none; padding: 14px 24px;
  border-radius: 12px; font-size: 14.5px; font-weight: 600;
  cursor: pointer; font-family: inherit;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}
.dnp-restart:hover { background: #222; transform: translateX(-50%) translateY(-2px); }

/* Dark mode */
.dnp-scope.dnp-dark { background: #000000; color: #FFFFFF; }
.dnp-scope.dnp-dark .dnp-header { background: #000000; }
.dnp-scope.dnp-dark .dnp-tabs span { color: #888; }
.dnp-scope.dnp-dark .dnp-tabs span:hover { color: #FFF; }

.dnp-scope.dnp-dark .dnp-notch {
  background: linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,1),
    0 0 0 1px rgba(255,255,255,0.1),
    0 12px 30px rgba(255,255,255,0.08);
}
.dnp-scope.dnp-dark .dnp-notch.expanded {
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,1),
    0 0 0 1px rgba(255,255,255,0.1),
    0 30px 60px rgba(255,255,255,0.06),
    0 12px 24px rgba(255,255,255,0.04);
}
.dnp-scope.dnp-horizontal.dnp-dark .dnp-notch.expanded {
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,1),
    0 0 0 1px rgba(255,255,255,0.1),
    0 40px 80px rgba(255,255,255,0.06),
    0 20px 40px rgba(255,255,255,0.04);
}
.dnp-scope.dnp-dark .dnp-notch::before {
  background: radial-gradient(circle at 0 100%, transparent 16px, #FFFFFF 16px);
}
.dnp-scope.dnp-dark .dnp-notch::after {
  background: radial-gradient(circle at 100% 100%, transparent 16px, #FFFFFF 16px);
}
.dnp-scope.dnp-dark .dnp-compact span,
.dnp-scope.dnp-dark .dnp-poll-header,
.dnp-scope.dnp-dark .dnp-success-msg span { color: #111; }
.dnp-scope.dnp-horizontal.dnp-dark .dnp-poll-header { color: #555; }
.dnp-scope.dnp-dark .dnp-icon-pulse { color: #000; }
.dnp-scope.dnp-dark .dnp-poll-btn {
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  color: #111;
}
.dnp-scope.dnp-dark .dnp-poll-btn:hover {
  background: #FFFFFF;
  border-color: #D1D5DB;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

@media (max-width: 700px) {
  .dnp-scope.dnp-horizontal .dnp-notch.expanded {
    width: calc(100vw - 32px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .dnp-notch, .dnp-content, .dnp-poll-btn, .dnp-poll-header {
    transition: opacity 0.2s ease !important;
  }
  .dnp-icon-pulse { animation: none !important; }
}
`;
