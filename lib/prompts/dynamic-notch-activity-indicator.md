# Dynamic Notch Activity Indicator — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for AI dev-tool dashboards or coding-agent products that need a persistent, glanceable status widget showing real-time task progress.

---

# Dynamic Notch — Real-Time Agent Activity Indicator

## Framework & Integration
- Drop into any existing React (Next.js/Vite) or vanilla page. Do NOT create a new HTML file.
- Import as `<DynamicNotch states? active? onCycle? />`; parent can drive it live from real agent events by passing a controlled `state` prop, or let it auto-cycle the demo reel.
- Owns its own width measurement + interval bookkeeping. Cleans up on unmount.
- Zero external deps — pure CSS + one width-measure trick.

## ASSETS
No image assets. Everything is CSS + a 3×3 grid of `<span>`s for the pixel-flicker icon.

Font — Inter 400/500/600 via Google Fonts:
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap
```

## DESIGN TOKENS
```css
--page-bg:    #ffffff
--notch-bg:   #000000
--muted:      #8c8c8c
--white:      #ffffff

/* Per-state accent (each state sets these two on the notch) */
--glow-color:      #ff99a8            /* fully opaque accent */
--glow-color-dim:  rgba(x,x,x,0.15)   /* alpha 0.15 for the ambient shadow */
```

State palette:
```
scanning  →  #ffc18f  orange
reading   →  #ff99a8  pink
planning  →  #c299ff  purple
writing   →  #82ff9e  mint
terminal  →  #ffeb85  yellow
success   →  #8ab4ff  blue
```

## LAYOUT

### Laptop bezel (`.laptop-bezel`)
- Full-width strip pinned to top of viewport: `position: absolute; top: 0; left: 0; right: 0; height: 14px; background: #000; z-index: 10`
- Sells the illusion that the notch is embedded in a display's bezel — matches the notch's black seamlessly.

### Notch container (`.notch-container`)
- `position: absolute; top: 14px` (sits directly under the bezel), `left: 50%; transform: translateX(-50%)`
- `background: #000; border-bottom-left-radius: 22px; border-bottom-right-radius: 22px`
- `height: 58px; padding: 0 28px; z-index: 9`
- Flex-centre content
- Enter state: `transform: translate(-50%, 0)` (fully visible)
- Hidden state: `transform: translate(-50%, -100%)` (retracts into bezel)
- Transitions:
  ```
  width      0.6s cubic-bezier(0.34, 1.56, 0.64, 1)
  transform  0.8s cubic-bezier(0.34, 1.56, 0.64, 1)
  box-shadow 0.6s ease
  ```
- Shadow (uses the per-state dim colour to ambient-light the screen below):
  ```
  0 15px 35px rgba(0,0,0,0.10),
  0 25px 60px var(--glow-color-dim);
  ```

### Concave corners (`.notch-container::before / ::after`)
- Simulate the iPhone / MacBook notch's rounded-outward corners with a hollow-radius trick:
  ```
  content: '';
  position: absolute;
  top: -1px;         /* -1px overlaps the bezel and hides anti-alias seams */
  width: 20px; height: 20px;
  ```
- `::before` sits on the LEFT of the container:
  ```
  right: 100%;
  border-top-right-radius: 20px;
  box-shadow: 10px -10px 0 10px #000;
  ```
- `::after` mirrors on the RIGHT:
  ```
  left: 100%;
  border-top-left-radius: 20px;
  box-shadow: -10px -10px 0 10px #000;
  ```
- These push a black wedge outward, curling the notch's outer corners.

### Content stack (`.notch-content`)
- `flex-direction: column; gap: 6px; align-items: center; white-space: nowrap; width: 100%`
- `transition: opacity 0.2s ease` — used to fade content out/in when swapping states

### Top text (`.top-text`)
- 13px / 500 / `--muted` / `letter-spacing: -0.2px`
- `font-variant-numeric: tabular-nums` — CRITICAL so rapidly changing digits don't jiggle the layout width mid-tick
- Contains dynamic content per state (see BEHAVIOR)

### Bottom row (`.bottom-row`)
- `flex align-items: center; gap: 10px`
- Left: pixel icon (glowing 3×3 grid)
- Right: shimmering label

### Pixel icon (`.pixel-icon`)
- 14×14, `display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 1px`
- Colour uses `currentColor` bound to `--glow-color`; `filter: drop-shadow(0 0 6px currentColor)` gives the neon halo
- 9 `<span>` cells. Cell 5 (centre) is invisible (`opacity: 0; animation: none`) — creates the classic tic-tac-toe eye
- Cells 1–9 animate `pixel-flicker 1s infinite alternate ease-in-out` with staggered delays:
  ```
  1: 0.1s   2: 0.8s   3: 0.3s
  4: 0.9s   6: 0.4s   7: 0.7s
  8: 0.2s   9: 0.6s
  ```
  Keyframe:
  ```
  0%, 15%   { opacity: 0.1; }
  85%, 100% { opacity: 1; }
  ```

### Bottom text (`.bottom-text`)
- 15px / 600 / `letter-spacing: 0.1px`
- Shimmering gradient text — 6-stop linear at 110°, animates via `background-position` shift:
  ```
  background: linear-gradient(110deg,
    #ffffff 0%, rgba(255,255,255,0.7) 20%, var(--glow-color) 40%,
    #ffffff 60%, rgba(255,255,255,0.7) 80%, var(--glow-color) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: text-shimmer 3s linear infinite;
  ```
- `@keyframes text-shimmer { to { background-position: -200% center; } }`

## BEHAVIOR — Agent state machine

### State array (default demo cycle)
Order is fixed; each state has a `duration` (ms it stays on screen), a `color` (drives both `--glow-color` and `--glow-color-dim`), and content-generator rules:

```js
[
  { type: 'scanning',  top: 'Analyzing 14,204 tokens',        bottom: 'Thinking',       color: '#ffc18f', duration: 2500 },
  { type: 'reading',   files: [...5 filenames],                bottom: 'Reading files',  color: '#ff99a8', duration: 4500 },
  { type: 'planning',  top: 'Synthesizing knowledge',          bottom: 'Drafting plan',  color: '#c299ff', duration: 2500 },
  { type: 'writing',   file: 'DynamicNotch.html',              bottom: 'Writing code',   color: '#82ff9e', duration: 5000 },
  { type: 'terminal',  commands: ['npm run lint', 'tsc --noEmit', 'vite build', 'vitest run'], bottom: 'Running checks', color: '#ffeb85', duration: 3500 },
  { type: 'success',   top: 'Task completed successfully',     bottom: 'Done',           color: '#8ab4ff', duration: 3000 },
]
```

### Reading state — fast file cycle
- `setInterval` every **180ms**:
  - Pick next file from `files[]`
  - Increment `lines` by `random(12..52)`
  - Every 3rd tick, reset `lines = 10`
  - Render: `Read {file} <span opacity: 0.6>{lines} lines</span>`
- Width pre-measured with the widest plausible string (`Read app-sidebar.tsx 999 lines`) so the notch doesn't jiggle every tick.

### Writing state — steady typing
- `setInterval` every **90ms**:
  - Increment `writtenLines` by `random(1..6)`
  - Render: `Update {file} <span opacity: 0.6; color: #82ff9e>+{lines} lines</span>`
- Width pre-measured with `Update DynamicNotch.html +999 lines`.

### Terminal state — slower ticker
- `setInterval` every **800ms**:
  - Cycle through `commands[]`, render `> {cmd} <span opacity: 0.6>{ms}ms</span>` where ms = `random(120..720)`
- Width pre-measured with `> vite build 850ms`.

### Static states (scanning / planning / success)
- Single render, no interval — just show `state.top`.

### State transition choreography (per cycle)
1. Fade `content.opacity: 0` (200ms)
2. After 250ms delay: swap accent colours, update text, remeasure width via a hidden ghost node with the same padding/font, set `.notch-container.width` accordingly
3. Fade `content.opacity: 1`
4. Kick any per-state interval
5. After `state.duration`, clear interval, recurse into next state

### Width measurement helper
```js
function updateWidth(topString, bottomString) {
  const ghost = document.createElement('div');
  ghost.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:"Inter",sans-serif;padding:0 28px;display:flex;flex-direction:column';
  ghost.innerHTML = `
    <div style="font-size:13px;font-weight:500;">${topString}</div>
    <div style="display:flex;gap:10px;font-size:15px;font-weight:600;">
      <div style="width:14px;"></div><div>${bottomString}</div>
    </div>`;
  document.body.appendChild(ghost);
  const w = ghost.offsetWidth + 12;   // +12 = a little breathing room
  document.body.removeChild(ghost);
  notch.style.width = w + 'px';
}
```
Called ONCE per state entry — for ticker states, called with the widest plausible string so the notch doesn't jiggle during ticks.

### Active / inactive
- Add class `.active` to render (transform 0). Remove to retract (transform -100%).
- Component's parent can control this via `active` prop for real integrations.

## Responsive
- Notch centres on any width. On small screens (<480px), reduce top text to 12px and bottom text to 14px; height stays 58px.
- `prefers-reduced-motion: reduce`:
  - Disable `pixel-flicker` and `text-shimmer` keyframes
  - Cap width transition to 200ms `ease`
  - Skip the state-swap fade → hard swap

## Deliverable Checklist
1. Inter font 400/500/600 loaded
2. Body pure white `#ffffff`, `overflow: hidden`
3. Full-width black bezel strip at `top: 0; height: 14px; z-index: 10`
4. Notch container black, radius 22, height 58, `padding: 0 28px`
5. `translateX(-50%)` centring; `transform: translate(-50%, -100%)` hidden state → `translate(-50%, 0)` active
6. `transition: width 0.6s / transform 0.8s / box-shadow 0.6s` with `cubic-bezier(0.34, 1.56, 0.64, 1)`
7. Notch shadow layers 15px + 25px, second layer uses `--glow-color-dim`
8. Concave corner tricks via `::before` / `::after` with `border-top-*-radius: 20px` + `box-shadow: ±10px -10px 0 10px #000`
9. Corners have `top: -1px` to hide anti-alias seams
10. Content stack column with `gap: 6px`; opacity fade `0.2s` between state swaps
11. Top text 13px / 500 / muted / tabular-nums (prevents digit jiggle)
12. Bottom row: pixel icon + label with 10px gap
13. Pixel icon: 14px 3×3 grid, `gap: 1px`, `drop-shadow(0 0 6px currentColor)`
14. Cell 5 (centre) invisible; other cells stagger `pixel-flicker` 1s alternate ease-in-out with distinct delays
15. Bottom text shimmer via 110° 6-stop gradient, `background-size: 200% auto`, `text-shimmer 3s linear infinite`
16. State palette exactly: orange/pink/purple/mint/yellow/blue with matching alpha-0.15 dim
17. Per-state generators: scanning/planning/success = static, reading = 180ms tick, writing = 90ms tick, terminal = 800ms tick
18. Width pre-measured with widest plausible string for ticker states — no jiggle
19. Cleanup: clear tick interval on every state exit + on unmount
20. Retract → swap → expand choreography with 250ms fade window between states

---

**Awwwards-tier version →** https://cuedesign.space/component/cue072
