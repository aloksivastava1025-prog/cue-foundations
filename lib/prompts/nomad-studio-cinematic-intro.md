# Nomad Studio Cinematic Intro — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** Ideal as the full-site entry experience for a high-end creative studio or film/production house portfolio wanting a theatrical, tactile first impression.

---

# PROMPT — Nomad Studio Portfolio (cinematic 3-stage intro + infinite drag canvas)

You are a senior creative front-end engineer. Build a **cinematic single-page studio portfolio** that opens with a hand-drawn asterisk mark video, transitions through a 3D iPod (drag to rotate, tap the play glyph), then a 3D digital camera whose LCD monitor is textured with the very canvas the user is about to enter — the "Canvas of Work": an infinite, draggable 2D grid of looping film tiles and text cards ("about us", "contact us"). Sub-pages fade in on hash routes.

Every visual choice here is anchored: white paper, black ink, one motif (an asterisk). The mark video and iPod share a compositing seam; the camera hands off to the canvas without a cut because the monitor IS the canvas.

**Framework:** Vanilla HTML + CSS + ES modules. Three.js loaded via importmap (`three` → `./js/vendor/three.module.js`). No React, no Vite, no bundler. **Deliverable is a static folder** that runs from any HTTP server. Do NOT rewrite in React / Next / SvelteKit — the timing tolerances (audio-gesture handoff, mark-fallback poster, iPod monitor→canvas texture) are hand-tuned to raw event loop and cannot be replicated inside a framework's render commit cycle.

**Target path:** save the finished folder at `nomad-portfolio/`. Structure identical to the reference below.

---

## ASSETS (paste verbatim — every path lives inside the folder, no CDNs)

```
/* fonts — self-hosted woff2, preloaded */
assets/fonts/SFProDisplay-Regular.woff2
assets/fonts/SFProDisplay-Medium.woff2
assets/fonts/SFProDisplay-Bold.woff2
assets/fonts/VCR.woff2                        // used ONLY on the iPod screen — desktop path only

/* audio */
assets/audio/theme.mp3                        // looped, muted at parse, ramped to 0.42 over 1400ms on first gesture

/* mark stage (stage 1) */
assets/video/mark.mp4                         // black-ink asterisk animation on paper #ffffff
assets/video/mark-still.webp                  // frame-0 poster — the mark is ALREADY fully drawn here

/* 3D models (stages 2 & 3) */
assets/models/ipod.glb                        // ~1.5 MB
assets/models/camera.glb                      // ~1.8 MB

/* the work canvas — 8 films, order matters */
assets/tiles/scape-final.mp4
assets/tiles/bubu-bar-directed.mp4
assets/tiles/hyde-park.mp4
assets/tiles/video-2.mp4
assets/tiles/bubu-promo.mp4
assets/tiles/nomad-mograph.mp4
assets/tiles/scape-loop.mp4
assets/tiles/bububar.mp4
assets/tiles-sm/                              // same 8 filenames, downscaled — served on `pointer: coarse`

/* three.js vendored */
js/vendor/three.module.js
js/vendor/GLTFLoader.js
js/vendor/DRACOLoader.js                      // if the glbs are draco-compressed
```

---

## FILE MANIFEST (exact — reproduce every file byte-for-byte from `github.com/shutterkif-oss/nomad-portfolio`)

```
nomad-portfolio/
├─ index.html          73 lines — stages, canvas, pages, skip button, importmap
├─ css/
│  └─ style.css        219 lines — tokens, stages, pages, touch overrides
├─ js/
│  ├─ main.js          405 lines — orchestrates mark → iPod → camera → work → pages
│  ├─ scene.js         608 lines — GL renderer, IpodAct, CameraAct, PMREM env, RIM room
│  ├─ canvas.js        545 lines — WorkCanvas: infinite draggable 2D grid of video tiles
│  ├─ track.js         121 lines — pointer/wheel/touch scroll accumulator with inertia
│  ├─ env.js           112 lines — cube-env HDRI-lookalike built from CanvasTexture
│  └─ data.js           18 lines — WORKS[] (8 tiles), CARDS[] (about, contact)
└─ assets/             — as ASSETS block above
```

Clone reference (verify byte-parity after):

```bash
git clone https://github.com/shutterkif-oss/nomad-portfolio.git
```

---

## DESIGN TOKENS (paste-verbatim CSS)

```css
:root {
  --paper: #ffffff;                                          /* the exact paper the mark video was shot on */
  --ink:   #111014;                                          /* tinted near-black — never pure #000 */
  --ink-2: #5d5b63;
  --hair:  #e4e2e6;
  --ease-out:    cubic-bezier(.16, 1, .3, 1);                /* expo-out */
  --ease-in-out: cubic-bezier(.65, 0, .35, 1);
  --t-slow: 1100ms;
  --t-mid:   620ms;
}

body               { transition: background-color 800ms var(--ease-in-out); }
body.is-dark       { background: #08080a; --ink-2: #8e8c96; }   /* the iPod stands in a black RIM room */
```

**Type stack:** `'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif`. Weights 400/500/700 self-hosted. VCR OSD Mono for the iPod screen only (desktop path only — `font-display: block` because a fallback would flash the wrong glyph shape on the LCD).

---

## STAGE TIMELINE (locked ms — every transition is engineered)

```
t=0        mark video autoplay+muted+playsinline; poster = mark-still.webp (frame 0)
t=0        theme.mp3 begins buffering muted (armed for first user gesture → unmute + volume ramp 1400ms to 0.42, cubic-ease-out)
t=0        vignette on at opacity 1.0 (radial 0→.10→.30→.62)
t=0        skip button hidden (opacity 0)

t≤5600     mark video plays to end (or fallback timer fires at 5600ms if ended never dispatched)
t+480      mark fades out (opacity 620ms ease-in-out)
t+480      skip button lit (opacity .6)

── DESKTOP PATH (matchMedia 'pointer: fine') ──
+load      ipod.glb + camera.glb kick off in parallel, both awaited later
+3000      after iPod entrance plays out, WorkCanvas constructs & begins loading 8 films (idle-hold)
iPod       body.is-dark, gl canvas .is-lit .is-live, IpodAct.begin()
              - drag to rotate (grabAt / moveTo / release; travel > 7px = a turn, else a press)
              - hover the play-glyph on wheel → cursor .is-hot
              - press play → CameraAct handoff
Camera     body.is-dark REMOVED (back to paper), CameraAct.begin()
              - camera zooms into LCD; onReveal fires when monitor edges ARE viewport edges
              - onReveal: showWork(); skip removed
              - onDone: finish() — dispose acts, gl.stop(), workWrap visible

── LITE PATH (matchMedia 'pointer: coarse'; ?full overrides) ──
+2600      WorkCanvas constructs but is HELD (workHeld=true) — sources download, none play()
+markend   markWrap.is-out; workHeld=false; work.start(); ease vig from .82 → 0 over 1000ms (smoothstep)
           No three.js, no glb loads, no models. Ever.

── Work canvas resident ──
+500       .work__hint (“drag to explore”) fade to opacity .75 over 900ms
+7500      hint fades to 0 (.is-gone)
           first pointer-drag on canvas → hint.is-gone immediately

── Pages (hash routes) ──
#/about, #/contact
           previous page (if any) removes .is-lit → wait 260ms → hidden=true
           new page hidden=false → force reflow → .is-lit → opacity 1 over 620ms
           body.data-stage = 'page'; back button restores lastStage
```

---

## MOTION SPEC (per-element, locked)

- **Mark**: `mix-blend-mode: multiply` on desktop (kills paper against light surfaces). On `pointer: coarse`: `mix-blend-mode: normal` — iOS composites hardware video on a layer blend cannot always reach.
- **Mark size**: `width: min(42vh, 42vw)` desktop; `min(58vw, 44vh)` touch.
- **Vignette**: fixed inset 0, `z-index: 50`, `pointer-events: none`. `radial-gradient(120% 88% at 50% 50%, rgba(8,8,10,0) 30%, rgba(8,8,10,.10) 55%, rgba(8,8,10,.30) 78%, rgba(8,8,10,.62) 100%)`. Driven per-frame by iPod.landed (during iPod act) or 1 − cam.zoomed (during camera act). Below `0.002` → `hidden` attribute set.
- **GL canvas**: `pointer-events: none` unless `.is-live` (only iPod act ever wants the pointer). Cursor: `.is-hot` = pointer, `.is-turning` = grabbing.
- **iPod interactions**:
  - `pointerdown` → `setPointerCapture` + `grabAt(x, y)` + `.is-turning`
  - `pointermove` → `moveTo(x, y)`; else `hover(x, y)` toggles `.is-hot`
  - `pointerup` → `release()` returns pixel travel; **> 7 px = turn (no press)**, **≤ 7 = press glyph** if `press(x, y)` hits play → `goAudible()` → `toCamera()`
- **Camera act**: on `onReveal`, `showWork()` fires, skip button removed. Full fade cross-dissolves via camera's own opacity — no CSS transition on the work canvas.
- **Audio ramp**: `theme.muted = false; theme.play(); volume = 0.42 · (1 − (1 − p)³)` over 1400 ms. Cubic ease-out.
- **Skip**: fixed bottom-right, safe-area-aware, `min-height: 44px`, `letter-spacing: .18em`, `text-transform: uppercase`. Only interactive while `.is-lit`.
- **Reduced motion**: `mark, gl, page, work__hint, skip` transitions collapsed to `1ms`. Mark fallback timer collapses `5600 → 900`. Audio ramp still applies (motion, not transition).

---

## THE WORK CANVAS (infinite drag)

- Full-viewport `<canvas>` at `z-index: 10`, `touch-action: none`, `cursor: grab` → `.is-drag` = grabbing → `.is-hot` = pointer over a tile with a route.
- Layout: `WORKS[]` (8 films) + `CARDS[]` (about us, contact us) tiled in a repeating **6-column × 4-row** grid, spaced so the pattern loops seamlessly at both axes. On coarse pointer, tiles from `assets/tiles-sm/` — half the pixel count.
- **Videos**: each tile is a `HTMLVideoElement` (muted, loop, playsinline, `preload="auto"`); drawn to canvas each frame via `drawImage`. Only tiles whose bbox intersects viewport call `.play()`; off-screen ones `.pause()` — the phone has one hardware decoder, do not spend it on 8 clips at once.
- **Drag physics**: `track.js` — pointer/wheel/touch delta accumulates into `vx, vy`; released, decays exponentially (`v *= 0.94` per frame) until below a threshold. Wheel: horizontal delta biases X, vertical biases Y, wheel-with-shift swaps axes. Trackpad two-finger pan: raw dx/dy.
- **First drag**: `onFirstDrag` callback fires once — main.js hides the hint.
- **Tile press** (pointerdown → up with travel < 7 px on a card): calls `onRoute(route)` → `location.hash = '#/' + route`.
- Text cards: SF Pro Display 500, uppercase, `letter-spacing: -.01em`, `color: var(--ink)` on `var(--paper)`. Same tile footprint as films, no border.
- Hint: `left: 50%; translateX(-50%); bottom: calc(clamp(18px, 3.4vh, 34px) + env(safe-area-inset-bottom, 0px));` — SF Pro Display .6875rem, uppercase, letter-spacing .16em, `var(--ink-2)`. Opacity 0 → .75 over 900 ms; auto-fades at 7.5 s or on first drag.

---

## THE 3D ACTS (scene.js — one GL, two Acts)

```
GL             — WebGL2 renderer, sRGB output, exposure 1, tone-mapping ACESFilmic.
                 PMREMGenerator baked once with env.js's CanvasTexture (a paper→ink 
                 vertical gradient with a soft horizon smear). Renderer resized off 
                 the same debounced resize main.js uses for canvas.js.
IpodAct        — Loads ipod.glb; positioned centered, tilted -6°. Environment = env cube.
                 begin(): fly-in from z=-2.6, ease-out 1100 ms, arriving at z=0.
                 landed: 0..1 progress driven from tween.
                 grabAt/moveTo: quaternion drag with damped inertia (release() returns 
                 pointer-travel in px). hover(x, y): raycast against Play-glyph submesh 
                 → boolean. press(x, y): raycast → return true if inside glyph.
                 fadeOut(ms): material opacity → 0, then dispose GLTF, textures.
CameraAct      — Loads camera.glb. Uses ensureWork().cv as texture for the LCD submesh
                 (identified by material name in the glb). onReveal fires when monitor's 
                 world-space corners align with viewport corners (dolly + fov match). 
                 onDone: main.js's finish() removes acts, hides gl.
```

RIM room: five point lights on the +X/-X/+Y/-Y/+Z faces of a virtual room, colors tinted from `#f6f4ea` (warm) and `#c9dbe2` (cool). Rim intensity 1.4 on the iPod, 0.8 on the camera (paper backdrop).

---

## COPY (exact)

- `<title>` — `nomad`
- Meta description — `nomad — studio.`
- Skip button — `skip intro`
- Work hint — `drag to explore`
- Page /about h1 — `about`; body placeholder — `[ PLACEHOLDER — a short paragraph about the studio: what nomad makes, who it makes it for, and how it works. Replace this text. ]`
- Page /about back — `back`
- Page /contact h1 — `contact`; body — `[ PLACEHOLDER — one line on what to get in touch about. ]`; CTA — `write to us` (`href="mailto:hello@example.com"`)
- Cards — `about us`, `contact us`
- Favicon — inline SVG asterisk in `#111014`

---

## Responsive

**Detection**
- Full path: `matchMedia('(pointer: fine)')`.
- Lite path: `matchMedia('(pointer: coarse)')`. `?full` in URL overrides for testing.
- Lite path: mark → straight to work canvas. No three.js loaded, no glb, no PMREM. Vignette eases from 0.82 → 0 over 1000 ms (smoothstep) when work becomes visible.

**Layout**
- ≥1024px: as specced. Padding on pages `clamp(28px, 6vw, 80px)` all sides + safe-area.
- 768–1023px: same layout, mark size unchanged, iPod scale ×0.92.
- <768px (`pointer: coarse`):
  - Mark `min(58vw, 44vh)`, `mix-blend-mode: normal`.
  - Tiles from `assets/tiles-sm/`.
  - Hint font `.75rem`, letter-spacing `.14em`.
  - Skip `.6875rem`, padding `.7rem 1rem`.
  - Page paragraph `1rem / 1.6`.
  - `-webkit-touch-callout: none` on the work canvas (no long-press menu on a video tile).
- Coarse + landscape + `max-height: 520px`:
  - Page padding-block `18px` (+ safe area).
  - `page__t` `margin-bottom: .9rem; font-size: clamp(1.5rem, 6vh, 2rem)`.
  - `page__cta` `margin-top: 1.4rem`. `page__back` `margin-top: 1.6rem`.

**Robustness**
- Resize / orientationchange / visualViewport.resize all coalesce to one rAF (a phone fires resize per URL-bar step; naïve handling reallocates canvases 30× / second).
- `overflow: hidden; overscroll-behavior: none` on html+body — nothing scrolls.
- `100dvh` where supported (address bar honesty).
- `-webkit-tap-highlight-color: transparent`, `user-select: none`.
- All hover rules live behind `@media (hover: hover) and (pointer: fine)` — touch never gets a sticky `:hover` latched from a tap.

**Reduced motion**
- All CSS transitions on `.mark, .gl, .page, .work__hint, .skip` collapse to `1ms`.
- Mark fallback timer `5600 → 900 ms`.
- Lite path vignette ramp `1000 → 1 ms`.
- iPod/camera acts still run (they are the content), just with entrance tweens set to 60 ms.

---

## FALLBACKS (do not remove — each one has a real failure story behind it)

- Mark video: `poster` attribute is frame 0, so autoplay refusal (Low Power Mode, decoder busy, cellular stall) shows the mark fully drawn — nobody stares at a blank screen for 5.6 s.
- Mark start check: `currentTime > 0.08` at 1400 ms is the only reliable "is it playing" signal (`readyState` and the `play()` promise both lie when the decoder is busy). If not rolling, one retry, then hold the still and move on.
- Audio: single-flight `goAudible()` guard. Two overlapping unmute attempts once corrupted saved mute state; never disarm except on confirmed success.
- Video ramp: clamp `p` to `[0, 1]` — rAF timestamps can predate the `performance.now()` that scheduled them; unclamped `p` goes negative and `volume` throws.
- Font blocking: `Promise.race(fonts, sleep(2500))` — never hang the whole intro on a font that won't arrive.
- Model loads: `.catch(() => {})` on both; if either 404s the intro finishes gracefully via `finish()`.

---

## Deliverable checklist

- [ ] Folder at `nomad-portfolio/`, structure matches manifest.
- [ ] `index.html` = 73 lines, importmap for `three`, preloads for SF Pro + VCR fonts, mark video + poster, single `<canvas class="gl">`, single `<canvas class="work__cv">`, both pages inline.
- [ ] `style.css` uses exact tokens: `--paper #ffffff`, `--ink #111014`, `--ink-2 #5d5b63`, `--hair #e4e2e6`, expo-out easing.
- [ ] `body.is-dark = #08080a` transitions in 800 ms `--ease-in-out` — the iPod's RIM room, not a color switch.
- [ ] Vignette radial gradient exactly: `120% 88% at 50% 50%`, stops at 30/55/78/100%, alphas 0/.10/.30/.62 of `#08080a`.
- [ ] LITE detection: `pointer: coarse` && no `?full`. Lite path never imports scene.js, never loads glbs.
- [ ] Full path: iPod → drag rotates (travel > 7 px = turn), tap play → `goAudible()` + `toCamera()`.
- [ ] CameraAct textures LCD with the same `<canvas id="cv">` the work stage uses.
- [ ] Work canvas: 8 films from `WORKS[]` + 2 cards from `CARDS[]`, tiled seamlessly, only viewport-visible clips play.
- [ ] Hint auto-fades at 7.5 s or on first drag.
- [ ] Skip button lit after mark, cleared once camera reveals work.
- [ ] Hash routes `#/about` and `#/contact` cross-fade over 620 ms; back button restores `lastStage`.
- [ ] Audio: parse-time muted play, 1400 ms cubic-ease volume ramp to 0.42 on first confirmed gesture, single-flight guard.
- [ ] Resize coalesced to one rAF; `100dvh` where supported.
- [ ] All hover behind `(hover: hover)`; touch gets no sticky `:hover`.
- [ ] `prefers-reduced-motion` collapses every transition to `1ms`.
- [ ] Verifiable via `window.__NOMAD` handle: `lite`, `gl`, `ipod`, `cam`, `work`, `freeze(act, ms)`, `seek(act, ms)`.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue082
