"use client";


/**
 * Cue Foundations · Live Waveform Audio Recorder
 * ────────────────────────────────────────────
 * A dark iOS-style audio recorder capsule that expands to show a live scrolling waveform, timer, and a draggable playback scrubber.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/live-waveform-audio-recorder.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue179
 *
 * Original Cue ID: cue179
 * Category: Utilities & Scripts
 * ────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";

/* ============================================================================
   AudioRecorder — iOS-style capsule with live waveform + playback scrubber
   ----------------------------------------------------------------------------
   Collapsed at rest → click record to expand + start recording. Live 20-bar
   waveform samples the mic every 50ms with a ruler timeline (half-second ticks
   + labeled second ticks). Stop → renders 54 static playback bars with a blue
   scrubber that fills as audio plays. Drag to seek. Delete to reset.
   Requires SF Pro Display (or Inter) in the target project. Zero deps.
   ============================================================================ */

type RState = "IDLE" | "RECORDING" | "PAUSED" | "STOPPED" | "PLAYING";

const NUM_BARS = 20;
const MAX_PLAYBACK_BARS = 54;

const ICONS = {
  record: `<svg viewBox="0 0 24 24" class="icon-record"><circle cx="12" cy="12" r="8" /></svg>`,
  pause:  `<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`,
  play:   `<svg viewBox="0 0 24 24"><path d="M7 5l11 7-11 7z" /></svg>`,
};

const statusFor = (s: RState) =>
  s === "IDLE"      ? "Ready to record"
  : s === "RECORDING" ? "Recording..."
  : s === "PAUSED"    ? "Paused"
  : s === "PLAYING"   ? "Playing audio..."
  :                     "New Audio from you";

const formatTime = (total: number) => {
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function AudioRecorder() {
  const [state, setState]     = useState<RState>("IDLE");
  const [seconds, setSeconds] = useState(0);

  const widgetRef      = useRef<HTMLDivElement>(null);
  const containerRef   = useRef<HTMLDivElement>(null);
  const barsContainerRef = useRef<HTMLDivElement>(null);
  const scrubberRef    = useRef<HTMLDivElement>(null);
  const dottedRef      = useRef<HTMLDivElement>(null);
  const mainIconRef    = useRef<HTMLDivElement>(null);
  const dotRef         = useRef<HTMLDivElement>(null);

  const audioCtxRef    = useRef<AudioContext | null>(null);
  const analyserRef    = useRef<AnalyserNode | null>(null);
  const recorderRef    = useRef<MediaRecorder | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef     = useRef<string | null>(null);
  const chunksRef      = useRef<Blob[]>([]);

  const stateRef        = useRef<RState>("IDLE");
  const volumeHistoryRef = useRef<number[]>(new Array(NUM_BARS).fill(2));
  const rulerHistoryRef  = useRef<{ text: string; mark: boolean }[]>(new Array(NUM_BARS).fill({ text: "", mark: false }));
  const fullRecordingRef = useRef<number[]>([]);
  const totalBarsRef     = useRef(0);
  const lastTickRef      = useRef(0);
  const isDraggingRef    = useRef(false);
  const rafRef           = useRef<number | null>(null);
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null);

  const barsRef   = useRef<HTMLDivElement[]>([]);
  const labelsRef = useRef<HTMLSpanElement[]>([]);
  const marksRef  = useRef<HTMLDivElement[]>([]);
  const playbackBarsRef = useRef<HTMLDivElement[]>([]);

  stateRef.current = state;

  /* Build the initial 20 recording bars on mount */
  useEffect(() => {
    const container = barsContainerRef.current;
    if (!container) return;
    barsRef.current = [];
    labelsRef.current = [];
    marksRef.current = [];
    for (let i = 0; i < NUM_BARS; i++) {
      const wrapper = document.createElement("div");
      wrapper.className = "bar-wrapper";
      const label = document.createElement("span"); label.className = "tick-label";
      const mark  = document.createElement("div");  mark.className  = "tick-mark"; mark.style.opacity = "0";
      const bar   = document.createElement("div");  bar.className   = "bar";
      if (i < NUM_BARS - 10) bar.classList.add("dim");
      wrapper.append(label, mark, bar);
      container.appendChild(wrapper);
      barsRef.current.push(bar);
      labelsRef.current.push(label);
      marksRef.current.push(mark);
    }

    audioPlayerRef.current = new Audio();
    audioPlayerRef.current.onended = () => {
      setState("STOPPED");
      if (mainIconRef.current) mainIconRef.current.innerHTML = ICONS.play;
      if (scrubberRef.current) scrubberRef.current.style.left = "0%";
      updatePlaybackBarsColors(0);
    };

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  /* Visualization loop */
  useEffect(() => {
    const step = (ts: number) => {
      rafRef.current = requestAnimationFrame(step);
      const s = stateRef.current;

      if (s === "RECORDING" && analyserRef.current) {
        if (ts - lastTickRef.current > 50) {
          const data = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          const avg = sum / data.length;
          let h = Math.max(2, (avg / 64) * 60);
          if (h > 60) h = 60;
          volumeHistoryRef.current.shift();
          volumeHistoryRef.current.push(h);
          fullRecordingRef.current.push(h);

          totalBarsRef.current++;
          let text = "", showMark = false;
          if (totalBarsRef.current % 20 === 0) { text = formatTime(totalBarsRef.current / 20); showMark = true; }
          else if (totalBarsRef.current % 10 === 0) showMark = true;
          rulerHistoryRef.current.shift();
          rulerHistoryRef.current.push({ text, mark: showMark });
          lastTickRef.current = ts;
        }
        for (let i = 0; i < NUM_BARS; i++) {
          if (barsRef.current[i])   barsRef.current[i].style.height = `${volumeHistoryRef.current[i]}px`;
          if (labelsRef.current[i]) labelsRef.current[i].innerText = rulerHistoryRef.current[i].text;
          if (marksRef.current[i])  marksRef.current[i].style.opacity = rulerHistoryRef.current[i].mark ? "1" : "0";
        }
      } else if (s === "PLAYING" && !isDraggingRef.current) {
        const ap = audioPlayerRef.current;
        if (ap && ap.duration) {
          const progress = ap.currentTime / ap.duration;
          if (scrubberRef.current) scrubberRef.current.style.left = `${progress * 100}%`;
          updatePlaybackBarsColors(progress);
        }
      } else if (s === "IDLE") {
        for (let i = 0; i < NUM_BARS; i++) {
          if (barsRef.current[i])   barsRef.current[i].style.height = "2px";
          volumeHistoryRef.current[i] = 2;
          if (labelsRef.current[i]) labelsRef.current[i].innerText = "";
          if (marksRef.current[i])  marksRef.current[i].style.opacity = "0";
        }
        rulerHistoryRef.current.fill({ text: "", mark: false });
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  /* Drag/seek */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleDrag = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      let x = e.clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const progress = x / rect.width;
      if (scrubberRef.current) scrubberRef.current.style.left = `${progress * 100}%`;
      updatePlaybackBarsColors(progress);
      const ap = audioPlayerRef.current;
      if (ap && ap.duration) ap.currentTime = progress * ap.duration;
    };

    const onDown = (e: PointerEvent) => {
      if (stateRef.current !== "STOPPED" && stateRef.current !== "PLAYING") return;
      isDraggingRef.current = true;
      handleDrag(e);
    };
    const onMove = (e: PointerEvent) => { if (isDraggingRef.current) handleDrag(e); };
    const onUp   = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (stateRef.current === "PLAYING") audioPlayerRef.current?.play();
      }
    };

    container.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup",   onUp);
    return () => {
      container.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup",   onUp);
    };
  }, []);

  const setupAudio = async () => {
    if (recorderRef.current) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtxRef.current = new AC();
    analyserRef.current = audioCtxRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    const mic = audioCtxRef.current.createMediaStreamSource(stream);
    mic.connect(analyserRef.current);

    const rec = new MediaRecorder(stream);
    rec.ondataavailable = (e) => chunksRef.current.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/mp3" });
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = URL.createObjectURL(blob);
      if (audioPlayerRef.current) audioPlayerRef.current.src = blobUrlRef.current;
      chunksRef.current = [];
    };
    recorderRef.current = rec;
  };

  const updatePlaybackBarsColors = (progress: number) => {
    const arr = playbackBarsRef.current;
    const active = Math.floor(progress * arr.length);
    for (let i = 0; i < arr.length; i++) {
      if (i <= active) arr[i].classList.remove("dim");
      else             arr[i].classList.add("dim");
    }
  };

  const renderPlaybackWaveform = () => {
    const container = barsContainerRef.current;
    if (!container) return;
    container.innerHTML = "";
    playbackBarsRef.current = [];
    const step = Math.max(1, fullRecordingRef.current.length / MAX_PLAYBACK_BARS);
    for (let i = 0; i < MAX_PLAYBACK_BARS; i++) {
      const index = Math.floor(i * step);
      const h = fullRecordingRef.current[index] || 2;

      const wrapper = document.createElement("div");
      wrapper.className = "bar-wrapper";
      const label = document.createElement("span"); label.className = "tick-label";
      const mark  = document.createElement("div");  mark.className  = "tick-mark"; mark.style.opacity = "0";
      if (index > 0 && index % 20 === 0) { label.innerText = formatTime(index / 20); mark.style.opacity = "1"; }
      else if (index > 0 && index % 10 === 0)  mark.style.opacity = "1";
      const bar = document.createElement("div"); bar.className = "bar dim"; bar.style.height = `${h}px`;

      wrapper.append(label, mark, bar);
      container.appendChild(wrapper);
      playbackBarsRef.current.push(bar);
    }
  };

  const restoreRecordingBars = () => {
    const container = barsContainerRef.current;
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < NUM_BARS; i++) container.appendChild(barsRef.current[i].parentElement!);
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const stopTimer  = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };

  const onMainClick = async () => {
    if (state === "IDLE") {
      await setupAudio();
      widgetRef.current?.classList.add("expanded");
      chunksRef.current = [];
      fullRecordingRef.current = [];
      totalBarsRef.current = 0;
      rulerHistoryRef.current.fill({ text: "", mark: false });
      recorderRef.current?.start();
      setState("RECORDING");
      setSeconds(0);

      barsContainerRef.current?.classList.remove("playback-mode");
      restoreRecordingBars();
      if (dottedRef.current) dottedRef.current.style.display = "block";
      if (scrubberRef.current) scrubberRef.current.style.left = "50%";
      if (mainIconRef.current) mainIconRef.current.innerHTML = ICONS.pause;
      dotRef.current?.classList.add("active");
      startTimer();
    } else if (state === "RECORDING") {
      recorderRef.current?.pause();
      stopTimer();
      setState("PAUSED");
      if (mainIconRef.current) mainIconRef.current.innerHTML = ICONS.record;
      dotRef.current?.classList.remove("active");
    } else if (state === "PAUSED") {
      recorderRef.current?.resume();
      setState("RECORDING");
      if (mainIconRef.current) mainIconRef.current.innerHTML = ICONS.pause;
      dotRef.current?.classList.add("active");
      startTimer();
    } else if (state === "STOPPED") {
      audioPlayerRef.current?.play();
      setState("PLAYING");
      if (mainIconRef.current) mainIconRef.current.innerHTML = ICONS.pause;
    } else if (state === "PLAYING") {
      audioPlayerRef.current?.pause();
      setState("STOPPED");
      if (mainIconRef.current) mainIconRef.current.innerHTML = ICONS.play;
    }
  };

  const onStopClick = () => {
    if (state !== "RECORDING" && state !== "PAUSED") return;
    recorderRef.current?.stop();
    stopTimer();
    setState("STOPPED");
    if (mainIconRef.current) mainIconRef.current.innerHTML = ICONS.play;
    dotRef.current?.classList.remove("active");
    barsContainerRef.current?.classList.add("playback-mode");
    if (dottedRef.current) dottedRef.current.style.display = "none";
    if (scrubberRef.current) scrubberRef.current.style.left = "0%";
    renderPlaybackWaveform();
  };

  const onDeleteClick = () => {
    if (state !== "STOPPED") return;
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    blobUrlRef.current = null;
    setState("IDLE");
    setSeconds(0);
    if (mainIconRef.current) mainIconRef.current.innerHTML = ICONS.record;
    barsContainerRef.current?.classList.remove("playback-mode");
    restoreRecordingBars();
    if (dottedRef.current) dottedRef.current.style.display = "block";
    if (scrubberRef.current) scrubberRef.current.style.left = "50%";
    volumeHistoryRef.current.fill(2);
    totalBarsRef.current = 0;
    widgetRef.current?.classList.remove("expanded");
  };

  return (
    <div className="ar-body">
      <style>{CSS}</style>

      <div ref={widgetRef} className="recorder-widget">
        <div className="recorder-screen">
          <div ref={containerRef} className="waveform-container">
            <div ref={barsContainerRef} className="waveform-bars" />
            <div ref={scrubberRef} className="scrubber" />
            <div ref={dottedRef} className="waveform-dotted-line" />
          </div>
          <div className="time-display">{formatTime(seconds)}</div>
          <div className="meta-info">
            <span className="meta-text">{statusFor(state)}</span>
            <div className="meta-avatar" />
          </div>
        </div>

        <div className="recorder-controls">
          <button className="control-btn btn-side" onClick={onStopClick} disabled={state !== "RECORDING" && state !== "PAUSED"}>
            <div className="stop-square" />
          </button>

          <button className="control-btn btn-main" onClick={onMainClick}>
            <div ref={mainIconRef} className="play-pause-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF">
                <path d="M4 4 L 13 12 L 4 20 Z" />
                <rect x="15" y="5" width="3" height="14" rx="1" />
                <rect x="20" y="5" width="3" height="14" rx="1" />
              </svg>
            </div>
            <div ref={dotRef} className="recording-dot" />
          </button>

          <button className="control-btn btn-side" onClick={onDeleteClick} disabled={state !== "STOPPED"}>
            <svg viewBox="0 0 24 24">
              <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const CSS = `
  .ar-body {
    margin: 0; padding: 0;
    display: flex; justify-content: center; align-items: flex-end;
    padding-bottom: 80px; box-sizing: border-box;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
  }
  .ar-body .recorder-widget {
    width: 300px; background: #1C1C1E;
    border-radius: 5px; padding: 12px; box-sizing: border-box;
    box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.2);
    display: flex; flex-direction: column;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .ar-body .recorder-widget.expanded { border-radius: 5px; padding: 12px 12px 20px 12px; }
  .ar-body .recorder-screen {
    background: linear-gradient(180deg, #0A0A0C 0%, #1C1C1E 100%);
    border-radius: 20px; height: 0; margin-bottom: 0;
    opacity: 0; position: relative;
    display: flex; flex-direction: column; align-items: center;
    box-shadow:
      inset 0 24px 32px -10px rgba(0,0,0,1),
      inset 0 6px 12px rgba(0,0,0,0.9),
      inset 0 1px 2px rgba(0,0,0,0.9),
      0 1px 0 rgba(255,255,255,0.08);
    overflow: hidden; padding-top: 0;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .ar-body .recorder-widget.expanded .recorder-screen { height: 160px; margin-bottom: 20px; padding-top: 30px; opacity: 1; }
  .ar-body .waveform-container {
    width: 100%; height: 50px;
    position: relative;
    display: flex; align-items: center;
    margin-bottom: 12px; cursor: pointer; touch-action: none;
  }
  .ar-body .waveform-bars {
    position: absolute; left: 0; width: 50%; height: 100%;
    display: flex; align-items: center; gap: 3px;
    z-index: 2; justify-content: flex-end; padding-right: 4px;
  }
  .ar-body .waveform-bars.playback-mode {
    width: 100%; justify-content: flex-start; padding-right: 0; padding-left: 4px;
  }
  .ar-body .bar-wrapper { position: relative; height: 50px; width: 2px; display: flex; align-items: center; }
  .ar-body .tick-label {
    position: absolute; top: -18px; left: 50%; transform: translateX(-50%);
    font-size: 10px; color: #8E8E93; white-space: nowrap; font-variant-numeric: tabular-nums;
  }
  .ar-body .tick-mark {
    position: absolute; top: -4px; left: 50%; transform: translateX(-50%);
    width: 2px; height: 4px; background-color: #555; border-radius: 1px;
  }
  .ar-body .bar { width: 2px; background-color: #FFFFFF; border-radius: 2px; height: 2px; transition: height 0.05s ease; }
  .ar-body .bar.dim { background-color: rgba(255,255,255,0.25); }

  .ar-body .waveform-dotted-line {
    position: absolute; left: 50%; right: 0; top: 50%;
    height: 1px;
    background-image: linear-gradient(to right, #555 50%, transparent 50%);
    background-size: 5px 1px;
    background-repeat: repeat-x;
    opacity: 0.8;
    padding-left: 4px;
    background-position: 4px 0;
  }

  .ar-body .scrubber {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 2px; height: 74px;
    background-color: #0A84FF;
    z-index: 3;
    border-radius: 2px;
    cursor: pointer;
  }
  .ar-body .scrubber::before, .ar-body .scrubber::after {
    content: '';
    position: absolute; left: 50%; transform: translateX(-50%);
    width: 5px; height: 5px;
    background-color: #0A84FF; border-radius: 50%;
  }
  .ar-body .scrubber::before { top: -1px; }
  .ar-body .scrubber::after  { bottom: -1px; }

  .ar-body .time-display {
    font-size: 32px; font-weight: 700; color: #FFFFFF;
    margin-top: 4px; margin-bottom: 2px;
    font-variant-numeric: tabular-nums;
  }
  .ar-body .meta-info { display: flex; align-items: center; gap: 6px; }
  .ar-body .meta-text { font-size: 12px; font-weight: 400; color: #8E8E93; }
  .ar-body .meta-avatar {
    width: 16px; height: 16px; border-radius: 50%;
    background-color: #555;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
    background-size: cover;
    border: 1px solid #333;
  }

  .ar-body .recorder-controls {
    display: flex; justify-content: center; align-items: center;
    gap: 32px; width: 100%;
  }
  .ar-body .control-btn {
    background-color: #2C2C2E; border: none; border-radius: 50%;
    display: flex; justify-content: center; align-items: center;
    color: #8E8E93; cursor: pointer;
    position: relative; box-shadow: none;
    transition: transform 0.1s, opacity 0.2s;
  }
  .ar-body .control-btn:active   { transform: scale(0.96); opacity: 0.8; }
  .ar-body .control-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .ar-body .btn-side { width: 40px; height: 40px; }
  .ar-body .btn-side svg {
    width: 16px; height: 16px;
    fill: none; stroke: #FFFFFF;
    stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round;
  }
  .ar-body .btn-main {
    width: 48px; height: 48px;
    flex-direction: column; gap: 4px;
    background-color: #4A4A4F;
    box-shadow: 0 0 0 3px #1C1C1E, 0 0 0 5px #4A4A4F;
  }
  .ar-body .btn-main:active { box-shadow: 0 0 0 3px #1C1C1E, 0 0 0 5px #4A4A4F; }
  .ar-body .play-pause-icon {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 4px;
  }
  .ar-body .play-pause-icon svg { width: 20px !important; height: 20px !important; fill: #FF3B30 !important; }
  .ar-body .icon-record { fill: #FF3B30 !important; width: 26px !important; height: 26px !important; }

  .ar-body .recording-dot {
    width: 4px; height: 4px;
    background-color: #FF3B30;
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(255,59,48,0.9);
    position: absolute; bottom: 10px;
    opacity: 0; transition: opacity 0.3s;
  }
  .ar-body .recording-dot.active {
    opacity: 1;
    animation: ar-pulse 1s infinite alternate;
  }
  @keyframes ar-pulse { from { opacity: 1; } to { opacity: 0.4; } }

  .ar-body .stop-square { width: 16px; height: 16px; background-color: #FFFFFF; border-radius: 6px; }
`;
