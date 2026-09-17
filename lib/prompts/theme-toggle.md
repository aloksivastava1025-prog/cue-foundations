# Theme Toggle — AI Prompt

```
Build a two-state theme toggle (Light / Dark) in React + Framer Motion.

Behaviour:
- Two pill buttons side by side inside a rounded-full container
- Active button has a spring-animated indicator that slides between
  positions using layoutId
- Spring: stiffness 300, damping 24
- Inactive labels are muted (white/50), hover-brighter

Styling:
- Rounded-full container with 1px border (white/10), 4px inner padding
- Buttons: rounded-full, 12px horizontal padding, 6px vertical
- Active thumb: white/10 background
- 12px medium-weight labels

API:
- Props: initial ("light" | "dark", default "dark")
- Uses useState for local state (wire to your theme store in prod)

Return only the JSX component.
```
