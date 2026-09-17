# Diagonal Field Journal Scroll — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** A travel editorial or geography magazine's feature story intro, connecting three regional destinations through scroll-driven cartography.

---

# Pixel-Perfect Prompt: Cinematic Stamp Story (Diagonal Scroll)

Build a single scroll-driven "field-journal" animation. As the user scrolls the page, the viewport is pinned and the scene travels **diagonally down-right** across three vintage postage stamps. A dotted yellow trail draws itself along the path connecting them, handwritten location names float in beside each stamp, and film-grain + vignette overlays sit above everything for a cinematic feel.

---

## ASSETS

Three local (or CDN) image files, one per stamp:

```
./img1.jpg   → placed inside stamp 1 (Monti Lessini)
./img2.jpg   → placed inside stamp 2 (Sant'Anna)
./img3.jpg   → placed inside stamp 3 (Alpi Veronesi)
```

## LIBRARIES (load in `<head>`)

```
GSAP core:      https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js
ScrollTrigger:  https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js
Fonts:          https://fonts.googleapis.com/css2?family=Anton&family=La+Belle+Aurore&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap
```

## DESIGN TOKENS

```css
--c-bg:      #000000;   /* pure black stage */
--c-yellow:  #f5d44f;   /* trail + accents */
--c-stamp:   #fdfbf7;   /* stamp paper */
--c-inner:   #f4f0e6;   /* inner paper of the stamp */
--c-text:    #ffffff;
```

## TYPOGRAPHY

- Body / UI text: `'Space Mono', monospace`, `font-weight:700`, `letter-spacing:0.08em`, small sizes (11–13px)
- Stamp header / footer: `'Anton', sans-serif` — 20px header / 24px footer, uppercase, `letter-spacing:0.06–0.1em`
- Stamp symbol letter (the round "B"): `'Playfair Display', serif`, weight 600, italic OK
- Floating handwritten location names: `'La Belle Aurore', cursive`, **72px**, `color:rgba(255,255,255,0.9)`, `text-shadow: 0 10px 20px rgba(0,0,0,0.6)`

---

## GLOBAL LAYOUT

```
body: background #000, color #fff, overflow-x:hidden, font-family Space Mono
```

### 1. Cinematic overlays (fixed, `pointer-events:none`, above the scene)

- `.grain` — `z-index:98`, `opacity:0.05`, background is an inline SVG `feTurbulence` noise pattern, tiled naturally. This is the "film" texture.
  ```css
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  ```
- `.cinematic-overlay` — `z-index:99`, `mix-blend-mode:multiply`, radial vignette: `radial-gradient(circle, transparent 40%, rgba(0,0,0,0.6) 120%)`

### 2. Fixed UI (`z-index:100`, `pointer-events:none`)

Full-viewport flex column with `padding:32px 48px`, `justify-content: space-between`.

**Top bar** — flex row, `font-size:13px; font-weight:700; letter-spacing:0.08em`, three spans, only individual spans get `pointer-events:auto`:
- `INDEX •`
- `ALL` (opacity 0.5)
- `ABOUT`

**Bottom bar** — centered, `font-size:11px; letter-spacing:0.17em; opacity:0.8`:
- `CAMPOSILVANO - N 45° 37' 53.51" E 11° 5' 46.01"`

---

## SCROLL SYSTEM

### `.scroll-wrapper`

- `width:100%; height:100vh; overflow:hidden; position:relative`

### `.horizontal-container` (the pinned scene)

- `width:400vw; height:300vh` — expanded on BOTH axes because the scene travels diagonally
- Absolutely positioned children

### `.trail-container` (SVG, matches container size)

- `position:absolute; top:0; left:0; width:400vw; height:300vh; z-index:2; pointer-events:none`
- `filter: drop-shadow(0 0 8px rgba(245,212,79,0.4))` — soft yellow glow on the trail

Inside, viewBox `0 0 4000 3000`, `preserveAspectRatio="none"`.

Two identical bezier paths, one used as a solid stroke MASK that is animated, and the visible dotted path is masked by it:

```html
<svg class="trail-container" preserveAspectRatio="none" viewBox="0 0 4000 3000">
  <defs>
    <mask id="draw-mask">
      <path class="solid-mask-path" stroke="white" stroke-width="40" fill="none"
            d="M 500 500 C 800 600, 1200 400, 1400 800
               C 1600 1200, 1500 1400, 2000 1350
               C 2500 1300, 2800 1100, 3000 1500
               S 3200 2000, 3500 2000" />
    </mask>
  </defs>
  <path class="dotted-path" mask="url(#draw-mask)"
        d="M 500 500 C 800 600, 1200 400, 1400 800
           C 1600 1200, 1500 1400, 2000 1350
           C 2500 1300, 2800 1100, 3000 1500
           S 3200 2000, 3500 2000" />
</svg>
```

`.dotted-path` styling:

```css
stroke: var(--c-yellow);
stroke-width: 8;
stroke-dasharray: 16 20;
stroke-linecap: round;
fill: none;
```

The trick: on load, use JS to set the mask stroke to `stroke-dasharray: pathLength; stroke-dashoffset: pathLength` — this makes the mask empty, hiding the entire dotted path underneath. Scrolling animates `stroke-dashoffset` back to `0`, revealing the yellow dotted trail from start to end **as the user scrolls**.

---

## STAMP CARDS

Three `.stamp-card-wrapper` divs positioned along the diagonal so the trail visually connects them.

| Card | Position | Rotation |
|---|---|---|
| `.card-1` | `left: 50vw;  top: 50vh;`  | `-4deg` |
| `.card-2` | `left: 200vw; top: 135vh;` | `+5deg` |
| `.card-3` | `left: 350vw; top: 200vh;` | `-3deg` |

Each wrapper uses `transform: translate(-50%, -50%) rotate(<angle>)` so the specified point is the card's center.

### `.stamp-card`

- `width: 280px; height: 380px`
- `position: relative`
- `filter: drop-shadow(0 30px 50px rgba(0,0,0,0.25))`
- Hover: `transform: scale(1.05) rotate(0deg)`, `transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`

### `.stamp-bg` — the perforated white paper

Absolute, `inset:0`, `background: var(--c-stamp)`. Uses a **pure-CSS double mask** to create the postage-stamp jagged edge (no SVG required):

```css
-webkit-mask:
  linear-gradient(#000 0 0) center / calc(100% - 20px) calc(100% - 20px) no-repeat,
  radial-gradient(circle at 10px 10px, transparent 5px, #000 5.5px) -10px -10px / 20px 20px;
mask:
  linear-gradient(#000 0 0) center / calc(100% - 20px) calc(100% - 20px) no-repeat,
  radial-gradient(circle at 10px 10px, transparent 5px, #000 5.5px) -10px -10px / 20px 20px;
```

The first layer is a solid center rectangle; the second is a 20×20 tile with a 5px transparent circle at each corner, offset by `-10px` so the perforations sit on the edge.

### `.stamp-inner`

- `position: absolute; inset: 20px`
- `border: 1px solid rgba(0,0,0,0.1)`
- `display: flex; flex-direction: column`
- `background: var(--c-inner)`
- `padding: 10px`
- `overflow: hidden`

Children (in DOM order):

1. **`.stamp-image`** — `flex:1; width:100%; object-fit:cover; filter: sepia(0.2) contrast(1.1) brightness(0.9)` for the vintage tint
2. **`.stamp-header`** — `position:absolute; top:20px; left:20px; right:20px; display:flex; justify-content:space-between; color:#fff; font-family:'Anton'; font-size:20px; letter-spacing:0.1em; text-shadow: 0 2px 10px rgba(0,0,0,0.3)`. Contains `<span>ITALIA</span>` on the left and `<div class="stamp-symbol">B</div>` on the right.
3. **`.stamp-symbol`** — `width:28px; height:28px; border:2px solid white; display:flex; align-items:center; justify-content:center; font-family:'Playfair Display'; font-weight:600; font-size:16px`
4. **`.stamp-footer`** — `position:absolute; bottom:20px; left:20px; right:20px; color:#fff; font-family:'Anton'; font-size:24px; letter-spacing:0.05em; text-transform:uppercase; text-shadow: 0 2px 10px rgba(0,0,0,0.5)`. Content differs per card: `MONTI LESSINI`, `SANT'ANNA`, `ALPI VERONESI`.

---

## HANDWRITTEN LOCATION NAMES

Each stamp card has a floating handwritten label anchored **outside** its wrapper.

`.handwriting-text` base:
- `position: absolute`
- `font-family: 'La Belle Aurore', cursive`
- `font-size: 72px`
- `color: rgba(255,255,255,0.9)`
- `white-space: nowrap`
- `pointer-events: none`
- `opacity: 0` (initial, animated to 1)
- `text-shadow: 0 10px 20px rgba(0,0,0,0.6)`

Per-card placement + rotation (position values are relative to the `.stamp-card-wrapper`, which is why percentages are >100%):

```css
.hw-1 { top: 15%;  left: 125%;  transform: translateY(30px) rotate(-6deg); }  /* label to the right of stamp 1 */
.hw-2 { top: 35%;  right: 125%; transform: translateY(30px) rotate(8deg); }   /* label to the left of stamp 2 */
.hw-3 { top: 25%;  left: 125%;  transform: translateY(30px) rotate(-5deg); }  /* label to the right of stamp 3 */
```

Content per label: `Monti Lessini`, `Sant'Anna`, `Alpi Veronesi` (mixed case, cursive — do NOT uppercase).

Each label animates to `{ opacity: 1, y: 0 }` — hw-1 immediately on load (0.5s delay, 1.5s duration), hw-2 and hw-3 tied to scroll progress at `0.45` and `0.95` of the master timeline.

---

## GSAP TIMELINE

Register plugin, grab elements, hide the mask stroke on load:

```js
gsap.registerPlugin(ScrollTrigger);
const container  = document.querySelector('.horizontal-container');
const maskPath   = document.querySelector('.solid-mask-path');
const pathLength = maskPath.getTotalLength();

gsap.set(maskPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
```

Master pinned timeline:

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.scroll-wrapper',
    pin: true,
    scrub: 1,
    end: () => '+=' + window.innerWidth * 4    // total scroll = 4 viewports
  }
});
```

**Track 1 — diagonal camera move** (the whole container slides up-left as user scrolls):

```js
tl.to(container, {
  x: () => -window.innerWidth * 3,
  y: () => -window.innerHeight * 1.5,
  ease: 'none',
  duration: 1
}, 0);
```

Note: because the container is `300vh` tall, the `-y * 1.5` motion brings the second and third stamps up through the viewport.

**Track 2 — reveal the dotted trail**:

```js
tl.to(maskPath, {
  strokeDashoffset: 0,
  ease: 'none',
  duration: 1
}, 0);
```

**Track 3 — handwriting reveals** (staggered to card positions):

```js
// First label is above-the-fold, animate immediately
gsap.to('.hw-1', { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 0.5 });

// Other two ride the scroll
tl.to('.hw-2', { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.45);
tl.to('.hw-3', { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.95);
```

*(Background color transitions from earlier iterations are intentionally removed — this version keeps a static black stage so the grain, vignette, and yellow trail carry the mood.)*

---

## FEEL / MOTION NOTES

- The stamps are **not** on a straight horizontal line — the diagonal descent (`-y * 1.5`) creates the sense of a camera drifting down a hillside route
- The dotted trail draws in perfect lockstep with the camera, so the user feels like they are *inking the path themselves* as they scroll
- Handwritten location names appear a beat before or after their stamp centers, like margin notes in a field journal
- Grain + vignette + drop-shadowed trail together give the "shot on 16mm" mood without any actual video
- No color transitions and no background art — the black stage keeps the eye locked on the yellow line + white stamps

---

## DELIVERABLE CHECKLIST

- [ ] Body is pure black, cinematic grain + vignette overlays always visible
- [ ] Fixed top bar (INDEX / ALL dim / ABOUT) + bottom coord line
- [ ] `.horizontal-container` sized `400vw × 300vh`
- [ ] Three stamps positioned along the diagonal (50vw/50vh, 200vw/135vh, 350vw/200vh) with the specified rotations
- [ ] Stamp jagged edges rendered by the pure-CSS double-mask (no external SVG file)
- [ ] Handwritten location labels in `La Belle Aurore` at 72px, one per stamp, placed outside the card in the specified `hw-1/hw-2/hw-3` positions
- [ ] SVG bezier path drawn diagonally, revealed by animating the mask stroke offset from full length → 0
- [ ] GSAP ScrollTrigger pins the section, scrubs `x` by `-3 viewports` and `y` by `-1.5 viewports` simultaneously
- [ ] hw-1 animates on load, hw-2 at scroll progress 0.45, hw-3 at 0.95
- [ ] No background color transitions — stage stays black throughout
- [ ] `end: '+=' + window.innerWidth * 4` on the scroll trigger

---

**Awwwards-tier version →** https://cuedesign.space/component/cue036
