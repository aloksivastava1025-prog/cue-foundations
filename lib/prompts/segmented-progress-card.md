# Segmented Progress Card — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** A SaaS product dashboard or onboarding milestone page where users track goal completion at a glance.

---

# Progress Indicator Card — 30-Block Segmented Bar with 3D Tilt + Theme Toggle

> **This is an ADDITION to my existing project. DO NOT create a new HTML file. DO NOT overwrite my current `<body>`, `<html>`, or global styles.**
> Insert this card + its top-right theme toggle at the spot I mark. If Inter is already loaded from Google Fonts, reuse — don't duplicate. Namespace any new class names to avoid collisions with my existing markup. Preserve any existing theme system I already have — this component is designed to plug into a `data-theme="light"` attribute on `<html>`, but if my project uses a different scheme, adapt the CSS variables to match mine.

Build a pixel-perfect **micro-widget card** that shows a progress indicator with a 30-cell segmented bar, a big percentage counter that animates from 0 → 66, a subtle badge showing period-over-period delta, and cinematic entrance choreography. The card supports **light + dark theme** with a floating top-right toggle, tilts in 3D on mouse-move, and every block in the bar pops in with a bouncy stagger. Every cell hover-scales and glows blue. No frameworks, no libraries.

Award-winning polish is non-negotiable — every value below is exact, not "roughly".

---

## FRAMEWORK

- Plain **HTML + CSS + vanilla JS**. No React. No libraries.
- Single Google Font: **Inter** (weights 400 / 500 / 600).
- Theme persisted in `localStorage` under key `theme` (`"light"` | `"dark"`).

---

## ASSETS

No external images. All icons are inline SVG. Only asset is the Google Font:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## DESIGN TOKENS (paste verbatim)

Two theme scopes on `:root`. Default is **dark**. Add `data-theme="light"` on `<html>` to switch. Read the persisted theme in a tiny `<script>` **inside `<head>`** before the body paints so the card never flashes wrong colors.

```html
<script>
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
</script>
```

```css
:root {
  --bg: #CCCCCC;
  --card-bg: #111111;
  --text-main: #FFFFFF;
  --text-muted: #8A8A8A;
  --divider: #262626;
  --bar-filled: #FFFFFF;
  --bar-empty: #333333;
  --badge-border: rgba(255, 255, 255, 0.2);
  --badge-hover-bg: rgba(255, 255, 255, 0.1);
  --badge-hover-border: rgba(255, 255, 255, 0.4);
  --card-shadow-start: rgba(0,0,0,0.3);
  --card-shadow-end: rgba(0,0,0,0.1);
}
:root[data-theme="light"] {
  --bg: #F0F0F0;
  --card-bg: #FFFFFF;
  --text-main: #111111;
  --text-muted: #666666;
  --divider: #EAEAEA;
  --bar-filled: #111111;
  --bar-empty: #E0E0E0;
  --badge-border: rgba(0, 0, 0, 0.15);
  --badge-hover-bg: rgba(0, 0, 0, 0.05);
  --badge-hover-border: rgba(0, 0, 0, 0.25);
  --card-shadow-start: rgba(0,0,0,0.15);
  --card-shadow-end: rgba(0,0,0,0.05);
}
body {
  margin: 0; min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background-color: var(--bg);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  perspective: 1500px;                              /* KEY — enables the card's 3D tilt */
  transition: background-color 0.4s ease;
}
```

---

## THEME TOGGLE (floating, top-right)

```html
<button class="theme-toggle" id="themeToggle" aria-label="Toggle Theme">
  <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
  <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
</button>
```

```css
.theme-toggle {
  position: absolute; top: 32px; right: 32px;
  background: var(--card-bg);
  border: 1px solid var(--badge-border);
  color: var(--text-main);
  width: 48px; height: 48px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 100;
  box-shadow: 0 4px 12px var(--card-shadow-end);
}
.theme-toggle:hover  { transform: scale(1.10); }
.theme-toggle:active { transform: scale(0.85); }
.theme-toggle svg {
  width: 22px; height: 22px; position: absolute;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
}
:root[data-theme="light"] .moon-icon { opacity: 1; transform: rotate(0); }
:root[data-theme="light"] .sun-icon  { opacity: 0; transform: rotate(90deg); }
:root:not([data-theme="light"]) .moon-icon { opacity: 0; transform: rotate(-90deg); }
:root:not([data-theme="light"]) .sun-icon  { opacity: 1; transform: rotate(0); }
```

Only ONE icon is visible per theme; the other is faded + rotated. Bouncy `cubic-bezier(0.34,1.56,0.64,1)` on scale gives the pop.

---

## CARD MARKUP

```html
<div class="card">
  <div class="header">
    <div class="title-row">
      <h2>Progress Indicator</h2>
      <div class="dots"><span></span><span></span><span></span></div>
    </div>
    <p class="subtitle">You are on track to finish the goal three days early</p>
  </div>

  <div class="divider"></div>

  <div class="stats-row">
    <div class="percent">66%</div>
    <div class="badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <line x1="7" y1="17" x2="17" y2="7"/>
        <polyline points="7 7 17 7 17 17"/>
      </svg>
      30%
    </div>
    <div class="vs-text">vs. the last period</div>
  </div>

  <div class="segmented-bar">
    <!-- 20 .block.filled -->
    <!-- 10 .block.empty  -->
  </div>
</div>
```

Exact copy — do not paraphrase:
- Title: `Progress Indicator`
- Subtitle: `You are on track to finish the goal three days early`
- Percent (final value): `66%`
- Badge value: `30%`
- Vs-text: `vs. the last period`

Bar has exactly **30 blocks**: **20 filled** first, then **10 empty**.

---

## CARD CSS

```css
.card {
  width: 460px;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 40px var(--card-shadow-end);
  box-sizing: border-box;
  color: var(--text-main);
  opacity: 0;                                       /* animated in via cardEntrance */
  animation: cardEntrance 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transform-style: preserve-3d;                     /* 3D tilt */
  transition: transform 0.15s ease-out, box-shadow 0.15s ease-out, background-color 0.4s ease, color 0.4s ease;
  position: relative;
}
@keyframes cardEntrance {
  0%   { opacity: 0; transform: translateY(40px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0)   scale(1); }
}

/* Staggered inner text/atom reveals */
.title-row, .subtitle, .divider, .stats-row {
  opacity: 0;
  animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.title-row { animation-delay: 0.1s; }
.subtitle  { animation-delay: 0.2s; }
.divider   { animation-delay: 0.3s; }
.stats-row { animation-delay: 0.4s; }
@keyframes fadeUp {
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

```css
.header { display: flex; flex-direction: column; }

.title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
h2 { margin: 0; font-size: 15px; font-weight: 500; letter-spacing: 0.01em; }

.dots {
  color: var(--text-muted);
  display: flex; gap: 3px;
  margin-top: -6px;
  cursor: pointer; padding: 4px;
  transition: gap 0.2s ease, transform 0.2s ease;
}
.dots:hover { gap: 5px; transform: scale(1.1); }
.dots span {
  display: block; width: 3px; height: 3px;
  background-color: var(--text-muted); border-radius: 50%;
  transition: background-color 0.2s ease;
}
.dots:hover span { background-color: var(--text-main); }

.subtitle { margin: 0; font-size: 13px; color: var(--text-muted); font-weight: 400; letter-spacing: -0.01em; }

.divider {
  height: 1px; background: var(--divider);
  margin: 20px 0;
  transform-origin: left center;
  animation: expandDivider 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.3s;
  opacity: 0;
}
@keyframes expandDivider {
  0%   { opacity: 0; transform: scaleX(0); }
  100% { opacity: 1; transform: scaleX(1); }
}

.stats-row { display: flex; align-items: center; gap: 12px; }
.percent {
  font-size: 32px; font-weight: 400;
  letter-spacing: -0.02em; line-height: 1;
  font-variant-numeric: tabular-nums;
}
.badge {
  display: flex; align-items: center; gap: 4px;
  border: 1px solid var(--badge-border); border-radius: 20px;
  padding: 4px 10px;
  font-size: 11px; font-weight: 500; letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.2s ease;
}
.badge:hover { background: var(--badge-hover-bg); border-color: var(--badge-hover-border); }
.badge svg  { width: 10px; height: 10px; stroke-width: 2.5;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.badge:hover svg { transform: translate(2px, -2px); }

.vs-text { font-size: 13px; color: var(--text-muted); letter-spacing: -0.01em; }
```

---

## SEGMENTED BAR CSS

```css
.segmented-bar { display: flex; gap: 3px; height: 48px; margin-top: 24px; }

.block {
  flex: 1; border-radius: 2px;
  opacity: 0; transform: scaleY(0.3);                 /* animated in via popBlock/popBlockEmpty */
  cursor: pointer;
  transition:
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    background-color 0.2s,
    box-shadow 0.2s;
}
.block:hover {
  transform: scaleY(1.3) scaleX(1.5) !important;
  background: #4A90E2 !important;                     /* cool-blue highlight */
  box-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
  z-index: 10;
}
.block.filled { background: var(--bar-filled); }
.block.empty  { background: var(--bar-empty); }

@keyframes popBlock {
  0%   { opacity: 0; transform: scaleY(0.3); background: var(--bar-empty); }
  70%  { transform: scaleY(1.1); }
  100% { opacity: 1; transform: scaleY(1); background: var(--bar-filled); }
}
@keyframes popBlockEmpty {
  0%   { opacity: 0; transform: scaleY(0.3); }
  100% { opacity: 1; transform: scaleY(1); background: var(--bar-empty); }
}
```

Blocks are 48px tall, share `flex: 1` in a 3px-gap flex row. Filled blocks pop-in via `popBlock` (grey → white/black overshoot 1.1× → settle at 1×). Empty blocks fade-in via `popBlockEmpty`. On hover any single block scales 1.5× wide × 1.3× tall and turns cool blue `#4A90E2` with a soft blue glow — makes the bar feel interactive.

---

## JS — number counter + block stagger + 3D tilt + theme toggle

Paste as one `<script>` at the end of `<body>`:

```js
let counterInterval;

function playAnimations() {
  // 1. Number counter: 0% → 66%
  const percentEl = document.querySelector('.percent');
  const target = 66;
  let current = 0;
  percentEl.innerText = '0%';
  clearInterval(counterInterval);
  setTimeout(() => {
    counterInterval = setInterval(() => {
      current += 2;
      percentEl.innerText = current + '%';
      if (current >= target) {
        percentEl.innerText = target + '%';
        clearInterval(counterInterval);
      }
    }, 25);
  }, 400);                                          // wait for card entrance

  // 2. Reset all CSS animations so they replay
  const resetEls = document.querySelectorAll('.card, .title-row, .subtitle, .divider, .stats-row');
  resetEls.forEach(el => el.style.animation = 'none');
  const blocks = document.querySelectorAll('.block');
  blocks.forEach(b => b.style.animation = 'none');
  void document.body.offsetHeight;                   // force reflow to restart
  resetEls.forEach(el => el.style.animation = '');

  // 3. Staggered block pop-in
  blocks.forEach((block, i) => {
    const isFilled = block.classList.contains('filled');
    block.style.animation = `${isFilled ? 'popBlock' : 'popBlockEmpty'} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
    block.style.animationDelay = `${0.6 + (i * 0.03)}s`;
  });
}
playAnimations();

// 3D tilt on mouse-move (max ±6 deg)
const card = document.querySelector('.card');
card.addEventListener('mousemove', (e) => {
  const r = card.getBoundingClientRect();
  const rx = ((e.clientY - r.top - r.height/2) / (r.height/2)) * -6;
  const ry = ((e.clientX - r.left - r.width/2) / (r.width/2))  *  6;
  card.style.transform  = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  card.style.boxShadow  = `${-ry}px ${rx}px 40px var(--card-shadow-start)`;
});
card.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  card.style.boxShadow = '0 10px 40px var(--card-shadow-end)';
});

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
  const root = document.documentElement;
  if (root.getAttribute('data-theme') === 'light') {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
  playAnimations();                                 // replay entrance in new theme
});
```

Choreography timing (do not change):
- Card fades/rises in over 0.8s
- Title row 0.1s in, subtitle 0.2s, divider 0.3s (`scaleX(0→1)`), stats row 0.4s
- Number counter starts at 400ms and reaches 66% in ~825ms (33 ticks × 25ms)
- First block pops at 600ms, +30ms per block → last block pops at `600 + 29×30 = 1470ms`

---

## Responsive

- **≥ 500px** — card is fixed at **460px wide** as designed.
- **≤ 500px (mobile)**: shrink the card to `width: calc(100vw - 32px)`, keep 24px padding, drop percent to 28px, drop title to 14px, reduce bar height to `40px` and gap to `2px`. Theme toggle moves to `top: 20px; right: 20px; width: 40px; height: 40px`.
  ```css
  @media (max-width: 500px) {
    .card { width: calc(100vw - 32px); padding: 20px; }
    h2 { font-size: 14px; }
    .subtitle { font-size: 12px; }
    .percent { font-size: 28px; }
    .segmented-bar { height: 40px; gap: 2px; }
    .theme-toggle { top: 20px; right: 20px; width: 40px; height: 40px; }
  }
  ```
- **Touch** — the 3D tilt uses `mousemove`; on touch devices the card simply stays flat, which is desired (no jitter). No further changes needed.
- **`prefers-reduced-motion: reduce`** — kill all keyframe animations + the number counter delay:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .card, .title-row, .subtitle, .divider, .stats-row, .block {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
  ```
  In JS, also short-circuit the counter to jump straight to 66%.
- Test in DevTools at 375, 460, 640, 1024, 1440.

---

## Deliverable checklist (all must be true)

- [ ] Theme toggle sits absolute top-right, 48×48 circle, sun visible in dark mode, moon in light mode, one rotates + fades as they swap.
- [ ] Theme persists to `localStorage.theme` and applies before first paint via inline `<head>` script — no flash of wrong colors on reload.
- [ ] Card is exactly **460px wide**, `border-radius: 12px`, `padding: 24px`.
- [ ] Card fades + rises + scales from 40px/0.95 on load over 0.8s.
- [ ] Title reads `Progress Indicator` (15/500). Three-dot menu at 3px dots, hovering grows the gap to 5px and shifts dot color from muted to main.
- [ ] Subtitle reads exactly `You are on track to finish the goal three days early` in muted color.
- [ ] Divider scales in from left over 0.8s at 0.3s delay.
- [ ] Percent number counts **0% → 66%** with `+2` per 25ms tick, starting 400ms after load.
- [ ] Badge shows an inline "up-and-right arrow" SVG + `30%`. Hover translates the SVG `+2, -2` px with a springy cubic-bezier.
- [ ] `vs. the last period` in muted 13px.
- [ ] Segmented bar has **exactly 30 blocks — 20 filled first, 10 empty after**. Bar is 48px tall with 3px gap.
- [ ] Blocks pop in one-by-one starting at 600ms, +30ms stagger, with an overshoot to `scaleY(1.1)`, using `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- [ ] Any single block hovered scales to `scaleY(1.3) scaleX(1.5)`, turns cool-blue `#4A90E2`, and glows via `box-shadow: 0 0 10px rgba(74,144,226,0.5)`.
- [ ] Card tilts up to ±6° X/±6° Y on `mousemove` and returns to flat on `mouseleave`. Box-shadow tracks the tilt direction.
- [ ] Toggling theme replays the entrance choreography (counter, block stagger, fadeUp) in the new theme.
- [ ] `prefers-reduced-motion: reduce` disables all animations and jumps the counter to 66% immediately.
- [ ] No console errors, no layout shift, no visual flash on theme reload.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue045
