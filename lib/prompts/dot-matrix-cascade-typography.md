# Dot-Matrix Cascade Typography — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Suited to an experimental design studio or type foundry landing page where the hero text itself becomes an interactive generative artifact.

---

GLOBAL / PAGE LEVEL
Build a single-file HTML/CSS/Vanilla JS application featuring a highly interactive, mathematical dot-matrix cascade animation on a full-screen canvas. The page uses a pure white `#ffffff` background and a default sans-serif font. The structure consists of a single `canvas` element spanning `100vw` and `100vh` via `display: block` and `object-fit: contain`, and an overlaid dashboard `div` for customization. The dashboard features inputs for Text (dynamically changing the cascade), Color (updating the hex base `#f2c94c`), and Scale (defaulting to 0.75). The core logic relies on an offscreen canvas to dynamically convert typography into scanline arrays, which are then rendered on the main canvas using `requestAnimationFrame` at exactly 10 FPS.

MATHEMATICAL ANIMATIONS
The core animation relies on an array of 25 frames controlling the horizontal excursion of round-capped dashes. The primary easing is a predefined wave mapped through:
```javascript
const WAVE = [
  0.001, 0.003, 0.009, 0.028, 0.07, 0.148, 0.334, 0.674, 0.872, 0.95, 0.985,
  0.998, 0.998, 0.985, 0.95, 0.873, 0.676, 0.33, 0.129, 0.052, 0.016, 0.003,
  0.001, 0.0, 0.001,
];
```
The timing of this excursion is dictated by a spatial delay law dependent on the letter index and row. The delay is calculated by assigning letter index 0 for the first letter, 2 for the last, and 1 for middle letters. The calculation involves `DOWN_AT = 4.85`, `DOWN_RATE = 0.58`, `UP_AT = 4.56`, `UP_RATE = 0.42`, `PINCH_DOWN = [4.98, 0.68]`, and `PINCH_UP = [4.73, 0.4]`. The color animation is driven by a `hueClock` ticking over `dt` (delta time), applying three overlapping cosine waves with `u/v/speed/weight` constants to generate an exact HSL string for each stroke segment, producing a shimmering, drifting color field over the text.

GEOMETRY & PHYSICS
The physical coordinate system relies on a reference grid of `REF_W = 600` and `REF_H = 337`, mapped exactly onto the window center. There are exactly 10 horizontal rows starting at `76.5` with a `20.5` pitch, using an 18px stroke height `lineCap: round`. Text scanning is achieved by drawing `900 170px sans-serif` text into an offscreen canvas, scanning the `y` coordinate of each row, and aggregating contiguous pixels with alpha > 128 into spans of `[x0, x1, letterZone]`. During rendering, each dash segment interpolates towards an origin axis `AXIS = 281.5`. The `excursion(frame, delay)` multiplier scales the dash's `x0` and `x1` endpoints outwards from the `AXIS`. If the computed width is less than 0.5px, it renders a perfect circular dot via `arc`. The dynamic scaling ensures it remains resolution independent, calculating `offsetX = (W - REF_W * scale) / 2` to center the matrix precisely. Hover micro-interactions scale the color drift speed by a factor of 1.6 and lift saturation by `0.07` using a linear step towards a `hoverTarget` over `0.5s` easing.

LAYOUT & Z-INDEX
The layout is extremely minimalist. The body resets margin/padding and sets `min-height: 100vh`, `display: flex`, `align-items: center`, `justify-content: center`. The main canvas has `z-index` default. The absolute dashboard lives precisely at `top: 20px`, `left: 20px` with `z-index: 10` and `background: rgba(255,255,255,0.9)`, featuring a 1px `#ddd` border, 8px border-radius, and a soft `0 4px 12px rgba(0,0,0,0.1)` shadow. The canvas rendering loop intercepts `ResizeObserver` and `IntersectionObserver` with a `0.2` threshold to smartly suspend the `requestAnimationFrame` loop when out of view or tab hidden, guaranteeing perfect performance.

ROUTING / COMPOSITION
The entire application is composed in a single monolithic HTML file. The `<script>` block encapsulates the constants, the `generateWordSegments` dynamic text-to-matrix parser, the `DashCascade` engine class, and the DOM setup listeners tying the dashboard inputs directly to the engine's internal state (re-generating the matrix array instantaneously on text input).

---

**Awwwards-tier version →** https://cuedesign.space/component/cue087
