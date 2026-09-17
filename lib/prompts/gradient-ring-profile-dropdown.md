# Gradient-Ring Profile Dropdown — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** Ideal for the account/profile corner of a product dashboard or SaaS app bar where a polished, Framer-tier micro-interaction signals attention to craft.

---

# Profile Hover Dropdown — Gradient-Ring Avatar with Themed Menu + Dark-Mode Toggle

> **This is an ADDITION to my existing project. DO NOT create a new HTML file. DO NOT overwrite my current `<body>`, `<html>`, or global styles.**
> Insert this action-bar (theme toggle + profile hover dropdown) at the spot I mark. If Inter is already loaded from Google Fonts, reuse — don't duplicate the link. Namespace any new class names to avoid collisions. If my project already has a dark-mode system, adapt the CSS variables to plug into mine — this component drives dark mode via `data-mode="dark"` on `<html>` with persistence in `localStorage.mode`.

Build a pixel-perfect **profile hover dropdown** — the kind you'd see on a Framer / Cursor / Rauno-tier product bar. Left of the avatar is a **round icon-only theme toggle** (sun ↔ moon with springy rotate). Hovering the avatar opens a 250px-wide dropdown with a **gradient-ring avatar**, staggered slide-in menu items, an inline **PRO** badge on "Subscription", and a hairline divider before the sign-out group. Everything is fully themed (light + dark) via CSS variables — every color, shadow, and hover state remaps on toggle.

Every value below is exact, not "roughly".

---

## FRAMEWORK

- Plain **HTML + CSS + vanilla JS**. No React. No libraries.
- Single Google Font: **Inter** (weights 400 / 500 / 600 / 700).
- All icons are inline SVG. No icon libraries.
- Dark mode persisted in `localStorage.mode` (`"dark"` | `"light"`).

---

## ASSETS

Fonts only (skip if already loaded):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Single avatar image (Pinterest CDN — use this exact URL, no placeholder):

- `https://i.pinimg.com/736x/da/03/5c/da035cb2cb2ec2f97248cc8a85187542.jpg`

---

## DESIGN TOKENS (paste verbatim — two theme scopes)

Read persisted mode **inline in `<head>` before body paint** so the component never flashes wrong colors on reload:

```html
<script>
  if (localStorage.getItem('mode') === 'dark') {
    document.documentElement.setAttribute('data-mode', 'dark');
  }
</script>
```

```css
:root {
  --bg: #F8F9FA;
  --card-bg: #FFFFFF;
  --text-main: #111111;
  --text-secondary: #555555;
  --hover-bg: #F4F4F5;
  --border: #E5E5E5;
  --pro-bg: #FDF4FF;
  --pro-text: #D946EF;
  --toggle-bg: #EAEAEA;
  --toggle-bg-hover: #E0E0E0;
  --shadow-1: 0 16px 40px rgba(0,0,0,0.06);
  --shadow-2: 0 4px 12px rgba(0,0,0,0.03);
  --shadow-hair: 0 0 0 1px rgba(0,0,0,0.02);
}
:root[data-mode="dark"] {
  --bg: #0B0B0D;
  --card-bg: #17171A;
  --text-main: #FFFFFF;
  --text-secondary: #A0A0A8;
  --hover-bg: #23232A;
  --border: #2A2A31;
  --pro-bg: #2A1132;
  --pro-text: #E879F9;
  --toggle-bg: #23232A;
  --toggle-bg-hover: #2E2E36;
  --shadow-1: 0 16px 40px rgba(0,0,0,0.5);
  --shadow-2: 0 4px 12px rgba(0,0,0,0.35);
  --shadow-hair: 0 0 0 1px rgba(255,255,255,0.05);
}

body {
  margin: 0; min-height: 100vh;
  display: flex; align-items: flex-start; justify-content: center;
  padding-top: 120px;
  background: var(--bg);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.35s ease;
}
```

---

## THE ACTION BAR

```html
<div class="action-bar">
  <button class="theme-btn" id="themeBtn" aria-label="Toggle theme">…</button>
  <div class="profile-wrapper">…</div>
</div>
```

```css
.action-bar { display: flex; align-items: center; gap: 16px; }
```

---

## THEME TOGGLE (round, icon-only — replaces the old Share button)

```html
<button class="theme-btn" id="themeBtn" aria-label="Toggle theme">
  <svg class="sun" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="4"/>
    <line x1="12" y1="20" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/>
    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="4" y2="12"/>
    <line x1="20" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/>
    <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/>
  </svg>
  <svg class="moon" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
</button>
```

```css
.theme-btn {
  display: flex; align-items: center; justify-content: center;
  width: 44px; height: 44px;
  background: var(--toggle-bg);
  border: none; border-radius: 999px;
  cursor: pointer; position: relative;
  overflow: hidden;
  transition: background 0.25s ease, transform 0.1s;
}
.theme-btn:hover  { background: var(--toggle-bg-hover); }
.theme-btn:active { transform: scale(0.94); }
.theme-btn svg {
  position: absolute;
  width: 18px; height: 18px;
  stroke: var(--text-main);
  stroke-width: 1.8; fill: none;
  stroke-linecap: round; stroke-linejoin: round;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.35s ease;
}
:root[data-mode="dark"] .theme-btn .sun  { opacity: 1; transform: rotate(0); }
:root[data-mode="dark"] .theme-btn .moon { opacity: 0; transform: rotate(90deg) scale(0.6); }
:root:not([data-mode="dark"]) .theme-btn .sun  { opacity: 0; transform: rotate(-90deg) scale(0.6); }
:root:not([data-mode="dark"]) .theme-btn .moon { opacity: 1; transform: rotate(0); }
```

Only one icon is visible per mode; the other rotates + scales down + fades. Springy `cubic-bezier(0.34,1.56,0.64,1)` on the rotate gives the pop.

Toggle JS:

```js
const btn = document.getElementById('themeBtn');
btn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-mode') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-mode');
    localStorage.setItem('mode', 'light');
  } else {
    document.documentElement.setAttribute('data-mode', 'dark');
    localStorage.setItem('mode', 'dark');
  }
});
```

---

## GRADIENT-RING AVATAR

```html
<div class="profile-wrapper">
  <div class="avatar-ring">
    <div class="avatar-inner">
      <img src="https://i.pinimg.com/736x/da/03/5c/da035cb2cb2ec2f97248cc8a85187542.jpg" alt="Profile">
    </div>
  </div>
  <div class="dropdown-menu">…</div>
</div>
```

```css
.profile-wrapper { position: relative; }

.avatar-ring {
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, #FF9A9E, #FECFEF, #A1C4FD);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  padding: 2.5px; box-sizing: border-box;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.profile-wrapper:hover .avatar-ring { transform: scale(1.05); }

.avatar-inner {
  width: 100%; height: 100%;
  background: var(--card-bg);                    /* white in light, dark card in dark */
  border-radius: 50%;
  padding: 2.5px; box-sizing: border-box;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.35s ease;
}
.avatar-inner img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
```

Ring gradient is a **fixed 3-stop** (`#FF9A9E → #FECFEF → #A1C4FD`, 135deg) — same in both modes so the ring pops equally. The inner gap swaps with the theme (creates the "hairline gap" between ring and avatar).

---

## DROPDOWN CONTAINER

```css
.dropdown-menu {
  position: absolute;
  top: calc(100% + 14px); right: 0;
  width: 250px;
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-1), var(--shadow-2), var(--shadow-hair);
  padding: 8px;
  opacity: 0; visibility: hidden;
  transform: scale(0.96) translateY(-10px);
  transform-origin: top right;
  transition:
    opacity 0.3s cubic-bezier(0.22,1,0.36,1),
    visibility 0.3s cubic-bezier(0.22,1,0.36,1),
    transform 0.3s cubic-bezier(0.22,1,0.36,1),
    background 0.35s ease,
    box-shadow 0.35s ease;
  pointer-events: none;
}
.profile-wrapper:hover .dropdown-menu {
  opacity: 1; visibility: visible;
  transform: scale(1) translateY(0);
  pointer-events: auto;
}
```

Fires on `:hover` of `.profile-wrapper`. Origin top-right (grows down-and-left from the avatar).

---

## MENU ITEMS

```html
<div class="dropdown-menu">
  <div class="menu-items-group top-group">
    <a href="#" class="menu-item">…Profile</a>
    <a href="#" class="menu-item">…Community</a>
    <a href="#" class="menu-item">…Subscription <span class="pro-badge">…PRO</span></a>
    <a href="#" class="menu-item">…Settings</a>
  </div>
  <div class="divider"></div>
  <div class="menu-items-group bottom-group">
    <a href="#" class="menu-item">…Help center</a>
    <a href="#" class="menu-item">…Sign out</a>
  </div>
</div>
```

```css
.menu-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-radius: 10px;
  text-decoration: none;
  color: var(--text-main);
  font-size: 14.5px; font-weight: 500;
  transition: background 0.15s, transform 0.1s, color 0.2s;
}
.menu-item:hover  { background: var(--hover-bg); }
.menu-item:active { transform: scale(0.98); }
.menu-item svg {
  width: 18px; height: 18px;
  stroke: var(--text-secondary); stroke-width: 1.5; fill: none;
  stroke-linecap: round; stroke-linejoin: round;
  transition: stroke 0.2s;
}
.menu-item:hover svg { stroke: var(--text-main); }
```

Exact icon SVGs (paste inside each `.menu-item`):

- **Profile**: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`
- **Community**: `<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>`
- **Subscription (card)**: `<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>`
- **Settings (toggle pill)**: `<rect x="2" y="7" width="20" height="10" rx="5" ry="5"/><circle cx="8" cy="12" r="2"/>`
- **Help center**: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`
- **Sign out**: `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`

Labels are exactly: **Profile · Community · Subscription · Settings · Help center · Sign out**.

---

## PRO BADGE (inline on Subscription)

```html
<span class="pro-badge">
  <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  PRO
</span>
```

```css
.pro-badge {
  margin-left: auto;
  display: flex; align-items: center; gap: 4px;
  background: var(--pro-bg); color: var(--pro-text);
  padding: 4px 8px; border-radius: 6px;
  font-size: 10.5px; font-weight: 700;
  letter-spacing: 0.5px; text-transform: uppercase;
  transition: background 0.35s ease, color 0.35s ease;
}
.pro-badge svg { width: 10px; height: 10px; stroke: none; fill: var(--pro-text); transition: fill 0.35s ease; }
```

Both `--pro-bg` and `--pro-text` swap on dark — badge remains legible with the same hue family.

---

## HAIRLINE DIVIDER

```css
.divider {
  height: 1px;
  background: var(--border);
  margin: 8px 14px;
  transition: background 0.35s ease;
}
```

---

## STAGGERED SLIDE-IN

Each menu item slides in from `-6px` on the X axis with a 30ms stagger. `nth-child` targets both groups separately so the divider doesn't reset the count.

```css
.profile-wrapper:hover .menu-item {
  animation: slideIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards;
  opacity: 0;
}
.profile-wrapper:hover .top-group .menu-item:nth-child(1) { animation-delay: 0.03s; }
.profile-wrapper:hover .top-group .menu-item:nth-child(2) { animation-delay: 0.06s; }
.profile-wrapper:hover .top-group .menu-item:nth-child(3) { animation-delay: 0.09s; }
.profile-wrapper:hover .top-group .menu-item:nth-child(4) { animation-delay: 0.12s; }
.profile-wrapper:hover .bottom-group .menu-item:nth-child(1) { animation-delay: 0.15s; }
.profile-wrapper:hover .bottom-group .menu-item:nth-child(2) { animation-delay: 0.18s; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

---

## Responsive

- **≥ 480px** — as specified above.
- **≤ 480px**: dropdown clamps to `width: calc(100vw - 40px)`, right-anchor holds so it doesn't clip the viewport; theme button + avatar remain at 44/48. Padding-top of body drops to 60px.
  ```css
  @media (max-width: 480px) {
    body { padding-top: 60px; }
    .dropdown-menu { width: calc(100vw - 40px); right: 0; }
  }
  ```
- **Touch** — replace the `:hover`-only trigger with `.open` class + click handler. Add:
  ```css
  .profile-wrapper.open .dropdown-menu { opacity: 1; visibility: visible; transform: scale(1) translateY(0); pointer-events: auto; }
  ```
  Wire `avatar-ring click → wrapper.classList.toggle('open')` and click-outside to close. `.profile-wrapper.open .menu-item { animation: ... }` mirrors the hover selectors.
- **`prefers-reduced-motion: reduce`**: skip the slide-in stagger and the theme-toggle icon rotate — swap opacity only.
  ```css
  @media (prefers-reduced-motion: reduce) {
    .profile-wrapper:hover .menu-item { animation: none !important; opacity: 1 !important; }
    .theme-btn svg { transition: opacity 0.2s ease !important; transform: none !important; }
  }
  ```
- Test in DevTools at 320, 375, 480, 768, 1024, 1440.

---

## Deliverable checklist (all must be true)

- [ ] Two theme scopes on `<html>`: default light, `data-mode="dark"` swaps 14 CSS vars.
- [ ] Inline `<head>` script reads `localStorage.mode` before first paint — no flash of light theme when reloading in dark.
- [ ] Theme toggle is a **44px round button** with two absolutely-stacked SVGs. Sun visible in dark mode, moon in light. Switch = 0.5s rotate with springy `cubic-bezier(0.34,1.56,0.64,1)`; opposite icon rotates + scales 0.6 + fades out.
- [ ] Toggle click persists `light` or `dark` to `localStorage.mode`.
- [ ] Gradient ring avatar is 48×48 with a fixed 3-stop `linear-gradient(135deg, #FF9A9E, #FECFEF, #A1C4FD)`. Inner gap is 2.5px, background bound to `--card-bg` so it swaps with theme.
- [ ] Avatar ring scales to 1.05 on `.profile-wrapper:hover`.
- [ ] Dropdown is exactly **250px wide**, radius 16, padding 8, positioned `top: calc(100% + 14px); right: 0`, transform-origin `top right`.
- [ ] Dropdown 3-layer shadow (`--shadow-1 + --shadow-2 + --shadow-hair`) swaps to darker values in dark mode.
- [ ] Hover-open transition = 0.3s `cubic-bezier(0.22,1,0.36,1)` on opacity + visibility + transform (0.96 → 1, translateY -10 → 0).
- [ ] 6 menu items in the exact order: Profile · Community · Subscription (with PRO badge) · Settings · [divider] · Help center · Sign out.
- [ ] Each menu item is 10/14 padding, 10 radius, 14.5px / weight 500, gap 12, icon stroke swaps from `--text-secondary` to `--text-main` on hover.
- [ ] PRO badge sits `margin-left: auto`, magenta family (`--pro-text: #D946EF` light / `#E879F9` dark), lightning-bolt SVG filled with `--pro-text`.
- [ ] Divider is 1px, `background: var(--border)`, `margin: 8px 14px`.
- [ ] Each item slides in from `translateX(-6px)` with `+0.03s` stagger — top-group 0.03–0.12s, bottom-group 0.15–0.18s.
- [ ] `prefers-reduced-motion: reduce` disables stagger + icon rotate.
- [ ] No console errors, no layout shift, no theme flash on reload.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue049
