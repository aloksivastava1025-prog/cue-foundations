# Pill Tabs — AI Prompt

```
Build a pill-style tab bar in React + Framer Motion.

Behaviour:
- N tabs shown side by side inside a rounded-full container
- Active tab has a spring-underlined pill indicator that glides
  between positions using layoutId
- Spring: stiffness 320, damping 24
- Inactive tabs muted (white/50), hover-brighter

API:
- Props: tabs (string[], default ["Overview","Activity","Settings"]),
  initial (number, default 0)

Return only the JSX component.
```
