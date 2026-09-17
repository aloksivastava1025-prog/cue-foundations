# 3D Book Carousel Reading Mode — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for a design studio or personal portfolio site showcasing a curated reading list or inspiration library with tactile, physical-feeling navigation.

---

# 3D Book Carousel — Personal Curation with Reading Mode

## Framework & Integration
- Drop into any existing React (Next.js/Vite) or vanilla page. Do NOT create a new HTML file.
- Import as `<BookCarousel3D books? initialIndex? onOpenBook? />`.
- Handles: horizontal scroll/drag/touch, spine-to-open interpolation, click-to-open reading mode (2-phase rise → swing), close button that flips its glyph.
- Zero external deps — CSS `preserve-3d` + `perspective` + RAF loop.

## ASSETS
Fonts:
- **Cormorant Garamond** 400/500 (serif for titles inside the reading spread)
- **Inter** 400/500/600/700 (UI + spine text)
- Both via Google Fonts.

Book cover images (Pinterest CDN, per-book):
```
DESIGN & ILLUSTRATION            https://i.pinimg.com/736x/aa/fc/98/aafc9885e670f6473561bdb46b6f78c8.jpg
Made in North Korea              https://i.pinimg.com/736x/3f/7b/19/3f7b1918ce4af46d415765bedd9a2034.jpg
DESIGN BY ACCIDENT               https://i.pinimg.com/736x/d2/4b/42/d24b420671770075dbadfc74f14dd64a.jpg
The creative act                 https://i.pinimg.com/736x/9d/e4/54/9de454a3fe3e35afd3e6449e70178561.jpg
S M L XL                         https://i.pinimg.com/1200x/80/04/48/800448a167edfba20cd2f87208845428.jpg
OPTIC                            https://i.pinimg.com/736x/05/24/fc/0524fc736181bb269e5398cfff4c3792.jpg
DEAD THIRTEEN                    https://i.pinimg.com/736x/a9/45/9c/a9459c6f5e71d8d69cd44c864e5c7b0e.jpg
VISIBLE SIGNS                    https://i.pinimg.com/1200x/dc/e3/c2/dce3c2012dcd0eb45649f4adb414843c.jpg
THE IDEAL MANUAL OF STYLE        https://i.pinimg.com/736x/52/09/0f/52090ff1b38bbc2d2db6a2de3e24aeb9.jpg
DESIGN & ILLUSTRATION (pink)     https://i.pinimg.com/1200x/45/7d/7f/457d7f2b139558049e8e5782bbdb9a33.jpg
DESIGN EMERGENCY                 https://i.pinimg.com/736x/3f/7b/19/3f7b1918ce4af46d415765bedd9a2034.jpg
MINIMAL                          https://i.pinimg.com/736x/aa/fc/98/aafc9885e670f6473561bdb46b6f78c8.jpg
PRINTABLE                        https://i.pinimg.com/1200x/80/04/48/800448a167edfba20cd2f87208845428.jpg
```

## DESIGN TOKENS
```css
--bg:      #ffffff
--text:    #1a1a1a
--serif:   'Cormorant Garamond', serif
--sans:    'Inter', sans-serif
--gap:     80px          /* between books on the shelf */
--open-w:  240px         /* front-cover face width when book is centred */
--pers:    3000px        /* scene perspective */
```

## LAYOUT

### Page shell
- `body { background: #fff; color: #1a1a1a; overflow: hidden; font-family: 'Inter', sans-serif }`
- No page scroll — everything driven by the RAF loop reading wheel/drag/touch.

### Corner labels
- `.top-left` — `JZA` — serif 20px at `top: 40px; left: 40px`
- `.top-right` — `ABOUT` — 12px 500 at `top: 40px; right: 40px`

### Center header
- Position: `bottom: calc(4% + 400px); width: 100%; text-align: center; z-index: 10; pointer-events: none`
- Contents: `<h1 class="main-title">` — Inter 14px 400 uppercase, `letter-spacing: 3px`
- Text updates each frame to the currently-active book's title.
- On reading mode: `.header.hidden { opacity: 0; transform: translateY(-10px) }`, transition `0.5s ease`.

### Scene + track
- `.scene { position: absolute; inset: 0; perspective: 3000px }`
- `.carousel-track { position: absolute; bottom: 4%; left: 50%; transform-style: preserve-3d }`

### Book geometry (each `.book-wrapper`)
- `position: absolute; bottom: 0; transform-style: preserve-3d; cursor: pointer`
- Inner `.book { width: 240px; height: {per-book}; transform-style: preserve-3d; transform-origin: left center }`
- Six faces (all `.face { position: absolute; backface-visibility: hidden }`):
  1. **Front-cover hinge** (holds the outer front + inside pane) — `width: 240px; height: 100%; top: 0; left: 0; transform-origin: left center; transform: translateZ({spineW / 2}px)`; JS rotates it Y-axis on open.
     - Inside the hinge: `.front` (cover face) + `.front-inside` (grey inside face at `rotateY(180deg) translateZ(1px)`)
  2. **First page** — reading spread. `width: 236px; height: calc(100% - 4px); top: 2px; left: 2px; transform: translateZ({spineW/2 - 1}px)`. Contains centred `Selected Work` eyebrow + book title in Inter uppercase + hairline divider.
  3. **Back cover** — `width: 240px; height: 100%; transform: rotateY(180deg) translateZ({spineW/2}px); background: cover-color`
  4. **Spine** — `width: {spineW}px; height: 100%; left: -{spineW/2}px; transform: rotateY(-90deg)`. `box-shadow: inset 5px 0 10px rgba(255,255,255,0.2), inset -5px 0 10px rgba(0,0,0,0.3)` gives the barrel curve. Contains vertical `.spine-text` (`writing-mode: vertical-rl; transform: rotate(180deg)`).
  5. **Pages right** — `width: {spineW}px; height: 100%; left: {240 - spineW/2}px; transform: rotateY(90deg)`; page-edge stripes via `repeating-linear-gradient(to right, transparent 0 2px, rgba(0,0,0,0.05) 2px 3px)`.
  6. **Pages top / bottom** — same stripe pattern rotated 90° X-axis; bottom variant has `box-shadow: 0 0 15px 5px rgba(0,0,0,0.2)` to ground the book.

### Front cover reflection (`.front-overlay`)
- `linear-gradient(to right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 10%, rgba(0,0,0,0.1) 95%, rgba(0,0,0,0.2) 100%)` — sells the paper curve.

### Progress bar
- `.progress-container { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); width: 200px; height: 2px; background: rgba(0,0,0,0.1); z-index: 20 }`
- `.progress-bar { height: 100%; background: var(--text); width: 0% }` — width = `(currentScroll / (numBooks - 1)) * 100%`

### Close button (only visible in reading mode)
- Fixed at `top: 40px; right: 40px`. 44×44 outlined circle, `border: 1px solid rgba(0,0,0,0.1)`.
- Contains two `.line` spans that form an `×` when `.visible` is toggled:
  - `.line-1 { transform: translateY(-50%) rotate(45deg) }`
  - `.line-2 { transform: translateY(-50%) rotate(-45deg) }`
- Hover: rotate more (135° / 45°) with 0.4s cubic-bezier(0.16, 1, 0.3, 1) — a subtle "arm windmill" tell.

## BOOK DATA schema
Each book supplies:
```
title       (spine + header + reading page)
color       (front + back cover fill)
textColor   (spine label + fallback text)
spineW      (spine width in px — thicker = beefier book)
h           (per-book height, px)
rotZ        (subtle idle Z rotation, degrees)
img         (front cover image URL)
isMain?     (uses navy palette + Unsplash cover art variant)
```
Reference `bookData` array in the demo has 13 books — spanning ~15–70px spines and 280–380px heights, so the shelf has organic variety.

## MOTION — the main RAF loop

State:
```
targetScroll   = 8         (float — the book to be centred; user drives via wheel/drag)
currentScroll  = 8         (float — lerped smoothly toward target at 0.08 per frame)
openedBookIndex = -1       (int �� -1 means shelf mode, else that book is opened)
bookOpenness   = [0, 0, …] (per-book scalar 0→1 — how "open" each book is)
```

### Layout pass (each frame)
1. Compute per-book `openness = max(0, 1 - |i - currentScroll|)` → smoothstep to `easeOpen`.
2. Book "current width" = `spineW + easeOpen * (openW - spineW)` — spine morphs into full cover face as it approaches centre.
3. Cumulative `positionsLeft[i]` = sum of previous books' widths + gaps (80px).
4. Camera X = interpolated centre of the two straddling books (`floor(scroll)` and `floor(scroll)+1`) — keeps the shelf smooth even between books.

### Per-book transform
```
x         = positionsLeft[i] - cameraX + (1 - easeOpen) * (spineW / 2)
rotateY   = (1 - easeOpen) * 90        /* 90° when full spine, 0° when full face */
z         = easeOpen * 60              /* pop-forward when centred */
zIndex    = round(100 - |diff| * 10)
scale     = 1 + easeOpen * 0.05
rotateZ   = rotZs[i] * (1 - easeOpen)  /* only tilted when off-centre */
```
Wrapper: `translateX(...) translateY(...) translateZ(...) scale(...) rotateZ(...)`
Inner `.book`: `rotateY(rotateY)` — this is the spine→face rotation.
Spine `filter: brightness(0.6 + easeOpen * 0.4)` — spine dims when it's a full face.

### Reading mode — 2 phases
When user clicks the centred book (or clicks the same book again to close):
- Toggle `openedBookIndex = i` (or `-1` to close).
- Per frame, `bookOpenness[i] +=  (target - current) * 0.06` — slow lerp so both phases feel majestic.
- `cOpen = bookOpenness[i]`
  - **Phase 1 — Rise** (`cOpen: 0 → 0.5` → `riseProgress: 0 → 1`)
    - Book zooms in (`z += easeRise * 150`) and lifts up (`y = easeRise * -120`)
  - **Phase 2 — Swing** (`cOpen: 0.5 → 1.0` → `swingProgress: 0 → 1`)
    - `x += easeSwing * (openW/2)` — shift right to keep visually centred as cover swings out
    - Hinge rotates: `rotateY(easeSwing * -140deg)` — cover opens 140° (past 90° so it looks organic, not machine-flat)
- Header hides via `.header.hidden`, close button shows via `.close-reading-mode.visible`.
- Wheel/drag disabled while `openedBookIndex !== -1`.

### Easing helpers
```js
smoothstep(t) = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2
```

## Input
- **Wheel**: `targetScroll += sign(deltaY) * 0.3`, clamped to `[0, numBooks - 1]`.
- **Mouse drag**: `delta = (clientX - startX) * -0.01` — dragging right pushes shelf left.
- **Touch**: same as drag with `touches[0].clientX`.
- **Click on book**: if it's currently centred (`Math.round(currentScroll) === i`), toggle open; else jump `targetScroll = i`.
- **Close button** or **click again**: `openedBookIndex = -1`.

## Responsive
- ≤900px: cap `--gap` to 40px, base `openW` to 180. Progress bar 140 wide.
- ≤600px: hide corner labels and header eyebrow; keep spine text (readable at any size); shrink perspective to 2000px so tilt reads on phones.
- `prefers-reduced-motion: reduce`: skip lerp — snap `currentScroll = targetScroll`, skip Phase 1 rise (jump straight to fully open on click), disable hover rotation on close button.

## Deliverable Checklist
1. Cormorant Garamond + Inter loaded via Google Fonts
2. `<body>` `overflow: hidden`, white bg
3. Corner labels `JZA` top-left (serif 20px), `ABOUT` top-right (12px 500)
4. Center header with title Inter 14px uppercase tracking-3, hides on reading mode with 0.5s fade + 10px translateY
5. Scene perspective 3000px, track anchored `bottom: 4%`
6. Six faces per book: front-hinge, first-page, back, spine, pages-right, pages-top, pages-bottom
7. Front-cover hinge with `transform-origin: left center` + JS-controlled `rotateY`
8. First-page positioned `translateZ(spineW/2 - 1)` so it sits behind the cover — becomes visible only when hinge swings
9. Spine `box-shadow: inset ±5px 0 10px` for the curved barrel look
10. Pages have `repeating-linear-gradient` stripe pattern in 3 orientations
11. Bottom-pages face has `0 0 15px 5px rgba(0,0,0,0.2)` shadow to ground each book
12. Front-overlay diagonal gradient for the paper-curve reflection
13. Per-book data (title, color, textColor, spineW, h, rotZ, img) drives everything — 13 book array as reference
14. RAF loop lerps `currentScroll` toward `targetScroll` at 0.08/frame
15. Camera X interpolated between neighbouring book centres so shelf glides
16. Spine morph: `width = spineW + easeOpen * (openW - spineW)` per frame
17. Book transform: `translateX + translateY + translateZ + scale + rotateZ`; inner rotate Y for spine→face
18. Reading mode: 2-phase (rise 0→0.5 with z+150 y-120, swing 0.5→1 with hinge rotateY 0→-140)
19. Close button: 44px outlined circle, `×` glyph via 2 rotated 1px lines, 0.4s cubic-bezier hover rotation
20. Progress bar bottom-centre, width = `(currentScroll / (n-1)) * 100%`; wheel/drag/touch all clamp to `[0, n-1]`

---

**Awwwards-tier version →** https://cuedesign.space/component/cue074
