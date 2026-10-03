# Outline Inspector Panel — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for design-tool or creative-software interfaces needing a dense, tactile inspector panel for shape and style properties.

---

# Prompt — "OutlinePanel": a design-tool settings panel (pixel-perfect)

Copy everything below the line into any AI coding agent.

---

Build a React + TypeScript component `OutlinePanel.tsx` (React 18, no other dependencies, Inter 400/500/600).

**What it is:** a compact light settings panel, like a design tool's inspector. Under the heading **OUTLINE** sit five rows:
- **Form:** a select.
- **Thickness:** a scrub slider with step dots.
- **Tint:** a colour row with a picker.
- **Size:** a scrub slider.
- **Mirror:** a switch.

**Feel:** quiet and tactile. Labels are soft grey and go dark on hover. The sliders fill the row itself, and menus drop in with a 4 px slide.

## 1. Props

```ts
type OutlineForm = 'semi' | 'circle' | 'quarter' | 'wave' | 'line';
type OutlineSettings = { shape: OutlineForm; weight: number; color: string; radius: number; flip: boolean };
type OutlinePanelProps = {
  defaultValue?: Partial<OutlineSettings>;          // defaults: semi, 4, '#ef6a3a', 268, false
  onChange?: (settings: OutlineSettings) => void;   // all settings, after every change
  backdrop?: boolean;                               // #ececed page that centres the panel (default true)
  loadFont?: boolean; className?: string; style?: CSSProperties;
};
```

**Form options** (icon, label): Arch, Ring, Corner, Ripple, Straight.

## 2. Layout

**Page and panel**
- Page: `#ececed`, with the panel centred.
- Panel: `min(300px, 100%)` wide, `#fbfbfb`, radius 16, a 1 px `#e4e4e6` ring and a soft drop shadow. Padding 14 12 12.
- Heading: "OUTLINE", 12 px / 500, `.04em` tracking, `#77777c`.

**Rows** (gap 8)
- Each row: 34 px high (40 on phones), radius 9, `#f2f2f3`, with a 1 px inset `#e9e9eb` ring. Padding 0 12 0 13, 13 px text.
- Label: `#8b8b90`, turning `#3a3a3d` on hover, focus, drag or while open.
- Value: on the right, `#2b2b2e`, tabular numbers.

**Form row:** the value ("Arch"), then a 14 px up/down chevron.

**Slider rows**
- **Fill:** `#e3e3e5` (`#dbdbde` on hover or drag). It spans from the left edge to `value / max` of the row width.
- **Grip:** a 2 × 14 grip sits 9 px inside the fill's right end. It hides when it would touch the label.
- **Thickness dots:** the scale runs 0–10 (but the value never goes below 1). It has 2.5 px step dots in `#b9b9bd`. A dot shows only if it is:
  - more than 12 px past the fill,
  - more than 80 px from the left,
  - and more than 44 px from the right.
- **Size:** runs 0–500, with no dots.

**Tint row**
- A 22 px colour dot on the right.
- The hex (12 px, uppercase, grey) fades in on hover or while open.

**Mirror switch**
- Track: 36 × 21, `#dcdcdf`, turning `#3b82f6` when on.
- Knob: 17 px, white, slides 15 px.

**Popovers**
- Positioned inside the panel (left / right 12), 6 px under their row. They open **above** the row when there's no room below.
- Style: white, radius 11, padding 5.
- **Form menu:** 32 px options, each with a 16 px icon. The selected option has a blue tick, and the highlighted one is `#f2f2f3`.
- **Picker** (padding 10):
  - a 120 px saturation/value square;
  - a 12 px hue bar;
  - a "Hex" field;
  - 8 round presets in a grid.
  - Both knobs are 14 px, with a white 2 px border.

## 3. Behaviour

**Sliders: the whole row is the track**
- **Press on the track:** the value jumps there, and you can drag.
- **Press on the number:** scrubs *relative* to where you started.
- **Double-click the number** (or press Enter): edits it in place, in a 54 px input with a blue ring. Enter or blur commits, Esc cancels. The value is clamped to the range and floor.
- **Keys:** arrows step by 1 (Shift ×10); Home / End jump to the floor / max.
- Pointer capture keeps the drag alive outside the row.

**Form**
- A click opens the menu, focused on the current option.
- ↑↓ move, Enter picks, Esc closes, Tab closes. Hovering an option highlights it.
- On the **closed** select, ↑↓ step through the options.

**Tint**
- A click opens the picker and focuses + selects the hex field.
- Dragging the square sets saturation and value; dragging the bar sets hue. The hue is kept separately, so greys don't lose it.
- The hex field accepts `#rrggbb`, `rrggbb` or `#rgb`, and reformats on blur.
- Presets apply at once.

**Mirror:** click, or Space / Enter, toggles it.

**Popovers:** close on an outside press or Esc (focus returns to the row).

**Every change** calls `onChange` with all the settings.

## 4. CSS (inject verbatim in a `<style>`)

```css
__CSS__
```

## 5. Component (React + TypeScript — use verbatim)

```tsx
__CODE__
```

## 6. Acceptance checks

- **Load:** "OUTLINE", Form "Arch", Thickness 4 (fill = 40 % of the row, grip clear of the label), an orange Tint dot, Size 268, Mirror off.
- **Scrub:** dragging Size from 20 % to 50 % of the row gives 250 and fires `onChange`.
- **Keys:** on Thickness, → → gives 6. Shift+← clamps to 1, End gives 10 (dots hidden under the fill), Home gives 1 (dots visible).
- **Typing:** double-click Size, type 420 and press Enter → 420. Typing 9999 clamps to 500.
- **Relative scrub:** pressing on the number doesn't jump. Dragging left by 10 % of the row subtracts 50.
- **Form:** ↓ ↓ Enter in the menu picks "Corner"; clicking "Ring" picks it; ↓ on the closed select steps to the next option; Esc closes.
- **Tint:**
  - the blue preset sets `#3b82f6` (and the hex field `#3B82F6`);
  - typing `0f0` gives `#00ff00`;
  - the square's top-right corner gives a red;
  - the hue bar at 1/3 gives a green;
  - the bottom-left gives black;
  - an outside click closes the picker.
- **Mirror:** a click turns it on, Space turns it off.
- **Short window:** the picker opens above the Tint row when it doesn't fit below.
- **Phone (390 px):** no horizontal overflow.
- **Kit-style wrapper:** inside a white page with a centring flex box (StrictMode), it looks identical to the stand-alone page.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue220
