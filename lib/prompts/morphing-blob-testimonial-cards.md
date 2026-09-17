# Morphing Blob Testimonial Cards — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** A SaaS product marketing site's social-proof section, placed between the feature breakdown and the pricing table.

---

# PROMPT — Premium Feature Cards (paste-ready, pixel-perfect)

Copy from `---BEGIN PROMPT---` to `---END PROMPT---`. Paste into v0 / Bolt / Cursor / Claude / ChatGPT.

---BEGIN PROMPT---

Build a **single-file `index.html`** premium testimonial card row. Editorial serif header on top, then 5 dark-neutral cards in a horizontal scroll with quote + author profile. On hover, each card lifts + shows a **morphing blurred gradient blob** at the bottom (breathing animation). Two live toggles at the top: a **color theme** picker (Orange/Blue/Green + Custom via `<input type="color">`) and a **Light/Dark** mode toggle. Everything themable via CSS custom properties.

Vanilla HTML/CSS/JS only. No framework, no build step, no libraries. Match every spec below exactly.

## Foundation

- Load Google Fonts: `Inter:wght@300;400;500` (body/UI) and `Lora:ital,wght@0,400;0,500;1,400` (editorial serif headings, incl. italic).
- CSS custom properties — two orthogonal systems:

### 1. Gradient palette (per theme)

```css
:root, [data-theme="orange"] {
  --c1: #ff6b00;  --c2: #ffb347;  --c3: #ff3c00;  --c4: #ff9500;
}
[data-theme="blue"] {
  --c1: #0055ff;  --c2: #66a3ff;  --c3: #0033cc;  --c4: #3377ff;
}
[data-theme="green"] {
  --c1: #00a859;  --c2: #5cd68d;  --c3: #00733c;  --c4: #2eb872;
}
[data-theme="custom"] {
  --c1: var(--custom-c1, #8e44ad);
  --c2: var(--custom-c2, #b86edb);
  --c3: var(--custom-c3, #5a2273);
  --c4: var(--custom-c4, #d395f0);
}
```

### 2. UI palette (light + dark)

```css
:root {
  --bg-color: #ffffff;
  --text-main: #111111;
  --text-sec: #666666;
  --text-italic: #555555;

  --card-bg: #f4f4f5;
  --card-shadow: rgba(0,0,0,0.02);
  --card-shadow-hover: rgba(0,0,0,0.1);

  --toggle-bg: #f4f4f5;
  --toggle-border: #eaeaea;
  --toggle-text: #777777;
  --toggle-active-bg: #ffffff;
  --toggle-active-text: #111111;
  --toggle-active-shadow: rgba(0,0,0,0.06);
}

body.dark-mode {
  --bg-color: #0a0a0a;
  --text-main: #ffffff;
  --text-sec: #a0a0a0;
  --text-italic: #888888;

  --card-bg: #141415;
  --card-shadow: rgba(0,0,0,0.3);
  --card-shadow-hover: rgba(0,0,0,0.6);

  --toggle-bg: #1a1a1c;
  --toggle-border: #333333;
  --toggle-text: #999999;
  --toggle-active-bg: #2a2a2c;
  --toggle-active-text: #ffffff;
  --toggle-active-shadow: rgba(0,0,0,0.3);
}
```

Every color-related property in the design references one of these vars → single toggle instantly repaints the whole page.

## Body

```css
body {
  margin: 0;
  background: var(--bg-color);
  font-family: 'Inter', sans-serif;
  color: var(--text-main);
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 60px 40px;
  box-sizing: border-box;
  transition: background-color 0.4s ease, color 0.4s ease;
}
```

The `0.4s ease` transition on `background-color` + `color` gives smooth theme flips.

## Header section

`.header-section`:
- `width: 100%; max-width: 1200px`.
- `display: flex; justify-content: space-between; align-items: flex-end`.
- `margin-bottom: 50px; gap: 40px`.

Left column — big serif headline `<h2>`:
- Font: Lora 400, `font-size: 32px`.
- `margin: 0; flex: 1; color: var(--text-main)`.
- `transition: color 0.4s ease`.
- Copy: `Why top teams <em>choose</em> us?`
- The `<em>` italic uses `color: var(--text-italic)` — subtly dimmer than the main text so it reads as an editorial accent.

Right column — supporting `<p>`:
- `margin: 0; font-size: 14px; line-height: 1.6; max-width: 400px`.
- `color: var(--text-sec); text-align: right`.
- `transition: color 0.4s ease`.
- Copy: `From fast-growing startups to enterprise companies, see how we are transforming the way people work and collaborate every day.`

## Cards container — horizontal scroll

```css
.cards-container {
  width: 100%; max-width: 1200px;
  display: flex; gap: 20px;
  overflow-x: auto;
  padding: 20px 0 40px;
  scrollbar-width: none;
}
.cards-container::-webkit-scrollbar { display: none; }
```

Hides scrollbar in every browser but keeps native swipe/wheel scroll. `padding-top: 20px` is critical — otherwise the hover `translateY(-10px)` clips against the container top.

## Card

```css
.card {
  min-width: 280px; flex: 1;
  height: 420px;
  background: var(--card-bg);
  border-radius: 4px;
  padding: 32px 24px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  display: flex; flex-direction: column; justify-content: space-between;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.4s ease,
              background-color 0.4s ease;
  box-shadow: 0 4px 10px var(--card-shadow);
}
.card:hover {
  transform: scale(1.05) translateY(-10px);
  box-shadow: 0 20px 40px var(--card-shadow-hover);
}
```

`cubic-bezier(0.34, 1.56, 0.64, 1)` — spring-back overshoot. `min-width: 280px` + `flex: 1` means cards share space when they fit, then scroll horizontally when they don't.

## The premium gradient blob (secret sauce)

Inside each card as a `<div class="card-gradient"></div>` sibling to `.card-content`:

```css
.card-gradient {
  position: absolute;
  bottom: -60px; left: -40px; right: -40px;
  height: 65%;
  background: linear-gradient(120deg, var(--c1), var(--c2), var(--c3), var(--c4));
  background-size: 250% 250%;
  background-position: 0% 50%;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  filter: blur(25px);
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 1;
  pointer-events: none;
}

.card:hover .card-gradient {
  opacity: 1;
  transform: translateY(0);
  animation: waveMorph 3s ease-in-out infinite alternate;
}

@keyframes waveMorph {
  0% {
    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
    background-position: 0% 50%;
  }
  50% {
    border-radius: 70% 30% 50% 50% / 30% 40% 70% 60%;
    background-position: 100% 50%;
  }
  100% {
    border-radius: 30% 70% 40% 60% / 60% 30% 50% 70%;
    background-position: 0% 50%;
  }
}
```

The trick is 3 layered effects:
1. **Organic blob shape** via 8-value `border-radius` (`X% Y% Z% W% / A% B% C% D%` — separate horizontal and vertical radii per corner).
2. **`filter: blur(25px)`** — turns the sharp gradient into a diffused glow.
3. **`waveMorph` keyframe** — animates BOTH border-radius (organic morph) AND background-position (gradient stops drift across `background-size: 250% 250%`).

Card must have `overflow: hidden` so the blob is masked to the card's rounded rectangle.

## Card content

```css
.card-content { position: relative; z-index: 2; }
```
Both `.card-content` and `.card-profile` need `z-index: 2` to sit above the blob (which is `z-index: 1`).

**Headline (`h3`)** — Lora 400, `font-size: 23px; line-height: 1.3; margin: 0 0 16px 0; color: var(--text-main)`.

**Description (`p.desc`)** — Inter 400, `font-size: 13px; line-height: 1.6; color: var(--text-sec); margin: 0`.

**Profile row (`.card-profile`)** — `position: relative; z-index: 2; display: flex; align-items: center; gap: 12px; margin-top: auto` (so it pins to bottom).

- **`.avatar`** — 32×32 circle, `border-radius: 50%; background: #ddd; overflow: hidden`. Contains an `<img>` at `width: 100%; height: 100%; object-fit: cover`.
- **`.profile-info`** — `display: flex; flex-direction: column`.
  - `.profile-name` — Inter 600, `font-size: 13px; color: var(--text-main)`.
  - `.profile-role` — Inter 400, `font-size: 11px; color: var(--text-sec)`.

Every text color transitions with `0.4s ease` so theme flips are smooth.

## Content — 5 cards

Use these testimonials (swap freely — copy structure is what matters):

| # | Quote (h3) | Description (p.desc) | Avatar | Name | Role |
|---|---|---|---|---|---|
| 1 | `The efficiency is simply unmatched.` | `Our team workflow improved by 10x with this new integration. It's brilliant.` | `https://i.pravatar.cc/100?img=1` | Alex Mercer | Product Manager at Nexus |
| 2 | `A beautiful, seamless interface.` | `Design meets function perfectly. It feels incredibly premium and easy to use.` | `https://i.pravatar.cc/100?img=2` | Sarah Jenkins | UI/UX Lead at Studio Zen |
| 3 | `Saved us hundreds of hours.` | `Automation at its finest. We can finally focus on what really matters now.` | `https://i.pravatar.cc/100?img=3` | Marcus Thorne | CEO at Velocity |
| 4 | `Incredibly intuitive.` | `It didn't take any training. Everyone just knew how to use it immediately.` | `https://i.pravatar.cc/100?img=4` | Elena Rostova | Operations Manager at Spark |
| 5 | `Unparalleled support.` | `Whenever we had a question, the team was there instantly to help us out.` | `https://i.pravatar.cc/100?img=5` | David Chen | Founder at CloudSync |

## Theme toggle bars

`.theme-toggle` — soft-pill bar container:
```css
.theme-toggle {
  position: absolute;
  top: 20px;
  display: flex;
  background: var(--toggle-bg);
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--toggle-border);
  z-index: 10;
  align-items: center;
  transition: background 0.4s ease, border-color 0.4s ease;
}
.theme-toggle.center-toggle { left: 50%; transform: translateX(-50%); }
.theme-toggle.right-toggle  { right: 40px; }
```

`.theme-btn` — inner pill buttons:
```css
.theme-btn {
  background: transparent;
  color: var(--toggle-text);
  border: none;
  padding: 6px 18px;
  font: 500 12px 'Inter', sans-serif;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex; align-items: center; gap: 8px;
}
.theme-btn:hover  { color: var(--text-main); }
.theme-btn.active {
  background: var(--toggle-active-bg);
  color: var(--toggle-active-text);
  box-shadow: 0 2px 8px var(--toggle-active-shadow);
}
```

### Center toggle (color theme)

Four buttons: `Orange`, `Blue`, `Green`, and a `Custom` label wrapping an `<input type="color">`.

```html
<div class="theme-toggle center-toggle">
  <button class="theme-btn color-btn active" data-color="orange">Orange</button>
  <button class="theme-btn color-btn"        data-color="blue">Blue</button>
  <button class="theme-btn color-btn"        data-color="green">Green</button>
  <label class="theme-btn custom-color-label" data-color="custom">
    <span>Custom</span>
    <input type="color" id="colorPicker" class="color-picker-input" value="#8e44ad">
  </label>
</div>
```

Color-picker input styling — hides native chrome, shows a 18px circle swatch:
```css
.color-picker-input {
  border: none; width: 18px; height: 18px; padding: 0;
  border-radius: 50%; cursor: pointer; background: none;
}
.color-picker-input::-webkit-color-swatch-wrapper { padding: 0; }
.color-picker-input::-webkit-color-swatch {
  border: 1px solid #ddd; border-radius: 50%;
}
```

### Right toggle (light/dark)

```html
<div class="theme-toggle right-toggle">
  <button class="theme-btn mode-btn active" data-mode="light">Light</button>
  <button class="theme-btn mode-btn"        data-mode="dark">Dark</button>
</div>
```

## JS

```js
// COLOR THEME TOGGLE
const colorBtns    = document.querySelectorAll('.color-btn');
const customLabel  = document.querySelector('.custom-color-label');
const colorPicker  = document.getElementById('colorPicker');

colorBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    colorBtns.forEach(b => b.classList.remove('active'));
    customLabel.classList.remove('active');
    btn.classList.add('active');
    document.documentElement.setAttribute('data-theme', btn.dataset.color);
  });
});

// DARK MODE TOGGLE
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.body.classList.toggle('dark-mode', btn.dataset.mode === 'dark');
  });
});

// CUSTOM COLOR PICKER — derives a 4-stop gradient from a single hex via HSL rotation
function hexToHSL(H) {
  let r = 0, g = 0, b = 0;
  if (H.length === 4) { r = "0x" + H[1] + H[1]; g = "0x" + H[2] + H[2]; b = "0x" + H[3] + H[3]; }
  else if (H.length === 7) { r = "0x" + H[1] + H[2]; g = "0x" + H[3] + H[4]; b = "0x" + H[5] + H[6]; }
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin;
  let h = 0, s = 0, l = 0;
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return { h, s, l };
}

colorPicker.addEventListener('input', (e) => {
  colorBtns.forEach(b => b.classList.remove('active'));
  customLabel.classList.add('active');
  document.documentElement.setAttribute('data-theme', 'custom');

  const hsl = hexToHSL(e.target.value);
  const c1 = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const c2 = `hsl(${(hsl.h + 15) % 360}, ${hsl.s}%, ${Math.min(hsl.l + 15, 90)}%)`;
  const c3 = `hsl(${(hsl.h - 15 + 360) % 360}, ${hsl.s}%, ${Math.max(hsl.l - 15, 10)}%)`;
  const c4 = `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(hsl.l + 25, 95)}%)`;

  const root = document.documentElement;
  root.style.setProperty('--custom-c1', c1);
  root.style.setProperty('--custom-c2', c2);
  root.style.setProperty('--custom-c3', c3);
  root.style.setProperty('--custom-c4', c4);
});
```

**The custom color math** — from a single hex, derive 4 harmonious stops:
- `c1` = base HSL
- `c2` = same hue, +15° hue, +15% lightness (clamped at 90)
- `c3` = same hue, −15° hue, −15% lightness (clamped at 10)
- `c4` = same hue, +25% lightness (clamped at 95) — highlight blend

Produces a natural analogous gradient every time — no ugly clash even when the user picks weird colors.

## Customization knobs

| Knob | Location | Effect |
|---|---|---|
| Headline copy | `.header-section h2` | Editorial hook. Keep `<em>` on 1 word for the italic accent. |
| Sub-copy | `.header-section p` | Right-aligned max 400px. |
| Card count / content | `.cards-container` children | Any N; the container is horizontally scrollable. |
| Card height | `.card { height: 420px }` | Taller for more air, shorter for compact grids. |
| Card min-width | `.card { min-width: 280px }` | Smallest before horizontal scroll kicks in. |
| Border-radius | `.card { border-radius: 4px }` | 4 = editorial, 16 = friendly, 24+ = playful. |
| Hover lift amount | `translateY(-10px) scale(1.05)` | Higher = more theatrical. |
| Bounce curve | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Reduce 1.56 → 1.2 to soften. |
| Blob blur | `filter: blur(25px)` | 15 = crisper, 40 = ghostly. |
| Blob palette | 4 CSS vars per `[data-theme]` | Any 4-stop palette. |
| Morph speed | `waveMorph 3s ease-in-out` | Slower = calmer, faster = frenetic. |
| Add themes | `[data-theme="purple"] { --c1: … }` etc. | Add more presets; wire buttons via `data-color`. |
| Custom color offsets | `+15° / -15° / +25%` in JS | Analogous → complementary → triadic feel. |
| Serif font | `Lora` | Swap for Playfair Display, Fraunces, Cormorant, Instrument Serif. |
| Body bg / card bg | `--bg-color`, `--card-bg` | Full-canvas rebrand. |

## Responsive

```css
@media (max-width: 900px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .header-section p { text-align: left; }

  /* Toggles stack above the content on narrow screens */
  .theme-toggle {
    position: relative;
    top: 0; left: 0 !important; right: 0 !important;
    margin-bottom: 20px;
  }
}

@media (max-width: 640px) {
  body { padding: 40px 20px; }
  .header-section h2 { font-size: 26px; }
  .header-section p  { font-size: 13px; }
  .card { min-width: 260px; height: 380px; padding: 24px 20px; }
  .card h3 { font-size: 20px; }
  .theme-btn { padding: 5px 12px; font-size: 11px; }
}
```

**Touch input** — the cards use native horizontal scroll on the `.cards-container` (no custom drag JS). Works with touch swipe out of the box. `scrollbar-width: none` hides the bar; the scroll gesture still fires.

**Motion cost on mobile** — the `filter: blur(25px)` blob is the most expensive effect. On lower-end phones, throttle it:
```css
@media (max-width: 640px) {
  .card-gradient { filter: blur(18px); }   /* softer blur = cheaper */
  @media (hover: none) {
    .card:active .card-gradient {
      opacity: 1; transform: translateY(0);
      animation: waveMorph 3s ease-in-out infinite alternate;
    }
  }
}
```
On touch devices, use `:active` (finger down) instead of `:hover` so the blob still reveals on tap.

**Reduced motion** — kill the animated morph, keep the reveal:
```css
@media (prefers-reduced-motion: reduce) {
  .card, .card-gradient, .theme-toggle, .theme-btn {
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  .card:hover .card-gradient { animation: none; opacity: 1; transform: translateY(0); }
  .card:hover { transform: none; }
}
```

**Toggle placement on very narrow screens** — the center toggle can overflow with 4 buttons. Wrap the Custom button below on mobile:
```css
@media (max-width: 480px) {
  .theme-toggle.center-toggle { flex-wrap: wrap; justify-content: center; }
}
```

## Deliverable checklist

- [ ] Single HTML file, no build step, Google Fonts CDN only
- [ ] Two orthogonal CSS var systems: gradient palette (`--c1..c4`) and UI palette (`--bg-color`, `--card-bg`, `--text-main`, toggle vars)
- [ ] Four gradient themes wired to `[data-theme="orange|blue|green|custom"]` selectors on `<html>`
- [ ] `body.dark-mode` overrides UI vars — no color hardcoded outside the `:root` blocks
- [ ] Header: Lora 32px `<h2>` with italic `<em>` in dimmer `--text-italic`, right-aligned Inter 14px paragraph
- [ ] Cards container: horizontal `overflow-x: auto`, scrollbar hidden, 20px gap, `padding-top: 20px` for hover lift room
- [ ] Card: 280px min-width, 420px height, 4px border-radius, `overflow: hidden`, `cubic-bezier(0.34, 1.56, 0.64, 1)` bounce
- [ ] Hover: `scale(1.05) translateY(-10px)` + shadow ramp
- [ ] `.card-gradient` blob: 4-stop 120° linear gradient with `background-size: 250% 250%`, `blur(25px)`, absolute positioning `bottom: -60px; left: -40px; right: -40px`
- [ ] Blob organic border-radius (`40% 60% 70% 30% / 40% 50% 60% 50%` at rest)
- [ ] `waveMorph` keyframe animates BOTH border-radius (3 waypoints) AND `background-position: 0% → 100% → 0%`
- [ ] Blob reveal on card hover: opacity 0 → 1, translateY 60px → 0, 3s alternate morph loop kicks in
- [ ] Card content + profile at `z-index: 2` — above blob (`z-index: 1`)
- [ ] Profile row uses `margin-top: auto` to pin to card bottom
- [ ] Center toggle (color theme) with 4 buttons + inline `<input type="color">` styled as an 18px circle swatch
- [ ] Right toggle (light/dark) — 2 buttons, adds `dark-mode` class to `body`
- [ ] Custom color derives 4 gradient stops from a single hex via `hexToHSL` → analogous rotation
- [ ] All text colors + backgrounds transition on `0.4s ease` so theme flips are smooth (no snapping)
- [ ] Responsive: header stacks below 900px, toggles inline below content; cards shrink to 260px min-width below 640px; blur softened on mobile; touch `:active` triggers blob reveal
- [ ] `prefers-reduced-motion` disables the morph loop but keeps the reveal
- [ ] No console errors

---END PROMPT---

## Notes for the human

- The **two-var system** (gradient palette vs UI palette) is what makes this component so re-brandable. Change the gradient by swapping `data-theme`; change light/dark by toggling `body.dark-mode`. They never fight each other.
- The **`waveMorph` keyframe animating both `border-radius` and `background-position`** is what makes the blob feel alive — most morphing gradients only animate shape OR color, not both.
- `background-size: 250% 250%` gives the gradient headroom to shift — without oversizing it, `background-position` animation has nothing to reveal.
- The **hex-to-HSL harmonic derivation** in the custom picker is the little detail that separates "toy color picker" from "premium tool". The user picks one color and gets a natural 4-stop gradient.
- Rebrand recipe: change the four palettes + Lora font + heading copy — the whole aesthetic shifts without touching layout.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue026
