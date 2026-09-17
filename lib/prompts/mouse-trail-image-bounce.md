# Mouse-Trail Image Bounce — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** Ideal as a playful full-viewport interlude on a fashion, photography, or creative studio portfolio where cursor exploration should feel tactile and memorable.

---

# Add Mouse-Move Image Fall & Bounce Section — Integration Prompt

> **You are working inside an existing HTML project. Do NOT create a new file. Do NOT overwrite `<body>` or reset `<html>`/`body` styles. Adapt and integrate this interactive section as an addition to the current codebase — preserve everything already there (existing markup, styles, animations, dependencies).**

Add a **fullscreen interactive section** where mouse movement (or touch drag) spawns curated images that appear at the cursor position, scale up elastically, then fall down through the viewport with physics — bouncing once, tilting, and dropping off-screen. Each image cycles through a preloaded set. The center of the section shows two lines of instruction text ("Move your mouse to make / images fall and bounce") with the second line rendered in grey.

Uses **GSAP timelines with mixed easings** (`elastic.out`, `back.in`, `power1.in`) to make each image feel like a physical object — scale bounce on spawn, gravity pull, wall-bounce, gentle rotation on fall. Distance-based throttle prevents spam: images only spawn after cursor has traveled `viewport_width / 8` pixels (or `/6` on touch).

Paste-ready for Bolt / v0 / Cursor / any AI agent.

---

## Integration Rules (READ FIRST)

1. **Do not duplicate CDN imports.** If GSAP is already loaded, reuse it. Only add if missing:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
   ```
2. **Namespace with `.mif-*`** (mouse image fall). Do not use generic names like `.effect`, `.medias`, `.content-effect` that collide with host CSS.
3. **Section is `100dvh` fullscreen.** Insert it as a standalone `<section>` block wherever it belongs in the page flow — do NOT put it inside a smaller container. It NEEDS the full viewport height.
4. **`overflow: hidden` is required** on the section wrapper — spawned images travel past the section bounds during fall and must be clipped.
5. **Do not touch `<body>` / `<html>` global styles.** The section is self-contained.
6. **Wrap the JS in an IIFE** so nothing leaks to global scope.
7. **Preload images as static `<img>` tags** inside `.mif-medias` — the JS reads their `src` attribute into a JS array on init. This ensures the browser has cached them before the first spawn (no first-hover jank).

---

## What to Add

### 1. HTML — insert at the desired position in page flow

```html
<section class="mif-section">
  <p class="mif-content">
    <span>Move your mouse to make</span>
    <span>images fall and bounce</span>
  </p>
  <div class="mif-medias">
    <img src="https://i.pinimg.com/1200x/…image01.jpg" alt="">
    <img src="https://i.pinimg.com/1200x/…image02.jpg" alt="">
    <!-- 5–10 images total. Use exact URLs from the assets block below. -->
  </div>
</section>
```

### 2. CSS — append to the existing `<style>` block

```css
.mif-section {
  height: 100dvh;
  overflow: hidden;
  position: relative;
  cursor: crosshair;
  background: #0a0a0a;
}

.mif-content {
  font-size: min(60px, 5.6vw);
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  position: absolute;
  align-items: center;
  letter-spacing: -0.03em;
  font-weight: 500;
  line-height: 1.15;
  z-index: 1;
  pointer-events: none;
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.mif-content span {
  display: block;
  width: max-content;
}
.mif-content span:last-child {
  color: #999;
}

/* Spawned images (created by JS) */
.mif-section img {
  width: 15vw;
  height: 15vw;
  position: absolute;
  object-fit: cover;
  border-radius: 4%;
  z-index: 5;
  pointer-events: none;
}

/* Preloaded images (never rendered — 1px hidden) */
.mif-section .mif-medias img {
  width: 1px;
  height: 1px;
  top: 0;
  left: 0;
  position: absolute;
  visibility: hidden;
  pointer-events: none;
}

@media (max-width: 768px) {
  .mif-section img {
    width: 35vw;
    height: 35vw;
  }
}
```

### 3. JS — append at end of existing script (wrapped in IIFE)

```js
(function () {
  const root = document.querySelector('.mif-section');
  if (!root) return;

  // 1. Preload image URLs into JS array (browser has already cached them via <img> tags)
  const images = [];
  root.querySelectorAll('.mif-medias img').forEach(img => {
    images.push(img.getAttribute('src'));
  });

  // 2. State
  let incr = 0;
  let oldIncrX = 0;
  let oldIncrY = 0;
  let firstMove = true;
  let indexImg = 0;

  // 3. Distance threshold — spawn a new image only after cursor travels this many px
  //    Coarse pointer (touch) gets a shorter threshold so fewer moves spawn images
  const isCoarsePointer = window.matchMedia('(hover: none)').matches;
  const resetDist = window.innerWidth / (isCoarsePointer ? 6 : 8);

  const W = window.innerWidth;
  const H = window.innerHeight;
  const clampX = gsap.utils.clamp(0, W);
  const clampY = gsap.utils.clamp(0, H);

  // 4. Track cursor movement, accumulate distance, spawn when threshold reached
  function applyMove(clientX, clientY) {
    const valX = clampX(clientX);
    const valY = clampY(clientY);
    if (firstMove) {
      firstMove = false;
      oldIncrX = valX;
      oldIncrY = valY;
      return;
    }
    incr += Math.abs(valX - oldIncrX) + Math.abs(valY - oldIncrY);
    if (incr > resetDist) {
      incr = 0;
      createMedia(valX, valY - root.getBoundingClientRect().top,
                  valX - oldIncrX, valY - oldIncrY);
    }
    oldIncrX = valX;
    oldIncrY = valY;
  }

  root.addEventListener('mousemove', (e) => applyMove(e.clientX, e.clientY));
  root.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) applyMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  root.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) applyMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  // 5. Spawn one image at (x, y) with velocity (deltaX, deltaY)
  //    5-phase timeline: pop-in bounce → travel → fall to apex → tilt/drift → fall off
  function createMedia(x, y, deltaX, deltaY) {
    const H = window.innerHeight;
    if (y > H - 200) return;              // skip spawns too close to bottom

    const image = document.createElement('img');
    image.setAttribute('src', images[indexImg]);
    root.appendChild(image);

    const tl = gsap.timeline({
      onComplete: () => { root.removeChild(image); tl && tl.kill(); }
    });

    // Phase A: SPAWN — pop-in with elastic bounce, tiny random tilt + offset
    tl.fromTo(image, {
      xPercent: -50 + (Math.random() - 0.5) * 80,
      yPercent: -50 + (Math.random() - 0.5) * 10,
      scaleX: 1.3, scaleY: 1.3,
      rotation: (Math.random() - 0.5) * 20
    }, {
      scaleX: 1, scaleY: 1,
      ease: 'elastic.out(2, 0.6)',
      duration: 0.4
    });

    // Phase B: TRAVEL X — image drifts in cursor's direction
    tl.fromTo(image, { x }, {
      x: '+=' + deltaX * 2,
      rotation: 0,
      ease: 'power1.in',
      duration: 0.4
    }, '<');

    // Phase C: FALL to apex — arcs down to peak (yPercent -95), scales to 0.9
    tl.fromTo(image, { y }, {
      y: '+=' + (H - y),
      scale: 0.9,
      yPercent: -95,
      ease: 'back.in(1.1)',
      duration: 0.4
    }, '<');

    // Phase D: DRIFT + TILT — continues moving x, random rotation
    tl.to(image, {
      x: '+=' + deltaX * 1.6,
      rotation: (Math.random() - 0.5) * 40,
      ease: 'power1.in',
      duration: 0.3
    });

    // Phase E: FALL OFF — drops below viewport with position-dependent easing
    tl.to(image, {
      yPercent: 150,
      ease: 'back.in(' + (1.5 + (1 - y / H)) + ')',
      duration: 0.3
    }, '<');

    indexImg = (indexImg + 1) % images.length;
  }
})();
```

---

## Assets — 10 Preloaded Images

Use **exact URLs** in the `<img>` tags inside `.mif-medias`. Order matters — images cycle in this sequence:

```
1.  https://i.pinimg.com/1200x/2c/8d/c3/2c8dc332a16f6e171184b47052513b87.jpg
2.  https://i.pinimg.com/1200x/3e/f8/82/3ef882b98b47108bba02ef86f1471f55.jpg
3.  https://i.pinimg.com/1200x/39/f7/3a/39f73aab3b6db054d1ce12cf7da7bdaf.jpg
4.  https://i.pinimg.com/1200x/03/8d/b5/038db541355f53ce8792efaeab94550a.jpg
5.  https://i.pinimg.com/1200x/8a/93/49/8a93491afd90a09985eaddce102b329b.jpg
6.  https://i.pinimg.com/1200x/2b/05/80/2b0580d548248a24d6e4f84bc413a142.jpg
7.  https://i.pinimg.com/1200x/26/32/5b/26325bfd9131880dc4d695cd229508cc.jpg
8.  https://i.pinimg.com/1200x/2e/0a/74/2e0a74bd4db9a61a4f6061feb620b607.jpg
9.  https://i.pinimg.com/1200x/2a/4e/30/2a4e308d142e5c38b1d7c83025566e47.jpg
10. https://i.pinimg.com/1200x/74/a8/a8/74a8a8540eeedc3870a1ab979a2c242a.jpg
```

Fewer than 10 works — the cycle just becomes shorter. `indexImg % images.length` handles any count. Wider `1200x` variants preferred; `736x` also works.

---

## Section-by-Section Specs

### 1. Section wrapper (`.mif-section`)
- `height: 100dvh` (dynamic viewport — handles mobile URL bar collapse)
- `overflow: hidden` — spawned images clip when falling off
- `position: relative` — spawned images position absolute to this
- `cursor: crosshair` — signals "interactive area" on hover
- `background: #0a0a0a` — dark backdrop so any image color reads clean

### 2. Center text (`.mif-content`)
- `font-size: min(60px, 5.6vw)` — 60px on wide screens, fluid on narrow
- `letter-spacing: -0.03em`, `font-weight: 500`
- Absolute centered via `top: 50% + left: 50% + translate(-50%, -50%)`
- `pointer-events: none` — text never intercepts mouse (must pass through to `.mif-section`)
- `z-index: 1` — text sits ABOVE background but BELOW spawned images (z-index 5)
- First span: white `#ffffff`
- Second span: grey `#999`

### 3. Spawned image (`.mif-section img`, not `.mif-medias img`)
- `width: 15vw; height: 15vw` (desktop), `35vw × 35vw` (mobile ≤768px)
- `object-fit: cover` — always fills the square, crops long edges
- `border-radius: 4%` — subtle rounded corners
- `position: absolute` — placed at cursor
- `z-index: 5` — above the text
- `pointer-events: none` — doesn't intercept further mouse events

### 4. Preloaded images (`.mif-medias img`)
- Hidden: `width: 1px; height: 1px; visibility: hidden`
- Still forces the browser to fetch/cache them via `<img>` tags
- JS reads their `src` on init to populate the URL array

---

## Timeline Choreography (per spawned image)

Every spawned image plays this ~1.1-second timeline. Multiple images can be on-screen simultaneously — they don't share a timeline.

| Phase | Duration | Position | What happens | Easing |
|-------|----------|----------|--------------|--------|
| A. Spawn | 0.4s | `t=0` | Scale 1.3 → 1, random rotation ±10°, position jiggle | `elastic.out(2, 0.6)` |
| B. Travel X | 0.4s | `t=0` (`<` = same time as A) | X shifts by `deltaX * 2` in cursor direction, rotation → 0 | `power1.in` |
| C. Fall to apex | 0.4s | `t=0` (`<`) | Y falls to `H - y` (bottom), scales to 0.9, yPercent → -95 (bounce peak) | `back.in(1.1)` |
| D. Drift + tilt | 0.3s | `t=0.4` | X continues `+= deltaX * 1.6`, random rotation ±20° | `power1.in` |
| E. Fall off | 0.3s | `t=0.4` (`<`) | yPercent → 150 (drops below viewport) | `back.in(1.5 + (1 - y/H))` |

- Phases A/B/C run **simultaneously** (`'<'` position parameter) — spawn feels like one impact
- Phases D/E run **simultaneously** after A/B/C — post-bounce fall-off
- `onComplete` removes image from DOM — no memory leak

**The velocity-based physics:** `deltaX` and `deltaY` come from the mouse's raw movement between spawn events. Fast movement = images travel further and tilt more; slow movement = images fall almost straight down. This is what makes the effect feel physical.

---

## Spawn Throttle Math

```js
const resetDist = window.innerWidth / (isCoarsePointer ? 6 : 8);
```

- Desktop (`hover: hover`): threshold = viewport_width / 8 (e.g. 187.5px for 1500px viewport)
- Touch (`hover: none`): threshold = viewport_width / 6 (e.g. 250px for 1500px viewport) — spawns less often since touch drags are less precise

Cumulative Manhattan distance (`|Δx| + |Δy|`) is tracked. When it exceeds threshold, spawn one image and reset counter to 0. Ensures spam-free density regardless of mouse speed.

**Skip zone:** if `y > H - 200` (cursor is in bottom 200px of section), no spawn — prevents images stuck falling off the very edge.

---

## Common Bugs to Avoid

1. **"Images spawn but don't fall / bounce weirdly"** → You forgot the position parameters (`'<'`) in the timeline. All `.fromTo` after the first phase MUST use `'<'` to run simultaneously with the previous tween, not sequentially.
2. **"Only one image at a time on screen"** → You're reusing a single element instead of `document.createElement('img')` per spawn. Each spawn must create its own DOM node.
3. **"Images pile up and browser slows down"** → Missing `onComplete: () => root.removeChild(image)`. Every image must be removed when its timeline ends.
4. **"First image jumps to origin (0,0) on spawn"** → `firstMove` guard is missing. On the very first mousemove, `oldIncrX/Y` are uninitialized — the guard sets them without spawning.
5. **"Nothing happens on mobile"** → Missing touch event listeners. Add `touchstart` and `touchmove` with `{ passive: true }`.
6. **"Images look chunky / low-res"** → Using `736x` Pinterest variants scaled up to 15vw. Prefer `1200x` for HD.
7. **"Images stack behind the text"** → z-index conflict. Spawned images MUST be z-index 5; text is z-index 1. Preloaded `.mif-medias img` must stay 1px hidden or they'll cover the layout.
8. **"Section takes over the whole page and I can't scroll"** → `100dvh` + `overflow: hidden` is intentional for this section. If placed in a scrollable page, wrap the effect in a taller parent OR set section to a smaller fixed height (e.g. `70vh`) — but the mouse tracking math (`window.innerHeight`) will need updating too.

---

## Test Before Shipping

- Refresh — 2 lines of text visible center-screen, cursor is a crosshair
- Move mouse quickly — images spawn every ~180px of travel, each bounces + falls off in ~1 second
- Move mouse slowly — no images spawn until enough distance accumulated (feels responsive, not spammy)
- Fast diagonal swipes — images travel farther and tilt more (velocity affects physics)
- Hover text — text does not intercept clicks (mouse still triggers spawns underneath)
- Touch (mobile) — drag triggers spawns just like mouse; threshold slightly higher so less spam
- Watch for DOM growth in DevTools — image count stays at 0-8 simultaneous; nothing accumulates
- Existing sections above/below still work — no z-index bleed, no CSS collision

Done. Ship it. 🚀

---

**Awwwards-tier version →** https://cuedesign.space/component/cue011
