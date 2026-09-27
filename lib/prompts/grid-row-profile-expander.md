# Grid-Row Profile Expander — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal as an account menu trigger in a SaaS dashboard header where users expect quick access to settings and theme control without leaving the page.

---

# Expandable Profile Menu — Grid-Row Reveal + Theme Switcher

A 320-wide beige card that shows a profile row (avatar + name + Admin badge + email). Click the profile row and the card **expands upward** to reveal a nested white menu (7 links + red "Sign out") plus a **3-way theme switcher** (Light · Dark · System). The expand uses the modern **grid-row `0fr → 1fr`** trick to animate `auto` height smoothly, plus an inner opacity+translate fade. Dark theme flips the whole card + body color instantly.

---

## 0. WHAT YOU'RE BUILDING

**Idle state** — a rounded 16px beige card (`#F6F5F0`), 320px wide, single row visible: 40×40 circular avatar, name "Tanvir Hasan" + rounded "Admin" badge, and email below in muted grey. No shadow, hair-thin border.

**Click the profile row** → the card **grows upward** to make room for the expanded panel:
- A nested **white sub-card** (`#FFFFFF`, 12px radius, 4px margin from the beige wrapper, 8px padding) with two grouped lists (4 items + 3 items) separated by a hairline divider. Last item ("Sign out") is red.
- Below the white sub-card, a **3-button theme switcher** — Light / Dark / System — housed in a slightly-darker beige pill (`rgba(0,0,0,0.04)`). The active button is a white pill with a soft shadow.

**Theme flip** — clicking "Dark" adds `.dark-mode` to `<body>`. Page bg → pure black, wrapper → `#1A1A1A`, sub-card → `#262626`, hover states + dividers + sign-out red all recolor via a single class.

---

## 1. DESIGN TOKENS

```
Light theme
  page bg              #FFFFFF
  wrapper bg           #F6F5F0   (warm beige)
  wrapper border       rgba(0,0,0,0.05)
  sub-card bg          #FFFFFF
  divider              #F3F4F6
  item text idle       #374151   (row default)
  item text hover      #111827
  item icon idle       #9CA3AF
  item icon hover      #4B5563
  item bg hover        #F3F4F6
  sign-out text        #DC2626
  sign-out hover text  #B91C1C
  sign-out hover bg    #FEF2F2
  theme rail bg        rgba(0,0,0,0.04)
  theme btn idle       #9CA3AF
  theme btn active     bg #FFFFFF, text #111827, shadow 0 2px 6px rgba(0,0,0,0.05)
  profile hover bg     rgba(0,0,0,0.02)
  name                 #111827
  badge                text #6B7280, border #E5E7EB, bg rgba(255,255,255,0.5)
  email                #9CA3AF

Dark theme (body.dark-mode)
  page bg              #000000
  wrapper bg           #1A1A1A
  wrapper border       rgba(255,255,255,0.1)
  sub-card bg          #262626
  divider              #333333
  item text idle       #D1D5DB
  item text hover      #FFFFFF
  item bg hover        #333333
  item icon idle       #9CA3AF
  item icon hover      #E5E7EB
  theme rail bg        rgba(255,255,255,0.05)
  theme btn active     bg #333333, text #FFFFFF
  profile hover bg     rgba(255,255,255,0.05)
  name                 #FFFFFF
  badge                border #404040, bg rgba(255,255,255,0.1), text #D1D5DB
  sign-out text        #EF4444
  sign-out hover text  #F87171
  sign-out hover bg    rgba(239,68,68,0.1)

Type
  font-family          'Inter', -apple-system, sans-serif  (400/500/600)
  name                 15px / 600
  badge                11px / 500
  email                13px / 400
  menu item            14px / 500
  theme icon           16×16

Sizes
  wrapper              320 wide, radius 16, border 1px
  sub-card             margin 4px all sides, radius 12, padding 8, gap 8
  menu item            padding 8/12, radius 8, gap 12
  icon                 18×18, stroke 1.5, round caps
  divider              1px, margin 0 4px
  theme switcher       height ~40 (32 button + 4×2 padding), radius 12
  theme button         flex 1, height 32, radius 8
  profile trigger      padding 12 16 16 16, avatar 40×40 with 2px white border
  avatar               40×40, radius 50%, box-shadow 0 2px 8 rgba(0,0,0,0.08)
  badge                padding 2/6, radius 12

Motion
  wrapper transitions  0.4s cubic-bezier(0.16, 1, 0.3, 1)  (silky settle)
  grid-row expand      0.4s cubic-bezier(0.16, 1, 0.3, 1)  (0fr → 1fr)
  inner opacity        0.3s ease
  inner translateY     0.4s cubic-bezier(0.16, 1, 0.3, 1)
  hover state          0.2s
  body bg              0.3s ease
```

---

## 2. THE `grid-template-rows: 0fr → 1fr` TRICK

CSS can't animate `height: auto`. But it CAN animate grid track lengths. That's the whole trick:

```css
.menu-content-grid {
  display: grid;
  grid-template-rows: 0fr;                                     /* collapsed */
  transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.menu-wrapper.expanded .menu-content-grid {
  grid-template-rows: 1fr;                                     /* expanded to natural content height */
}

.menu-content-inner {
  overflow: hidden;                                            /* clips child during collapse */
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.3s ease,
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.menu-wrapper.expanded .menu-content-inner {
  opacity: 1;
  transform: translateY(0);
}
```

- The `.menu-content-grid` is the animated container (grid row height goes 0 → 1fr = natural content height)
- The `.menu-content-inner` needs `overflow: hidden` so its content clips cleanly while the parent row is collapsing
- On top of the height animation, `.menu-content-inner` also opacity-fades from 0 → 1 and translateY(10px) → 0 — this is what makes the content "arrive" rather than snap in

**Why not `max-height`?** `max-height` requires you to guess a large-enough value; if the content grows past it, you clip. Grid `1fr` sizes to the actual content, no guessing.

---

## 3. WRAPPER STRUCTURE — WHY THE CONTENT SITS ABOVE THE TRIGGER

```html
<div class="menu-wrapper">
  <div class="menu-content-grid">                <!-- expandable panel goes FIRST -->
    <div class="menu-content-inner">
      <div class="white-menu-box"> ... 7 list items ... </div>
      <div class="theme-switcher"> ... 3 buttons ... </div>
    </div>
  </div>
  <div class="profile-trigger"> ... avatar + name ... </div>   <!-- trigger sits at the BOTTOM -->
</div>
```

Because the expandable content comes **before** the trigger in DOM order, the card grows **upward** when expanded (trigger stays anchored, content pushes above). If you put the content after the trigger, the card grows downward — same trick either way.

The `.menu-wrapper` itself has `overflow: hidden`, so the content is clipped to the wrapper's rounded corners at all times.

---

## 4. WHITE SUB-CARD (INNER MENU)

```css
.white-menu-box {
  background: #FFFFFF;
  border-radius: 12px;
  margin: 4px;                    /* 4px inset from beige wrapper on all sides */
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

The 4px margin creates the visible beige rim around the white card — this is what tells the eye "white card inside beige card" instead of just "white card". Radius 12px inside outer radius 16px keeps corners concentric.

**Two lists**, separated by a 1px hairline divider:

**List 1** (site navigation):
- Home (house icon)
- Pages (document icon)
- Activity stream (chart-up icon)
- Site settings (cube+dot icon)

**List 2** (personal):
- My preferences & profile (user icon)
- Documentations (open-book icon)
- **Sign out** (`.sign-out` class — red text + red icon + light red hover bg)

```css
.menu-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: background 0.2s, color 0.2s;
}
.menu-list li:hover { background: #F3F4F6; color: #111827; }
.menu-list li svg { width: 18px; height: 18px; stroke: #9CA3AF; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.2s; }
.menu-list li:hover svg { stroke: #4B5563; }

.menu-list li.sign-out { color: #DC2626; }
.menu-list li.sign-out svg { stroke: #DC2626; }
.menu-list li.sign-out:hover { background: #FEF2F2; color: #B91C1C; }
.menu-list li.sign-out:hover svg { stroke: #B91C1C; }

.divider { height: 1px; background: #F3F4F6; margin: 0 4px; }
```

---

## 5. THEME SWITCHER (3-BUTTON SEGMENTED CONTROL)

```css
.theme-switcher {
  display: flex;
  background: rgba(0,0,0,0.04);       /* darker beige rail */
  padding: 4px;
  border-radius: 12px;
  margin: 0 4px 4px 4px;              /* aligns with sub-card's 4px inset */
}
.theme-btn {
  flex: 1;                            /* all 3 buttons share the width equally */
  border: none;
  background: transparent;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  transition: all 0.2s;
}
.theme-btn.active {
  background: #FFFFFF;
  color: #111827;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}
```

Three icons: sun (Light) · moon (Dark) · monitor (System). Only one has `.active` at a time — the active state is what tells the eye "this is currently selected". JS clears siblings and sets active on click.

---

## 6. PROFILE TRIGGER

```css
.profile-trigger {
  background: transparent;         /* inherits wrapper beige */
  padding: 12px 16px 16px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.profile-trigger:hover { background: rgba(0,0,0,0.02); }

.avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #FFFFFF;      /* the white ring is what pops the avatar off the beige */
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
```

Layout:
```
[Avatar 40×40]  [Name  Admin]
                [email]
```

Name row uses `display: flex; gap: 8px` with the badge inline.

**Badge**:
```css
.badge {
  font-size: 11px;
  font-weight: 500;
  color: #6B7280;
  border: 1px solid #E5E7EB;
  background: rgba(255,255,255,0.5);   /* semi-transparent so beige shows through */
  padding: 2px 6px;
  border-radius: 12px;
}
```

That `rgba(255,255,255,0.5)` bg is what makes the badge feel "printed on" the beige rather than layered on top.

---

## 7. DARK-MODE FLIP

The whole dark theme is a `body.dark-mode` class selector cascade — no CSS variables (though vars would be a clean alternative). ~15 selectors flip in lockstep. Body background also transitions:

```css
body { transition: background-color 0.3s ease; }
body.dark-mode { background-color: #000000; }
body.dark-mode .menu-wrapper { background: #1A1A1A; border-color: rgba(255,255,255,0.1); }
body.dark-mode .white-menu-box { background: #262626; }
/* ... etc — see file for all 15+ overrides ... */
```

**System button**: falls back to Light in the demo (no `prefers-color-scheme` listener). If you want real system-follow, add:
```js
const mq = matchMedia('(prefers-color-scheme: dark)');
mq.addEventListener('change', () => {
  if (activeTheme === 'system') document.body.classList.toggle('dark-mode', mq.matches);
});
```

---

## 8. JS — TWO HANDLERS

```js
// 1. Toggle expansion
profileTrigger.addEventListener('click', () => {
  menuWrapper.classList.toggle('expanded');
});

// 2. Theme switch
themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    themeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const theme = btn.dataset.theme;
    if (theme === 'dark') document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  });
});
```

That's it. Everything else is CSS.

---

## 9. RESPONSIVE

- **Desktop (≥ 380px):** 320px wide as specified.
- **Mobile (< 380px):** wrapper becomes `width: calc(100vw - 32px)`. Everything else auto-adjusts.
- **Touch:** click-to-toggle already works. Consider adding a click-outside listener to auto-collapse when the user taps away:
  ```js
  document.addEventListener('click', (e) => {
    if (!menuWrapper.contains(e.target)) menuWrapper.classList.remove('expanded');
  });
  ```
- **Motion-safe:** disable the expand animation entirely:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .menu-wrapper, .menu-content-grid, .menu-content-inner {
      transition: none !important;
    }
    .menu-content-inner { transform: none !important; }
  }
  ```

---

## Deliverable

- `.menu-wrapper` — 320 wide, beige `#F6F5F0`, radius 16, 1px hairline border, `overflow: hidden`, DOM order: **expandable content FIRST**, trigger SECOND (so card grows upward)
- Expandable panel uses **`.menu-content-grid { grid-template-rows: 0fr → 1fr }`** trick with `.menu-content-inner { overflow: hidden }` for smooth `auto`-height animation
- `.white-menu-box` — nested white card, 12px radius, 4px inset margin, holds two `.menu-list`s split by `.divider`
- 7 menu items with hover bg + text + icon color transitions; last item `.sign-out` uses red palette (`#DC2626` idle / `#B91C1C` hover)
- 3-button `.theme-switcher` segmented control (Light · Dark · System), active button is a white pill with soft shadow
- `.profile-trigger` — avatar (40×40, white ring, soft shadow) + name row (name + badge) + email
- `.badge` — 11px pill, semi-transparent white bg
- `body.dark-mode` class cascade recolors everything in ~15 selector overrides; body bg animates on 0.3s
- Two JS handlers: expand toggle on trigger click, theme switch on button click
- Only external dep: Google Font Inter (400/500/600). Avatar image is an Unsplash portrait URL — swap for your user's real avatar in production.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue186
