# Tilt Card — AI Prompt

Paste into v0, Bolt, Cursor, Framer AI, or Claude.

---

```
Build a 3D tilt card in React + Framer Motion + Tailwind.

Behaviour:
- The card tilts on X and Y axes as the cursor moves across it
- Tilt range: -8deg to +8deg on both axes
- Uses spring physics (stiffness 160, damping 18)
- A radial-gradient glare follows the cursor position on the card
- Snaps back to neutral (0,0) on mouseleave
- Respects prefers-reduced-motion (falls back to static)

Styling:
- Aspect ratio 4/3
- Rounded-2xl, dark gradient background (neutral-900 → neutral-950)
- White text, thin border (white/10)
- 24px padding, transform-perspective 1000

Component API:
- Props: children (optional ReactNode for card content), className (optional)
- Uses useMotionValue + useSpring + useTransform

Return only the JSX component. Editorial ease throughout.
```

Awwwards-tier version has a chromatic glare + cursor-magnetic content → **cuedesign.space**
