# Burn Reveal Text Scene — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** Fits a moody creative studio or field-notes editorial hero where scroll dwell time and dramatic type reveal reinforce a crafted, cinematic brand voice.

---

# PROMPT — Burn Reveal (scroll-pinned glyph-by-glyph fire dissolve)

You are a senior creative front-end engineer. Build a **single-file HTML** hero: three paragraphs take turns center-stage, each **zooming in**, holding briefly, then **burning away character-by-character** — chars rise, twist, warm to yellow → orange → red, blur, then vanish. Behind the burn a subtle **red / cyan chromatic split** on every glyph gives a permanent low-fi glitch feel. A **grain overlay** breathes over the whole stage. Bottom-left counter (`01 / 03`) tracks which paragraph is active. Port of a Framer text-burn scene, adapted so each glyph's fade + physical melt is driven purely by CSS custom properties (`--t` per glyph, `--b` per paragraph).

**Framework:** Vanilla HTML + CSS + JS, single file. No libraries. Only Google Fonts (`Inter`).

**Deliverable:** save at exactly `burn-reveal/index.html`.

---

## COPY (locked)

```
Panel 1  →  Great design isn't just what a thing looks like — it's how it stays with you.
Panel 2  →  Every pixel earns its place. Every second is deliberate. Every detail is a choice.
Panel 3  →  Ship it anyway. Then go looking for the one waiting behind that.
```

Bottom-left counter: `01 / 03` (auto-updates to `02 / 03`, `03 / 03` as active panel changes).
Bottom-center hint: `scroll down` (Inter 0.65rem, uppercase, letter-spacing `0.22em`, `rgba(255,255,255,0.6)`).
Footer at end: `Halka Studio · Field Notes`.

---

## DESIGN TOKENS (paste-verbatim CSS)

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: 'Inter', -apple-system, sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Sticky pin: outer wrapper gives the scroll length; the stage sticks
   at top: 0. Longer .pin-wrap = slower scroll. */
.pin-wrap {
  position: relative;
  height: 520vh;
}
.stage {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #000;
}

/* Three paragraph panels, absolutely stacked. Scale + opacity animate from JS. */
.panel {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  will-change: transform, opacity;
}
.panel p {
  position: relative;
  width: min(84vw, 36rem);
  text-align: center;
  font-size: clamp(20px, 2.6vw, 32px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #fff;
  --b: 0;                             /* JS drives 0 → 1.10 during burn */
  --ab: 0.35;                         /* chromatic split in px */
  text-shadow:
    calc(var(--ab) * -1px) 0 rgb(255 45 85 / 0.85),
    calc(var(--ab) *  1px) 0 rgb(0 225 255 / 0.85);
}
```

**Grain overlay** — SVG turbulence baked as base64-ish data URL:
```css
.grain {
  pointer-events: none;
  position: absolute; inset: 0;
  opacity: 0.35;
  background-size: 180px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='gamma' exponent='4'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
}
```

---

## GLYPH BURN (locked — the core effect)

Every character of every paragraph is wrapped in a `<span data-glyph>` with its own `--t` value (see JS builder). The paragraph itself carries `--b` and `--ab` custom properties. All motion + fade of each glyph is expressed in pure CSS:

```css
.panel [data-glyph] {
  display: inline-block;
  transition: none;
  will-change: transform, opacity, filter, color;
  /* --bp: per-glyph burn amount, clamped 0..1, sharpened *4 */
  --bp: max(0, min(1, calc((var(--b, 0) - var(--t, 1) + 0.16) * 4)));
  /* Framer-original opacity formula — chars flicker together before their turn */
  opacity: calc((var(--t, 1) + 0.09 - var(--b, 0)) * 11);
  /* Physical melt — rise, sideways jitter based on --t, twist, scale up */
  transform:
    translateY(calc(var(--bp) * -22px))
    translateX(calc((var(--t, 0.5) - 0.5) * var(--bp) * 8px))
    rotate(calc(var(--bp) * 4deg))
    scale(calc(1 + var(--bp) * 0.45));
  filter: blur(calc(var(--bp) * 2.8px));
  /* Warm color shift: white → yellow → orange → red */
  color: rgb(
    255,
    calc(255 - var(--bp) * 160),
    calc(255 - var(--bp) * 240)
  );
  /* Chromatic split + ember glow that grows with burn */
  text-shadow:
    calc(var(--ab) * -1px) 0 rgb(255 45 85 / 0.85),
    calc(var(--ab) *  1px) 0 rgb(0 225 255 / 0.85),
    0 calc(var(--bp) * -6px)  calc(var(--bp) * 14px) rgba(255, 200, 90, calc(var(--bp) * 0.85)),
    0 calc(var(--bp) * -14px) calc(var(--bp) * 32px) rgba(255, 110, 20, calc(var(--bp) * 0.55));
}
```

**No background glow.** Stage stays pure `#000`; the ember comes only from the text-shadow on each burning glyph.

---

## GLYPH `--t` VALUES (locked)

Each glyph's threshold comes from a small pseudo-noise sum so nearby letters share similar burn timings (chars burn in coherent waves, not confetti):

```js
function noiseAt(i, seed) {
  const x = Math.sin((i + seed) * 0.42) * 0.5
          + Math.sin((i + seed) * 0.13) * 0.35
          + Math.sin((i + seed) * 0.09) * 0.15;
  return 0.35 + (x + 0.5) * 0.55;      // ~0.30 .. 0.95
}

function wrapGlyphs(el, seed) {
  const text = el.textContent;
  el.textContent = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === " ") { el.appendChild(document.createTextNode(" ")); continue; }
    const span = document.createElement("span");
    span.dataset.glyph = "true";
    span.textContent = ch;
    span.style.setProperty("--t", noiseAt(i, seed).toFixed(4));
    el.appendChild(span);
  }
}
```

Seeds per panel: `3, 20, 37` (formula `i * 17 + 3`) — keeps each panel's burn pattern distinct.

---

## SCROLL TIMING (locked)

Three panels, each with an **enter → hold → burn** window inside the overall pin-wrap progress `raw ∈ [0, 1]`:

| Panel | in       | hold        | burn        |
|-------|----------|-------------|-------------|
| 1     | 0.00–0.10 | 0.10–0.22  | 0.22–0.34   |
| 2     | 0.32–0.44 | 0.44–0.56  | 0.56–0.68   |
| 3     | 0.66–0.80 | 0.80–0.95  | 0.95–1.00   |

**Panel transform:**
```
enterP  = clamp01(subRange(raw, in[0],   in[1]))
burnP   = clamp01(subRange(raw, burn[0], burn[1]))
scale   = 0.24 + easeOut(enterP) * 0.76 + easeOut(burnP) * 0.10
opacity = enterP * (1 − burnP²)
--b     = burnP * 1.10
```

Where:
```js
const clamp01  = v => Math.max(0, Math.min(1, v));
const subRange = (p, from, to) => clamp01((p - from) / (to - from));
const easeOut  = t => 1 - Math.pow(1 - t, 3);
```

**Scroll progress** (rAF-throttled):
```js
function update() {
  const rect  = pin.getBoundingClientRect();
  const vh    = window.innerHeight;
  const total = pin.offsetHeight - vh;
  const raw   = clamp01(-rect.top / total);
  /* ...paint each panel + set counter to the panel with highest opacity... */
}
```

**Counter update rule:** each frame pick the panel with the highest current `opacity`, show `NN / 03`.

---

## Responsive

- **≥ 641px** — full spec.
- **≤ 640px** — font size clamps down naturally; keep `.panel p { width: min(84vw, 36rem) }` so paragraphs never touch the edges.
- **Touch** — scroll works natively.
- **`prefers-reduced-motion: reduce`** — drop `scroll-behavior: smooth` only. Do NOT disable the burn — it's the whole point; it's scroll-driven, not auto-motion.

---

## Deliverable checklist

- [ ] Single file at `burn-reveal/index.html`.
- [ ] Google Fonts `Inter:wght@400;500;600;700;800`.
- [ ] Body `#000` bg, `#fff` text; no ambient glow, no colored background.
- [ ] `.pin-wrap { height: 520vh }`, `.stage { position: sticky; top: 0; height: 100vh; overflow: hidden }`.
- [ ] 3 stacked `.panel` divs inside the stage.
- [ ] Counter fixed bottom-left, `01 / 03` format, `letter-spacing: 0.22em`, tabular-nums.
- [ ] Grain overlay via inline SVG turbulence data URL at 35% opacity.
- [ ] `wrapGlyphs` wraps every non-space character in `<span data-glyph>` with a `--t` value from the noise formula.
- [ ] Per-glyph `--bp = max(0, min(1, calc((var(--b) - var(--t) + 0.16) * 4)))`.
- [ ] Opacity formula `(var(--t, 1) + 0.09 - var(--b, 0)) * 11`.
- [ ] Transform: `translateY(-22px * bp)` + jitter X + `rotate(4deg * bp)` + `scale(1 + 0.45 * bp)`.
- [ ] `filter: blur(2.8px * bp)`, warm color shift, ember text-shadow (yellow at -6/14, orange at -14/32).
- [ ] Chromatic red/cyan split via `text-shadow: ±0.35px 0 rgb(255 45 85 / 0.85), rgb(0 225 255 / 0.85)`.
- [ ] Per-panel timing table exactly as specced.
- [ ] Counter DOM update = `String(topIdx + 1).padStart(2, "0") + " / 03"` (chose panel with highest opacity).
- [ ] rAF-throttled scroll + resize listeners + initial `update()`.
- [ ] `prefers-reduced-motion` only strips `scroll-behavior: smooth`.

---

## REFERENCE

The complete working source lives at `burn-reveal/index.html` in this repo. Reproduce it byte-for-byte — every scroll range, `--bp` sharpness (`* 4`), noise formula, and text-shadow layer is tuned. Original Framer scene ported: glyph opacity formula `(t + 0.09 - b) * 11` + chromatic RGB split at ±0.35 px + grain via SVG turbulence.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue120
