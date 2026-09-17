# Synt-X Hardware Media Player — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal as a signature product showcase widget on a hardware brand, audio gear, or Braun-style tribute product page where tactile realism sells the object.

---

# SYNT-X 01 — Branded Audio-Visual Player Device

> **This is an ADDITION to my existing project. DO NOT create a new HTML file. DO NOT overwrite my current `<body>`, `<html>`, or global styles.**
> Insert this device at the spot I mark. If Inter is already loaded from Google Fonts, reuse — don't duplicate. Namespace new class names to avoid collisions.

Build a pixel-perfect **branded portable audio-visual player** — the kind of skeuomorphic hardware widget you'd see on a Rauno/Vercel product page or a Braun tribute. Matte black polycarbonate shell with a real 16:10 video screen, `SYNT-X // 01` debossed label, dot-matrix speaker grille, three physical-looking buttons (prev / play / next) with hardware-style press feedback, an LED indicator on the play button that lights up orange when playing, a mouse-idle auto-hide UI, and a real-time 3D perspective tilt following the cursor. Everything wired to actual video: play/pause/seek/mute/progress. Zero libraries.

Award-winning polish, pure HTML + CSS + vanilla JS.

---

## FRAMEWORK

- Plain **HTML + CSS + vanilla JS**. No React, no libraries.
- Single Google Font: **Inter** (weights 500 / 700 / 900).
- Uses the native HTML5 `<video>` element for playback + all its events.

---

## ASSETS

Fonts only:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700;900&display=swap" rel="stylesheet">
```

Sample video + poster (use exact URLs):

- **Video**: `https://www.w3schools.com/html/mov_bbb.mp4`
- **Poster**: `https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1000&auto=format&fit=crop`

Noise texture is inline SVG data-URI — no external file.

---

## DESIGN TOKENS

```css
:root {
  --shell-dark: #1a1a1a;
  --shell-mid: #2a2a2a;
  --btn-face: #181818;
  --btn-active: #121212;
  --accent-orange: #ff5500;
  --led-off: #333;
  --led-glow: rgba(255,85,0,0.8);
}
body {
  margin: 0; padding: 0;
  height: 100vh;
  display: flex; justify-content: center; align-items: center;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  perspective: 1500px;                                 /* enables the tilt */
  background: radial-gradient(circle at center, #ffffff 0%, #d4d4d8 100%);
}
```

---

## SECTION 1 — Device shell

```css
.player-device {
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  padding: 12px;
  border-radius: 40px;
  width: 320px;
  display: flex; flex-direction: column; gap: 14px;
  position: relative;
  /* 5-layer premium hardware shadow */
  box-shadow:
    0 40px 80px rgba(0,0,0,0.35),                      /* soft drop */
    0 0 0 4px #121212,                                 /* inner black rim */
    0 0 0 5px rgba(255,255,255,0.06),                  /* hairline edge highlight */
    inset 0 1.5px 2px rgba(255,255,255,0.12),          /* top gloss */
    inset 0 -3px 8px rgba(0,0,0,0.8);                  /* bottom shading */
  transform-style: preserve-3d;
  transition: transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1),
              box-shadow 0.1s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform, box-shadow;
  cursor: default;
}

/* Matte fractal-noise overlay (0.04 opacity) — inline SVG */
.player-device::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: 40px;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)"/></svg>');
  opacity: 0.04;
  pointer-events: none;
  z-index: 1;
}
```

The device is a 320px wide black pill with rounded 40px corners. The 5-shadow stack creates the illusion of a real hardware object: soft drop underneath, tight black inner rim like a bumper, a hairline reflection edge, top gloss, and bottom bevel shading. The noise overlay sells the "matte" finish.

---

## SECTION 2 — Screen container (16:10 video)

```html
<div class="screen-container" id="screenContainer">
  <video id="video"
         src="https://www.w3schools.com/html/mov_bbb.mp4"
         poster="https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1000&auto=format&fit=crop"
         muted loop playsinline></video>

  <div class="status-pill" id="statusPill">
    <span class="dot"></span> <span id="statusText">PAUSED</span>
  </div>

  <button class="mute-btn" id="muteBtn" aria-label="Mute/Unmute">
    <svg viewBox="0 0 24 24" id="muteIcon">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
  </button>

  <div class="skip-indicator" id="skipIndicator"></div>

  <div class="progress-wrapper" id="progressWrapper">
    <div class="progress-bar" id="progressBar"></div>
  </div>
</div>
```

```css
.screen-container {
  position: relative;
  width: 100%; aspect-ratio: 16 / 10;
  border-radius: 28px; overflow: hidden;
  background: #000;
  box-shadow:
    inset 0 6px 14px rgba(0,0,0,0.95),                 /* deep inner shadow — screen sits recessed */
    0 1px 1px rgba(255,255,255,0.1);
  transform: translateZ(20px);                         /* pops forward in 3D */
  z-index: 2;
}
/* Vignette overlay (top+bottom fade) — hides when UI hidden */
.screen-container::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(to bottom,
    rgba(0,0,0,0.4) 0%, transparent 25%,
    transparent 75%, rgba(0,0,0,0.4) 100%);
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.5s ease;
  z-index: 5;
}
.screen-container.hide-ui::after { opacity: 0; }
.screen-container video {
  width: 100%; height: 100%;
  object-fit: cover; cursor: pointer;
}
```

### Status pill (top-left)

```css
.status-pill {
  position: absolute; top: 12px; left: 14px;
  background: rgba(10,10,10,0.8);
  backdrop-filter: blur(12px);
  color: #f3f4f6;
  padding: 5px 12px;
  border-radius: 14px;
  font-size: 9px; font-weight: 900;
  letter-spacing: 0.8px;
  display: flex; align-items: center; gap: 6px;
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.08);
  text-transform: uppercase;
  transition: opacity 0.5s ease;
  z-index: 10;
}
.status-pill.hide { opacity: 0; }
.status-pill .dot {
  width: 5px; height: 5px;
  background: #9ca3af; border-radius: 50%;
  transition: all 0.3s;
}
.status-pill.playing .dot {
  background: #ff5500;
  box-shadow: 0 0 8px rgba(255,85,0,0.8);
}
```

Text is `PAUSED` by default, changes to `PLAYING` on play. Dot turns orange with glow when playing — synced with the accent color.

### Mute button (top-right)

```css
.mute-btn {
  position: absolute; top: 12px; right: 14px;
  background: rgba(10,10,10,0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.08);
  border-radius: 50%;
  width: 30px; height: 30px;
  display: flex; justify-content: center; align-items: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
  z-index: 10;
}
.mute-btn.hide { opacity: 0; pointer-events: none; }
.mute-btn:hover { background: rgba(30,30,30,0.9); transform: scale(1.08); border-color: rgba(255,255,255,0.25); }
.mute-btn:active { transform: scale(0.95); }
.mute-btn svg { width: 14px; height: 14px; fill: rgba(255,255,255,0.9); }
```

Icon swaps between muted-speaker and speaker-with-waves paths on click.

### Skip indicator (center flash)

```css
.skip-indicator {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  color: #fff;
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 14px; font-weight: 800; letter-spacing: 0.5px;
  opacity: 0; pointer-events: none;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
}
.skip-indicator.show { opacity: 1; transform: translate(-50%, -50%) scale(1); }
```

Flashes `⏪ -5s`, `⏩ +5s`, `🔇 Muted`, or `🔊 Sound On` for 500ms with a springy scale-in on every skip / mute toggle.

### Progress bar (bottom)

```css
.progress-wrapper {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 4px;
  background: rgba(255,255,255,0.2);
  z-index: 10;
  transition: opacity 0.5s ease;
}
.progress-wrapper.hide { opacity: 0; }
.progress-bar {
  height: 100%; width: 0%;
  background: var(--accent-orange);
  box-shadow: 0 0 10px rgba(255,85,0,0.8);
  transition: width 0.1s linear;
}
```

The `.progress-bar` width updates on every `timeupdate` event from the video: `(currentTime / duration) * 100 + '%'`.

---

## SECTION 3 — Debossed brand label

```html
<div class="brand-label">SYNT-X // 01</div>
```

```css
.brand-label {
  text-align: center;
  font-size: 8px; font-weight: 900;
  color: #111;
  text-shadow: 0 1px 0 rgba(255,255,255,0.07);          /* debossed effect */
  letter-spacing: 4px;
  margin-top: -2px; margin-bottom: -4px;
  transform: translateZ(2px);
  z-index: 2;
}
```

Tiny etched-into-plastic branding between the screen and the speaker grille. The `text-shadow: 0 1px 0 rgba(255,255,255,0.07)` creates the debossed look.

---

## SECTION 4 — Dot-matrix speaker grille

```css
.speaker-grille {
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
```

The **two-layer radial-gradient at 5px repeat** creates a real dot-matrix pattern: the first layer is the black hole, the second is a tiny highlight offset by 0.7px so each dot looks slightly beveled — like actual perforated aluminum.

---

## SECTION 5 — Hardware buttons

```html
<div class="controls">
  <button class="btn btn-prev" id="prevBtn" aria-label="Previous">
    <svg viewBox="0 0 24 24"><polygon points="16,5 4,12 16,19"/><rect x="2" y="5" width="3" height="14" rx="1"/></svg>
  </button>
  <button class="btn btn-play" id="playBtn" aria-label="Play">
    <svg viewBox="0 0 24 24" id="playIcon"><polygon points="8,5 20,12 8,19"/></svg>
  </button>
  <button class="btn btn-next" id="nextBtn" aria-label="Next">
    <svg viewBox="0 0 24 24"><polygon points="8,5 20,12 8,19"/><rect x="19" y="5" width="3" height="14" rx="1"/></svg>
  </button>
</div>
```

```css
.controls {
  display: flex; gap: 3px;
  height: 64px;
  transform: translateZ(10px);
  z-index: 2;
}
.btn {
  flex: 1;
  background: #181818; border: none; border-radius: 8px;
  display: flex; justify-content: center; align-items: center;
  cursor: pointer;
  /* Hardware button — bevel + inner shadow */
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.06),
    inset 1px 0 0 rgba(255,255,255,0.02),
    inset -1px 0 0 rgba(255,255,255,0.02),
    inset 0 -2px 6px rgba(0,0,0,0.95);
  transition: all 0.1s;
  position: relative;
}
.btn-prev { border-bottom-left-radius: 28px; }
.btn-next { border-bottom-right-radius: 28px; }
.btn svg { width: 20px; height: 20px; fill: #d1d5db; transition: transform 0.1s; }
.btn:hover  { background: #1e1e1e; }
.btn:active {
  background: #121212;
  box-shadow: inset 0 3px 8px rgba(0,0,0,0.95);
}
.btn:active svg { transform: scale(0.92); fill: #9ca3af; }

/* Tiny LED on play button — lights up orange when playing */
.btn-play::after {
  content: '';
  position: absolute; bottom: 8px;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: #333;
  transition: all 0.3s;
}
.btn-play.is-playing::after {
  background: #ff5500;
  box-shadow: 0 0 6px rgba(255,85,0,0.8);
}
```

The 4-directional inset shadow (top-bevel + side hairlines + deep bottom shadow) makes each button read as physically pressed into the shell. On `:active` the entire top shadow flips to a deep 3px inset shadow — the button visibly "sinks in" and the SVG scales to 0.92 like it's under the finger.

**LED indicator** — 4×4 dot at the bottom of the play button. Dark grey when paused, glowing orange when playing.

---

## SECTION 6 — JS wiring

Real HTML5 video events + custom idle timer + skip indicator + 3D tilt.

```js
const video = document.getElementById('video');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const muteBtn = document.getElementById('muteBtn');
const screenContainer = document.getElementById('screenContainer');
const progressBar = document.getElementById('progressBar');
const progressWrapper = document.getElementById('progressWrapper');
const playIcon = document.getElementById('playIcon');
const muteIcon = document.getElementById('muteIcon');
const statusPill = document.getElementById('statusPill');
const statusText = document.getElementById('statusText');
const skipIndicator = document.getElementById('skipIndicator');
const device = document.getElementById('device');

let skipTimeout, idleTimeout;

// Progress bar syncs with video
video.addEventListener('timeupdate', () => {
  if (video.duration) progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
});

// Mouse-idle: hides overlays after 2s if playing
function resetIdleTimer() {
  [statusPill, muteBtn, progressWrapper].forEach(el => el.classList.remove('hide'));
  screenContainer.classList.remove('hide-ui');
  clearTimeout(idleTimeout);
  if (!video.paused) {
    idleTimeout = setTimeout(() => {
      [statusPill, muteBtn, progressWrapper].forEach(el => el.classList.add('hide'));
      screenContainer.classList.add('hide-ui');
    }, 2000);
  }
}
device.addEventListener('mousemove', resetIdleTimer);
device.addEventListener('click', resetIdleTimer);
device.addEventListener('mouseleave', () => {
  if (!video.paused) {
    [statusPill, muteBtn, progressWrapper].forEach(el => el.classList.add('hide'));
    screenContainer.classList.add('hide-ui');
  }
});

// Play/pause
function togglePlay() {
  if (video.paused) {
    video.play();
    statusPill.classList.add('playing');
    statusText.innerText = 'PLAYING';
    playBtn.classList.add('is-playing');
    playIcon.innerHTML = '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
  } else {
    video.pause();
    statusPill.classList.remove('playing');
    statusText.innerText = 'PAUSED';
    playBtn.classList.remove('is-playing');
    playIcon.innerHTML = '<polygon points="8,5 20,12 8,19"/>';
  }
  resetIdleTimer();
}
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('ended', () => {
  statusPill.classList.remove('playing');
  statusText.innerText = 'PAUSED';
  playBtn.classList.remove('is-playing');
  playIcon.innerHTML = '<polygon points="8,5 20,12 8,19"/>';
  resetIdleTimer();
});

// Skip indicator flash
function showSkipIndicator(text) {
  skipIndicator.innerText = text;
  skipIndicator.classList.add('show');
  clearTimeout(skipTimeout);
  skipTimeout = setTimeout(() => skipIndicator.classList.remove('show'), 500);
  resetIdleTimer();
}

// Mute
muteBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  video.muted = !video.muted;
  if (video.muted) {
    muteIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    showSkipIndicator('🔇 Muted');
  } else {
    muteIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    showSkipIndicator('🔊 Sound On');
  }
});

// Skip
prevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  video.currentTime = Math.max(0, video.currentTime - 5);
  showSkipIndicator('⏪ -5s');
});
nextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  video.currentTime = Math.min(video.duration, video.currentTime + 5);
  showSkipIndicator('⏩ +5s');
});

// 3D tilt — tracks cursor globally, extends 50px past device bounds
document.addEventListener('mousemove', (e) => {
  const rect = device.getBoundingClientRect();
  const hovering = e.clientX >= rect.left - 50 && e.clientX <= rect.right + 50
                && e.clientY >= rect.top  - 50 && e.clientY <= rect.bottom + 50;
  if (hovering) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -8;
    const ry = ((e.clientX - cx) / (rect.width  / 2)) *  8;
    device.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
    device.style.boxShadow = `
      ${-ry}px ${30 + rx}px 70px rgba(0,0,0,0.5),
      0 0 0 4px #121212,
      0 0 0 5px rgba(255,255,255,0.06),
      inset 0 1.5px 2px rgba(255,255,255,0.12),
      inset 0 -3px 8px rgba(0,0,0,0.8)`;
  } else {
    device.style.transform = 'rotateX(0) rotateY(0) scale3d(1,1,1)';
    device.style.boxShadow = '';
  }
});

resetIdleTimer();
```

**Timings baked into the JS**:
- Idle timeout: 2000ms
- Skip indicator flash: 500ms
- 3D tilt: ±8° max on each axis, +2% scale
- Hover trigger extends 50px past the device edge (so tilt doesn't snap the second the cursor leaves the exact border)
- Skip amount: ±5s per click

---

## Responsive

- **≥ 360px** — as spec above. Device is 320px, comfortably fits mobile.
- **≤ 360px**:
  ```css
  @media (max-width: 360px) {
    .player-device { width: calc(100vw - 32px); border-radius: 32px; }
    .screen-container { border-radius: 24px; }
  }
  ```
- **Touch** — 3D tilt is mousemove-only, so it naturally disables on touch. Buttons + video are tap-friendly. Idle timer still works via `click` events on touch.
- **`prefers-reduced-motion: reduce`**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .player-device { transition: none !important; }
    .skip-indicator { transition: opacity 0.2s ease !important; }
  }
  ```
- Test at 320, 375, 640, 1024, 1440.

---

## Deliverable checklist (all must be true)

- [ ] Body has radial-gradient background (white → `#d4d4d8`), perspective 1500px, flex-centered.
- [ ] `.player-device` is **320px wide**, 40px radius, dark linear gradient body, 5-layer premium shadow (soft drop + inner rim + hairline highlight + top gloss + bottom shading).
- [ ] Matte noise overlay via inline SVG data-URI at 0.04 opacity.
- [ ] Screen container is 16:10 aspect, 28px radius, deep 6px inset shadow so it reads recessed, `translateZ(20px)` for depth. Contains real HTML5 `<video>` with the exact video + poster URLs given.
- [ ] Status pill top-left: `PAUSED` / `PLAYING` with a dot that turns orange (`#ff5500` + glow) on play.
- [ ] Mute button top-right: 30×30 circle glassmorphic, icon swap between muted and speaker paths.
- [ ] Skip indicator centered, springy scale-in for `⏪ -5s`, `⏩ +5s`, `🔇 Muted`, `🔊 Sound On`, auto-hides at 500ms.
- [ ] Bottom 4px progress bar, orange `#ff5500` fill with glow, driven by `timeupdate` event.
- [ ] Auto-hide UI: on `mousemove/click` — show everything. If playing and idle for 2s or mouse leaves — hide status pill, mute button, progress bar, and vignette.
- [ ] Debossed `SYNT-X // 01` brand label sits between screen and speaker grille, letter-spacing 4px, `text-shadow` for etched look.
- [ ] Speaker grille: 20px tall, dot-matrix from 2-layer radial-gradient at 5×5px repeat, `translateZ(5px)`.
- [ ] 3 buttons in row at 64px tall: prev / play / next. Prev and next have `border-bottom-left-radius: 28px` / `border-bottom-right-radius: 28px` so they merge into the device's rounded bottom corners.
- [ ] Each button has 4-way inset shadow (top-bevel, side hairlines, deep bottom) → reads as physically embedded. On `:active` shadow flips to `inset 0 3px 8px rgba(0,0,0,0.95)` — sinks in visibly, SVG scales to 0.92.
- [ ] Play button LED: 4×4 dot at `bottom: 8px`, dark grey when paused, orange with `0 0 6px` glow when playing.
- [ ] Play icon SVG swaps between polygon triangle (paused) and 2 vertical rects (playing) on state change.
- [ ] Prev/Next skip video ±5s via `video.currentTime = Math.max/min(0/duration, ±5)`.
- [ ] Video click also toggles play/pause.
- [ ] `ended` event resets to `PAUSED` state.
- [ ] 3D tilt: ±8° X/Y based on cursor position, +2% scale, box-shadow tracks the tilt direction. Hover zone extends 50px past device bounds. Snaps back to 0° when cursor leaves.
- [ ] `prefers-reduced-motion: reduce` disables the tilt transform transition + speeds up skip indicator.
- [ ] No console errors, video plays inline, all buttons wired to real video events.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue056
