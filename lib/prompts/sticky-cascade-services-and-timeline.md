# Sticky Cascade Services & Timeline — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for a design/component library or agency marketing site wanting a craft-forward services showcase plus a narrative about/history section.

---

# Services Deck (Sticky Cascade) + About Timeline

## Framework & Integration
- Add to your existing Next.js / Vite React app. Do NOT scaffold anything new.
- Import as two independent, composable exports:
  - `<ServicesDeck items?={services} />` — sticky-cascade tabbed cards
  - `<AboutTimeline heading? subtext? experience?={rows} />` — blur-in copy + scroll-linked timeline
- Or the wrapper `<ServicesAboutPage />` that renders both back-to-back like the reference.
- Dependencies: `framer-motion` ≥ 10, Tailwind CSS.

## ASSETS
Card images — 4 exact Pinterest URLs (do not change):
```
CARD_1 = https://i.pinimg.com/736x/2b/05/80/2b0580d548248a24d6e4f84bc413a142.jpg
CARD_2 = https://i.pinimg.com/736x/26/32/5b/26325bfd9131880dc4d695cd229508cc.jpg
CARD_3 = https://i.pinimg.com/736x/2e/0a/74/2e0a74bd4db9a61a4f6061feb620b607.jpg
CARD_4 = https://i.pinimg.com/736x/2a/4e/30/2a4e308d142e5c38b1d7c83025566e47.jpg
```
Font — Manrope 400/500/600 from Google Fonts.

## DESIGN TOKENS
```css
--page-bg:    #FFFFFF
--text:       #101519
--muted:      #606366
--divider:    #B5B7B8
--pill-border:#929496
--tab-1:      #F9FFDE   /* pale yellow-green */
--tab-2:      #D9F0FF   /* pale blue */
--tab-3:      #D8FFAB   /* pastel lime */
--tab-4:      #84F5E8   /* mint */
--accent:     #E1790A   /* orange badge text */
--ease-hero:  cubic-bezier(0.16, 1, 0.3, 1)
```

## LAYOUT — Services Deck

### Section wrapper
- `pt-[96px] w-full flex flex-col items-center gap-[64px] bg-white px-4`

### Header cluster (centred)
- Small badge `CUE LIBRARY` — `text-[12px] font-medium text-[#E1790A] border border-[#B5B7B8] px-4 py-2 rounded-full uppercase tracking-wider bg-white`
- Sub-headline `h4` (700px max, centred, snug leading, 20/24px medium): `The ultimate curated component library for AI builders. Awwwards-tier craft, paste-ready prompts, and production-grade code that just works.`

### Cards container
- `w-full flex flex-col relative pb-[200px]` — the extra bottom padding creates room for the last card to breathe.

### Service card (repeats 4×)
Each card is `w-full max-w-[1000px] mx-auto sticky` and receives an **incremental sticky `top` offset** so cards stack in a growing cascade:
- Card 1 `top: 120`, z-index 1
- Card 2 `top: 150`, z-index 2
- Card 3 `top: 180`, z-index 3
- Card 4 `top: 210`, z-index 4

Each card has two parts joined at the top-left:

**A. Tab strip (left flat + right skew mask)**
- Flat left segment:
  - `flex items-center gap-4 px-6 py-4 rounded-tl-[16px] relative z-10 w-[240px] md:w-[280px]`
  - `bg-color: data.color`
  - Contains number (18px / 500 / --text) and title (20px md:24px / 500 / --text, whitespace-nowrap)
- Skewed mask right segment:
  - `w-[80px] relative overflow-hidden -ml-4 z-0`
  - Inside: `absolute inset-0 rounded-tr-[16px] origin-bottom-left`, `bg-color: data.color`, `transform: skewX(50deg)`
- Combined they look like a *file-folder tab* attached to the top-left of the card body.

**B. Card body**
- `flex flex-col md:flex-row gap-[32px] p-[32px] md:p-[48px] rounded-tr-[16px] rounded-b-[16px] drop-shadow-2xl shadow-black/5`
- `bg-color: data.color` (matches tab)
- Left column (`w-full md:w-1/2 flex flex-col gap-6 md:gap-8 justify-center`):
  - Tags row: each pill `text-[10px] md:text-[12px] font-medium text-[#414548] border border-[#929496] px-3 py-1 rounded-full uppercase tracking-wide`
  - Description paragraph: `text-[14px] text-[#101519] leading-relaxed max-w-[90%]`
- Right column (`w-full md:w-1/2`):
  - Aspect-video image, `rounded-[8px] overflow-hidden bg-white/20`
  - `object-cover`
  - `whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } }}`

### Card entrance
- Framer Motion variants:
  ```
  hidden:  { y: 100, opacity: 0 }
  visible: { y: 0,  opacity: 1, transition: { duration: 0.8, ease: [0.16,1,0.3,1] } }
  ```
- `initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}`

### Data (default items)
```
01 What is Cue?                --tab-1  ["Components", "Curated", "Library", "Design System"]
02 Awwwards-tier craft.        --tab-2  ["Awwwards", "SOTD", "Premium", "Craft"]
03 Paste-ready prompts.        --tab-3  ["AI Prompts", "Bolt", "v0", "Cursor"]
04 Working code always.        --tab-4  ["HTML", "CSS", "JS", "React"]
```
Copy (verbatim):
- 01: `Cue is a meticulously curated component library designed for the modern web. It bridges the gap between high-end aesthetic design and developer-friendly code, offering a comprehensive suite of premium UI elements that elevate your digital products instantly.`
- 02: `Every component in the Cue library is crafted with the same obsessive attention to detail found in Site of the Day winners. We focus on hyper-polished micro-interactions, flawless typography, and fluid spring physics to deliver a cinematic user experience.`
- 03: `Accelerate your workflow with AI-optimized blueprints. Simply copy and paste our exact prompt strings into Bolt, v0, or Cursor, and watch as complex, animated layouts are generated flawlessly with zero design friction.`
- 04: `No more wrestling with broken abstractions or half-finished concepts. Cue provides production-ready HTML, CSS, and JS components. Everything runs beautifully out of the box, letting you ship stunning landing pages this weekend.`

## LAYOUT — About Timeline

### Section wrapper
- `py-[96px] w-full min-h-screen flex flex-col items-center gap-[64px] bg-white px-6`

### Header
- Orange badge `About Cue` — same styling as CUE LIBRARY badge; entrance `y: 20→0, opacity 0→1, 0.6s easeOut`

### BlurText paragraphs
- Both paragraphs use a per-word blur+rise reveal:
  - Container variants: `hidden { opacity: 0 } / visible { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } }`
  - Word variants: `hidden { opacity: 0, y: 10, filter: blur(10px) } / visible { opacity: 1, y: 0, filter: blur(0px), transition: { type: 'spring', damping: 20, stiffness: 100 } }`
  - Rendered as a `flex flex-wrap justify-center` container of `<motion.span mr-[0.25em]>` per word.
- Paragraph 1: 24px / md:32px / md:leading-[1.4] / --text — copy:
  > `We are a collective of obsessive engineers and designers who believe that AI generation shouldn't mean the end of craft. With a deep understanding of motion physics and UI aesthetics, we create components that feel both intentional and premium.`
- Paragraph 2: 20px / md:28px / md:leading-[1.4] / --muted — copy:
  > `Whether it's perfecting a complex layout, refining a fluid micro-interaction, or optimizing code for AI prompts, our goal is always the same: empower you to build work that resonates.`

### Experience timeline
Container `flex flex-col w-full max-w-[800px] mt-[64px] relative`. Uses `useScroll` on the container ref with `offset: ["start center", "end center"]` and `useTransform(scrollYProgress, [0, 1], [0, 1])` to drive the drawn line.

- **Base inactive line**: `absolute left-[19px] top-[14px] bottom-[10px] w-[2px] bg-[#101519] opacity-20 z-0`
- **Active drawn line**: same rect, `bg-[#101519] z-10`, style `{ scaleY, transformOrigin: 'top' }` so it draws from top to bottom as the user scrolls.
- **Row layout** (`flex flex-row gap-6 md:gap-12 w-full relative z-10`):
  - Left rail column `w-[40px] shrink-0 mt-2 flex flex-col items-center`
    - Dot: 12×12 circle, 2px border --text, bg-white, z-20
    - Dot light-up: `initial={{ opacity: 0.2 }} whileInView={{ opacity: 1 }} viewport={{ once: false, margin: '-150px' }} transition={{ duration: 0.4 }}`
  - Content column (`motion.div initial y:20/opacity:0 → whileInView 0/1, 0.6s easeOut, delay 0.1`):
    - Title row (`flex md:justify-between md:items-center gap-2`):
      - `h5` role text 20px / 600 / --text
      - Date 14px / --muted / `whitespace-nowrap`
    - Workplace label 14px / --muted / uppercase / tracking-widest
    - Description 16px / --muted / leading-relaxed / max-w-[600px]
  - Bottom padding `pb-16` except last item.

### Timeline copy (verbatim)
```
Cue v1.0 Launched              | 2024 - Present | The Component Revolution
  Empowering thousands of builders worldwide with paste-ready, Awwwards-tier components perfectly optimized for modern AI code generators like Bolt and Cursor.

Prototyping & Physics          | 2023 - 2024    | Perfecting The Craft
  We obsessed over spring animations and fluid micro-interactions, meticulously bridging the gap between high-end aesthetic design and developer-friendly code.

Architecting The System        | 2022 - 2023    | Laying The Foundation
  Building the robust design system that powers Cue. We focused on accessible markup, scalable Tailwind utilities, and flawless React structures.

The Agency Origins             | 2020 - 2022    | Where It All Started
  Before Cue, we ran an award-winning digital studio, designing and engineering bespoke web experiences for hyper-growth startups and visionary brands.
```

## Behaviour
- `html { scroll-behavior: smooth }` on the page for premium sticky cascade feel.
- `overflow-x: hidden` on body to swallow any 1px scroll from the skewed mask.
- Cards are `position: sticky`; the outer scroll driver is the natural page scroll — no libraries needed.
- Timeline dots use `viewport: { once: false }` so they can pulse on/off as user scrubs; the drawn line uses `useScroll` — falls back to the always-drawn state if `prefers-reduced-motion` is set.

## Responsive
- md ≥768: card padding grows 32→48, image aspect goes to 2-col, tag pill 10→12px, headline sub scales
- <768: cards stack column-first, tabs stay 240px wide (may clip title — allow it via `whitespace-nowrap` or shrink title to 20px on `sm:`)
- Timeline: rail stays 40px, content column takes remainder. On mobile the date drops beneath the role.
- Touch: no hover — scale-on-hover degrades gracefully.
- `prefers-reduced-motion: reduce`: disable card entrance transforms, blur filter reveal, image scale-hover, and dot pulse.

## Deliverable Checklist
1. Manrope font loaded 400/500/600
2. `overflow-x: hidden` body + `scroll-behavior: smooth` html
3. `CUE LIBRARY` badge in orange text, gray-border pill
4. Sub-headline max-w-700 centred
5. 4 sticky-cascade service cards with 30px-incrementing `top` offsets and matching z-index
6. Each card has a coloured file-folder tab: flat left segment + skewed right mask (skewX(50deg), origin bottom-left)
7. Tab number 18px / 500, tab title 20/24px / 500, both `--text`
8. Card body two-column: tags + description left, aspect-video image right
9. Tag pill `border-[#929496] rounded-full uppercase tracking-wide`
10. Image `whileHover scale: 1.05` with spring 300/20
11. Card entrance: `y: 100 → 0, opacity 0 → 1, 0.8s ease [0.16,1,0.3,1]` triggered `whileInView`
12. About section badge `About Cue` orange with border-pill styling
13. BlurText: two paragraphs, per-word stagger 0.04s, blur(10px)→blur(0) + y(10)→0 spring
14. Timeline container: inactive gray line + active black line drawn via `useScroll + useTransform` (`scaleY: 0→1, origin: top`)
15. Timeline dots: 12×12 with 2px --text border, bg white, `opacity 0.2 → 1` on `whileInView` (once:false)
16. Timeline content row: role + date + workplace + description, staggered enter
17. Last row has `pb-0`, others `pb-16`
18. Cards exact colours: `#F9FFDE`, `#D9F0FF`, `#D8FFAB`, `#84F5E8`
19. All accent orange copy uses `#E1790A`
20. Responsive breakpoints (md, sm) + `prefers-reduced-motion` fallback

---

**Awwwards-tier version →** https://cuedesign.space/component/cue067
