# Contributing to Cue Kit

Thanks for wanting to add a component. This library ships polished, motion-first React components paired with the AI prompts that designed them. Every contribution should meet that bar.

Solo-maintained by [@Alok619308](https://x.com/Alok619308). Review time: **3–5 days**.

---

## What kind of components we accept

- **Interactive React components** built with framer-motion, GSAP, Three.js, or vanilla CSS animation
- **Editorial-quality visual work** — original design, considered motion, no generic SaaS aesthetics
- **Self-contained** — no runtime backend dependencies, no external CDN assets that could disappear
- **TypeScript first** — `.tsx` with proper prop types
- **Client-side ready** — begin with `"use client"` if you use hooks or browser APIs

Not accepted:
- Straight clones of existing shadcn/ui components
- Purely static markup without motion or interaction
- Anything requiring paid API keys / private services

---

## Before you start

1. **Open an issue first** for anything larger than a bug fix. Describe the component (screenshot / video / codepen). This saves you time — I might reject the direction before you write code.
2. **Check the registry** (`lib/registry.ts`) — don't duplicate an existing component.
3. **Fork the repo**, clone locally, `npm install`, `npm run dev`.

---

## Component structure

Each new component ships three things:

```
components/foundations/<slug>.tsx    ← the React source
lib/prompts/<slug>.md                ← the AI prompt used to design it
lib/registry.ts                      ← one entry appended to the array
```

### 1. The `.tsx` source

- `slug` = kebab-case (`magnetic-button`, not `MagneticButton`)
- Filename: `<slug>.tsx`
- Exports the component (named or default)
- Ships a **Cue Foundations header comment** at the top:

```tsx
/**
 * Cue Foundations · <Component Name>
 * ────────────────────────────────────────────
 * <One-line description of what it does>
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/<slug>.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/<id>
 *   (leave the premiumHref blank if there is no paid version yet)
 * ────────────────────────────────────────────
 */
```

- Prefer **framer-motion** for physics-based motion, **GSAP** for scroll-pinned sequences
- Use Tailwind classes for styling; avoid global CSS. If unavoidable, scope with a namespace prefix
- Respect `prefers-reduced-motion` (motion-reduce Tailwind variant or an early return)

### 2. The prompt

`lib/prompts/<slug>.md` — the AI prompt someone could paste into v0 / Cursor / Bolt / Framer AI / Claude to regenerate the component.

- Include use case, framework hint, exact tokens (colors / spacing / typography), the visual spec, and any interaction rules
- Aim for the prompt to be self-sufficient (someone with no other context can generate an equivalent)

### 3. The registry entry

Append to the array in `lib/registry.ts`:

```ts
{
  slug: "your-slug",
  name: "Your Component Name",
  description: "One-line description shown on the grid card and detail page.",
  category: "buttons" | "inputs" | "cards" | "layouts" | "motion" | "overlays" | "charts" | "typography",
  tags: ["tag-a", "tag-b"],
  dependencies: ["framer-motion"],       // npm packages required
  sourcePath: "components/foundations/your-slug.tsx",
  promptPath: "lib/prompts/your-slug.md",
  previewMode: "live" | "video" | "image" | "html",
  videoSrc: "https://your-hosted-preview.mp4",   // optional but strongly preferred
  posterSrc: "https://your-poster.jpg",          // fallback + <video> poster
  addedAt: "2026-01-15",
  updatedAt: "2026-01-15",
  isNew: true,
  contributor: { name: "Your Name", href: "https://x.com/yourhandle" },
  api: {
    main: {
      name: "YourComponent",
      props: [
        { name: "children", type: "ReactNode", description: "..." },
      ],
    },
  },
  related: ["slug-a", "slug-b"],   // optional
}
```

### Preview mode picking rules

- **`live`** — small self-contained interactive components (buttons, cards, toggles). Add a wrapper in `components/previews/foundations/<slug>.tsx` and register it in `lib/preview-map.ts` under `SAFE_LIVE_SLUGS`.
- **`video`** — heavy scroll-pinned / GSAP / three.js components that would fight the docs layout. Host an MP4 (720p+) and link `videoSrc`.
- **`html`** — components authored as pure HTML/CSS/JS. Rename source to `.html`. Docs page iframes it.
- **`image`** — final fallback. Ships poster only.

---

## PR checklist

Before opening the PR, verify:

- [ ] `npm run build` passes locally
- [ ] Component renders correctly on `/components/<slug>` in dev
- [ ] Prompt regenerates a visually similar component when pasted into v0 or Cursor
- [ ] Preview panel (live / video / html) works on the detail page
- [ ] shadcn CLI endpoint returns valid JSON: `curl localhost:3000/r/<slug>.json | jq`
- [ ] Registry entry has all required fields
- [ ] Contributor field points to your X handle or GitHub
- [ ] No breaking changes to existing components
- [ ] No hardcoded colors outside the DNA palette (`#111827`, `#5C6DFF`, `#FAFAFA`, etc.) unless the component IS the color reference

---

## Design DNA

Cue Kit follows a strict visual language (extracted from Cue's own Stacker Bento component):

- **White canvas** (`#FFFFFF`), **`#FAFAFA`** feature surfaces
- **Inter typography** — 400 body, 500 headings, 600 card titles
- **4px card radius** — no bubbly 24px+ containers
- **Subtle DNA shadow** — `0 12px 30px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.02)`
- **Indigo `#5C6DFF`** accent, restrained
- **No** glassmorphism, gradient-heavy UI, neon, or excessive decoration

Match this language in the docs site, but your component itself can look however it needs to.

---

## Recognition

Contributors get:
- Attribution in the component's `contributor:` field (name + X/GitHub link)
- Credit on the detail page ("Contributed by ...")
- Mention in the release notes when the component ships

---

## Getting help

- Small questions → [GitHub Discussions](https://github.com/aloksivastava1025-prog/cue-foundations/discussions)
- Bugs → [Issues](https://github.com/aloksivastava1025-prog/cue-foundations/issues)
- Direct → [@Alok619308](https://x.com/Alok619308) on X

Ship Awwwards-tier or don't ship.
