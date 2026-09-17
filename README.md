# Cue Foundations

Open-source foundational components with code **and** the AI prompts that designed them — curated from [Cue's](https://cuedesign.space) premium library.

- **44 components** (24 with React source, 20 as AI prompts)
- **shadcn CLI compatible** — one command install
- **Every component ships with its AI prompt** — copy into v0, Cursor, Bolt, Framer AI, or Claude to regenerate from scratch
- **MIT licensed** — use anywhere

Docs: [foundations.cuedesign.space](https://foundations.cuedesign.space) · Premium tier: [cuedesign.space](https://cuedesign.space)

---

## Install a component

```bash
bunx --bun shadcn add https://foundations.cuedesign.space/r/phantom-infinite-gallery.json
```

Also works with `npx shadcn@latest`, `pnpm dlx`, `yarn dlx`.

## Copy an AI prompt

Every component's docs page has a **Prompt** tab. Paste it into any AI builder to regenerate the component styled to your design tokens.

## Development

```bash
npm install
npm run dev
```

Site runs at `http://localhost:3000`.

## Structure

- `components/foundations/` — the shipped `.tsx` sources
- `lib/prompts/` — the AI prompts that designed each component
- `lib/registry.ts` — single source of truth (drives site + shadcn endpoint)
- `app/r/[slug]/route.ts` — shadcn CLI JSON endpoint
- `app/components/[slug]/page.tsx` — per-component docs page

## Design DNA

The site itself is styled per Cue's Design DNA — a taste-transferable design language extracted from Cue's Stacker Bento component: white canvas, Inter typography, 4px feature-card geometry, indigo `#5C6DFF` accent, subtle DNA-spec elevation.

## Contributing

**Now:** bug fixes and docs PRs welcome — read [CONTRIBUTING.md](CONTRIBUTING.md) for the structure and PR checklist.

**Later (Q1 2026):** new component contributions open once I have the review bandwidth to keep the taste bar tight. Star the repo to get notified.

## License

MIT — use anywhere, commercial or personal, no attribution required. See [LICENSE](LICENSE).

## Built by

[@Alok619308](https://x.com/Alok619308) — solo founder of [Cue](https://cuedesign.space).
