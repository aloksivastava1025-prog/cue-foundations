# Morphing Pill Duration Editor — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for booking, scheduling, or timer settings in product dashboards where a compact duration field needs a satisfying click-to-edit moment.

---

# Time Duration Editor — Morphing Pill (View ↔ Edit)

Build a single-line time-duration input that lives in two states and morphs between them on click. The whole component is one horizontal row of three pills that visually **fuse** in view-mode and **split apart with rounded corners** in edit-mode. Icon in the action pill cross-fades between a solid pencil (view) and a checkmark (edit). No library needed — vanilla HTML/CSS/JS.

---

## 0. THE TWO STATES

**State A — View (compact / fused)**
- Three pills touch each other with **0px gap**
- Only the outer corners are rounded; inner edges are flat, so it reads as one continuous 60px-tall capsule
- Inputs are **non-interactive** (`pointer-events: none`), values shown as bold black numbers next to grey labels
- Action pill on the right shows a **solid pencil icon** offset 4px left of center

**State B — Edit (split / individual)**
- Same three pills, now separated by **12px gap**
- Every pill radius becomes uniform **16px** on all corners (they become discrete rounded rectangles)
- Both number inputs become editable (`pointer-events: auto`), width expands, text-align switches from right to center, and typing accepts digits only (max 2)
- Focused input's text color animates to blue **`#2563EB`**
- Action pill icon **cross-fades**: pencil slides down + fades out, check slides in from above + fades in

The transition between the two states is what sells it. Read the animation spec carefully.

---

## 1. DESIGN TOKENS

```
Colors
  page bg              #FFFFFF
  pill bg              #F4F5F8
  number text          #000000
  focused number text  #2563EB
  label text           #A0A4AB
  pencil icon          #717680
  check icon           #000000
  selection            rgba(37, 99, 235, 0.2)

Type
  system stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
  number       22px / 700 / right-align (view) / center-align (edit)
  label        22px / 500 / #A0A4AB

Sizes
  pill height  60px
  pill radius  16px
  action pill  60 × 60
  icon         20 × 20

Animation
  ease         cubic-bezier(0.16, 1, 0.3, 1)   (fast out, gentle overshoot-adjacent settle)
  duration     0.5s for layout morph
  input width  0.3s ease
  focus delay  300ms after entering edit (waits for morph, then focuses + selects)
```

---

## 2. LAYOUT

```
.editor-container   flex row, gap: 0 → 12px (transition on gap 0.5s)
  .pill.part-1      hours   → radius 16 0 0 16 → 16 16 16 16 in edit
  .pill.part-2      minutes → radius 0        → 16 16 16 16
  .pill.part-3      button  → radius 0 16 16 0 → 16 16 16 16
```

Every pill uses `transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1)`. Only `.editor-container` transitions `gap`.

### Per-pill padding

| Pill | View L / R | Edit L / R |
|---|---|---|
| part-1 (Hr.)    | 24 / 6      | 24 / 24 |
| part-2 (Min.)   | 6 / 12      | 24 / 24 |
| part-3 (button) | 12 / 24     | 0 / 0 (fixed 60×60, `justify-content: center`) |

Numbers and labels sit in a `.value-wrapper` — `display: flex; align-items: baseline; gap: 6px`.

---

## 3. INPUTS

```css
input {
  width: 14px;                /* 1-digit initial */
  font-size: 22px;
  font-weight: 700;
  color: #000;
  background: transparent;
  border: none;
  outline: none;
  text-align: right;
  pointer-events: none;
  transition: width 0.3s ease;
}
.editor-container.editing input {
  pointer-events: auto;
  width: 32px !important;
  text-align: center;
}
.editor-container.editing input:focus { color: #2563EB; }
```

- Initial width: **14px for 1 digit, 26px for 2 digits** (JS sets on load).
- On input: strip non-digits, clamp to 2 chars, re-run the width switch.
- In edit mode, width jumps to **32px** and text-align switches to center — this is important because the value visually recenters inside its enlarged pill.

---

## 4. THE ACTION BUTTON — TWO ICONS, ONE PILL

Both icons live inside `.part-3` absolutely positioned at `top: 50%; left: 50%`, and are cross-faded via `transform` + `opacity`, animated with the same 0.5s cubic-bezier.

### Pencil (view state)
```css
.icon-pencil {
  color: #717680;
  fill: currentColor;
  transform: translate(calc(-50% - 4px), -50%);   /* 4px nudged left */
  opacity: 1;
}
.editor-container.editing .icon-pencil {
  transform: translate(-50%, 150%);               /* slides down out of frame */
  opacity: 0;
}
```

### Check (edit state)
```css
.icon-check {
  color: #000;
  stroke-width: 3;
  transform: translate(-50%, -150%);              /* starts hidden above */
  opacity: 0;
}
.editor-container.editing .icon-check {
  transform: translate(-50%, -50%);               /* slides in to center */
  opacity: 1;
}
```

Pencil SVG path:
```
d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"
```

Check SVG (stroke, round caps):
```
<polyline points="20 6 9 17 4 12" />
```

---

## 5. JS BEHAVIOR

```js
actionBtn.addEventListener('click', () => {
  const editing = editor.classList.contains('editing');
  if (editing) {
    editor.classList.remove('editing');
    hrInput.blur();
    minInput.blur();
  } else {
    editor.classList.add('editing');
    setTimeout(() => { hrInput.focus(); hrInput.select(); }, 300);
  }
});
```

Focus is delayed **300ms** so the morph animation is mostly complete before the caret appears — otherwise the caret jumps mid-animation and reads as jitter.

Digit clamp on each input:
```js
input.addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9]/g, '').slice(0, 2);
  this.style.width = this.value.length > 1 ? '26px' : '14px';
});
```

---

## 6. THE MORPH — WHY IT FEELS GOOD

Three things animate **simultaneously** on the same 0.5s cubic-bezier:

1. **Gap** on the container (0 → 12px) → pills pull apart horizontally
2. **Border-radius** on each pill (asymmetric corners → all 16px) → the fused capsule visually cracks into three rounded rectangles
3. **Padding** shifts inside each pill → numbers recentre in their new wider container
4. **Icon cross-fade** in the action pill → pencil slides down while check slides in

Because the ease has a soft settle (`0.16, 1, 0.3, 1`), the pills feel like they're being **pulled apart by a magnet** — fast release, gentle stop. Don't swap this ease for a linear or standard `ease-out`; you'll lose the character.

---

## 7. FOCUS + SELECTION UX

- On entering edit mode, focus goes to the hour input and its text is **selected** — the user can immediately overwrite without deleting first.
- Focused input's text color animates to `#2563EB`.
- Native selection color is themed:
  ```css
  input::selection { background: rgba(37, 99, 235, 0.2); }
  ```

---

## 8. RESPONSIVE

- **Desktop (≥ 480px):** as specified — pills are inherently compact so nothing rearranges.
- **Small mobile (< 480px):** keep everything the same; the whole component is only ~200px wide even in edit mode, fits any phone. Only tweak: bump the tap target of `.part-3` to 44×44 minimum for iOS touch guidance — already 60×60 so no change needed.
- **Touch:** works out of the box — `pointer-events: none` in view-mode prevents accidental input focus while scrolling.
- **Motion-safe:** if `prefers-reduced-motion: reduce`, drop the 0.5s to 0.01s or use `transition: none`. The state still works, it just snaps.
- **Keyboard:** Tab into the pencil pill and press Enter/Space to toggle edit. Inside edit, Tab moves Hr → Min → check. Enter on check saves.

Add this block if you want reduced-motion:
```css
@media (prefers-reduced-motion: reduce) {
  .editor-container, .pill, .icon, input { transition: none !important; }
}
```

---

## Deliverable

- One `.editor-container` with three `.pill` children (`.part-1`, `.part-2`, `.part-3`)
- Two number `<input>` elements (Hr, Min) inside `.value-wrapper`s
- Two absolutely-positioned SVGs in the action pill (pencil + check), cross-faded via transform/opacity
- Single `.editing` class on the container toggles the entire state — no per-child JS
- Focus delay 300ms after enter-edit; digit clamp + width switch on input

---

**Awwwards-tier version →** https://cuedesign.space/component/cue180
