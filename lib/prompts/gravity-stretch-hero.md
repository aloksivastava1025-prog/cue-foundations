# Gravity Stretch Hero — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** Ideal as a bold, kinetic hero for a creative studio, type foundry, or game landing page wanting a physical, tactile first impression.

---

# PROMPT — Gravity Stretch Hero (paste-ready, pixel-perfect)

Build a **single self-contained `stretch.html`** file — vanilla HTML/CSS/JS, no libraries, no build step, zero external images. It renders a single hero page showcasing a **per-letter "gravity stretch" text effect** in the style of follow.art. Save as one HTML file that opens on `file://` or any static server.

## 1. Page layout (fixed, no scroll)

- `html, body`: `height: 100%; overflow: hidden`
- Radial gradient background: `radial-gradient(120% 90% at 50% 30%, #3f66ff 0%, #1a44ff 45%, #0025c0 100%)` — deep electric blue
- Subtle grain overlay: `body::after { position:fixed; inset:0; background-image: radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px); background-size: 3px 3px; mix-blend-mode: overlay; opacity: .5; pointer-events: none }`

## 2. Typography

- **Headline font**: `'Bebas Neue'` from Google Fonts (weight 400, tall condensed display face). Fallback stack: `'Barlow Condensed', Impact, sans-serif`.
- **UI font**: `'JetBrains Mono'` weights 400 + 700.
- Preconnect + link both from `fonts.googleapis.com`.

## 3. The main effect — GRAVITY STRETCH

A single word (default `"OVERCLOCK"`) rendered as **individual `<span class="letter">` elements** inside a `<div class="word">`. Each letter can be independently transformed. Mouse hover pulls letters **downward** as if by gravity, weighted by each letter's mass.

### 3.1 Per-letter base rhythm (each letter is a different height)

Assign each letter a base `scaleY` value from this exact array (visual rhythm like follow.art's FOLLOW.ART):

```
OVERCLOCK base scaleY = [1.15, 0.82, 1.05, 0.95, 1.22, 0.78, 1.10, 0.90, 1.18]
```

For any other user-typed word, generate deterministically:
- Seed = char-code sum × 31 rolling
- LCG: `seed = (seed * 1664525 + 1013904223) >>> 0`
- Value = `0.75 + (seed & 0xffff) / 0xffff * 0.5` → 0.75..1.25, rounded to 2 decimals
- Post-process: if two adjacent values differ by <0.05, nudge by ±0.12 to keep rhythm visible

### 3.2 Resting gravity droop (baked into initial state)

Even at rest — before any hover — each letter carries a permanent gravity pull:

```
restScale = base + RESTING_PULL * base    // where RESTING_PULL = 0.22
```

Apply this via inline `style.transform = "scaleY(<restScale>)"` when the letter is created.  
CSS `transform-origin: 50% 0%` — letters HANG from the top; every added scaleY extends downward.  
`.word { display: inline-flex; align-items: flex-start }` so all letter tops share a single baseline.

### 3.3 Hover math (Gaussian rubber-band pull)

On `mousemove` over the word:
- Measure each letter's center X (via `getBoundingClientRect()`)
- For each letter: `dx = centerX - mouseX`
- `sigma = max(80, wordWidth * 0.06)` — tight falloff, only letters near mouse react
- `target = exp(-dx² / (2 * sigma²))` — Gaussian bell, 0..1
- Spring integrate per letter with `STIFF = 0.14`, `DAMP = 0.92` (default smooth mode):
  - `vel = (vel + (target - curr) * STIFF) * DAMP`
  - `curr += vel`
- Apply transform:
  - `hoverDroop = curr * MAX_STRETCH * weight` (MAX_STRETCH = 0.32, weight = base)
  - `scaleY = restScale + hoverDroop`
  - `scaleX = 1 - curr * 0.06` (subtle horizontal squeeze under load — sells the weight)
  - `transform: scaleY(<scaleY>) scaleX(<scaleX>)`

Heavier letters (higher base) droop more under hover — weight-based physics.

### 3.4 Mouse leave → elastic snap back

- Reset each letter's `target = 0`
- Add class `.resting` to `.word`
- CSS handles transition:
  - **Smooth mode (default)**: `transition: transform 700ms cubic-bezier(0.32, 0, 0.2, 1)`
  - **Bouncy mode** (`.word.bouncy.resting .letter`): `transition: transform 1100ms cubic-bezier(0.22, 1.65, 0.32, 1)` — elastic overshoot
- After ~1150ms, reset `curr = 0, vel = 0` on each letter and re-apply resting transform so next hover starts fresh
- Also swap the JS spring damping: `DAMP = 0.74` in bouncy mode vs `0.92` smooth (bouncy has overshoot in the live phase too)

## 4. Auto-fit — dual-cap (width AND height)

Font-size is calculated dynamically with **two constraints** so short words (`CUE`, `HI`) don't overflow vertically:

1. Wait for `document.fonts.ready` (else Impact fallback is measured)
2. Set `wordEl.style.fontSize = '100px'` as reference
3. Measure both `naturalWidth` and `naturalHeight` via `getBoundingClientRect()`
4. Compute two candidate sizes:
   - `sizeByW = 100 * (window.innerWidth  * 0.96 / naturalWidth)`
   - `sizeByH = 100 * (window.innerHeight * 0.62 / naturalHeight)`
5. `newSize = Math.min(sizeByW, sizeByH)` — whichever constraint runs out first wins
6. Apply `wordEl.style.fontSize = newSize + 'px'`
7. Re-run on `resize`, on `ResizeObserver(document.documentElement)`, and via 100 ms polling for the first 2 s (guards against pane compositing at 0×0)
8. Skip when `window.innerWidth < 50`

Result: long words like `OVERCLOCK` are width-limited (96% wide, ~41% tall), short words like `CUE` are height-limited (~48% wide, 62% tall). No overflow at any word length.

Initial fallback CSS `font-size: 24vw` so nothing looks broken before JS runs.  
`.word { visibility: hidden }` until JS adds `.sized` class → prevents FOUC.

### Word CSS (base)

```css
.word {
  font-family: 'Bebas Neue', 'Barlow Condensed', Impact, sans-serif;
  font-weight: 400;
  font-size: 24vw;                    /* JS overrides */
  line-height: 0.9;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: #fff;
  display: inline-flex;
  align-items: flex-start;
  gap: 0;
  white-space: nowrap;
  user-select: none;
  visibility: hidden;
}
.word.sized { visibility: visible; }
.letter {
  display: inline-block;
  transform-origin: 50% 0%;
  will-change: transform;
}
```

### Stage CSS (positioning)

```css
.stage {
  position: fixed; inset: 0;
  display: flex;
  align-items: flex-start;             /* word sits toward the top */
  justify-content: center;
  padding-top: 8vh;                    /* room BELOW for gravity droop */
  cursor: none;
}
```

## 5. Glass BOUNCE toggle (top-center)

Awwwards-style glassmorphism pill.

- Position: `fixed; top: 28px; left: 50%; transform: translateX(-50%); z-index: 30`
- Structure: `<label> "Bounce" </label> <switch/> <state>Off/On</state>`
- Pill: `padding: 10px 16px 10px 22px; border-radius: 999px`
- Glass: `background: rgba(255,255,255,0.08); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); border: 1px solid rgba(255,255,255,0.18)`
- Shadow: `0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)`
- Font: `'JetBrains Mono'` weight 700, `font-size: 11px; letter-spacing: 2px; text-transform: uppercase`
- Colors: `.label` `rgba(255,255,255,.85)`; `.state` `rgba(255,255,255,.55)` off, `#ff2e63` on

### Switch knob (46×24, pill)

- Track: `width:46px; height:24px; background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.24); border-radius:999px; box-shadow: inset 0 2px 6px rgba(0,0,0,.2)`
- Knob (::after): `top:2px; left:2px; width:18px; height:18px; background:#fff; border-radius:50%; box-shadow: 0 2px 6px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.5); transition: transform .32s cubic-bezier(0.4,0,0.2,1)`
- ON state: `background: rgba(255,46,99,0.35); border-color: rgba(255,46,99,0.55)`; knob `transform: translateX(22px); background:#ff2e63; box-shadow: 0 2px 12px rgba(255,46,99,.5)`

### Behavior

- Click OR keyboard (`space`/`enter`) toggles
- Toggling swaps:
  - Live spring damping: 0.92 (smooth) ↔ 0.74 (bouncy)
  - CSS transition on `.letter` via `.word.bouncy` class
- `aria-checked` + `role="switch"` + `tabindex="0"` for accessibility

## 6. Glass WORD input (bottom-center)

Same glass style as the toggle. Position: `fixed; left: 50%; bottom: 88px; transform: translateX(-50%); z-index: 30`.

Structure: `<label>Word</label> <input placeholder="Type anything…"> <button>Apply</button>`

- Container padding: `8px 8px 8px 20px; gap: 12px`
- Input: `background: transparent; border: none; outline: none; color: #fff; font: 700 13px 'JetBrains Mono'; letter-spacing: 2px; text-transform: uppercase; width: 190px; caret-color: #ff2e63`
- Placeholder: `rgba(255,255,255,.35)`
- Apply button: `background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.24); color:#fff; border-radius:999px; padding: 8px 16px; font: 700 11px 'JetBrains Mono'; letter-spacing:2px; text-transform: uppercase`
- Apply hover: `background: #ff2e63; color:#fff; border-color:#ff2e63; box-shadow: 0 0 20px rgba(255,46,99,.5)`

### Input behavior

- On click Apply, Enter key, or 220 ms after typing stops → call `setWord(input.value)`
- `setWord()` = trim, uppercase, slice to 16 chars, bail if empty or unchanged; recompute BASE via deterministic rhythm; rebuild letters; call `autofit()`
- Placeholder shows current word (`OVERCLOCK` on load)
- `maxlength="16"`, `spellcheck="false"`, `autocomplete="off"`

## 7. Custom cursor (mouse only, hidden on touch)

```html
<div class="cursor" id="cursor"></div>
```

- Fixed, 14×14 white circle, `border-radius:50%; mix-blend-mode:difference; pointer-events:none; z-index:20`
- Transform-based positioning: `transform: translate(-50%, -50%)` + `left/top` updated on `mousemove`
- Add `.active` when hovering the word → grows to 40×40, background `#ff2e63`
- Transitions `width .2s, height .2s, background .2s`
- `@media (hover: none)` hides it and restores default cursor on stage/word

## 8. Small labels (corners)

- **Top-left** brand chip: `"OVERCLOCK.EXE — GRAVITY STRETCH"` (`.EXE` accent color `#fff`), `font: 12px 'JetBrains Mono'; letter-spacing:3px; color: rgba(255,255,255,.75)`
- **Bottom-right** play link: `"▶ Play the Game"` → `href="index.html"`, `border: 1.5px solid rgba(255,255,255,.6); padding: 12px 22px; letter-spacing:3px; text-transform: uppercase`. Hover: `background:#fff; color:#1a44ff`
- **Bottom-center hint** (below input): `"✷ Hover the word — heavier letters droop more ↓"`, `font: 11px 'JetBrains Mono'; letter-spacing:4px; color: rgba(255,255,255,.6); text-transform:uppercase`

## 9. Touch support

- `touchstart`, `touchmove` → mirror mouse position
- `touchend` → same as mouseleave

## 10. Constants (single-source)

```js
const MAX_STRETCH       = 0.32;   // extra droop on hover
const RESTING_PULL      = 0.22;   // permanent gravity droop at rest (weighted)
const SIGMA_FRAC        = 0.06;   // gaussian sigma as fraction of word width
const SPRING_STIFF      = 0.14;
const SPRING_DAMP_SMOOTH= 0.92;   // toggle OFF
const SPRING_DAMP_BOUNCY= 0.74;   // toggle ON — elastic overshoot
const TARGET_FILL_W     = 0.96;   // max word width / viewport width
const TARGET_FILL_H     = 0.62;   // max word height / viewport height (caps short words)
```

## 11. Render loop

- Single `requestAnimationFrame` loop
- Only integrates spring math when `active === true` (mouse over word)
- When inactive: CSS transition on `.resting` handles snap-back; JS is idle
- After a mouseleave, `setTimeout(1150ms)` resets `curr = 0, vel = 0` and re-applies `restScale` transform (so next hover starts from a clean state, doesn't collide with residual velocity)

## 12. Deliverable checklist

- [ ] Single `stretch.html` file, no external assets besides Google Fonts CDN
- [ ] Long words (≥6 chars) fill 96% viewport width; short words (≤5 chars) cap at 62% viewport height — no overflow at any word length
- [ ] Each letter has a unique base height (rhythm) visible even at rest
- [ ] Bottoms of letters visibly spread by ~80 px at rest — gravity is felt without hover
- [ ] Letters share the same TOP baseline (align-items: flex-start + transform-origin top)
- [ ] Hover pulls nearby letters downward, heavier letters droop more, tight falloff (only 2–3 letters affected)
- [ ] Toggle OFF → smooth ease back, no overshoot
- [ ] Toggle ON → elastic rubber-band overshoot with visible bounce
- [ ] Word input accepts any text, uppercases, rebuilds letters + auto-fits
- [ ] Custom cursor: white 14 px dot, grows to 40 px pink on word hover
- [ ] Keyboard-accessible toggle
- [ ] Zero libraries. Zero build step. Runs from `file://` or any static server.

---

### Optional polish (nice-to-have, not required)

- Fade-in the word after fonts are loaded (`.word.sized`)
- Poll autofit for the first 2 s to guard against 0×0 viewport composition on embed iframes
- Debounce input to 220 ms so typing doesn't rebuild on every keystroke
- Nudge base scales when two adjacent letters would render at the same height (keeps the rhythm reading)

---

**Awwwards-tier version →** https://cuedesign.space/component/cue004
