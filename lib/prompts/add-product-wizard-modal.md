# Add Product Wizard Modal — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Fits admin dashboards for e-commerce or marketplace platforms where merchants need a guided, low-friction flow to list a new product.

---

# Add Product Modal — 4-Step Wizard with Draft, Upload, Publish

## Framework & Integration
- Add this modal to your existing dashboard (React + Vite / Next.js). Do NOT create a new HTML file. Import as `<AddProductModal open={...} onClose={...} onPublish={payload => ...} />` and mount from a Projects page / global "New Product" CTA.
- Modal owns its own state; parent only cares about `open`, `onClose`, `onPublish(payload)`.
- Persists in-progress drafts to `localStorage['mantra.addProduct.draft']`. Auto-restores on open.
- Publish resolves via `onPublish(payload)` — parent decides where the record goes (API, mock, Zustand store, etc.).

## ASSETS
No image assets. All icons are inline SVG:
- Brand bag icon (header): 20×20, stroke 2, rounded
- Close (×): 16×16
- Upload cloud/image: 28×28 inside drop zone
- Success check: 28×28 stroke 2.5
- Toast tick: ✓ character

Font — Inter (400/500/600/700) from Google Fonts:
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap
```

## DESIGN TOKENS (paste verbatim into CSS variables)
```css
:root {
  --page-bg: #e6e6e6;
  --card-bg: #ffffff;
  --border: #ececf1;
  --border-strong: #dedee5;
  --divider: #f2f2f5;
  --text: #0f1114;
  --muted: #7a7d85;
  --brand-50: #eaf0ff;
  --brand-500: #3358df;   /* primary blue */
  --brand-600: #2949c2;   /* hover */
  --green-bg: #dcf7e3;
  --green-fg: #16a34a;
  --red: #ef4444;
  --chip-bg: #efefef;
}
```

## VIEWPORT LOCK
- Body: `height:100vh; width:100vw; overflow:hidden; display:flex; align-items:center; justify-content:center; padding:20px`
- Modal: `max-width: 480px; max-height: calc(100vh - 40px); display:flex; flex-direction:column`
- Only the inner `#panels` region scrolls if the current step overflows — never the body or the modal itself.
- Custom thin scrollbar: 6px thumb, `var(--border-strong)`.

## LAYOUT

### Modal shell
- `border-radius: 18px`, drop shadow `0 24px 60px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)`
- Decorative top grid pattern:
  ```css
  .modal::before {
    content:''; position:absolute; inset:0 0 auto 0; height:140px;
    background-image:
      linear-gradient(to right, var(--divider) 1px, transparent 1px),
      linear-gradient(to bottom, var(--divider) 1px, transparent 1px);
    background-size: 20px 20px;
    mask-image: linear-gradient(to bottom, #000 0%, transparent 100%);
    pointer-events: none;
  }
  ```
- Inner padding: `20px 24px 22px` (extra bottom breathing room for the footer buttons)

### Header (fixed)
- `.brand-mark`: 40×40, `border-radius: 11px`, gradient `180deg, var(--brand-500) 0%, var(--brand-600) 100%`, shadow `0 4px 12px rgba(51,88,223,0.35), inset 0 -1px 0 rgba(0,0,0,0.1)`. Inline shopping-bag SVG in white, stroke 2.
- Title: `Add Product` — 17px / 600 / letter-spacing -0.3px
- Subtitle: `Add a new product to your store.` — 12.5px / muted
- Close button: 30×30, radius 8, hover bg = `var(--divider)`. Positioned top-right.

### Stepper pill (fixed)
- Background: `var(--chip-bg)`, radius 12, 5px inner padding, 4px gap between steps
- Each step: `flex:1`, 7px vertical padding, radius 8, 11.5px font, 500 weight
- Numeric circle: 18×18, radius 50%, 9px bold text, tabular-nums
- States:
  - **inactive**: circle bg `var(--border-strong)`, white text; label muted
  - **active**: pill bg white, `box-shadow: 0 1px 3px rgba(0,0,0,0.06)`; circle bg brand-500
  - **done**: label color brand-600; circle bg `var(--green-fg)` with `✓` glyph (number hidden)
- Steps in order: `1 General`, `2 Pricing`, `3 Files`, `4 Settings`
- Click any past step → jumps back freely. Click a forward step → attempts to advance (validates current first).

### Panels container
- `flex: 1; min-height: 0; overflow-y: auto; margin: 0 -6px; padding: 0 6px`
- Each panel enters with `panelFadeIn 0.25s ease` (`opacity 0→1, translateY 4px→0`)
- Only ONE panel visible at a time (`display: none` on others)

### Form panel (inside each step)
- `border: 1px solid var(--border); border-radius: 12px; padding: 14px; margin-bottom: 10px`
- Fields stack with 12px `margin-bottom` on `.form-group`
- Labels: 12px / 600 / dark text; required asterisk `.req` in `var(--red)`
- Inputs / selects / textareas:
  - Padding 9px 11px, radius 8, border `1px solid var(--border-strong)`, font 13px
  - Focus: `border-color: var(--brand-500); box-shadow: 0 0 0 3px rgba(51,88,223,0.18)`
  - Error: red border + same-size red halo `rgba(239,68,68,0.15)`
- `.help-text`: 11px / muted, `margin-top: 5px`

### Bottom help line
- Below form panel, above footer: 11px / muted, line-height 1.4. Copy per step:
  - 1: `Set the basics that appear on the product page and search results.`
  - 2: `Buyers see the base price; compare-at renders next to it as strikethrough.`
  - 3: `Add up to 10 images. Used in checkout, email and social sharing. {n}/10 selected.`
  - 4: `These settings can be changed later from the product's settings tab.`

### Footer
- `display: flex; gap: 8px; margin-top: 12px; padding-top: 4px; flex-shrink: 0`
- Buttons:
  - `.btn-back` (only when step > 1): transparent bg, muted text, hover bg `var(--divider)`, label `← Back`
  - `.btn-draft`: bg `var(--chip-bg)`, dark text, hover bg `var(--border-strong)`, label `Save as draft`
  - `.btn-primary`: bg `var(--brand-500)`, white text, `flex: 1`, hover bg `var(--brand-600)`. Label `Next step →` on steps 1–3, `Publish product` on step 4.
  - All buttons: `padding: 10px 16px; border-radius: 9px; font-size: 12.5px; font-weight: 600`

## STEP DETAILS

### Step 1 — General
- **Name** (required, text) — placeholder `e.g. Universal Design System`
- **Description** (textarea, non-resizable, min-height 56, line-height 1.4) — placeholder `Powerful Figma Design System for creating landing pages, websites and dashboards.`
- **Category** (select) — options: `Design System`, `Template`, `Icons`, `Illustrations`, `Font`, `Other`
- Validation: Name required. Empty → red border + focus + toast `Name is required`.

### Step 2 — Pricing
- Row of 2 columns (`grid-template-columns: 1fr 1fr; gap: 12px`):
  - **Price** (required, number, min 0, step 0.01) — placeholder `49.00`
  - **Compare-at** (optional, number) — placeholder `79.00`
  - Both inputs have a `$` prefix positioned absolutely at `left: 11px; top: 50%; transform: translateY(-50%)`, color muted; input padding-left `24px`.
- **Currency** (select, full width below) — `USD`, `EUR`, `GBP`, `INR`, `JPY`
- Validation: Price > 0 required.

### Step 3 — Files
- Label: `Product images`
- **Drop zone**:
  - Border `1.5px dashed var(--border-strong)`, radius 10, padding `20px 14px`
  - Background `#fafafb`
  - Column-stack, gap 8px: cloud/image SVG (brand-500) → text `Drop your images here, or` (12px muted) → `.dd-btn Click to browse` (white, border-strong, radius 7)
  - Drag hover: border becomes `var(--brand-500)`, bg becomes `var(--brand-50)`
- **Preview grid** below drop zone:
  - `grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 8px`
  - Tiles are 1:1 with `background-image` from data URL
  - Remove button in top-right corner: 18×18 circle, `rgba(0,0,0,0.6)` bg, white `×`
- Cap: 10 images. Beyond that, toast `Max 10 images` and reject.

### Step 4 — Settings
- Each row: label + description on left, iOS-style toggle on right, separated by 1px `var(--divider)` line (no line on first).
- Rows:
  - `Publish immediately` — `Product is visible in the storefront on save.` — default ON
  - `Allow guest checkout` — `Buyers can purchase without an account.` — default ON
  - `Track inventory` — `Deduct stock automatically on purchase.` — default OFF
  - `Send launch email` — `Notify subscribers when this product goes live.` — default OFF
- Toggle: 34×20 pill, radius 999. OFF bg `var(--border-strong)`. ON bg `var(--brand-500)`. Knob 16×16 white with subtle shadow, translateX 14px when ON.

### Success screen (after Publish)
- Green circle icon 56×56 (bg `var(--green-bg)`, stroke `var(--green-fg)`), scale-pop animation `0.4s cubic-bezier(0.16, 1, 0.3, 1)`
- Title `Product added` — 18px / 600
- Description `Your product is live on the store.` — 12.5px / muted
- Summary panel: `padding: 14px; background: var(--divider); border-radius: 10px`. Renders as `<dl>` with 4 rows: Name / Price (formatted `USD 49.00` with optional strikethrough compare-at) / Images (`N attached`) / Published (`Yes, live now` or `Draft only`).
- Footer replaces its buttons with `Add another` (draft-style) + `View product →` (primary).

## BEHAVIOR
- **Draft**: On `Save as draft` click, serialize `state.data` to localStorage. Show toast `Draft saved`. On open, if a draft exists, hydrate form and show toast `Draft restored`.
- **Publish**: Disable primary button, label `Publishing…`, wait 900ms (simulated network), clear draft from storage, switch to success panel, swap footer.
- **Close**: `confirm('Discard this product?')`. On confirm, clear draft and reload / close.
- **Toast**: Fixed at `bottom: 24px; left: 50%; translateX(-50%)`. Bg `#0f1114`, white text, radius 10. Auto-hides after 1800ms. Tick color = green (success) or red `!` (error).

## Responsive
- Breakpoints:
  - `<= 520px`: modal `max-width: 100%`, inner padding `18px 18px 20px`, header title 16px, stepper labels hide (only numbers visible)
  - `<= 380px`: pricing row-2 becomes single column
- Touch: increase `.step` and toggle hit-area padding to 44×44 min
- Mobile perf: no shadows on drop-zone tiles; disable panel fadeIn on `prefers-reduced-motion: reduce`

## Deliverable Checklist
1. Locked-viewport layout, no body scroll, only inner panels can scroll
2. Blue brand palette (`#3358df` / `#2949c2`) with matching focus halo
3. Grid-pattern header background masked to fade
4. Header: brand mark + title + subtitle + close (30×30 hover pill)
5. 4-step stepper: inactive / active (white pill) / done (green ✓) states
6. Step 1: Name (required, red-halo on error) + Description + Category
7. Step 2: Price (required, `$` prefix) + Compare-at + Currency (full width)
8. Step 3: Drag-drop OR click-browse upload, live preview grid, per-tile remove, 10-cap toast
9. Step 4: 4 toggle rows with iOS-style pill toggles + description subtext
10. Save-as-draft persists to localStorage, restore-on-open with toast
11. Publish → 900ms loading → animated success screen → summary dl
12. Success screen swaps footer to `Add another` + `View product →`
13. Close × triggers `Discard this product?` confirm
14. Panel fade-in on step change (`opacity 0→1, translateY 4px→0, 0.25s ease`)
15. Toast bottom-center, dark background, tick color per state, 1800ms auto-hide
16. Field validation: red border + focus + toast; clears on first keystroke
17. Backward step click always works; forward step click validates current first
18. Bottom-help line changes per step, image count updates live
19. Inter font 400/500/600/700 loaded from Google Fonts
20. Responsive breakpoints at 520/380px + reduced-motion fallback

---

**Awwwards-tier version →** https://cuedesign.space/component/cue064
