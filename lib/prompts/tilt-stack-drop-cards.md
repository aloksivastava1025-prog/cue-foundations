# Tilt Stack Drop Cards — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** A social or creator platform's member discovery panel, where cycling faces replaces a static grid browse.

---

# PROMPT — Tilt Stack Drop Cards (paste-ready, pixel-perfect)

Copy from `---BEGIN PROMPT---` to `---END PROMPT---`. Paste into v0 / Bolt / Cursor / Claude / ChatGPT.

---BEGIN PROMPT---

Build a **single-file `index.html`** card-stack widget. Seven profile cards stacked **vertically with alternating tilts** — front card straight, next `-6°`, then `+6°`, alternating back — with cards scaling down as they recede. Click (or auto-tick every 2.5s) → the front card **drops downward off-screen with a slight clockwise tumble**, the whole stack advances forward one step, and the dropped card silently rejoins at the back of the stack from above.

**Vibe:** editorial "cards being played face-down onto a table" feel. Sharp 4px corners, portrait fills 80% of card, name + status at top over the image, avatar + handle + `+ Add member` at bottom.

Vanilla HTML/CSS/JS only. No framework, no build step, no libraries.

## ASSETS

Paste these URLs verbatim into the `CARDS_DATA` array — do NOT substitute.

### 7 portrait images (each URL is used BOTH as card background AND as circular avatar in same card)

| # | Name | Image URL | Handle | Status | Time |
|---|---|---|---|---|---|
| 1 | Sienna Brooks | `https://i.pinimg.com/736x/76/b2/44/76b2445d7cdbe9273341688dd1e097f1.jpg` | @sienna32 | Connecting | 12m ago |
| 2 | Marcus Chen | `https://i.pinimg.com/736x/93/5a/bb/935abbc2c7027fa606dba7152c73c59e.jpg` | @m.chen | Available | 1h ago |
| 3 | Elena Rodriguez | `https://i.pinimg.com/736x/65/1e/ab/651eabe69d4f0ba9a072f801641b35eb.jpg` | @elena.r | On Call | Just now |
| 4 | David Kim | `https://i.pinimg.com/736x/42/ca/eb/42caeb53f9351f4f5a9b6e11187fc08a.jpg` | @dkim | Offline | 2h ago |
| 5 | Sarah Jenkins | `https://i.pinimg.com/736x/44/bd/18/44bd1829f0d6373fa75796e739bce4c5.jpg` | @s.jenkins | Connecting | 23m ago |
| 6 | Julian Foster | `https://i.pinimg.com/736x/84/6b/a0/846ba0e5a646232bf161e1a8ab2eca2d.jpg` | @julianf | Available | 5m ago |
| 7 | Priya Sharma | `https://i.pinimg.com/736x/02/aa/40/02aa408f3dbad1ae0ec817140976d74a.jpg` | @priya.s | In Meeting | 4h ago |

### Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```
- Bodoni Moda — loaded (optional serif accents)
- Inter — active body font

## Foundation

```css
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #f4f4f5;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.stack-container {
  position: relative;
  width: 320px;
  height: 420px;
  perspective: 1200px;
}
```

Overflow-hidden on body is important — the drop animation sends the card down `120vh`, and you don't want the page to scroll from that.

## Card base

```css
.card {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: #ffffff !important;
  border-radius: 4px;              /* SHARP corners — editorial */
  padding: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  user-select: none;

  transition:
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    z-index 0s;

  transform-origin: center 120%;   /* pivot below card so tilt feels natural */
  will-change: transform;
}
```

**4px corners** everywhere (`.card`, `.c-img-wrapper`) — the sharp-corner editorial signature. Don't soften them.

## Card content

```css
.c-img-wrapper {
  flex: 1;
  width: 100%;
  border-radius: 4px;
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: #f0f0f0;
  overflow: hidden;
}

/* Dark top gradient for name legibility */
.c-img-wrapper::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 120px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
  pointer-events: none;
}

.c-top-text {
  position: absolute; top: 24px; left: 0;
  width: 100%;
  text-align: center;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}
.c-name { font-size: 26px; font-weight: 500; letter-spacing: -1px; margin-bottom: 4px; }
.c-status {
  font-size: 13px; font-weight: 500;
  color: rgba(255,255,255,0.85);
  display: flex; align-items: center; justify-content: center;
  gap: 6px;
}

.c-bottom {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 8px 8px 8px;
}
.c-user { display: flex; align-items: center; gap: 12px; }
.c-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.c-info { display: flex; flex-direction: column; }
.c-handle { font-size: 14px; font-weight: 600; color: #111; }
.c-time { font-size: 12px; font-weight: 500; color: #888; }
.c-btn {
  background: #111; color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 13px; font-weight: 500;
  cursor: pointer;
}
```

### Status icon (SVG sun-rays 12×12)

```svg
<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
  <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
</svg>
```

## The alternating-tilt physics (the widget's core)

```js
function updateCards() {
  cardsArray.forEach((card, i) => {
    // Alternating tilt: front card straight, then -6°, +6°, -6°, +6°…
    const rotate     = i === 0 ? 0 : (i % 2 === 1 ? -6 : 6);
    const scale      = 1 - (i * 0.05);   // 5% smaller per card back
    const translateY = -i * 20;          // Peek UP behind front card
    const translateX = 0;                // No horizontal fan

    card.style.zIndex   = cardsArray.length - i;
    card.style.transform =
      `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotateZ(${rotate}deg)`;
  });
}
```

**Reading the parameters:**
- **`rotate: i===0 ? 0 : (i%2===1 ? -6 : 6)`** — front card is straight, then alternating -6°/+6°/-6°/+6° for cards behind. This creates the "shuffle" look — cards behind poke out at slight tilts.
- **`translateY: -i * 20`** — negative → cards behind sit slightly ABOVE the front card, peeking out from behind at the top.
- **`scale: 1 - i * 0.05`** — 5% smaller per card back (front 1.00, 7th card 0.70). Bigger falloff than a fanned deck because vertical stacks need more scale contrast to read as depth.
- **`zIndex = length - i`** — front card highest z; behind cards descend.

## Drop-swipe interaction

```css
/* Swipe out — drops downward off-screen with a clockwise tumble */
.card.swipe-out {
  transform: translateY(120vh) rotateZ(15deg) !important;
  opacity: 0;
  pointer-events: none;
}

/* Re-entry — silently teleport above stack to prep for animating back in */
.card.re-entry {
  transition: none !important;
  opacity: 0 !important;
  transform: translateY(-50px) scale(0.8) !important;
}
```

```js
function swipeFrontCard() {
  if (isAnimating) return;
  isAnimating = true;

  const frontCard = cardsArray[0];

  // 1. Drop-out animation
  frontCard.classList.add('swipe-out');

  // 2. Rotate array — front goes to back
  cardsArray.push(cardsArray.shift());

  // 3. Instantly re-render remaining cards (they shift forward)
  updateCards();

  // 4. After drop-out finishes, silently reset the dropped card above the stack
  setTimeout(() => {
    frontCard.classList.add('re-entry');
    frontCard.classList.remove('swipe-out');
    void frontCard.offsetWidth;              // force reflow
    frontCard.classList.remove('re-entry');
    isAnimating = false;
    updateCards();                           // animate into new back slot
  }, 600);
}
```

**The 3-phase drop cycle:**
1. **swipe-out** (600ms) — front card falls `120vh` down with a **+15° clockwise tumble** (feels like the card is dropped onto a lower surface)
2. **re-entry** (0ms, no transition) — dropped card teleported invisibly to `translateY(-50px) scale(0.8)` — hovering above the stack, ready to rejoin
3. **updateCards()** (600ms) — teleported card animates from invisible-and-above into its new back position, opacity restored

Without step 2, the dropped card would animate backwards from `120vh` to `-i * 20px` — a straight line up the entire viewport. The teleport-then-animate pattern is what makes the loop feel seamless.

## Full JS init

```js
const CARDS_DATA = [ /* 7 entries — copy from ASSETS table */ ];
const stackContainer = document.getElementById('stack');
let cardsArray = [];
let isAnimating = false;

CARDS_DATA.forEach((data) => {
  const cardEl = document.createElement('div');
  cardEl.className = 'card';
  cardEl.innerHTML = `
    <div class="c-img-wrapper" style="background-image: url('${data.image}')">
      <div class="c-top-text">
        <div class="c-name">${data.name}</div>
        <div class="c-status">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
            <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
          </svg>
          ${data.status}
        </div>
      </div>
    </div>
    <div class="c-bottom">
      <div class="c-user">
        <img src="${data.image}" class="c-avatar">
        <div class="c-info">
          <div class="c-handle">${data.handle}</div>
          <div class="c-time">${data.time}</div>
        </div>
      </div>
      <button class="c-btn">+ Add member</button>
    </div>
  `;
  cardsArray.push(cardEl);
  stackContainer.appendChild(cardEl);
});

updateCards();
stackContainer.addEventListener('click', swipeFrontCard);
setInterval(swipeFrontCard, 2500);
```

## Customization knobs

| Knob | Location | Effect |
|---|---|---|
| Card size | `.stack-container { 320×420 }` | Any aspect; portrait 3:4 fits the vibe |
| Corner radius | `.card` + `.c-img-wrapper { border-radius: 4px }` | 8 = softer, 20 = friendly, 0 = brutalist |
| Tilt angle | `i%2===1 ? -6 : 6` | ±3 tight, ±12 dramatic. Keep front at 0 |
| Stack peek | `translateY: -i * 20` | 10 = tight stack, 40 = tall reveal |
| Scale falloff | `1 - (i * 0.05)` | Bigger delta = more depth |
| Drop distance | `translateY(120vh)` | 100vh minimum to clear viewport |
| Drop rotation | `rotateZ(15deg)` | Negative for counter-clockwise, ±5 subtle, ±30 chaotic |
| Swipe duration | `0.6s cubic-bezier(0.22, 1, 0.36, 1)` | 0.4 snappy, 0.9 languid |
| Auto-play speed | `setInterval(…, 2500)` | 1500 fast, 4000 calm |
| Re-entry offset | `translateY(-50px) scale(0.8)` | Where dropped card teleports before rejoining |
| Card fill color | `.card { background: #fff !important }` | Any solid — keeps content readable |
| Shadow | `-10px 10px 30px rgba(0,0,0,0.15)` | Positive/negative X flips shadow side |
| CTA copy | `+ Add member` | Any short label (Follow, Save, Connect) |
| Card count | `CARDS_DATA` length | 3–10 works; more = deeper stack |

## Responsive

```css
@media (max-width: 500px) {
  .stack-container { width: 280px; height: 380px; }
  .c-name { font-size: 22px; letter-spacing: -0.5px; }
  .c-status { font-size: 12px; }
  .c-btn { padding: 8px 12px; font-size: 12px; }
  .c-avatar { width: 28px; height: 28px; }
}

@media (max-width: 380px) {
  .stack-container { width: 240px; height: 320px; }
  .c-name { font-size: 20px; }
}
```

**Touch input** — click fires on tap. For real drag/throw: add `pointerdown/move/up`, track vertical delta, invoke `swipeFrontCard()` when threshold exceeded. Delta direction should match `translateY(120vh)` (downward).

**Motion cost** — 7 cards animate simultaneously each swipe. Add `will-change: transform` (already there). On lower-end devices, reduce to 5 cards or extend `will-change: transform, opacity`.

**Reduced motion:**

```css
@media (prefers-reduced-motion: reduce) {
  .card { transition-duration: 0.2s !important; }
  .card.swipe-out { transform: translateY(100vh) !important; }
}
```

```js
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(swipeFrontCard, 2500);
}
```

## Deliverable checklist

- [ ] Single HTML file, Google Fonts CDN only (Bodoni Moda + Inter), no libraries
- [ ] Body `#f4f4f5` off-white, centered flex, `height: 100vh; overflow: hidden`
- [ ] `.stack-container` 320×420 with `perspective: 1200px`
- [ ] Cards absolute-positioned full-size, `background: #ffffff !important`
- [ ] **4px border-radius** on `.card` AND `.c-img-wrapper` (sharp editorial corners)
- [ ] `box-shadow: -10px 10px 30px rgba(0,0,0,0.15)` (left-falling shadow)
- [ ] `transform-origin: center 120%` on `.card`
- [ ] `.c-img-wrapper` flex-fills, 4px radius, background-cover portrait, `#f0f0f0` fallback
- [ ] `::before` gradient top-120px `rgba(0,0,0,0.6) → transparent` for name legibility
- [ ] `.c-top-text` at `top: 24px`, centered, white with soft text-shadow
- [ ] 26px `.c-name` weight 500 `-1px` letter-spacing + 4px bottom margin
- [ ] 13px `.c-status` with 12×12 sun-rays SVG + status label
- [ ] `.c-bottom` with 32px avatar + handle/time + dark `+ Add member` pill (12px radius)
- [ ] **Alternating-tilt physics:** `rotate = i===0 ? 0 : (i%2===1 ? -6 : 6)`
- [ ] `scale = 1 - i*0.05` (5% falloff)
- [ ] `translateY = -i * 20` (cards peek UP behind front card)
- [ ] `translateX = 0` (NO horizontal fan)
- [ ] `zIndex = length - i` (front on top)
- [ ] `swipe-out` state: `translateY(120vh) rotateZ(15deg)` + opacity 0
- [ ] `re-entry` state: `transition: none; opacity: 0; transform: translateY(-50px) scale(0.8)`
- [ ] 3-phase drop cycle: swipe-out → array shift → re-entry teleport → animate to back
- [ ] `isAnimating` guard prevents overlap
- [ ] Click container → swipe
- [ ] `setInterval(swipeFrontCard, 2500)` auto-play
- [ ] 7 CARDS_DATA entries: exact URLs, names, statuses, handles, times from ASSETS table
- [ ] Card image URL used BOTH as `.c-img-wrapper` background AND as `.c-avatar` src
- [ ] Responsive 500px shrinks stack + text; 380px further scale-down
- [ ] `prefers-reduced-motion` shortens transitions + disables autoplay
- [ ] No console errors

---END PROMPT---

## Notes for the human

- **This is the vertical variant of a card stack** — cards fan UP behind the front card, not sideways. The alternating `-6°/+6°` tilt on the back cards is the visual signature; it reads as a hand-shuffled deck sitting on a table.
- **The drop-down `translateY(120vh)` swipe** is different from a side-swipe. It feels like the card is being dealt or discarded onto a lower surface. Combined with the `+15° clockwise tumble`, there's a physical weight to the exit.
- **`translateY: -i * 20` sends cards UP, not down.** Peek from top = "deck is stacked in front of you, top card visible". Peek from bottom (`+i * 20`) would look like the front card is sinking into the pile, which is the opposite metaphor.
- **The 3-phase drop cycle** (drop → teleport-above → animate to back) is the same core pattern as the fanned-arc version, just with different offsets. The teleport target is `translateY(-50px) scale(0.8)` — above and slightly shrunk, so it "arrives" from above rather than sliding sideways.
- **`background: #ffffff !important`** — the `!important` is deliberate. Without it, some hosting environments override with a body-inherit that shows through the card content. Force white.
- **Front card at `rotate: 0`** — this is critical. If you tilt the front card too, the eye has no "anchor" to read and the stack looks like it's collapsing. Anchor-plus-alternating-behind is the readable pattern.
- Rebrand recipe: swap 7 portrait URLs + names + brand color on `.c-btn` + rotation amount = whole new deck feel in 5 minutes.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue017
