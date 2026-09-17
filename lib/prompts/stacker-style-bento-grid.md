# Stacker Style Bento Grid — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for a B2B SaaS product page showcasing multiple platform features with restrained, editorial motion instead of generic icon grids.

---

# Features Bento Grid — Stacker Style

Full-reference pixel-perfect spec. Any AI agent must reconstruct this exactly from this doc alone. No substitutions. Do not omit sections.

---

## 0. WHAT IT IS

White-page features section. Full-width horizontal top/bottom borders, capped inside a 1100px column with vertical borders. Above the grid: a small light-purple `Features` pill, a two-line masked-slide headline (second line accent purple), a body paragraph. Below: a 5-column bento grid with 4 cards laid out **3 / 2 / 2 / 3** for the four features (Sync Feeds · Enrich · Teamwork · Distribute).

Each card:
- Left/top: eyebrow label + heading
- Middle: unique visual (flowchart, floating profile, comment card, network hub)
- Bottom: 13px muted description

Reveal animations:
1. Header pill + headline lines mask-slide up + paragraph fade (GSAP + ScrollTrigger)
2. Each `.bento-card` fades + rises 80px with 0.15s stagger when grid enters viewport at 70%

Design language: soft neutrals + subtle floating shadows. Purple accent `#5c6dff` / `#eff2ff`. Never bold (max weight 600 — source used `font-bold`/700 on tiny eyebrows; downgraded to `font-semibold`/600 per no-bold rule).

---

## 1. HEAD

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Features Bento Grid - Stacker Style</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
```

Deps: Tailwind CDN (Play) + Inter 400/500/600/700. GSAP 3.12.2 + ScrollTrigger loaded via cloudflare CDN (see §11).

---

## 2. CSS — VERBATIM

Paste entire block inside `<style>` in the head:

```css
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #ffffff;
  color: #111827;
}

.bento-card {
  background-color: #fafafa;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.visual-area {
  position: relative;
  flex-grow: 1;
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Connecting lines for Flowchart & Network */
.svg-lines {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-shadow {
  box-shadow: 0 12px 30px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.02);
  border: 1px solid rgba(0,0,0,0.03);
}

/* Flowchart Node */
.flow-node {
  background: white;
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  z-index: 10;
}
```

Key numbers:
- Card bg `#fafafa`, radius `4px`
- Visual min-height `240px`
- `.floating-shadow`: 2-layer soft shadow + 3% black border
- `.flow-node`: white, radius 12, subtle shadow, 1px light border, center-align column

---

## 3. HTML SKELETON

```html
<body class="py-20 px-6">
  <div class="w-full border-y border-gray-200 bg-white">
    <div class="max-w-[1100px] mx-auto border-x border-gray-200 pt-16 pb-16 px-6 lg:px-10">
      [HEADER SECTION]
      <div class="bento-grid grid grid-cols-1 md:grid-cols-5 gap-4 w-full mx-auto">
        [CARD 1]  <!-- md:col-span-3 -->
        [CARD 2]  <!-- md:col-span-2 -->
        [CARD 3]  <!-- md:col-span-2 -->
        [CARD 4]  <!-- md:col-span-3 -->
      </div>
    </div>
  </div>
  [SCRIPTS]
</body>
```

Layout math:
- Body padding `py-20 px-6`
- Outer wrapper: full-width, `border-y border-gray-200`, white
- Inner: max-width 1100px, `border-x border-gray-200`, padding `pt-16 pb-16 px-6 lg:px-10`
- Grid: `md:grid-cols-5`, gap `4` (1rem)
- Card spans total 10 = 3+2+2+3 across two rows

---

## 4. HEADER SECTION

```html
<div class="header-section max-w-4xl mx-auto text-center mb-16">
  <!-- Pill -->
  <div class="header-anim inline-flex items-center gap-1.5 bg-[#eff2ff] text-[#5c6dff] px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8"  x2="12"    y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    Features
  </div>

  <!-- Masked headline (two lines, each in overflow-hidden wrapper) -->
  <h2 class="text-[40px] md:text-[44px] leading-[1.2] font-medium text-[#2d2d2d] mb-4 flex flex-col items-center">
    <div class="overflow-hidden pt-2 pb-1">
      <div class="awwwards-text-line translate-y-full">The complete toolkit for managing</div>
    </div>
    <div class="overflow-hidden pt-2 pb-1">
      <div class="awwwards-text-line text-[#5c6dff] translate-y-full">product feeds at scale</div>
    </div>
  </h2>

  <p class="header-anim text-[#6b7280] text-[16px] md:text-[17px] font-normal max-w-[600px] mx-auto leading-relaxed">
    We empower developers and technical teams to create, simulate, <br> and manage AI-driven workflows visually
  </p>
</div>
```

Header copy — verbatim:

| Slot        | Text                                                                                    |
|-------------|-----------------------------------------------------------------------------------------|
| Pill        | `Features`                                                                              |
| Line 1      | `The complete toolkit for managing`                                                     |
| Line 2      | `product feeds at scale`  (purple `#5c6dff`)                                            |
| Paragraph   | `We empower developers and technical teams to create, simulate, and manage AI-driven workflows visually` (with `<br>` after "simulate,") |

Header pill: light lavender bg `#eff2ff`, text `#5c6dff`, 12px, `font-semibold`, `rounded-full`, icon = alert-info SVG (circle + vertical line + dot).

Headline classes: `.awwwards-text-line` starts `translate-y-full` — GSAP overrides to `y:0` on scroll. Wrapped in `overflow-hidden pt-2 pb-1` for the mask.

---

## 5. CARD 1 — Sync Feeds (col-span-3)

```html
<div class="bento-card md:col-span-3 p-8">
  <div class="mb-6 z-10 relative">
    <div class="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-2">Sync Feeds</div>
    <h3 class="text-[22px] font-semibold text-gray-900 leading-snug">Centralize all your product data</h3>
  </div>

  <div class="visual-area">
    <!-- Dashed SVG connectors -->
    <svg class="svg-lines" viewBox="0 0 600 300" preserveAspectRatio="none">
      <path d="M150 70 L450 70"                        stroke="#e5e7eb" stroke-width="2" fill="none" stroke-dasharray="4 4" />
      <path d="M220 70 L220 160 L280 160"              stroke="#e5e7eb" stroke-width="2" fill="none" stroke-dasharray="4 4" />
      <path d="M380 70 L380 160 L320 160"              stroke="#e5e7eb" stroke-width="2" fill="none" stroke-dasharray="4 4" />
      <path d="M300 160 L300 240"                      stroke="#e5e7eb" stroke-width="2" fill="none" stroke-dasharray="4 4" />
    </svg>

    <div class="flex flex-col items-center gap-8 w-full z-10 relative mt-4">
      <!-- Row 1: Customers / Orders / Shipments -->
      <div class="flex items-center justify-between w-[85%]">
        [FLOW NODE — Customers  · icon: users  · purple-100/purple-600 · "2,490 Available"]
        [FLOW NODE — Orders     · icon: box    · orange-100/orange-500 · "11,559 Completed"]
        [FLOW NODE — Shipments  · icon: monitor· emerald-100/emerald-500 · "11,224 Shipped"]
      </div>

      <!-- Row 2: Projects / Interviews -->
      <div class="flex items-center justify-center gap-6 w-full">
        [FLOW NODE — Projects   · icon: square      · pink-100/pink-500 · "23 Tasks"]
        [FLOW NODE — Interviews · icon: briefcase   · rose-100/rose-500 · "12 Completed"]
      </div>

      <!-- Import button -->
      <div class="bg-[#1a1a1a] text-white px-4 py-2 rounded-full text-[11px] font-medium flex items-center gap-1.5 shadow-lg mt-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Import
      </div>
    </div>
  </div>

  <p class="text-[13px] text-gray-500 leading-relaxed mt-6 z-10 relative max-w-[85%]">
    Import effortlessly from XML, Shopify, or WooCommerce. MagicFeedPro syncs your entire catalog automatically into one unified dashboard.
  </p>
</div>
```

### Flow node template (used by cards 1, 4)

```html
<div class="flow-node">
  <div class="flex items-center gap-2">
    <div class="w-6 h-6 rounded-full bg-{tint}-100 flex items-center justify-center text-{tint}-{shade}">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> [icon paths] </svg>
    </div>
    <span class="text-[13px] font-semibold text-gray-800">{Label}</span>
  </div>
  <span class="text-[9px] font-medium text-gray-400 tracking-wide uppercase mt-1">{Count Text}</span>
</div>
```

Icon SVG paths (feather-style, `stroke-width=2`, `viewBox 0 0 24 24`):

| Slot        | Tint / Shade   | Icon paths                                                                                               |
|-------------|----------------|----------------------------------------------------------------------------------------------------------|
| Customers   | purple 100/600 | `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`                    |
| Orders      | orange 100/500 | box (3D cube): `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>` (uses rounded corner shape, not literal cube — this is the source path) |
| Shipments   | emerald 100/500| monitor: `<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>` |
| Projects    | pink 100/500   | square: `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>` (icon container `w-5 h-5 rounded-sm`) |
| Interviews  | rose 100/500   | briefcase: `<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>` (`w-5 h-5 rounded-sm`) |

Row-1 icon container: `w-6 h-6 rounded-full` (or `rounded-md` for orders/shipments).
Row-2 icon container: `w-5 h-5 rounded-sm`.

---

## 6. CARD 2 — Enrich (col-span-2)

```html
<div class="bento-card md:col-span-2 p-8">
  <div class="mb-6 z-10 relative">
    <div class="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-2">Enrich</div>
    <h3 class="text-[22px] font-semibold text-gray-900 leading-snug">AI-Powered Catalog Optimization</h3>
  </div>

  <div class="visual-area flex justify-center items-center">
    <div class="bg-white rounded-2xl w-[80%] floating-shadow p-5 relative z-10">

      <!-- Two floating action circles on LEFT -->
      <div class="absolute left-[-16px] top-4 flex flex-col gap-2">
        <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center floating-shadow text-gray-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </div>
        <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center floating-shadow text-gray-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </div>
      </div>

      <!-- Four color dots on RIGHT -->
      <div class="absolute right-[-12px] top-6 flex flex-col gap-1.5">
        <div class="w-6 h-6 rounded-full bg-black         border-2 border-white"></div>
        <div class="w-6 h-6 rounded-full bg-purple-600    border-2 border-white"></div>
        <div class="w-6 h-6 rounded-full bg-green-500     border-2 border-white"></div>
        <div class="w-6 h-6 rounded-full bg-orange-400    border-2 border-white"></div>
      </div>

      <!-- Avatar -->
      <div class="w-12 h-12 rounded-full overflow-hidden mb-3 shadow-inner bg-blue-100 flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" class="w-full h-full object-cover">
      </div>
      <div class="font-semibold text-gray-800 text-sm mb-4">Fatima Uma</div>

      <div class="flex justify-between items-center text-[11px] mb-2">
        <span class="text-gray-400 font-medium">Home town</span>
        <span class="text-gray-800 font-semibold">Singapore</span>
      </div>
      <div class="flex justify-between items-center text-[11px] mb-5">
        <span class="text-gray-400 font-medium">Bookings</span>
        <span class="text-gray-800 font-semibold">3 times</span>
      </div>

      <div class="flex gap-2">
        <button class="bg-[#1a1a1a] text-white px-3 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1 hover:bg-black transition-colors">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          Call
        </button>
        <button class="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-[10px] font-semibold hover:bg-gray-200 transition-colors">
          Message
        </button>
      </div>
    </div>
  </div>

  <p class="text-[13px] text-gray-500 leading-relaxed mt-6 z-10 relative">
    Automatically rewrite titles and descriptions with SEO-rich copy that ranks higher and converts better across all sales channels.
  </p>
</div>
```

Card 2 copy — verbatim:

| Slot                | Text                          |
|---------------------|-------------------------------|
| Eyebrow             | `Enrich`                      |
| Heading             | `AI-Powered Catalog Optimization` |
| Name                | `Fatima Uma`                  |
| Row 1 label / value | `Home town` / `Singapore`     |
| Row 2 label / value | `Bookings`  / `3 times`       |
| CTA primary         | `Call`                        |
| CTA secondary       | `Message`                     |
| Description         | `Automatically rewrite titles and descriptions with SEO-rich copy that ranks higher and converts better across all sales channels.` |

Left icons: pencil (edit) + settings-gear. Both are 8×8 `w-8 h-8 bg-white rounded-full` with `.floating-shadow`, positioned `absolute left-[-16px] top-4`.

Right dot stack: 4 × 6×6 `rounded-full`, `border-2 border-white`, colors [`bg-black`, `bg-purple-600`, `bg-green-500`, `bg-orange-400`], positioned `absolute right-[-12px] top-6`.

Avatar image src: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop`.

---

## 7. CARD 3 — Teamwork (col-span-2)

```html
<div class="bento-card md:col-span-2 p-8">
  <div class="mb-6 z-10 relative">
    <div class="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-2">Teamwork</div>
    <h3 class="text-[22px] font-semibold text-gray-900 leading-snug">Review and approve changes together</h3>
  </div>

  <div class="visual-area flex justify-center items-center">
    <div class="bg-white rounded-2xl w-[90%] floating-shadow p-4 pt-10 relative z-10">

      <!-- Tab pinned top-left -->
      <div class="absolute top-[-10px] left-4 bg-white border border-gray-100 rounded-full px-3 py-1.5 text-[9px] font-semibold text-gray-400 flex items-center gap-1.5 floating-shadow">
        Comment on
        <div class="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[8px]">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.9 8.2c-.4-.3-.9-.4-1.5-.4-1.2 0-1.8.4-1.8 1.1 0 .6.5 1 1.7 1.3l.8.2c2.1.5 3.3 1.5 3.3 3.4 0 2.2-1.7 3.5-4.5 3.5-1.9 0-3.6-.5-4.8-1.3v-2.3c1.3.8 3.1 1.3 4.8 1.3 1.5 0 2.2-.5 2.2-1.2 0-.6-.5-1-1.8-1.3l-.7-.2c-2-.5-3.2-1.5-3.2-3.4 0-2 1.6-3.4 4.1-3.4 1.7 0 3.2.4 4.3 1.1V8.2z"/>
          </svg>
          Stripe
        </div>
      </div>

      <div class="flex gap-2 items-start">
        <div class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-semibold mt-0.5">L</div>
        <div>
          <div class="text-[11px] font-semibold text-gray-800 mb-1">Lucas Muller</div>
          <p class="text-[12px] text-gray-700 leading-tight">
            <span class="text-indigo-600 font-medium">@Andy</span> when can we review the proposal?
          </p>

          <div class="flex gap-2 mt-3">
            <div class="bg-gray-50 border border-gray-100 rounded-full px-2 py-1 text-[9px] font-medium text-gray-500 flex items-center gap-1">
              <span class="text-red-500">📌</span> 8
            </div>
            <div class="bg-gray-50 border border-gray-100 rounded-full px-2 py-1 text-[9px] font-medium text-gray-500 flex items-center gap-1">
              <span>✌️</span> 3
            </div>
            <div class="bg-gray-50 border border-gray-100 rounded-full px-2 py-1 text-[9px] font-medium text-gray-500 flex items-center gap-1">
              <span>🚀</span> 7
            </div>
            <div class="bg-gray-50 border border-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-gray-400">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <p class="text-[13px] text-gray-500 leading-relaxed mt-6 z-10 relative">
    Leave comments, review bulk optimizations, and collaborate with your team to ensure every product listing is perfect before going live.
  </p>
</div>
```

Card 3 copy — verbatim:

| Slot                     | Text                                                    |
|--------------------------|---------------------------------------------------------|
| Eyebrow                  | `Teamwork`                                              |
| Heading                  | `Review and approve changes together`                   |
| Tab prefix               | `Comment on`                                            |
| Tab tag                  | `Stripe` (indigo-50 / indigo-600 chip with $ icon)      |
| Avatar letter            | `L`                                                     |
| Author                   | `Lucas Muller`                                          |
| Message (with @mention)  | `@Andy when can we review the proposal?` (`@Andy` in indigo-600) |
| Reactions (3 chips)      | `📌 8`, `✌️ 3`, `🚀 7`                                    |
| Description              | `Leave comments, review bulk optimizations, and collaborate with your team to ensure every product listing is perfect before going live.` |

---

## 8. CARD 4 — Distribute (col-span-3)

```html
<div class="bento-card md:col-span-3 p-8">
  <div class="mb-6 z-10 relative">
    <div class="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-2">Distribute</div>
    <h3 class="text-[22px] font-semibold text-gray-900 leading-snug">Publish to every sales channel</h3>
  </div>

  <div class="visual-area relative">

    <!-- Grid backdrop -->
    <div class="absolute inset-0 z-0 opacity-20"
         style="background-size: 40px 40px;
                background-image: linear-gradient(to right,  #d1d5db 1px, transparent 1px),
                                  linear-gradient(to bottom, #d1d5db 1px, transparent 1px);"></div>

    <!-- Connector lines from center out to nodes -->
    <svg class="svg-lines z-0 opacity-40" viewBox="0 0 600 300" preserveAspectRatio="none">
      <path d="M300 150 L200 100" stroke="#9ca3af" stroke-width="1.5" fill="none" />
      <path d="M300 150 L200 200" stroke="#9ca3af" stroke-width="1.5" fill="none" />
      <path d="M300 150 L400 100" stroke="#9ca3af" stroke-width="1.5" fill="none" />
      <path d="M300 150 L450 200" stroke="#9ca3af" stroke-width="1.5" fill="none" />
    </svg>

    <div class="relative z-10 w-full h-[200px] flex items-center justify-center">
      <!-- Center dark stacker logo -->
      <div class="w-16 h-16 bg-[#1a1a1a] rounded-[20px] flex items-center justify-center floating-shadow z-20">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- 4 floating nodes -->
      <div class="absolute w-10 h-10 bg-white rounded-xl flex items-center justify-center floating-shadow" style="top: 20%; left: 30%;">
        <!-- Google Sheets: green square with divider lines -->
        <div class="w-5 h-5 bg-green-500 rounded-sm flex flex-col items-center justify-center text-white p-0.5">
          <div class="w-full h-1/2 border-b border-white"></div>
          <div class="w-full h-1/2 flex"><div class="w-1/2 border-r border-white"></div></div>
        </div>
      </div>

      <div class="absolute w-10 h-10 bg-white rounded-xl flex items-center justify-center floating-shadow" style="bottom: 20%; left: 25%;">
        <!-- Airtable-ish: yellow stack (reuses stacker path) -->
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-yellow-500">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <div class="absolute w-10 h-10 bg-white rounded-xl flex items-center justify-center floating-shadow" style="top: 20%; right: 30%;">
        <!-- Intercom-ish: blue circle with 3 bars -->
        <div class="w-5 h-5 bg-blue-500 rounded-full flex flex-col items-center justify-center gap-[2px]">
          <div class="w-2.5 h-0.5 bg-white rounded-full"></div>
          <div class="w-3.5 h-0.5 bg-white rounded-full"></div>
          <div class="w-2   h-0.5 bg-white rounded-full"></div>
        </div>
      </div>

      <div class="absolute w-10 h-10 bg-white rounded-xl flex items-center justify-center floating-shadow" style="bottom: 15%; right: 20%;">
        <!-- QuickBooks: green circle with "qb" -->
        <div class="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-[9px] font-semibold tracking-tighter">qb</div>
      </div>
    </div>
  </div>

  <p class="text-[13px] text-gray-500 leading-relaxed mt-6 z-10 relative max-w-[85%]">
    Push your optimized product feeds instantly to Google Merchant Center, Meta, TikTok, and localized Shopify Markets effortlessly.
  </p>
</div>
```

Card 4 copy — verbatim:

| Slot        | Text                                                                                              |
|-------------|---------------------------------------------------------------------------------------------------|
| Eyebrow     | `Distribute`                                                                                      |
| Heading     | `Publish to every sales channel`                                                                  |
| QB label    | `qb`                                                                                              |
| Description | `Push your optimized product feeds instantly to Google Merchant Center, Meta, TikTok, and localized Shopify Markets effortlessly.` |

Node positions (absolute inside a 200px-tall relative container):
- Google Sheets: `top: 20%; left: 30%;`
- Airtable-ish:  `bottom: 20%; left: 25%;`
- Intercom-ish:  `top: 20%; right: 30%;`
- QuickBooks:    `bottom: 15%; right: 20%;`

Center hub: 64×64 (`w-16 h-16`), bg `#1a1a1a`, radius 20px, `floating-shadow`.

---

## 9. ASSETS

Only one external image:

```
https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop
```

Used as the profile avatar inside Card 2.

Emojis: `📌`, `✌️`, `🚀` — used verbatim in Card 3 reaction chips (rendered by OS).

---

## 10. GSAP + SCROLLTRIGGER

CDN, appended before the closing `</body>`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger);

  /* Header timeline */
  const tlHeader = gsap.timeline({
    scrollTrigger: { trigger: ".header-section", start: "top 80%" }
  });

  /* 1. Masked-line reveal (2 headline lines) */
  tlHeader.fromTo(".awwwards-text-line",
    { y: "120%", rotateZ: 2, transformOrigin: "0% 0%" },
    { y: "0%",   rotateZ: 0, duration: 1.4, stagger: 0.15, ease: "power4.out" }
  )
  /* 2. Pill + paragraph fade + rise, overlapping the tail of the headline */
  .fromTo(".header-anim",
    { y: 30, opacity: 0 },
    { y: 0,  opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" },
    "-=1.0"
  );

  /* Bento cards stagger */
  gsap.fromTo(".bento-card",
    { y: 80, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 1.2, stagger: 0.15, ease: "power3.out",
      scrollTrigger: { trigger: ".bento-grid", start: "top 70%" }
    }
  );
</script>
```

Timings:
- Headline lines: `y: 120% → 0%`, `rotateZ: 2° → 0°`, transform-origin top-left, duration 1.4s, stagger 0.15s, `power4.out`
- Pill + paragraph: `y: 30 → 0`, `opacity: 0 → 1`, duration 1s, stagger 0.15s, `power3.out`, starts 1s BEFORE headline finishes (`-=1.0`)
- Cards: `y: 80 → 0`, `opacity: 0 → 1`, duration 1.2s, stagger 0.15s, `power3.out`, own trigger at 70% viewport

---

## 11. TIMING / VALUE TABLE

| Effect                             | Value                                            |
|------------------------------------|--------------------------------------------------|
| Body padding                       | `py-20 px-6`                                     |
| Wrapper max-width                  | 1100px                                           |
| Wrapper vertical padding           | `pt-16 pb-16`                                    |
| Wrapper horizontal padding         | `px-6 lg:px-10`                                  |
| Grid columns                       | 1 mobile / 5 md+                                 |
| Grid gap                           | `gap-4` (16px)                                   |
| Card padding                       | `p-8`                                            |
| Card bg / radius                   | `#fafafa` / 4px                                  |
| Visual min-height                  | 240px                                            |
| Eyebrow                            | 10px, `font-semibold`, tracking-wider, uppercase, `text-gray-400` |
| Heading                            | 22px, `font-semibold`, `text-gray-900`, `leading-snug` |
| Description                        | 13px, `text-gray-500`, `leading-relaxed`, `mt-6` |
| Header pill                        | `bg-[#eff2ff]`, `text-[#5c6dff]`, 12px, `font-semibold`, `rounded-full`, `px-3 py-1.5` |
| Header h2                          | 40px / md 44px, `leading-[1.2]`, `font-medium`, `text-[#2d2d2d]` |
| Purple accent                      | `#5c6dff`                                        |
| Wrapper border color               | `border-gray-200`                                |
| Floating shadow                    | `0 12px 30px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.02)` + `1px rgba(0,0,0,0.03)` |
| Flow node radius                   | 12px                                             |
| Flow node padding                  | `10px 16px`                                      |
| Flow node shadow                   | `0 4px 15px rgba(0,0,0,0.03)`                    |
| Dashed connector (Card 1)          | `stroke-dasharray: 4 4`, `stroke: #e5e7eb`, `width: 2` |
| Solid connector (Card 4)           | `stroke: #9ca3af`, `width: 1.5`                  |
| Card 4 grid backdrop               | 40×40 grid lines, `#d1d5db`, opacity 0.2         |
| Card 4 center hub                  | 64×64, bg `#1a1a1a`, radius 20                   |

---

## 12. RESPONSIVE

- Default (<768px): grid is 1 column, cards stack full-width. Headline scales `40px`. Header pill / paragraph / p-8 stay same. Card 2 profile floating icons `-16px / -12px` may need slight adjustment on very narrow screens.
- `md:` (≥768px): grid becomes 5-column, cards `col-span-3 / 2 / 2 / 3`. Headline `44px`, paragraph `17px`.
- `lg:` (≥1024px): wrapper padding `px-10`.
- ScrollTrigger positions (`top 80%` / `top 70%`) scale with viewport, so entry timing feels consistent at all sizes.
- Prefers-reduced-motion: not implemented. Optional add: set `tlHeader.timeScale(4)` + skip the card fromTo by setting initial `{ y: 0, opacity: 1 }`.

---

## 13. DELIVERABLE

- One HTML file matching sections 1–10 in order
- One TSX drop-in `StackerBento.tsx`. Assumes Tailwind + Inter set up. GSAP + ScrollTrigger imported. All 4 cards inlined as JSX. `useLayoutEffect` mounts the two ScrollTrigger blocks inside `gsap.context()` for auto-cleanup on unmount.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue171
