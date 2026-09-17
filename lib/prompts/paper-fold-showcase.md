# Paper Fold Showcase — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** Ideal as a chapter-based gallery centerpiece on a photography exhibit or design studio showcase site wanting a tactile, cinematic reveal moment.

---

# Paper Fold Showcase — Diagonal Cloth Simulation

Build a single-poster editorial showcase where clicking the poster triggers a diagonal paper-fold animation from the bottom-left corner. The fold uses a WebGL shader with cloth-physics damping, halftone dot displacement, and a full ~180° flip that reveals the next chapter. Black backdrop, white text, cinematic. Reference: hollywoodexhibit2026.com paper fold behavior.

---

## FRAMEWORK

Vanilla HTML + CSS + JS. Three.js r160 via CDN. No build step, no framework. Single `index.html`.

## STACK

- `<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>`
- Google Fonts: `Inter:wght@400;500;600` + `Playfair Display:wght@400;500;700`

## ASSETS

Load Pinterest images through weserv.nl proxy so WebGL TextureLoader gets CORS headers. Path builder:

```js
const P = (u) => 'https://images.weserv.nl/?url=' + encodeURIComponent(u.replace(/^https?:\/\//, ''));
```

Chapter deck (7 items). Each: `{ img, title, credit }`.

| # | img (proxied)                                                                                | title           | credit      |
|---|----------------------------------------------------------------------------------------------|-----------------|-------------|
| 1 | `i.pinimg.com/1200x/0b/36/f8/0b36f83f83bee29f5d9089c6caffa996.jpg`                            | Icons of Style  | Cue Studio  |
| 2 | `i.pinimg.com/1200x/27/e8/f7/27e8f7e5cde73cef92f561051b72101a.jpg`                            | Ochre & Static  | Ines Marin  |
| 3 | `i.pinimg.com/1200x/01/5e/65/015e65a2bbc2e4f6f02c6046803225cb.jpg`                            | Long Shadow     | Reza Bakr   |
| 4 | `i.pinimg.com/736x/b0/25/d1/b025d110515212a551e28278dd5f3728.jpg`                             | Room Nº 4       | Cue Studio  |
| 5 | `i.pinimg.com/736x/d5/0f/a7/d50fa79f58489d451cd884f1135163c9.jpg`                             | North Wind      | Kaia Ono    |
| 6 | `i.pinimg.com/736x/d0/69/85/d069851b172378f6a0e8d95da4ffeab8.jpg`                             | Slow Burn       | Reza Bakr   |
| 7 | `i.pinimg.com/736x/2f/61/90/2f6190000beb64bec84f9e0156c0c9b2.jpg`                             | Salt & Copper   | Ines Marin  |

---

## DESIGN TOKENS (paste verbatim)

```css
:root {
  --bg:            #000;
  --fg:            #fff;
  --fg-70:         rgba(255,255,255,0.75);
  --fg-55:         rgba(255,255,255,0.55);
  --fg-40:         rgba(255,255,255,0.40);
  --accent:        #d97757;                    /* single warm dot */
  --font-sans:     'Inter', -apple-system, sans-serif;
  --font-serif:    'Playfair Display', serif;
  --card-w:        min(24vw, 320px);
  --card-ratio:    3 / 4;
  --card-shadow:   0 30px 60px -20px rgba(0,0,0,0.6),
                   0 8px 20px -6px rgba(0,0,0,0.5);
  --grain-opacity: 0.5;
}
```

Body: `background: #000; color: #fff; height: 100vh; overflow: hidden;`
Grain overlay (fixed, z:200, mix-blend-mode: screen, opacity: 0.5) via inline SVG turbulence data-URI, RGB 1,1,1 alpha 0.04.

---

## LAYOUT

Single centered stage, three regions:

1. **Top bar** (fixed, z:30, padding `28px 40px`)
   - Left: `Cue<span style="color:#d97757">.</span> Exhibit` — Playfair 22px, weight 500, letter-spacing -0.01em
   - Right: three UPPERCASE meta chips, 11px, letter-spacing 0.22em, opacity 0.7 — `Vol. 001` · `Paper Fold Studies` · `2026`

2. **Stage** (100vw × 100vh, flex center)
   - Left side-meta (absolute, `left: 60px`, top: 50%): `Chapter` label 10px 0.28em uppercase color `--fg-40`; value Playfair 18px `--fg`
   - Poster (see below)
   - Right side-meta (same, `right: 60px`, text-align:right): `Photograph` label + credit value

3. **Footer widgets**
   - Bottom-center hint: 10px 0.4em uppercase `--fg-55`, with warm `#d97757` 6px pulsing dot before it (2s ease-in-out, 0.3→1 opacity, 1→1.4 scale). Copy: `Click the poster to fold`
   - Bottom-right chapter (`right: 40px; bottom: 32px;`): Playfair 40px number over 11px 0.22em uppercase `of 07`

---

## POSTER CARD (the fold subject)

```css
.poster {
  width: var(--card-w);                    /* min(24vw, 320px) */
  aspect-ratio: var(--card-ratio);         /* 3 / 4 */
  position: relative;
  cursor: pointer;
  z-index: 10;
  box-shadow: var(--card-shadow);
}
.poster img {                              /* layout placeholder only */
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  background: #0a0a0a;
  opacity: 0;                              /* WebGL mesh renders the actual image */
}
.poster-label {                            /* bottom-left overlay */
  position: absolute; left: 14px; bottom: 12px;
  z-index: 20;                             /* above WebGL canvas */
  font-size: 9px; letter-spacing: 0.24em;
  text-transform: uppercase;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  transition: opacity 0.3s ease;
}
.poster-label .title {                     /* the chapter title */
  font-family: var(--font-serif);
  font-size: 15px;
  text-transform: none;
  display: block; margin-top: 2px;
}
.poster-index {                            /* top-right roman numeral */
  position: absolute; right: 14px; top: 12px;
  z-index: 20;
  font-family: var(--font-serif); font-size: 24px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  transition: opacity 0.3s ease;
}
/* While folding, fade overlays so they don't sit statically on a moving mesh */
.stage.folding .poster-label,
.stage.folding .poster-index { opacity: 0; }
.stage.folding .side-meta,
.stage.folding .hint          { opacity: 0.25; transition: opacity 0.4s ease; }
```

**Critical:** `img` is invisible — it exists only for bounding-box layout. The WebGL mesh is what the user actually sees.

---

## WEBGL MESH (the fold engine)

Canvas `#paper-canvas` — `position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 15;`

Renderer: `alpha: true, antialias: true`, pixel ratio clamped to 2.
Camera: `PerspectiveCamera(50, aspect, 0.1, 1000)`, `z = 5`.
Geometry: `PlaneGeometry(1, 1, 90, 90)` — 90×90 tessellation for smooth cloth.
Material: `ShaderMaterial` with `transparent: true`, `side: DoubleSide`.

**Mesh positioning:** Every frame (and on resize), read the `.poster` `getBoundingClientRect()` and map it into 3D world coords using camera FOV. Set `mesh.position` to the poster's center and `mesh.scale` to its size in world units. Also set `uHalftoneSize = (rect.width * 0.06, rect.height * 0.06)`.

### UNIFORMS

```js
const uniforms = {
  uTime:              { value: 0 },
  uAmplitude:         { value: 0 },       // ambient life 0.08, fold peak 0.5
  uFoldProgress:      { value: 0 },       // 0 → 1 during click
  uFoldOrigin:        { value: new THREE.Vector2(0, 0) },   // UV bottom-left
  uPointer:           { value: new THREE.Vector2(0.5, 0.5) },
  uPointerStrength:   { value: 1.0 },     // stronger cursor bend — visible paper flex on hover
  uPointerAmplitude:  { value: 0.6 },     // idle baseline; ramps to 0.9 on hover
  uHalftoneSize:      { value: new THREE.Vector2(1, 1) },   // set from rect
  uHalftoneDotSize:   { value: 6.5 },
  uHalftoneStrength:  { value: 0 },       // 1 at fold start, 0 by 30% of fold
  uHalftoneColor:     { value: new THREE.Vector3(0.95, 0.92, 0.88) },
  uMorphProgress:     { value: 1 },       // 0→1 over first 30% of fold
  uTexture:           { value: null },
  vUvScale:           { value: new THREE.Vector2(1, 1) },
  uOpacity:           { value: 0 },       // set to 1 after first texture loads
  uDistortionStrength:{ value: 0.6 },
  uPointerActive:     { value: 0 }        // 1 on pointerenter, 0 on leave
};
```

### VERTEX SHADER (paste verbatim)

```glsl
varying vec2 vUv;
uniform float uTime;
uniform float uAmplitude;
uniform float uFoldProgress;
uniform vec2 uFoldOrigin;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uPointerAmplitude;
uniform vec2 uHalftoneSize;
uniform float uHalftoneDotSize;
uniform float uHalftoneStrength;
uniform float uMorphProgress;
uniform float uDistortionStrength;
uniform float uPointerActive;

vec2 rotate2D(vec2 position, float angle) {
  mat2 R = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  return R * position;
}
mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle), c = cos(angle), oc = 1.0 - c;
  return mat4(
    oc*axis.x*axis.x + c,          oc*axis.x*axis.y - axis.z*s, oc*axis.z*axis.x + axis.y*s, 0.0,
    oc*axis.x*axis.y + axis.z*s,   oc*axis.y*axis.y + c,        oc*axis.y*axis.z - axis.x*s, 0.0,
    oc*axis.z*axis.x - axis.y*s,   oc*axis.y*axis.z + axis.x*s, oc*axis.z*axis.z + c,        0.0,
    0.0, 0.0, 0.0, 1.0
  );
}

void main() {
  vUv = uv;
  vec3 newPosition = position;

  /* 1. DIAGONAL FOLD MECHANICS — fold line travels from uFoldOrigin (bottom-left [0,0]) */
  float cornerDist   = length(uv - uFoldOrigin);
  float cornerAnchor = smoothstep(0.0, 0.35, cornerDist);
  float foldLine     = uFoldProgress * 2.2;
  float distFromFold = cornerDist - foldLine;
  float foldWidth    = 0.85;
  float inFoldRegion = smoothstep(-foldWidth, 0.0, distFromFold)
                     * (1.0 - smoothstep(0.0, foldWidth * 0.7, distFromFold));
  float foldAngle    = 0.0;
  float creaseIntensity = 0.0;
  if (distFromFold < 0.0) {
    float fp = smoothstep(-foldWidth * 1.2, 0.0, distFromFold);
    foldAngle       = fp * uFoldProgress * 0.7;    /* ~40° = 0.7 rad */
    creaseIntensity = inFoldRegion * cornerAnchor;
  } else {
    creaseIntensity = inFoldRegion * cornerAnchor;
  }
  float crease = creaseIntensity * uAmplitude * 0.7
               * (1.0 + sin(distFromFold * 4.0 + uTime * 2.0) * 0.1);

  /* 2D rotation blended by rotationMask — this is the "curl" component */
  float foldRotation = foldAngle * uAmplitude * 0.5;
  mat2  R = mat2(cos(foldRotation), -sin(foldRotation), sin(foldRotation), cos(foldRotation));
  float rotationMask = smoothstep(0.0, -foldWidth * 1.5, distFromFold);
  vec2  rotatedPos   = mix(position.xy,
                           (R * (position.xy - vec2(0.5)) + vec2(0.5)),
                           rotationMask * cornerAnchor);
  newPosition.xy = mix(position.xy, rotatedPos, uFoldProgress * 0.35);

  /* 2. THREE DAMPING RIPPLES — natural cloth settling */
  float ripple1 = smoothstep(-foldWidth * 2.5, -foldWidth * 0.9, distFromFold)
                * (1.0 - smoothstep(-foldWidth * 0.9, 0.0, distFromFold));
  float w1 = ripple1 * uAmplitude * 0.18 * sin(distFromFold * 7.5 + uTime * 2.0) * cornerAnchor;
  float ripple2 = smoothstep(-foldWidth * 4.0, -foldWidth * 2.2, distFromFold)
                * (1.0 - smoothstep(-foldWidth * 2.2, -foldWidth * 1.3, distFromFold));
  float w2 = ripple2 * uAmplitude * 0.12 * sin(distFromFold * 6.0 + uTime * 1.5 + 1.2) * cornerAnchor;
  float ripple3 = smoothstep(-foldWidth * 6.0, -foldWidth * 3.5, distFromFold)
                * (1.0 - smoothstep(-foldWidth * 3.5, -foldWidth * 2.5, distFromFold));
  float w3 = ripple3 * uAmplitude * 0.08 * sin(distFromFold * 4.5 + uTime * 1.1 + 2.3) * cornerAnchor;
  float settlingWave = w1 + w2 + w3;

  /* 3. POINTER INTERACTION — parabolic bend + surface ripple */
  float pointerDist   = length(uv - uPointer);
  float rippleFalloff = smoothstep(0.35, 0.0, pointerDist);
  float pd            = pow(rippleFalloff, 2.0)
                      * (sin(pointerDist * 12.0 - uTime * 0.3) * 0.5 + 0.5)
                      * uDistortionStrength * uPointerActive * 0.08;
  float pointerFalloff = smoothstep(0.6, 0.0, pointerDist);
  float pointerBend    = pow(pointerFalloff, 1.8);           /* parabolic */
  float pointerRipple  = pointerBend * uPointerStrength * uPointerAmplitude * 0.7
                       + pointerBend * uPointerStrength * uPointerAmplitude * 0.2
                         * sin(pointerDist * 12.0 + uTime * 3.0);

  /* 4. AMBIENT LIFE — constant sub-visible undulation */
  float wave1 = sin(uv.x * 3.14159 * 3.2 + uTime * 1.1) * sin(uv.y * 3.14159 * 2.8 + uTime * 0.9)
              * uAmplitude * 0.06 * (1.0 - uFoldProgress * 0.5);
  float wave2 = sin((uv.x + uv.y) * 3.14159 * 2.0 + uTime * 0.7)
              * sin((uv.x - uv.y) * 3.14159 * 1.8 + uTime * 0.5)
              * uAmplitude * 0.04 * (1.0 - uFoldProgress * 0.4);
  float globalUndulation = wave1 + wave2;

  /* 5. GRAVITY DRAPE — 3% vertical sag along Y */
  float gravityDrape = sin(uv.y * 3.14159 * 1.5) * uAmplitude * 0.03 * (1.0 - uFoldProgress * 0.7);

  /* 6. HALFTONE Z-PUNCH — each dot pushes surface by 8% during morph */
  float ha = 0.35;
  mat2  HR = mat2(cos(ha), -sin(ha), sin(ha), cos(ha));
  vec2  hc = (uv - 0.5) * uHalftoneSize;
  vec2  hu = (HR * hc + 0.5 * uHalftoneSize) / uHalftoneDotSize;
  float hd = length(fract(hu) - 0.5);
  float halftoneDot = smoothstep(0.48, 0.2, hd);
  float halftoneDisplacement = uMorphProgress * uHalftoneStrength * (halftoneDot - 0.5) * 0.08;

  /* Compose Z */
  newPosition.z = pointerRipple + pd + halftoneDisplacement + gravityDrape + settlingWave + globalUndulation + crease;

  /* 7. FINAL FLIP — full 180° via 3.14 * flipProgress2 */
  float flipProgress2 = smoothstep(0.0 + uv.x * 0.3, 0.8 + uv.x * 0.2, uFoldProgress);
  newPosition = (rotation3d(vec3(0.5 * (1.0 - flipProgress2), 1.0, 0.0), 3.14 * flipProgress2)
              * vec4(newPosition, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### FRAGMENT SHADER (paste verbatim)

```glsl
uniform sampler2D uTexture;
uniform vec2 vUvScale;
uniform float uOpacity;
uniform vec2 uPointer;
uniform vec2 uHalftoneSize;
uniform float uHalftoneDotSize;
uniform float uHalftoneStrength;
uniform vec3 uHalftoneColor;
uniform float uMorphProgress;
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 uv2 = vUv;
  if (!gl_FrontFacing) { uv2.x = 1.0 - uv2.x; }
  vec2 uv = (uv2 - 0.5) * vUvScale + 0.5;
  vec4 color = texture2D(uTexture, uv);
  float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));

  /* Halftone dot pattern — dot radius maps to inverse luma (darker = bigger dot) */
  float ha = 0.35;
  mat2  HR = mat2(cos(ha), -sin(ha), sin(ha), cos(ha));
  vec2  hc = (uv - 0.5) * uHalftoneSize;
  vec2  hu = (HR * hc + 0.5 * uHalftoneSize) / uHalftoneDotSize;
  float d  = length(fract(hu) - 0.5);
  float dotRadius = mix(0.26, 0.68, 1.0 - luma);
  float dotMask   = smoothstep(dotRadius, dotRadius - 0.02, d);

  /* Radial reveal from pointer with noise-jitter edge */
  float pointerDist = distance(uv, uPointer);
  float rEased = uHalftoneStrength < 0.5
    ? 2.0 * uHalftoneStrength * uHalftoneStrength
    : 1.0 - 2.0 * (1.0 - uHalftoneStrength) * (1.0 - uHalftoneStrength);
  float revealRadius = rEased * 1.4;
  float noise = (hash((uv - uPointer) * 60.0) - 0.5) * 0.04;
  float revealMask = 1.0 - smoothstep(revealRadius - 0.4, revealRadius, pointerDist + noise);

  float halftoneBlend = clamp(smoothstep(0.0, 1.0, uHalftoneStrength)
                       * (1.0 - uMorphProgress) * 1.2, 0.0, 1.0) * revealMask;

  vec3 paperColor    = mix(color.rgb, uHalftoneColor, 0.85);
  vec3 halftoneDots  = mix(paperColor, color.rgb, dotMask);
  vec3 halftoneBase  = mix(color.rgb, halftoneDots, halftoneBlend);
  halftoneBase       = mix(halftoneBase, color.rgb, uMorphProgress);

  vec3 finalColor = halftoneBase;

  /* PAPER GRAIN — subtle always-on fiber noise so the surface reads as paper.
     Two overlaid hash noises + horizontal streak = printed-paper texture. */
  float fiber1 = hash(uv * 900.0);
  float fiber2 = hash(uv * 240.0 + 5.7);
  float grain  = (fiber1 - 0.5) * 0.06 + (fiber2 - 0.5) * 0.035;
  float streak = (hash(vec2(floor(uv.y * 600.0), 3.1)) - 0.5) * 0.02;
  finalColor += grain + streak;

  /* Warm paper tint fades in with hover halftone — cream cast where cursor "touches" */
  vec3 warmPaper = vec3(1.02, 0.98, 0.92);
  finalColor = mix(finalColor, finalColor * warmPaper, halftoneBlend * 0.4);

  gl_FragColor = vec4(finalColor, color.a * uOpacity);
}
```

---

## ANIMATION TIMINGS

| State  | Trigger              | Duration | Details                                                                                                     |
|--------|----------------------|----------|-------------------------------------------------------------------------------------------------------------|
| IDLE   | (default)            | ∞        | `uAmplitude = 0.08 + sin(t · 0.6) · 0.02` (breathing). `uFoldProgress = 0`. `uMorphProgress = 1`. `uHalftoneStrength` lerps toward 0. `uPointerAmplitude` lerps toward 0.6. |
| HOVER  | pointerenter/move    | —        | `uPointerActive = 1`. Pointer target lerped 8%/frame into `uPointer`. `uHalftoneStrength` lerps toward **0.7** (halftone dots reveal around cursor). `uPointerAmplitude` lerps toward **0.9** (paper visibly bends where the cursor "touches"). |
| LEAVE  | pointerleave         | ~0.5 s   | Targets snap back to idle: `halftoneTarget = 0`, `pointerAmpTarget = 0.6`. Same lerp rates settle the surface. |
| FOLD   | click on poster      | 1.8 s    | `uFoldProgress` = cosine-eased 0→1: `-(cos(π·f) − 1)/2`. `uAmplitude` = 0.5 · bellCurve(f). `uHalftoneStrength` = 1 → 0 over first 35% of fold. `uMorphProgress` = 0 → 1 in same window. |
| SWAP   | fold completes       | instant  | Advance `currentIdx`, load next texture, reset uniforms, remove `.folding` class from stage.                 |

**Lerp rates (every frame, non-folding):**
- `uHalftoneStrength → halftoneTarget`  @ `0.06`
- `uPointerAmplitude → pointerAmpTarget` @ `0.08`
- `uAmplitude → 0.08 + sin(t·0.6)·0.02`  @ `0.05`
- Pointer position: `pointerLerp.lerp(pointerTarget, 0.08)`

`bellCurve(f)` — quartic ramps:
- `f < 0.4`  → `1 - (1 - f/0.4)^4`      (rise)
- `f ≤ 0.6`  → `1`                       (plateau)
- `f > 0.6`  → `((1 - f) / 0.4)^4`       (decay)

Pointer smoothing: `pointerLerp.lerp(pointerTarget, 0.08)` every frame.

---

## INTERACTION FLOW

1. On load: fetch first chapter texture through proxy, position mesh over `.poster` rect, set `uOpacity = 1`.
2. `pointermove` inside `.poster` updates `pointerTarget` in UV space (0-1, y-flipped).
3. `pointerenter` → `uPointerActive = 1`, `halftoneTarget = 0.7`, `pointerAmpTarget = 0.9`. `pointerleave` → `uPointerActive = 0`, `halftoneTarget = 0`, `pointerAmpTarget = 0.6`.
4. Render loop (non-folding branch) lerps `uHalftoneStrength → halftoneTarget` and `uPointerAmplitude → pointerAmpTarget` so hover reveal ramps in/out smoothly (no snapping).
5. `click` → guard against re-entry with `isFolding`. Add `.folding` class to `.stage`. Set `uFoldOrigin = (0,0)`, `uMorphProgress = 0`, `uHalftoneStrength = 1`, snapshot `foldStartTime`.
6. Render loop drives uniforms per timing table. At `f >= 1`: advance chapter, swap texture + text, reset uniforms, remove `.folding`.
7. `resize` → recompute camera aspect, renderer size, re-position mesh.

---

## COPY (exact)

- Brand: `Cue. Exhibit` (dot in `--accent`)
- Meta chips: `Vol. 001` · `Paper Fold Studies` · `2026`
- Left label: `Chapter`
- Right label: `Photograph`
- Hint: `Click the poster to fold`
- Chapter counter footer: `01 of 07`
- Poster label eyebrow: `Featured Edition`

---

## ACCEPTANCE

- Poster is a small card (max 320 × ~427px), centered, black backdrop
- Idle poster breathes softly (visible sub-1px undulation)
- **Hover:** halftone dots visibly reveal around cursor over ~0.5s ramp; paper flexes toward the cursor with a parabolic bend; warm cream tint fades in where the cursor "touches"
- **Leave:** halftone and bend settle back to idle over ~0.5s, no snap
- **Paper grain:** always-on subtle fiber texture + horizontal streaks on close inspection — reads as printed paper, not a flat image
- Click triggers diagonal fold from bottom-left, ~1.8s duration, cloth-like damping visible
- Halftone dots pop during first ~35% of fold, then image morphs to raster
- Full ~180° flip; second face visible (mirrored via `gl_FrontFacing` flip)
- Next chapter texture + title + credit swap in when fold completes
- Overlays (label + index) fade out during fold, back in when settled
- No CORS errors — Pinterest images route through `images.weserv.nl`

---

**Awwwards-tier version →** https://cuedesign.space/component/cue012
