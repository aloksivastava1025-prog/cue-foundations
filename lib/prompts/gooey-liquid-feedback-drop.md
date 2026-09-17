# Gooey Liquid Feedback Drop — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal as a distinctive feedback trigger on a product launch or agency portfolio site where a playful, physics-driven micro-interaction reinforces craft-obsessed branding.

---

**GLOBAL / PAGE LEVEL**
Build a vanilla HTML/CSS/JS (or React equivalent) Awwwards-winning interactive feedback widget driven by a custom requestAnimationFrame physics engine and SVG Gooey filters. The global background is pure white #ffffff. All typography uses Google Font Inter. The text color is #1a1a1a for standard text and pure black #000000 for the liquid elements. The page structure includes a tall scrollable body (300vh) to allow scroll-triggering, with a fixed overlay container taking up 100vw and 100vh with pointer-events none and z-index 1000 acting as the physics coordinate plane.

**MATHEMATICAL ANIMATIONS**
The core interaction transitions through 5 distinct physics states: swelling, falling, resting, expanded, and submitted. The transition from resting to expanded involves CSS morphing on width 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-radius 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), and transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275). When resting, hovering triggers a magnetic pull. Emojis inside the modal have a smooth 0.2s transition going from grayscale(100%) opacity(0.6) to grayscale(0%) opacity(1) with a transform scale(1.15) on hover.

**SCROLL CHOREOGRAPHY**
The sequence is scroll-triggered. When `window.scrollY > window.innerHeight * 0.3`, the trigger boolean flips to true. The top tap opacity fades to 1, the morph shape opacity fades to 1, and the SVG filter is dynamically applied to the fixed container via a class. The physics requestAnimationFrame loop initiates immediately upon this scroll trigger, entering the `swelling` state.

**GEOMETRY & PHYSICS**
The physics loop is the heart of the aesthetic. The SVG Gooey filter requires an absolute defs declaration to prevent moving elements from clipping.
```xml
<filter id="goo" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
  <feBlend in="SourceGraphic" in2="goo" />
</filter>
```
Physics constants:
```javascript
const gravity = 1.2;
const bounceFactorY = 0.55;
const bounceFactorX = 0.8;
const frictionX = 0.94;
const floorOffset = 60;
const detachY = 130;
```
During the `swelling` state, the drop accelerates downwards (`swellVy += 0.25; y += swellVy;`) and steadily drifts right (`x += 1.5;`). Once `y > detachY`, the surface tension snaps, transitioning to `falling`. The drop inherits `vy = swellVy` and is given a pre-snap horizontal momentum of `vx = 6`. During freefall, `vy += gravity`. Upon colliding with `floorY` (window.innerHeight - floorOffset), `vy` reverses and dampens by `bounceFactorY`, while `vx` dampens by `frictionX`. On the very first high-velocity floor impact (if `vx === 6` and `Math.abs(vy) > 10`), a hard rightward kick is applied: `vx = 12`. 

Squish physics on impact:
```javascript
scaleX = 1 + (impact * 0.015);
scaleY = 1 - (impact * 0.015);
```
Scale values continuously spring back toward 1 via `scale += (1 - scale) * 0.2`. When the drop rests, the filter is removed for crisp text rendering. Upon clicking the rested drop, it enters the `expanded` state. To prevent the 380px wide modal from clipping off the right edge of the screen, the `x` position is clamped during expansion:
```javascript
const maxSafeX = (window.innerWidth / 2) - 190 - 20;
if (x > maxSafeX) x = maxSafeX;
```
On submit, reverse gravity (rocket launch) is applied: `vy = -15`, subtracting `gravity * 1.5` per frame, with a vertical scale stretch.

**LAYOUT & Z-INDEX**
The liquid source ("tap") is positioned absolute at top -20px, left 50%, transformed translateX(-50%). Its dimensions are width 280px and height 60px with a border-radius of 10px and background #000000. The morph shape originates as an absolute circle of width 60px and height 60px, background #000000, with a bottom center transform-origin. When expanded into the feedback modal, it becomes width 380px, height 420px, and border-radius 24px, translating upwards exactly 360px relative to its floor position so it doesn't expand downwards out of view. The modal interior contains a form-header (Inter 24px / 500 / #ffffff / letter-spacing -0.5px), a sub-header (Inter 14px / #888), an emoji row containing 54px wide circular buttons with a 1px solid rgba(255,255,255,0.1) border, a textarea input (height 80px / 12px radius / background rgba(255,255,255,0.05)), and a submit button (white background / black text / 100px radius / Inter 15px / 500 / padding 16px).

**ROUTING / COMPOSITION**
Compose this as a single overlay injected at the root level of the DOM. The user journey begins with a clean white scrolling page, encounters the liquid detachment drop which satisfyingly bounces and rolls to the right. Clicking it smoothly morphs into a premium dark-mode feedback UI, perfectly avoiding screen edges, and finally rockets off-screen upon submission.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue091
