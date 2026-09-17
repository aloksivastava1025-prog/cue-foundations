# Magnetic Button — AI Prompt

Copy the prompt below into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch. Refined across multiple AI iterations by the Cue team — you're getting iteration nine, not iteration one.

---

## The prompt

```
Build a magnetic button in React with Framer Motion and Tailwind CSS.

Behaviour:
- The button visually tracks the cursor within a 60px radius
- Uses spring physics (stiffness 150, damping 15) for the movement
- Springs back to origin when the cursor exits the radius
- Respects prefers-reduced-motion (falls back to static)

Styling:
- Rounded-full pill shape
- Black background, white text
- Horizontal padding 24px, vertical padding 12px
- Font: system default, medium weight (500)
- Subtle hover state (bg-neutral-800)
- Focus-visible ring for a11y

Component API:
- Props: children (ReactNode), className (optional string), onClick (optional handler)
- Uses useSpring from framer-motion for smooth transforms
- Uses useRef to measure the button's bounding rect

Editorial ease throughout. No external state library.

Return only the JSX component code. No explanation.
```

---

## Why this prompt lands

Most "magnetic button" prompts miss three things: the **radius gate** (so the button doesn't slide across the entire viewport), the **spring config** (which decides whether the button feels rubbery or precise), and the **reduced-motion respect** (WCAG compliance). This prompt bakes all three into the request so the AI can't skip them.

---

## Awwwards-tier version

For the fully-loaded version with a magnetic-orbit effect + electric-blue glow shader + hover click ripple, see **Cue+** at:

**→ https://cuedesign.space/component/cue056**
