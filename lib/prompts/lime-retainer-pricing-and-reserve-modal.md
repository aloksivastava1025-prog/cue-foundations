# Lime Retainer Pricing & Reserve Modal — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** A boutique creative studio's pricing page, positioned between case studies and a contact footer, to convert warm leads into scoping calls.

---

# PROMPT — Lime Pricing + Reserve Modal (paste-ready, pixel-perfect)

Copy from `---BEGIN PROMPT---` to `---END PROMPT---`. Paste into v0 / Bolt / Cursor / Claude / ChatGPT.

---BEGIN PROMPT---

Build a **single-file `index.html`** editorial-minimal pricing component. Two tabs — **Monthly** (fixed retainer) and **Custom Project** (budget slider + requirements). Clicking `Reserve your spot` (Monthly) or `Start the project` (Custom) opens a modal that **drifts in with a slow rotate + scale entrance**, containing phone + email fields with inline validation and a success state.

**Design system** — sharp corners everywhere (0 border-radius except avatars/dot indicators), system font stack for SF/Helvetica crispness, tight `-2px` letter-spacing on display type, **lime `#d2fc68`** used sparingly (only for active tab, primary CTA, slider fill, and pulse dots — everything else monochrome). Editorial vibe: bold heading pair, muted body text, small uppercase labels.

Vanilla HTML/CSS/JS only. No framework, no build step, no libraries. Match every spec below exactly.

## Foundation

```css
:root {
  --lime: #d2fc68;
  --lime-dark: #c1eb52;
  --text-main: #111111;
  --text-muted: #555555;
  --text-soft: #777777;
  --border: #e8e8e8;
}
```

**Body:**
- Font: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` (system stack — no Google Fonts)
- `background: #ffffff`, `color: var(--text-main)`
- Antialiased text
- `display: flex; justify-content: center; align-items: flex-start; padding: 80px 40px; min-height: 100vh`
- **Never** `height: 100vh; overflow: hidden` — content must breathe and scroll naturally

## Layout

```
.main-container (max-width: 1100px, grid 360px | 1fr, gap 100px)
├── .left-col
│   ├── .header-top (tag + heading)
│   └── .left-bottom (quote + avatars + stars + trust line)
└── .right-col
    ├── .tabs (Monthly | Custom Project)
    ├── .pricing-card[data-card="monthly"]
    └── .pricing-card[data-card="custom"]
```

## Left column

**Tag** — `[OUR PRICING]` in 11px weight 600 with `letter-spacing: 1.5px`, color `#333`

**Main heading** — `Personalized<br>plans and pricing` at 52px weight 400, `line-height: 1.1`, `letter-spacing: -2px`, color `#000`

**Bottom block** (60px margin-top from heading):
- Quote (14px `#555` line-height 1.6): *"Confidence attracts confidence. From disruptive startups to global brands, our clients share one thing: they wanted bold, not safe. And we delivered"*
- **Avatars** — 4 overlapping 32px circles (`border: 2px solid #fff`, `margin-right: -12px`, last one no margin). Use Unsplash placeholder URLs.
- **Stars** — 5 lime SVG stars (14×14, `fill: var(--lime)`), 2px gap
- **Trust text** — `Trusted by clients worldwide` in 12px `#888`

## Tabs (top of right column)

```css
.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.tab.active {
  background: var(--lime);
  color: #000;
  border: 1px solid var(--lime);
}
.tab.inactive {
  background: #fff;
  color: #555;
  border: 1px solid var(--border);
}
.tab svg { width: 16px; height: 16px; stroke-width: 2; }
```

- **Monthly** — refresh/rotate SVG icon + label
- **Custom Project** — lightning/bolt SVG icon + label

Sharp corners (no border-radius). Clicking swaps the visible pricing card.

## Pricing card shell

```css
.pricing-card {
  border: 1px solid var(--border);
  padding: 48px;
  background: #ffffff;
  width: 100%;
  display: none;
  animation: cardIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.pricing-card.active { display: block; }
@keyframes cardIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Card headings:**
- `.card-title` — 26px weight 400, `letter-spacing: -0.5px`, `#000`, 16px bottom margin
- `.card-desc` — 13px `#666` line-height 1.6, 40px bottom margin, max-width 420px

## Monthly card

**Price row:**
- `.price` — 56px weight 400, `letter-spacing: -2px`, `#000` (e.g. `$3,000`)
- `.period` — 24px `#000` (e.g. `/m`)

**Action row:**
- `.btn-lime` — background `var(--lime)`, black text 14px weight 500, padding `14px 24px`, sharp corners, with arrow icon that translates `+2px, -2px` on hover
- `.spots-text` — 13px `#555`, e.g. `2 spots open for Sep '25`

**Divider** — 1px `var(--border)` with `40px 0` margin

**Features** — 2-column grid, column-gap 32px, row-gap 20px. Each item: `+` icon (16px `#000`) + text (13px line-height 1.5). Above grid: `.features-title` in 14px `#777` reading `What's included`

Full copy:
```
25 hours of design + motion time
1 project active at a time
Priority in our production queue
Flexible scope: websites, landing pages, etc.
Slack channel for direct communication
Audit + performance improvements
Roll-over hours (valid for 1 month)
Cancel, pause, or scale anytime
```

## Custom Project card

Same shell (title + desc) plus **two interactive fields** and modified action row.

### Budget slider

```html
<div class="field-block">
  <div class="field-header">
    <div class="field-label">Your budget</div>
    <div class="field-value"><span class="prefix">$</span><span id="budgetValue">12,000</span></div>
  </div>
  <input type="range" id="budgetSlider" class="budget-slider" min="5000" max="50000" step="500" value="12000">
  <div class="field-hint">
    <span>$5,000</span>
    <span id="budgetTier">Landing page or short brand system</span>
    <span>$50,000+</span>
  </div>
</div>
```

**Slider CSS:**
```css
.budget-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 3px;
  background: var(--border);        /* JS updates this to gradient */
  outline: none;
  cursor: pointer;
}
.budget-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px; height: 18px;
  background: #000;
  border: none;
  cursor: grab;
  transition: transform 0.15s ease;
}
.budget-slider:active::-webkit-slider-thumb { cursor: grabbing; transform: scale(1.15); }
.budget-slider::-moz-range-thumb {
  width: 18px; height: 18px; background: #000; border: none; cursor: grab;
}
```

**Field styling:**
- `.field-label` — 11px weight 600 uppercase, `letter-spacing: 1.5px`, `#333`
- `.field-value` — 26px weight 400 `-0.5px` letter-spacing (the live budget number)
- `.field-value .prefix` — `$` in `#999`
- `.field-hint` — 3-part row (min, dynamic tier, max) in 12px `#888`

**JS wires slider input to:**
1. Update `budgetValue` text (formatted with commas, `+` suffix at max)
2. Update `budgetTier` text (5 tier bands, see below)
3. Update slider background to `linear-gradient(to right, var(--lime) 0-X%, var(--border) X-100%)` where X = `(value - min) / (max - min) * 100`

**Tier bands:**
- ≤ $8,000 → `Landing page or short brand system`
- ≤ $15,000 → `Full website or mid-scope rebrand`
- ≤ $25,000 → `Full brand + website + motion`
- ≤ $40,000 → `Product launch with production support`
- > $40,000 → `Enterprise-scale scope`

### Chips + textarea

```html
<div class="field-block">
  <div class="field-header">
    <div class="field-label">What are you building?</div>
  </div>
  <div class="chip-row">
    <div class="chip" data-chip="Landing page">Landing page</div>
    <div class="chip" data-chip="Full website">Full website</div>
    <div class="chip" data-chip="Rebrand">Rebrand</div>
    <div class="chip" data-chip="Product UI">Product UI</div>
    <div class="chip" data-chip="Motion &amp; video">Motion &amp; video</div>
    <div class="chip" data-chip="Pitch deck">Pitch deck</div>
  </div>
  <textarea
    class="requirements-input"
    placeholder="Tell us the scope, timeline, and any references. The clearer, the sharper our first response."></textarea>
</div>
```

**Chip CSS** (multi-select toggle):
```css
.chip {
  display: inline-flex;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  background: #fff;
  border: 1px solid var(--border);
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}
.chip:hover { border-color: #999; color: #000; }
.chip.selected {
  background: #000;
  color: #fff;
  border-color: #000;
}
```

**Textarea CSS:**
```css
.requirements-input {
  width: 100%;
  background: #fff;
  border: 1px solid var(--border);
  padding: 14px 16px;
  font-size: 13px;
  line-height: 1.55;
  color: #111;
  font-family: inherit;
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s, background 0.2s;
}
.requirements-input:hover { border-color: #ccc; }
.requirements-input:focus { border-color: #000; background: #fafafa; }
```

### Action row + features (Custom)

- Primary CTA: `Start the project` (same lime button style)
- Sub-label: `6–8 week average delivery`
- 8 features (different copy from Monthly):
```
Kickoff workshop + creative territories
Dedicated art director + producer
3 concept directions, 2 revision rounds
Production-ready files + component library
Motion prototypes for hand-off
2 weeks post-launch bug support
Fixed price, no surprise invoices
50% on signing, 50% on delivery
```

## Reserve Modal (drift-in entrance)

Both CTAs open the **same modal** that captures phone + email:

```css
.reserve-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 15, 15, 0.35);
  backdrop-filter: blur(6px) saturate(1.05);
  -webkit-backdrop-filter: blur(6px) saturate(1.05);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.reserve-overlay.active { opacity: 1; pointer-events: auto; }

.reserve-modal {
  background: #fff;
  border: 1px solid var(--border);
  width: 92%;
  max-width: 440px;
  padding: 40px;
  position: relative;
  opacity: 0;
  transform: translateY(-60px) rotate(-4deg) scale(0.94);
  transition:
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.reserve-overlay.active .reserve-modal {
  opacity: 1;
  transform: translateY(0) rotate(0deg) scale(1);
  animation: driftFloat 6s ease-in-out 0.8s infinite alternate;
}

@keyframes driftFloat {
  0%   { transform: translateY(0)    rotate(0deg); }
  100% { transform: translateY(-6px) rotate(0.4deg); }
}
```

**Two-phase animation:** hard drift-in (0.7s) → then subtle 6s idle float that oscillates `-6px translateY` + `0.4deg rotate` on loop. Feels alive without being fidgety.

**Modal internals:**
- `.modal-close` — 32×32 X button top-right, `#666` → `#000` on hover with `#f5f5f5` bg
- `.modal-eyebrow` — `● 2 SPOTS · SEP '25` with pulsing lime dot (6px, box-shadow rgba(210,252,104,0.25) 3px halo, opacity 1↔0.5 on 1.8s ease-in-out loop)
- `.modal-title` — 30px weight 400 `-1px` letter-spacing, `Reserve your spot`
- `.modal-desc` — 13px `#666` line-height 1.55: `Drop your phone and email. We'll reach out within 24 hours with a scoping call.`

**Form fields** (repeat for phone + email):
```html
<div class="form-field">
  <label class="form-label" for="phone-input">Phone number</label>
  <input class="form-input" id="phone-input" type="tel" placeholder="+91  98765 43210" autocomplete="tel" required>
</div>
```

- `.form-label` — 11px weight 600 uppercase, `letter-spacing: 1px`, `#555`
- `.form-input` — sharp border `var(--border)`, `padding: 13px 14px`, `font-size: 14px`, hover `#ccc` border, focus `#000` border + `#fafafa` bg
- `.form-input.error` — `#e04040` border + `#fef8f8` bg + red 11px error text below

**Submit button** — full-width lime, same arrow icon animation on hover

**Modal footer** (20px top-margin, 20px top-padding with top-border):
- 11px `#888`: `By reserving, you agree to a short intro call. No commitment until scope is signed.`

**Success state:**
- After submit → replace form with `.success-state`:
  - 48px lime circle with black checkmark SVG
  - Title `You're on the list` (24px weight 400 `-0.5px`)
  - Text: `We'll reach out within 24 hours to schedule your scoping call.`
- Auto-close after 2.6s
- Reset form on close (delayed 500ms after fade-out)

## JS wiring

```js
// TAB SWITCH
const tabs  = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.pricing-card');
tabs.forEach(t => t.addEventListener('click', () => {
  const name = t.dataset.tab;
  tabs.forEach(x => {
    const on = x.dataset.tab === name;
    x.classList.toggle('active', on);
    x.classList.toggle('inactive', !on);
  });
  cards.forEach(c => c.classList.toggle('active', c.dataset.card === name));
}));

// BUDGET SLIDER
const slider = document.getElementById('budgetSlider');
const budgetValue = document.getElementById('budgetValue');
const budgetTier  = document.getElementById('budgetTier');

function tierLabel(n) {
  if (n <= 8000)  return 'Landing page or short brand system';
  if (n <= 15000) return 'Full website or mid-scope rebrand';
  if (n <= 25000) return 'Full brand + website + motion';
  if (n <= 40000) return 'Product launch with production support';
  return 'Enterprise-scale scope';
}

function updateSlider() {
  const val = parseInt(slider.value, 10);
  const min = parseInt(slider.min, 10);
  const max = parseInt(slider.max, 10);
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.background =
    `linear-gradient(to right, var(--lime) 0%, var(--lime) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
  budgetValue.textContent = val.toLocaleString('en-US') + (val >= 50000 ? '+' : '');
  budgetTier.textContent  = tierLabel(val);
}
slider.addEventListener('input', updateSlider);
updateSlider();

// CHIPS
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

// MODAL
const overlay = document.getElementById('reserveOverlay');
const modal   = document.getElementById('reserveModal');
const openBtn = document.getElementById('openReserveBtn');
const openBtnCustom = document.getElementById('openReserveBtnCustom');
const closeBtn = document.getElementById('closeReserveBtn');
const form   = document.getElementById('reserveForm');
const phoneInp = document.getElementById('phone-input');
const emailInp = document.getElementById('email-input');

function openModal() {
  overlay.classList.add('active');
  setTimeout(() => phoneInp.focus(), 500);
}
function closeModal() {
  overlay.classList.remove('active');
  setTimeout(() => {
    modal.classList.remove('submitted');
    form.reset();
    [phoneInp, emailInp].forEach(el => {
      el.classList.remove('error');
      const err = el.parentElement.querySelector('.form-error-text');
      if (err) err.remove();
    });
  }, 500);
}

openBtn.addEventListener('click', openModal);
if (openBtnCustom) openBtnCustom.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
});

// VALIDATION
function showError(input, msg) {
  input.classList.add('error');
  let err = input.parentElement.querySelector('.form-error-text');
  if (!err) {
    err = document.createElement('div');
    err.className = 'form-error-text';
    input.parentElement.appendChild(err);
  }
  err.textContent = msg;
}
[phoneInp, emailInp].forEach(el => el.addEventListener('input', () => {
  el.classList.remove('error');
  const err = el.parentElement.querySelector('.form-error-text');
  if (err) err.remove();
}));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;
  const digits = phoneInp.value.replace(/\D/g, '');
  if (digits.length < 7) { showError(phoneInp, 'Enter a valid phone number'); ok = false; }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(emailInp.value.trim())) { showError(emailInp, 'Enter a valid email address'); ok = false; }
  if (!ok) return;
  modal.classList.add('submitted');
  setTimeout(() => closeModal(), 2600);
});
```

## Customization knobs

| Knob | Location | Effect |
|---|---|---|
| Accent color | `--lime: #d2fc68` | Any brand accent; used for active tab, primary CTA, slider fill, indicator dots |
| Corner radius | Set to 0 everywhere | 4-6px for softer look but breaks the editorial vibe |
| Font | System stack | Swap for Neue Haas Grotesk, Inter, or a custom variable font |
| Heading size | `.main-heading { font-size: 52px }` | 40 = compact, 68 = statement |
| Letter-spacing | `-2px` on display, `-0.5px` on card titles | Tighten more for aggressive brand feel |
| Slider range | `min="5000" max="50000" step="500"` | Change to fit typical project sizes |
| Tier bands | JS `tierLabel()` thresholds | Adjust the 5 breakpoints to your service tiers |
| Chip options | 6 chips in `.chip-row` | Any project types; multi-select preserved |
| Modal entrance | `translateY(-60px) rotate(-4deg) scale(0.94)` | Bigger rotate for more character |
| Drift float | 6s ease-in-out alternate | 4s = livelier, 10s = calmer |
| Backdrop blur | `blur(6px) saturate(1.05)` | Higher blur for more focus depth |
| Grid ratio | `360px 1fr` + gap 100px | 320/1fr for less left col; 400/1fr for wider |
| Form fields | Just phone + email | Add company, timeline, source — same pattern |
| Validation logic | Digits ≥ 7, email regex | Add country code check, phone masks, etc. |

## Responsive

```css
@media (max-width: 900px) {
  body { padding: 40px 20px; }
  .main-container { grid-template-columns: 1fr; gap: 60px; }
  .left-col { height: auto; }
  .main-heading { font-size: 40px; letter-spacing: -1.5px; }
  .features-grid { grid-template-columns: 1fr; }
  .pricing-card { padding: 32px 24px; }
  .price { font-size: 44px; }
}
@media (max-width: 500px) {
  .reserve-modal { padding: 28px 22px; }
  .modal-title { font-size: 24px; }
  .price { font-size: 38px; letter-spacing: -1.5px; }
  .card-title { font-size: 22px; }
  .main-heading { font-size: 34px; }
}
```

**Touch input** — slider thumb is 18px (below 44px tap target minimum). On touch devices, enlarge thumb via `@media (pointer: coarse) { .budget-slider::-webkit-slider-thumb { width: 26px; height: 26px; } }`.

**Reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  .reserve-overlay.active .reserve-modal { animation: none; }
  .pricing-card { animation: none; }
}
```

## Deliverable checklist

- [ ] Single HTML file, system font stack (no Google Fonts), no libraries, no build step
- [ ] CSS vars: `--lime #d2fc68`, `--lime-dark`, `--text-main #111`, `--text-muted #555`, `--text-soft #777`, `--border #e8e8e8`
- [ ] Body: `min-height: 100vh; padding: 80px 40px; align-items: flex-start` — content breathes, page scrolls naturally (NO `height: 100vh; overflow: hidden`)
- [ ] `.main-container` — grid `360px 1fr`, gap 100px, max-width 1100px
- [ ] Left col: `[OUR PRICING]` tag + 52px `-2px` letter-spacing heading + quote + 4 avatars + 5 lime stars + trust text
- [ ] Tabs: 2 pill-shaped (sharp corners!) with SVG icons; active = lime bg + black text; inactive = white bg + `#555` text
- [ ] Two `.pricing-card` with `data-card="monthly|custom"`, only one active at a time
- [ ] Card swap animation: `cardIn` keyframe opacity 0→1 + translateY 6→0 on 0.4s cubic-bezier
- [ ] Monthly: title 26px + desc + $3,000/m 56px price + `Reserve your spot` lime CTA + 8-feature 2-col grid
- [ ] Custom: title + desc + budget slider + chips + textarea + `Start the project` CTA + 8-feature 2-col grid
- [ ] Budget slider: `min=5000 max=50000 step=500 value=12000`, 3px track, 18px square black thumb, lime fill up to thumb via `linear-gradient` background updated via JS on `input` event
- [ ] Live budget value display (26px weight 400) updates as slider drags, formatted with commas + `+` at max
- [ ] Dynamic tier label — 5 threshold bands map budget to scope description
- [ ] Chips: 6 options, multi-select toggle, selected state = black bg + white text
- [ ] Requirements textarea: sharp corners, resize vertical, hover/focus border darkens
- [ ] Reserve modal: fixed overlay `rgba(15,15,15,0.35)` + `backdrop-filter: blur(6px) saturate(1.05)`
- [ ] Modal entrance: `translateY(-60px) rotate(-4deg) scale(0.94)` → `0/0/1` over 0.7s cubic-bezier(0.22, 1, 0.36, 1)
- [ ] Idle drift: 6s ease-in-out alternate `translateY(-6px) rotate(0.4deg)` loop starting 0.8s after entrance
- [ ] Eyebrow with pulsing lime dot (`● 2 SPOTS · SEP '25`)
- [ ] Phone input `type="tel"` + Email input `type="email"` with sharp borders that darken on focus + `#fafafa` bg
- [ ] Inline validation: digits ≥ 7 for phone, regex for email, red border + red text on error, clears on input
- [ ] Success state: lime 48px circle with checkmark + "You're on the list" + auto-close after 2.6s
- [ ] Close options: X button, click backdrop, Esc key
- [ ] Form resets after close (500ms delay)
- [ ] Both `Reserve your spot` (Monthly) and `Start the project` (Custom) open the same modal
- [ ] Responsive: 900px stacks columns; 500px shrinks modal padding + heading sizes
- [ ] `prefers-reduced-motion` disables entrance + idle drift animations
- [ ] No console errors

---END PROMPT---

## Notes for the human

- **The lime is used sparingly** — active tab, primary CTA button, slider fill, indicator dots, success circle. Everything else is monochrome black/white/greys. That restraint is what makes lime feel expensive, not toy-like.
- **Sharp corners are the visual signature.** Every border-radius should be 0 except: avatars (50% for circle), indicator dots (50%), and any explicitly rounded shape. Buttons, cards, inputs, tabs, chips, slider thumb, modal — all sharp.
- **System font stack over Google Fonts** — the `-apple-system, BlinkMacSystemFont, "Segoe UI"` chain renders as SF Pro on Mac, Segoe on Windows, Roboto on Android. Zero network cost + native OS crispness. The design is minimal enough that font choice matters less than kerning.
- **`letter-spacing: -2px` on the 52px heading** is aggressive but essential — without it, the display type looks web-generic rather than editorial. Same for `-0.5px` on card titles and `-1px` on the budget value.
- **The drift-in modal + idle float** — first the modal enters with hard `-4deg` rotate + `-60px` drop that resolves in 0.7s. THEN a much subtler 6s float kicks in on delay (0.8s after entrance). Two-phase = intentional design, not one continuous wobble.
- **Slider background gradient trick** — `linear-gradient(to right, lime 0%, lime X%, grey X%, grey 100%)` gives the illusion of a "filled track" without needing pseudo-elements or a second element. Update the % via JS on every `input` event.
- **Chip multi-select** vs single-select — the requirements can span multiple scopes (`Landing page + Motion`), so allow multiple selection. If your service is one-thing-at-a-time, switch to single-select by clearing others in the click handler.
- **The pulsing dot on the eyebrow** — 6px lime circle with a `box-shadow 0 0 0 3px rgba(210,252,104,0.25)` outer halo, opacity oscillating 1 ↔ 0.5 on a 1.8s loop. Reused for both the modal eyebrow and the availability indicator on the pricing card.
- Rebrand recipe: swap the lime hex + heading copy + tier labels + feature lists = whole new pricing offering in 10 minutes.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue021
