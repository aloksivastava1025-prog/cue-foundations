# MotionFlow Feature Grid Showcase — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal as a features section on a product launch or SaaS marketing site that wants to show its interface in motion rather than static screenshots.

---

# MotionFlow Features — 3-Card Grid with Split-Line Reveal + Live Mockups

A hero-scale features section: split-headline "mask-up" reveal on the title, staggered fade-up on the description + CTA + 3 cards, and each card houses a **live UI mockup** (progress bar counting to 60%, CRM stat card with bar chart, campaign event stack). Layout is a two-column header + 3-column card grid, all in one 1240px container.

---

## 0. WHAT YOU'RE BUILDING

**Header (two columns, `flex 1.2 : 1`):**
- Left: two-line 46px title in weight 500, `-0.04em` tracking — animated by splitting each line into a **masked overlay** that translates from `translateY(120%) rotate(2deg)` → `0/0` on a 1.4s slow ease
- Right: 380px column with 13px description + black pill CTA "Start creating" — both fade-up 30px with a stagger

**Grid (3 equal columns, 24px gap):** three `feature-card`s. Each card:
- 440px tall, `#F7F7F9` bg, 24px radius, 24/32px padding
- **Header** (label uppercase + 20px title) → **Visual area** (unique per card) → **Footer** (2 check-items with black tick icons)

**Card 1 — Render Engine**
- A **background blurred mockup** ("Everyday cinematic magic" panel, 60% opacity, 2px blur, scale 0.95)
- A **foreground progress pill** (white card, `width: 110%` — overhangs the card on both sides) with a purple gradient bar that fills from 0→60% over 1.5s (delayed 1.2s), a pulsing white thumb (endless expanding blue-glow ring), and 4 grey dots on the right of the track
- A JS counter animates the `0%` label up to `60%` in sync with the bar

**Card 2 — Asset Manager**
- 3 small "social pills" at top (Blender / Cinema4D / Maya, 11px, white bg with soft shadow)
- Big CRM stat card below: avatar + `@creative_pro`, "120 nodes active" sub, then a 32px `12.4s` render-time value on the left and a 4-bar bar-chart on the right (bar 2 active purple)

**Card 3 — Timelines**
- Three stacked event pills (`Queue started · frame cache · 2m ago` / big purple `321.46k Frames rendered` / `Queue finished · Final output · 1m ago`)
- Pills 1 and 3 are offset `translateX(-10% / +10%)` — creates the "layered feed" look

---

## 1. DESIGN TOKENS

```
Colors
  page bg            #FFFFFF
  title              #111111
  desc               #555555
  card bg            #F7F7F9
  card label         #888888  (uppercase 11px, 0.05em)
  card title         #111111
  check tick         #111111
  check text         #444444

  progress track     #F0F0F5
  progress fill      linear-gradient(90deg, #6953ED, #917BF5)
  progress shadow    0 6px 16px rgba(105,83,237,0.4)
  thumb ring pulse   rgba(145,123,245,0.4) → 0
  dots               #D1D1D6

  s-pill bg          #FFFFFF, shadow 0 4px 12px rgba(0,0,0,0.03)
  crm card shadow    0 16px 40px rgba(0,0,0,0.06)
  bar idle           #E6E8FC
  bar active         #7362F3

  camp pill white    #FFFFFF, shadow 0 12px 24px rgba(0,0,0,0.05)
  camp icon orange   bg #FFEBD6 / stroke #F97316
  camp icon green    bg #DCFCE7 / stroke #22C55E
  camp time          #AAAAAA

  purple pill        bg #7362F3 / text #FFFFFF / shadow 0 12px 24px rgba(115,98,243,0.2)
  cta                bg #000000 → #222222 hover, radius 30

Type
  font-family        'Inter', sans-serif  (400/500/600/700)
  header title       46 / 500 / lh 1.1 / letter-spacing -0.04em / #111
  header desc        13 / 400 / lh 1.5 / #555
  cta                14 / 500
  card label         11 / 600 / uppercase / 0.05em / #888
  card title         20 / 600 / lh 1.3 / -0.02em / #111
  check item         13 / 400 / #444
  progress info      13 / 500
  s-pill             11 / 500
  crm username       13 / 500
  rate value         32 / 600 / -0.03em / lh 1 / mb 4
  rate label         11 / #888

Sizes
  container          max-width 1240, padding 24
  header gap         40 (below + between cols)
  grid gap           24
  card               440 tall, 24 radius, 24/24/32/24 padding
  card header mb     20
  card label mb      12
  footer gap         12
  check icon         14×14, stroke 2.5
  progress pill      width 110% (overhangs), 20/24 padding, 16 radius
  progress track     height 16, 8 radius
  progress fill      height 100%, 8 radius, 60% end width
  thumb              10×10 round, right 3, translateY -50%
  dots               4×4 round, 4px gap, right 12
  crm card           full-width, 24 padding, 16 radius
  s-pill             padding 6/10, radius 20
  crm avatar         28×28 round
  bar-chart          height 48, bar 16 wide, 8 radius
  camp pill          padding 12/16, radius 12, width 90%
  camp icon          32×32, 8 radius
  purple pill        padding 14/16, gap 8
  cta                padding 12/24, radius 30

Motion
  maskUp (title)     1.4s cubic-bezier(0.16, 1, 0.3, 1), per-line delay 0.15s stagger
  fadeUp (rest)     1.2s cubic-bezier(0.22, 1, 0.36, 1) — desc 0.3s, cta 0.4s, cards 0.5/0.6/0.7s
  fillBar            1.5s cubic-bezier(0.22, 1, 0.36, 1), delay 1.2s, 0% → 60%
  pulseGlow          1.5s infinite, thumb ring expands 0→8px then fades
  cta hover          transform translateY(-1px), 0.2s
```

---

## 2. THE SPLIT-LINE HEADLINE REVEAL

Awwwards signature. Each `<br>`-separated line becomes:

```html
<div class="line-wrapper">          <!-- overflow: hidden clip mask -->
  <div class="line-text">One line</div>   <!-- translates up from below -->
</div>
```

CSS:
```css
.line-wrapper {
  overflow: hidden;
  display: inline-block;
  width: 100%;
  padding-bottom: 5px;       /* prevents descender clipping (g, y, p) */
  margin-bottom: -5px;       /* cancels the extra padding visually */
}
.line-text {
  transform: translateY(120%);
  opacity: 0;
  animation: maskUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes maskUp {
  0%   { transform: translateY(120%) rotate(2deg); opacity: 0; transform-origin: left bottom; }
  100% { transform: translateY(0)    rotate(0);    opacity: 1; transform-origin: left bottom; }
}
```

The `rotate(2deg)` at start is what makes it feel physical — the text isn't just sliding straight up, it's **rocking into place from the left corner** like a physical panel. The `padding-bottom + margin-bottom` compensation is critical — without it descenders like `g` in "stunning" get truncated.

Per-line stagger is set at runtime:
```js
lines.forEach((line, i) => {
  const t = /* .line-text */;
  t.style.animationDelay = `${i * 0.15}s`;
});
```

---

## 3. FADE-UP STAGGER (DESC + CTA + CARDS)

Everything else uses one keyframe with per-element delays:

```css
@keyframes fadeUp {
  0%   { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0);    opacity: 1; }
}
.header-desc, .btn-primary, .feature-card {
  opacity: 0;
  animation: fadeUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.header-desc                    { animation-delay: 0.3s; }
.btn-primary                    { animation-delay: 0.4s; }
.feature-card:nth-child(1)      { animation-delay: 0.5s; }
.feature-card:nth-child(2)      { animation-delay: 0.6s; }
.feature-card:nth-child(3)      { animation-delay: 0.7s; }
```

Cards arrive **after** the title finishes (title finishes ≈ 1.55s: delay 0.15 + duration 1.4). Cards at 0.5/0.6/0.7s begin overlapping the title's tail — so the sequence reads as **one continuous entrance**, not "title, pause, then cards".

---

## 4. CARD 1 — THE PROGRESS PILL (THE SHOWPIECE)

Two elements stacked in the visual area:

```html
<div class="c1-bg-mock">          <!-- blurred background context -->
  <div class="mock-title">Everyday cinematic magic</div>
  <div class="mock-desc">Effortless, sharp, and made for high-res</div>
  <div class="mock-boxes">
    <div class="mock-box" style="background:#E8DFD5"></div>
    <div class="mock-box" style="background:#E0DBD5"></div>
  </div>
</div>

<div class="progress-pill">        <!-- foreground focus element -->
  <div class="progress-info">
    <span>Rendering your scene</span>
    <span class="progress-percent">0%</span>
  </div>
  <div class="progress-track">
    <div class="progress-fill"><div class="progress-thumb"></div></div>
    <div class="progress-dots"><div></div><div></div><div></div><div></div></div>
  </div>
</div>
```

**Background mock**: `position: absolute; top: 15%`, 200×200, `opacity: 0.6`, `filter: blur(2px)`, `transform: scale(0.95)`. The blur + opacity turn this into a **visual echo** — it looks like "the thing being rendered" behind the progress bar.

**Progress pill**: `width: 110%` — overhangs 5% on each side of the card. This is what makes it feel like a **floating chip pulled forward from the card surface**. `z-index: 3` sits above the mock.

**Fill animation**:
```css
@keyframes fillBar { 0% { width: 0%; } 100% { width: 60%; } }
.progress-fill {
  background: linear-gradient(90deg, #6953ED, #917BF5);
  box-shadow: 0 6px 16px rgba(105, 83, 237, 0.4);   /* the purple glow underneath */
  animation: fillBar 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 1.2s;
}
```

**Thumb pulse**:
```css
@keyframes pulseGlow {
  0%   { box-shadow: 0 0 0 0 rgba(145,123,245,0.4); }
  100% { box-shadow: 0 0 0 8px rgba(145,123,245,0); }
}
.progress-thumb { animation: pulseGlow 1.5s infinite; }
```

The thumb sits at `right: 3px` inside `.progress-fill` — it rides on the growing edge of the bar.

**JS counter** synced with the fill (1200ms delay + 1500ms duration):
```js
setTimeout(() => {
  const el = document.querySelector('.progress-percent');
  let cur = 0, target = 60, dur = 1500, fps = 60;
  const step = target / (dur / (1000 / fps));
  const tick = () => {
    cur += step;
    if (cur >= target) el.innerText = target + '%';
    else { el.innerText = Math.floor(cur) + '%'; requestAnimationFrame(tick); }
  };
  requestAnimationFrame(tick);
}, 1200);
```

The counter ties the abstract bar length to a concrete number — that's the interaction detail that sells the "engine actually working" feel.

---

## 5. CARD 2 — SOCIAL PILLS + CRM STAT CARD

**Top row**: 3 white pill chips (Blender / Cinema4D / Maya) — each `s-pill` is `6px 10px` padding, radius 20, small SVG at 12×12, soft drop shadow.

**Below**: full-width white CRM card:
- **Header**: avatar (28×28 Unsplash portrait) + `@creative_pro` username on the left, 3 grey dots menu on the right
- **Sub**: 13×13 lightning-bolt icon + "120 nodes active" in 11px `#888`, `padding-left: 38px` to align under the username (matches avatar + gap), `margin-top: -16px` to pull it up tight
- **Stats row** (`justify-content: space-between; align-items: flex-end`):
  - Left: `32/600 -0.03em` "**12.4s**" + `11/#888` "render time"
  - Right: 4-bar chart, `height: 48`, bars 16 wide, radii 8, one active in purple `#7362F3`, others `#E6E8FC`. Heights: 40/100/60/45%

---

## 6. CARD 3 — STAGGERED CAMPAIGN PILLS

Three pills stacked vertically, `align-items: center`, `gap: 12px`:

1. **Top pill (offset left −10%)** — white bg, orange chip icon, "Queue started · Frame cache · 2m ago"
2. **Middle pill (purple, centered)** — `#7362F3` fill, white text, "**321.46k** Frames rendered" (13/600 value + 13/rgba(255,255,255,0.8) label)
3. **Bottom pill (offset right +10%)** — white bg, green chip icon, "Queue finished · Final output · 1m ago", width 85%

The offset trick is what makes them feel like **cards falling into a live feed** instead of a static list. Purple pill is the "notification highlight" — natural focal point in the middle.

Icon chips:
```css
.camp-icon.orange { background: #FFEBD6; color: #F97316; }
.camp-icon.green  { background: #DCFCE7; color: #22C55E; }
```
Both use the "resize handle" SVG (two triangles pointing outward) — reads as "in/out throughput".

---

## 7. FOOTER CHECKLIST (SHARED ACROSS CARDS)

```css
.card-footer {
  margin-top: auto;              /* pushes to bottom of flex column */
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.check-item {
  display: flex;
  align-items: flex-start;       /* icon aligns with first text line */
  gap: 12px;
  font-size: 13px;
  color: #444;
  line-height: 1.4;
}
.check-item svg {
  width: 14px; height: 14px;
  stroke: #111;                  /* jet-black tick */
  margin-top: 2px;               /* optical alignment with cap-height */
  flex-shrink: 0;
  stroke-width: 2.5;             /* heavier stroke reads punchier at 14px */
}
```

The 2.5 stroke on the checkmark is the detail that keeps it from feeling anaemic at that size.

---

## 8. RESPONSIVE

- **Desktop (≥ 1024px):** as specified, 3-column grid, `flex 1.2 : 1` header.
- **Tablet (768–1023px):** grid → 2 columns, header stacks. Third card wraps to full width row 2. Card min-height auto.
- **Mobile (< 768px):**
  - Header column stack, title 32px, `letter-spacing -0.02em`
  - Grid single column, cards 380px tall (progress pill `width: 100%`, no overhang)
  - Camp pills lose `offset-left/right` translateX (set to 0), so they read as clean stacked cards
  - Font sizes shrink: card title 18, check 12
- **Touch:** no hover-dependent behavior in the visuals — everything runs on load. CTA `:hover` transform gracefully doesn't fire on touch.
- **Motion-safe:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    .line-text, .header-desc, .btn-primary, .feature-card { animation: none !important; opacity: 1 !important; transform: none !important; }
    .progress-fill { animation: none !important; width: 60% !important; }
    .progress-thumb { animation: none !important; }
  }
  ```
  Progress counter should also skip to `60%` immediately (add a `matchMedia` check in the JS).

---

## Deliverable

- `.features-section` 1240 max, 24 padding
- Two-column header: 46/500/-0.04em title (split-line masked reveal, per-line 0.15s stagger) + right column with 13px desc + black pill CTA
- 3-column grid, 24 gap, cards 440 tall, `#F7F7F9` bg, 24 radius, `overflow: hidden`
- Each card: `.card-header` (11/600 uppercase label + 20/600 title) → `.card-visual` (unique) → `.card-footer` (check-items)
- Card 1: blurred `.c1-bg-mock` + foreground `.progress-pill` at `width: 110%` with fill 0→60% (1.5s @ 1.2s delay), pulsing thumb (1.5s infinite), JS counter synced
- Card 2: 3 `.s-pill` chips + full-width `.crm-card` with avatar/username, activity sub, 32/600 rate value, 4-bar chart with one purple active bar
- Card 3: 3 stacked `.camp-pill`s with translateX offsets (−10 / 0 / +10), purple center pill for the KPI, event pills top+bottom
- Two `@keyframes`: `maskUp` (title lines) + `fadeUp` (everything else) + `fillBar` (progress) + `pulseGlow` (thumb)
- Stagger delays: desc 0.3s, CTA 0.4s, cards 0.5/0.6/0.7s
- JS: split `<br>`-separated title lines into `.line-wrapper` + `.line-text` with 0.15s per-line delay; `requestAnimationFrame` counter for the `%` label at 1200ms
- Only external dep: Google Font Inter (400/500/600/700). Card 2 avatar is an Unsplash portrait URL — swap for a real avatar in prod.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue187
