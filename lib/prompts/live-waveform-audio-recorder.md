# Live Waveform Audio Recorder — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for voice-memo or podcast-adjacent product demos and mobile app landing pages needing a native-feeling audio capture widget.

---

# Mobile Audio Recorder — Live Waveform + Playback Scrubber

Full-reference pixel-perfect spec. Any AI agent must reconstruct this exactly from this doc alone. No substitutions.

---

## 0. WHAT IT IS

A dark 300px audio recorder capsule pinned to the bottom of the screen. At rest, only the 3 control buttons show (Stop · Record · Delete). Clicking the record button:
1. Expands the widget upward, revealing a 160px screen with a live waveform, a big timer, and a status line + avatar
2. Requests mic access, starts recording
3. Every 50ms samples the mic's average frequency amplitude, pushes a new bar onto a scrolling 20-bar buffer, and updates a ruler timeline above it (half-second ticks + labeled second ticks)

Middle-recording:
- Record button toggles between recording ↔ paused (pause icon ↔ red dot icon)
- Stop button ends recording and switches to **playback mode**: 54 bars sampled from the full recording render statically, a blue vertical scrubber slides left-to-right, active-side bars turn white, dim-side bars stay 25% white
- Waveform is draggable — drag scrubber to seek; releases resume playback

States: `IDLE → RECORDING ↔ PAUSED → STOPPED ↔ PLAYING → STOPPED → (delete → IDLE)`

Design language: iOS. SF Pro Display font stack. Weight 400/500/600/700. Icons all monochrome except the record circle (red `#FF3B30`).

---

## 1. HEAD

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Functional Mobile Audio Recorder</title>
  <link href="https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
```

Deps: SF Pro Display (Google Fonts CDN). Fallback stack `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif`. No JS libraries.

---

## 2. CSS — VERBATIM

```css
body {
  margin: 0; padding: 0;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 80px;
  box-sizing: border-box;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
}

.recorder-widget {
  width: 300px;
  background: #1C1C1E;
  border-radius: 5px;
  padding: 12px;
  box-sizing: border-box;
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.4),
    0 10px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.recorder-widget.expanded {
  border-radius: 5px;
  padding: 12px 12px 20px 12px;
}

.recorder-screen {
  background: linear-gradient(180deg, #0A0A0C 0%, #1C1C1E 100%);
  border-radius: 20px;
  height: 0px;
  margin-bottom: 0px;
  opacity: 0;
  position: relative;
  display: flex; flex-direction: column; align-items: center;
  box-shadow:
    inset 0 24px 32px -10px rgba(0, 0, 0, 1),
    inset 0 6px 12px rgba(0, 0, 0, 0.9),
    inset 0 1px 2px rgba(0, 0, 0, 0.9),
    0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
  padding-top: 0px;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.recorder-widget.expanded .recorder-screen {
  height: 160px;
  margin-bottom: 20px;
  padding-top: 30px;
  opacity: 1;
}

.waveform-container {
  width: 100%;
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  cursor: pointer;
  touch-action: none;
}

.waveform-bars {
  position: absolute;
  left: 0;
  width: 50%;      /* recording mode default: right-anchored to center */
  height: 100%;
  display: flex;
  align-items: center;
  gap: 3px;
  z-index: 2;
  justify-content: flex-end;
  padding-right: 4px;
}
.waveform-bars.playback-mode {
  width: 100%;
  justify-content: flex-start;
  padding-right: 0;
  padding-left: 4px;
}

.bar-wrapper {
  position: relative;
  height: 50px;
  width: 2px;
  display: flex;
  align-items: center;
}
.tick-label {
  position: absolute; top: -18px; left: 50%;
  transform: translateX(-50%);
  font-size: 10px; color: #8E8E93;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.tick-mark {
  position: absolute; top: -4px; left: 50%;
  transform: translateX(-50%);
  width: 2px; height: 4px;
  background-color: #555;
  border-radius: 1px;
}
.bar {
  width: 2px;
  background-color: #FFFFFF;
  border-radius: 2px;
  height: 2px;
  transition: height 0.05s ease;
}
.bar.dim { background-color: rgba(255,255,255,0.25); }

.waveform-dotted-line {
  position: absolute;
  left: 50%; right: 0; top: 50%;
  height: 1px;
  background-image: linear-gradient(to right, #555 50%, transparent 50%);
  background-size: 5px 1px;
  background-repeat: repeat-x;
  opacity: 0.8;
  padding-left: 4px;
  background-position: 4px 0;
}

.scrubber {
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 74px;
  background-color: #0A84FF;
  z-index: 3;
  border-radius: 2px;
  cursor: pointer;
}
.scrubber::before, .scrubber::after {
  content: '';
  position: absolute; left: 50%;
  transform: translateX(-50%);
  width: 5px; height: 5px;
  background-color: #0A84FF;
  border-radius: 50%;
}
.scrubber::before { top: -1px; }
.scrubber::after  { bottom: -1px; }

.time-display {
  font-size: 32px; font-weight: 700;
  color: #FFFFFF; letter-spacing: 0px;
  margin-top: 4px; margin-bottom: 2px;
  font-variant-numeric: tabular-nums;
}
.meta-info { display: flex; align-items: center; gap: 6px; }
.meta-text {
  font-size: 12px; font-weight: 400;
  color: #8E8E93;
}
.meta-avatar {
  width: 16px; height: 16px;
  border-radius: 50%;
  background-color: #555;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
  background-size: cover;
  border: 1px solid #333;
}

.recorder-controls {
  display: flex; justify-content: center; align-items: center;
  gap: 32px;
  width: 100%;
}
.control-btn {
  background-color: #2C2C2E;
  border: none;
  border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  color: #8E8E93;
  cursor: pointer;
  position: relative;
  box-shadow: none;
  transition: transform 0.1s, opacity 0.2s;
}
.control-btn:active   { transform: scale(0.96); opacity: 0.8; }
.control-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-side { width: 40px; height: 40px; }
.btn-side svg {
  width: 16px; height: 16px;
  fill: none;
  stroke: #FFFFFF;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.btn-main {
  width: 48px; height: 48px;
  flex-direction: column; gap: 4px;
  background-color: #4A4A4F;
  box-shadow: 0 0 0 3px #1C1C1E, 0 0 0 5px #4A4A4F;   /* outer ring effect */
}
.btn-main:active {
  box-shadow: 0 0 0 3px #1C1C1E, 0 0 0 5px #4A4A4F;
}

.play-pause-icon {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 4px;
}
.play-pause-icon svg {
  width: 20px !important;
  height: 20px !important;
  fill: #FF3B30 !important;
}

.icon-record {
  fill: #FF3B30 !important;
  width: 26px !important;
  height: 26px !important;
}

.recording-dot {
  width: 4px; height: 4px;
  background-color: #FF3B30;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255,59,48,0.9);
  position: absolute; bottom: 10px;
  opacity: 0;
  transition: opacity 0.3s;
}
.recording-dot.active {
  opacity: 1;
  animation: pulse 1s infinite alternate;
}
@keyframes pulse {
  from { opacity: 1; }
  to   { opacity: 0.4; }
}

.stop-square {
  width: 16px; height: 16px;
  background-color: #FFFFFF;
  border-radius: 6px;
}
```

Key numbers — do not change:
- Widget 300px, radius 5px, bg `#1C1C1E`, padding 12
- Screen height 0 → 160, opacity 0 → 1, padding-top 0 → 30 on `.expanded`
- Widget shadow: `0 30px 60px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.2)`
- Screen inset shadow stack (4 layers) for the deep-well look
- Waveform 20 bars (recording), 54 bars (playback)
- Bar width 2px, gap 3px, height 2..60px, dim `rgba(255,255,255,0.25)`
- Ticks 4px tall, gray `#555`
- Scrubber blue `#0A84FF`, width 2px, height 74px, two 5×5 dots caps
- Timer 32px 700 tabular-nums
- Main button `48×48` bg `#4A4A4F`, outer ring via `box-shadow` (3px inner + 5px outer color to fake a ring)
- Side buttons `40×40` bg `#2C2C2E`
- Master ease: `cubic-bezier(0.25, 1, 0.5, 1)` for expand/collapse

---

## 3. HTML STRUCTURE — VERBATIM

```html
<body>
  <div class="recorder-widget">
    <div class="recorder-screen">
      <div class="waveform-container" id="waveformContainer">
        <div class="waveform-bars" id="waveformBars"></div>
        <div class="scrubber" id="scrubber"></div>
        <div class="waveform-dotted-line" id="dottedLine"></div>
      </div>
      <div class="time-display" id="timeDisplay">00:00</div>
      <div class="meta-info">
        <span class="meta-text" id="statusText">Ready to record</span>
        <div class="meta-avatar"></div>
      </div>
    </div>

    <div class="recorder-controls">
      <button class="control-btn btn-side" id="stopBtn" disabled>
        <div class="stop-square"></div>
      </button>

      <button class="control-btn btn-main" id="mainBtn">
        <div class="play-pause-icon" id="mainBtnIcon">
          <!-- Initial icon: play + double-pause bars (loaded via ICONS on state changes) -->
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF">
            <path d="M4 4 L 13 12 L 4 20 Z" />
            <rect x="15" y="5" width="3" height="14" rx="1"/>
            <rect x="20" y="5" width="3" height="14" rx="1"/>
          </svg>
        </div>
        <div class="recording-dot" id="recordingDot" style="display: none;"></div>
      </button>

      <button class="control-btn btn-side" id="deleteBtn" disabled>
        <svg viewBox="0 0 24 24">
          <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
        </svg>
      </button>
    </div>
  </div>
</body>
```

Copy — verbatim:

| Slot              | Text                    |
|-------------------|-------------------------|
| Title tag         | `Functional Mobile Audio Recorder` |
| Timer (rest)      | `00:00`                 |
| Status (IDLE)     | `Ready to record`       |
| Status (RECORDING)| `Recording...`          |
| Status (PAUSED)   | `Paused`                |
| Status (STOPPED)  | `New Audio from you`    |
| Status (PLAYING)  | `Playing audio...`      |

---

## 4. ICON MAP (swapped into `#mainBtnIcon` via `innerHTML` on state change)

```js
const ICONS = {
  record: `<svg viewBox="0 0 24 24" class="icon-record"><circle cx="12" cy="12" r="8" /></svg>`,
  pause:  `<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`,
  play:   `<svg viewBox="0 0 24 24"><path d="M7 5l11 7-11 7z" /></svg>`,
};
```

- `record` — solid red circle (uses `.icon-record` class → `fill: #FF3B30`)
- `pause` — two 4×14 rounded bars
- `play` — right-pointing triangle (goes into playback state)

Other icons:
- Delete: trash bin (stroke, viewBox 0 0 24 24, `stroke-width 1.5 round`)
- Stop: 16×16 white `border-radius: 6px` square (`.stop-square`)

---

## 5. STATE MODEL

```js
let state = 'IDLE';        // IDLE | RECORDING | PAUSED | STOPPED | PLAYING
let secondsElapsed = 0;
let timerInterval = null;

const numBars = 20;               // recording live view
let volumeHistory = new Array(numBars).fill(2);
let rulerHistory = new Array(numBars).fill({ text: '', mark: false });
let fullRecording = [];           // all sampled amplitudes across the session
let totalBarsAdded = 0;
let lastTick = 0;
let isDragging = false;

let audioContext, analyser, microphone;
let mediaRecorder;
let audioChunks = [];
let audioBlobUrl = null;
const audioPlayer = new Audio();
let playbackBars = [];            // 54 static bars in playback mode
```

State transitions:

| From        | Event            | To          | Side effects                                      |
|-------------|------------------|-------------|--------------------------------------------------|
| IDLE        | main click       | RECORDING   | expand widget, `setupAudio`, start MediaRecorder, reset timers, show pause icon + red dot |
| RECORDING   | main click       | PAUSED      | `mediaRecorder.pause()`, clearInterval, show record icon, hide dot |
| PAUSED      | main click       | RECORDING   | `mediaRecorder.resume()`, restart interval, show pause icon + dot  |
| RECORDING/PAUSED | stop click  | STOPPED     | `mediaRecorder.stop()`, enable delete, disable stop, switch bars to playback-mode, hide dotted line, render 54 playback bars, show play icon |
| STOPPED     | main click       | PLAYING     | `audioPlayer.play()`, show pause icon                              |
| PLAYING     | main click       | STOPPED     | `audioPlayer.pause()`, show play icon                              |
| PLAYING     | audio ended      | STOPPED     | scrubber → 0%, all bars re-dimmed, show play icon                  |
| STOPPED     | delete click     | IDLE        | clear blob URL, reset timer to `00:00`, restore recording UI, collapse widget |

---

## 6. SETUP AUDIO (paste verbatim)

```js
async function setupAudio() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser     = audioContext.createAnalyser();
  analyser.fftSize = 256;
  microphone   = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);

  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: 'audio/mp3' });
    audioBlobUrl = URL.createObjectURL(blob);
    audioPlayer.src = audioBlobUrl;
    audioChunks = [];
  };
  requestAnimationFrame(visualize);
}
```

- `fftSize: 256` → 128 frequency bins
- 50ms sample interval (see next section)

---

## 7. VISUALIZATION LOOP (paste verbatim)

```js
function visualize(timestamp) {
  requestAnimationFrame(visualize);

  if (state === 'RECORDING' && analyser) {
    if (timestamp - lastTick > 50) {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      let avg = sum / data.length;

      let height = Math.max(2, (avg / 64) * 60);
      if (height > 60) height = 60;

      volumeHistory.shift();
      volumeHistory.push(height);
      fullRecording.push(height);

      totalBarsAdded++;
      let text = '', showMark = false;
      if (totalBarsAdded % 20 === 0) { text = formatTime(totalBarsAdded / 20); showMark = true; }
      else if (totalBarsAdded % 10 === 0) showMark = true;

      rulerHistory.shift();
      rulerHistory.push({ text, mark: showMark });
      lastTick = timestamp;
    }

    for (let i = 0; i < numBars; i++) {
      bars[i].style.height = `${volumeHistory[i]}px`;
      labels[i].innerText = rulerHistory[i].text;
      marks[i].style.opacity = rulerHistory[i].mark ? '1' : '0';
    }
  } else if (state === 'PLAYING' && !isDragging) {
    if (audioPlayer.duration) {
      const progress = audioPlayer.currentTime / audioPlayer.duration;
      scrubber.style.left = `${progress * 100}%`;
      updatePlaybackBarsColors(progress);
    }
  } else if (state === 'IDLE') {
    for (let i = 0; i < numBars; i++) {
      bars[i].style.height = '2px';
      volumeHistory[i] = 2;
      labels[i].innerText = '';
      marks[i].style.opacity = '0';
    }
    rulerHistory.fill({ text: '', mark: false });
  }
}
```

Sampling math:
- Every 50ms → 20 samples/sec = 1 second of audio spans 20 bars
- Height formula: `Math.max(2, (avg / 64) * 60)`, clamped to 60px
- Ruler ticks: every 20 bars = 1s label, every 10 bars = half-second unlabeled tick

---

## 8. PLAYBACK RENDER (paste verbatim)

```js
function renderPlaybackWaveform() {
  barsContainer.innerHTML = '';
  playbackBars = [];
  const maxPlaybackBars = 54;
  const step = Math.max(1, fullRecording.length / maxPlaybackBars);

  for (let i = 0; i < maxPlaybackBars; i++) {
    const index = Math.floor(i * step);
    const h = fullRecording[index] || 2;

    const wrapper = document.createElement('div');
    wrapper.className = 'bar-wrapper';
    const label = document.createElement('span');
    label.className = 'tick-label';
    const mark  = document.createElement('div');
    mark.className = 'tick-mark';
    mark.style.opacity = '0';

    if (index > 0 && index % 20 === 0) {
      label.innerText = formatTime(index / 20);
      mark.style.opacity = '1';
    } else if (index > 0 && index % 10 === 0) {
      mark.style.opacity = '1';
    }

    const bar = document.createElement('div');
    bar.className = 'bar dim';
    bar.style.height = `${h}px`;

    wrapper.appendChild(label);
    wrapper.appendChild(mark);
    wrapper.appendChild(bar);
    barsContainer.appendChild(wrapper);
    playbackBars.push(bar);
  }
}

function updatePlaybackBarsColors(progress) {
  const total = playbackBars.length;
  const active = Math.floor(progress * total);
  for (let i = 0; i < total; i++) {
    if (i <= active) playbackBars[i].classList.remove('dim');
    else             playbackBars[i].classList.add('dim');
  }
}
```

- Playback samples the `fullRecording` array evenly into 54 bars
- Bars below scrubber turn white (`.dim` removed), ahead stay grey

---

## 9. DRAG-TO-SEEK (paste verbatim)

```js
waveformContainer.addEventListener('pointerdown', (e) => {
  if (state !== 'STOPPED' && state !== 'PLAYING') return;
  isDragging = true;
  handleDrag(e);
});
document.addEventListener('pointermove', (e) => {
  if (isDragging) handleDrag(e);
});
document.addEventListener('pointerup', () => {
  if (isDragging) {
    isDragging = false;
    if (state === 'PLAYING') audioPlayer.play();
  }
});

function handleDrag(e) {
  const rect = waveformContainer.getBoundingClientRect();
  let x = e.clientX - rect.left;
  x = Math.max(0, Math.min(x, rect.width));
  const progress = x / rect.width;
  scrubber.style.left = `${progress * 100}%`;
  updatePlaybackBarsColors(progress);
  if (audioPlayer.duration) {
    audioPlayer.currentTime = progress * audioPlayer.duration;
  }
}
```

- Only interactive in `STOPPED` or `PLAYING`
- Global `pointermove` / `pointerup` so drag continues off the waveform bounds

---

## 10. RESPONSIVE

- Fixed 300px wide. Below 340px viewport, add `max-width: calc(100vw - 24px)`.
- Touch: `touch-action: none` on `.waveform-container` prevents scroll hijack.
- Prefers-reduced-motion:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .recorder-widget, .recorder-screen, .bar { transition: none !important; }
    .recording-dot.active { animation: none !important; }
  }
  ```

---

## 11. DELIVERABLE

- One HTML file matching sections 1–9 in order
- One TSX drop-in `AudioRecorder.tsx`. Assumes SF Pro or Inter loaded. Uses refs for all `HTMLDivElement`s so the rAF loop mutates DOM directly (no per-frame React re-render). `useState` only for `state` and `secondsElapsed`. `useEffect` sets up audio + rAF + cleanup on unmount (revoke blob URL, close AudioContext).

---

**Awwwards-tier version →** https://cuedesign.space/component/cue179
