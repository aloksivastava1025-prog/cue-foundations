# Sticker Collage Peel Footer — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Fits a Gen-Z-facing creative agency or youth brand site where the closing footer needs to feel like a playful sticker-sheet payoff after the scroll.

---

# Truus Gen-Z Footer Reveal — Scroll-Peel Footer with Sticker Collage + Kinetic Letters

> **This is an ADDITION to my existing project. DO NOT create a new HTML file. DO NOT overwrite my current `<body>`, `<html>`, or global styles.**
> Insert the whole scroll-reveal shell (main content + spacer + fixed footer) at the spot I mark. If Google Fonts are already loaded, extend the URL — don't duplicate. Namespace new class names to avoid collisions.

Build a pixel-perfect **Gen-Z sticker-collage footer** — a signature agency-style peel-reveal. Main content covers the viewport with a "scroll down" prompt; as user scrolls, the main content peels UP and reveals a fixed blue footer beneath, filled with 6 hand-drawn CSS stickers (BAM starburst, smiley face, sparkle heart, praying hands, pink 100, camera), a **giant handwritten "footer" wordmark** in Pacifico that letter-pops in with a springy overshoot when in view, and 3 pill-tagged contact columns. Zero libraries.

Award-winning collage energy, pure HTML + CSS + vanilla JS.

---

## FRAMEWORK

- Plain **HTML + CSS + vanilla JS**. No React, no libraries.
- 2 Google Fonts: **Inter** (weights 500 / 700 / 900) + **Pacifico** (script for the giant background wordmark).
- 6 stickers built entirely with CSS `clip-path`, `border-radius`, and pseudo-elements — no icon library, no images.

---

## ASSETS

Fonts only:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700;900&family=Pacifico&display=swap" rel="stylesheet">
```

No images. Every sticker + graphic is pure CSS + optional inline SVG (heart only).

---

## DESIGN TOKENS

```css
:root {
  --bg-beige: #ffffff;       /* main content bg */
  --truus-blue: #4d66f0;     /* footer bg */
  --text-black: #111111;
  --text-white: #ffffff;

  /* Sticker palette */
  --st-orange: #ff5722;
  --st-pink:   #eb8ba6;
  --st-maroon: #8b1e3f;
  --st-green:  #1a644c;
}
body, html {
  margin: 0; padding: 0;
  background-color: var(--bg-beige);
  font-family: 'Inter', -apple-system, sans-serif;
  color: var(--text-black);
  overflow-x: hidden;
}
```

---

## SECTION 1 — Scroll-reveal architecture (3 layers)

The scroll-peel effect is a **fixed footer sitting behind the main content**, revealed as the main content scrolls off:

```html
<div class="main-content"><!-- covers 100vh, scrolls up --></div>
<div class="footer-spacer" id="footerSpacer"></div>
<div class="footer-fixed-wrapper">
  <footer class="footer"><!-- fixed, revealed as main-content peels off --></footer>
</div>
```

```css
.main-content {
  background-color: var(--bg-beige);
  min-height: 100vh;
  position: relative;
  z-index: 10;                                           /* sits ON TOP of the footer */
  padding-bottom: 50px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);               /* peel-edge shadow */
}
.footer-spacer {
  height: 100vh;                                         /* must match .footer-fixed-wrapper */
  pointer-events: none;
}
.footer-fixed-wrapper {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 1;                                            /* sits BEHIND main content */
  height: 100vh;
  background-color: var(--bg-beige);
  display: flex; flex-direction: column;
}
```

**How it works**:
- `.main-content` is `position: relative` and takes `min-height: 100vh` — sits on top of the fixed footer via `z-index: 10`
- `.footer-fixed-wrapper` is `position: fixed; bottom: 0` and fills the viewport — but hidden behind main-content until user scrolls
- `.footer-spacer` adds 100vh of scroll runway AFTER the main content, so the browser has something to scroll before hitting the bottom
- As user scrolls, `.main-content` moves UP out of view → the fixed footer becomes visible from below

The `border-bottom` + `box-shadow` on `.main-content` creates the illusion that main-content is a paper flap peeling upward.

---

## SECTION 2 — Navbar (inside main-content, scrolls away with it)

```html
<div class="main-content">
  <div class="navbar">…</div>
  <div class="scroll-prompt">scroll down</div>
</div>
```

```css
.navbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 30px 40px;
  font-weight: 900; font-size: 24px; letter-spacing: -1px;
}
.nav-logo-left { display: flex; align-items: center; position: relative; }
.nav-logo-left .starburst {
  position: absolute; left: -15px; top: -5px; z-index: -1;
  width: 30px; height: 30px; background: var(--st-orange);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
.nav-logo-center { font-family: 'Pacifico', cursive; font-size: 32px; letter-spacing: 0; }
.nav-icon-right {
  width: 28px; height: 28px;
  background: var(--text-black); border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  color: var(--bg-beige); font-size: 14px;
}

.scroll-prompt {
  display: flex; justify-content: center; align-items: center;
  height: 100vh;
  font-size: 16px; font-weight: 500;
  opacity: 0.4; text-align: center; text-transform: lowercase;
}
```

The `polygon()` with 10 vertices creates a 10-point starburst — reused for the BAM sticker and the yellow camera burst too.

---

## SECTION 3 — Footer container (rounded blue card, 3-column top + bottom canvas)

```css
.footer {
  background-color: var(--truus-blue);
  border-radius: 32px;
  padding: 60px 40px;
  color: var(--text-white);
  position: relative;
  flex: 1;
  margin: 40px 6px 6px 6px;                              /* 40 top / 6 sides + bottom */
  box-sizing: border-box;
  overflow: hidden;
  display: flex; flex-direction: column;
}
```

Rounded 32px corners + a 40/6/6/6 margin so the blue card feels like a printed sticker sheet resting inside a beige page.

### 3-column contact strip (top of footer)

```html
<div class="footer-top">
  <div class="col">
    <div class="pill">start a project</div>
    <h2>let's build something amazing together</h2>
  </div>
  <div class="col">
    <div class="pill">location</div>
    <p>123 Creative Street</p>
    <p>Design District, NY 10001</p>
    <div class="link-underline">Google Maps</div>
  </div>
  <div class="col">
    <div class="pill">say hello</div>
    <p>hello@youragency.com</p>
    <p>slide into our DMs*</p>
    <div class="subtext">*we're allergic to phone calls. just text us.</div>
    <div class="social-icons">
      <div class="social-icon">in</div>
      <div class="social-icon">ig</div>
      <div class="social-icon">tk</div>
    </div>
  </div>
</div>
```

```css
.footer-top {
  display: flex; justify-content: space-between; align-items: flex-start;
  z-index: 20; position: relative;
}
.col { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }

.pill {
  background: #fff;
  color: var(--text-black);
  font-size: 14px; font-weight: 800;
  padding: 8px 16px;
  border-radius: 20px;
  margin-bottom: 20px;
}
.col h2, .col p {
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 800;
  margin: 0; line-height: 1.2;
  letter-spacing: -0.5px;
}
.link-underline {
  font-size: 16px; font-weight: 500; margin-top: 20px;
  text-decoration: underline; text-underline-offset: 4px; cursor: pointer;
}
.subtext { font-size: 11px; font-weight: 500; margin-top: 15px; opacity: 0.9; }

.social-icons { display: flex; gap: 10px; margin-top: 15px; }
.social-icon {
  width: 28px; height: 28px;
  border: 2px solid var(--text-white);
  border-radius: 5px;
  display: flex; justify-content: center; align-items: center;
  font-size: 12px; font-weight: bold;
}
```

Every column starts with a **white pill tag** in bold 14px uppercase-ish (`start a project` / `location` / `say hello`), then bold 20–28px content that scales fluidly with viewport.

Exact copy — do not paraphrase:
- Col 1 pill: `start a project` / heading: `let's build something amazing together`
- Col 2 pill: `location` / lines: `123 Creative Street` + `Design District, NY 10001` / link: `Google Maps`
- Col 3 pill: `say hello` / lines: `hello@youragency.com` + `slide into our DMs*` / subtext: `*we're allergic to phone calls. just text us.` / social: `in / ig / tk`

---

## SECTION 4 — Giant "footer" background wordmark (letter-pop reveal)

```html
<div class="footer-bottom">
  <div class="giant-text" id="giantText">
    <span>f</span><span>o</span><span>o</span><span>t</span><span>e</span><span>r</span>
  </div>
  <!-- 6 stickers below -->
</div>
```

```css
.footer-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0; top: 0;
  pointer-events: none;                                  /* let clicks pass through */
  overflow: hidden;
}

.giant-text {
  position: absolute;
  bottom: -5vw;
  left: 50%;
  transform: translateX(-50%) rotate(-4deg);
  font-family: 'Pacifico', cursive;
  font-size: 32vw;                                       /* scales with viewport */
  color: var(--bg-beige);
  line-height: 1;
  white-space: nowrap;
  z-index: 1;
  letter-spacing: -2vw;
  -webkit-font-smoothing: antialiased;
}

.giant-text span {
  display: inline-block;
  opacity: 0;
  transform: translateY(100px) scale(0.8) rotate(10deg);
  transition:
    opacity 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.giant-text.visible span {
  opacity: 1;
  transform: translateY(0) scale(1) rotate(0);
}
/* Stagger delay per letter — 0.1s each */
.giant-text.visible span:nth-child(1) { transition-delay: 0.0s; }
.giant-text.visible span:nth-child(2) { transition-delay: 0.1s; }
.giant-text.visible span:nth-child(3) { transition-delay: 0.2s; }
.giant-text.visible span:nth-child(4) { transition-delay: 0.3s; }
.giant-text.visible span:nth-child(5) { transition-delay: 0.4s; }
.giant-text.visible span:nth-child(6) { transition-delay: 0.5s; }
```

**32vw font-size** is huge — each letter is ~32% of viewport width. `bottom: -5vw` lets the text bleed off the bottom edge. `-4deg` rotation gives it a hand-tossed feel. `letter-spacing: -2vw` tightens the script letters into a proper cursive flow.

Each letter starts at `translateY(100px) scale(0.8) rotate(10deg) opacity: 0` and springs into place on `.visible` with a 0.8s springy overshoot cubic-bezier. Staggered 0.1s per letter = ~0.5s total reveal.

### JS trigger via IntersectionObserver

```js
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.getElementById('giantText').classList.add('visible');
      } else {
        document.getElementById('giantText').classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });
  observer.observe(document.getElementById('footerSpacer'));
});
```

The observer watches the invisible `.footer-spacer` — as it comes into view (i.e. user has scrolled far enough to see the footer beneath the main content), the giant text triggers. Scrolling back up removes `.visible`, so the letters re-pop next time.

---

## SECTION 5 — 6 hand-drawn CSS stickers

All stickers share:
```css
.sticker {
  position: absolute;
  z-index: 5;
  pointer-events: auto;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.sticker:hover { transform: scale(1.15) rotate(5deg); }
```

Every sticker hovers with a springy 1.15× scale + 5° tilt.

### 1. Orange BAM starburst (bottom-left)

```html
<div class="sticker st-bam"><span>BAM</span></div>
```

```css
.st-bam {
  bottom: 8%; left: 3%;
  width: 100px; height: 100px;
  background: var(--st-orange);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  display: flex; justify-content: center; align-items: center;
  transform: rotate(-15deg);
}
.st-bam span {
  color: var(--text-white); font-weight: 900; font-size: 22px;
  transform: rotate(15deg);                              /* counter-rotate so text is upright */
}
```

10-point starburst via `clip-path: polygon(...)` — identical geometry to nav logo.

### 2. Blue smiley (mid-left)

Face + 2 eye pseudo-elements + a `.smile` div:

```css
.st-smiley {
  bottom: 25%; left: 22%;
  width: 90px; height: 90px;
  background: #8fa5f2;
  border-radius: 50%;
  border: 4px solid var(--bg-beige);
}
.st-smiley::before, .st-smiley::after {
  content: ''; position: absolute; top: 25px;
  width: 10px; height: 18px;
  border: 3px solid var(--bg-beige); border-radius: 50%;
  border-bottom: 0;                                      /* upper half of oval → eye */
}
.st-smiley::before { left: 20px; }
.st-smiley::after  { right: 20px; }
.st-smiley .smile {
  position: absolute; bottom: 15px; left: 15px; right: 15px; height: 35px;
  border: 3px solid var(--bg-beige); border-top: 0;
  border-radius: 0 0 40px 40px;                          /* lower semicircle → mouth */
}
```

The `border-top: 0` on `.smile` and `border-bottom: 0` on the eyes turn full ovals into half-arcs — CSS-only smiley.

### 3. Maroon sparkle heart (center) — SVG

```html
<div class="sticker st-heart">
  <svg viewBox="0 0 100 100">
    <path d="M50,90 Q50,90 20,60 A20,20 0 0,1 50,30 A20,20 0 0,1 80,60 Q80,60 50,90 Z"
          fill="#8b1e3f" stroke="#f4efe9" stroke-width="4"/>
    <path d="M20,20 L25,10 L30,20 L40,25 L30,30 L25,40 L20,30 L10,25 Z" fill="#f4efe9"/>
    <path d="M80,30 L83,20 L86,30 L96,33 L86,36 L83,46 L80,36 L70,33 Z"
          fill="#f4efe9" transform="scale(0.6) translate(50, -10)"/>
  </svg>
</div>
```

```css
.st-heart { bottom: 12%; left: 45%; width: 90px; height: 80px; transform: rotate(10deg); }
.st-heart svg { width: 100%; height: 100%; }
```

Maroon heart + 2 white 8-point sparkle stars via SVG polygons.

### 4. Green praying hands with inner heart

```html
<div class="sticker st-hands"><div class="inner-heart"></div></div>
```

```css
.st-hands {
  bottom: 3%; left: 55%;
  width: 90px; height: 70px;
  background: var(--st-green);
  border-radius: 40px;
  border: 4px solid var(--bg-beige);
  transform: rotate(-10deg);
  display: flex; justify-content: center; align-items: center;
}
.st-hands .inner-heart {
  width: 25px; height: 25px;
  border: 3px solid var(--bg-beige);
  transform: rotate(45deg);
  border-radius: 50% 50% 0 0;
  border-bottom: 0; border-left: 0;
  margin-top: 10px;
}
.st-hands .inner-heart::before {
  content: ''; position: absolute;
  width: 25px; height: 25px;
  border: 3px solid var(--bg-beige);
  border-radius: 50% 50% 0 0; border-bottom: 0; border-right: 0;
  top: -3px; left: -22px;
}
```

Pill-shaped green body + rotated square with asymmetric borders + `::before` mirror = heart shape drawn purely from border geometry.

### 5. Pink 100

```css
.st-100 {
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
```

Just says `100` in bold italic maroon on pink card.

### 6. Black camera with yellow burst

```html
<div class="sticker st-camera">
  <div class="lens"></div>
  <div class="flash"></div>
</div>
```

```css
.st-camera {
  bottom: 10%; right: 10%;
  width: 90px; height: 70px;
  background: var(--text-black);
  border-radius: 15px;
  border: 4px solid var(--bg-beige);
  transform: rotate(15deg);
}
.st-camera .lens {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 35px; height: 35px;
  border: 3px solid var(--bg-beige); border-radius: 50%;
}
.st-camera .flash {
  position: absolute; top: 10px; right: 15px;
  width: 10px; height: 10px;
  background: var(--bg-beige); border-radius: 2px;
}
.st-camera::before {
  content: ''; position: absolute; top: -30px; left: -20px;
  width: 50px; height: 50px; background: #f1c40f;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  z-index: -1; transform: rotate(-20deg);
}
```

Camera body + lens + flash + yellow starburst peeking from the top-left via `::before`.

### Credits chip (tiny badge peeking bottom-right)

```css
.st-credits {
  bottom: 15px; right: -5px;                             /* peeks out of the card edge */
  background: var(--text-black); color: var(--text-white);
  font-size: 11px; font-weight: bold; padding: 6px 12px; border-radius: 12px;
}
```

---

## Responsive

- **≥ 900px** — as spec above.
- **≤ 900px** — footer columns stack:
  ```css
  @media (max-width: 900px) {
    .footer-top { flex-direction: column; gap: 32px; }
    .col { align-items: flex-start; }
  }
  ```
- **≤ 600px** — shrink stickers by 20%:
  ```css
  @media (max-width: 600px) {
    .sticker { transform: scale(0.8) rotate(var(--rot, 0deg)); }
    .footer { padding: 40px 24px; }
    .giant-text { font-size: 40vw; }
  }
  ```
- **Touch** — hover-only sticker scale still works on tap-and-hold. Optional: add `:active` copy of the hover state for immediate touch feedback.
- **`prefers-reduced-motion: reduce`**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .giant-text span { transition: none !important; opacity: 1 !important; transform: none !important; }
    .sticker { transition: none !important; }
  }
  ```
- Test at 375, 600, 900, 1024, 1440.

---

## Deliverable checklist (all must be true)

- [ ] Body has 2 fonts loaded: Inter (500/700/900) + Pacifico via one Google Fonts URL.
- [ ] Body `overflow-x: hidden`, `--bg-beige: #ffffff`, `--truus-blue: #4d66f0` set as CSS vars.
- [ ] `.main-content` is `position: relative; z-index: 10; min-height: 100vh;` with `border-bottom: 1px` hairline + `0 10px 30px` peel shadow.
- [ ] `.footer-spacer` = 100vh, non-interactive.
- [ ] `.footer-fixed-wrapper` = `position: fixed; bottom: 0; z-index: 1; height: 100vh;` with beige bg — sits BEHIND main content.
- [ ] Navbar inside main-content: left orange 10-point starburst logo (`clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)`), center Pacifico script wordmark, right dark round icon.
- [ ] Scroll-prompt = `scroll down` lowercase, 40% opacity, centered in 100vh.
- [ ] Footer inside `.footer-fixed-wrapper`: `--truus-blue` bg, 32px radius, 40/6/6/6 margin, `overflow: hidden`.
- [ ] Top section = 3 flex columns. Each column starts with a white 8-16 padded `.pill` (`start a project`, `location`, `say hello`) then bold `clamp(20px, 2.5vw, 28px)` content.
- [ ] Column 3 has `.subtext` at 11/500/opacity 0.9 for the phone-call disclaimer, plus 3 square `.social-icon` (28×28, 5px radius, 2px white border).
- [ ] `.footer-bottom` absolutely covers the footer with `pointer-events: none` so clicks pass through to stickers only.
- [ ] Giant Pacifico wordmark: 32vw font-size, `bottom: -5vw`, translated -50% X, rotated `-4deg`, `letter-spacing: -2vw`, `color: var(--bg-beige)`.
- [ ] Each letter (6 spans: `f-o-o-t-e-r`) starts at `opacity: 0; translateY(100px) scale(0.8) rotate(10deg)` and springs to `1 / 0 / 1 / 0deg` on `.visible` via 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275).
- [ ] Per-letter transition-delay staggered 0.1s each (0 → 0.5s).
- [ ] IntersectionObserver watches `.footer-spacer` at threshold 0.1 → toggles `.visible` on `#giantText` when entering/leaving.
- [ ] 6 sticker positions exact:
  - BAM orange starburst — `bottom: 8%; left: 3%; rotate(-15deg)`, text inside `rotate(15deg)` to counter
  - Blue smiley — `bottom: 25%; left: 22%`, 90×90 circle with 4px beige border, eyes via pseudo-elements, `.smile` div for mouth
  - Maroon heart — `bottom: 12%; left: 45%`, inline SVG heart path + 2 sparkle polygons
  - Green praying hands — `bottom: 3%; left: 55%; rotate(-10deg)`, inner heart made from 2 rotated squares with asymmetric border-radius
  - Pink 100 — `bottom: 30%; right: 25%; rotate(-15deg)`, italic 38px maroon on pink
  - Black camera — `bottom: 10%; right: 10%; rotate(15deg)`, lens circle + flash rectangle + `::before` yellow starburst peeking top-left
- [ ] Every sticker has `transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)` and `:hover { transform: scale(1.15) rotate(5deg); }`.
- [ ] `.st-credits` peeks out with `right: -5px` — dark chip with white "credits" text at 11/bold.
- [ ] Responsive: columns stack ≤ 900px, sticker/text scale-down ≤ 600px.
- [ ] `prefers-reduced-motion: reduce` disables letter pop + sticker hover transitions.
- [ ] No console errors, scroll-reveal reads as a paper flap peeling up over a printed sticker sheet.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue062
