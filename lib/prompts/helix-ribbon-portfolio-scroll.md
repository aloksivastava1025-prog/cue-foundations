# Helix Ribbon Portfolio Scroll — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** A motion design studio's portfolio landing page, replacing the static hero with a scrollable, spatial card reel.

---

# PROMPT — 3D Continuous Ribbon · Portfolio Helix (paste-ready, pixel-perfect)

Copy from `---BEGIN PROMPT---` to `---END PROMPT---`. Paste into v0 / Bolt / Cursor / Claude / ChatGPT.

---BEGIN PROMPT---

Build a **single-file `index.html`** that renders a full-viewport 3D twisting ribbon of poster cards passing through giant background text. Vanilla HTML/CSS/JS + Three.js r128 (via cdnjs). No framework, no build step. Two view modes — a single twisted RIBBON and a DOUBLE ROLLER — toggle via a top-right button. Mouse drag or scroll flows the ribbon; hover moves the camera.

## Foundation

- Head: load Three.js from `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`.
- Body/html reset: `margin:0; padding:0; width:100%; height:100%; background:#e4e6e9; overflow:hidden; font-family:'Space Mono', monospace`.
- `#canvas-container` — `width:100vw; height:100vh; perspective:1000px; position:absolute; top:0; left:0; z-index:10`.
- Fixed background grid: `.bg-grid` — `position:fixed; inset:0; display:flex; justify-content:space-between; padding:0 10vw; box-sizing:border-box; z-index:1`. Four `.line` divs — each `width:1px; height:100%; background:rgba(0,0,0,0.2)`.
- Bottom-center `.ui-overlay`: `position:absolute; bottom:30px; left:50%; transform:translateX(-50%); color:#888; font-size:14px; letter-spacing:2px; text-transform:uppercase; z-index:20`. Text: `Scroll or Drag to Explore`.
- Top-right `#toggle-btn`: `position:absolute; top:30px; right:30px; padding:12px 24px; background:rgba(0,0,0,0.85); color:white; border:1px solid rgba(255,255,255,0.15); border-radius:4px; font:600 13px -apple-system, sans-serif; text-transform:uppercase; letter-spacing:1.5px; cursor:pointer; z-index:100`. Hover: `background:white; color:black`. Default label: `Switch to Double Roller`.

## Three.js setup

```
const scene = new THREE.Scene();
const helixGroup = new THREE.Group();
scene.add(helixGroup);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 3000);
camera.position.set(0, 0, 1500);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);
```

## Background 3D text plane (the "PORTFOLIO" that the ribbon threads through)

- Create a 4096×1024 offscreen canvas.
- `fillStyle:'#000000'; font:'900 600px "Arial Black", Impact, sans-serif'; textAlign:'center'; textBaseline:'middle'`.
- Draw `PORTFOLIO` at (2048, 512).
- Wrap in `THREE.CanvasTexture` → `MeshBasicMaterial{ map, transparent:true, alphaTest:0.1 }` → `PlaneGeometry(4096, 1200)` → `mesh.position.z = 0` (dead center so the helix waves in front of + behind it).
- Add mesh directly to `scene` (not to `helixGroup` — the text stays fixed while the helix rotates).

## Lights (4-light setup for cinematic depth)

- `AmbientLight(0xffffff, 0.2)`.
- Key `DirectionalLight(0xffffff, 2.0)` at (200, 400, 400), `castShadow:true`, shadow map 2048², `shadow.bias:-0.001`.
- Fill `DirectionalLight(0xabc3eb, 0.3)` at (-300, -200, -200) — cool tone.
- Rim `DirectionalLight(0xffffff, 1.2)` at (0, 500, -600) — back-light for silhouette pop.

## Texture atlases

### 7-card design library — the shared `drawDesign(ctx, index, w, h)` function

Draws these 7 posters (index 0–6). Each draws to a `w × h` region starting at (0,0) in the passed context.

- **0 — ORDER stack (black + red + white):** `fillStyle #000` full rect. Then three `ORDER` labels centered at y=25%/50%/75%, font `900 110px Arial`, colors white / `#f04e23` / white.
- **1 — Green writers-club poster:** `fillStyle #3d5e38` full rect. Small `#c9dec2 bold 36px monospace` "28 June 2024" at (40, 20% h). Then three heavy Arial 900 75px lines "SUNDAY" / "WRITERS" / "CLUB" at 45%/65%/85% h, left-aligned x=40.
- **2 — Yellow/red/black gradient with concentric rings:** vertical `linearGradient (0→h)`: `#ffcf33 → #ff4b1f (50%) → #000`. Fill rect. Then 15 concentric white-15%-alpha circles stroked lineWidth 4, centered, radii step 20.
- **3 — UP / DWN scroll card:** white bg. Ghost `rgba(0,0,0,0.04) 900 280px Arial` "UP" at (w/2, 35% h), "DWN" at (w/2, 90% h). Then black `bold 45px Arial` "SCROLL ↓" at (w/2, 40% h) and "EXPLORE →" at (w/2, 60% h).
- **4 — Abstract photo mock:** `#111` bg. Radial gradient centered `#555 → #111` at radius w×0.4, painted as a circle. Then a `rgba(255,255,255,0.6)` circle stroke lineWidth 15 at radius w×0.3.
- **5 — Yellow CAUTION ZONE:** `#fbd400` bg. Black `900 110px Arial` "CAUTION" at (w/2, 40% h) and "ZONE" at (w/2, 65% h). Black rect stroke lineWidth 20 with 40px inset.
- **6 — Dark 07 number card:** `#111` bg. Ghost `rgba(255,255,255,0.05) 900 350px Arial` "07" at (w/2, 60% h). Then white `900 65px Arial` "PUSHING" at 40% h and "FORWARD" at 55% h.

### 2 atlases built in `createAtlases()`:

- **Ribbon atlas (512 wide × 3584 tall):** stacks all 7 designs top-to-bottom in a single 512² tile each. After each design, stroke a white 30%-alpha 8px inset border at the tile edges. `wrapS/wrapT = RepeatWrapping`, `anisotropy = renderer.capabilities.getMaxAnisotropy()`, `encoding = sRGBEncoding`. Applied to `matRibbon` (see below).
- **Roller atlas (1024 × 2048):** two columns × 4 rows layout. Fill entire canvas with `#e4e6e9` first. Padding 12px per cell. Column 1 (x=0): designs 0,1,2,3 stacked. Column 2 (x=512): designs 4,5,6,2 at half-offset y positions ( -ch/2, ch/2, 1.5ch, 2.5ch, 3.5ch — cards 4,5,6,2,4 — deliberate offset for staggered vertical alignment). Same wrapping/anisotropy/encoding. Applied to `matRoller`.

### Materials

Both start with a placeholder `CanvasTexture` and later get `matX.map = newTexX; matX.needsUpdate = true`.

- `matRibbon = MeshStandardMaterial{ map: texRibbon, side:DoubleSide, transparent:true, roughness:0.3, metalness:0.1 }`.
- `matRoller = MeshStandardMaterial{ map: texRoller, side:DoubleSide, transparent:true, roughness:0.3, metalness:0.1 }`.

## Ribbon geometry (twisted strip)

600 segments along `t ∈ [0, 2π]`. For each `i`:

```js
const t = (i / 600) * Math.PI * 2;
const p = new THREE.Vector3(
  Math.sin(t*2) * 100,   // x — figure-8 sway
  Math.cos(t)   * 380,   // y — vertical progression
  Math.sin(t)   * 300    // z — depth pulse
);
const tangent = new THREE.Vector3(
  Math.cos(t*2) * 200,
  -Math.sin(t)  * 380,
  Math.cos(t)   * 300
).normalize();

let binormal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0,1,0)).normalize();
if (binormal.lengthSq() < 0.001) binormal = new THREE.Vector3(1,0,0);   // safety

// Sine-based twist: face flat at the front, twist away at the back
const twist = Math.sin(t) * (Math.PI / 2);
binormal.applyAxisAngle(tangent, twist);

const ribbonWidth = 280;
const v1 = p.clone().add(binormal.clone().multiplyScalar( ribbonWidth/2));
const v2 = p.clone().add(binormal.clone().multiplyScalar(-ribbonWidth/2));

vertices.push(v1.x,v1.y,v1.z,  v2.x,v2.y,v2.z);
uvs.push(0, (i/600)*2,  1, (i/600)*2);   // repeat UV twice around the loop
```

Build triangles: for each segment `i`, push indices `(a, b, c)` and `(b, d, c)` where `a=2i, b=2i+1, c=2(i+1), d=2(i+1)+1`.

Finalize:
```
geomRibbon.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geomRibbon.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
geomRibbon.setIndex(indices);
geomRibbon.computeVertexNormals();
const ribbon = new THREE.Mesh(geomRibbon, matRibbon);
ribbon.castShadow = true;
ribbon.receiveShadow = true;
helixGroup.add(ribbon);
```

## Double-roller geometry (alternative mode)

Two curved cylinder-planes side by side, each `650 × circumference` bent into a full cylinder.

- Radius: 400. Circumference = `2π × 400`.
- `PlaneGeometry(650, circumference, 8, 128)`.
- For each vertex, compute `theta = (y / circumference) * 2π`, then `pos.setY(i, sin(theta)*400)` and `pos.setZ(i, cos(theta)*400)`. `computeVertexNormals()` after.
- Container `THREE.Object3D` holds two meshes:
  - `roller1` at `x = -350` using `matRoller1` (`map.repeat = (0.5, 1); map.offset = (0, 0)` — left half of the atlas).
  - `roller2` at `x = +350` using `matRoller2` (`map.repeat = (0.5, 1); map.offset = (0.5, 0)` — right half).
- Both `matRoller1/matRoller2` have `transparent:false` — critical fix so back/front faces of the cylinder don't z-glitch.
- `doubleRoller.visible = false` initially.
- Add to `helixGroup`.

## Interaction

Global state:
```
let targetXRotation = 0, targetYRotation = 0;
let currentXRotation = 0, currentYRotation = 0;
let currentMode = 'ribbon';
let baseSceneRotationZ = -0.15;     // ribbon starts slightly tilted
let baseSceneRotationY = 0;
let isDragging = false;
let previousMouseY = 0;
let flowVelocity = 0.002;            // idle drift
```

**Mouse move → free 360° rotation:**
```
targetYRotation = ((e.clientX / innerWidth)  - 0.5) * Math.PI * 2;   // full loop
targetXRotation = ((e.clientY / innerHeight) - 0.5) * 0.6;           // tilt
```

**Mouse drag** (`mousedown` sets `isDragging` + captures `previousMouseY`; `mouseup/mouseleave` clears):
```
if (isDragging) {
  flowVelocity += (e.clientY - previousMouseY) * 0.001;
  previousMouseY = e.clientY;
}
```

**Wheel scroll:**
```
window.addEventListener('wheel', (e) => { flowVelocity += e.deltaY * 0.0001 });
```

**Toggle button:**
```
Ribbon mode  → baseSceneRotationY = 0;     baseSceneRotationZ = -0.15;  ribbon.visible = true;  doubleRoller.visible = false;  label = 'Switch to Double Roller'.
Roller mode  → baseSceneRotationY = 0.20;  baseSceneRotationZ = -0.05;  ribbon.visible = false; doubleRoller.visible = true;   label = 'Switch to Ribbon Mode'.
```

## Animation loop

```js
function animate() {
  // Flow — scroll the UV vertically
  if (currentMode === 'ribbon') {
    if (matRibbon.map) matRibbon.map.offset.y -= flowVelocity;
  } else {
    if (matRoller1?.map) {
      matRoller1.map.offset.y -= flowVelocity;
      matRoller2.map.offset.y -= flowVelocity;
    }
  }

  // Ease velocity back to idle drift
  flowVelocity += (0.002 - flowVelocity) * 0.05;

  // Ease camera rotation toward mouse target
  currentXRotation += (targetXRotation - currentXRotation) * 0.05;
  currentYRotation += (targetYRotation - currentYRotation) * 0.05;

  helixGroup.rotation.x = currentXRotation;
  helixGroup.rotation.y = currentYRotation;
  helixGroup.rotation.z = baseSceneRotationZ;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

**Resize handler:**
```
window.addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
```

## Deliverable checklist

- [ ] Single HTML file, Three.js r128 via CDN, no build step
- [ ] Body has 4 vertical grid lines behind the canvas at 10vw insets
- [ ] Giant "PORTFOLIO" text plane centered at z=0 with `Arial Black 600px` — helix threads in front of + behind it
- [ ] Ribbon: 600 segments, `ribbonWidth: 280`, sine-based twist so the front face is flat and the back twists away
- [ ] Ribbon UV repeats twice around the loop; texture atlas has 7 unique 512² poster designs
- [ ] All 7 designs exactly as specified (ORDER stack · Writers Club green · gradient rings · UP/DWN · abstract photo · CAUTION · dark 07)
- [ ] Double-roller mode: two 400-radius cylinders at x = ±350, each showing a different half of the roller atlas via `map.offset/repeat`
- [ ] `transparent: false` on roller materials (critical z-fix)
- [ ] Toggle button top-right — swaps mode + adjusts `baseSceneRotationY/Z`
- [ ] Mouse move rotates helix in a full 360° Y arc + ±0.6 rad X tilt
- [ ] Drag + wheel adds to `flowVelocity`; idle drift eases back to 0.002
- [ ] UV `.offset.y -= flowVelocity` on every frame — the "scroll" of the ribbon
- [ ] 4-light setup (ambient + key with shadow map 2048² + fill cool + rim back)
- [ ] `ACES filmic tone mapping` + `sRGB encoding` on renderer and textures
- [ ] Bottom-center "Scroll or Drag to Explore" label + top-right toggle button styled as spec'd
- [ ] Zero console errors; smooth 60fps on modern hardware

---END PROMPT---

---

**Awwwards-tier version →** https://cuedesign.space/component/cue030
