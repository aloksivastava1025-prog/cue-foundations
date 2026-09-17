# Flex-Grow Benefits Reveal — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Fits a 'Why us' or features section on a SaaS or component-library marketing page where premium restraint and micro-interaction craft need to sell the product.

---

# Parley Benefits Section — Flex-Grow Hover Reveal Cards

## Framework & Integration
- Add to your existing Next.js / Vite React app. Do NOT create a new HTML file.
- Import `<ParleyBenefits items? />` and drop into any "Why us / Features" section on the marketing page.
- Zero JS deps. Pure CSS hover state — `flex-grow` transition + closed/open pane cross-fade.
- Tailwind CSS + two font families (DM Sans for display, Geist for body). Tailwind arbitrary values used throughout.

## ASSETS
```
MOSAIC_1 = https://framerusercontent.com/images/ienddKMr5YHn8OtJfjhZUVFgCo.png    // card 1 closed
MOSAIC_2 = https://framerusercontent.com/images/sdp9AiOfotrZg64RT2mspNduuM.png    // cards 2 & 3 closed
MOSAIC_3 = https://framerusercontent.com/images/R0ysj5aZ9R2YoXztXqL6eynb9Uo.png   // card 4 closed
CHAT_IMG = https://framerusercontent.com/images/2MEG3woz70bTopuFKzgkWTZ8Wk.png    // all cards opened state
```
Fonts:
- **Geist** 400/600 — self-hosted from Google Fonts static CDN (two `@font-face` blocks)
- **DM Sans** — variable-font `<link>` from Google Fonts

## DESIGN TOKENS (blue variant — swap orange → blue)
```css
--page-bg:      #f2f5fb        /* was #f7f7f4 warm cream */
--card-bg:      #e6ecf7        /* was #eeede6 warm neutral */
--card-hover:   #ffffff
--text-dark:    #16233d        /* was #251f19 */
--text-muted:   #5e6472        /* was #68615a */
--num-ghost:    #c8d3e5        /* was #ddd8d3 */
--brand-500:    #3358df        /* was orange #f48d16 */
--shadow-blue:  0px 12px 24px 0px rgba(51, 88, 223, 0.10)
```
Image tint (blue-shift the warm mosaic textures without swapping assets):
```css
.mosaic-img { filter: hue-rotate(190deg) saturate(1.1); }
```

## LAYOUT

### Section shell
- `w-full max-w-[1240px] flex flex-col gap-10`
- Page padding: `py-20 px-5`, body flex-centre horizontally, `min-height: 100vh`, bg `--page-bg`

### Header row
- `flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-8 md:gap-0`
- **Left cluster** (`flex flex-col gap-3`):
  - Eyebrow `Why Cue` — 14px / 600 / uppercase / `tracking-wide` / colour `--brand-500`
  - Headline (DM Sans 500, 40px md:52px, `leading-[1.05]`, `--text-dark`) — two lines:
    - `Ship premium sites,`
    - `not prompt scavenger hunts`
- **Right blurb**: 16px / `leading-[1.2]` / `max-w-[420px]` / `--text-muted`:
  > `Most component libraries hand you generic building blocks. Cue hands you Awwwards-tier sections — paste-ready, animation-perfect, and production-grade from the first render.`

### Cards row
- `flex flex-col md:flex-row gap-3 h-[500px] md:h-[420px] w-full`
- 4 cards, each `flex: 1` base, `flex: 1.25` on hover — CSS-only interaction.
- Transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1)` on `.card`.
- Card base: `bg: --card-bg`, `border-radius: 12px`, `cursor: pointer`, `overflow: hidden`
- Card hover: `bg: white`, `border-radius: 20px`, `box-shadow: 0 12px 24px 0 rgba(51,88,223,0.10)`

### Card structure — two absolutely-stacked panes
Both panes are `position: absolute; inset: 0`. Cross-fade with matching easings:
```css
.card-closed { opacity: 1; transform: translateY(0); transition: opacity 0.4s ease, transform 0.4s ease; }
.card:hover .card-closed { opacity: 0; transform: translateY(-10px); pointer-events: none; }

.card-opened { opacity: 0; transform: translateY(10px); pointer-events: none; transition: opacity 0.4s ease, transform 0.4s ease; }
.card:hover .card-opened { opacity: 1; transform: translateY(0); pointer-events: auto; }
```

### Closed pane content
- `padding: 20px 20px 40px 20px`, `flex-col justify-between`
- Top: giant number `01.` — DM Sans 500 / 52px / `leading-none` / colour `--num-ghost`
- Middle: mosaic image container `flex-1 relative my-4`:
  - `<img class="mosaic-img absolute inset-0 w-full h-full object-cover mix-blend-multiply">`
- Bottom: card title — DM Sans 500 / 20px / `--text-dark`

### Opened pane content
- `padding: 8px`, `flex-col`
- Top: hero image aspect `1.56`, `rounded-xl`, `object-cover` (uses `CHAT_IMG`)
- Bottom: `flex-1 flex-col justify-center px-4 gap-2`
  - Title — DM Sans 500 / 32px / `leading-[1.1]` / `--text-dark`
  - Body — 14px / `leading-[1.2]` / `--text-muted`

## Card data (verbatim)
```
01. Awwwards-tier craft
    Every section is pulled from Site-of-the-Day winners — hyper-polished, spring-driven, and calibrated to feel premium out of the box.

02. Paste-ready prompts
    Bolt, v0, Cursor — pixel-perfect prompts land the exact layout, motion, and copy on the first shot. No re-prompting.

03. Working code, always
    HTML, CSS, JS, React — every component ships production-ready. Drop in, wire up, ship this weekend. No half-finished abstractions.

04. Grows with the web
    Every new SOTD site adds fresh components. The library expands as the web's craft ceiling rises — you never fall behind trend.
```

## Behaviour
- Pure CSS. No React state, no JS listeners. Hover triggers the flex-grow expansion and pane cross-fade.
- `mix-blend-multiply` on the mosaic images gives them the tint-with-background look — the background swap (card-bg → white) at hover time also shifts the mosaic tone without further CSS.
- `hue-rotate(190deg)` on `.mosaic-img` re-tints the warm-tone mosaics blue-cold without swapping asset URLs.
- Row height (`420px` on md+) is fixed so the flex-grow only stretches width, not height — clean choreography.

## Responsive
- <768: cards stack vertical (`flex-col`), row height `500px`, each card takes equal share on the column.
- 768+: horizontal row (`md:flex-row`), height `420px`, hover expands the target card and squeezes the others.
- Touch: hover doesn't apply — provide a `focus-within` fallback: `.card:focus-within` mirrors `.card:hover` so tapping activates.
- `prefers-reduced-motion: reduce`: drop the 0.5s flex transition and pane transforms — swap panes with `opacity` only.

## Deliverable Checklist
1. Blue theme applied: brand `#3358df`, page `#f2f5fb`, card `#e6ecf7`, num-ghost `#c8d3e5`, text `#16233d`, muted `#5e6472`
2. Eyebrow `Why Parley` in `--brand-500`, 14px / 600 / uppercase / tracking-wide
3. Headline uses DM Sans 500 at 40/52px, two-line break after `partner,`
4. Right blurb `--text-muted` 16px / `leading-[1.2]` / max-w-420
5. 4 cards in a `flex-row md:flex-row` row, `gap-3`, height `420px` md+
6. Card base `flex-1` grows to `flex-1.25` on hover with 0.5s ease `[0.16,1,0.3,1]`
7. Card radius 12→20, bg card-bg → white, shadow appears on hover (blue-tinted)
8. Both panes absolute-positioned, cross-fade with opacity + `translateY(±10px)`
9. Closed pane: 52px ghost number → mosaic image → 20px title (top to bottom)
10. Opened pane: aspect-1.56 hero image → 32px title → 14px body (top to bottom)
11. `mix-blend-multiply` on closed mosaics; `hue-rotate(190deg) saturate(1.1)` blue-shifts them
12. Exact copy for all 4 cards preserved verbatim
13. DM Sans headline font + Geist body font both loaded
14. Uses only the 4 image URLs listed in ASSETS
15. Card `pointer-events: none` on hidden pane; `auto` on active pane
16. Responsive: column stack < md, row md+
17. `focus-within` fallback for touch, `prefers-reduced-motion` fallback
18. Header row uses `items-start md:items-end` to bottom-align the right blurb with the headline on desktop
19. Zero JavaScript required — pure CSS state machine
20. Namespaced with `.card`, `.card-closed`, `.card-opened`, `.mosaic-img` if scoping is needed; wrap in `.parley-benefits` root for extra safety

---

**Awwwards-tier version →** https://cuedesign.space/component/cue069
