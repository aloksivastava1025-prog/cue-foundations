# Mosaic Tunnel Scroll Odyssey — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** A photography or creative studio portfolio hero that doubles as an image archive reveal before the main case-study grid.

---

# PROMPT — Portfolio Mosaic Flow Tunnel (paste-ready, pixel-perfect)

Copy from `---BEGIN PROMPT---` to `---END PROMPT---`. Paste into v0 / Bolt / Cursor / Claude / ChatGPT.

---BEGIN PROMPT---

Build a **single-file `index.html`** cinematic scroll experience. A brand hero on load — split kinetic typography ("MOSAIC" / "FLOW" / "GALLERY" with a manifesto card and CTA between them) — then, as the user scrolls, the hero fades out, a minimal serif line appears in black space ("LET'S BEGIN JOURNEY"), and the camera plunges into a massive 3D twisted tunnel whose walls are a mosaic of the user's images. The tunnel morphs, warps its FOV, barrel-rolls, and finally reaches an outro reveal ("The End of the Journey").

Vanilla HTML/CSS/JS + Three.js r128 (CDN). No framework, no build step. Match every spec below exactly.

## Foundation

- Load Google Fonts: `Cinzel:wght@400;600` (cinematic serif for journey + ending text) and use system `Inter` fallback for body/hero.
- Three.js: `<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>`.
- `body, html { margin:0; padding:0; width:100%; overflow-x:hidden; background:#000; font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif }`.
- Canvas container: `position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none`.
- Invisible scroll track drives progress:
  ```css
  .scroll-track { height:5000vh; width:100%; position:relative; z-index:2; pointer-events:none; }
  ```
  5000vh gives an ultra-slow premium scroll speed for the entire cinematic. Adjust between 3000vh (faster) and 8000vh (slower).

## Layer stack (z-index)

| Layer | z-index | Contents |
|---|---|---|
| Three canvas | 1 | Full-screen WebGL |
| Scroll track | 2 | Invisible height driver |
| All fixed text overlays | 10 | Hero typography, journey text, ending text |

## Hero typography — the load-time brand hero

`#hero-typography` — `position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:10; pointer-events:none; will-change:opacity, transform`.

Three big words placed like a fractured layout with a manifesto card at center-left:

**Word 1 — top-left "MOSAIC"** (`.typo-what`):
- `position:absolute; top:5%; left:2%`.
- Font: Inter 900. Size: `min(22vw, 28vh)` (capped so it doesn't overlap on ultra-wide screens).
- `line-height:0.8; letter-spacing:-1vw; color:#fff; text-transform:uppercase; margin:0`.

**Word 2 — mid-right "FLOW"** (`.typo-we`):
- Same typography as word 1.
- `position:absolute; top:42%; right:2%`.

**Word 3 — bottom "GALLERY"** (`.typo-do`) — this word starts hidden inside a mask container that slides up on load:
- Wrapper `.typo-do-wrapper`: `position:absolute; bottom:0; left:26%; width:50%; height:35vh; overflow:hidden; display:flex; align-items:flex-end; padding-bottom:2vh`.
- Word: `transform:translateY(110%); will-change:transform` — JS slides it to `translateY(0)` during the hero exit ramp.

**Manifesto card — center-left** (`.typo-center`):
- `position:absolute; top:45%; left:26%; transform:translateY(-50%); width:320px; max-width:35vw; font-family:'Inter'; pointer-events:auto`.
- Paragraph — 15px, weight 500, line-height 1.5, color `#d0d0d0`, letter-spacing `-0.3px`, `margin-bottom:25px`. Copy:
  > Vision is nothing without execution. We build both. We create immersive 3D experiences, campaigns, and the systems that get them made.
- Button (`.typo-btn`) — `background:#111; color:#fff; border:1px solid #444; padding:12px 18px; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; display:flex; align-items:center; gap:10px; cursor:pointer; transition:all 0.3s`. Text: `OUR SERVICES` + inline SVG chevron (24×24 viewBox, `polyline points="9 18 15 12 9 6"`, stroke currentColor, stroke-width 2). Hover: `background:#fff; color:#000`.

**Scroll indicator** (`.hero-scroll`) — bottom-right, tucked under "FLOW":
- `position:absolute; bottom:4vh; right:8vw; display:flex; flex-direction:column; align-items:center; gap:15px; opacity:0`.
- Fades in via `animation: fadeIn 2s ease 1.5s forwards` (keyframe: `to { opacity:1 }`).
- Label span — Inter 10px, letter-spacing 3px, color `rgba(255,255,255,0.5)`, text: `SCROLL TO DIVE`.
- Line: `width:1px; height:60px; background:linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)`.

## Journey text (mid-scroll interlude)

`#journey-text` — `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:10; color:#fff; pointer-events:none; text-align:center; white-space:nowrap; will-change:opacity, transform`.

- Font: Cinzel 400.
- Size: `1.5vw` (elegant small cinematic).
- `letter-spacing:1.2vw; margin-right:-1.2vw` (offsets the tracking so the block reads visually centered).
- Text-transform: uppercase.
- Copy: `LET'S BEGIN JOURNEY`.

Blur-stagger reveal (each char is a `<span>`):
```css
.journey-text span {
  display: inline-block;
  opacity: 0;
  filter: blur(10px);
  transform: translateY(20px) scale(0.9);
  transition: opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1),
              filter 1.5s cubic-bezier(0.16, 1, 0.3, 1),
              transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.journey-text.is-visible span {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0) scale(1);
}
```
Stagger via `transitionDelay = baseDelay + i × 0.02s`, base delay `0.1s`.

## Ending text (final reveal at 100% scroll)

`#ending-text` — same positioning as journey text, `white-space:nowrap; opacity:0`.

- `.ending-title` — Cinzel 400, `font-size:3vw`, `letter-spacing:0.5vw`, uppercase, `text-shadow:0 0 30px rgba(255,255,255,0.4)`, `margin:0 0 15px 0`. Copy: `The End of the Journey`.
- `.ending-subtitle` — Inter 300, `font-size:0.9vw`, letter-spacing 4px, uppercase, color `rgba(255,255,255,0.7)`, margin 0. Copy: `You have reached the end of the collection`.

Both use the same char-span blur-stagger reveal as journey text but with tighter timing:
```css
.ending-title span, .ending-subtitle span {
  display: inline-block; opacity: 0; filter: blur(10px); transform: translateY(20px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.ending-text.is-visible span { opacity:1; filter:blur(0); transform:translateY(0); }
.ending-text.is-visible { opacity: 1; }
```
Stagger: title at base delay `0.2s`, subtitle at base delay `0.5s`, both `+ i × 0.02s`.

## Three.js scene setup

```js
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xe4e6e9, 0.008);   // pale mid-tone fog inside the tunnel

const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(-15, 8, 25);
camera.lookAt(15, -5, -25);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x000000, 0);
document.getElementById('canvas-container').appendChild(renderer.domElement);
```

Lights: `AmbientLight(0xffffff, 0.6)`, `DirectionalLight(0xffffff, 0.8)` at `(10,20,10)`, and a `PointLight(0xffffff, 0.5, 100)` at origin.

## Mosaic texture — the tunnel walls

`createMosaicTexture(images)` builds a 2048×2048 canvas of horizontal-panel mosaic:
- White background (grout).
- 5 rows, each row height = 2048/5.
- Per row: fill panels left-to-right, each panel `blockWidth = 400 + Math.random() * 500`.
- If `images` array is available, pick a random image per panel, apply `object-fit: cover` cropping math:
  ```js
  const imgRatio = img.width / img.height;
  const tileRatio = (blockWidth - gap) / (rowHeight - gap);
  let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
  if (imgRatio > tileRatio) {
    sWidth = img.height * tileRatio;
    sx = (img.width - sWidth) / 2;
  } else {
    sHeight = img.width / tileRatio;
    sy = (img.height - sHeight) / 2;
  }
  ctx.drawImage(img, sx, sy, sWidth, sHeight, currentX + gap/2, y * rowHeight + gap/2, blockWidth - gap, rowHeight - gap);
  ```
- Gap of 12px between panels (visible as white "grout").
- Fallback (before images load): random `['#0066ff', '#ffd52b', '#005b5b', '#b388ff']` blocks so the tunnel isn't grey during load.

Return a `CanvasTexture` with `wrapS/wrapT = RepeatWrapping`, `repeat.set(30, 1)` (30 tiles around the tunnel circumference, single along length), full anisotropy, sRGB encoding.

## Images — user's own asset bank

Ship the 16 Pinterest URLs listed below (or the user's own array). Load through the Weserv proxy to avoid Pinterest CORS issues:
```js
const proxyUrl = 'https://images.weserv.nl/?url=' + url.replace(/^https?:\/\//, '');
```
On failure, retry with the original URL. When all attempts finish (regardless of success), rebuild the mosaic texture with the loaded images, replace `tubeMat.map`, and `dispose` the old texture.

Ship these URLs by default (swap for user's own images — the mosaic is N-generic):
```
https://i.pinimg.com/736x/2c/8d/c3/2c8dc332a16f6e171184b47052513b87.jpg
https://i.pinimg.com/736x/3e/f8/82/3ef882b98b47108bba02ef86f1471f55.jpg
https://i.pinimg.com/736x/39/f7/3a/39f73aab3b6db054d1ce12cf7da7bdaf.jpg
https://i.pinimg.com/736x/03/8d/b5/038db541355f53ce8792efaeab94550a.jpg
https://i.pinimg.com/736x/8a/93/49/8a93491afd90a09985eaddce102b329b.jpg
https://i.pinimg.com/736x/2b/05/80/2b0580d548248a24d6e4f84bc413a142.jpg
https://i.pinimg.com/736x/26/32/5b/26325bfd9131880dc4d695cd229508cc.jpg
https://i.pinimg.com/736x/2e/0a/74/2e0a74bd4db9a61a4f6061feb620b607.jpg
https://i.pinimg.com/736x/2a/4e/30/2a4e308d142e5c38b1d7c83025566e47.jpg
https://i.pinimg.com/1200x/74/a8/a8/74a8a8540eeedc3870a1ab979a2c242a.jpg
https://i.pinimg.com/1200x/0e/bb/84/0ebb8414f9c7e419c2732dc8a5af3ea2.jpg
https://i.pinimg.com/1200x/77/bd/d8/77bdd84c56688618569a4dc812112c7a.jpg
https://i.pinimg.com/1200x/f8/7f/dd/f87fdde4441ea5f3affbb4a6dfe25d1f.jpg
https://i.pinimg.com/736x/59/94/03/5994032453417acae9481e23a2268b15.jpg
https://i.pinimg.com/1200x/04/fc/40/04fc405577290da0c7818a43373a4d88.jpg
https://i.pinimg.com/1200x/7e/f7/99/7ef7990b1c5b1f417e5c9065da75a273.jpg
```

## The tunnel curve

`CatmullRomCurve3` — a massive finite path with long straights and extreme twists:

```js
const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, -2500),         // long forward
  new THREE.Vector3(400, 0, -2900),       // sharp turn RIGHT
  new THREE.Vector3(2500, 0, -2900),
  new THREE.Vector3(2900, 400, -2900),    // sharp turn UP
  new THREE.Vector3(2900, 2500, -2900),
  new THREE.Vector3(2900, 2900, -2500),   // sharp turn BACKWARD
  new THREE.Vector3(2900, 2900, 0),
  new THREE.Vector3(2500, 2900, 400),     // sharp turn LEFT
  new THREE.Vector3(400, 2900, 400),
  new THREE.Vector3(0, 2500, 400),        // sharp turn DOWN
  new THREE.Vector3(0, 400, 400),

  // Extended twists — huge organic plunge to close the ride
  new THREE.Vector3(0, 0, 400),
  new THREE.Vector3(0, 0, 2500),
  new THREE.Vector3(-1500, 0, 2500),
  new THREE.Vector3(-1500, -1500, 2500),
  new THREE.Vector3(-1500, -1500, -1500),
  new THREE.Vector3(0, -1500, -1500),
  new THREE.Vector3(0, 0, -1500)
]);
curve.closed = false;
```
Geometry: `new THREE.TubeGeometry(curve, 1500, 20, 64, false)` — 1500 length segments, radius 20, 64 radial segments.

Material: `MeshStandardMaterial({ map: mosaicTex, roughness: 0.2, metalness: 0.1, side: THREE.DoubleSide })`. DoubleSide is required for the plunge shot where camera is outside the tube.

## Scroll-driven camera choreography — 5 phases

Native scroll drives everything. Read `window.scrollY`, ease into `currentScrollY` (`+= (target - current) * 0.06`), then `cameraProgress = clamp(currentScrollY / maxScroll, 0, 0.999)`.

**Phase thresholds** (all as fractions of total scroll):
```js
const tHeroFadeOutStart   = 0.05;
const tHeroFadeOutEnd     = 0.12;
const tJourneyTextIn      = 0.15;
const tJourneyTextOutStart = 0.25;
const tJourneyTextOutEnd  = 0.30;
const tPlungeStart        = 0.30;
const tPlungeEnd          = 0.60;
```

**Phase 1 — Hero slide (0 → 0.05)**
- `#typo-do` slides from `translateY(110%)` to `translateY(0)` as `slideProgress = min(1, cameraProgress / 0.05)`.
- All other hero text visible.

**Phase 2 — Hero fade (0.05 → 0.12)**
- `heroAlpha = 1 - (cameraProgress - 0.05) / 0.07`.
- Apply to `.hero-typography`: `opacity = heroAlpha; transform: translateY(${(1-heroAlpha)*-100}px) scale(${1 + (1-heroAlpha)*0.05})` — pushes up and slightly zooms as it fades.
- Same alpha to `.hero-scroll` indicator.

**Phase 3 — Journey text in (0.15 → 0.25)**
- Add `.is-visible` to `#journey-text` (blur-stagger reveal fires).

**Phase 4 — Journey text out (0.25 → 0.30)**
- `journeyAlpha = 1 - (cameraProgress - 0.25) / 0.05`. Apply to `#journey-text.opacity`.
- Remove `.is-visible` after `0.30` (resets stagger for potential reverse scroll).

**Phase 5 — The cinematic plunge (0.30 → 0.60)**
Before `tPlungeStart`, `startTransition = 1` (drone shot held, tunnel invisible in black space).

Inside `[tPlungeStart, tPlungeEnd]`:
```js
const plungeProgress = (cameraProgress - tPlungeStart) / (tPlungeEnd - tPlungeStart);
let startTransition = 1 - plungeProgress;
startTransition = startTransition * startTransition * (3 - 2 * startTransition); // smoothstep

tubeMat.opacity = Math.pow(plungeProgress, 2);          // tunnel fades IN from black
if (tubeMat.map) tubeMat.map.repeat.set(30 + 200 * startTransition, 1); // massive streak → normal
```

While `startTransition > 0`, camera does a drone shot + tunnel morph:
```js
// Push camera diagonally out of the tube
camera.position.x += startTransition * 3000;
camera.position.y += startTransition * 2000;
camera.position.z += startTransition * 3000;

// Lerp look-at along the comet streak
const droneLookAt = new THREE.Vector3(0, 0, -2500);
lookAtPos.lerp(droneLookAt, startTransition);

// Collapse the tube into a streaking line, but leave enough radius to render
const pinch = 1 - startTransition * 0.85;               // radius shrinks from 20 → 3
tubeMesh.scale.set(pinch, pinch, 1 + startTransition * 1.5);

// FOV warp + barrel roll — peaks in the middle of the plunge
const plungePeak = Math.sin(startTransition * Math.PI);
const fovWarp   = plungePeak * 50;                       // FOV 75° → 125° dolly zoom
const rollWarp  = plungePeak * (Math.PI / 3);            // 60° Z-axis barrel roll

camera.fov = 75 + fovWarp;
camera.updateProjectionMatrix();
if (rollWarp !== 0) camera.rotateZ(rollWarp);            // apply AFTER lookAt
```

After `tPlungeEnd`, the camera is fully inside the tube and cruises the remaining length.

**Phase 6 — The exit fade (0.95 → 1.0)**
```js
if (cameraProgress > 0.95) {
  const fadeOutProgress = (cameraProgress - 0.95) / 0.05;
  tubeMat.opacity = 1 - Math.pow(fadeOutProgress, 2);
}
```
Tunnel fades to pure black, revealing the ending text underneath.

**Ending reveal (0.99+)**
```js
if (cameraProgress > 0.99) endingText.classList.add('is-visible');
else                        endingText.classList.remove('is-visible');
```

## Camera position along the tunnel

Split camera advance from scroll progress so the massive plunge doesn't consume the tunnel's actual travel:

```js
let tunnelProgress = 0;
if (cameraProgress <= tPlungeEnd) {
  // First 60% of scroll = only 5% into the tunnel's mouth (visual anchor for the plunge)
  tunnelProgress = (cameraProgress / tPlungeEnd) * 0.05;
} else {
  // Remaining 40% of scroll travels the remaining 95% of the tunnel length
  const cruiseProgress = (cameraProgress - tPlungeEnd) / (1 - tPlungeEnd);
  tunnelProgress = 0.05 + cruiseProgress * 0.949;
}

const camPos    = curve.getPointAt(tunnelProgress);
const lookAtPos = curve.getPointAt(Math.min(tunnelProgress + 0.01, 1));
camera.position.copy(camPos);
// lookAt applied AFTER drone lerp above (see Phase 5)
```

## Continuous UV drift inside the tunnel

Even while paused, the tunnel walls should flow. In the animate loop:
```js
if (tubeMat.map) tubeMat.map.offset.x -= 0.002;
```
This creates a constant sideways drift on the wall texture — sells the sense of motion even between scroll ticks.

## Char-span helper for blur-stagger reveal

At startup, split the three text elements into `<span>` children and set staggered `transitionDelay`:

```js
function setupBlurStagger(id, baseDelay) {
  const el = document.getElementById(id);
  const text = el.innerText;
  el.innerHTML = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i] === ' ' ? '&nbsp;' : text[i];
    const span = document.createElement('span');
    span.innerHTML = char;
    span.style.transitionDelay = `${baseDelay + i * 0.02}s`;
    el.appendChild(span);
  }
}
setupBlurStagger('ending-title', 0.2);
setupBlurStagger('ending-subtitle', 0.5);
setupBlurStagger('journey-text', 0.1);
```

## Resize handling

```js
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
```

## Customization knobs (safe to tweak)

| Knob | Location | Effect |
|---|---|---|
| Hero copy | `.typo-what`, `.typo-we`, `.typo-do` | Three big words. Any short uppercase word. |
| Manifesto text | `.typo-center p` | Two-line brand line, 30–50 words. |
| CTA label | `.typo-btn` innerText | Button text. |
| Journey copy | `#journey-text` | Interlude line, keep short (fits `nowrap`). |
| Ending copy | `#ending-title`, `#ending-subtitle` | End reveal — title 5–8 words, subtitle 6–10. |
| Scroll length | `.scroll-track { height: 5000vh }` | 3000–8000vh — trades speed for detail. |
| Phase thresholds | `tHeroFadeOutStart` … `tPlungeEnd` | Retimes the whole story arc. Keep them monotonically increasing. |
| Mosaic panels per row | `blockWidth = 400 + rand * 500` in `createMosaicTexture` | Larger = fewer, chunkier panels. |
| Rows | `const rows = 5` | Number of horizontal bands. |
| Tunnel radius | `TubeGeometry(curve, 1500, 20, ...)` | 20 default; 15 = tighter tunnel, 30 = cavern. |
| Tunnel segments | `TubeGeometry(..., 1500, ...)` | Higher = smoother curve; costs perf. |
| Curve waypoints | `CatmullRomCurve3([...])` | Swap for any path; keep monotonic Z or accept back-doubling. |
| FOV warp peak | `plungePeak * 50` | 30 = subtle warp, 70 = extreme dolly-zoom. |
| Barrel roll peak | `plungePeak * (Math.PI / 3)` | π/6 = subtle bank, π/2 = full sideways roll. |
| Wall drift speed | `map.offset.x -= 0.002` | Higher = faster wall streak. |
| Ambient light intensity | `AmbientLight(0xffffff, 0.6)` | Overall wall brightness. |
| Image URLs | `imageUrls` array | Any array length — mosaic is N-generic. |
| Journey/Ending fonts | Google Fonts link + CSS | Swap Cinzel for any editorial serif (EB Garamond, Playfair, DM Serif Display). |

## Responsive

The tunnel scales with the viewport (WebGL is naturally responsive), but the hero typography needs breakpoints. Add these:

```css
/* Tablet — 641px to 1024px */
@media (max-width: 1024px) {
  .typo-what, .typo-we, .typo-do { font-size: min(26vw, 22vh); letter-spacing: -0.8vw; }
  .typo-center { left: 6%; width: 300px; max-width: 60vw; top: 42%; }
  .typo-center p { font-size: 14px; }
  .typo-do-wrapper { left: 6%; width: 88%; }
  .journey-text { font-size: 2.4vw; letter-spacing: 1.6vw; margin-right: -1.6vw; }
  .ending-title { font-size: 5vw; letter-spacing: 0.6vw; }
  .ending-subtitle { font-size: 1.4vw; }
}

/* Mobile — ≤ 640px */
@media (max-width: 640px) {
  .typo-what { font-size: 20vw; letter-spacing: -0.6vw; top: 4%; left: 4%; }
  .typo-we   { top: 44%; right: 4%; font-size: 20vw; }
  .typo-do   { font-size: 20vw; }
  .typo-do-wrapper { left: 4%; width: 92%; height: 22vh; }
  .typo-center { position: absolute; top: 32%; left: 4%; right: 4%; width: auto; max-width: none; transform: none; }
  .typo-center p { font-size: 13px; margin-bottom: 18px; line-height: 1.45; }
  .typo-btn { padding: 10px 14px; font-size: 10px; }
  .hero-scroll { right: 4%; bottom: 3vh; }
  .journey-text { font-size: 4vw; letter-spacing: 2vw; margin-right: -2vw; white-space: normal; padding: 0 6%; }
  .ending-title { font-size: 8vw; letter-spacing: 0.8vw; }
  .ending-subtitle { font-size: 2.6vw; letter-spacing: 3px; }
}
```

**Touch input** — the experience is scroll-only; touch scroll works out of the box (`overflow-x:hidden` on body, `overflow-y` unset). Do NOT add `touch-action:none` — you need native scroll.

**Motion / GPU cost on mobile** — WebGL tunnel is heavy. Two fallbacks:

1. Cap DPR on smaller screens:
   ```js
   renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 640 ? 1.5 : 2));
   ```
2. Reduce tunnel geometry cost on mobile:
   ```js
   const segCount = innerWidth < 640 ? 800 : 1500;
   const radialSegs = innerWidth < 640 ? 32 : 64;
   const tubeGeom = new THREE.TubeGeometry(curve, segCount, 20, radialSegs, false);
   ```

**Reduced motion** — respect the user's OS setting; skip the barrel roll + FOV warp:
```css
@media (prefers-reduced-motion: reduce) {
  /* CSS transitions removed */
  .journey-text span, .ending-title span, .ending-subtitle span {
    transition: opacity 0.3s ease;
    transform: none !important; filter: none !important;
  }
}
```
```js
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) { /* skip rollWarp and fovWarp in the plunge branch */ }
```

**Orientation change** — hook `orientationchange` alongside `resize` so the curve/camera reflow immediately.

## Deliverable checklist

- [ ] Single HTML file, no build step, Three.js r128 + Google Fonts CDN
- [ ] `.scroll-track` 5000vh drives all progress via native scroll (no wheel/pointer handlers)
- [ ] Native scroll eased via `currentScrollY += (target - current) * 0.06`
- [ ] Hero typography — three uppercase words at (top-left, mid-right, bottom-masked) with centered manifesto card and CTA button
- [ ] `#typo-do` slides from 110% → 0% inside `.typo-do-wrapper` mask during Phase 1
- [ ] Hero fades + zooms out during Phase 2 (0.05 → 0.12)
- [ ] Scroll indicator fades in at load (2s ease with 1.5s delay)
- [ ] Journey text renders as per-char spans with blur-stagger (i × 0.02s + 0.1s base)
- [ ] Ending text renders same way, staggers at 0.2s (title) and 0.5s (subtitle) bases
- [ ] Mosaic canvas function: 5 rows, 12px gap, random 400–900px block widths, object-fit cover cropping math
- [ ] Weserv CORS proxy for image loading with direct-URL fallback on error
- [ ] Tube: TubeGeometry over 19-waypoint CatmullRomCurve3, radius 20, 1500 segments, 64 radial, DoubleSide material
- [ ] 5-phase choreography with exact threshold constants named above
- [ ] Plunge camera diverts by (+3000, +2000, +3000) at startTransition = 1, returns to path at 0
- [ ] Tube scale pinches from (1,1,1) → (0.15, 0.15, 2.5) at plunge peak
- [ ] FOV warp: 75° → 125° at plunge peak; barrel roll: 0 → 60° at peak
- [ ] Tunnel opacity fades in during plunge (`pow(plungeProgress, 2)`) and out at 0.95+
- [ ] Ending text only reveals at cameraProgress > 0.99
- [ ] `tunnelProgress` split from `cameraProgress` — plunge consumes 60% of scroll for 5% of tunnel, cruise consumes 40% for 95%
- [ ] Wall UV drift `-= 0.002` per frame
- [ ] Responsive: tablet + mobile breakpoints with hero relayout; DPR + segment count reduced on mobile; `prefers-reduced-motion` skips FOV warp + barrel roll
- [ ] Resize + orientationchange rebind camera aspect and renderer size
- [ ] No console errors on load or during scroll

---END PROMPT---

## Notes for the human

- **The magic is the phase split.** `tunnelProgress` decoupled from `cameraProgress` means the plunge is a *cinematic pause* — you're stretching 60% of the scroll over just 5% of the tunnel. Without that split, the tunnel would sprint past.
- The Cinzel serif choice is deliberate — its high-contrast strokes read as luxury/editorial. Sub for Playfair Display or Fraunces without changing the layout.
- Barrel roll + FOV warp together = the "wormhole" feeling. Skip either to tone it down; skip both if the target audience is motion-sensitive.
- The **`weserv.nl` proxy** is the reliable way to bypass Pinterest's canvas-tainting CORS. If your images are on your own CDN with proper CORS headers, drop the proxy entirely.
- Change the three hero words + manifesto + ending copy — that's the 4-token rebrand. Everything else can stay for the vibe.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue028
