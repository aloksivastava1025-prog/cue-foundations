# Nested Dark Context Menu — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for SaaS dashboards, productivity tools, or admin panels needing a polished nested context menu for workspace or file actions.

---

# Context Menu with Right-Flyout Submenu

A ClickUp / Notion-style **dark context menu** that opens under a "Click Me" trigger button. The main menu is a 270px-wide pill of stacked items with icons; clicking **Create New** springs a **220px submenu flyout** to its right. All state is driven by two class toggles (`.show` on the container, `.active` on the parent item). Click-outside auto-closes both levels. Trigger arrow rotates 0° → 90° when open.

---

## 0. WHAT YOU'RE BUILDING

Three visual layers:

1. **Trigger button** — a compact dark pill ("Click Me" + chevron right). Chevron rotates 90° (points down) when the main menu is open.
2. **Main menu** — 270×auto, dark card with 8px padding, 12 items grouped by 4 dividers. Items with a submenu show a **right chevron** on hover. One `.complex` item (Hide Space) has a two-line body: title + faded subtext. One `.danger` item (Delete) tinted red. Footer: full-width "Manage Permissions" button.
3. **Submenu flyout** — 220×auto, same dark styling, positioned `top: 0; left: calc(100% + 4px)` relative to its parent item. Enters with `opacity 0 → 1` + `translateX(-8px) → 0` + `scale(0.98) → 1` over 150ms. Origin: `left center` (feels like it's springing out of the parent).

---

## 1. DESIGN TOKENS

```
Colors
  page bg              #2C2C2E
  menu bg              #1C1C1E
  menu border          rgba(255,255,255,0.08)
  hover bg             rgba(255,255,255,0.08)
  item text            #F1F1F1
  subtext              #8E8E93
  icon stroke          #A1A1A6
  danger               #FF453A
  divider              rgba(255,255,255,0.06)
  footer btn bg        rgba(255,255,255,0.06)
  footer btn hover     rgba(255,255,255,0.1)
  footer btn border    rgba(255,255,255,0.02)

Type
  system stack: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif
  item              14px / 500 / #F1F1F1
  subtext           12px / 400 / #8E8E93 / line-height 1.4 / margin-top 4px
  footer button     14px / 500

Sizes
  main menu width      270px
  submenu width        220px
  menu radius          12px
  item radius          8px
  item padding         8px 12px  (complex: 8px 12px 10px 12px)
  divider height       1px, margin 6px 0
  icon                 16 × 16, stroke-width 1.5, round caps/joins
  icon margin-right    12px
  chevron              14 × 14, stroke-width 2, round caps
  footer button        full-width, 10px padding, 8px radius
  main menu offset     top: calc(100% + 8px); left: 0
  submenu offset       top: 0; left: calc(100% + 4px)

Motion
  hover bg             0.1s ease
  menu enter/exit      0.15s ease-out on opacity + transform + visibility
  submenu transform    translateX(-8px) scale(0.98) → translateX(0) scale(1)
  main menu transform  translateY(-8px) → translateY(0)
  trigger arrow spin   0.2s ease, rotate(0deg) → rotate(90deg) when open
```

---

## 2. ANATOMY

```
.dropdown-wrapper                         position: relative, inline-block
  .dropdown-trigger#main-dropdown-trigger  the "Click Me" button (chevron rotates on open)
  .menu-container#main-menu-container      the whole popover, absolute, hidden/shown via .show
    .context-menu                          270px dark card, 8px padding
      .menu-item          Rename
      .menu-item          Copy Link
      .menu-divider
      .menu-item#btn-create-new            has a nested .submenu; toggles .active on click
        .submenu#submenu-create-new        220px, absolute right-of-parent
      .menu-item          Color & Icon      chevron on hover
      .menu-item          Space Settings    chevron on hover
      .menu-item          Templates         chevron on hover
      .menu-divider
      .menu-item          Add to Favorites
      .menu-item.complex  Hide Space + subtext
      .menu-divider
      .menu-item          Duplicate
      .menu-item          Archive
      .menu-item.danger   Delete
      .menu-divider
      button.manage-btn   "Manage Permissions"
```

---

## 3. MAIN MENU CARD

```css
.context-menu {
  width: 270px;
  background: #1C1C1E;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow:
    0 16px 48px rgba(0,0,0,0.4),
    0 4px 12px rgba(0,0,0,0.2);
  padding: 8px;
  box-sizing: border-box;
}
```

Two-layer shadow — the tall 48px blur creates the ambient float, the short 12px blur seats it visually. This is what separates it from the page.

---

## 4. MENU ITEM

```css
.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #F1F1F1;
  transition: background 0.1s ease;
  position: relative;
  user-select: none;
}
.menu-item:hover,
.menu-item.active {
  background: rgba(255,255,255,0.08);
}
.menu-item .icon {
  width: 16px; height: 16px;
  margin-right: 12px;
  stroke: #A1A1A6;
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}
```

### 4.1 Complex item (multi-line, e.g. "Hide Space")

```css
.menu-item.complex {
  align-items: flex-start;
  padding: 8px 12px 10px 12px;
}
.menu-item.complex .icon { margin-top: 2px; }  /* aligns icon with first text line */

.item-text-group { display: flex; flex-direction: column; }
.item-subtext {
  font-size: 12px;
  color: #8E8E93;
  margin-top: 4px;
  line-height: 1.4;
  font-weight: 400;
}
```

### 4.2 Danger item (Delete)

```css
.menu-item.danger { color: #FF453A; }
.menu-item.danger .icon { stroke: #FF453A; }
```

### 4.3 Right chevron on submenu items

```css
.chevron-right {
  margin-left: auto;
  width: 14px; height: 14px;
  stroke: #8E8E93;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  transition: opacity 0.1s;
}
.menu-item:hover .chevron-right,
.menu-item.active .chevron-right { opacity: 1; }
```

Chevron is **hidden until hover** so the menu reads clean at rest, but hints at expansion when the user hovers. Once submenu is open (`.active`), chevron stays visible as a "you're inside this branch" signal.

---

## 5. THE SUBMENU FLYOUT

```css
.submenu {
  position: absolute;
  top: 0;                              /* aligns with parent's top edge */
  left: calc(100% + 4px);              /* 4px gap right of parent */
  width: 220px;
  background: #1C1C1E;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2);
  padding: 8px;

  visibility: hidden;
  opacity: 0;
  transform: translateX(-8px) scale(0.98);
  transform-origin: left center;
  transition:
    opacity 0.15s ease-out,
    transform 0.15s ease-out,
    visibility 0.15s;
  z-index: 10;
}
.menu-item.active .submenu {
  visibility: visible;
  opacity: 1;
  transform: translateX(0) scale(1);
}
```

The **`transform-origin: left center`** + `translateX(-8px) scale(0.98)` combo is the whole polish — the submenu **inflates outward from the parent's right edge**, not "pops in from nothing". It reads as one continuous surface unfolding.

**IMPORTANT** — the submenu MUST be a **child** of `.menu-item#btn-create-new`, not a sibling. That's why `.menu-item.active .submenu` selector works (parent class → child effect). Positioning is `absolute` relative to the parent item.

### Submenu contents (Create New)

Two-group list with dividers:
1. **Content types**: List · Doc · Form · Whiteboard
2. **Containers**: Folder · Sprint Folder
3. **Import path**: From Template · Import (with a nested chevron of its own — not built out, but the icon shows a further-flyout is possible)

---

## 6. DIVIDER + FOOTER BUTTON

```css
.menu-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 6px 0;
}

.manage-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.02);
  border-radius: 8px;
  color: #F1F1F1;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.1s;
  font-family: inherit;
}
.manage-btn:hover { background: rgba(255,255,255,0.1); }
```

The button uses the same alpha-white palette as hovered items — it reads as **the same tier** as the items above, but full-width so it clearly terminates the menu.

---

## 7. TRIGGER BUTTON + ARROW ROTATION

```css
.dropdown-trigger {
  background: #1C1C1E;
  border: 1px solid rgba(255,255,255,0.1);
  color: #F1F1F1;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.1s;
}
.dropdown-trigger:hover { background: rgba(255,255,255,0.08); }
.dropdown-trigger svg {
  width: 18px; height: 18px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.2s ease;
}

/* When menu is open, rotate chevron 90° so → becomes ↓ */
.dropdown-wrapper:has(.menu-container.show) .dropdown-trigger svg {
  transform: rotate(90deg);
}
```

The `:has()` selector reads the sibling state without JS. If you're supporting browsers without `:has()` (< Safari 15.4 / Chrome 105), fall back to toggling an `.open` class on the trigger via JS.

---

## 8. MAIN MENU OPEN/CLOSE

```css
.menu-container {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  visibility: hidden;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.15s ease-out, transform 0.15s ease-out, visibility 0.15s;
  z-index: 50;
}
.menu-container.show {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
}
```

Slides down 8px + fades in. `visibility` in the transition prevents the hidden menu from catching pointer events before it finishes fading out.

---

## 9. JS — THREE HANDLERS

```js
// 1. Toggle main menu on trigger click
mainTriggerBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  mainMenuContainer.classList.toggle('show');
});

// 2. Toggle submenu on Create New click
createNewBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  createNewBtn.classList.toggle('active');
});

// 3. Prevent clicks inside main menu from closing it
mainMenuContainer.addEventListener('click', (e) => e.stopPropagation());

// 4. Click-outside closes both levels
document.addEventListener('click', (e) => {
  if (!createNewBtn.contains(e.target)) createNewBtn.classList.remove('active');
  if (!mainTriggerBtn.contains(e.target) && !mainMenuContainer.contains(e.target)) {
    mainMenuContainer.classList.remove('show');
  }
});
```

**Why `stopPropagation`** — the document-level click listener would otherwise close the menu on the same click that opened it, and any click on an item would collapse the whole popover mid-selection.

---

## 10. RESPONSIVE

- **Desktop (≥ 640px):** as specified — main menu right-aligned to trigger, submenu right-flyout.
- **Tablet (480–639px):** if the submenu would overflow the viewport right edge, flip it to the LEFT: `left: auto; right: calc(100% + 4px);` and reverse the enter animation direction. Cleanest way: JS class `.submenu-left` toggled by measuring `getBoundingClientRect()`.
- **Mobile (< 480px):** stack the submenu **below** the parent item instead of flying right — set:
  ```css
  @media (max-width: 479px) {
    .submenu {
      position: static;
      width: 100%;
      margin-top: 4px;
      transform-origin: top center;
      transform: translateY(-4px) scale(0.98);
    }
    .menu-item.active .submenu { transform: translateY(0) scale(1); }
  }
  ```
- **Touch:** works on tap out of the box (no hover dependency for opening the submenu — click toggles `.active`).
- **Motion-safe:** `@media (prefers-reduced-motion: reduce) { .menu-container, .submenu { transition: none !important; transform: none !important; } .dropdown-trigger svg { transition: none !important; } }`.
- **Keyboard (add-on):** wire Escape to close both menus, arrow keys to navigate items, Enter to activate. Skeleton left to author.

---

## Deliverable

- `.dropdown-wrapper` (inline-block, relative) containing `.dropdown-trigger` + `.menu-container`
- `.menu-container` absolutely-positioned `top: calc(100% + 8px)`, hidden/shown via `.show`, `translateY(-8px)` enter animation
- `.context-menu` — 270px card with 12px radius, 8px padding, two-layer shadow, dark bg
- Menu items: standard, `.complex` (align-items flex-start + 2-line body), `.danger` (red text + red icon stroke)
- Chevron-right icons on items with sub-flyouts, `opacity: 0 → 1` on hover / `.active`
- `.submenu` positioned `top: 0; left: calc(100% + 4px)`, 220px wide, enters with `translateX(-8px) scale(0.98) → translateX(0) scale(1)` from `left center` origin over 150ms
- Trigger arrow rotates 90° via `:has(.show)` selector on `.dropdown-wrapper`
- 4-handler JS: trigger toggle, submenu toggle, menu-internal `stopPropagation`, document-level click-outside
- All 12 SVG icons verbatim from the reference (stroke-width 1.5 for item icons, 2 for chevrons)

---

**Awwwards-tier version →** https://cuedesign.space/component/cue184
