# Split Panel Image-Synced FAQ/Features — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for a product or design-system marketing site's FAQ or feature-highlight section where pairing copy with a synced visual reinforces each claim.

---

# PROMPT — FAQ Accordion / Tab Switcher (image-synced split panel)

You are a senior creative front-end engineer. Build a **single-file HTML** split-panel tab switcher:

- **Left panel** (black `#000`) — a top-left `TAB SWITCHER` eyebrow in Geist Mono + a **5-item accordion**. Each row: monospace index `01–05`, question title, and a `+ / −` toggle icon. Only one item open at a time. Opening a row expands its answer with a smooth grid-row `0fr → 1fr` height transition.
- **Right panel** (dark base `#0E1214`) — a **cross-fading soft-blur image** synced to the currently-open row. Five Pinterest images stacked absolutely; changing tabs fades one out and the next in with a subtle scale de-blur so it lands like a poster.
- Reusable as a **feature section** (drop feature titles + screenshots) — same skeleton.

**Framework:** Vanilla HTML + CSS + JS, single file. No libraries. Only Google Fonts (`Geist Mono`, `Inter Tight`, `Inter`).

**Deliverable:** save at exactly `faq-accordion/index.html`.

---

## ASSETS (locked — 5 Pinterest URLs, routed via wsrv.nl for CORS)

```
01  https://wsrv.nl/?url=i.pinimg.com%2F1200x%2F97%2F86%2Fc7%2F9786c75cf0594852c0097f263268f1b9.jpg
02  https://wsrv.nl/?url=i.pinimg.com%2F1200x%2F3d%2F2e%2F90%2F3d2e90b8d9f0f2212c4bb0d4cb00d1ab.jpg
03  https://wsrv.nl/?url=i.pinimg.com%2F1200x%2Fa7%2F2c%2F6b%2Fa72c6b401485df6e19218348f3fb2130.jpg
04  https://wsrv.nl/?url=i.pinimg.com%2F1200x%2F86%2Fd7%2F70%2F86d77085718d949e7052ecc12a0d6114.jpg
05  https://wsrv.nl/?url=i.pinimg.com%2F736x%2Fe8%2F89%2Fcc%2Fe889ccd45a9edd0642d42b53b6d597d0.jpg
```

One image per FAQ item, via `data-idx="0N"` on both `<img>` and `.item`. Default active: `01`.

---

## COPY (locked)

**Eyebrow (top-left):** `tab switcher` (Geist Mono, uppercase)

**Items:**
```
01  What are these components?
    These are carefully crafted Framer components focused on smooth motion, clean
    structure, and modern interaction patterns. Each component is built to feel
    intentional, lightweight, and ready to drop into real projects without extra setup.

02  Can I customize them?
    Every prop, color, and timing curve is exposed at the top of each file so you
    can wire it to your own design tokens without touching internals. Nothing is
    hardcoded — swap fonts, spacing, and durations and the motion stays balanced.

03  Are they responsive?
    Every component ships with a mobile breakpoint. Touch handlers, layout, and
    typography all adapt down to 320 px without losing the feel or the timing that
    makes the interaction read on desktop.

04  Can I use them commercially?
    Yes. Use them in production sites, client work, or personal projects. Attribution
    is appreciated but not required. Redistributing the collection itself as a
    template is the only thing off-limits.

05  Do they work well together?
    They're built on the same tokens, spacing scale, and easing curves — designed
    to compose. A hero, a filter row, and a CTA from this library will feel like
    they were made together.
```

---

## DESIGN TOKENS (paste-verbatim CSS)

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  min-height: 100vh;
  font-family: 'Inter Tight', 'Inter', -apple-system, sans-serif;
  background: #000;
  color: #fff;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}
.stage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%; height: 100vh;
}
.panel-left {
  position: relative;
  background: #000;
  padding: 56px 72px;
  display: flex; flex-direction: column;
}
.panel-right {
  position: relative;
  overflow: hidden;
  background: #0E1214;
}
```

**Typography (locked):**
- Eyebrow — Geist Mono 12 / 700, uppercase, letter-spacing `-0.02em`, `#fff`
- Row number — Geist Mono 12 / 700, uppercase, letter-spacing `-0.02em`, line-height 1
- Question — Inter Tight 18 / 400, letter-spacing `-0.01em`, line-height 1
- Answer — Inter Tight 15 / 400, line-height 1.48, letter-spacing `-0.005em`, `rgba(255,255,255,0.6)`

---

## LEFT PANEL — ACCORDION STRUCTURE

Each item is a `.item` (with optional `.open`) containing a `<button class="row">` and a `.body` grid that houses the collapsible answer.

**Row grid**
```css
.item .row {
  appearance: none;
  border: none; background: transparent;
  width: 100%;
  display: grid;
  grid-template-columns: 40px 1fr 22px;      /* number | question | icon */
  column-gap: 24px;
  align-items: center;
  padding: 22px 0;
  cursor: pointer;
  color: #fff;
  text-align: left;
  opacity: 0.30;
  transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.item.open .row               { opacity: 1;    }
.item:not(.open):hover .row   { opacity: 0.55; }
```

**Divider** — 1 px `rgba(255,255,255,0.20)` at `border-bottom` of every `.item`.

**Toggle icon (`+ ↔ −`)** — two 1-px bars in a 14 × 14 box:
```css
.icon         { position: relative; width: 14px; height: 14px; justify-self: end; }
.icon .v, .icon .h {
  position: absolute;
  background: #fff;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.icon .v { left: 50%; top: 0;  width: 1px; height: 100%; transform: translateX(-50%); }
.icon .h { left: 0;  top: 50%; width: 100%; height: 1px; transform: translateY(-50%); }
/* Open: vertical bar rotates 90° so it overlaps the horizontal → visually reads as − */
.item.open .icon .v { transform: translateX(-50%) rotate(90deg); }
.item.open .icon .h { transform: translateY(-50%) rotate(180deg); }
```

---

## COLLAPSIBLE BODY (locked pattern)

**Grid-row height transition** — pure CSS, no measuring:
```html
<div class="body">
  <span class="spacer1"></span>
  <div class="content-wrap"><div class="content">
    <p>...answer text...</p>
  </div></div>
  <span class="spacer2"></span>
</div>
```
```css
.body { display: grid; grid-template-columns: 40px 1fr 22px; column-gap: 24px; }
.body .content-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.item.open .body .content-wrap { grid-template-rows: 1fr; }
.body .content { overflow: hidden; min-height: 0; }
.body p { padding: 0 0 26px 0; }
```

`.spacer1` (40 px) and `.spacer2` (22 px) hold the answer visually indented under the question and away from the toggle column — no JS layout math needed.

---

## RIGHT PANEL — IMAGE CROSS-FADE (locked)

```html
<aside class="panel-right" id="stage-r">
  <img class="active" data-idx="01" src="..."/>
  <img              data-idx="02" src="..."/>
  <img              data-idx="03" src="..."/>
  <img              data-idx="04" src="..."/>
  <img              data-idx="05" src="..."/>
</aside>
```
```css
.panel-right img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  filter: blur(28px) saturate(1.15);
  transform: scale(1.18);
  opacity: 0;
  transition:
    opacity   0.8s cubic-bezier(0.22, 1, 0.36, 1),
    transform 1.2s cubic-bezier(0.22, 1, 0.36, 1),
    filter    0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.panel-right img.active { opacity: 1; transform: scale(1.10); }
.panel-right::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(80% 60% at 60% 40%,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.04) 55%,
    rgba(0,  10,  20, 0.20) 100%);
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

**Feel:** the incoming image starts oversized + heavily blurred, then de-blurs and shrinks toward `scale(1.10)` as it fades in — like the image is "landing" behind the copy.

---

## INTERACTIONS (locked)

```js
const items     = document.querySelectorAll('.item');
const rightImgs = document.querySelectorAll('.panel-right img');

function syncImage(num) {
  rightImgs.forEach(img => img.classList.toggle('active', img.dataset.idx === num));
}

items.forEach(item => {
  const row = item.querySelector('.row');
  row.addEventListener('click', () => {
    const alreadyOpen = item.classList.contains('open');
    items.forEach(x => x.classList.remove('open'));
    if (!alreadyOpen) {
      item.classList.add('open');
      syncImage(item.dataset.num);
    }
  });
});
```

**Rules:**
- Only one item open at a time
- Clicking the currently-open row **collapses everything** (image stays on the last-selected slot)
- Image sync fires only on OPEN (not on collapse) so the visual state doesn't flash to a default when everything closes

Optional autoplay (feature-section variant): `setInterval(() => nextItem().open(), 4500)`, paused on hover of `.stage`.

---

## Responsive

- **≥ 901 px** — 50/50 split, full spec.
- **641–900 px** — stack vertically: `.stage { grid-template-columns: 1fr; grid-template-rows: 1fr 40vh; }`, `.panel-left { padding: 32px 24px }`, question drops to 16 px.
- **≤ 640 px** — same stacked layout; right image reduces to 32vh; question stays 16 px.
- **Touch** — accordion works via `click`; no hover-lift on rows.
- **`prefers-reduced-motion: reduce`** — collapse all row/icon/height transitions to `0.15s`; image cross-fade stays (users still need visual link between tab and image).

---

## Deliverable checklist

- [ ] Single file at `faq-accordion/index.html`.
- [ ] Google Fonts `Geist Mono:wght@400;500;700`, `Inter Tight:wght@400;500;600`, `Inter:wght@400;500;600`.
- [ ] Body `#000`, `overflow: hidden`, split-grid `.stage { grid-template-columns: 1fr 1fr; height: 100vh; }`.
- [ ] Left panel padding `56px 72px`, `TAB SWITCHER` eyebrow in Geist Mono 12/700 uppercase.
- [ ] 5 `.item` rows, `border-bottom: 1px rgba(255,255,255,0.20)`.
- [ ] Row grid `40px 1fr 22px`, closed `opacity: 0.30`, open `1`, hover `0.55`.
- [ ] `+ / −` icon: two 1-px bars, vertical rotates 90° on open (overlaps horizontal).
- [ ] Grid-rows `0fr → 1fr` collapsible with `overflow: hidden` inner `.content`.
- [ ] Answer paragraph `Inter Tight 15/400, line-height 1.48, rgba(255,255,255,0.6), padding-bottom 26px`.
- [ ] Right panel bg `#0E1214`, 5 stacked `<img>` with `data-idx="01".."05"`.
- [ ] Image style `blur(28px) saturate(1.15)`, transform `scale(1.18 → 1.10)`, opacity `0 → 1`, transitions `0.8s / 1.2s / 0.8s` cubic-bezier(0.22, 1, 0.36, 1).
- [ ] `::after` overlay with `mix-blend-mode: overlay` radial gradient.
- [ ] JS: single-open enforcement + `syncImage(item.dataset.num)` on open only.
- [ ] `prefers-reduced-motion` collapses row/icon/collapsible transitions to 150 ms.
- [ ] `≤ 900 px` stacks left/right vertically at 60/40 height split.

---

## REFERENCE

The complete working source lives at `faq-accordion/index.html` in this repo. Reproduce it byte-for-byte — grid-rows `0fr → 1fr` for the collapsible height, the 90° vertical-bar rotation for the `+ → −` toggle, the `scale(1.18 → 1.10)` image de-blur, and the single-open state machine. Repurpose as a **feature section** by swapping the question strings for feature titles, the answer strings for descriptions, and the Pinterest images for product screenshots — the rest of the skeleton stays identical.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue122
