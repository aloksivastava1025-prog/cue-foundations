/**
 * Cue Foundations · Synt-X Hardware Media Player
 * ────────────────────────────────────────────
 * A pixel-perfect, physical-feeling audio-visual player device with debossed branding, dot-matrix grille, hardware buttons, and cursor-driven 3D tilt.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/synt-x-hardware-media-player.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue056
 *
 * Original Cue ID: cue056
 * Category: Video & Audio
 * ────────────────────────────────────────────
 */

/**
 * SYNT-X 01 — Branded Audio-Visual Player (React + TypeScript)
 *
 * Drop-in single-file React component. No external deps beyond React + CSS-in-JS via a <style> tag
 * OR paste the CSS into your global stylesheet (see /* CSS *\/ block near the top of this file).
 *
 * Usage:
 *   import SyntXPlayer from './SyntXPlayer';
 *   <SyntXPlayer src="/video.mp4" poster="/poster.jpg" />
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface SyntXPlayerProps {
  src?: string;
  poster?: string;
  label?: string;               // brand label text — defaults to "SYNT-X // 01"
  skipSeconds?: number;         // default 5
  idleMs?: number;              // default 2000
}

export default function SyntXPlayer({
  src = 'https://www.w3schools.com/html/mov_bbb.mp4',
  poster = 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1000&auto=format&fit=crop',
  label = 'SYNT-X // 01',
  skipSeconds = 5,
  idleMs = 2000,
}: SyntXPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [uiHidden, setUiHidden] = useState(false);
  const [skipText, setSkipText] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hovering: false });

  // ── Video progress ─────────────────────────────────────
  const onTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration) setProgress((v.currentTime / v.duration) * 100);
  }, []);

  // ── Idle timer ─────────────────────────────────────────
  const resetIdle = useCallback(() => {
    setUiHidden(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (!videoRef.current?.paused) {
      idleTimerRef.current = setTimeout(() => setUiHidden(true), idleMs);
    }
  }, [idleMs]);

  // ── Play/pause ─────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
    resetIdle();
  }, [resetIdle]);

  // ── Skip flash ─────────────────────────────────────────
  const showSkip = useCallback((text: string) => {
    setSkipText(text);
    if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    skipTimerRef.current = setTimeout(() => setSkipText(null), 500);
    resetIdle();
  }, [resetIdle]);

  // ── Mute ───────────────────────────────────────────────
  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
    showSkip(v.muted ? '🔇 Muted' : '🔊 Sound On');
  }, [showSkip]);

  // ── Skip ±5s ───────────────────────────────────────────
  const skip = useCallback((direction: -1 | 1) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (direction === -1) {
      v.currentTime = Math.max(0, v.currentTime - skipSeconds);
      showSkip(`⏪ -${skipSeconds}s`);
    } else {
      v.currentTime = Math.min(v.duration, v.currentTime + skipSeconds);
      showSkip(`⏩ +${skipSeconds}s`);
    }
  }, [skipSeconds, showSkip]);

  // ── Play/pause state listeners ─────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay  = () => { setIsPlaying(true);  resetIdle(); };
    const onPause = () => { setIsPlaying(false); resetIdle(); };
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onPause);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onPause);
    };
  }, [resetIdle]);

  // ── 3D tilt (global mousemove) ─────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = deviceRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const hovering =
        e.clientX >= r.left - 50 && e.clientX <= r.right + 50 &&
        e.clientY >= r.top  - 50 && e.clientY <= r.bottom + 50;
      if (hovering) {
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        setTilt({
          rx: ((e.clientY - cy) / (r.height / 2)) * -8,
          ry: ((e.clientX - cx) / (r.width  / 2)) *  8,
          hovering: true,
        });
      } else {
        setTilt({ rx: 0, ry: 0, hovering: false });
      }
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  // Initial idle setup
  useEffect(() => { resetIdle(); }, [resetIdle]);

  // ── Dynamic styles ─────────────────────────────────────
  const deviceStyle: React.CSSProperties = {
    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(${tilt.hovering ? 1.02 : 1}, ${tilt.hovering ? 1.02 : 1}, 1)`,
    boxShadow: tilt.hovering
      ? `${-tilt.ry}px ${30 + tilt.rx}px 70px rgba(0,0,0,0.5), 0 0 0 4px #121212, 0 0 0 5px rgba(255,255,255,0.06), inset 0 1.5px 2px rgba(255,255,255,0.12), inset 0 -3px 8px rgba(0,0,0,0.8)`
      : `0 40px 80px rgba(0,0,0,0.35), 0 0 0 4px #121212, 0 0 0 5px rgba(255,255,255,0.06), inset 0 1.5px 2px rgba(255,255,255,0.12), inset 0 -3px 8px rgba(0,0,0,0.8)`,
  };

  return (
    <>
      <style>{CSS}</style>
      <div
        ref={deviceRef}
        className="syntx-device"
        style={deviceStyle}
        onMouseMove={resetIdle}
        onClick={resetIdle}
        onMouseLeave={() => { if (isPlaying) setUiHidden(true); }}
      >
        <div className={`syntx-screen ${uiHidden ? 'hide-ui' : ''}`}>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted={isMuted}
            loop
            playsInline
            onClick={togglePlay}
            onTimeUpdate={onTimeUpdate}
          />

          <div className={`syntx-pill ${isPlaying ? 'playing' : ''} ${uiHidden ? 'hide' : ''}`}>
            <span className="syntx-dot" />
            <span>{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
          </div>

          <button
            className={`syntx-mute ${uiHidden ? 'hide' : ''}`}
            onClick={toggleMute}
            aria-label="Mute/Unmute"
          >
            <svg viewBox="0 0 24 24">
              {isMuted ? (
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              ) : (
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              )}
            </svg>
          </button>

          {skipText && <div className="syntx-skip show">{skipText}</div>}

          <div className={`syntx-progress-wrap ${uiHidden ? 'hide' : ''}`}>
            <div className="syntx-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="syntx-brand">{label}</div>
        <div className="syntx-grille" />

        <div className="syntx-controls">
          <button className="syntx-btn syntx-btn-prev" onClick={skip(-1)} aria-label="Previous">
            <svg viewBox="0 0 24 24">
              <polygon points="16,5 4,12 16,19" />
              <rect x="2" y="5" width="3" height="14" rx="1" />
            </svg>
          </button>
          <button className={`syntx-btn syntx-btn-play ${isPlaying ? 'is-playing' : ''}`} onClick={togglePlay} aria-label="Play">
            <svg viewBox="0 0 24 24">
              {isPlaying ? (
                <>
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </>
              ) : (
                <polygon points="8,5 20,12 8,19" />
              )}
            </svg>
          </button>
          <button className="syntx-btn syntx-btn-next" onClick={skip(1)} aria-label="Next">
            <svg viewBox="0 0 24 24">
              <polygon points="8,5 20,12 8,19" />
              <rect x="19" y="5" width="3" height="14" rx="1" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── CSS ─── move to a global stylesheet or leave inline via <style> ─── */
const CSS = `
.syntx-device {
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  padding: 12px;
  border-radius: 40px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.1s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform, box-shadow;
  cursor: default;
  font-family: 'Inter', sans-serif;
}
.syntx-device::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 40px;
  background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.04;
  pointer-events: none;
  z-index: 1;
}

.syntx-screen {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 28px;
  overflow: hidden;
  background: #000;
  box-shadow: inset 0 6px 14px rgba(0,0,0,0.95), 0 1px 1px rgba(255,255,255,0.1);
  transform: translateZ(20px);
  z-index: 2;
}
.syntx-screen::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.4) 100%);
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.5s ease;
  z-index: 5;
}
.syntx-screen.hide-ui::after { opacity: 0; }
.syntx-screen video { width: 100%; height: 100%; object-fit: cover; cursor: pointer; }

.syntx-pill {
  position: absolute; top: 12px; left: 14px;
  background: rgba(10,10,10,0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #f3f4f6;
  padding: 5px 12px;
  border-radius: 14px;
  font-size: 9px; font-weight: 900;
  letter-spacing: 0.8px;
  display: flex; align-items: center; gap: 6px;
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.08);
  text-transform: uppercase;
  pointer-events: none;
  transition: opacity 0.5s ease;
  z-index: 10;
}
.syntx-pill.hide { opacity: 0; }
.syntx-dot {
  width: 5px; height: 5px;
  background: #9ca3af; border-radius: 50%;
  transition: all 0.3s;
}
.syntx-pill.playing .syntx-dot {
  background: #ff5500;
  box-shadow: 0 0 8px rgba(255, 85, 0, 0.8);
}

.syntx-mute {
  position: absolute; top: 12px; right: 14px;
  background: rgba(10,10,10,0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.08);
  border-radius: 50%;
  width: 30px; height: 30px;
  display: flex; justify-content: center; align-items: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
  padding: 0;
  z-index: 10;
}
.syntx-mute.hide { opacity: 0; pointer-events: none; }
.syntx-mute:hover { background: rgba(30,30,30,0.9); transform: scale(1.08); border-color: rgba(255,255,255,0.25); }
.syntx-mute:active { transform: scale(0.95); }
.syntx-mute svg { width: 14px; height: 14px; fill: rgba(255,255,255,0.9); }

.syntx-skip {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  color: #fff;
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 14px; font-weight: 800;
  letter-spacing: 0.5px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
}
.syntx-skip.show { opacity: 1; transform: translate(-50%, -50%) scale(1); }

.syntx-progress-wrap {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 4px;
  background: rgba(255,255,255,0.2);
  z-index: 10;
  transition: opacity 0.5s ease;
}
.syntx-progress-wrap.hide { opacity: 0; }
.syntx-progress-bar {
  height: 100%;
  background: #ff5500;
  box-shadow: 0 0 10px rgba(255,85,0,0.8);
  transition: width 0.1s linear;
}

.syntx-brand {
  text-align: center;
  font-size: 8px; font-weight: 900;
  color: #111;
  text-shadow: 0 1px 0 rgba(255,255,255,0.07);
  letter-spacing: 4px;
  margin-top: -2px;
  margin-bottom: -4px;
  transform: translateZ(2px);
  z-index: 2;
}

.syntx-grille {
  height: 20px;
  margin: 0 16px;
  background-image:
    radial-gradient(circle at 2.5px 2.5px, #050505 1.5px, transparent 1.5px),
    radial-gradient(circle at 2.5px 3.2px, rgba(255,255,255,0.1) 1.5px, transparent 1.5px);
  background-size: 5px 5px;
  opacity: 0.85;
  transform: translateZ(5px);
  z-index: 2;
}

.syntx-controls {
  display: flex; gap: 3px;
  height: 64px;
  transform: translateZ(10px);
  z-index: 2;
}
.syntx-btn {
  flex: 1;
  background: #181818;
  border: none;
  border-radius: 8px;
  display: flex; justify-content: center; align-items: center;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.06),
    inset 1px 0 0 rgba(255,255,255,0.02),
    inset -1px 0 0 rgba(255,255,255,0.02),
    inset 0 -2px 6px rgba(0,0,0,0.95);
  transition: all 0.1s;
  position: relative;
  padding: 0;
}
.syntx-btn-prev { border-bottom-left-radius: 28px; }
.syntx-btn-next { border-bottom-right-radius: 28px; }
.syntx-btn svg { width: 20px; height: 20px; fill: #d1d5db; transition: transform 0.1s; }
.syntx-btn:hover { background: #1e1e1e; }
.syntx-btn:active {
  background: #121212;
  box-shadow: inset 0 3px 8px rgba(0,0,0,0.95);
}
.syntx-btn:active svg { transform: scale(0.92); fill: #9ca3af; }

.syntx-btn-play::after {
  content: '';
  position: absolute; bottom: 8px;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: #333;
  transition: all 0.3s;
}
.syntx-btn-play.is-playing::after {
  background: #ff5500;
  box-shadow: 0 0 6px rgba(255,85,0,0.8);
}

@media (max-width: 360px) {
  .syntx-device { width: calc(100vw - 32px); border-radius: 32px; }
  .syntx-screen { border-radius: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .syntx-device { transition: none; }
  .syntx-skip { transition: opacity 0.2s ease; }
}
`;
