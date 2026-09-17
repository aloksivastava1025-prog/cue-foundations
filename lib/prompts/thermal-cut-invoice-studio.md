# Thermal Cut Invoice Studio — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** A SaaS billing product's checkout confirmation page, replacing the static email-receipt pattern with a tactile, interactive moment.

---

# Receipt Printer · Live Invoice Studio

Build a single-page React app where a thermal printer prints a live-editable invoice, a user drags a pair of scissors across the paper to cut it off, and the cut receipt (a) drops into a tray on the right for re-download and (b) saves as a proper A4 PDF a customer would accept.

Three columns, one viewport. Editor on the left, printer in the middle, tray on the right. No vertical scroll on desktop.

Save to **`receipt-printer-app/`**.

---

## FRAMEWORK

- **Vite 4** + **React 18** + **TypeScript**
- **Tailwind CSS 3** (Play CDN or PostCSS — either works)
- **motion** (aka framer-motion successor) — for the print feed, cut retract, and tray spring
- **@phosphor-icons/react** — icons only
- **jsPDF** — programmatic A4 PDF (do NOT use html2canvas, canvas output looks bad at zoom)
- **clsx** + **tailwind-merge** — helper for className composition
- Node 16-compatible: pin Vite 4.x, tailwindcss 3.x

`package.json` deps:
```
"motion", "@phosphor-icons/react", "jspdf", "tailwindcss@3", "clsx", "tailwind-merge",
"@vitejs/plugin-react", "vite@^4"
```

---

## FILE STRUCTURE

```
receipt-printer-app/
├── components/
│   ├── ReceiptPrinter.tsx      // presentational compound: Root/Machine/Header/Screen/Status/Output/Paper
│   ├── CheckoutStatus.tsx      // consumer: editor + printer + tray + cut + PDF
│   └── TactileButton.tsx       // small styled button/link
├── helpers/
│   └── classname-helper.ts     // cn() = twMerge(clsx(...))
├── public/textures/
│   ├── plastic-noise.svg       // chassis noise overlay
│   └── receipt-paper.svg       // paper noise (pure white base, 5% neutral noise)
├── public/images/
│   └── receipt-printer-logo.png  // 24×24
├── src/
│   ├── main.tsx                // wraps in .dark scope, cream page bg
│   └── index.css               // grayscale CSS vars (light + dark), tailwind directives
├── tailwind.config.js          // color tokens reference CSS vars
└── vite.config.ts              // @/* alias to project root
```

---

## ASSETS

Two SVG textures generated in-repo, one small PNG logo.

**`public/textures/plastic-noise.svg`** (chassis grain):
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#n)"/>
</svg>
```

**`public/textures/receipt-paper.svg`** (paper grain, PURE WHITE — no cream/mauve tint):
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <filter id="p">
    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="3"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0"/>
  </filter>
  <rect width="100%" height="100%" fill="#FFFFFF"/>
  <rect width="100%" height="100%" filter="url(#p)"/>
</svg>
```

**`public/images/receipt-printer-logo.png`** — any 24×24 dark PNG (or generate a tiny valid PNG programmatically).

---

## DESIGN TOKENS — paste verbatim

`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Light scale (neutral gray, no warm tint) */
:root {
  --color-grayscale-1: #FDFDFC;
  --color-grayscale-2: #F9F9F8;
  --color-grayscale-3: #F1F0EF;
  --color-grayscale-4: #E9E8E6;
  --color-grayscale-5: #E2E1DF;
  --color-grayscale-6: #DAD9D6;
  --color-grayscale-7: #CFCECC;
  --color-grayscale-8: #BBBAB8;
  --color-grayscale-9: #8D8D89;
  --color-grayscale-10: #82827E;
  --color-grayscale-11: #63635E;
  --color-grayscale-12: #1B1B18;
  --color-green-9: #30A46C;
}

/* Dark scale — CRITICAL: --color-grayscale-12 is PURE WHITE (paper color).
   Do not use Radix mauve values here — they add a yellow tint to the paper. */
.dark {
  --color-grayscale-1:  #171717;
  --color-grayscale-2:  #1D1D1D;
  --color-grayscale-3:  #232323;
  --color-grayscale-4:  #2A2A2A;
  --color-grayscale-5:  #313131;
  --color-grayscale-6:  #3B3B3B;
  --color-grayscale-7:  #494949;
  --color-grayscale-8:  #6E6E6E;
  --color-grayscale-9:  #7B7B7B;
  --color-grayscale-10: #9E9E9E;
  --color-grayscale-11: #B4B4B4;
  --color-grayscale-12: #FFFFFF;
  --color-green-9:      #33B074;
}
```

`tailwind.config.js`:
```js
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        grayscale: {
          1: "var(--color-grayscale-1)",  2: "var(--color-grayscale-2)",
          3: "var(--color-grayscale-3)",  4: "var(--color-grayscale-4)",
          5: "var(--color-grayscale-5)",  6: "var(--color-grayscale-6)",
          7: "var(--color-grayscale-7)",  8: "var(--color-grayscale-8)",
          9: "var(--color-grayscale-9)",  10: "var(--color-grayscale-10)",
          11: "var(--color-grayscale-11)", 12: "var(--color-grayscale-12)",
        },
        green: { 9: "var(--color-green-9)" },
      },
    },
  },
};
```

**Page background** (in `main.tsx`, on the outer wrapper): `#F5F5F5` — neutral off-white, slightly darker than the white cards so they pop. Do NOT use warm cream (`#F1F0EC`) — it looks yellowish.

---

## LAYOUT

Root wrapper (`src/main.tsx`):
```jsx
<div style={{
  minHeight: "100vh",
  padding: "24px 20px",
  background: "#F5F5F5",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
}}>
  <div className="dark">   {/* scopes the printer's dark palette without darkening the page */}
    <CheckoutStatus />
  </div>
</div>
```

**Three-column grid** (`grid-cols-[300px_380px_240px]` at `lg`, single column below):
- **Col 1 · Editor** (300px) — white card, 12 form fields, live total, reprint button
- **Col 2 · Printer** (380px) — dark chassis + screen + paper output
- **Col 3 · Tray** (240px) — vertical stack of saved receipts, each row = a mini card

Card treatment (editor + tray):
- Background: `bg-white`
- Border: `border border-neutral-200/70`
- Radius: `rounded-2xl`
- Padding: `p-4`
- Shadow: `shadow-[0_1px_0_rgba(0,0,0,0.03),0_10px_30px_-15px_rgba(0,0,0,0.10)]`

---

## ReceiptPrinter — compound component API

Presentational only. Consumer drives `stage` state; the library animates.

```tsx
<ReceiptPrinter.Root stage={stage} feedMotion="stepped">
  <ReceiptPrinter.Machine>
    <ReceiptPrinter.Header>
      <Logo /> <TactileButton>Home</TactileButton>
    </ReceiptPrinter.Header>
    <ReceiptPrinter.Screen>
      {/* live plan preview + <ReceiptPrinter.Status /> */}
    </ReceiptPrinter.Screen>
  </ReceiptPrinter.Machine>
  <ReceiptPrinter.Output className="h-[28rem]">   {/* override the default h-[32rem] */}
    <ReceiptPrinter.Paper>
      {/* receipt body */}
    </ReceiptPrinter.Paper>
  </ReceiptPrinter.Output>
</ReceiptPrinter.Root>
```

**Stages:** `"processing" | "printing" | "complete"`

- Root uses `React.Context` to broadcast stage + `shouldMove` (checks `useReducedMotion`).
- Status renders a spinner (`CircleNotchIcon` with `animate-spin`) at processing/printing, morphs to green `CheckCircleIcon` at complete.
- Output paper starts translated `translateY(calc(-100% + 2px))` (hidden inside machine), animates to `translateY(0%)` over 1.75s during "printing".
- Feed motion `"stepped"` uses a 20-frame keyframe array `translateY(-91% → -81% → -70% → … → 0%)` with `linear` easing to simulate line-by-line paper advance. `"smooth"` uses `easeInOut` and no times array.
- Paper has a serrated bottom via `clipPath: polygon(…)` — 40 teeth × 4px depth, generated with an `Array.from({length:80}, …)` loop.
- Machine chassis uses layered `color-mix()` gradients on top of `bg-grayscale-4` (dark) — this REQUIRES the `--color-grayscale-*` CSS vars to exist (Tailwind 3 doesn't auto-emit them; the tokens above are the fix).

---

## CheckoutStatus — the consumer

### Invoice state
Single controlled object with every field editable:
```ts
type InvoiceData = {
  planName: string; planSubtitle: string;
  qty: number; unitPrice: number; taxPct: number; currencySymbol: string;
  orderId: string; cardLast4: string; date: string;
  customerName: string; customerEmail: string;
  companyName: string; companyEmail: string;
};
```

Defaults: `Pro plan / Annual subscription / qty 1 / £192 / 20% / ORD-2048 / Visa •••• 4242 / 11 Aug 2026 · 14:32 / Peeyush Kumar / hello@peeyush.studio / Refero Studio / billing@refero.studio`

Derived (memo'd):
```ts
subtotal = unitPrice * qty
tax = subtotal * taxPct / 100
total = subtotal + tax
```

### Editor form
2-column grid inside the white card. Every input on change updates the invoice state → receipt on the printer re-renders instantly. Input styling:
```
rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-[13px]
outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10
```

Field labels: `text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-500`.

Currency is a `<select>` with 5 options: `£ GBP · $ USD · € EUR · ₹ INR · ¥ JPY`.

Total-paid pill at the bottom of the editor:
- `rounded-lg bg-neutral-50 ring-1 ring-neutral-200/70`
- Kicker "TOTAL PAID" in muted uppercase
- Value in `font-semibold text-lg tabular-nums`
- Reprint button aligned right (white with border, `ArrowClockwiseIcon`)

### Stage cycle
Auto-runs on mount and on every reset:
- `processing` → `printing` after **1.4s**
- `printing` → `complete` after **2.0s**
- Stays at `complete` until user cuts or resets

### Thermal print reveal
While `stage === "printing"`, rows on the paper appear one at a time (7 rows total, ~**260ms** per row, first row at +60ms). Implementation: a `rowStep` state incremented via a `setTimeout` array. Each JSX row uses `style={rowFor(i)}` where:
```ts
rowFor(i) = {
  opacity: rowStep > i ? 1 : 0,
  transform: rowStep > i ? "translateY(0)" : "translateY(-4px)",
  transition: "opacity 180ms ease, transform 180ms ease",
}
```

### Chassis vibration
Global `@keyframes chassis-shake` in a `<style>` block, `0.09s linear infinite`, sub-pixel amplitude (±0.6px). CSS selector `[data-stage="printing"] > div:first-child` (the machine wrapper) triggers it automatically because ReceiptPrinter.Root already sets `data-stage={stage}` on the section. Wrap in `@media (prefers-reduced-motion: reduce) { animation: none; }`.

### Custom scissors SVG (morphs open → closed)
Inline SVG with two blades on a central pivot. Angles interpolate from 22° (open) to 2° (closed) as `cutProgress` goes 0 → 1:
```tsx
<svg viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="1.6" fill="#111" />
  <g style={{ transformOrigin: "16px 16px", transform: `rotate(${-angle}deg)` }}>
    <circle cx="7" cy="9" r="3.4" stroke="#111" fill="white" />
    <path d="M10 11 L27 20" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />
  </g>
  <g style={{ transformOrigin: "16px 16px", transform: `rotate(${angle}deg)` }}>
    <circle cx="7" cy="23" r="3.4" stroke="#111" fill="white" />
    <path d="M10 21 L27 12" stroke="#111" strokeWidth="1.8" strokeLinecap="round" />
  </g>
</svg>
```

### Drag-to-cut interaction
- Absolutely-positioned 40px-tall strip near the top of the paper (`top-[4%]`, `inset-x-6`)
- Only visible when `stage === "complete" && !isCut`
- `PointerDown / PointerMove / PointerUp` handlers with `setPointerCapture`
- `cutProgress` = `(clientX - rect.left) / rect.width`, clamped 0–1
- Visual layers stacked in the strip:
  - Dashed guide line (full width, faded 35% black) — `border-top: 2px dashed rgba(0,0,0,0.35)`
  - Solid black trail from `left: 0` to `width: cutProgress * 100%`
  - Scissors icon at `left: cutProgress * 100%`, `translateX(-50%)`, in a white circle chip
  - Hint chip below the line (only when `cutProgress === 0`): "← drag scissors across to cut →" in a black pill
- Cursor over the strip: custom SVG scissors data-URI `url("data:image/svg+xml;utf8,<svg…>✂</svg>") 8 8, ew-resize`
- On release:
  - If `cutProgress > 0.85` → snap to 1, set `isCut = true`, wait **380ms** for paper retract, add invoice snapshot to tray, save PDF, auto-increment order ID (`ORD-2048 → ORD-2049`)
  - Otherwise → reset to 0 (snap back)

### Cut animation (paper retract)
When `isCut` fires, wrap the paper in a `motion.div`:
```tsx
animate={isCut
  ? { y: 40, opacity: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.6, 1] } }
  : { y: 0, opacity: 1 }
}
```

### Tray (right column)
- Own white card matching the editor's treatment
- Newest receipt on top (reverse the array before mapping)
- Empty state: dashed border block, `FilePdfIcon` duotone at neutral-400, copy "Cut a receipt and its PDF lands here."
- Each receipt row:
  - `bg-white p-2.5 rounded-lg` with `ring-1 ring-black/5` and floating shadow
  - Left: 32×32 rounded neutral-900 chip with white `FilePdfIcon` inside
  - Right: plan name (bold) + total (right-aligned), then a muted meta row "ORD-2049 · Customer name"
  - Slight random rotation per index: `((i * 37) % 5) - 2` degrees
  - Hover: `-translate-y-0.5` + deeper shadow
  - Click → re-downloads that invoice's PDF
- Motion: each new receipt enters with `{ y: -30, rotate: rot - 4, opacity: 0 }` → `{ y: 0, rotate: rot, opacity: 1 }` via spring `stiffness 260, damping 22`
- Clear button in the header removes all

---

## PDF layout (jsPDF programmatic, A4 portrait)

**Do NOT use html2canvas.** Build every element with jsPDF text/rect APIs so the output is vector — selectable, searchable, print-perfect at any zoom.

Constants:
```
unit: "mm"
format: "a4"
margin (M): 20mm
pageW = doc.internal.pageSize.getWidth()  // 210
```

### 1. Header row (y = M+6)
- Left: company name `helvetica bold 20pt` @ (M, M+6), email `helvetica normal 11pt gray-100` @ (M, M+12)
- Right: "INVOICE" `helvetica bold 28pt` @ (pageW-M, M+6) right-aligned
- Right: "No. ORD-####" `10pt gray-120` @ (pageW-M, M+12) right-aligned
- Right: date `10pt gray-120` @ (pageW-M, M+17) right-aligned

### 2. Divider (y = M+24)
- `setDrawColor(220); setLineWidth(0.3); line(M, y, pageW-M, y)`

### 3. Billed-to / Payment (y = M+34)
- "BILLED TO" and "PAYMENT" kickers at `9pt gray-140`, left and right
- Below each: customer name / "Visa •••• 4242" in `bold 11pt gray-20`
- Below that: email / "Paid in full" in `normal 10pt gray-90`

### 4. Line-items table (y = M+58)
- Header bar: `fillColor(245)`, `rect(M, y, pageW-M*2, 9, "F")`, columns at DESCRIPTION / QTY / PRICE / AMOUNT (bold 9pt gray-90)
- Row at y+15: plan name bold 11pt, subtitle 9pt gray-120 below, qty/price/amount right-aligned tabular

### 5. Totals block (right-aligned)
- Subtotal · Tax (X%) · **TOTAL PAID** stacked
- Divider line above and below the total-paid row
- Total-paid: bold 13pt

### 6. Footer (y = 260)
- Thin divider
- Left: "Thank you for your business." `9pt gray-140`
- Right: "Order ORD-#### · Generated <date>" `9pt gray-140`

Filename: `invoice-${orderId}.pdf`

---

## ANIMATION TIMINGS

| Where | Property | Duration | Ease |
|---|---|---|---|
| Processing → Printing | stage transition | **1.4s** delay | — |
| Printing → Complete | stage transition | **2.0s** delay | — |
| Paper feed (stepped) | translateY through 20 keyframes | **1.75s** | linear |
| Row reveal | opacity + translateY(-4→0) | **0.18s** per row, staggered **0.26s** | ease |
| Status icon swap | opacity + scale(0.94→1) | **0.16s** | `[0.23, 1, 0.32, 1]` |
| Chassis vibration | translate ±0.6px | **0.09s** loop | linear |
| Cut trail draw | width 0 → 100% | matches drag (real-time) | — |
| Paper retract on cut | y 0→40 + opacity 1→0 | **0.45s** | `[0.4, 0, 0.6, 1]` |
| Tray receipt entry | y -30→0 + rotate + opacity | spring | `stiffness 260, damping 22` |
| Tray hover lift | translateY -0.5 | **0.15s** | ease |
| Button press | translateY +1px on `:active` | **instant** | — |

---

## EXACT COPY

- App section kickers: **INVOICE EDITOR**, **SAVED INVOICES** (all-caps, letter-spacing 0.2em, 9-10pt)
- Editor headline: **Type. Print. Cut.**
- Editor "Live" pill: green dot + "Live"
- Editor Reprint button: **Reprint**
- Printer screen: shows plan name (bold 14px) · subtitle (muted 12px) · "TOTAL" kicker · total value
- Status labels (from ReceiptPrinter): `"Processing your order"` · `"Printing your receipt"` · `"Order complete"`
- Cut hint chip: **← drag scissors across to cut →**
- Tray empty state: **Cut a receipt and its PDF lands here.**
- Receipt paper body (top → bottom):
  1. Center: Logo mark
  2. Dashed divider
  3. `PRO PLAN` (bold uppercase, letter-spacing 0.15em) with `Annual subscription` subtitle · right-aligned price
  4. Dashed divider
  5. Subtotal / Tax (X%) / **TOTAL PAID** (bold, with divider above)
  6. Dashed divider
  7. Order / Paid with / Date meta grid (2-col, 11pt)
  8. Barcode: 28 vertical bars (widths from a fixed pattern), then `ORD 2048` label centered

---

## Responsive

- **Desktop (≥ 1024px):** 3-col grid `[300px 380px 240px]`, all visible in one viewport, no scroll. Total width ~1000px + gaps.
- **Tablet (768–1023px):** Stack to 2 rows — editor + printer side-by-side on top (grid-cols-[300px_1fr]), tray below full-width in a horizontal row of receipt chips.
- **Mobile (< 768px):** Single column. Editor collapses to `grid-cols-1` inside its card. Printer max-w-sm centered. Tray full-width below with smaller chip rows.
- **Touch:** All hover effects have `active:` fallbacks. The drag-to-cut strip uses PointerEvents so it works with fingers. On touch: increase strip height to 48px and enlarge scissors chip to 28px for easier hit target.
- **Perf:** All SVG textures are ≤500 bytes each. `html2canvas` is deliberately NOT used — jsPDF text APIs generate PDFs in <50ms with no rasterization. Motion primitives use `AnimatePresence mode="sync"` to keep DOM stable.
- **Motion-safe:** The `.printer-shaking` selector wraps in `@media (prefers-reduced-motion: reduce) { animation: none }`. ReceiptPrinter's `shouldMove` respects `useReducedMotion()`. Row-reveal step still fires but with 0-duration transitions.

---

## Deliverable checklist

- [ ] Vite + React + TS + Tailwind 3 scaffolded, deps installed exactly per FRAMEWORK
- [ ] `src/index.css` has BOTH light + dark grayscale scales; dark's `--color-grayscale-12` is `#FFFFFF`
- [ ] `tailwind.config.js` maps every `grayscale-N` to its CSS var (no hardcoded hex)
- [ ] `receipt-paper.svg` has `fill="#FFFFFF"` (not `#FBFAF6`) — paper must read pure white
- [ ] Page bg is `#F5F5F5` (neutral off-white), NOT `#F1F0EC` (yellow-tinted)
- [ ] Editor card, tray card, all use `bg-white` — no cream/mauve tints anywhere
- [ ] `ReceiptPrinter.Output` gets `className="h-[28rem]"` to fit viewport
- [ ] Three columns visible in one viewport at 1200px width, no vertical scroll
- [ ] Auto-cycle on mount: processing (1.4s) → printing (2.0s) → complete
- [ ] Thermal reveal: 7 rows appear at ~260ms intervals during "printing"
- [ ] Chassis shakes ±0.6px at 0.09s while printing, stops on complete
- [ ] Scissors SVG morphs open (22°) → closed (2°) with cutProgress
- [ ] Cut requires drag ≥ 85% of track width to fire
- [ ] Paper retracts with `y: 40, opacity: 0` over 0.45s on cut
- [ ] Cut invoice enters tray with spring `260/22`, slight random rotation
- [ ] Order ID auto-increments after each cut
- [ ] jsPDF builds A4 invoice: header · billed-to/payment · line-items · totals · footer — every text via `doc.text()`, no html2canvas
- [ ] PDF filename: `invoice-<orderId>.pdf`
- [ ] Every field in the editor updates the on-screen receipt AND the next PDF
- [ ] Clicking any tray receipt re-downloads its PDF
- [ ] Responsive: 3-col desktop → 2-row tablet → 1-col mobile
- [ ] `prefers-reduced-motion` disables shake + snaps row-reveal to instant

---

**Awwwards-tier version →** https://cuedesign.space/component/cue041
