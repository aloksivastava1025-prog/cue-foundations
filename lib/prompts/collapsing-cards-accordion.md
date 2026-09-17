# Collapsing Cards Accordion — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for a creative studio or fashion portfolio homepage showcasing curated projects where a tactile, image-forward selector replaces a static grid.

---

# PROMPT — Collapsing Cards (5-card horizontal accordion)

You are a senior creative front-end engineer. Build a **single-file HTML** viewport-fit gallery: 5 image cards sit in a horizontal row. One card is expanded, the other four are compressed to narrow strips. **Hovering** any card smoothly expands it and collapses the previously active one. Collapsed cards show a **vertical wordmark**; the active card reveals a horizontal title + `View ↗` link.

**Framework:** Vanilla HTML + CSS + JS, single file. No libraries. Only Google Fonts (`Inter`).

**Deliverable:** save at exactly `collapsing-cards/index.html`.

---

## DESIGN TOKENS (paste-verbatim CSS)

```css
html, body { height: 100%; }
body {
  height: 100vh;
  background: #0A0A0B;
  color: #FFFFFF;
  font-family: 'Inter', -apple-system, sans-serif;
  display: flex; align-items: center; justify-content: center;
  padding: 32px;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}
.cards {
  display: flex; gap: 10px;
  width: 100%; max-width: 1280px;
  height: 100%;
}
```

**Type:**
- Index label — Inter 11/500, letter-spacing 0.14em, `rgba(255,255,255,0.72)`
- Vertical wordmark — Inter 13/500, uppercase, letter-spacing 0.12em, `writing-mode: vertical-rl; transform: rotate(180deg)`
- Active title — Inter 22/500, letter-spacing `-0.015em`
- CTA — Inter 11/500, uppercase, letter-spacing 0.14em

---

## LAYOUT

- 5 `.card` elements in a flex row inside `.cards` (which itself fills the viewport).
- Default: `.card { flex: 1; min-width: 92px; border-radius: 14px; overflow: hidden; cursor: pointer; }`
- Only one has `.active` at a time.
- **`.card.active { flex: 2.6; }`** and **`.card:not(.active) { flex: 0.7; }`** — the active card gets ~4× the share of a collapsed one.
- Transition: `flex 0.75s cubic-bezier(0.2, 1, 0.3, 1)` — smooth expo-out ease.

Each card is structured:
```html
<div class="card active" data-idx="01">
  <div class="img" style="background-image: url(...);"></div>
  <div class="v-title">Aether</div>
  <div class="content">
    <div class="idx">01 / 05</div>
    <div class="meta">
      <div class="title">Aether — a study in warmth</div>
      <a class="cta" href="#">View <svg .../></a>
    </div>
  </div>
</div>
```

---

## IMAGES (locked — 5 URLs, in this order)

```
01  https://i.pinimg.com/1200x/97/86/c7/9786c75cf0594852c0097f263268f1b9.jpg
02  https://i.pinimg.com/1200x/3d/2e/90/3d2e90b8d9f0f2212c4bb0d4cb00d1ab.jpg
03  https://i.pinimg.com/1200x/a7/2c/6b/a72c6b401485df6e19218348f3fb2130.jpg
04  https://i.pinimg.com/1200x/86/d7/70/86d77085718d949e7052ecc12a0d6114.jpg
05  https://i.pinimg.com/736x/e8/89/cc/e889ccd45a9edd0642d42b53b6d597d0.jpg
```

Fill as `.img { background-size: cover; background-position: center; }` occupying `position: absolute; inset: 0`.

---

## COPY (exact — locked)

- Vertical wordmarks (collapsed): `Aether`, `Marrow`, `Kite`, `Lume`, `Halo`
- Active titles:
  - `Aether — a study in warmth`
  - `Marrow — texture and shadow`
  - `Kite — light as a whisper`
  - `Lume — a slow evening`
  - `Halo — reaching for calm`
- Index labels: `01 / 05` … `05 / 05`
- CTA text on active: `View` + up-right diagonal arrow SVG

---

## MOTION SPEC (locked)

**Card expansion**
- `flex 0.75s cubic-bezier(0.2, 1, 0.3, 1)` — the primary "collapse" transition.
- Only ONE card is `.active` at any moment.

**Image**
- Collapsed: `filter: grayscale(30%) brightness(0.75); transform: scale(1.04);`
- Active: `filter: grayscale(0%) brightness(0.92); transform: scale(1);`
- Both animate over 0.9s expo-out (transform) + 0.75s expo-out (filter).

**Gradient overlay** (`.card::after`)
- Fixed 4-stop dark gradient for text legibility, no transition:
  `linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.28) 35%, rgba(0,0,0,0.10) 60%, rgba(0,0,0,0.40) 100%)`

**Content on active**
- Horizontal title fades in 0.35s + slides up from `translateY(6px)` (delay 0.15s).
- CTA fades in same, delay 0.20s.
- Vertical wordmark opacity `1 → 0` on active (0.3s ease). Only visible when collapsed.

**Interactions**
- `mouseenter` on any card → make it active, remove from previous.
- `click` on any card → same behaviour (for touch / keyboard users).

---

## Responsive

- **≥901px** — as specced (row of 5, viewport-fit height).
- **641–900px** — same row, active title reduces to 18px.
- **≤640px** — cards stack vertically:
  - `.cards { flex-direction: column; gap: 6px; }`
  - `.card { flex: 1; min-height: 0; }`
  - `.card.active { flex: 3; }`, non-active `flex: 0.8`
  - Vertical wordmark becomes horizontal (`writing-mode: horizontal-tb; transform: none`)
  - Body padding drops to 16px, content padding to 14px

**Touch / reduced motion**
- `prefers-reduced-motion: reduce` → transition durations collapse to 0.15s.
- All interactions work with `click` fallback in addition to `mouseenter`.

---

## Deliverable checklist

- [ ] Single file at `collapsing-cards/index.html`.
- [ ] Google Fonts link for `Inter` weights 400/500/600.
- [ ] Full-viewport (`html, body { height: 100% }`, `body { height: 100vh; overflow: hidden; }`), no page scroll.
- [ ] `.cards` flex row, gap 10, max-width 1280, height 100%.
- [ ] 5 cards, 5 locked image URLs, 5 locked wordmark names + titles.
- [ ] Only one `.active` at a time; expo-out `flex 0.75s` transition.
- [ ] Collapsed: filter grayscale 30% + brightness 0.75 + scale 1.04.
- [ ] Active: filter reset + scale 1.0.
- [ ] Vertical wordmark on collapsed, horizontal title + CTA on active.
- [ ] Gradient overlay via `::after` (paste-verbatim 4-stop).
- [ ] Content padding 22 (14 on mobile), border-radius 14 on card.
- [ ] Hover AND click both switch the active card.
- [ ] Card 01 (Aether) starts active.
- [ ] `prefers-reduced-motion: reduce` collapses transitions.
- [ ] Mobile stacked layout at ≤640px with `writing-mode: horizontal-tb` fallback.

---

## REFERENCE

The complete working source lives at `collapsing-cards/index.html` in this repo. Reproduce it byte-for-byte — every flex ratio, easing curve, and copy string is tuned.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue115
