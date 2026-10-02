# Expanding Pill Navbar System — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** Ideal for minimalist SaaS or portfolio sites wanting a compact, dark/light-aware navigation with editorial menu structure and refined micro-interactions.

---

# Minimal Pill Navbar — Menu · Theme · Live Clock

Build a compact, top-center pill navbar. Closed state is a horizontal capsule with a burger + "Menu" label on the left and a theme-toggle circle + live clock on the right. Clicking the burger expands the pill downward into a menu panel with three sections: Menu links, Legal links, and Social media icons. Theme toggle swaps light ↔ dark with animated sun/moon crossfade. Includes a V1 / V2 mode toggle in the top-right — V1 is a plain off-white page; V2 swaps in a full-bleed image background and hides all page content except the navbar.

---

## FRAMEWORK

Vanilla HTML + CSS + JS. No framework, no build step. Single `index.html`.

## STACK

- Google Font: `Inter:wght@400;500;600`
- Inline SVGs for sun, moon, burger, socials — no icon library

## ASSETS

V2 background — Pinterest URL routed through weserv.nl for CORS:
```
https://images.weserv.nl/?url=i.pinimg.com/736x/83/8f/ac/838facdfae4ce6e213e42c94fb5931eb.jpg
```

---

## DESIGN TOKENS (paste verbatim)

```css
:root {                                /* Light theme */
  --page-bg:        #f4f2ed;           /* off-white with subtle warm tint */
  --shell-bg:       #ffffff;           /* pure white pill */
  --control-bg:     #0a0a0a;           /* dark inner control bar */
  --control-fg:     #ffffff;
  --control-fg-dim: rgba(255,255,255,0.55);
  --border:         rgba(255,255,255,0.28);
  --hover:          rgba(255,255,255,0.10);
  --panel-fg:       #0a0a0a;
  --panel-tag:      rgba(0,0,0,0.4);
  --panel-divider:  rgba(0,0,0,0.08);
}
html[data-theme="dark"] {
  --page-bg:        #1a1a1c;           /* lighter than the menu shell */
  --shell-bg:       #0a0a0a;           /* deeper black — the menu itself */
  --control-bg:     #f7f6f3;
  --control-fg:     #0a0a0a;
  --control-fg-dim: rgba(10,10,10,0.5);
  --border:         rgba(0,0,0,0.20);
  --hover:          rgba(0,0,0,0.08);
  --panel-fg:       #ffffff;
  --panel-tag:      rgba(255,255,255,0.4);
  --panel-divider:  rgba(255,255,255,0.08);
}
```

Motion curve used throughout: `cubic-bezier(0.22, 1, 0.36, 1)` (expo-out feel).

---

## LAYOUT

**Nav shell** — `position: fixed; top: 32px; left: 50%; transform: translateX(-50%);`
- Width: 280px closed, 360px open
- Padding: 8px
- Border-radius: 24px
- Background: `--shell-bg`
- Overflow: hidden (so panel slides out from within)
- Width + background transitions: 0.6s expo-out

**Control bar** (child of shell, always visible) — `display: flex; justify-content: space-between; padding: 8px 8px 8px 20px; border-radius: 18px; background: --control-bg`

**Menu panel** (child of shell, below control bar) — `max-height: 0` closed, `max-height: 620px` open, 0.6s expo-out. Inner content `padding: 32px 18px 24px`, flex column, gap 19px.

---

## LEFT — Burger + Menu label

- Container: flex, gap 10px, height 36px, transparent button
- Burger: 20 × 20 relative box, contains two absolute lines
  - Line dimensions: `width: 18px; height: 1px; left: 1px; border-radius: 2px; background: --control-fg`
  - Line top: `top: 6px`
  - Line bottom: `top: 12px`
- Label: relative overflow-hidden box with two absolute `<span>`s stacked vertically ("Menu" and "Close"), each transitions `transform`/`opacity` on 0.5s expo-out

**Open state** (nav-shell.open):
- Whole burger rotates 90° (transform: rotate(90deg))
- Top line: `top: 9px`, `rotate(45deg)`
- Bottom line: `top: 9px`, `rotate(-45deg)`
- "Menu" text slides up 110% + fades to 0
- "Close" text slides from 110% to 0 + fades to 1

---

## RIGHT — Theme toggle + Time pill

**Theme toggle** — 36 × 36 pill (`border-radius: 100px`), 1px `--border`, transparent bg, hover bg `--hover`
- Contains two icon layers absolutely stacked (sun + moon), each 18 × 18 SVG
- Light theme: sun opacity 1 rotate 0°, moon opacity 0 rotate -120°
- Dark theme: sun opacity 0 rotate 120°, moon opacity 1 rotate 0°
- Transitions: opacity + transform on 0.5s expo-out
- Persists user choice in `localStorage` under key `pill-nav-theme`

**Time pill** ��� height 36px, padding `0 6px`, font 13px `--control-fg-dim`, `font-variant-numeric: tabular-nums`, opacity 0.8
- Live HH:MM from `new Date()` — tick every 30s
- Not a static "09:41"

---

## PANEL — Menu · Legal · Social

Three sections stacked with gap 19px. Each section has a tiny 13px eyebrow tag in `--panel-tag`, followed by the content.

**Menu section:**
- Section tag: `Menu`
- Link list (4 items, gap 0, padding 8px 0 each):
  - `About`
  - `Pricing`
  - `Resources`
  - `Our features`
- Font: 16px, weight 500, `letter-spacing: -0.01em`, color `--panel-fg`
- Hover: `translateX(4px)` + `opacity: 0.7` (0.4s expo-out)

**Divider** — 1px solid `--panel-divider`

**Legal section:**
- Section tag: `Legal`
- Link list (2 items, padding 5px 0):
  - `Privacy Policy`
  - `Terms & Conditions`
- Font: 14px, weight 400, opacity 0.75

**Social section:**
- Section tag: `Social media`
- 4 icons in a row, 26 × 26 each, gap 5px, `border-radius: 8px`, inline SVG icons:
  - Instagram
  - X (formerly Twitter)
  - TikTok
  - YouTube
- Hover: `background: --panel-divider`, `translateY(-1px)` (0.3s ease)

**Panel content animation on open:**
- `.panel-inner` starts at `opacity: 0; transform: translateY(6px)`
- On `.nav-shell.open`: fades + slides to opacity 1, translateY 0 over 0.55s expo-out with 0.1s delay (so the max-height opens first, then content settles in)

---

## V1 / V2 BACKGROUND TOGGLE

Fixed pill in the top-right corner (`top: 32px; right: 32px; z-index: 60`):
- Container: flex, padding 4px, 1px border `rgba(255,255,255,0.25)`, background `rgba(0,0,0,0.45)`, backdrop-filter blur 10px, border-radius 999px
- Two buttons: `V1` and `V2`
  - 10px 0.24em uppercase, weight 500, padding `6px 14px`, border-radius 999px
  - Inactive: `color: rgba(255,255,255,0.6)`
  - Active: `background: #fff; color: #0a0a0a`

**V1** — default. Solid `--page-bg`, demo content ("Minimal Pill Navbar" heading + description) visible.

**V2** — full-bleed image bg:
```css
body.bg-v2 {
  background: url('<weserv proxied Pinterest URL>') center/cover no-repeat fixed;
}
body.bg-v2 .demo-body { display: none; }
body.bg-v2 .nav-shell { background: #ffffff; }
html[data-theme="dark"] body.bg-v2 .nav-shell { background: #0a0a0a; }
```
- No overlay — bright bg
- All page text hidden
- Shell is theme-adaptive: white in light, near-black in dark
- Menu text follows theme naturally (light theme = black text, dark theme = white text)

---

## INTERACTIONS

1. **Menu toggle** — click burger: shell width 280 → 360, `.open` class toggles burger transform + label crossfade + panel expand. Sets `aria-expanded` on the button.
2. **Click outside** — closes the menu.
3. **Escape key** — closes the menu, restores focus to the burger.
4. **Theme toggle** — swaps `html[data-theme]` between `light` and `dark`, persists in localStorage. All colors + sun/moon icons transition via CSS variable inheritance.
5. **Clock tick** — `setInterval` at 30s writes `HH:MM` to the time pill.
6. **V1/V2 toggle** — toggles `body.bg-v2` class and swaps the active button.

---

## ACCEPTANCE

- Navbar is a top-center fixed pill (280px closed → 360px open), off-white page bg in V1
- Burger animates into an X (rotate + lines cross), "Menu" text swaps to "Close" via vertical slide
- Panel expands smoothly downward (max-height + content fade+slide-up)
- Theme toggle animates sun/moon crossfade with 120° rotate swap and persists across reloads
- Time pill shows real live HH:MM, not a static placeholder
- Menu links, Legal, Social sections match the exact copy above
- V1/V2 toggle in top-right corner swaps between solid page bg and Pinterest image bg
- V2 hides all demo content, keeps navbar clean-white against the image
- V2 respects theme toggle: light = white shell, dark = black shell
- No console errors; no icon library dependency; single-file HTML

---

**Awwwards-tier version →** https://cuedesign.space/component/cue013
