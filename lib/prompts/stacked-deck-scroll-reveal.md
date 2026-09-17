# Stacked Deck Scroll Reveal — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for agency or studio portfolio sites showcasing selected work, where a cinematic scroll-driven card reveal elevates a project index page.

---

# Stack Scroll — pixel-perfect build prompt (CMS-friendly, responsive)

**Purpose:** a pinned-scroll deck of stacked cards. On scroll into the section, N cards slide up from below the viewport and settle into a staggered stack (each ~42px lower than the previous, gently scaled down). Then card-by-card the top card flies out toward the top-left (`y: -115vh, rotate: -25deg`) while cards behind advance forward to fill the void, until only the last card remains. Around it: two flat white sections (intro + outro) each containing a small "Scroll down / Scroll up" hint.

**Framework:** single-file `index.html`, no build step. GSAP 3.13 + ScrollTrigger + Lenis via CDN. GSAP loaded via `<script>` (not import) so classic UMD `gsap` global is available.

**Deliverable:** one paste-ready `index.html` that pins the stack section for `N × 100vh` of scroll and choreographs the whole deck.

---

## CMS integration

Model each card as `{ title, index, lede, body, ctaLabel, ctaHref, image, tone }`:

```html
<script id="stack-config" type="application/json">
{
  "intro":  { "hint": "Scroll down" },
  "sectionTitle": "Selected work",
  "outro":  { "hint": "End · Scroll up to replay" },
  "cards": [
    { "title": "Fable",   "index": "01", "lede": "…", "body": "…",
      "ctaLabel": "View the case", "ctaHref": "#",
      "image": "…", "tone": "1" },
    /* … 5 cards default; 4–6 works well */
  ]
}
</script>
```

**Tone knob** — `tone` maps to `--card-N` CSS variables (1–5). Default palette: lime, ivory, teal, sand, lavender. Change the variables to re-theme; the cards inherit automatically.

**Card count** — 4–6 is the sweet spot. Under 4 the stack feels sparse; over 6 the scroll runway (`N × innerHeight`) becomes excessive.

---

## ASSETS

```txt
FONTS (Google):
  Instrument Serif — 400        (card titles, index numbers, section header)
  DM Sans          — 400..600   (body copy, CTA, plain hints)

IMAGES: 1 per card — editorial portraits, product shots, or lifestyle
  See `reference_pinterest-image-bank.md` for curated URLs

DEPS (CDN):
  https://unpkg.com/gsap@3.13.0/dist/gsap.min.js
  https://unpkg.com/gsap@3.13.0/dist/ScrollTrigger.min.js
  https://cdn.jsdelivr.net/npm/lenis@1.3.23/+esm       (imported as module)
```

---

## COPY defaults

```txt
INTRO_HINT     = "Scroll down ↓"
SECTION_TITLE  = "Our practice"
OUTRO_HINT     = "↑ End · Scroll up to replay"

CARDS = [
  { title: "Fable",   lede: "A brand book for a slow-fashion label…" },
  { title: "Contour", lede: "Motion identity for an eyewear studio." },
  { title: "Ember",   lede: "Packaging and print for a natural incense line." },
  { title: "Halo",    lede: "Art direction for a jewelry season." },
  { title: "Bloom",   lede: "Editorial layout for a print quarterly." },
]
```

Each card gets a **specific, non-generic body**. Real numbers (Issue No. 07, 148 pages, 24 pieces, 4 sittings) beat "we do great work" copy every time in editorial layouts.

---

## DESIGN TOKENS (paste verbatim)

```css
:root {
  --font-editorial: "Instrument Serif", "Times New Roman", Times, serif;
  --font-sans:      "DM Sans", system-ui, sans-serif;
  --bg-ink:         #121212;
  --bg-soft:        #ffffff;
  --text-ink:       #141414;
  --text-muted:     #5c5c5c;
  --accent:         #d6ef4a;

  /* Card tones — one per data-tone value */
  --card-1: #d6ef4a;   /* lime yellow */
  --card-2: #f4f4f2;   /* ivory */
  --card-3: #6db5a8;   /* teal */
  --card-4: #e8d5c4;   /* sand */
  --card-5: #c8b8e8;   /* lavender */
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--font-sans);
  color: var(--text-ink);
  background: var(--bg-soft);
  -webkit-font-smoothing: antialiased;
}

/* Plain intro / outro sections */
.plain {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.plain::before { content: ""; position: absolute; inset: 0; background: #fff; pointer-events: none; }
.plain__inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.plain__inner .arrow          { display: inline-block; animation: nudge   1.8s ease-in-out infinite; }
.plain--outro .plain__inner .arrow { animation: nudgeUp 1.8s ease-in-out infinite; }
@keyframes nudge   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px);  } }
@keyframes nudgeUp { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

/* Stack section (pinned) */
.stack {
  position: relative;
  background: var(--bg-ink);
  color: #fff;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(1.75rem, 4vh, 2.75rem) 1.25rem clamp(2rem, 5vh, 3.5rem);
}
.stack__header {
  flex-shrink: 0;
  text-align: center;
  z-index: 20;
  pointer-events: none;
  margin-bottom: clamp(1.5rem, 5vh, 3.5rem);
  margin-top: 2rem;
}
.stack__header h2 {
  font-family: var(--font-editorial);
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 400;
}
.stack__stage { position: relative; width: min(1100px, 100%); flex: 0 0 auto; margin: auto 0; }
.stack__deck  { position: relative; width: 100%; height: min(62vh, 540px); }

/* Card */
.card {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;                /* text | image, equal columns */
  gap: clamp(1rem, 3vw, 2.5rem);
  padding: clamp(1.25rem, 3vw, 2.25rem);
  border-radius: 2px;
  transform-origin: center top;
  will-change: transform;
  box-shadow: 0 18px 50px rgba(0,0,0,0.28);
}
.card[data-tone="1"] { background: var(--card-1); color: var(--text-ink); }
.card[data-tone="2"] { background: var(--card-2); color: var(--text-ink); }
.card[data-tone="3"] { background: var(--card-3); color: var(--text-ink); }
.card[data-tone="4"] { background: var(--card-4); color: var(--text-ink); }
.card[data-tone="5"] { background: var(--card-5); color: var(--text-ink); }

.card__content { display: flex; flex-direction: column; min-width: 0; }
.card__top { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.65rem; }
.card__title { font-family: var(--font-editorial); font-size: clamp(2rem, 4.5vw, 3.4rem); line-height: 1; letter-spacing: -0.02em; }
.card__index { font-family: var(--font-editorial); font-size: clamp(1.5rem, 3vw, 2.25rem); opacity: 0.35; line-height: 1; flex-shrink: 0; }
.card__lede  { font-size: clamp(0.85rem, 1.4vw, 1rem); line-height: 1.45; max-width: 28ch; opacity: 0.75; margin-bottom: auto; }
.card__body  { font-size: clamp(0.8rem, 1.2vw, 0.92rem); line-height: 1.55; max-width: 36ch; opacity: 0.85; margin: 1.5rem 0 1.25rem; }

.card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  align-self: flex-start;
  background: #111;
  color: #fff;
  text-decoration: none;
  font-size: 0.85rem;
  padding: 0.55rem 0.55rem 0.55rem 1rem;
  transition: transform 0.25s ease;
}
.card__cta:hover { transform: translateY(-1px); }
.card__cta-arrow {
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  background: var(--accent);
  color: #111;
  font-size: 0.95rem;
}

.card__media { position: relative; min-height: 0; display: flex; justify-content: flex-end; align-items: stretch; }
.card__frame {
  width: 100%;
  height: 100%;                                       /* fills entire media column */
  overflow: hidden;
  background: #1a1a1a;
  box-shadow: 0 10px 28px rgba(0,0,0,0.14);
}
.card__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  animation: kenburns 12s ease-in-out infinite alternate;   /* subtle life on stills */
}
@keyframes kenburns {
  from { transform: scale(1);    }
  to   { transform: scale(1.08); }
}

@media (max-width: 768px) {
  .stack__header { margin-bottom: clamp(1.75rem, 5vh, 2.75rem); }
  .card {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(220px, 55%) 1fr;       /* image row taller on mobile */
  }
  .card__media { order: -1; height: 100%; }
  .card__frame { width: 100%; height: 100%; aspect-ratio: auto; }
  .card__body  { margin: 0.75rem 0 1rem; font-size: 0.8rem; }
  .card__lede  { font-size: 0.85rem; }
  .stack__deck { height: min(72vh, 620px); }
}
```

Locked values:
- **`--bg-soft: #ffffff`** — pure white plains. Source used `#eceae4`; changed for cleaner contrast against dark stack.
- **`.card grid: 1fr 1fr`** — text and image split 50/50 on desktop. Source used `1.15fr 0.85fr` (text heavy); changed for bigger images per Peeyush's ask.
- **`.card__frame height: 100%`** — image fills the whole media column, no aspect-ratio cap. Source had 3:4 cap that made images narrow.
- **Mobile grid-rows `minmax(220px, 55%) 1fr`** — image gets min 220px OR 55%, whichever larger. Ensures image feels substantial on phones.
- **Ken Burns 12s alternating** — subtle scale 1 → 1.08 on card images. Makes stills feel alive without being distracting.

---

## STRUCTURE

```html
<section class="plain plain--intro">
  <div class="plain__inner">
    <span>Scroll down</span>
    <span class="arrow">↓</span>
  </div>
</section>

<section class="stack" id="stack">
  <div class="stack__header"><h2>Our practice</h2></div>
  <div class="stack__stage">
    <div class="stack__deck">
      <article class="card" data-tone="1">…</article>
      <article class="card" data-tone="2">…</article>
      <article class="card" data-tone="3">…</article>
      <article class="card" data-tone="4">…</article>
      <article class="card" data-tone="5">…</article>
    </div>
  </div>
</section>

<section class="plain plain--outro" id="outro">
  <div class="plain__inner">
    <span class="arrow">↑</span>
    <span>End · Scroll up to replay</span>
  </div>
</section>
```

Each `.card` follows the same interior template (title/index/lede/body/cta on the left, media frame on the right).

---

## MOTION SYSTEM (locked)

### Lenis wiring

```js
const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Custom exponential ease on Lenis for a lighter, snappier scroll feel than default.

### Stack geometry

```js
const cards = gsap.utils.toArray(".card");
const PEEK = 42;             /* vertical offset between stacked cards, in px  */
const SCALE_STEP = 0.045;    /* each card behind shrinks by this factor       */

function stackPose(index) {
  return {
    y:     index * PEEK,
    scale: 1 - index * SCALE_STEP,
  };
}
```

Card `i` sits `42i` px below the top card, scaled to `1 - 0.045·i`. So card 0 = full size, card 4 = `~82%` scale.

### Initial state

```js
cards.forEach((card, i) => {
  gsap.set(card, {
    zIndex: cards.length - i,                     /* stacking order (later = below) */
    y: window.innerHeight * 0.72 + i * PEEK,      /* start pushed below viewport    */
    scale: stackPose(i).scale * 0.9,              /* start slightly smaller         */
    rotate: 0,
    transformOrigin: "50% 0%",                    /* rotate/scale from top-center   */
  });
});
```

### Master timeline (pinned)

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#stack",
    start: "top top",
    end: () => `+=${cards.length * window.innerHeight}`,   /* N viewports */
    pin: true,
    scrub: true,
    invalidateOnRefresh: true,
  },
});
```

**Phase 1 — cards slide up into the stack**

```js
cards.forEach((card, i) => {
  tl.to(card, {
    ...stackPose(i),
    ease: "power3.out",
    duration: 1.35,
  }, i * 0.06);              /* stagger 0.06s per card */
});
tl.to({}, { duration: 0.35 });   /* hold */
```

Each card animates from its below-viewport start to its stackPose position. 0.06s stagger = each card starts arriving as the previous is still landing.

**Phase 2 — cards fly out one by one; those behind advance**

```js
const flyAt   = tl.duration();
const flying  = cards.slice(0, -1);   /* everything except the last */

flying.forEach((card, i) => {
  const time    = flyAt + i;
  const behind  = cards.slice(i + 1);

  tl.to(card, {
    y: () => -window.innerHeight * 1.15,
    rotate: -25,
    scale: 0.94,
    ease: "none",
    duration: 1,
  }, time);

  tl.to(behind, {
    y:     (index) => stackPose(index).y,
    scale: (index) => stackPose(index).scale,
    ease:  "none",
    duration: 1,
  }, time);
});
tl.to({}, { duration: 0.4 });   /* final hold */
```

**Per fly:**
- Front card exits `y: -115vh, rotate: -25deg, scale: 0.94` — leaves toward top-left with a slight lean
- Cards behind advance simultaneously: `behind[j]` becomes `stackPose(j)` (formerly `stackPose(j+1)`)
- Runs at `time` = end-of-phase-1 + fly-index

`ease: "none"` on both because the timeline itself is scrubbed by Lenis �� adding an ease would double-ease and break the linear scroll mapping.

### Resize

```js
window.addEventListener("resize", () => ScrollTrigger.refresh());
```

---

## RESPONSIVE

Single breakpoint at 768px:

- `.card` grid: `1fr 1fr` → `1fr` (single column)
- `grid-template-rows: minmax(220px, 55%) 1fr` (image row taller)
- `.card__media order: -1` — image moves above text on mobile
- `.card__body` font drops to `0.8rem`, `.card__lede` to `0.85rem`
- `.stack__deck` grows to `min(72vh, 620px)` — extra vertical space for stacked image + text

All GSAP positions computed from `window.innerHeight` — automatically responsive without extra logic.

---

## MECHANICS notes

- **`transformOrigin: 50% 0%`** on every card — scales pull from the top-center, so cards behind never move visually as they shrink. Without this the shrinking cards would drift downward.
- **`zIndex` set once** — later cards render below; the timeline never touches `zIndex`, so the visual stacking stays consistent throughout both phases.
- **`ease: "power3.out"` on stack-in, `"none"` on fly-out** — the entrance benefits from an out-curve (fast settle), but the fly-out is scrubbed and needs linear mapping.
- **Function value returns** — `y: () => -window.innerHeight * 1.15` recalculates on refresh so the exit distance adapts to viewport size after resize.
- **`invalidateOnRefresh: true`** — GSAP recomputes tween start/end values on ScrollTrigger refresh. Without it, resize could leave cards mid-tween in wrong positions.
- **`window.innerHeight * 0.72`** starting y — 72% pushes cards below viewport but leaves them close enough that the first scroll tick registers movement (not a delay before anything happens).
- **`ScrollTrigger.refresh()` on resize** — recomputes end positions since `+=${cards.length * window.innerHeight}` uses vh multiplication.
- **Deck height `min(62vh, 540px)`** — locked to viewport height so tall screens don't get a tiny deck, short screens don't get overflow. Cap at 540px prevents oversized card art on 4K.

---

## DELIVERABLE CHECKLIST

- [ ] Single `index.html`, no build step
- [ ] GSAP 3.13 + ScrollTrigger via CDN `<script>` tags (UMD global)
- [ ] Lenis 1.3.23 via CDN `+esm` (module import)
- [ ] Pure white plain sections (source `#eceae4` → `#ffffff`)
- [ ] Intro + outro contain only `.plain__inner` with hint text + animated arrow
- [ ] Stack section pinned for `cards.length × innerHeight`
- [ ] 5 cards default, each with title + 01–05 index + lede + body + dark CTA with lime arrow chip
- [ ] Card grid `1fr 1fr` desktop, single column with `minmax(220px, 55%) 1fr` rows on mobile
- [ ] Image frame fills 100% × 100% of its column (no aspect cap)
- [ ] Ken Burns 12s scale 1 → 1.08 on card images
- [ ] Card tones 1–5 map to `--card-N` CSS variables (lime, ivory, teal, sand, lavender)
- [ ] Timeline: cards slide up staggered 0.06s each, `power3.out` 1.35s → 0.35s hold → fly-outs 1s each `ease: 'none'`, cards behind advance simultaneously
- [ ] `PEEK = 42px`, `SCALE_STEP = 0.045`
- [ ] `transformOrigin: 50% 0%` on every card
- [ ] `zIndex` set once from `cards.length - i`
- [ ] Resize triggers `ScrollTrigger.refresh()`

---

## REFERENCE

Source-of-truth file: `stack-scroll/index.html` in this repo.
Original source: `github.com/Hank-D-Tank/stack-scroll` (single-file HTML). Deviations: (1) `--bg-soft` cream `#eceae4` → white `#ffffff`, (2) `.plain::before` gradient blobs removed for flat white, (3) plain intro/outro big title + copy replaced with small centered hint text + animated arrow, (4) card grid `1.15fr 0.85fr` → `1fr 1fr` for bigger image column, (5) `.card__frame` 260px cap + 3:4 aspect removed → fills 100%, (6) mobile card grid rows `auto 1fr` → `minmax(220px, 55%) 1fr` for bigger mobile image, (7) Ken Burns 12s zoom added on card images, (8) 5-card portfolio content (Fable / Contour / Ember / Halo / Bloom) replacing agency services copy.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue148
