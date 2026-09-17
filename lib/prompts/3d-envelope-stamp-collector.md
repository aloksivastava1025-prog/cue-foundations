# 3D Envelope Stamp Collector — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** A travel journal or collectible stationery brand's product showcase page, demonstrating card variants before purchase.

---

# PROMPT — Interactive 3D Envelope · Stamp Collection (paste-ready, pixel-perfect)

Copy from `---BEGIN PROMPT---` to `---END PROMPT---`. Paste into v0 / Bolt / Cursor / Claude / ChatGPT.

---BEGIN PROMPT---

Build a **single-file `index.html`** interactive 3D envelope-with-stamps component. Vanilla HTML/CSS/JS only (no framework, no libraries, no build step). Two envelopes side-by-side in a stack (like a credit-card mockup). Each envelope opens its doors on hover; on click, two stamp cards fly out in a physics-based paper arc, land facing the viewer, and click again returns them into the envelope pocket. Users can:

1. Toggle **V1 (single card) / V2 (stacked cards)**.
2. Toggle **Solid / Leather** texture on the envelopes.
3. Pick a **different color per envelope** from two independent 6-swatch palettes.
4. Click the **peeking second stamp** to swap places with the first stamp — same position and angle preserved.

## Foundation

- Load Google Fonts: `Space Mono:wght@400;700`, `Inter:wght@400;500;600`, `Instrument Serif:ital@0;1`.
- CSS custom properties on `:root`:
  - `--bg: #ffffff`
  - `--env-color: #0b322a` (default deep green)
  - `--env-shadow: rgba(11, 50, 42, 0.4)`
  - `--text-color: #e2dfce` (cream)
- `* { margin:0; padding:0; box-sizing:border-box }`.
- Body: background `var(--bg)`, `min-height:100vh`, `flex column center`, `gap:40px`.

## Structure (in body)

Order: toggle bar → `.envelope-stack` (containing 2 `.scene` blocks) → `.palettes` (two `.palette` groups).

```
<div style="display:flex;gap:14px">
  <div class="version-toggle">
    <button class="v-btn" data-v="v1">V1 · Single</button>
    <button class="v-btn active" data-v="v2">V2 · Stacked</button>
  </div>
  <div class="version-toggle">
    <button class="v-btn active" data-t="solid">Solid</button>
    <button class="v-btn" data-t="leather">Leather</button>
  </div>
</div>

<div class="envelope-stack" id="envStack">
  <div class="scene"> <!-- Envelope #1 --> </div>
  <div class="scene"> <!-- Envelope #2 --> </div>
</div>

<div class="palettes">
  <div class="palette" data-scene="0">Env 1 · 6 swatches</div>
  <div class="palette" data-scene="1">Env 2 · 6 swatches</div>
</div>
```

## `.envelope-stack` — layered mockup

- `position:relative; width:520px; height:460px; display:flex; align-items:center; justify-content:center`.
- Each `.scene` is `position:absolute` inside.
- `.scene:nth-child(1)` — `left:20px; top:20px; transform:rotate(-4deg); z-index:1; --env-color:#0b322a; --env-shadow:rgba(11,50,42,0.4)` (back, tilted left, green).
- `.scene:nth-child(2)` — `right:20px; bottom:20px; transform:rotate(3deg); z-index:2; --env-color:#1a2733; --env-shadow:rgba(26,39,51,0.4)` (front, tilted right, midnight slate).

**V1 mode** (single card): `.envelope-stack.v1-mode .scene:nth-child(1){display:none}`, `.envelope-stack.v1-mode .scene:nth-child(2){left:50%; top:50%; right:auto; bottom:auto; transform:translate(-50%,-50%) rotate(0deg)}`.

## `.scene` (one envelope) — 3D wrapper

- `width:320px; height:420px; perspective:1800px; cursor:pointer`.
- Inside: `.envelope` with `position:relative; width:100%; height:100%; transform-style:preserve-3d; border-radius:12px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); transition:transform 0.6s cubic-bezier(0.2,0.8,0.2,1)`.

### Envelope layers (all inside `.envelope`, in this exact z-order):

1. **`.env-back`** — the solid back plate. `position:absolute; inset:0; background:var(--env-color); border-radius:12px; z-index:1`.
2. **`.env-content`** — stamp positioning wrapper. `position:absolute; bottom:20px; left:50%; transform:translateX(-50%) translateY(0); width:200px; height:300px; z-index:2; transition:transform 0.9s cubic-bezier(0.25,1,0.2,1)`.
3. **`.env-pocket`** — the front pocket that keeps stamps tucked in. `position:absolute; bottom:0; left:0; right:0; height:180px; background:var(--env-color); border-bottom-left-radius:12px; border-bottom-right-radius:12px; z-index:3; box-shadow:0 -2px 15px rgba(0,0,0,0.15)`.
4. **`.door.door-left`** and **`.door.door-right`** — the two openable flaps. Each `position:absolute; top:0; bottom:0; width:50%; background:var(--env-color); z-index:4; transition:transform 0.9s cubic-bezier(0.2,0.8,0.2,1); transform-style:preserve-3d`.
   - `.door-left { left:0; transform-origin:left center; border-top-left-radius:12px; border-bottom-left-radius:12px; border-right:1px solid rgba(0,0,0,0.2) }`.
   - `.door-right { right:0; transform-origin:right center; border-top-right-radius:12px; border-bottom-right-radius:12px }`.

### Door details

- **`.logo`** (top-left of left door, 36px inset): a snowflake-style asterisk built with 6 stacked `conic-gradient`s at 60° increments. 28×28, `border-radius:50%`, color `var(--text-color)`.
- **`.lock`** (each door, center): 14×14 circle, `border:2px solid rgba(226,223,206,0.4); border-radius:50%; top:50%; transform:translateY(-50%)`. `.door-left .lock{right:10px}`, `.door-right .lock{left:10px}`.
- **`.info`** (bottom-left of left door): `position:absolute; bottom:36px; left:36px; color:var(--text-color)`. Contains `.info-title` (Space Mono 14px bold letter-spacing 0.5px — text "Field notes") and `.info-sub` (12px 60% opacity — text "Vol. 02 — kept close").

## Stamp cards (inside `.env-content`)

Two stamps, both `position:absolute; filter:drop-shadow(0 5px 15px rgba(0,0,0,0.15)); cursor:pointer`.

### `.first-stamp` (image card, on top)

- `inset:0; z-index:2; transition:transform 0.6s, inset 0.6s, width 0.6s, height 0.6s cubic-bezier(0.34,0.02,0.16,1)`.
- Structure:
  ```
  <div class="first-stamp">
    <div class="first-stamp-inner">
      <div class="stamp-artwork">
        <img src="stamp_art.jpg" alt="Stamp Art" />
      </div>
    </div>
  </div>
  ```
- `::before` — the card back: `content:''; position:absolute; inset:0; background:#fdfbf5; z-index:-1; border-radius:4px`.
- `.first-stamp-inner`: `position:absolute; top:6px; left:6px; right:6px; bottom:6px; background:#fdfbf5; z-index:1; display:flex; flex-direction:column; padding:10px`.
- `.stamp-artwork`: `flex:1; border-radius:4px; overflow:hidden`.
- `.stamp-artwork img`: `width:100%; height:100%; object-fit:cover; border-radius:4px`.

### `.second-stamp` (text card, peeks from behind)

- Default: `right:-8px; bottom:5px; width:175px; height:296px; transform:rotate(6deg); transform-origin:bottom left; z-index:-1; pointer-events:auto`.
- Same 0.6s transition as first-stamp.
- Structure:
  ```
  <div class="second-stamp">
    <div class="second-stamp-inner">
      <div class="stamp-details">
        <div class="title">Bali</div>
        <div class="subtitle">INDONESIA</div>
        <div class="desc">A beautiful memory<br>captured in time.<br>21.09.2019.</div>
      </div>
    </div>
  </div>
  ```
- `.second-stamp-inner`: `top:6px; left:6px; right:6px; bottom:6px; background:#fdfbf5; padding:24px 16px; display:flex; flex-direction:column; justify-content:flex-end; align-items:flex-end; text-align:right`.
- Typography:
  - `.title`: Instrument Serif 42px weight 700, `color:#2b3353`.
  - `.subtitle`: Inter 13px weight 600, uppercase, letter-spacing 2px, `color:#ee5168`.
  - `.desc`: Space Mono 11px, `color:#666`, line-height 1.4, `max-width:140px`.

### Swap state (`.scene.is-swapped`)

The two cards trade EXACT positions and angles.

- `.scene.is-swapped .env-content .first-stamp`: `inset:auto; right:-8px; bottom:5px; width:175px; height:296px; transform:rotate(6deg); transform-origin:bottom left; z-index:-1`.
- `.scene.is-swapped .env-content .second-stamp`: `right:auto; bottom:auto; top:0; left:0; width:200px; height:300px; transform:rotate(0deg); z-index:2`.

## Hover (only when NOT clicked open)

Guard selector: `.scene:not(.is-open):not(.is-closing):hover`.

- Doors fly open ±135°: `.door-left{ transform:rotateY(-135deg); box-shadow:20px 0 40px rgba(0,0,0,0.15) }` and `.door-right{ transform:rotateY(135deg); box-shadow:-20px 0 40px rgba(0,0,0,0.15) }`.
- Content lifts: `.env-content{ transform:translateX(-50%) translateY(-70px); transition-delay:0.1s }`.
- Second stamp tilts extra: `.env-content .second-stamp{ transform:rotate(11deg) translateX(4px) }`.

## Click — paper-arc flight

On click, run a keyframe animation on `.env-content` that models a real card being pulled from a pocket:

```css
.scene.is-open .env-content,
.scene.is-closing .env-content {
  transform-origin: 50% 100%;
  will-change: transform;
}

@keyframes stampFly {
  0%   { transform: translateX(-50%) translateY(0)      translateZ(0)    rotateX(0deg); }
  50%  { transform: translateX(-50%) translateY(-450px) translateZ(30px) rotateX(-18deg); }
  100% { transform: translateX(-50%) translateY(-50px)  translateZ(80px) rotateX(0deg); }
}
@keyframes stampReturn {
  0%   { transform: translateX(-50%) translateY(-50px)  translateZ(80px) rotateX(0deg); }
  50%  { transform: translateX(-50%) translateY(-450px) translateZ(30px) rotateX(-18deg); }
  100% { transform: translateX(-50%) translateY(0)      translateZ(0)    rotateX(0deg); }
}

.scene.is-open    .env-content { animation: stampFly    1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.scene.is-closing .env-content { animation: stampReturn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
```

Phases:
- 0→50% — card rises straight up, fully above envelope top edge (`-450px`) with a slight forward `translateZ(30px)` and a `-18deg` `rotateX` (the "bend" as it's still tethered to the pocket).
- 50→100% — card arcs down and forward, straightens out (`rotateX 0`), settles at `translateY(-50px) translateZ(80px)` — natural size, facing the viewer, in front of the envelope.

**Do NOT scale**. `translateZ(80px)` under `perspective:1800px` gives ~4.7% apparent zoom — imperceptible.

## Version toggle (V1 / V2)

Click a `.v-btn[data-v]` → `envStack.classList.toggle('v1-mode', dataset.v === 'v1')` and update `.active`.

## Texture toggle (Solid / Leather)

Click a `.v-btn[data-t]` → `envStack.classList.toggle('leather-mode', dataset.t === 'leather')`.

`.envelope-stack.leather-mode` applies to `.env-back`, `.env-pocket`, `.door`:

```css
background:
  url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.55  0 0 0 0 0.38  0 0 0 0 0.25  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>") repeat,
  radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.10), transparent 55%),
  radial-gradient(ellipse at 75% 90%, rgba(0,0,0,0.15), transparent 55%),
  var(--env-color);
background-size: 320px 320px, cover, cover, cover;
box-shadow: inset 0 0 40px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.06);
```

`.env-back` in leather mode gets an extra stitched-edge outline: `inset 0 0 0 1px rgba(255,255,255,0.06)` added.

## Per-envelope color palettes

Two `.palette` groups (`data-scene="0"` and `data-scene="1"`), each with 6 `.swatch` buttons. Swatch structure:
```
<button class="swatch active" data-color="#0b322a" style="background:#0b322a" aria-label="Forest green"></button>
```
Colors: `#0b322a` (forest green), `#1a2733` (midnight), `#6d2020` (ox blood), `#1d3a5f` (deep blue), `#3a2a1a` (espresso), `#0a0a0a` (ink).

Palette styles:
- `.palettes{ display:flex; gap:20px; justify-content:center }`.
- `.palette{ display:flex; align-items:center; gap:12px; padding:10px 18px; background:rgba(0,0,0,0.04); border-radius:100px; backdrop-filter:blur(6px) }`.
- `.palette-label{ font:700 11px 'Space Mono'; letter-spacing:0.2em; text-transform:uppercase; color:#666 }`.
- `.swatch{ width:26px; height:26px; border-radius:50%; cursor:pointer; border:2px solid transparent; transition:transform 0.25s, border-color 0.25s }`.
- `.swatch:hover{ transform:scale(1.15) }`. `.swatch.active{ border-color:#0a0a0a; transform:scale(1.15) }`.

Hide envelope-1 palette in V1 mode: `.envelope-stack.v1-mode ~ .palettes .palette[data-scene="0"]{display:none}`.

## Version-toggle pill styles

- `.version-toggle{ display:inline-flex; background:rgba(0,0,0,0.04); border-radius:100px; padding:4px; gap:2px }`.
- `.v-btn{ background:transparent; border:none; padding:8px 16px; border-radius:100px; cursor:pointer; font:700 12px 'Space Mono'; letter-spacing:0.1em; color:#666; transition:all 0.3s cubic-bezier(0.34,0.02,0.16,1) }`.
- `.v-btn.active{ background:#0a0a0a; color:#fff }`.

## JS wiring (all in one script tag at end of body)

```js
const envStack = document.getElementById('envStack');

// Version toggle
document.querySelectorAll('.v-btn[data-v]').forEach(btn => {
  btn.addEventListener('click', () => {
    envStack.classList.toggle('v1-mode', btn.dataset.v === 'v1');
    document.querySelectorAll('.v-btn[data-v]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Texture toggle
document.querySelectorAll('.v-btn[data-t]').forEach(btn => {
  btn.addEventListener('click', () => {
    envStack.classList.toggle('leather-mode', btn.dataset.t === 'leather');
    document.querySelectorAll('.v-btn[data-t]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Per-envelope color palette — writes inline styles to override per-scene defaults
const scenes = document.querySelectorAll('.scene');
document.querySelectorAll('.palette').forEach(palette => {
  const idx = parseInt(palette.dataset.scene, 10);
  const target = scenes[idx];
  palette.querySelectorAll('.swatch').forEach(sw => {
    sw.addEventListener('click', (e) => {
      e.stopPropagation();
      const color = sw.dataset.color;
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      target.style.setProperty('--env-color', color);
      target.style.setProperty('--env-shadow', `rgba(${r}, ${g}, ${b}, 0.4)`);
      palette.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
    });
  });
});

// Per-envelope click + swap
scenes.forEach(scene => {
  let animating = false;
  const secondStamp = scene.querySelector('.env-content .second-stamp');
  if (secondStamp) {
    secondStamp.addEventListener('click', (e) => {
      e.stopPropagation();
      scene.classList.toggle('is-swapped');
    });
  }
  scene.addEventListener('click', () => {
    if (animating) return;
    animating = true;
    if (scene.classList.contains('is-open')) {
      scene.classList.remove('is-open');
      scene.classList.add('is-closing');
      setTimeout(() => { scene.classList.remove('is-closing'); animating = false; }, 800);
    } else {
      scene.classList.add('is-open');
      setTimeout(() => { animating = false; }, 1000);
    }
  });
});
```

## Content defaults

**Envelope 1** — Kyoto stamp:
- Second-stamp: title `Kyoto`, subtitle `JAPAN`, desc `Cherry blossoms<br>and quiet mornings.<br>04.04.2021.`
- Info label: `Field notes / Vol. 01 — travel`.

**Envelope 2** — Bali stamp:
- Second-stamp: title `Bali`, subtitle `INDONESIA`, desc `A beautiful memory<br>captured in time.<br>21.09.2019.`
- Info label: `Field notes / Vol. 02 — kept close`.

Both use the same `stamp_art.jpg` for the first-stamp image (swap to real assets as needed).

## Deliverable checklist

- [ ] Single HTML file, no build step, Google Fonts CDN only
- [ ] Two envelopes side-by-side in `.envelope-stack`, tilted -4° / +3°
- [ ] Each envelope: back → content → pocket → left door → right door, layered by z-index 1→4
- [ ] Doors open ±135° on hover (guarded by `:not(.is-open):not(.is-closing)`)
- [ ] Content lifts -70px on hover + second stamp tilts to 11°
- [ ] Click runs 3-keyframe `stampFly` (0 → -450px up → -50px in-front) with `transform-origin:50% 100%`
- [ ] Second click runs `stampReturn` (reverse arc)
- [ ] Click on peeking second-stamp swaps it with first — exact position/angle mirror
- [ ] V1/V2 toggle hides/centers envelope 1
- [ ] Solid/Leather toggle applies fractalNoise + gradients + inset shadows
- [ ] Per-envelope color palettes write inline `--env-color` on their scene only
- [ ] Palette 1 hidden in V1 mode
- [ ] No console errors; no scale during click flight (`translateZ` ≤ 80px keeps size within ~5%)

---END PROMPT---

---

**Awwwards-tier version →** https://cuedesign.space/component/cue031
