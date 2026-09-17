/**
 * Cue Foundations — component registry
 * ────────────────────────────────────────────
 * Single source of truth for every OSS component in the library.
 * Each entry drives:
 *   • The docs page at /components/[slug]
 *   • The shadcn CLI install endpoint at /r/[slug].json
 *   • The AI-prompt page at /prompts/[slug]
 *
 * To add a new component:
 *   1. Drop the source .tsx into components/foundations/
 *   2. Drop the AI prompt .md into lib/prompts/
 *   3. Add an entry below with `sourcePath` + `promptPath`
 *   4. The site + registry endpoint pick it up automatically
 * ────────────────────────────────────────────
 */

export type RegistryDependency = string

/**
 * Preview mode — how the docs page should render this component:
 *
 *  • "live"  — mount the actual React component (best for interactive
 *              patterns: buttons, inputs, cards, tabs, modals).
 *  • "video" — play an MP4 loop (best for scroll effects, WebGL,
 *              page-load animations that don't run cleanly in a docs
 *              iframe). Point `videoSrc` at /previews/<slug>.mp4 in
 *              /public, or at an absolute URL (Cloudflare R2, etc.).
 *  • "image" — static fallback (poster JPG/PNG). Cheapest, weakest.
 *
 * Every component ships a `posterSrc` regardless of mode — the site
 * uses it as the <video>'s poster attribute (video mode) and as the
 * grid-card thumbnail on the homepage.
 */
export type PreviewMode = "live" | "video" | "image" | "html"

/** A single prop on a component's public API. */
export type PropSpec = {
  name: string
  /** TypeScript type as a string, e.g. "string", "number", `"HeatCalendarSelection | null"`. */
  type: string
  description: string
  /** Trailing "?" indicates the prop is optional in the docs table. */
  optional?: boolean
}

/** A related component grouping (e.g. main + sub-parts like Grid, Legend, Tooltip). */
export type SubComponent = {
  name: string
  props: PropSpec[]
}

/** Attribution / provenance shown at the bottom of the detail page. */
export type Contributor = {
  name: string
  href?: string
}

export type RegistryItem = {
  slug: string
  name: string
  description: string
  category: "buttons" | "inputs" | "cards" | "layouts" | "motion" | "overlays" | "charts" | "typography"
  dependencies: RegistryDependency[]
  /** Prompt-only components leave sourcePath blank. */
  sourcePath: string
  promptPath: string
  /** false = only the AI prompt is shipped (no React source yet). */
  codeAvailable?: boolean
  /** How the docs should preview this component. */
  previewMode: PreviewMode
  /** Path or URL to the preview video (only when previewMode === "video"). */
  videoSrc?: string
  /** Poster / thumbnail — used by grid cards and as the <video poster>. */
  posterSrc?: string
  /** Optional link back to the premium Awwwards-tier version on cuedesign.space */
  premiumHref?: string
  addedAt: string
  /** ISO date of the last meaningful edit. Rendered at the bottom of the docs page. */
  updatedAt?: string
  /** Shown as a "NEW" badge next to the title while true. */
  isNew?: boolean
  /** Full API reference: main component + optional sub-components. Rendered as the API Reference section. */
  api?: {
    main: { name: string; props: PropSpec[] }
    subs?: SubComponent[]
  }
  /** Slugs of other registry items shown in the "Related components" strip. */
  related?: string[]
  /** Attribution row at the bottom of the detail page. */
  contributor?: Contributor
}

export const registry: RegistryItem[] = [
  {
    slug: "stacker-style-bento-grid",
    name: "Stacker Style Bento Grid",
    description: "A white-page features section with a masked headline reveal and a 3/2/2/3 bento grid of animated flowchart, profile, and network cards.",
    category: "layouts",
    tags: ["bento-grid","scroll-reveal","masked-headline","saas"],
    dependencies: ["gsap"],
    sourcePath: "components/foundations/stacker-style-bento-grid.tsx",
    promptPath: "lib/prompts/stacker-style-bento-grid.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1789651843977-a6c247bcce8d40f6bde92b65881273a3.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1789651846591-494f34bb4f2147f780004c4aa0ff65a2.jpg",
    premiumHref: "https://cuedesign.space/component/cue171",
    addedAt: "2026-09-17",
    updatedAt: "2026-09-17",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["split-panel-image-synced-faq-features","minimal-ai-dev-workspace","scrollspy-line-navigation"],
  },
  {
    slug: "stacked-deck-scroll-reveal",
    name: "Stacked Deck Scroll Reveal",
    description: "A pinned scroll sequence where staggered cards stack, then fly out one by one to reveal an editorial case-study deck.",
    category: "motion",
    tags: ["pinned-scroll","stacked-cards","gsap","editorial"],
    dependencies: ["gsap","lenis"],
    sourcePath: "components/foundations/stacked-deck-scroll-reveal.tsx",
    promptPath: "lib/prompts/stacked-deck-scroll-reveal.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788718048297-e10031cbb73b4ff182de8a84a00ac882.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788718110023-6f4bb5b1082d4b56835917df3021caef.jpeg",
    premiumHref: "https://cuedesign.space/component/cue148",
    addedAt: "2026-09-06",
    updatedAt: "2026-09-06",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["gooey-liquid-feedback-drop","3d-book-carousel-reading-mode","chained-spring-arc-carousel"],
  },
  {
    slug: "phantom-infinite-gallery",
    name: "Phantom Infinite Gallery",
    description: "An infinite draggable/throwable image grid with cursor spotlight, 3D arc tilt, and a typewriter-caption focus mode on click.",
    category: "cards",
    tags: ["draggable-grid","spotlight-cursor","typewriter","inertia-scroll","webgl"],
    dependencies: [],
    sourcePath: "components/foundations/phantom-infinite-gallery.tsx",
    promptPath: "lib/prompts/phantom-infinite-gallery.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788430258389-c4b6e08b91804733ac4a65e1f86dc6cc.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788430262944-3e8a5910ab2846108bebda3e03484ca4.jpg",
    premiumHref: "https://cuedesign.space/component/cue129",
    addedAt: "2026-09-03",
    updatedAt: "2026-09-03",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["collapsing-cards-accordion"],
  },
  {
    slug: "split-panel-image-synced-faq-features",
    name: "Split Panel Image-Synced FAQ/Features",
    description: "A two-panel FAQ accordion where opening a question cross-fades a de-blurring poster-style image on the right using pure CSS grid-row transitions.",
    category: "layouts",
    tags: ["accordion","faq","image-crossfade","split-panel"],
    dependencies: [],
    sourcePath: "components/foundations/split-panel-image-synced-faq-features.tsx",
    promptPath: "lib/prompts/split-panel-image-synced-faq-features.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788241247872-4d1a84ae03154a40a9deb5af70b193b1.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788241249143-6bc22db2f7504bf59c606c37b4181609.jpg",
    premiumHref: "https://cuedesign.space/component/cue122",
    addedAt: "2026-09-01",
    updatedAt: "2026-09-01",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["stacker-style-bento-grid","minimal-ai-dev-workspace","scrollspy-line-navigation"],
  },
  {
    slug: "collapsing-cards-accordion",
    name: "Collapsing Cards Accordion",
    description: "A five-image horizontal accordion where hovering a card expands it with smooth flex transitions while others collapse to vertical wordmarks.",
    category: "cards",
    tags: ["accordion","hover-expand","flex-transition","editorial"],
    dependencies: [],
    sourcePath: "components/foundations/collapsing-cards-accordion.tsx",
    promptPath: "lib/prompts/collapsing-cards-accordion.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788192939356-e5c0dd6b19cb4fcc803b78e1c7e456e3.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788192941003-b58d67e3e4de4b538f2de9cf530ed8a6.jpg",
    premiumHref: "https://cuedesign.space/component/cue115",
    addedAt: "2026-08-31",
    updatedAt: "2026-08-31",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["phantom-infinite-gallery"],
  },
  {
    slug: "minimal-ai-dev-workspace",
    name: "Minimal AI Dev Workspace",
    description: "A clean, off-white developer copilot workspace with sidebar navigation, chat history, and a code-aware chat input box.",
    category: "layouts",
    tags: ["chat-interface","sidebar-nav","spa","developer-tool"],
    dependencies: [],
    sourcePath: "components/foundations/minimal-ai-dev-workspace.tsx",
    promptPath: "lib/prompts/minimal-ai-dev-workspace.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788000377856-ft1aii.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788000380485-eea5q7.jpg",
    premiumHref: "https://cuedesign.space/component/cue102",
    addedAt: "2026-08-29",
    updatedAt: "2026-08-29",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["stacker-style-bento-grid","split-panel-image-synced-faq-features","scrollspy-line-navigation"],
  },
  {
    slug: "dynamic-island-feedback-notch",
    name: "Dynamic Island Feedback Notch",
    description: "A header-mounted notch that drops down, expands into a hoverable emoji poll, then slides away after submission with mode and theme switching.",
    category: "overlays",
    tags: ["dynamic-island","poll","micro-interaction","dark-mode","feedback"],
    dependencies: [],
    sourcePath: "components/foundations/dynamic-island-feedback-notch.tsx",
    promptPath: "lib/prompts/dynamic-island-feedback-notch.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787922628739-x73g2x.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787922630919-1yi6cl.jpg",
    premiumHref: "https://cuedesign.space/component/cue096",
    addedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["dynamic-notch-activity-indicator"],
  },
  {
    slug: "gooey-liquid-feedback-drop",
    name: "Gooey Liquid Feedback Drop",
    description: "A scroll-triggered liquid blob simulated with a custom RAF physics engine and SVG gooey filter that bounces, morphs into a dark feedback modal, and rockets away on submit.",
    category: "motion",
    tags: ["gooey-filter","physics-animation","scroll-trigger","svg-filter","Feedback","Poll"],
    dependencies: [],
    sourcePath: "components/foundations/gooey-liquid-feedback-drop.tsx",
    promptPath: "lib/prompts/gooey-liquid-feedback-drop.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787847440714-l8poz6.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787847442443-9uu5hb.jpg",
    premiumHref: "https://cuedesign.space/component/cue091",
    addedAt: "2026-08-27",
    updatedAt: "2026-08-27",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["stacked-deck-scroll-reveal","3d-book-carousel-reading-mode","chained-spring-arc-carousel"],
  },
  {
    slug: "dot-matrix-cascade-typography",
    name: "Dot-Matrix Cascade Typography",
    description: "A canvas-based engine converts typed text into scanline dot arrays that cascade outward from a central axis with wave-eased timing and drifting hue color.",
    category: "typography",
    tags: ["canvas","dot-matrix","kinetic-type","hsl-shimmer"],
    dependencies: [],
    sourcePath: "components/foundations/dot-matrix-cascade-typography.tsx",
    promptPath: "lib/prompts/dot-matrix-cascade-typography.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787775852997-gu6ygt.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787775957691-slr5l2.png",
    premiumHref: "https://cuedesign.space/component/cue087",
    addedAt: "2026-08-26",
    updatedAt: "2026-08-26",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
  },
  {
    slug: "scrollspy-line-navigation",
    name: "Scrollspy Line Navigation",
    description: "A fixed left-side nav of expanding line indicators that track scroll position and trigger custom eased smooth-scrolling to blog sections.",
    category: "layouts",
    tags: ["scrollspy","smooth-scroll","minimalist","blog"],
    dependencies: [],
    sourcePath: "components/foundations/scrollspy-line-navigation.tsx",
    promptPath: "lib/prompts/scrollspy-line-navigation.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787764179711-tp4iuh.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787764197486-6r02or.jpg",
    premiumHref: "https://cuedesign.space/component/cue084",
    addedAt: "2026-08-26",
    updatedAt: "2026-08-26",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["stacker-style-bento-grid","split-panel-image-synced-faq-features","minimal-ai-dev-workspace"],
  },
  {
    slug: "isometric-mechanical-keycap",
    name: "Isometric Mechanical Keycap",
    description: "A pure CSS/JS button styled as a physically extruded mechanical keycap in an isometric socket, with a snappy spring-press animation and theme-switchable colors.",
    category: "buttons",
    tags: ["isometric","3d-extrusion","mechanical-keycap","css-variables","webgl"],
    dependencies: [],
    sourcePath: "components/foundations/isometric-mechanical-keycap.tsx",
    promptPath: "lib/prompts/isometric-mechanical-keycap.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787755132236-lfaqre.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787755192011-8usz0m.jpg",
    premiumHref: "https://cuedesign.space/component/cue083",
    addedAt: "2026-08-26",
    updatedAt: "2026-08-26",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
  },
  {
    slug: "expandable-book-search-palette",
    name: "Expandable Book Search Palette",
    description: "An expandable search bar that reveals a filterable genre grid via a grid-rows accordion trick, styled with clean editorial typography.",
    category: "inputs",
    tags: ["command-palette","accordion","genre-grid","search"],
    dependencies: [],
    sourcePath: "components/foundations/expandable-book-search-palette.tsx",
    promptPath: "lib/prompts/expandable-book-search-palette.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787678665615-ccqkck.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787678672451-9xxkme.jpg",
    premiumHref: "https://cuedesign.space/component/cue075",
    addedAt: "2026-08-25",
    updatedAt: "2026-08-25",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["add-product-wizard-modal"],
  },
  {
    slug: "3d-book-carousel-reading-mode",
    name: "3D Book Carousel Reading Mode",
    description: "A perspective-driven CSS 3D shelf of books that morphs spines into covers as you scroll, opening into a two-phase rise-and-swing reading spread.",
    category: "motion",
    tags: ["3d-transform","carousel","drag-interaction","raf-loop","webgl"],
    dependencies: [],
    sourcePath: "components/foundations/3d-book-carousel-reading-mode.tsx",
    promptPath: "lib/prompts/3d-book-carousel-reading-mode.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787677392201-q2ljat.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787677396145-ag2edi.jpg",
    premiumHref: "https://cuedesign.space/component/cue074",
    addedAt: "2026-08-25",
    updatedAt: "2026-08-25",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["stacked-deck-scroll-reveal","gooey-liquid-feedback-drop","chained-spring-arc-carousel"],
  },
  {
    slug: "dynamic-notch-activity-indicator",
    name: "Dynamic Notch Activity Indicator",
    description: "A macOS-style notch that morphs width and accent color to visualize live agent states like reading, writing, and running commands.",
    category: "overlays",
    tags: ["dynamic-island","state-machine","shimmer-text","pixel-icon"],
    dependencies: [],
    sourcePath: "components/foundations/dynamic-notch-activity-indicator.tsx",
    promptPath: "lib/prompts/dynamic-notch-activity-indicator.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787647205641-7wfi5u.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787647209312-selri9.jpg",
    premiumHref: "https://cuedesign.space/component/cue072",
    addedAt: "2026-08-25",
    updatedAt: "2026-08-25",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["dynamic-island-feedback-notch"],
  },
  {
    slug: "flex-grow-benefits-reveal",
    name: "Flex-Grow Benefits Reveal",
    description: "A four-card benefits row where hovering expands a card via flex-grow and cross-fades from a mosaic closed state to a detailed opened pane.",
    category: "layouts",
    tags: ["hover-reveal","flex-grow","cross-fade","css-only"],
    dependencies: [],
    sourcePath: "components/foundations/flex-grow-benefits-reveal.tsx",
    promptPath: "lib/prompts/flex-grow-benefits-reveal.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788247311538-k2mwpu.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787557700951-33xl6z.jpg",
    premiumHref: "https://cuedesign.space/component/cue069",
    addedAt: "2026-08-24",
    updatedAt: "2026-08-24",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["stacker-style-bento-grid","split-panel-image-synced-faq-features","minimal-ai-dev-workspace"],
  },
  {
    slug: "sticky-cascade-services-and-timeline",
    name: "Sticky Cascade Services & Timeline",
    description: "A sticky-cascade services deck with file-folder tab cards paired with a blur-reveal about section and scroll-drawn timeline.",
    category: "layouts",
    tags: ["sticky-scroll","scroll-linked","blur-text","timeline"],
    dependencies: ["framer-motion"],
    sourcePath: "components/foundations/sticky-cascade-services-and-timeline.tsx",
    promptPath: "lib/prompts/sticky-cascade-services-and-timeline.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788247406108-zux5qn.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787549916915-osuxya.jpg",
    premiumHref: "https://cuedesign.space/component/cue067",
    addedAt: "2026-08-24",
    updatedAt: "2026-08-24",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["stacker-style-bento-grid","split-panel-image-synced-faq-features","minimal-ai-dev-workspace"],
  },
  {
    slug: "add-product-wizard-modal",
    name: "Add Product Wizard Modal",
    description: "A 4-step product-creation modal with drafts, drag-drop image upload, toggle settings, and an animated success screen.",
    category: "inputs",
    tags: ["multi-step-form","modal","drag-drop","localstorage","validation"],
    dependencies: [],
    sourcePath: "components/foundations/add-product-wizard-modal.tsx",
    promptPath: "lib/prompts/add-product-wizard-modal.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788247234657-t9rtso.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787520457304-whi3ty.jpg",
    premiumHref: "https://cuedesign.space/component/cue064",
    addedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["expandable-book-search-palette"],
  },
  {
    slug: "chained-spring-arc-carousel",
    name: "Chained Spring Arc Carousel",
    description: "A 10-card fanned wheel carousel where scroll input triggers a chained spring ripple, propagating tension outward from the leading card like a plucked string.",
    category: "motion",
    tags: ["carousel","physics","spring-animation","scroll-driven","vanilla-js","fan-arc"],
    dependencies: [],
    sourcePath: "components/foundations/chained-spring-arc-carousel.tsx",
    promptPath: "lib/prompts/chained-spring-arc-carousel.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788247372936-9a7d5x.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787507012960-p91a4f.jpeg",
    premiumHref: "https://cuedesign.space/component/cue063",
    addedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["stacked-deck-scroll-reveal","gooey-liquid-feedback-drop","3d-book-carousel-reading-mode"],
  },
  {
    slug: "sticker-collage-peel-footer",
    name: "Sticker Collage Peel Footer",
    description: "A fixed blue footer with hand-drawn CSS stickers and a giant springy letter-pop wordmark is revealed as the main content peels upward on scroll.",
    category: "layouts",
    tags: ["footer","scroll-reveal","kinetic-type","css-stickers","gen-z","intersectionobserver"],
    dependencies: [],
    sourcePath: "components/foundations/sticker-collage-peel-footer.tsx",
    promptPath: "lib/prompts/sticker-collage-peel-footer.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788247109419-keizxu.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787501555942-kgdu28.jpeg",
    premiumHref: "https://cuedesign.space/component/cue062",
    addedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["stacker-style-bento-grid","split-panel-image-synced-faq-features","minimal-ai-dev-workspace"],
  },
  {
    slug: "fisheye-chromatic-card-grid",
    name: "Fisheye Chromatic Card Grid",
    description: "An infinitely wrapping draggable 5×5 grid of image cards rendered in Three.js with a custom shader that bulges edges and splits RGB channels.",
    category: "motion",
    tags: ["webgl","three.js","shader","chromatic-aberration","fisheye","infinite-scroll"],
    dependencies: ["three"],
    sourcePath: "components/foundations/fisheye-chromatic-card-grid.tsx",
    promptPath: "lib/prompts/fisheye-chromatic-card-grid.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788246839205-8omoye.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787473187642-zxqm80.jpg",
    premiumHref: "https://cuedesign.space/component/cue059",
    addedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["stacked-deck-scroll-reveal","gooey-liquid-feedback-drop","3d-book-carousel-reading-mode"],
  },
  {
    slug: "synt-x-hardware-media-player",
    name: "Synt-X Hardware Media Player",
    description: "A pixel-perfect, physical-feeling audio-visual player device with debossed branding, dot-matrix grille, hardware buttons, and cursor-driven 3D tilt.",
    category: "motion",
    tags: ["skeuomorphic","3d-tilt","video-player","hardware-ui","vanilla-js","webgl"],
    dependencies: [],
    sourcePath: "components/foundations/synt-x-hardware-media-player.tsx",
    promptPath: "lib/prompts/synt-x-hardware-media-player.md",
    previewMode: "video",
    videoSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1788247264545-uknf0z.mp4",
    posterSrc: "https://pub-bffac370ca114a6f873486297600ac6f.r2.dev/1787466169687-mc6kad.jpg",
    premiumHref: "https://cuedesign.space/component/cue056",
    addedAt: "2026-08-23",
    updatedAt: "2026-08-23",
    isNew: true,
    contributor: { name: "Alok", href: "https://x.com/Alok619308" },
    related: ["stacked-deck-scroll-reveal","gooey-liquid-feedback-drop","3d-book-carousel-reading-mode"],
  },

]

export function getRegistryItem(slug: string): RegistryItem | undefined {
  return registry.find((r) => r.slug === slug)
}
