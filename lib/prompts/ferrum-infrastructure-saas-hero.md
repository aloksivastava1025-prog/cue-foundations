# Ferrum Infrastructure SaaS Hero — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** An infrastructure SaaS product marketing site's above-the-fold hero, where the scroll-into-content card transition signals depth and reliability to engineers evaluating the platform.

---

# Ferrum — Metallic Blue Hero + Card-Reveal Content Layer

> **This is an ADDITION to my existing project. DO NOT create a new HTML file. DO NOT overwrite my current `<body>`, `<html>`, or global styles.**
> Insert this into my current HTML at the spot I choose. If Tailwind is already loaded — reuse it. If Google Fonts are already imported — extend, don't duplicate. Reuse existing CDN imports (Tailwind, Lenis). Namespace any new classes so they don't collide.

Build a pixel-perfect landing hero for an infrastructure SaaS called **Ferrum**. Two layers in one flow: a full-viewport fixed hero on a metallic steel-blue background, and a soft-grey rounded content card that scrolls up over it revealing intro copy, dual CTAs, a mission block, and a 4-column stat strip. Every character of the H1 blur-reveals on load; every word of the intro + mission reveals as the reader scrolls into it. All non-nav CTAs are **square-cornered pills (4px radius)** — no fully-rounded pills.

Award-winning polish is non-negotiable — every value below is exact, not "roughly".

---

## FRAMEWORK

- Plain **HTML + Tailwind (CDN)** + vanilla JS. No React. No frameworks.
- `Inter` font (weights 400, 500, 600) via Google Fonts.
- **Lenis** for smooth scroll (via unpkg CDN).
- No other libraries.

---

## ASSETS (use these exact URLs — no placeholders)

Fonts + Lenis (skip if already loaded):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js"></script>
```

Avatar images for the trust row:

- `https://i.pravatar.cc/100?img=32`
- `https://i.pravatar.cc/100?img=47`
- `https://i.pravatar.cc/100?img=12`

No other external assets — logo, dots, and icons are all inline SVG or pure CSS.

---

## DESIGN TOKENS (paste verbatim)

```css
:root {
  --steel-1: #3E82DB;
  --steel-2: #2D6CCB;
  --steel-3: #1F55A9;
  --ink:     #193969;
  --ink-2:   #112A52;
  --mint:    #B1F2D1;
  --grey-1:  #F3F4F6;
  --grey-2:  #EAEBE8;
  --grey-3:  #D8D9D5;
  --hairline:#193969; /* used at /10 opacity */
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
html, body { font-family: 'Inter', system-ui, sans-serif; }
body { -webkit-font-smoothing: antialiased; font-feature-settings: "cv02","cv11"; }
```

Tailwind config extension:

```html
<script>
  tailwind.config = {
    theme: { extend: { fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] } } }
  };
</script>
```

---

## SECTION 1 — Fixed metallic hero (`.hero-bg`)

`85vh` tall, fixed at top, `z-0`. Layered background that reads as **brushed steel-blue with a moving light sweep**.

```css
.hero-bg {
  position: relative;
  background:
    /* 1. top highlight bloom */
    radial-gradient(1400px 700px at 50% -5%, rgba(255,255,255,0.22), transparent 60%),
    /* 2. side vignettes (darkens the edges like a curved metal cylinder) */
    linear-gradient(90deg, rgba(0,0,0,0.22) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.22) 100%),
    /* 3. horizontal brushed-metal tonal bands */
    linear-gradient(180deg,
      rgba(255,255,255,0.10) 0%,
      rgba(255,255,255,0.02) 12%,
      rgba(0,0,0,0.06) 32%,
      rgba(255,255,255,0.06) 55%,
      rgba(0,0,0,0.10) 78%,
      rgba(0,0,0,0.18) 100%),
    /* 4. soft vertical stripe grating (kept from source) */
    repeating-linear-gradient(90deg,
      transparent, transparent 79px,
      rgba(255,255,255,0.055) 79px, rgba(255,255,255,0.055) 80px),
    /* 5. base steel-blue gradient */
    linear-gradient(180deg, #3E82DB 0%, #2D6CCB 45%, #1F55A9 100%);
  background-blend-mode: normal, normal, overlay, normal, normal;
}

/* diagonal shimmer sweep — like light catching moving metal */
.hero-bg::before {
  content: '';
  position: absolute; inset: -20% -10%;
  background: linear-gradient(105deg,
    transparent 42%,
    rgba(255,255,255,0.10) 49%,
    rgba(255,255,255,0.20) 50%,
    rgba(255,255,255,0.10) 51%,
    transparent 58%);
  filter: blur(4px);
  animation: metal-sweep 9s cubic-bezier(0.6,0,0.4,1) infinite;
  mix-blend-mode: overlay;
  pointer-events: none; z-index: 0;
}
/* fine 3px vertical brushed-noise grain */
.hero-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(90deg,
    rgba(255,255,255,0.020) 0px, rgba(255,255,255,0.020) 1px,
    transparent 1px, transparent 3px);
  mix-blend-mode: overlay;
  pointer-events: none; z-index: 0; opacity: 0.9;
}
@keyframes metal-sweep {
  0%   { transform: translateX(-60%) skewX(-8deg); opacity: 0; }
  30%  { opacity: 0.9; }
  70%  { opacity: 0.9; }
  100% { transform: translateX(60%)  skewX(-8deg); opacity: 0; }
}
.hero-bg > * { position: relative; z-index: 1; }
```

### 1a. Header (inside `.hero-bg`, absolute top)

- Container: `absolute top-0 left-0 right-0 max-w-[1360px] mx-auto px-8 py-7 flex justify-between items-center`.
- **Logo** (left): `<div class="text-white text-[22px] font-medium tracking-[-0.04em] lowercase">ferrum<span class="text-[#B1F2D1]">.</span></div>`
- **Nav** (center, hidden < md): `gap-8 text-white/90 font-medium text-[13px] tracking-[-0.005em]` — links **Platform · Solutions · Docs · Changelog** with `hover:text-white transition-colors`.
- **CTA button** (right):
  ```html
  <button class="btn-pill group bg-white text-[#193969] pl-[6px] pr-[16px] py-[6px]
    rounded-[4px] text-[10.5px] font-semibold tracking-[0.18em]
    flex items-center gap-[10px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-shadow">
    <span class="w-[26px] h-[26px] bg-[#F1F3F0] rounded-[3px] flex items-center justify-center">
      <svg class="btn-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </span>
    GET ACCESS
  </button>
  ```

CTAs use **`rounded-[4px]`**, not `rounded-full`.

### 1b. Hero content

Centered, `flex-grow flex flex-col items-center justify-center pt-6 px-4 w-full`.

- **Micro-label** above H1 — `flex items-center gap-[10px] text-[10px] font-semibold tracking-[0.24em] uppercase text-white/70` with a 5×5 mint-green `.dot-glow`:
  > `Ferrum Platform · Production-ready`
- **H1**:
  ```html
  <h1 id="hero-title" class="text-[44px] md:text-[64px] lg:text-[72px] leading-[1.02]
    tracking-[-0.035em] text-white font-normal text-center max-w-[880px]">
    Infrastructure without<br/><span class="text-white/85">the surprises.</span>
  </h1>
  ```
  Weight **400** (not bold), line-height 1.02, letter-spacing `-0.035em`. Second line is `text-white/85` — the same Inter, just a whisper softer, no italic serif.
- **Trust row** (below H1, ~26px gap): 3 overlapping avatars (`-space-x-2`, each `w-6 h-6 rounded-full border-2 border-[#2D6CCB] object-cover`) + text:
  > `Shipped by engineering teams at 200+ startups`

### 1c. Mint-green glow dot utility

```css
.dot-glow {
  background: #B1F2D1;
  box-shadow: 0 0 8px rgba(177,242,209,0.7);
  border-radius: 999px;
}
```

---

## SECTION 2 — Scrollable content card (`.content-card`)

- Container: `relative z-10 w-full` holds a **spacer** (`w-full h-[85vh] pointer-events-none`) that lets the fixed hero show through, then the card.
- The card:
  ```html
  <main class="content-card relative w-full bg-[#F3F4F6]
    rounded-t-[40px] md:rounded-t-[56px] pb-40 overflow-hidden">
  ```
- Custom shadow (top layered edge highlight, feels like a card lifted over the hero):
  ```css
  .content-card {
    box-shadow: 0 -30px 80px rgba(0,0,0,0.18),
                0 -2px 0 rgba(255,255,255,0.5) inset;
  }
  ```
- Two mint dots pinned at the top-inside corners:
  ```html
  <div class="absolute top-9 left-9 md:top-12 md:left-12 w-[5px] h-[5px] rounded-full dot-glow"></div>
  <div class="absolute top-9 right-9 md:top-12 md:right-12 w-[5px] h-[5px] rounded-full dot-glow"></div>
  ```

### 2a. Intro section (`flex flex-col items-center text-center pt-[110px] pb-[80px] px-8`)

- Uppercase micro-label with mint dot: `Our mission` — same style as hero micro-label but ink-colored (`text-[#193969]/60`).
- **Intro H2** (`id="intro-text"`):
  ```html
  <h2 id="intro-text" class="text-[24px] md:text-[38px] leading-[1.28] text-[#193969] font-normal tracking-[-0.02em]">
    ferrum is the infrastructure layer startups shouldn't have to think about — queues, caches, jobs, and observability that ship durable, secure, and predictable from your first deploy.
  </h2>
  ```
  Max-width 1000px, centered.
- **Sub-copy** below: `text-[#193969]/85 text-[15.5px] md:text-[17px] font-medium max-w-[560px] leading-[1.55]`:
  > `One platform. All the plumbing. Focus on your product — we'll handle the on-call.`
- **Two CTAs** in a row (`flex flex-col sm:flex-row gap-[10px]`), both **4px corner radius**:

  Primary (`START BUILDING`):
  ```html
  <button class="btn-pill group bg-[#193969] text-white pl-[6px] pr-[22px] py-[6px]
    rounded-[4px] text-[11px] font-semibold tracking-[0.18em]
    flex items-center gap-[12px] hover:bg-[#112a52] transition-colors">
    <span class="w-[30px] h-[30px] bg-white/15 rounded-[3px] flex items-center justify-center">
      <svg class="btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="9"></circle>
        <circle cx="12" cy="12" r="3.5"></circle>
      </svg>
    </span>
    START BUILDING
  </button>
  ```

  Secondary (`READ THE DOCS`) — same shape, `bg-[#EAEBE8] text-[#193969]`, icon SVG is the "browser window" glyph, hover `bg-[#d8d9d5]`.

  Icon inside each CTA glides right on hover:
  ```css
  .btn-pill .btn-arrow { transition: transform 0.4s var(--ease-expo); }
  .btn-pill:hover .btn-arrow { transform: translateX(3px); }
  ```

### 2b. Hairline divider with corner dots (repeats between sections)

```html
<div class="relative w-full px-12 md:px-24 my-8">
  <div class="w-full h-[1px] bg-[#193969]/10"></div>
  <div class="absolute top-1/2 -translate-y-1/2 left-12 md:left-24 w-[4px] h-[4px] rounded-full dot-glow"></div>
  <div class="absolute top-1/2 -translate-y-1/2 right-12 md:right-24 w-[4px] h-[4px] rounded-full dot-glow"></div>
</div>
```

### 2c. Mission section (2-column, label LEFT + copy RIGHT)

- Container: `flex flex-col md:flex-row justify-between items-start py-[96px] px-12 md:px-24 gap-12 md:gap-20 max-w-[1360px] mx-auto`.
- Left column: small icon (two overlapping circles SVG, stroke 1.3) + uppercase label — text-10, tracking-0.24em:
  > `ENGINEERING FIRST`
- Right column, **mission `<p id="mission-text">`**:
  ```html
  <p id="mission-text" class="text-[#193969] text-[19px] md:text-[24px]
    leading-[1.45] max-w-[850px] font-normal tracking-[-0.015em]">
    We build the layer between your code and the cloud. From queues to caches to observability, Ferrum ships production-grade infrastructure through a single config file — so your team spends its time on features, not on 2am pages.
  </p>
  ```

### 2d. Stats strip (4 columns)

```html
<section class="max-w-[1360px] mx-auto px-12 md:px-24 py-[72px]">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
    <!-- repeat 4 blocks: -->
    <div class="rise" data-delay="0">
      <div class="text-[36px] md:text-[44px] font-normal tracking-[-0.03em] text-[#193969] leading-none">200+</div>
      <div class="mt-2 text-[12px] text-[#193969]/60 leading-[1.4] max-w-[130px]">startups shipping on Ferrum</div>
    </div>
    <!-- ...delays 90, 180, 270 -->
  </div>
</section>
```

Four stats in this exact order:
1. **200+** — startups shipping on Ferrum
2. **14B** — jobs processed monthly
3. **18** — regions with sub-40ms edge
4. **99.99%** — SLA across every region

---

## ANIMATIONS (this is what pushes it past "clean" into "awarded")

### A. Character-by-character reveal on H1

Every non-space character of the hero H1 is wrapped in `<span class="char">…</span>`, then all `.char` receive `.on` after a 60ms delay. Each char has its own `transition-delay` stepping by 22ms.

```css
.char {
  display: inline-block;
  opacity: 0;
  transform: translateY(14px);
  filter: blur(8px);
  transition:
    opacity 0.7s var(--ease-expo),
    transform 0.7s var(--ease-expo),
    filter 0.7s var(--ease-expo);
}
.char.on { opacity: 1; transform: none; filter: none; }
```

```js
(() => {
  const h1 = document.getElementById('hero-title');
  if (!h1) return;
  const raw = h1.innerHTML;
  const lines = raw.split(/<br\s*\/?>/i);
  h1.innerHTML = '';
  let idx = 0;
  const walk = (node, into) => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 3) {
        [...child.textContent].forEach(ch => {
          if (ch === ' ') into.appendChild(document.createTextNode(' '));
          else {
            const s = document.createElement('span');
            s.className = 'char';
            s.textContent = ch;
            s.style.transitionDelay = (0.06 + idx * 0.022) + 's';
            idx++;
            into.appendChild(s);
          }
        });
      } else if (child.nodeType === 1) {
        const clone = child.cloneNode(false);
        walk(child, clone);
        into.appendChild(clone);
      }
    });
  };
  lines.forEach(line => {
    const wrap = document.createElement('div');
    const tmp = document.createElement('div'); tmp.innerHTML = line;
    walk(tmp, wrap);
    h1.appendChild(wrap);
  });
  setTimeout(() => h1.querySelectorAll('.char').forEach(c => c.classList.add('on')), 60);
})();
```

### B. Rise-in stagger on atoms

Every non-headline atom (nav, badges, buttons, dots, stats) gets `class="rise" data-delay="…"`. A single script sweeps them:

```css
.rise {
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.7s var(--ease-expo),
    transform 0.7s var(--ease-expo);
}
.rise.on { opacity: 1; transform: none; }
```

```js
document.querySelectorAll('.rise').forEach(el => {
  const delay = parseInt(el.dataset.delay || '0', 10);
  setTimeout(() => el.classList.add('on'), delay + 200);
});
```

### C. Word-by-word IntersectionObserver reveal for intro + mission

Both `#intro-text` and `#mission-text` split into `.word` spans; when the paragraph enters view (threshold 0.25) each word blurs ��� sharp with a 20ms stagger.

```css
.word {
  display: inline-block;
  opacity: 0;
  transform: translateY(10px);
  filter: blur(4px);
  transition:
    opacity 0.6s var(--ease-expo),
    transform 0.6s var(--ease-expo),
    filter 0.6s var(--ease-expo);
}
.word.on { opacity: 1; transform: none; filter: none; }
```

```js
['#intro-text', '#mission-text'].forEach(sel => {
  const el = document.querySelector(sel);
  if (!el) return;
  const text = el.textContent.trim();
  el.textContent = '';
  text.split(/(\s+)/).forEach((part, i) => {
    if (/^\s+$/.test(part)) el.appendChild(document.createTextNode(part));
    else {
      const s = document.createElement('span');
      s.className = 'word';
      s.textContent = part;
      s.style.transitionDelay = (i * 0.02) + 's';
      el.appendChild(s);
    }
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.word').forEach(w => w.classList.add('on'));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  io.observe(el);
});
```

### D. Lenis smooth scroll

```js
if (typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });
  (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })();
}
```

### E. Continuous shimmer sweep on the metallic hero

Runs automatically via `.hero-bg::before` + `@keyframes metal-sweep` (defined above). No JS needed.

---

## Responsive

**≥ 1024px (lg)** — as specified above.

**768px–1023px (md)** — as specified: intro H2 stays 38px, mission text 24px, stats 44px.

**≤ 767px (sm)**:
- Header: nav links hidden (`hidden md:flex`), only logo + `GET ACCESS` CTA remain — CTA shrinks to `text-[10px] px-[12px]`.
- Hero H1: **44px** (already scaled via `text-[44px] md:text-[64px]`). Trust row wraps and centers.
- Card top corner radius: **40px** (`rounded-t-[40px]`, was 56px on md+).
- Intro H2: 24px. Section padding drops from `md:px-24` → `px-8`.
- Mission section stacks (`flex-col`), label sits above copy with 24px gap.
- Stats grid becomes **2 columns** (`grid-cols-2`), each stat 36px number, 12px label.
- CTA row (`START BUILDING` + `READ THE DOCS`) stacks vertically (`flex-col sm:flex-row`), each button full width via `w-full` if desired.

**Touch handling**:
- Lenis is enabled everywhere; it plays nice with touch momentum on mobile.
- The metallic shimmer sweep pauses when tab is hidden (`document.visibilityState !== 'visible'`) — CSS animation-play-state handles this automatically once you add `@media (prefers-reduced-motion: reduce) { .hero-bg::before { animation: none; } }`.
- `prefers-reduced-motion: reduce` → all `.char`, `.word`, `.rise` are shown at final state (opacity 1, no transform, no blur), and the shimmer sweep is disabled:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .char, .word, .rise { opacity: 1 !important; transform: none !important; filter: none !important; }
    .hero-bg::before { animation: none !important; }
  }
  ```
- Test in Chrome DevTools at 375, 768, 1024, 1280, 1440.

---

## Deliverable checklist (all must be true)

- [ ] Hero background reads as **brushed steel-blue with a moving light sweep** — 5 stacked gradients + shimmer pseudo-element + 3px vertical brushed grain.
- [ ] Hero is `position: fixed` at `top: 0` covering `85vh`, `z-0`. The content card lives in a `z-10` wrapper with an `85vh` spacer above it.
- [ ] Content card: `bg-[#F3F4F6]`, `rounded-t-[56px]` (mobile 40px), custom top shadow + inset white edge highlight.
- [ ] Header + all CTAs use **`border-radius: 4px`** (with the inner icon badge at `3px` for a tight visual echo). No `rounded-full` on any CTA.
- [ ] Logo reads `ferrum.` with the period in mint `#B1F2D1`.
- [ ] Nav links (desktop only): Platform · Solutions · Docs · Changelog.
- [ ] Header CTA: `GET ACCESS`.
- [ ] Micro-label above H1: `Ferrum Platform · Production-ready`.
- [ ] H1: `Infrastructure without / the surprises.` — 72px on lg, weight 400, tracking `-0.035em`. Line 2 wrapped in `<span class="text-white/85">` (softer white, no italic, no serif).
- [ ] Trust row: 3 pravatar avatars + `Shipped by engineering teams at 200+ startups`.
- [ ] Intro H2 uses the exact 44-word sentence given, at 38px on md+.
- [ ] Sub-copy: `One platform. All the plumbing. Focus on your product — we'll handle the on-call.`
- [ ] Primary CTA: `START BUILDING` (ink `#193969` bg, white text). Secondary: `READ THE DOCS` (`#EAEBE8` bg, ink text). Both at 4px corner radius, icon badges 3px.
- [ ] Section label 2: `ENGINEERING FIRST` with the double-circle SVG glyph.
- [ ] Mission text uses the exact sentence given, at 24px on md+.
- [ ] Stats strip has 4 blocks in this exact order: `200+ startups shipping on Ferrum · 14B jobs processed monthly · 18 regions with sub-40ms edge · 99.99% SLA across every region`.
- [ ] Every non-space character of the H1 blur-reveals on load with a 22ms stagger — the whole H1 lands in ~0.8s.
- [ ] Intro + mission paragraphs word-blur-reveal only when the paragraph enters the viewport (IntersectionObserver, threshold 0.25).
- [ ] Every atom marked `.rise` fades + rises 10px on load per its `data-delay`.
- [ ] Icon inside each CTA glides `+3px` right on hover (0.4s ease).
- [ ] Lenis smooth scroll is running.
- [ ] `prefers-reduced-motion` disables shimmer + all entrance animations.
- [ ] No console errors, no layout shift, no jitter.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue018
