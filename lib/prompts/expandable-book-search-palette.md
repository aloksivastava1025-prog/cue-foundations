# Expandable Book Search Palette — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal as the primary catalog search entry point on a library, bookstore, or reading-platform site where quick genre discovery matters.

---

# Book Search Palette — Expandable Command Bar with Genre Grid

## Framework & Integration
- Drop into any existing React (Next.js/Vite) or vanilla page. Do NOT create a new HTML file.
- Import `<BookSearchPalette genres? onSelect? placeholder? title? />`. Renders as an inline block — mount it as the search entry point of a library / catalog UI.
- Owns its own state (expanded / query filter). Emits selection via `onSelect(genre)`.
- Zero external deps. Pure CSS + a `grid-template-rows: 0fr → 1fr` accordion trick for the expand.

## ASSETS
No image assets. One inline SVG (magnifier).
Font — Inter 400/500/600 via Google Fonts:
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap
```

## DESIGN TOKENS
```css
--bg:         #e6e6e6
--modal-bg:   #ffffff
--text:       #1a1a1a
--muted:      #888888
--border:     #f0f0f0
--hover-bg:   #f9f9f9
--link:       #00635d     /* teal — the genre link colour */
--link-hover: #004d48
--radius:     12px
```

## LAYOUT

### Wrapper (`.palette-wrapper`)
- `width: 700px; display: flex; flex-direction: column; gap: 12px`
- Entry animation: `popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards` (scale 0.95 → 1, opacity 0 → 1)
- Toggles `.expanded` on focus of the input to reveal the modal beneath.

### Title
- `<h2 class="main-title">Search and browse books</h2>` — 18px / 500 / `letter-spacing: -0.2px` / `margin: 0 0 4px 4px`

### Search bar (`.search-container`)
- White card, radius 12, `padding: 16px 20px`, `box-shadow: 0 4px 20px rgba(0,0,0,0.05)`, 1px transparent border
- Focus-within: shadow deepens to `0 8px 30px rgba(0,0,0,0.08)`, border becomes `#e0e0e0`
- Flex row: `<input>` (borderless, transparent, 15px, `flex-grow: 1`) + magnifier SVG (20px, colour `#a0a0a0`)
- Placeholder: `Title / Author / ISBN`

### Expandable modal (`.palette-modal-wrapper`)
- `display: grid; grid-template-rows: 0fr; opacity: 0; pointer-events: none; transform: translateY(-10px)`
- Transitions: `grid-template-rows 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`
- On `.palette-wrapper.expanded`: `grid-template-rows: 1fr; opacity: 1; pointer-events: auto; transform: translateY(0)`

### Modal card (`.palette-modal`)
- Radius 12, white bg, shadow `0 10px 40px rgba(0,0,0,0.08)`, `overflow: hidden; min-height: 0` (critical for the grid transition)
- Content padding: `24px`, `max-height: 400px`, `overflow-y: auto`
- Custom scrollbar: 6px, thumb `#ddd`, radius 10

### Genres grid (`.genres-grid`)
- `display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px 16px`
- Each link: `.genre-link` — 13px / colour `--link` / `text-decoration: none` / `padding: 4px 0` / `display: block` / hover underlines + darkens to `--link-hover`

### Default genres (30 items)
Ordered in 4-column reading order (left-to-right top-to-bottom):
```
Art · Biography · Business · Children's
Christian · Classics · Comics · Cookbooks
Ebooks · Fantasy · Fiction · Graphic Novels
Historical Fiction · History · Horror · Memoir
Music · Mystery · Nonfiction · Poetry
Psychology · Romance · Science · Science Fiction
Self Help · Sports · Thriller · Travel
Young Adult · More genres
```

### Empty state (`.no-results`)
- Hidden by default; shows when the query filters out every genre
- Centred, 14px, muted colour, 20px padding
- Copy: `No genres found matching your search.`

## BEHAVIOR

- **Focus input** → `wrapper.classList.add('expanded')`. Grid-rows expansion animates from 0fr → 1fr.
- **Click outside** the wrapper → `wrapper.classList.remove('expanded')`. Grid retracts smoothly.
- **Typing** in the input filters `genre-link` elements by case-insensitive substring match:
  - Matches: `display: block` (visible)
  - No matches: `display: none`
  - If zero results overall → hide the grid, show `.no-results` message
- **Click a genre** → optional `onSelect(genre)` callback, close palette.
- Enter key on input can trigger the currently first-visible genre if desired (component owns this).

## Responsive
- ≤700px: `.palette-wrapper` `width: 100% - 32px` (leave 16px margins), grid becomes `repeat(3, 1fr)`
- ≤500px: grid becomes `repeat(2, 1fr)`, title 16px, search padding shrinks to `14px 16px`
- Touch: min hit area 32px for genre links (increase `padding: 6px 0`)
- `prefers-reduced-motion: reduce`: cap grid transition to 200ms, drop the `popIn` entry keyframe (render at final state immediately)

## Deliverable Checklist
1. Inter font 400/500/600 loaded from Google Fonts
2. Body flex-centred on `#e6e6e6` background, `overflow: hidden`
3. Wrapper 700px wide, animated in via `popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)`
4. Title `Search and browse books` at 18px / 500 with negative letter-spacing
5. Search card white, radius 12, focus-within deeper shadow + `#e0e0e0` border tint
6. Magnifier SVG on right side, 20×20, muted `#a0a0a0`
7. Modal accordion via `grid-template-rows: 0fr → 1fr`, 0.6s cubic-bezier
8. Modal fade + `translateY(-10px)` on hidden state
9. `min-height: 0` on the inner modal card so the grid trick works
10. Custom 6px scrollbar with `#ddd` thumb, transparent track
11. 4-column genre grid, gap `12px 16px`
12. Each link 13px teal `#00635d`, hover darkens to `#004d48` + underline
13. Default 30-item genre list in exact reading-order sequence
14. Focus opens palette; click-outside closes (event delegated on `document`)
15. Live substring filter on input, case-insensitive
16. Empty state `.no-results` visible only when all links filter out
17. Placeholder `Title / Author / ISBN`
18. Wrapper `overflow: hidden` on body prevents page scroll
19. Responsive breakpoints at 700 and 500 (4 → 3 → 2 columns)
20. `prefers-reduced-motion` fallback + optional `onSelect(genre)` prop

---

**Awwwards-tier version →** https://cuedesign.space/component/cue075
