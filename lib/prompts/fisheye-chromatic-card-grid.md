# Fisheye Chromatic Card Grid — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal as an immersive full-screen gallery for a photography studio, fashion lookbook, or experimental agency portfolio wanting a tactile, glitch-tinged first impression.

---

# Edge Distortion Gallery — Infinite WebGL Card Grid with Fisheye + Chromatic Aberration

> **This is an ADDITION to my existing project. DO NOT create a new HTML file. DO NOT overwrite my current `<body>`, `<html>`, or global styles.**
> Insert this WebGL canvas full-screen at the spot I mark. If Three.js r128 is already loaded, reuse — don't duplicate. Namespace any new class names.

Build a pixel-perfect **infinite-scroll WebGL image gallery** with post-processing edge distortion. Full-viewport `<canvas>` renders a 5×5 grid of 600×750 image cards on a white background. Drag with mouse/touch to pan; when idle the camera auto-drifts diagonally. Cards **infinitely wrap** — as any card falls off-screen it teleports to the opposite side. A custom fragment shader applies a **bubble/fisheye barrel distortion** at the viewport edges plus **RGB chromatic aberration** — every card near the edge visibly bulges and splits into red/blue channels. Alpha-mask gives each card a rounded 40px corner. Zero dependencies beyond Three.js.

Award-winning cinematic feel, pure Three.js.

---

## FRAMEWORK

- **Three.js r128** + three official post-processing addons (EffectComposer, RenderPass, ShaderPass, CopyShader) from cdn.jsdelivr.
- Orthographic camera + PlaneGeometry cards for perfectly flat 2D layout.
- Custom fragment shader for the edge distortion + chromatic split.
- Vanilla JS. No React, no Three-Fiber, no dat.gui.

---

## ASSETS

CDN scripts (paste in `<head>`):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js"></script>
```

**6 image URLs** (exact — use these Pinterest sources):

```js
const imageUrls = [
  "https://i.pinimg.com/736x/aa/07/71/aa0771966b0d5b5060bf2c658c04b189.jpg",
  "https://i.pinimg.com/736x/c7/ce/94/c7ce943d488adaed5d08095d47561eb6.jpg",
  "https://i.pinimg.com/1200x/f6/39/84/f63984b0872a25e95bcadbe3bda3a275.jpg",
  "https://i.pinimg.com/236x/5d/7d/c4/5d7dc470354274887e4bfaf684906d0f.jpg",
  "https://i.pinimg.com/1200x/1b/06/4f/1b064f821cccc5aad2fb6adbd8325fad.jpg",
  "https://i.pinimg.com/736x/f6/7b/c8/f67bc8f81a69fef994f5d44d29fca451.jpg"
];
```

**CORS proxy** — Pinterest blocks direct WebGL texture loads. All URLs must be wrapped in `wsrv.nl`:

```js
const corsProxy = "https://wsrv.nl/?url=";
const proxiedUrl = corsProxy + encodeURIComponent(imageUrls[i]);
```

Without the proxy, textures load as opaque black (CORS violation on `THREE.TextureLoader`).

---

## BASE HTML/CSS

```css
body { margin: 0; overflow: hidden; background-color: #ffffff; font-family: sans-serif; cursor: grab; }
body:active { cursor: grabbing; }
canvas { display: block; }
```

Body is full-screen white, no scroll, cursor swaps `grab → grabbing` on drag.

---

## SECTION 1 — Scene, camera, renderer

```js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 2000;
const camera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  frustumSize / -2,
  -1000, 1000
);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);
```

**Why orthographic**: cards must stay flat (no perspective foreshortening) — barrel distortion is applied by the post-process shader, not by the camera. `frustumSize = 2000` sets how much world-space is visible vertically.

---

## SECTION 2 — Rounded-corner alpha mask (Canvas texture)

Each card needs rounded 40px corners. Solution: generate a Canvas 2D texture with a white rounded rect on black, use as `alphaMap`:

```js
function createRoundedAlphaMask() {
  const canvas = document.createElement('canvas');
  canvas.width = 600; canvas.height = 750;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';                        // black = fully transparent
  ctx.fillRect(0, 0, 600, 750);
  ctx.fillStyle = '#fff';                        // white = fully opaque
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(0, 0, 600, 750, 40);
  else ctx.rect(0, 0, 600, 750);                 // fallback for older browsers
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}
const alphaMap = createRoundedAlphaMask();
```

`ctx.roundRect(x, y, w, h, radius)` is the clean modern API; fall back to `ctx.rect` if unavailable. This alpha map is shared across all 25 cards.

---

## SECTION 3 — 5×5 grid of textured planes

```js
const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "Anonymous";
const cardGeometry = new THREE.PlaneGeometry(600, 750);
const cards = [];

for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    const urlIndex = (i * 5 + j) % imageUrls.length;
    const proxiedUrl = corsProxy + encodeURIComponent(imageUrls[urlIndex]);
    const texture = textureLoader.load(proxiedUrl);

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      alphaMap: alphaMap,
      transparent: true,
      alphaTest: 0.1,                            // strict clip → clean rounded corners
    });

    const card = new THREE.Mesh(cardGeometry, material);
    card.position.x = (i - 2) * 800;             // 800px column gap
    card.position.y = (j - 2) * -950;            // 950px row gap (negative because Y grows up)
    scene.add(card);
    cards.push(card);
  }
}
```

**Grid spacing**: 800px horizontal × 950px vertical between cards → each card has ~200px of breathing room (card is 600×750). The `(i - 2)` and `(j - 2)` centers the grid on `(0, 0)`.

`alphaTest: 0.1` is critical — without it, `transparent: true` alone gives blurry rounded corners due to alpha blending. With `alphaTest`, any pixel below 0.1 alpha is discarded outright → hard, crisp edges.

---

## SECTION 4 — The custom Edge Distortion Shader

Combines **bubble/fisheye barrel distortion** at edges with **chromatic aberration** (RGB split). Rendered as a post-processing pass over the whole scene, not per-card.

```glsl
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
  vec2 uv  = vUv;
  vec2 pos = uv * 2.0 - 1.0;                     // remap to [-1, 1] centered on screen

  // Box distance: how close is this pixel to ANY viewport edge (top/bottom/left/right).
  // Using max(abs(x), abs(y)) instead of length(pos) gives a SQUARE falloff,
  // so left/right sides get equal distortion as top/bottom (not just corners).
  float r = max(abs(pos.x), abs(pos.y));

  // smoothstep(0.75, 1.05) → inner 75% is flat, outer 25% distorts.
  // 1.05 upper bound guarantees distortion reaches strong values RIGHT AT the boundary.
  float edgeStrength = smoothstep(0.75, 1.05, r);

  // Barrel distortion: push UVs inward more strongly near edges
  float k = 0.3 * edgeStrength;
  vec2 distortedPos = pos / (1.0 + k * r * r);

  vec2 warpUv = distortedPos * 0.5 + 0.5;        // back to [0, 1]

  // Chromatic aberration — sample R/G/B at slightly offset UVs
  float offsetAmount = edgeStrength * 0.008;
  vec2 offset = normalize(pos) * offsetAmount;

  float red   = texture2D(tDiffuse, warpUv + offset).r;
  float green = texture2D(tDiffuse, warpUv).g;
  float blue  = texture2D(tDiffuse, warpUv - offset).b;

  gl_FragColor = vec4(red, green, blue, 1.0);
}
```

Full shader definition:

```js
const EdgeDistortionShader = {
  uniforms: { "tDiffuse": { value: null } },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `... (above)`,
};
```

Wire the composer:

```js
const composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));

const distortionPass = new THREE.ShaderPass(EdgeDistortionShader);
distortionPass.renderToScreen = true;
composer.addPass(distortionPass);
```

**Shader constants to tune**:
- `0.75` in smoothstep → where distortion starts (75% from center)
- `1.05` in smoothstep → where distortion is max (5% past edge)
- `0.3` in `k = 0.3 * edgeStrength` → strength of the barrel bulge
- `0.008` in `offsetAmount` → strength of the RGB split (8px on a 1000px viewport)

---

## SECTION 5 — Drag pan + auto-drift + infinite wrap

### State + drag listeners

```js
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let driftX = 1.0;
let driftY = -0.5;                                // slow diagonal auto-drift when idle

window.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousMousePosition = { x: e.offsetX, y: e.offsetY };
});
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const deltaMove = {
    x: e.offsetX - previousMousePosition.x,
    y: e.offsetY - previousMousePosition.y,
  };
  const panSpeed = (frustumSize / window.innerHeight) * 1.5;
  camera.position.x -= deltaMove.x * panSpeed;
  camera.position.y += deltaMove.y * panSpeed;    // Y flipped: screen-down = world-up
  previousMousePosition = { x: e.offsetX, y: e.offsetY };
});
window.addEventListener('mouseup',     () => { isDragging = false; });
window.addEventListener('mouseleave',  () => { isDragging = false; });

// Touch mirror
window.addEventListener('touchstart', (e) => {
  isDragging = true;
  previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});
window.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const deltaMove = {
    x: e.touches[0].clientX - previousMousePosition.x,
    y: e.touches[0].clientY - previousMousePosition.y,
  };
  const panSpeed = (frustumSize / window.innerHeight) * 1.5;
  camera.position.x -= deltaMove.x * panSpeed;
  camera.position.y += deltaMove.y * panSpeed;
  previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});
window.addEventListener('touchend', () => { isDragging = false; });
```

`panSpeed = (frustumSize / viewportHeight) * 1.5` maps screen pixels → world units correctly regardless of viewport size.

### Animate loop + infinite wrap

```js
function animate() {
  requestAnimationFrame(animate);

  const thresholdX = 800 * 2.5;                   // grid half-width in world units
  const thresholdY = 950 * 2.5;                   // grid half-height

  if (!isDragging) {
    camera.position.x += driftX;
    camera.position.y += driftY;
  }

  // Teleport any card that fell off one side to the opposite side
  cards.forEach(card => {
    if (card.position.x < camera.position.x - thresholdX) card.position.x += thresholdX * 2;
    if (card.position.x > camera.position.x + thresholdX) card.position.x -= thresholdX * 2;
    if (card.position.y < camera.position.y - thresholdY) card.position.y += thresholdY * 2;
    if (card.position.y > camera.position.y + thresholdY) card.position.y -= thresholdY * 2;
  });

  composer.render();
}
animate();
```

**Infinite wrap logic** — each card checks if it's fallen more than `thresholdX` beyond the camera in either direction. If yes, teleport it `thresholdX * 2` in the opposite direction — appears on the other side. Since the grid is 5×5 with spacing 800/950, `thresholdX * 2 = 4000px` matches exactly one full grid width — so wrapping never leaves gaps.

### Resize handler

```js
window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left  = (frustumSize * aspect) / -2;
  camera.right = (frustumSize * aspect) /  2;
  camera.top    =  frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});
```

Both renderer AND composer must be resized — miss the composer and the post-process pass renders at stale resolution.

---

## Responsive / accessibility

- **Full-viewport** — no width constraints. Works down to 320px.
- **Touch** — mirrored events handle mobile drag out of the box.
- **`prefers-reduced-motion: reduce`** — set `driftX = driftY = 0` on load if matches:
  ```js
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    driftX = 0; driftY = 0;
  }
  ```
- **Low-end mobile** — antialias is off by default (already set), `setPixelRatio(Math.min(dpr, 2))` caps DPR at 2 to prevent 3× on retina killing performance.

---

## Deliverable checklist (all must be true)

- [ ] Full-viewport `<canvas>`, white body background, cursor `grab → grabbing`.
- [ ] Three.js r128 + 4 post-processing addons loaded (EffectComposer, RenderPass, ShaderPass, CopyShader).
- [ ] OrthographicCamera with `frustumSize = 2000` and full width/height derived from aspect ratio.
- [ ] Renderer: `antialias: false`, DPR clamped to 2.
- [ ] Rounded 40px alpha mask generated via Canvas 2D + `roundRect` (with fallback), reused across all cards.
- [ ] 5×5 grid = 25 cards, each 600×750 PlaneGeometry, spaced 800 × 950 with `(i-2, j-2)` centering.
- [ ] Textures loaded via `TextureLoader` with `crossOrigin = "Anonymous"` and Pinterest URLs proxied through `https://wsrv.nl/?url=` (else CORS blackens them).
- [ ] `MeshBasicMaterial` uses `map`, `alphaMap`, `transparent: true`, `alphaTest: 0.1` — the alphaTest gives sharp rounded corners.
- [ ] EffectComposer stack: RenderPass → EdgeDistortionShader ShaderPass (`renderToScreen: true`).
- [ ] Fragment shader uses `r = max(abs(pos.x), abs(pos.y))` (BOX falloff not circular) so left/right + top/bottom all distort equally.
- [ ] `smoothstep(0.75, 1.05, r)` isolates the outer 25% ring as the distortion zone.
- [ ] Barrel factor `k = 0.3 * edgeStrength`, applied as `pos / (1.0 + k * r * r)`.
- [ ] Chromatic aberration: `offsetAmount = edgeStrength * 0.008`, R sampled at `+offset`, G at center, B at `-offset`.
- [ ] Drag pan: mouse + touch, `panSpeed = (frustumSize / innerHeight) * 1.5` for viewport-independent feel.
- [ ] Idle auto-drift: `driftX = 1.0, driftY = -0.5` (world units per frame) → soft diagonal drift when not dragging.
- [ ] Infinite wrap: threshold `800 * 2.5 = 2000` (X), `950 * 2.5 = 2375` (Y), teleport distance `= threshold * 2`.
- [ ] Resize handler updates BOTH `renderer.setSize` AND `composer.setSize`, plus camera frustum.
- [ ] `prefers-reduced-motion: reduce` zeros the drift.
- [ ] No console errors, textures load, edges visibly warp + RGB-split, grid feels truly infinite.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue059
