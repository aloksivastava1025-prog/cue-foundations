# Morphing Bento Product Showcase — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** A SaaS marketing site's hero-adjacent feature section, letting prospects self-select their industry before reading further.

---

# Pixel-Perfect Prompt: Bendwick · Bento Grid (Awwwards)

Build a **5-card bento grid** with 7 layered animations + a 4-toggle use-case switcher that morphs the entire grid's content between four product contexts (Legal / Design / Analytics / E-commerce) — same layout, same choreography, different product.

---

## ASSETS

```
FONTS:
  https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Newsreader:opsz,wght@0,6..72,400;0,6..72,500&display=swap
  (Roman weights only — no italic variants)

LIBRARIES:
  Tailwind CSS Play CDN
  GSAP 3.12.5 (core + ScrollTrigger)
```

## DESIGN TOKENS

```js
// tailwind.config
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Newsreader', 'serif'],
    },
    colors: {
      bento: {
        bg:    '#EAE7E0',
        dark:  '#1C1C1C',
        light: '#FFFFFF',
        beige: '#F5F3EF',
        gray:  '#8C8C8C',
      },
    },
    boxShadow: {
      soft:  '0px 10px 40px -10px rgba(0,0,0,0.05)',
      hover: '0px 20px 60px -10px rgba(0,0,0,0.12)',
    },
  },
}
```

```css
/* Page */
body {
  background: #F8F8F8;
  padding: 40px 0;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

## TYPOGRAPHY RULES (non-negotiable)

- **Roman weights only** — never italic, never `<em>` tags with default italic
- **Max weight = 500 (medium)** — no `font-semibold` (600), no `font-bold` (700)
- Newsreader = serif for headings (roman)
- Inter = sans for everything else

## LAYOUT

```
┌──────────────────────────────────────────────────────────────┐
│ Section header — kicker · h1 · live counter                  │
├──────────────────────────────────────────────────────────────┤
│ Use-case toggle — Legal / Design / Analytics / E-commerce    │
├──────────────────────────────────────────────────────────────┤
│ ┌──────┐┌───────────┐┌─────────────────────────────┐         │
│ │      ││  Card 2   ││       Card 4 (Wide Dark)    │         │
│ │  1   ││ Icon Grid ││   Privatised & Ready        │         │
│ │      ││           ││                             │         │
│ │      │└───────────┘└─────────────────────────────┘         │
│ │      │┌───────────┐┌─────────────────────────────┐         │
│ │      ││   Card 3  ││       Card 5 (Wide Light)   │         │
│ │      ││ Aligned   ││   Ask Bendwick + Files      │         │
│ │      ││ Workflow  ││                             │         │
│ └──────┘└───────────┘└─────────────────────────────┘         │
│                                                              │
│ ── When to use each · What stays the same ──                 │
└──────────────────────────────────────────────────────────────┘
```

- **Container**: `w-full px-4 md:px-8 mx-auto max-w-[1400px]`
- **Grid**: `grid grid-cols-1 md:grid-cols-7 gap-5 auto-rows-[280px]`
- **Card 1**: `col-span-2 row-span-2` (tall left column, dark)
- **Card 2**: `col-span-2 row-span-1` (top mid, white — 6 icon cells 3×2)
- **Card 4**: `col-span-3 row-span-1` (top right, dark with nested beige panel)
- **Card 3**: `col-span-2 row-span-1` (bottom mid, white with tooltip + faded doc text)
- **Card 5**: `col-span-3 row-span-1` (bottom right, white with auto-scrolling file list)

## CARD SPECS

### Every card gets:
- `class="bento-card tilt spotlight"` — enables entrance, tilt, and spotlight
- `data-tilt data-card="N"` where N ∈ {1, 2, 3, 4, 5}
- `rounded-[24px]`, `shadow-soft` → `hover:shadow-hover`
- Inline padding varies per card

### Card 1 (Left Tall — Dark)
- Root: `bg-bento-dark` with 8px padding around a nested `[#EBE8E2]` panel
- Nested panel: contains **the stack** — 5 pill labels rotating a highlight
- Bottom section: dark, holds `h2` (Fraunces 32px), body `p` (gray 13px), and the "Learn more" button (`.magnet`)
- Stack pill styles vary per position:
  - Positions 0, 4 (outer): `bg-white/40 text-gray-400`, `scale-90`, `opacity-60`
  - Positions 1, 3 (inner): `bg-white text-bento-dark`, `scale-95`, `shadow-sm`
  - Position 2 (highlight): `bg-bento-dark text-white`, `is-highlight` class

### Card 2 (Top Mid — Icon Grid)
- `bg-white py-6 px-2`
- Contains `#icon-grid` — 3-col × 2-row grid of 6 `.icon-cell` divs
- Each cell: `bg-bento-beige rounded-[16px] p-3.5`, with an SVG icon (top-left) + 2-line label (bottom-left)
- One cell has `is-active` at any time — becomes `bg-bento-dark text-white` with a `ping-ring` pulsing outline
- Left/right edge fades: absolute-positioned white gradients (`w-16 z-10 pointer-events-none`) on both sides

### Card 4 (Top Right Wide — Dark with Nested)
- `bg-bento-dark p-2`, flex-row
- Left 45%: h2 (Fraunces 28px, white) + body (gray-400 13px)
- Right 55%: nested `bg-bento-bg rounded-[20px] p-6` panel
- Inner panel: main paragraph + a white row showing "Download (55) Files" + full-width dark "Download" button (`.magnet`)

### Card 3 (Bottom Mid — Tooltip + Faded Doc)
- `bg-white p-8`, flex-row
- Left 60%: h2 + body copy
- Right 55% overlay: faded document text with `text-mask` gradient (fades bottom-to-transparent)
- Floating tooltip at right-10% top-55%: black pill "Download the Legal.doc" with a `.tooltip-arrow` triangle pointing down, wrapped in `.bob` class for infinite gentle Y-bounce
- Below the tooltip: outlined faint download chip

### Card 5 (Bottom Right Wide — Ask + File List)
- `bg-white p-8`, flex-col
- Top: big paragraph (16px medium)
- Middle: "Ask Bendwick" full-width dark button (`.magnet`)
- Bottom label: `<span id="project-count">125</span> Project Files` in mono/uppercase
- Below: `.file-list` container with `.file-track` inside — 3 file rows duplicated (6 total) for seamless auto-scroll loop
- File list has a top-to-transparent mask so the bottom fades out
- `.file-track` animates `translateY(0) → translateY(-50%)` over 18s linear infinite; pauses on `.file-list:hover`

## SVG GOO / GRAIN

- Card 1's beige panel has a `.grainy` pseudo-element noise texture:
  ```css
  .grainy::after {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='...'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    opacity: 0.05;
    mix-blend-mode: overlay;
    border-radius: inherit;
  }
  ```

## THE 7 ANIMATION LAYERS

### 1 · CHOREOGRAPHED ENTRANCE (different vector per card)

```js
const vectors = {
  '1': { x: -60, y: 60,  rotateY: -8 },  // Card 1: slides in from left
  '2': { x: 0,   y: -50, rotateX: 8  },  // Card 2: drops from above
  '3': { x: -30, y: 50,  rotateY: -4 },  // Card 3: rises from below-left
  '4': { x: 40,  y: -30, rotateX: 6  },  // Card 4: floats in from top-right
  '5': { x: 60,  y: 30,  rotateY: 6  },  // Card 5: slides in from right
};

gsap.to(cards, {
  x: 0, y: 0, rotateX: 0, rotateY: 0,
  opacity: 1, autoAlpha: 1,
  duration: 1.1,
  stagger: 0.11,
  ease: 'expo.out',
  scrollTrigger: { trigger: '.bento-grid', start: 'top 88%' },
});
```

Result: like a hand of cards being dealt onto the table — not a boring stagger fade.

### 2 · 3D TILT (per-card mouse follow)

Each card responds to cursor with damped `rotateX/rotateY` up to ±8° + `translateY(-4px)` lift while hovered.

```css
.tilt {
  transform: perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--ty, 0px));
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.tilt.is-tilting { transition: transform 0.15s linear; }
```

```js
card.addEventListener('mousemove', (e) => {
  const r = card.getBoundingClientRect();
  const nx = (e.clientX - r.left) / r.width - 0.5;
  const ny = (e.clientY - r.top) / r.height - 0.5;
  targX = -ny * 6;   // rotateX
  targY =  nx * 8;   // rotateY
  card.style.setProperty('--mx', (nx + 0.5) * 100 + '%');
  card.style.setProperty('--my', (ny + 0.5) * 100 + '%');
});
// Damped update loop lerps current toward target at 0.12/frame
```

### 3 · CURSOR-FOLLOW SPOTLIGHT

A 500px radial gradient tracks the cursor inside each card via `--mx` / `--my`:

```css
.spotlight::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(
    500px circle at var(--mx, 50%) var(--my, 50%),
    rgba(255,255,255,0.08),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}
.spotlight:hover::before { opacity: 1; }
```

### 4 · MAGNETIC BUTTONS

Every CTA marked `data-magnet` pulls toward the cursor when hovered:

```css
.magnet {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translate(var(--mtx, 0px), var(--mty, 0px));
}
```

```js
btn.addEventListener('mousemove', (e) => {
  const r = btn.getBoundingClientRect();
  const nx = (e.clientX - r.left - r.width / 2) / r.width;
  const ny = (e.clientY - r.top - r.height / 2) / r.height;
  btn.style.setProperty('--mtx', (nx * 12).toFixed(1) + 'px');
  btn.style.setProperty('--mty', (ny * 8).toFixed(1) + 'px');
});
btn.addEventListener('mouseleave', () => {
  btn.style.setProperty('--mtx', '0px');
  btn.style.setProperty('--mty', '0px');
});
```

Snap-back on leave via the spring ease.

### 5 · CARD 1 STACK — Rotating highlight

The "AI Summarize" black bar walks down through each document label every 1.8s. Text swaps in and out of the highlight slot — so the illustration becomes a working demo of the product's actual behaviour.

```js
const items = document.querySelectorAll('.stack-item');
const highlightText = 'AI Summarize';
const labels = Array.from(items).map((el) => el.textContent.trim());
let idx = 2;   // initial highlight sits on position 2

setInterval(() => {
  items[idx].classList.remove('is-highlight');
  items[idx].textContent = labels[idx];   // restore native label
  idx = (idx + 1) % items.length;
  items[idx].classList.add('is-highlight');
  labels[idx] = items[idx].textContent.trim();
  items[idx].textContent = highlightText;
}, 1800);
```

Highlight styling:
```css
.stack-item.is-highlight {
  background: #1C1C1C !important;
  color: #fff !important;
  box-shadow: 0 12px 24px -8px rgba(0,0,0,0.4) !important;
  z-index: 10;
}
```

### 6 · CARD 2 ICON GRID — Knight's-tour active cell

Active cell hops around the 2×3 grid in a hand-picked visually-pleasing path every 1.6s, with a pulsing `ping-ring` outline:

```js
const cells = document.querySelectorAll('#icon-grid .icon-cell');
const path = [1, 4, 3, 0, 2, 5];   // hop order
let p = 0;
setInterval(() => {
  cells.forEach((c) => c.classList.remove('is-active'));
  p = (p + 1) % path.length;
  cells[path[p]].classList.add('is-active');
}, 1600);
```

```css
@keyframes ping-ring {
  0%   { transform: scale(1);   opacity: 0.4; }
  100% { transform: scale(1.6); opacity: 0; }
}
.icon-cell.is-active::after {
  content: '';
  position: absolute; inset: 0;
  border-radius: inherit;
  border: 2px solid rgba(28,28,28,0.4);
  animation: ping-ring 1.2s ease-out infinite;
  pointer-events: none;
}
```

### 7 · SCROLL-DRIVEN COUNTERS + PARALLAX

Three counters tick up when the grid scrolls in (`start: 'top 85%'`, `once: true`):
- Top-right: `12,482 documents analysed` — 2.4s `power3.out`
- Card 4: `Download (55) Files` — 1.6s `power2.out`
- Card 5: `125 Project Files` — 1.8s `power2.out`

Each card gets a scroll-scrub parallax at a **different speed** so the grid feels layered:

```js
cards.forEach((card, i) => {
  const speed = [0.15, -0.10, 0.12, -0.08, 0.10][i] || 0;
  gsap.to(card, {
    yPercent: speed * 30,
    ease: 'none',
    scrollTrigger: {
      trigger: card,
      start: 'top bottom',
      end:   'bottom top',
      scrub: 1.2,
    },
  });
});
```

## USE-CASE TOGGLE (the 8th layer)

A 4-button pill toggle above the grid swaps ALL content in-place. Layout + animations stay identical.

### Toggle DOM

```html
<div class="mb-8 flex items-center gap-3">
  <span class="text-[11px] font-medium tracking-[0.15em] uppercase text-bento-gray">Same bento · try it as</span>
  <div class="uc-toggle relative inline-flex bg-white rounded-[10px] p-1 shadow-soft border border-black/5">
    <span class="uc-indicator absolute top-1 h-[calc(100%-8px)] bg-bento-dark rounded-[7px]"
          style="width: 80px; transform: translateX(0);"></span>
    <button class="uc-btn is-active" data-uc="0">Legal</button>
    <button class="uc-btn"           data-uc="1">Design</button>
    <button class="uc-btn"           data-uc="2">Analytics</button>
    <button class="uc-btn"           data-uc="3">E-commerce</button>
  </div>
</div>
```

Sliding black indicator lands under the active button (same pattern as toggle-usecases demo — `width` + `translateX` transition on `cubic-bezier(0.65, 0, 0.35, 1)` over 500ms).

### The 4 use cases (config schema)

Each entry maps to keys the swap engine walks:

```js
const useCases = [
  { // 0 · Legal (default — Bendwick)
    kicker: '— Bendwick · Product',
    h1a: 'Turn document chaos',
    h1b: 'into ',
    h1c: 'AI-powered clarity.',
    counterLabel: 'documents analysed',
    stack: ['Legal Law Benefits', 'Sales Management.pdf', 'AI Summarize', 'Transcript.docx', 'Memos.pdf'],
    stackKey: 'AI Summarize',
    c1Title: 'Proven Research<br>Rapid Results',
    c1Body: 'Complex questions? Solved.<br>...',
    c1Btn: 'Learn more',
    icons: ['Analytics<br>Discovery', 'AI-Based<br>Research Doc', ...6 total],
    c4Title: 'Privatised &<br>Project-Ready',
    c4Sub: '...',
    c4Inner: '...',
    c4Btn: 'Download',
    c3Title: 'Aligned With<br>Your Workflow',
    c3Body: '...',
    c3Tooltip: 'Download the Legal.doc',
    c5Big: '...',
    c5Btn: 'Ask Bendwick',
    c5FilesLabel: 'Project Files',
    c5Files: ['Legal agreement.doc', 'Research & Solutions.pdf', 'Compliance Memo.pdf'],
  },
  { // 1 · Design system (FrameKit)
    kicker: '— FrameKit · Design',
    stackKey: 'Sync Tokens',
    c1Title: 'One Library<br>Every Screen',
    c1Btn: 'Explore Kit',
    icons: ['Components<br>Library', 'Tokens<br>Studio', ...],
    c5Btn: 'Ask FrameKit',
    c5Files: ['Button.motion.tsx', 'Design.tokens.json', 'Grid.spec.md'],
    // ...full keys as above
  },
  { // 2 · Analytics (Insightly)
    stackKey: 'Predict Trend',
    c1Title: 'Forecast First,<br>Confirm Later',
    icons: ['Reports<br>Studio', 'Live<br>Dashboards', 'Cohort<br>Analysis', 'Funnel<br>Breakdowns', 'Predictive<br>Alerts', 'Anomaly'],
    c5Btn: 'Ask Insightly',
    c5Files: ['Q3-cohorts.pdf', 'Retention-forecast.csv', 'Funnel-audit.md'],
    // ...
  },
  { // 3 · E-commerce (Commerce OS)
    stackKey: 'Fulfil Batch',
    c1Title: 'Sell Everywhere<br>Ship Anywhere',
    icons: ['Orders<br>Live Feed', 'Product<br>Catalog', 'Customer<br>Profiles', 'Inventory<br>Tracker', 'Sales<br>Analytics', 'Support'],
    c5Btn: 'Ask Commerce OS',
    c5Files: ['Order-4471.pdf', 'Invoice-Q3.csv', 'Return-4102.md'],
    // ...
  },
];
```

### Swap engine

```js
// Cache references ONCE (avoids re-querying on every toggle)
const swap = {
  kicker:       document.querySelector('[data-swap="kicker"]'),
  h1a:          document.querySelector('[data-swap="h1-a"]'),
  h1b:          document.querySelector('[data-swap="h1-b"]'),
  h1c:          document.querySelector('[data-swap="h1-c"]'),
  counterLabel: document.querySelector('[data-swap="counter-label"]'),
  stack:        document.querySelectorAll('.stack-item'),
  c1Title:      document.querySelector('.bento-card[data-card="1"] h2'),
  c1Body:       document.querySelector('.bento-card[data-card="1"] p'),
  c1Btn:        document.querySelector('.bento-card[data-card="1"] .magnet'),
  icons:        document.querySelectorAll('#icon-grid .icon-cell span'),
  c4Title:      document.querySelector('.bento-card[data-card="4"] h2'),
  c4Sub:        document.querySelector('.bento-card[data-card="4"] > div:first-child p'),
  c4Inner:      document.querySelector('.bento-card[data-card="4"] > div:last-child p'),
  c4Btn:        document.querySelector('.bento-card[data-card="4"] .magnet'),
  c3Title:      document.querySelector('.bento-card[data-card="3"] h2'),
  c3Body:       document.querySelector('.bento-card[data-card="3"] > div:first-child p'),
  c3Tooltip:    document.querySelector('.bento-card[data-card="3"] .bg-bento-dark.text-white'),
  c5Big:        document.querySelector('.bento-card[data-card="5"] > p'),
  c5Btn:        document.querySelector('.bento-card[data-card="5"] .magnet'),
  c5FilesLabel: document.querySelector('.bento-card[data-card="5"] .uppercase'),
  c5Files:      document.querySelectorAll('.bento-card[data-card="5"] .file-track span'),
};

function applyUseCase(idx) {
  const uc = useCases[idx];
  swap.kicker.textContent = uc.kicker;
  swap.h1a.textContent = uc.h1a;
  // ...set every element from uc
  swap.stack.forEach((el, i) => { if (uc.stack[i]) el.textContent = uc.stack[i]; });
  swap.icons.forEach((el, i) => { if (uc.icons[i]) el.innerHTML = uc.icons[i]; });
  swap.c5Files.forEach((el, i) => {
    // File list is duplicated for looping — modulo it
    el.textContent = uc.c5Files[i % uc.c5Files.length];
  });
}
```

### Fade transition on toggle click

```js
ucButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    ucButtons.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    positionUcIndicator();

    // Fade content out, swap, fade back in
    document.body.classList.add('uc-swapping');
    setTimeout(() => {
      applyUseCase(i);
      document.body.classList.remove('uc-swapping');
    }, 300);
  });
});
```

```css
[data-swap], [data-swap-h1] > span { transition: opacity 0.3s ease; }
.uc-swapping [data-swap],
.uc-swapping [data-swap-h1] > span { opacity: 0; }
```

## HTML DATA-SWAP HOOKS

Every swappable element needs a `data-swap` attribute (for the fade transition) OR is queried by cached selector. Minimum hooks in the header:

```html
<div class="text-[11px] uppercase text-bento-gray" data-swap="kicker">— Bendwick · Product</div>
<h1 class="font-serif" data-swap-h1>
  <span data-swap="h1-a">Turn document chaos</span><br />
  <span data-swap="h1-b">into </span><span class="text-bento-gray" data-swap="h1-c">AI-powered clarity.</span>
</h1>
<div>
  Live · <span id="counter" class="font-medium">0</span>
  <span data-swap="counter-label">documents analysed</span>
</div>
```

## RESPONSIVE / ACCESSIBILITY

- **Mobile (below `md`)**: grid collapses to single column, all cards `col-span-1`, tilt is disabled (`hover` doesn't exist on touch), spotlight also skipped
- **Reduced motion**: wrap entrance animation + parallax in a `matchMedia('(prefers-reduced-motion: reduce)').matches` check; skip and set final state directly
- **Keyboard**: toggle buttons are `<button>` → native focus + Space/Enter to activate
- **`will-change: transform`** on every animated element for compositor promotion

## DELIVERABLE CHECKLIST

- [ ] Roman weights only — no italic anywhere, `<em>` tags removed
- [ ] Font weight capped at 500 (`font-medium`) — never 600 or 700
- [ ] 5-card grid, `md:grid-cols-7`, auto-rows 280px
- [ ] Cards span: `[2×2, 2×1, 2×1, 3×1, 3×1]` respectively
- [ ] Every card has `.tilt .spotlight` + `data-tilt data-card="N"`
- [ ] Every CTA is a `.magnet [data-magnet]`
- [ ] **Entrance vectors** — 5 different `{x, y, rotateX/Y}` per card index in `vectors` object
- [ ] `expo.out` ease, 1.1s duration, 0.11s stagger, ScrollTrigger `top 88%`
- [ ] **Tilt** — mousemove → damped `--rx/--ry` (max ±8°) via 0.12 lerp; `--ty: -4px` on hover
- [ ] **Spotlight** — 500px radial gradient at `--mx/--my`, opacity 0→1 on hover
- [ ] **Magnetic buttons** — up to ±12px follow with `cubic-bezier(0.34, 1.56, 0.64, 1)` snap-back
- [ ] **Card 1 stack** — 5 items, highlight text swaps every 1.8s (real product demo)
- [ ] **Card 2 icons** — active cell hops `[1, 4, 3, 0, 2, 5]` every 1.6s with `ping-ring` outline
- [ ] **Card 5 file list** — duplicated rows, `translateY(0) → -50%` in 18s linear infinite; pauses on hover
- [ ] **Tooltip on Card 3** — floats via `.bob` 3s ease-in-out infinite
- [ ] **3 counters** — animate on scroll-in-view: 12,482 / 55 / 125
- [ ] **Parallax** — each card scrolls at a different `yPercent` speed with `scrub: 1.2`
- [ ] **Grain texture** on Card 1's beige panel via SVG feTurbulence
- [ ] **Use-case toggle** — 4 buttons (Legal / Design / Analytics / E-commerce) with sliding black indicator
- [ ] **`useCases` config** — 4 entries, each with 22+ swappable keys
- [ ] **Fade morph** on swap — `.uc-swapping` class → opacity 0 → 300ms → apply new content → opacity 1
- [ ] **Cached selectors** in a `swap` object so toggle clicks don't re-query the DOM
- [ ] Guide list below the grid: "When to use each" / "What stays the same"

---

**Awwwards-tier version →** https://cuedesign.space/component/cue039
