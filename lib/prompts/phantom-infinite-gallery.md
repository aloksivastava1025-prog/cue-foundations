# Phantom Infinite Gallery — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal as a full-screen portfolio or lookbook gallery for a design studio or photographer wanting a tactile, moody browsing ritual over standard scrolling.

---

# Phantom Gallery — pixel-perfect build prompt

**Purpose:** an infinite, draggable, throwable image gallery on a dark stage. A soft warm spotlight follows the cursor; everything outside the spotlight sits in shadow. Clicking a card lifts it up from its grid slot, slightly enlarges it in the middle of the screen, and types its title / year / description in a monospaced typewriter. The card can be tilted with the cursor while focused. Clicking anywhere returns the card to its slot.

**Framework:** single-file `index.html` — vanilla HTML + CSS + JS on one `requestAnimationFrame` loop. No GSAP, no Framer, no React. Ported from the Framer `PhantomInfiniteGallery` module.

**Deliverable:** one paste-ready `index.html`. Loads from `file://` and interacts immediately.

---

## ASSETS

Nineteen abstract / illustrative Pinterest images (no models / photos of people). Each item has a `title`, `year`, and a short `desc` used by the typewriter overlay.

```txt
IMAGES = [
  { title: 'Reveat',   src: '.../9786c75c...jpg', year: 2024, desc: 'A study of stillness — the way an object waits for the light to notice it.' },
  { title: 'Nixole',   src: '.../3d2e90b8...jpg', year: 2023, desc: 'Ambient forms from an afternoon that refused to hold a shape.' },
  { title: 'Syncrun',  src: '.../a72c6b40...jpg', year: 2024, desc: 'Two rhythms sharing one frame — the quieter one leads.' },
  { title: 'Lumae',    src: '.../86d77085...jpg', year: 2023, desc: 'Soft chroma — testing how gently a colour can arrive.' },
  { title: 'Falafel',  src: '.../e889ccd4...jpg', year: 2024, desc: 'A love letter to warm oil, crushed herbs and a very good afternoon.' },
  { title: 'Vault',    src: '.../5e497d5e...jpg', year: 2024, desc: 'The room where every idea we ever kept is still breathing.' },
  { title: 'Grain',    src: '.../74a8a854...jpg', year: 2023, desc: 'Texture as memory — small unbeautiful things, honestly framed.' },
  { title: 'Pulse',    src: '.../0ebb8414...jpg', year: 2024, desc: 'A frame taken between two heartbeats. Neither is louder.' },
  { title: 'Vera',     src: '.../77bdd84c...jpg', year: 2023, desc: 'Portrait sequence, first pass — the honest one before we edited it.' },
  { title: 'Nexo',     src: '.../f87fdde4...jpg', year: 2024, desc: 'Where two systems meet, and briefly agree on a single language.' },
  { title: 'Kite',     src: '.../59940324...jpg', year: 2023, desc: 'Tethered but not held — how weight and lift argue politely.' },
  { title: 'Aurora',   src: '.../04fc4055...jpg', year: 2024, desc: 'First light on skin — the exact minute before the room admits it.' },
  { title: 'Meridian', src: '.../30ce267b...jpg', year: 2024, desc: 'The imaginary line that decides where a day tips into the next.' },
  { title: 'Solace',   src: '.../73447d60...jpg', year: 2023, desc: 'A quiet interior. Nothing happens. This is the point.' },
  { title: 'Prism',    src: '.../ade2cb37...jpg', year: 2024, desc: 'The same subject, refracted six different ways — pick your favourite lie.' },
  { title: 'Halcyon',  src: '.../1c086e74...jpg', year: 2023, desc: 'A season we made up so we could describe how the light felt.' },
  { title: 'Vessel',   src: '.../7ef7990b...jpg', year: 2024, desc: 'The container is always more interesting than what it carries.' },
  { title: 'Ember',    src: '.../42227bb6...jpg', year: 2023, desc: 'The part of the fire that still has an opinion about the room.' },
  { title: 'Cascade',  src: '.../26325bfd...jpg', year: 2024, desc: 'One thing giving way to the next, gracefully and without ceremony.' },
];

FONT: JetBrains Mono (system fallback OK). No web font required.
DEPS: none.
```

Full URLs are in `phantom-gallery/index.html` — the source is authoritative.

---

## DESIGN TOKENS (paste verbatim)

```txt
Stage:
  fixed inset:0, bg #000, cursor: grab (grabbing while dragging)
  perspective: 1000px, transform-style: preserve-3d, touch-action: none, user-select: none

Cell:
  bg-color:       rgba(0, 0, 0, 0.1)     (dark placeholder while thumb loads)
  border:         none  (all four sides off)
  padding:        10px
  transition:     background-color 0.3s ease
  transform:      translate3d(0, 0, Zpx) rotateY(YAWdeg) rotateX(PITCHdeg) scale(SCALE)
  hover bg:       #FF5588  (pink flash — Framer default)
  thumb:          flex:1, background-size:cover, radius 4px, marginBottom = gap (12px)
  meta:           flex row space-between, mono 12px, color #808080; title UPPERCASE

Dim layer (below spotlight):
  fixed inset:0, z-index:8, bg rgba(0,0,0,0.38), pointer-events:none

Spotlight layer (cursor-following):
  fixed inset:0, z-index:9, pointer-events:none, mix-blend-mode: overlay
  background: radial-gradient(circle 340px at var(--mx) var(--my),
    rgba(255,255,255,0.55) 0%,
    rgba(255,255,255,0.30) 25%,
    rgba(255,255,255,0.08) 50%,
    rgba(0,0,0,0)          65%,
    rgba(0,0,0,0.30)       100%)

Vignette (corners fade):
  fixed inset:0, z-index:10, pointer-events:none
  background: radial-gradient(ellipse at center,
    transparent 30%,
    rgba(0,0,0,0.2) 60%,
    rgba(0,0,0,0.8) 90%,
    rgba(0,0,0,1)   100%)

Focus dim (during focus mode):
  z-index:11, bg rgba(0,0,0,0.72), 0.45s opacity transition, pointer-events:auto when .on

Focus card:
  z-index:12, radius 10px, overflow hidden, bg #222
  box-shadow: 0 30px 80px -20px rgba(0,0,0,0.85)
  position/size/transform driven by JS (opens from clicked cell position, grows to
  cellSize × 1.5 capped at 45vw with 4:5 aspect)

Focus caption:
  abs bottom, mono JetBrains, non-bold (font-weight 400)
  .cap-head (title + year uppercase, 12px), .cap-desc (11px, 78% white)
  .caret: 6px × 12px white, steps(1) blink 0.8s

3D perspective for interaction:
  body.focused { perspective: 1400px; }
  #focus-card { transform-style: preserve-3d; }
```

---

## STRUCTURE

```
<div id="stage"><div id="grid"><!-- cells generated by JS --></div></div>
<div id="dim"></div>
<div id="spotlight"></div>
<div id="vignette"></div>

<div id="focus-dim"></div>
<div id="focus-card">
  <img id="focus-img"/>
  <div class="cap">
    <div class="cap-head"><span id="focus-title"></span><span id="focus-year"></span></div>
    <div class="cap-desc"><span id="focus-desc"></span><span id="focus-caret" class="caret" hidden></span></div>
  </div>
</div>
```

---

## GRID MOTION SYSTEM (Framer port)

```js
const props = {
  cellSize:              200,
  backgroundColor:       '#000000',
  textColor:             '#808080',
  hoverColor:            '#FF5588',
  cellPadding:           10,
  gap:                   12,
  arcAmount:             0.6,
  arcMaxAngleDeg:        28,
  arcAxis:               'horizontal',
  edgeFade:              0.25,
  border:                { width: 0, /* all sides hidden */ },
  parallaxEnabled:       true,  parallaxStrength: 0.1,  parallaxEase: 0.12,
  parallaxWhileDragging: false,
  inertiaEnabled:        true,  throwFriction: 0.92, throwVelocityScale: 1,
  throwMinSpeed:         80,   throwMaxSpeed: 2500,
  zoomValue:             0.7,
};

let offset          = { x:0, y:0 };
let targetOffset    = { x:0, y:0 };
let inertia         = { x:0, y:0 };
let velocity        = { x:0, y:0 };
let mouseOffset     = { x:0, y:0 };
let targetMouseOff  = { x:0, y:0 };
let currentCellSize = 200;
let targetCellSize  = 200;
```

### Helpers (locked from Framer source)

```js
function computePinnedOffset(prevSize, nextSize, pivot, prevOffset) {
  const worldX = (pivot.x - prevOffset.x) / prevSize;
  const worldY = (pivot.y - prevOffset.y) / prevSize;
  return { x: pivot.x - worldX * nextSize, y: pivot.y - worldY * nextSize };
}
const toRad = d => d * Math.PI / 180;

function calcArcTransform({cellCenterX, cellCenterY, viewportW, viewportH, arcAxis, arcMaxAngleDeg, arcAmount}) {
  const maxAngle = toRad(arcMaxAngleDeg) * clamp(arcAmount, 0, 1);
  if (maxAngle === 0) return { z:0, yawDeg:0, pitchDeg:0, edgeFactor:0 };
  if (arcAxis === 'horizontal') {
    const dx = (cellCenterX - viewportW/2) / (viewportW/2);
    const angle = dx * maxAngle;
    const radius = viewportW / (2 * Math.sin(Math.max(0.001, maxAngle)));
    const z = -radius * (Math.cos(angle) - 1);
    const yawDeg = -(angle * 180) / Math.PI;
    return { z, yawDeg, pitchDeg: 0, edgeFactor: Math.min(1, Math.abs(dx)) };
  } else {
    const dy = (cellCenterY - viewportH/2) / (viewportH/2);
    const angle = dy * maxAngle;
    const radius = viewportH / (2 * Math.sin(Math.max(0.001, maxAngle)));
    const z = -radius * (Math.cos(angle) - 1);
    const pitchDeg = angle * 180 / Math.PI;
    return { z, yawDeg: 0, pitchDeg, edgeFactor: Math.min(1, Math.abs(dy)) };
  }
}
```

### Grid render loop

```js
const GRID_SIZE = 20;
const startX = Math.floor(-offset.x / currentCellSize) - 5;
const startY = Math.floor(-offset.y / currentCellSize) - 5;

for (let y=startY; y<startY+GRID_SIZE; y++) {
  for (let x=startX; x<startX+GRID_SIZE; x++) {
    const idx  = Math.abs((x + y*3) % items.length);
    const item = items[idx];
    const key  = `${x}-${y}`;
    const el   = ensureCell(x, y);          // reuse from cellCache

    const tileLeft = x*currentCellSize + offset.x + mouseOffset.x + inertia.x;
    const tileTop  = y*currentCellSize + offset.y + mouseOffset.y + inertia.y;
    const cx = tileLeft + currentCellSize/2;
    const cy = tileTop  + currentCellSize/2;
    const {z, yawDeg, pitchDeg, edgeFactor} = calcArcTransform({...});
    const scale   = 1 - props.edgeFade * (edgeFactor*edgeFactor);
    const opacity = 1 - 0.4 * (edgeFactor * props.arcAmount);

    el.style.transform = `translate3d(0,0,${z}px) rotateY(${yawDeg}deg) rotateX(${pitchDeg}deg) scale(${scale})`;
    el.style.opacity   = opacity;
    // + tileLeft/Top/W/H + thumb bg + title/year text + dataset (src/title/year/desc)
  }
}
```

### rAF loop

```js
function tick() {
  const now = performance.now();
  const dt = Math.min(0.05, (now - lastTime)/1000);
  lastTime = now;

  currentCellSize += (targetCellSize - currentCellSize) * 0.15;
  if (!isDragging) {
    offset.x += (targetOffset.x - offset.x) * 0.15;
    offset.y += (targetOffset.y - offset.y) * 0.15;
  }

  if (inertiaEnabled && inertiaActive) {
    const f = Math.pow(props.throwFriction, dt*60);
    velocity.x *= f; velocity.y *= f;
    // Never quite stop; drift with tiny 1e-4 residual velocity
    inertia.x += velocity.x * dt;
    inertia.y += velocity.y * dt;
  }

  // Parallax lerp toward targetMouseOff (or 0 if dragging)
  mouseOffset.x += (…) * parallaxEase;
  mouseOffset.y += (…) * parallaxEase;

  render();
  requestAnimationFrame(tick);
}
```

---

## INTERACTION

### Pointer events (single pipeline)

- `pointerdown` → set capture, commit any running inertia, record press pos + startOffset, schedule press-hold zoom (`PRESS_ZOOM_DELAY = 120ms` → `targetCellSize = cellSize * zoomValue (0.7)`, pinned to center)
- `pointermove` → EMA velocity (0.6 new / 0.4 old, clamped ±throwMaxSpeed), update parallax target (unless pressing), if `hypot > DRAG_THRESHOLD (4px)` engage drag, then `offset = startOffset + delta`
- `pointerup` / `pointercancel` → clear press timer, if `speed ≥ throwMinSpeed` mark inertiaActive, restore cell size to base pinned to center, and if `!wasDragging && type==='pointerup'` fire `handleClick(e)`
- `pointerleave` → reset parallax target to 0

### Spotlight tracking

Update CSS variables on every `pointermove`:
```js
spotlightEl.style.setProperty('--mx', e.clientX + 'px');
spotlightEl.style.setProperty('--my', e.clientY + 'px');
```
Spotlight uses `mix-blend-mode: overlay` for a punchy, bright core (rgba(255,255,255,0.55) at center).

### Focus mode

- Click (no drag) → find cell via `document.elementFromPoint(clientX, clientY).closest('.cell')` (pointer capture routes events to stage, so cell lookup MUST use geometry)
- Snapshot the cell's dataset before the render loop recycles it: `{ src, title, year, desc }`
- `openFocus`:
  ```
  finalSize = min(cellSize × 1.5, viewportW × 0.45)  (4:5 portrait)
  initScale = cellRect.width / finalSize
  step 1: no-transition, position at cellRect center, scale = initScale, opacity 0
  step 2: force reflow, apply transitions, animate to viewport center + scale 1 + opacity 1
  ```
  550ms landing → then start the typewriter
- 3D tilt while focused: `pointermove` sets rX/Y targets by cursor position relative to card center (±10°), rAF lerps `tiltRX/RY *= 0.14`, transform stays `translate(-50%,-50%) rotateX() rotateY() scale(1)`
- `closeFocus`: reverse — animate back to the original cell's current position (via `focusCell.getBoundingClientRect()`), scale down, opacity 0, then remove `.on` class

### Typewriter

```js
function typewriter({title, year, desc}, onDone) {
  focusTitle/Year/Desc.textContent = '';
  focusCaret.hidden = false;
  const parts = [
    { el: focusTitle, text: title, speed: 60 },
    { el: focusYear,  text: year,  speed: 45 },
    { el: focusDesc,  text: desc,  speed: 22 },
  ];
  let pi = 0, ci = 0;
  function step() {
    if (pi >= parts.length) { setTimeout(() => focusCaret.hidden = true, 400); return; }
    const p = parts[pi];
    if (ci < p.text.length) {
      p.el.textContent += p.text[ci++];
      setTimeout(step, p.speed + Math.random()*20);
    } else {
      pi++; ci = 0;
      setTimeout(step, 180);
    }
  }
  step();
}
```

- Names are typed in **regular weight**, NOT bold. Uppercase title via CSS `text-transform` on `.cap-head`.
- The caret blinks with `animation: caret-blink 0.8s steps(1) infinite`.
- Any close cancels pending `setTimeout` via `stopTypewriter()`.

---

## MECHANICS notes

- Grid cells are recycled every frame (`cellCache` object). Any state you want to survive a click must be snapshotted BEFORE recycling — that's why the typewriter payload is captured on click, not read from `cell.dataset` inside the setTimeout.
- `document.elementFromPoint` must be used inside `handleClick` because `setPointerCapture` on the stage routes the raw pointerup event to the stage, not to whichever cell was under the cursor.
- Never apply CSS `transition: transform` to `.cell` — motion is per-frame; a CSS transition will double-ease.
- Perspective 1000px on `.stage` (grid depth), 1400px on `body.focused` (focus tilt) — different scenes want different lens.
- `will-change: transform, opacity` on `.cell` — GPU-composite the whole grid.
- Spotlight uses CSS variables (`--mx`, `--my`) so cursor updates never touch the render loop.
- `mix-blend-mode: overlay` on the spotlight gives white-punch under warm images while keeping the rest dim.

---

## RESPONSIVE

- **Desktop (≥ 1024px)** — tokens as-is. 19 items, 20×20 grid.
- **Tablet (768–1023px)** — cellSize 160, spotlight radius 260px.
- **Mobile (≤ 767px)** — cellSize 120, GRID_SIZE 12 to keep DOM light. Spotlight 200px. Focus card 82vw wide.
- **Touch** — pointer events are the pipeline; drag / throw / tap / press-hold all work.
- **`prefers-reduced-motion: reduce`** — kill `inertiaActive`, skip the tilt rAF, skip the typewriter (write full text immediately), and drop `arcAmount` to 0 so cells sit flat.

---

## DELIVERABLE CHECKLIST

- [ ] Single `index.html`, no build step, no dependencies
- [ ] Loads from `file://` and interacts on first paint
- [ ] Body/stage overflow hidden, black bg
- [ ] 19-item array with `title`, `src`, `year`, `desc` fields — no borders on cells
- [ ] Grid math from Framer preserved (arc transform, edgeFade, parallax, inertia, press-hold zoom)
- [ ] Cell recycling via `cellCache` — active cells kept, offscreen ones removed each frame
- [ ] Cursor spotlight via CSS vars `--mx/--my`, radial-gradient, `mix-blend-mode: overlay`, bright white core (0.55)
- [ ] Focus opens from clicked cell's rect (initScale = cellW / finalW), lands at viewport center, scale 1
- [ ] Typewriter fires 550ms after landing: title @ 60ms/ch, year @ 45ms/ch, desc @ 22ms/ch, non-bold, blinking caret
- [ ] Snapshot cell dataset at click time to survive grid recycling
- [ ] 3D tilt on focus card: cursor moves within ±10° rotateX/rotateY, lerp 0.14
- [ ] `handleClick` uses `elementFromPoint` (pointer capture on stage routes events)
- [ ] Close returns focus card to its cell's live position via `getBoundingClientRect`
- [ ] Respects `prefers-reduced-motion`

---

## REFERENCE

Source-of-truth file: `phantom-gallery/index.html` in this repo. If any token drifts from the file, the file wins.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue129
