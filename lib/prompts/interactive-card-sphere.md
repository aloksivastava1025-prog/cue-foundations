# Interactive Card Sphere — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Suits a design-tool or brand studio landing page as a playful hero centerpiece that showcases a flat visual system through physics-driven interaction.

---

# Prompt — "Card Sphere" interactive card field (pixel-perfect)

Copy everything below the line into any AI coding agent.

---

Build a React + TypeScript component `CardSphere.tsx` (React 18, no other dependencies; font Inter 500/600/700).

It fills its container with an interactive field of flat graphic cards placed on a transparent sphere:
- The user drags, flicks, scrolls or uses the arrow keys to turn the sphere.
- After a flick it coasts, then glides to a stop with one big "hero" card centred at the front.
- Double-click (or T) flips the background between white and #111.
- There are no photos: every card is drawn with HTML/SVG in flat colours, with no gradients.

Follow every value below exactly. Don't restyle, recolour, round numbers or invent extra cards.

## 1. Palette and type

| token | value |
|---|---|
| lime | `#d5fe4f` |
| ink | `#0d0d0d` |
| card (dark card) | `#1d1d1d` |
| paper | `#f2f2f0` |
| grey | `#d9d9d6` |
| light background | `#ffffff` |
| dark background | `#111111` |

- Font: Inter 500/600/700 (`https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap`).
- Every card is authored at its own **base size in px**, and all inner sizes are fractions of the base width `w`. The whole card is then scaled with one transform.

## 2. Root element

- One `div.csph` with `position: relative; width: 100%; height: 100%; min-height: 320px; overflow: hidden; contain: strict`.
  - `background #fff`; `.dark` makes it `#111`.
  - `user-select: none; outline: none; touch-action: none; cursor: grab` (`grabbing` while dragging).
  - `tabIndex=0`, `role="application"`, and an `aria-label` that explains drag / scroll / arrows / T.
- Card nodes are created imperatively, one `div.csph-c` per card, appended to the root.
  - Style: `position: absolute; left 0; top 0; transform-origin 0 0; overflow hidden; backface-visibility hidden; will-change: transform, opacity`.
  - Size: `width = w px`, `height = h px`, `border-radius = max(4, 0.03 × w) px`.
  - An optional `background` override per card.
- Animate with **one `requestAnimationFrame` loop** that writes `transform` / `opacity` / `zIndex` / `display` directly. No React state per frame and no CSS transitions.

## 3. Card types (exact markup)

Card classes:

```css
.csph{position:relative;width:100%;height:100%;min-height:320px;overflow:hidden;background:#fff;contain:strict;user-select:none;-webkit-user-select:none;outline:none;touch-action:none;cursor:grab;transition:background-color 0s}

.csph.dark{background:#111}

.csph.grabbing{cursor:grabbing}

.csph-c{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform,opacity;overflow:hidden;backface-visibility:hidden;box-sizing:border-box}

.csph-lime{background:#d5fe4f;display:grid;place-items:center;font:700 1px/1 Inter,system-ui,sans-serif;color:#0d0d0d;letter-spacing:-.05em}

.csph-icon,.csph-dots,.csph-words{background:#1d1d1d;display:grid;place-items:center}

.csph-words{place-items:end start}

.csph-chip{background:#151515;display:grid;place-items:center}

.csph-chip span{background:#f4f4f4;color:#111;font:600 1px/1 Inter,system-ui,sans-serif;letter-spacing:-.03em;display:block}

.csph-box{background:#0d0d0d;display:grid;place-items:center}

.csph-box span{background:#fafafa;color:#111;font:600 1px/1 Inter,system-ui,sans-serif;letter-spacing:-.05em;display:flex;align-items:center}

.csph-poster{background:#d9d9d6;display:grid;place-items:center}

.csph-type{background:#f2f2f0;display:grid;place-items:center}

.csph-shape{display:grid;place-items:center}

.csph-target,.csph-swatch,.csph-stripe{background:#d5fe4f;display:grid;place-items:center}

@media (prefers-reduced-motion:reduce){.csph-c{will-change:auto}
}

```

Dotted icons are SVG paths drawn as dots: `stroke #f2f2f2`, `stroke-width 3.2`, `stroke-linecap round`, `stroke-dasharray "0.01 7"`, in `viewBox 0 0 100 100`, sized `0.72 w`.

```ts
const ICONS: Record<string, string> = {
  x: 'M30 30 L48 48 M70 30 L52 48 M30 70 L48 52 M70 70 L52 52 M48 48 H52 M48 52 H52 M48 48 V52 M52 48 V52',
  ring: 'M50 22 A28 28 0 1 1 49.9 22',
  flower: 'M50 20 A10 10 0 1 1 49.9 20 M50 40 V82 M50 56 L38 46 M50 56 L62 46 M50 70 L40 62 M50 70 L60 62',
  layers: 'M50 24 L80 40 L50 56 L20 40 Z M20 52 L50 68 L80 52 M20 64 L50 80 L80 64',
  basket: 'M22 42 H78 L70 78 H30 Z M36 42 L44 24 M64 42 L56 24 M36 56 V66 M50 56 V66 M64 56 V66',
  person: 'M50 22 A12 12 0 1 1 49.9 22 M26 80 C26 58 74 58 74 80',
  search: 'M44 26 A18 18 0 1 1 43.9 26 M57 57 L76 76',
};
```

Shapes for the small "shape" cards (`viewBox 0 0 100 100`, filled with `fg`):

```ts
const SHAPES: Record<string, string> = {
  circle: '<circle cx="50" cy="50" r="30"/>',
  arch: '<path d="M22 80V48a28 28 0 0 1 56 0v32z"/>',
  quarter: '<path d="M22 78V22a56 56 0 0 1 56 56z"/>',
  halves: '<path d="M20 50a15 15 0 0 1 30 0zM50 50a15 15 0 0 0 30 0z"/>',
  plus: '<path d="M42 20h16v22h22v16H58v22H42V58H20V42h22z"/>',
  stack: '<rect x="22" y="22" width="56" height="14" rx="7"/><rect x="22" y="43" width="40" height="14" rx="7"/><rect x="22" y="64" width="50" height="14" rx="7"/>',
};
```

The artwork of every type, as an HTML string per card (use exactly this):

```ts
const lbl = 'position:absolute;font-family:Inter,system-ui,sans-serif;font-weight:600;line-height:1;letter-spacing:-.04em;color:#0d0d0d';
const ART: Record<CardType, (w: number, h: number, o: Card) => string> = {
  lime: (w) => `<div style="font-size:${w * 0.3}px">Cue.</div>`,
  icon: (w, _h, o) => iconSvg(o.icon || 'search', w * 0.72),
  chip: (w) => `<span style="font-size:${w * 0.17}px;padding:${w * 0.07}px ${w * 0.1}px;border-radius:${w * 0.04}px">Cue.</span>`,
  box: (w) => `<span style="font-size:${w * 0.2}px;padding:${w * 0.1}px ${w * 0.09}px;border-radius:${w * 0.02}px;box-shadow:0 0 ${w * 0.1}px rgba(255,255,255,.75),0 0 ${w * 0.3}px rgba(255,255,255,.35)">Cue.<svg viewBox="0 0 10 10" width="${w * 0.12}" height="${w * 0.12}" style="margin-left:${w * 0.05}px"><g fill="#bdbdbd">${[[2, 2], [5, 2], [8, 2], [2, 5], [5, 5], [2, 8], [5, 8], [8, 8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9"/>`).join('')}</g></svg></span>`,
  dots: (w, h, o) => dotCluster(w, h, o.col || LIME, o.seed || 3),
  type: (w) => `<div style="font:600 ${w * 0.46}px/1 Inter,system-ui,sans-serif;letter-spacing:-.06em;color:${INK}">Aa</div><div style="${lbl};left:${w * 0.07}px;bottom:${w * 0.07}px;font-size:${w * 0.06}px;font-weight:500;color:#6b6b6b">Inter 600</div><div style="${lbl};right:${w * 0.07}px;bottom:${w * 0.07}px;font-size:${w * 0.06}px;font-weight:500;color:#6b6b6b">−6%</div>`,
  shape: (w, _h, o) => `<svg viewBox="0 0 100 100" width="${w * 0.7}" height="${w * 0.7}"><g fill="${o.fg || INK}">${SHAPES[o.shape || 'circle']}</g></svg>`,
  target: (w) => `<svg viewBox="0 0 100 100" width="${w * 0.78}" height="${w * 0.78}"><g fill="none" stroke="${INK}" stroke-width="1.6"><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="16"/></g><circle cx="50" cy="50" r="5" fill="${INK}"/><g stroke="${INK}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="0.01 4.5"><path d="M50 2V98M2 50H98"/></g></svg>`,
  swatch: (w, _h, o) => `<div style="position:absolute;inset:0;display:grid;grid-template-rows:2fr 1fr 1fr">${(o.cols || [LIME, INK, PAPER]).map((c) => `<div style="background:${c};position:relative"><span style="${lbl};left:${w * 0.08}px;bottom:${w * 0.06}px;font-size:${w * 0.075}px;font-weight:500;color:${c === INK ? PAPER : INK}">${c.toUpperCase()}</span></div>`).join('')}</div>`,
  stripe: (w, h) => `<svg viewBox="0 0 100 120" width="${w}" height="${h}" preserveAspectRatio="none" style="position:absolute;inset:0"><g fill="${INK}">${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="0" y="${12 + i * 17}" width="100" height="${3 + i * 1.6}"/>`).join('')}</g></svg>`,
  poster: (w, h) => `<div style="width:${w * 0.8}px;height:${h * 0.86}px;border-radius:${w * 0.012}px;background:#fbfbfa;position:relative;overflow:hidden">
      <div style="${lbl};left:${w * 0.05}px;top:${w * 0.05}px;font-size:${w * 0.05}px;line-height:1.12;font-weight:500">Where design<br>meets code</div>
      <svg viewBox="0 0 100 100" style="position:absolute;left:14%;top:26%;width:72%;height:auto"><circle cx="50" cy="50" r="38" fill="${INK}"/><path d="M50 12a38 38 0 0 1 0 76z" fill="${LIME}"/></svg>
      <div style="${lbl};right:${w * 0.05}px;bottom:${w * 0.05}px;font-size:${w * 0.046}px">Cue.</div></div>`,
  words: (w) => `<div style="font:700 ${w * 0.15}px/1.02 Inter,system-ui,sans-serif;letter-spacing:-.05em;color:${PAPER};padding:${w * 0.08}px;align-self:end">Copy.<br>Paste.<br><span style="color:${LIME}">Ship.</span></div>`,
};
```

## 4. The cards

Eight **hero** cards, in this order. Hero 0 starts at the front.

```ts
const HEROES: Omit<Card, 'p'>[] = [
  { type: 'lime', w: 412, h: 515, rz: -1.5 },
  { type: 'dots', col: LIME, seed: 5, w: 420, h: 528, rz: 0.5 },
  { type: 'type', w: 390, h: 495, rz: -1 },
  { type: 'icon', icon: 'search', morph: true, w: 415, h: 516, rz: 1 },
  { type: 'target', w: 410, h: 501, rz: -0.5 },
  { type: 'poster', w: 420, h: 525, rz: 1.5 },
  { type: 'box', w: 421, h: 533, rz: -1 },
  { type: 'words', w: 420, h: 525, rz: 0.8 },
];
```

**Small cards** are seeded, so the field is identical on every load. Generate them exactly like this:

```ts
const TYPES: CardType[] = ['lime', 'lime', 'lime', 'icon', 'icon', 'icon', 'dots', 'dots', 'shape', 'shape', 'shape', 'swatch', 'stripe', 'type', 'chip', 'target'];
const ICK = ['layers', 'basket', 'person', 'search', 'ring', 'x', 'flower'];
const P = 2;                                               // camera distance / sphere radius
const NS = 64;                                             // small-card slots on the sphere

/** builds the same field every time (seeded) */
function buildCards(): Card[] {
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const heroes: Card[] = HEROES.map((o, i) => ({ ...o, p: fib(8, i, 1.1), hero: true }));
  const shapes = Object.keys(SHAPES);
  const small: Card[] = [];
  for (let i = 0; i < NS; i++) {
    const p = fib(NS, i, 0.37);
    p.x += (rnd() - 0.5) * 0.08; p.y += (rnd() - 0.5) * 0.08; p.z += (rnd() - 0.5) * 0.08;
    const q = norm(p);
    if (heroes.some((h) => dot(h.p, q) > 0.9)) continue;   // keep air around each hero
    const type = TYPES[Math.floor(rnd() * TYPES.length)];
    const w = type === 'chip' ? 130 + rnd() * 60 : 110 + rnd() * 120;
    const h = type === 'chip' ? w * 0.55 : w * (1.05 + rnd() * 0.3);
    const o: Card = { type, w, h, p: q, icon: ICK[Math.floor(rnd() * ICK.length)], rz: (rnd() - 0.5) * 8, seed: Math.floor(rnd() * 999) };
    if (type === 'shape') { const pair = [[PAPER, INK], [LIME, INK], [CARD, LIME], [CARD, PAPER]][Math.floor(rnd() * 4)]; o.bg = pair[0]; o.fg = pair[1]; o.shape = shapes[Math.floor(rnd() * shapes.length)]; }
    if (type === 'dots' && rnd() < 0.4) { o.bg = LIME; o.col = INK; }
    if (type === 'lime') { o.type = 'dots'; o.bg = LIME; o.col = INK; }   // small lime cards carry the dot mark
    if (type === 'stripe' && rnd() < 0.5) o.bg = PAPER;
    if (type === 'swatch') o.cols = [[LIME, INK, PAPER], [INK, LIME, GREY], [PAPER, GREY, INK]][Math.floor(rnd() * 3)];
    small.push(o);
  }
  return [...heroes, ...small];
}
```

## 5. Sphere model and projection (per frame)

- **Sphere:**
  - Unit sphere.
  - Camera distance `P = 2` radii, so a card at the front is 3× the size it is at the back.
  - Rotation is stored as a quaternion `rot` (sphere → view).
  - Start with `rot = rotationBetween(heroes[0].p, (0,0,1))`.
- **Container size** (ResizeObserver):
  - `u = min(W, 0.8·H) / 720`;
  - `F = 502·u`;
  - `Ax = max(1, (W/2) / (F·0.577) · 0.97)`;
  - `Ay = max(1, (H/2) / (F·0.577) · 0.97)`.

  The sphere stretches into an ellipsoid so cards reach every edge, taller on phones and wider on desktop.
- **For every card:**
  - `q = rotate(rot, card.p)`, `d = P − q.z`, `s = 1/d`.
  - Screen position: `sx = W/2 + q.x·F·s·Ax`, `sy = H/2 − q.y·F·s·Ay`.
  - Size factor: `k = clamp((q.z − 0.2)/0.55)`; heroes use `hf = lerp(0.5, 1, k²(3 − 2k))`, small cards use `hf = 0.5`. Heroes are only big as they come round to the front.
  - Scale: `sc = s·u·hf·hv`, where `hv` is the hover scale (below).
  - Tilt: `ry = atan2(q.x, max(0.2, q.z))·57.3·0.35` degrees, `rx = atan2(q.y, max(0.2, q.z))·57.3·0.35` degrees.
  - Transform: `translate(sx px, sy px) scale(sc) perspective(w·2.6 px) rotateX(rx) rotateY(ry) rotate(rz) translate(−w/2 px, −h/2 px)`.
  - `zIndex = round((3 − d)·1000)`.
  - Opacity: heroes `clamp((q.z + 0.9)/0.3)`; small cards `clamp((q.z + 0.8)/0.35)` (the far back thins out).
  - Culling: if the card is fully outside the root by more than 40px, set `display: none`; otherwise `display: ''`.
- **Hover:** the card under the pointer (when not dragging) eases to `hv = 1.04`, all others to 1, using `hv = lerp(hv, target, 1 − 0.001^dt)`.
- **Icon morph** (hero 3 only): the icon is `flower` when `q.z > 0.97`. Between 0.6 and 0.97 it is `x`, unless it is already `flower`, in which case it stays `flower`. Below 0.6 it is `search`. Re-render the SVG only when the icon changes.

## 6. Input and motion

- **Drag:**
  - `pointerdown`: set pointer capture, stop any snap, clear the velocity.
  - `pointermove`: turn by `ang = hypot(dx/Ax, dy/Ay)/(F·0.5)` around the axis `(dy/Ay, dx/Ax, 0)`, so `rot = axisAngle(axis, ang) · rot`.
  - Keep move samples from the last 90 ms.
- **Release:**
  - If the pointer moved less than 6px in total, it's a click. If the clicked card is a hero, snap it to the front; otherwise snap the nearest hero.
  - Otherwise flick: velocity = the sum of the samples divided by their time span (min 0.016 s). Angular velocity `wv = ((vy/Ay)·k, (vx/Ax)·k, 0)`, with `k = 1/(F·0.5)`.
- **Coast:** while not dragging or snapping, `rot = axisAngle(wv, |wv|·dt) · rot` and `wv *= 0.88^(dt·30)`.
- **Snap:**
  - Starts when `|wv| < 1.6` and 60 ms have passed since the last input, but only if the sphere is not already settled.
  - Look ahead along the spin: `ahead = axisAngle(wv, min(2.4, |wv|·0.3)) · rot`.
  - Pick the hero with the largest `ahead`-rotated z.
  - Target: `to = rotationBetween(rotate(rot, hero.p), (0,0,1)) · rot`.
  - Duration: `420 + angle·260` ms, where `angle = 2·acos(|rot·to|)`.
  - Ease: `rot = slerp(from, to, cubicBezier(0.25, 0.75, 0.2, 1)(t))`.
  - On completion, mark the sphere settled and call `onSettle(heroIndex)` once.
- **Settled flag:** dragging, wheel, keys and snaps clear it, so an idle sphere does nothing.
- **Wheel / trackpad** (`passive: false`, `preventDefault`):
  - `dx = −(shift ? deltaY : deltaX)`, `dy = shift ? 0 : −deltaY`;
  - turn by `(dx·0.6, dy·0.6)`, then flick with `(dx·9, dy·9)`;
  - delay the snap by 90 ms.
- **Keys:**
  - The arrows flick with `(−mx·1500·u, −my·1500·u)`, where Left = (−1,0), Right = (1,0), Up = (0,−1), Down = (0,1).
  - `T` toggles the theme.
- **Double-click:** toggles `.dark` and calls `onThemeChange`.
- **Loop:** `dt = min(0.05, elapsed s)`. Skip rendering while `document.hidden`. Clean everything up on unmount.

## 7. Props

```ts
{ theme?: 'light' | 'dark'; allowThemeToggle?: boolean; onThemeChange?: (t) => void; onSettle?: (hero: number) => void;
  loadFont?: boolean; className?: string; style?: CSSProperties }
```

## 8. Acceptance checks

- **At rest (1200×860):**
  - the lime "Cue." hero sits dead centre, about 0.58·u·720 px wide;
  - about 40 cards are visible around it, spread to every edge;
  - the other heroes appear at half size.
- **Flicking upward** coasts, then glides (no bounce) until a different hero is centred, within about 0.7–1.2 s.
- **The icon hero** shows search → X → flower as it comes round to the front.
- **Double-click** gives a background of `rgb(17, 17, 17)`; the cards are unchanged.
- **Phone (390×844):** the field fills the tall screen, and a swipe settles a hero at the centre.
- **No errors and no images:** no console errors, no image requests; `onSettle` fires once per settle.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue200
