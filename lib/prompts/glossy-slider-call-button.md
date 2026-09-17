# Glossy Slider Call Button — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Fits a CTA in agency or consulting landing pages where a booking action deserves a tactile, high-craft hover moment.

---

# Book a Call — Glossy Slider Button

Full-reference pixel-perfect spec. Any AI agent must reconstruct this exactly from this doc alone. No substitutions.

---

## 0. WHAT IT IS

A single dark pill button with a small acid-green pill "slider" tucked at the left. On hover:
- The green slider expands rightward to fill the button
- The dotted arrow icon inside slides out to the right and fades
- A phone ringing icon slides in from the left and grows into place
- The "Book a call" label fades out and shifts left

All motion via CSS transitions with `cubic-bezier(0.22, 1, 0.36, 1)` cinematic ease. No JS. No libraries.

Design language: heavy 3D bezel (inset shadow + colored border) + glossy inner highlight on the slider. Weights 400/500/600 only — no bold.

---

## 1. HEAD

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book a Call Button</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
```

Deps: Inter 400/500/600 from Google Fonts. No Tailwind, no JS libraries.

---

## 2. CSS — VERBATIM

Paste entire block:

```css
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f3f3;   /* light stage bg */
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.book-btn {
  position: relative;
  width: 280px;
  height: 76px;
  background: #101010;
  border: 3px solid #333333;
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  box-shadow:
    inset 0 4px 8px  rgba(0, 0, 0, 0.80),         /* top inner shadow */
    inset 0 1px 1px  rgba(255, 255, 255, 0.15),   /* thin top rim highlight */
    0 15px 30px      rgba(0, 0, 0, 0.25);         /* ambient drop */
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

/* Green slider tucked at left */
.slider {
  position: absolute;
  left: 6px;
  top: 6px;
  bottom: 6px;
  width: 96px;
  background: linear-gradient(180deg, #A4FF3B, #72D80B);
  border-radius: 999px;
  transition: width 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow:
    inset 0  3px 5px rgba(255, 255, 255, 0.60),   /* top gloss */
    inset 0 -3px 5px rgba(0, 0, 0, 0.25),         /* bottom dip */
    0     4px 12px  rgba(0, 0, 0, 0.30);          /* drop */
}
.book-btn:hover .slider {
  width: calc(100% - 12px);
}

/* Dotted arrow — visible at rest */
.icon-arrow {
  position: absolute;
  width: 32px;
  height: 32px;
  color: #111;
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.40s ease,
              transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.book-btn:hover .icon-arrow {
  opacity: 0;
  transform: translateX(40px);
}

/* Phone ringing — hidden at rest, slides in on hover */
.icon-phone {
  position: absolute;
  width: 26px;
  height: 26px;
  color: #111;
  opacity: 0;
  transform: translateX(-40px) scale(0.7);
  transition: opacity 0.45s ease 0.10s,
              transform 0.60s cubic-bezier(0.22, 1, 0.36, 1);
}
.book-btn:hover .icon-phone {
  opacity: 1;
  transform: translateX(0) scale(1);
}

/* Label */
.text {
  position: absolute;
  left: 122px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.3px;
  transition: opacity 0.35s ease,
              transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 1;
}
.book-btn:hover .text {
  opacity: 0;
  transform: translateX(-15px);
}
```

Key numbers — do not change:
- Button size `280 × 76`
- Slider pill `left/top/bottom: 6px`, `width: 96px` at rest → `calc(100% - 12px)` on hover
- Slider gradient `#A4FF3B → #72D80B` (top → bottom, 180deg)
- Border `3px #333`, bg `#101010`
- Arrow: 32×32, exit `translateX(40px)` + opacity 0
- Phone: 26×26, enter from `translateX(-40px) scale(0.7)` → `(0, 1)`
- Text: `left: 122px`, size 20, weight 500, letter-spacing -0.3px, exit `translateX(-15px)`
- Master ease `cubic-bezier(0.22, 1, 0.36, 1)`
- Transitions:
  - Slider width: 0.65s
  - Arrow opacity 0.40s / transform 0.55s
  - Phone opacity 0.45s (0.10s delay) / transform 0.60s
  - Text opacity 0.35s / transform 0.50s

---

## 3. HTML STRUCTURE — VERBATIM

```html
<body>
  <div class="book-btn">
    <div class="slider">
      <svg class="icon-arrow" viewBox="0 0 24 24" fill="currentColor">
        <!-- Center line -->
        <circle cx="6"  cy="12" r="1.5"/>
        <circle cx="10" cy="12" r="1.5"/>
        <circle cx="14" cy="12" r="1.5"/>
        <circle cx="18" cy="12" r="1.5"/>
        <!-- Top wing -->
        <circle cx="14" cy="8"  r="1.5"/>
        <circle cx="10" cy="4"  r="1.5"/>
        <!-- Bottom wing -->
        <circle cx="14" cy="16" r="1.5"/>
        <circle cx="10" cy="20" r="1.5"/>
      </svg>

      <svg class="icon-phone" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M15.05 5 A 5 5 0 0 1 19 8.95"/>
        <path d="M15.05 1 A 9 9 0 0 1 23 8.94"/>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    </div>
    <div class="text">Book a call</div>
  </div>
</body>
```

Copy — verbatim:

| Slot          | Text          |
|---------------|---------------|
| Title tag     | `Book a Call Button` |
| Label         | `Book a call` |

---

## 4. DOTTED ARROW SVG (paths reference)

8 filled circles (all `r=1.5`, `fill=currentColor`), viewBox `0 0 24 24`. Layout is a right-pointing dotted arrow:

| Region  | Circle cx | cy |
|---------|-----------|----|
| shaft-1 | 6         | 12 |
| shaft-2 | 10        | 12 |
| shaft-3 | 14        | 12 |
| shaft-4 | 18        | 12 |
| top     | 14        | 8  |
| top     | 10        | 4  |
| bottom  | 14        | 16 |
| bottom  | 10        | 20 |

---

## 5. PHONE ICON SVG

3 paths, stroke `currentColor`, `stroke-width: 2.2`, round caps and joins, `fill: none`. Composed of two ringing arcs above a handset:

```
M15.05 5  A 5 5 0 0 1 19 8.95            (inner ring)
M15.05 1  A 9 9 0 0 1 23 8.94            (outer ring)
M22 16.92v3a2 2 0 0 1-2.18 2 ... 22 16.92z   (handset — feather phone body)
```

Use the full third path verbatim from section 3.

---

## 6. INTERACTION MAP

| State                | Slider width       | Arrow           | Phone                          | Text                    |
|----------------------|--------------------|-----------------|--------------------------------|-------------------------|
| Rest                 | 96px               | opacity 1, x 0  | opacity 0, x -40, scale 0.7    | opacity 1, x 0          |
| Hover                | `calc(100% - 12px)`| opacity 0, x 40 | opacity 1, x 0, scale 1        | opacity 0, x -15        |
| Focus / focus-visible| (not implemented — optional add: mirror hover state)                                   |
| Active (:active)     | (not implemented — optional add: slight scale 0.98 for click feedback)                 |

No JavaScript. All state changes driven by `:hover` on `.book-btn`.

---

## 7. RESPONSIVE

- No breakpoints — button is fixed 280×76 at all sizes
- On touch devices `:hover` fires briefly on tap. If you want an on-tap version:
  - Add `.book-btn:focus-within` and `.book-btn:active` selectors mirroring the hover state
  - Or add JS `click` → toggle `.is-open` class and mirror styles via that class
- Prefers-reduced-motion: not implemented. Optional add:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .book-btn *, .book-btn .slider { transition: none !important; }
  }
  ```

---

## 8. DELIVERABLE

- One HTML file matching sections 1–3 in order (single button, no wrapper needed)
- One TSX drop-in `BookCallButton.tsx`. Assumes Inter loaded in target. Inline `<style>` block since the classes are scoped. Zero state, zero effects — a pure static component. Optional `label` prop to override the copy.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue172
