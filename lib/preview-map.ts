/**
 * Cue Foundations · shared preview map.
 * ─────────────────────────────────────────────────────
 * Every component whose docs page should mount the real React
 * component (previewMode: "live") registers its wrapper here. Both
 * the homepage grid cards and the /components/[slug] detail page
 * pull from this single map.
 *
 * Components with previewMode "video" / "html" / "image" don't need
 * an entry — the site renders those directly from registry metadata.
 * ─────────────────────────────────────────────────────
 */

import { MagneticButtonPreview } from "@/components/previews/foundations/button-magnetic"
import { TiltCardPreview } from "@/components/previews/foundations/tilt-card"
import { ThemeTogglePreview } from "@/components/previews/foundations/theme-toggle"
import { TabsPillPreview } from "@/components/previews/foundations/tabs-pill"
import { AddProductWizardModalPreview } from "@/components/previews/foundations/add-product-wizard-modal"
import { CollapsingCardsAccordionPreview } from "@/components/previews/foundations/collapsing-cards-accordion"
import { DynamicIslandFeedbackNotchPreview } from "@/components/previews/foundations/dynamic-island-feedback-notch"
import { FlexGrowBenefitsRevealPreview } from "@/components/previews/foundations/flex-grow-benefits-reveal"
import { SplitPanelImageSyncedFaqFeaturesPreview } from "@/components/previews/foundations/split-panel-image-synced-faq-features"

/**
 * Slugs that are safe to mount live in the docs UI (grid card AND
 * detail page). The other entries in PREVIEW_MAP inject full-viewport
 * styles / global CSS that break the docs layout — they still render
 * live inside the shadcn-installed project, but on our docs site
 * they play as a video preview instead.
 */
export const SAFE_LIVE_SLUGS = new Set([
  "button-magnetic",
  "tilt-card",
  "theme-toggle",
  "tabs-pill",
])

export const PREVIEW_MAP: Record<string, () => React.JSX.Element> = {
  "button-magnetic": MagneticButtonPreview,
  "tilt-card": TiltCardPreview,
  "theme-toggle": ThemeTogglePreview,
  "tabs-pill": TabsPillPreview,
  "add-product-wizard-modal": AddProductWizardModalPreview,
  "collapsing-cards-accordion": CollapsingCardsAccordionPreview,
  "dynamic-island-feedback-notch": DynamicIslandFeedbackNotchPreview,
  "flex-grow-benefits-reveal": FlexGrowBenefitsRevealPreview,
  "split-panel-image-synced-faq-features": SplitPanelImageSyncedFaqFeaturesPreview,
}
