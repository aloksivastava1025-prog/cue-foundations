# Dynamic Island Feedback Notch — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for SaaS dashboards or product apps wanting a low-friction, delightful feedback prompt embedded directly in the header chrome.

---

# Dynamic Notch Poll — Header-Dropped Feedback Bubble with V1/V2 Modes + Dark Theme

## What This Is
A **live user-feedback notch** that drops down from the app's top header (like macOS Dynamic Island), asks a quick question, expands on hover into a poll with 5 emoji options, and slides up-out-of-existence after the user picks one.

**Three states:**
1. **Compact** (280 × 50) — pinned to header, shows a chat icon + `Quick question for you 👋`
2. **Expanded** — hover reveals 5 poll options with staggered fade-in
3. **Submitted** — check icon + `Thanks for your feedback!` for 1.5s, then slides up + fades out

**Two expansion modes (togglable):**
- **V1 Vertical** (default) — expands DOWNWARD to 320 × 440, options stack in a column, per-row 100ms stagger
- **V2 Horizontal** — expands SIDEWAYS to 1020 × 84 (a stubby pill spanning most of the header width), options are inline pills with spring-bounce entrance

Plus **Dark Theme** (dark page + light notch) — the notch inverts from black to `#F5F7FA` with subtle white-aura shadow.

Also uses a `@property --notch-gap` CSS animation to widen the space between the header's left content and its border to accommodate the widened notch in V2 — the animation stays in sync.

## Framework & Integration
- Drop into any existing React (Next.js/Vite) or vanilla page. Do NOT create a new HTML file.
- Import as `<DynamicNotchPoll question? options? mode? theme? autoStartMs? onSubmit? />`.
- Component mounts inside your app header (or any relative container). Sits `position: absolute; top: 0; left: 50%; translateX(-50%)`.
- Zero external deps. Pure CSS transitions + a small JS state machine.

## ASSETS
No image assets. Inline SVGs only:
- Chat bubble icon (compact state): 18×18 stroke 2.5, colour `#7B61FF` with `pulse` keyframe
- Circle-check icon (success state): 28×28 stroke 2, colour `#34D399`

Font — Inter 400/500/600 via Google Fonts:
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap
```

## DESIGN TOKENS
```css
--notch-bg-light:  linear-gradient(180deg, #1A1A1A 0%, #000000 100%)
--notch-bg-dark:   linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 100%)

--compact-w:      280px
--compact-h:      50px
--v1-w:           320px      /* vertical mode expanded */
--v1-h:           440px
--v2-w:           1020px     /* horizontal mode expanded */
--v2-h:           84px

--ease-v1:        cubic-bezier(0.16, 1, 0.3, 1)
--ease-v2:        cubic-bezier(0.34, 1.56, 0.64, 1)   /* spring bounce */
--duration-v1:    0.6s (height 1s on expand)
--duration-v2:    0.8s

--pulse-color:    #7B61FF
--success-color:  #34D399
```

## LAYOUT

### App header shell
- 50px tall bar, white background (`#FFFFFF`), left-padded 32px
- Contains logo `◆ Acme Corp` + nav tabs (Commands / Logs / Metrics)
- `position: relative` so the notch container can absolute-position on top

### `@property --notch-gap` trick
```css
@property --notch-gap {
  syntax: '<length>';
  initial-value: 160px;
  inherits: true;
}
.header {
  transition: --notch-gap 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
body.horizontal-mode .header:has(.notch.expanded) {
  --notch-gap: 530px;   /* wide enough for V2 pill (1020/2 + 20 padding) */
}
```
The `@property` registration lets CSS animate a custom length value smoothly. When V2 expands, the header widens its internal border gap in sync so the notch doesn't visually clash with the header's border.

### Notch container
- `position: absolute; top: 0; left: 50%; transform: translateX(-50%)`
- `display: flex; flex-direction: column; align-items: center; z-index: 100`

### Notch element (`.notch`)
Starts with `height: 0; width: 280px; border-bottom-radius: 20px`. Deep shadow stack:
```
inset 0 -1px 1px rgba(255,255,255,0.25),
inset 1px 0 1px rgba(255,255,255,0.08),
inset -1px 0 1px rgba(255,255,255,0.08),
0 12px 24px rgba(0,0,0,0.15)
```
Transitions everything (height, width, radius, shadow, transform, opacity).

Three main class states:
- `.active` — dropped-down compact (height 50)
- `.expanded` — hover state
- `.hide` — final slip-up (height 0, opacity 0, translateY(-20), pointer-events: none)

### Seamless inward-curve pseudo-elements
`::before` (left) and `::after` (right):
```
position: absolute; top: 0; width: 16px; height: 16px;
```
Radial gradients create the concave corners:
- Left: `radial-gradient(circle at 0 100%, transparent 16px, #1A1A1A 16px)`
- Right: `radial-gradient(circle at 100% 100%, transparent 16px, #1A1A1A 16px)`

Fade in with `.active`, out with `.hide`. In dark mode the fill flips to `#FFFFFF`.

### Notch content layers
Three overlapping absolute-positioned `.notch-content` divs, all `opacity: 0` by default. Only ONE shows at a time:

**1. `.compact`** (state 1)
- Flex row, `gap: 10px`
- Chat icon (pulsing) + `Quick question for you 👋` (14.5px / 500 / white)
- Shows when `.active:not(.expanded):not(.hide)`
- 300ms delay so the notch fully drops before content fades in

**2. `.expanded-poll`** (state 2)
- Column (or row in V2), padding `30px 24px`
- `.poll-header` — `How do you like the new Dashboard?` (16px / 600 / white)
- `.poll-options` — column of 5 `.poll-btn` cards
- Each button: 14px 18px padding, radius 12, semi-transparent white overlay `rgba(255,255,255,0.06)` with `rgba(255,255,255,0.1)` border, label + emoji on opposite sides
- Hover: bg `rgba(255,255,255,0.15)`, scale 1.03, border brightens, shadow deepens

Per-option stagger delays for V1 (Vertical):
```
option 1: 0.15s
option 2: 0.25s
option 3: 0.35s
option 4: 0.45s
option 5: 0.55s
```

Per-option stagger delays for V2 (Horizontal — snappier):
```
option 1: 0.15s
option 2: 0.20s
option 3: 0.25s
option 4: 0.30s
option 5: 0.35s
```

**3. `.success-msg`** (state 3)
- Column (or row in V2), gap 12
- Green check icon (28×28) + `Thanks for your feedback!` (16px / 600 / white)
- Enters with scale 0.9 → 1

## MODE TOGGLING

### V1 Vertical (default)
- Expanded: `height: 440px; width: 320px; border-bottom-radius: 24px`
- Height transition slowed to 1s cubic-bezier(0.16, 1, 0.3, 1) on expand
- Options stack column, staggered per row

### V2 Horizontal (`body.horizontal-mode`)
- Expanded: `height: 84px; width: 1020px; border-bottom-radius: 42px` (perfect pill ends)
- Spring easing `cubic-bezier(0.34, 1.56, 0.64, 1)` — overshoots slightly for the bounce
- Deep shadow: `0 40px 80px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.2)`
- Poll header font 15.5px, opacity 0.85 (muted for premium hierarchy)
- Options become inline pills: padding 10px 16px, radius 100
- Hover pop: `translateY(-4px) scale(1.05)` + `0 10px 20px rgba(0,0,0,0.2)` + `inset 0 1px 0 rgba(255,255,255,0.1)`

## DARK MODE (`body.dark-mode`)

Inverts the palette:
- Page: `#000000` background + `#FFFFFF` text
- Notch: `linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 100%)` — inverted!
- Shadow stack switches to a white-aura style: `0 0 0 1px rgba(255,255,255,0.1), 0 12px 30px rgba(255,255,255,0.08)`
- Concave curves flip fill to `#FFFFFF`
- Text colours flip: compact/poll header/success all use `#111`
- Poll buttons: `#F3F4F6` bg with `#E5E7EB` border, hover `#FFFFFF` bg
- Pulse icon → `#000` (still readable)

## BEHAVIOR

### Auto-start
On mount: 500ms delay → `notch.classList.add('active')` (drops down).

### Hover
- `mouseenter` on notch (if active + not submitted) → add `.expanded`
- `mouseleave` (if not submitted) → remove `.expanded`

### Option click
1. `e.stopPropagation()` (don't bubble to notch)
2. `isSubmitted = true`
3. `notch.classList.add('submitted')` — success content fades in (200ms delay after prev fades)
4. Wait 1500ms
5. `notch.classList.remove('expanded', 'active')` + `add('hide')` — slip up + vanish

### Reset
Clicking "Show Notch Again" (external button) → remove all state classes, re-add `.active` after 50ms.

### Mode / theme toggle
- V1 ↔ V2: toggle `body.horizontal-mode` class + call `triggerNotch()` to re-show with new interaction
- Light ↔ Dark: toggle `body.dark-mode` class — all colours flip via CSS variables

## Responsive
- Below 700px: V2 mode caps `width` at `calc(100vw - 32px)` and shows only 3 poll options (Excellent / Good / Poor), hides `Average` and `Terrible`
- Touch: no hover — component listens for both hover AND click on the compact state to expand; second click closes
- `prefers-reduced-motion: reduce`: skip all `cubic-bezier` spring easings (use `0.2s ease` for all transitions), disable pulse icon animation, disable slip-up translate on hide

## Deliverable Checklist
1. Inter 400/500/600 loaded from Google Fonts
2. `@property --notch-gap { syntax: '<length>'; initial-value: 160px; inherits: true; }` for header gap animation
3. Header 50px tall, white bg, contains logo `◆ Acme Corp` + nav tabs
4. Notch absolute at `top: 0; left: 50%; translateX(-50%); z-index: 100`
5. Compact state: `280 × 50`, dark gradient `#1A1A1A → #000`, radius 20 bottom-only, dropped in via `.active` class
6. Deep shadow stack with 3 inset lines + `0 12px 24px rgba(0,0,0,0.15)` drop
7. Concave corner pseudo-elements 16×16 with radial-gradient at 100% 100%
8. Content layers: `.compact` / `.expanded-poll` / `.success-msg` — only one shows via class combo
9. `.compact`: chat icon (pulsing `#7B61FF`) + `Quick question for you 👋` (14.5px / 500 / white)
10. `.expanded-poll`: `How do you like the new Dashboard?` header + 5 emoji-labelled buttons
11. V1 vertical: `320 × 440`, radius 24, height transition slowed to 1s cubic-bezier
12. V1 stagger: options fade in at 0.15/0.25/0.35/0.45/0.55s
13. V2 horizontal: `1020 × 84`, radius 42 (perfect pill), spring easing `cubic-bezier(0.34, 1.56, 0.64, 1)`, deeper 40px shadow
14. V2 stagger: options fade in at 0.15/0.20/0.25/0.30/0.35s (snappier)
15. V2 pill buttons round to 100 radius, hover pops `translateY(-4px) scale(1.05)`
16. Header `--notch-gap` animates 160px → 530px in V2 to widen the internal border gap
17. On option click: `.submitted` state, success icon + `Thanks for your feedback!`, wait 1500ms, `.hide` = height 0 + opacity 0 + translateY(-20)
18. Dark mode: page `#000`, notch flips to `#FFFFFF → #F5F7FA` gradient, all text switches to `#111`
19. Options in dark mode: `#F3F4F6` bg with `#E5E7EB` border
20. Public API: `<DynamicNotchPoll question options mode theme autoStartMs onSubmit />`

---

**Awwwards-tier version →** https://cuedesign.space/component/cue096
