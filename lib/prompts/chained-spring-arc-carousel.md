# Chained Spring Arc Carousel — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Best suited for a fashion or photography portfolio landing page where a physics-driven image showcase becomes the centerpiece interaction.

---

# Chained Spring Arc Carousel — 10-Card Fanned Wheel with Physics-Driven Scroll

> **This is an ADDITION to my existing project. DO NOT create a new HTML file. DO NOT overwrite my current `<body>`, `<html>`, or global styles.**
> Insert this carousel at the spot I mark. If Inter is already loaded from Google Fonts, reuse — don't duplicate. Namespace new class names to avoid collisions.

Build a pixel-perfect **fan-arc image carousel** — a giant grey arch sits behind the viewport bottom edge; 10 image cards pivot from an invisible point 800px below the fold, fanning outward like a hand of playing cards. On load, cards **slide up from below, stack behind the center, then fan out with a gentle 1-per-card spring**. Scroll wheel snaps the fan through indexes; each scroll triggers a **chained spring** where the outermost card leads and every card behind it follows with propagating tension → the arc oscillates naturally. Fixed centered label (number + category) updates to whichever card is closest to 0° angle. Cards lift on hover. Zero libraries, pure physics loop.

Award-winning kinetic feel, pure HTML + CSS + vanilla JS.

---

## FRAMEWORK

- Plain **HTML + CSS + vanilla JS**. No React, no libraries.
- Single Google Font: **Inter** (weights 300 / 400 / 600 / 900).
- Physics: 2 springs — a slow lazy spring for the entrance fan-out, a stiff chained spring for scroll navigation.

---

## ASSETS

Fonts only:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;900&display=swap" rel="stylesheet">
```

10 image URLs — use these exact Pinterest sources:

```js
const IMAGES = [
  'https://i.pinimg.com/736x/aa/07/71/aa0771966b0d5b5060bf2c658c04b189.jpg',
  'https://i.pinimg.com/736x/d6/d3/c9/d6d3c9cdf076cbfe41366bc5ee34f1ec.jpg',
  'https://i.pinimg.com/736x/cd/31/03/cd31039a8e616b2cd2dae9bda9be4160.jpg',
  'https://i.pinimg.com/736x/06/33/8c/06338cdd05ce56b4963126ef315542c0.jpg',
  'https://i.pinimg.com/736x/2f/0a/2d/2f0a2d773f714c183741931a3830f826.jpg',
  'https://i.pinimg.com/1200x/37/e9/12/37e9126981c7ced8e86baa206673c6c8.jpg',
  'https://i.pinimg.com/736x/d6/d3/c9/d6d3c9cdf076cbfe41366bc5ee34f1ec.jpg',
  'https://i.pinimg.com/736x/cd/31/03/cd31039a8e616b2cd2dae9bda9be4160.jpg',
  'https://i.pinimg.com/736x/06/33/8c/06338cdd05ce56b4963126ef315542c0.jpg',
  'https://i.pinimg.com/736x/2f/0a/2d/2f0a2d773f714c183741931a3830f826.jpg',
];
```

10 category labels — updated on the active card:
`PORTRAIT · STREET · URBAN · FASHION · VINTAGE · NATURE · MINIMAL · CLASSIC · MODERN · EDGY`

---

## DESIGN TOKENS

```css
:root {
  --bg-color: #e5e5e5;
  --arch-color: #d4d4d4;
  --card-w: 220px;
  --card-h: 340px;
  --radius: 800px;
}
body, html {
  margin: 0; padding: 0;
  background: var(--bg-color);
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  height: 100vh; width: 100vw;
}
```

---

## SECTION 1 — Stage layers (arch + pivot + label)

```html
<div class="global-label" id="globalLabel">
  <div class="gl-num" id="glNum">01</div>
  <div class="gl-name" id="glName">PORTRAIT</div>
</div>

<div class="carousel-wrapper">
  <div class="arch"></div>
  <div class="pivot" id="pivot">
    <div class="card"><div class="card-inner card-0"></div></div>
    <!-- … 10 total cards … -->
  </div>
</div>
```

```css
.carousel-wrapper {
  position: absolute;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  display: flex; justify-content: center; align-items: center;
}

.arch {
  position: absolute;
  bottom: -600px;                                     /* sinks off-screen */
  width: 1600px; height: 800px;
  background: var(--arch-color);
  border-radius: 50% 50% 0 0;                         /* half-ellipse dome */
  z-index: 1;
}

.pivot {
  position: absolute;
  bottom: -600px;                                     /* rotation origin lives outside viewport */
  width: 0; height: 0;
  z-index: 5;
  transform: translateY(100vh);                       /* start below fold */
  opacity: 0;
  animation: slideUpArrival 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideUpArrival {
  to { transform: translateY(0); opacity: 1; }
}
```

**Why the arch + pivot sit at `bottom: -600px`**: the visual arch curve peaks at the actual viewport bottom line — 200px of the arch dome pokes into the viewport, so cards resting on it look like they're sitting on a physical rim. The pivot is a 0×0 anchor at the same coordinate — every card is a child that rotates around this invisible origin.

### Global label (fixed, top-centered, appears after fan-out completes)

```css
.global-label {
  position: fixed;
  top: 12%; left: 50%;
  transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center;
  gap: 8px;
  z-index: 20;
  text-align: center;
  opacity: 0;
  transition: opacity 0.8s ease;
}
.gl-num  { font-size: 56px; font-weight: 300; color: #111; letter-spacing: -2px; line-height: 1; }
.gl-name { font-size: 13px; font-weight: 600; color: #777; text-transform: uppercase; letter-spacing: 5px; }
```

Label stays hidden (`opacity: 0`) during the entrance choreography, fades in only when the fan-out spring settles.

---

## SECTION 2 — Cards (rotated + translated from the pivot)

Each `.card` is an absolute-positioned box whose transform is `rotate(θ) translateY(-800px)`. Rotation is what the physics writes to; the `-800px` translate walks each card outward along the arc radius. Card's own inner `.card-inner` is what shows the image + hovers.

```css
.card {
  position: absolute;
  width: var(--card-w); height: var(--card-h);
  left: calc(var(--card-w) / -2);                     /* recenter on pivot */
  bottom: calc(var(--card-h) / -2);
  will-change: transform;
  display: flex; justify-content: center;
}

.card-inner {
  position: absolute; inset: 0;
  border-radius: 6px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  overflow: hidden;
  background-size: cover; background-position: center;
  background-color: #fff;
  transform: translateY(0);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

/* Hover lift — only when carousel is idle */
.card:hover .card-inner {
  transform: translateY(-40px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
}

/* Card-specific bg */
.card-0 { background-image: url('...pin1'); }
.card-1 { background-image: url('...pin2'); }
/* … 10 total … */
```

At rest each card renders like this: `translate(-cardW/2, cardH/-2)` + `rotate(θ) translateY(-800px)` — the `-800px` translation pushes the card OUT from the pivot along the arc radius.

---

## SECTION 3 — Physics loop (the star of the show)

### Constants

```js
const GAP_ANGLE = 16;   // degrees between adjacent cards
const STIFFNESS = 0.2;  // scroll-time spring stiffness
const DAMPING = 0.4;    // scroll-time velocity retention (0 = no bounce, 1 = perpetual)
```

### State

```js
let activeIndex = 4;                          // which card sits at 0° (center)
let cards = [];                               // per-card physics state
let currentFocusedIndex = -1;
let isScrolling = false;
let isIntro = true;
let introFanning = false;

// Initial: every card stacked at 0° (behind the center card)
for (let i = 0; i < 10; i++) {
  cards.push({ angle: 0, velocity: 0 });
  cardsEl[i].style.zIndex = 10 - Math.abs(i - activeIndex);
}

// Wait for arrival slide-up (1200ms), then start fanning
setTimeout(() => { introFanning = true; }, 1000);
```

**Two-phase physics** — the entrance is different from the steady-state:

### Phase A — Entrance fan-out (lazy independent springs)

```js
if (isIntro) {
  if (introFanning) {
    let allSettled = true;
    for (let i = 0; i < 10; i++) {
      const target = (i - activeIndex) * GAP_ANGLE;
      const force  = (target - cards[i].angle) * 0.01;   // extremely slow spring
      cards[i].velocity += force;
      cards[i].velocity *= 0.88;                          // gliding damping
      cards[i].angle    += cards[i].velocity;

      if (Math.abs(target - cards[i].angle) > 0.5 || Math.abs(cards[i].velocity) > 0.5) {
        allSettled = false;
      }
    }
    if (allSettled) {
      isIntro = false;
      document.getElementById('globalLabel').style.opacity = 1;
    }
  }
}
```

- Each card independently springs toward its resting position `(i - activeIndex) * GAP_ANGLE`
- Very low stiffness `0.01` + very light damping `0.88` = slow lazy fan-out — reads as elegant, not urgent
- Once every card is within 0.5° of target and its velocity < 0.5, `isIntro = false` and the label fades in

### Phase B — Steady-state chained spring (scroll-driven)

```js
} else {
  // The outermost card is the "leader"
  const leaderIndex = 9;
  const leaderTarget = (leaderIndex - activeIndex) * GAP_ANGLE;
  const leader = cards[leaderIndex];

  const force = (leaderTarget - leader.angle) * STIFFNESS;
  leader.velocity += force;
  leader.velocity *= DAMPING;
  leader.angle    += leader.velocity;

  // Every card behind the leader is chained to its neighbor with a `GAP_ANGLE` offset
  for (let i = leaderIndex - 1; i >= 0; i--) {
    const cur  = cards[i];
    const next = cards[i + 1];
    const target = next.angle - GAP_ANGLE;                // follow the neighbor
    const f = (target - cur.angle) * STIFFNESS;
    cur.velocity += f;
    cur.velocity *= DAMPING;
    cur.angle    += cur.velocity;
  }
}
```

**This is the chained-spring trick**: the leader card (index 9) tracks its absolute target `(leaderIndex - activeIndex) * GAP_ANGLE` with regular spring physics. But every card behind it doesn't spring to an absolute target — it springs to `neighbor.angle - GAP_ANGLE`, i.e. "stay `GAP_ANGLE` behind whoever comes after you." When the leader moves, the tension propagates DOWN the chain with a natural ripple.

Result: scrolling the wheel doesn't just teleport the fan — it kicks the outermost card, which pulls its neighbor, which pulls the next, etc. The whole arc oscillates like a plucked string.

### DOM transform + focused-card detection

```js
let minAbsAngle = Infinity;
let closestIndex = 0;
cardsEl.forEach((el, i) => {
  const angle = cards[i].angle;
  el.style.transform = `rotate(${angle}deg) translateY(-800px)`;
  if (Math.abs(angle) < minAbsAngle) {
    minAbsAngle = Math.abs(angle);
    closestIndex = i;
  }
});

if (!isIntro && closestIndex !== currentFocusedIndex) {
  if (currentFocusedIndex >= 0) cardsEl[currentFocusedIndex].classList.remove('focused');
  currentFocusedIndex = closestIndex;
  cardsEl[currentFocusedIndex].classList.add('focused');
  glNum.innerText  = String(closestIndex + 1).padStart(2, '0');
  glName.innerText = cardNames[closestIndex];
}

requestAnimationFrame(updatePhysics);
```

Whichever card is closest to angle 0° gets the `.focused` class and updates the global label to `01 / PORTRAIT`, `02 / STREET`, etc.

---

## SECTION 4 — Scroll input (strict 1-to-1)

```js
window.addEventListener('wheel', (e) => {
  if (isIntro) return;                                    // block during entrance
  if (Math.abs(e.deltaY) < 15) return;                    // ignore trackpad twitches
  if (isScrolling) return;                                // throttle to 1 step per 400ms

  if (e.deltaY > 0)      activeIndex = Math.max(0, activeIndex - 1);
  else                   activeIndex = Math.min(9, activeIndex + 1);

  isScrolling = true;
  setTimeout(() => { isScrolling = false; }, 400);
});
```

- One scroll tick = one card step
- 400ms throttle prevents blur-scroll from consuming multiple steps in a single flick
- Clamps to `[0, 9]` — no wrap-around, edge stops feel like real fan-limit
- Scroll direction is inverted (deltaY > 0 = decrement activeIndex) so the card at right/top comes toward center on scroll-down

---

## Responsive

- **≥ 900px** — as spec above.
- **≤ 900px** — shrink cards + tighten radius:
  ```css
  @media (max-width: 900px) {
    :root { --card-w: 160px; --card-h: 240px; --radius: 600px; }
    .arch { width: 1200px; height: 600px; bottom: -450px; }
    .pivot { bottom: -450px; }
  }
  ```
  And update JS: `translateY(-600px)` accordingly (or use `var(--radius)` via `getComputedStyle`).
- **Touch** — no wheel handler on touch; add pointerdown+pointermove translation-to-index mapping if needed. Cards still respond to `:hover` on tap (as an approximation).
- **`prefers-reduced-motion: reduce`**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .pivot { animation: none !important; opacity: 1 !important; transform: none !important; }
    .card-inner { transition: none !important; }
  }
  ```
  In JS also set `isIntro = false` immediately and skip the fan-out spring — cards render at final positions instantly.
- Test at 375, 600, 900, 1024, 1440.

---

## Deliverable checklist (all must be true)

- [ ] Body `overflow: hidden`, 100vh/100vw, grey `#e5e5e5` background.
- [ ] `.arch` = 1600×800, `bottom: -600px`, `border-radius: 50% 50% 0 0`, colour `#d4d4d4`, z-index 1.
- [ ] `.pivot` = 0×0 at `bottom: -600px`, starts `translateY(100vh) opacity: 0`, animates to `translateY(0) opacity: 1` over 1.2s cubic-bezier(0.16, 1, 0.3, 1).
- [ ] 10 `.card` elements, each 220×340, positioned so their center aligns with the pivot origin (`left: calc(-var(--card-w)/2)`, `bottom: calc(-var(--card-h)/2)`).
- [ ] `.card-inner` fills the card with background-image and gets `translateY(-40px)` + amplified shadow on `.card:hover`.
- [ ] All 10 background images set via `.card-0` through `.card-9` selectors with exact Pinterest URLs.
- [ ] Global label fixed top-center: 56px light num + 13/600/uppercase 5px-tracked name, hidden until fan-out completes.
- [ ] Physics constants: `GAP_ANGLE = 16`, `STIFFNESS = 0.2`, `DAMPING = 0.4`.
- [ ] Initial `activeIndex = 4`, all cards start at `angle: 0` (stacked behind center card).
- [ ] Z-index seeded: `10 - abs(i - activeIndex)` so center card sits on top.
- [ ] `setTimeout(() => introFanning = true, 1000)` — waits for slide-up arrival to finish before fan-out begins.
- [ ] Phase A (entrance) uses independent per-card springs with `force = (target - angle) * 0.01`, `velocity *= 0.88` — lazy and elegant.
- [ ] `isIntro = false` triggers when every card is < 0.5° from target with velocity < 0.5.
- [ ] Global label fades in via `.style.opacity = 1` (0.8s transition) once intro completes.
- [ ] Phase B (steady state) leader = card 9. Leader springs to absolute `(leaderIndex - activeIndex) * GAP_ANGLE` with `STIFFNESS/DAMPING`.
- [ ] All cards behind leader spring to `neighbor.angle - GAP_ANGLE` — chained propagation ripples from outside in.
- [ ] Transform written every frame: `rotate(${angle}deg) translateY(-800px)`.
- [ ] Focused card = card with smallest `abs(angle)`. `.focused` class toggled, global label num/name updated.
- [ ] Wheel handler ignores `deltaY < 15`, throttles via `isScrolling` for 400ms, clamps `activeIndex` to `[0, 9]`.
- [ ] `deltaY > 0` decrements activeIndex (scroll DOWN brings next card LEFT to center); `deltaY < 0` increments.
- [ ] Card names in exact order: `PORTRAIT, STREET, URBAN, FASHION, VINTAGE, NATURE, MINIMAL, CLASSIC, MODERN, EDGY`.
- [ ] `prefers-reduced-motion: reduce` skips slide-up + fan-out — cards render at final rest positions immediately.
- [ ] No console errors, requestAnimationFrame loop is single-threaded (no double-registration), spring never explodes.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue063
