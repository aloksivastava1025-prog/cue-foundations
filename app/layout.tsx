import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/posthog-provider";

/** DNA typography spine — Inter, 400/500/600. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kit.cuedesign.space"),
  title: {
    default: "Cue Kit — Open-source Awwwards-tier React components with AI prompts",
    template: "%s — Cue Kit",
  },
  description:
    "40+ free, open-source, Awwwards-tier React components. Every component ships with the exact AI prompt used to design it. MIT licensed. Install with shadcn CLI. New components ship weekly.",
  keywords: [
    "open source react components",
    "awwwards components",
    "shadcn registry",
    "AI prompt components",
    "framer motion components",
    "gsap components",
    "premium react ui",
    "free ui library",
    "MIT react components",
    "v0 components",
    "cursor ui components",
    "bolt ui components",
    "cue kit",
    "cue components",
    "cuedesign",
    "editorial react components",
    "motion primitives",
    "scroll animation components",
  ],
  authors: [{ name: "Alok Srivastava", url: "https://x.com/Alok619308" }],
  creator: "Alok Srivastava",
  publisher: "Cue",
  category: "web development",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kit.cuedesign.space",
    siteName: "Cue Kit",
    title: "Cue Kit — Open-source Awwwards-tier React components with AI prompts",
    description:
      "40+ free, MIT-licensed React components. Every one ships with the AI prompt used to design it. shadcn CLI compatible. Weekly drops.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Alok619308",
    creator: "@Alok619308",
    title: "Cue Kit — Open-source Awwwards-tier React components",
    description:
      "40+ free React components with the AI prompts that designed them. MIT. shadcn CLI. Weekly drops.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://kit.cuedesign.space",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning — password managers (Bitwarden, 1Password) and
          Grammarly inject attributes onto <body>/<html> after React hydrates.
          These are cosmetic and outside our control, so silence the warning. */}
      <body
        className="min-h-full flex flex-col bg-white text-[#111827]"
        style={{ fontFamily: "var(--font-inter), Inter, system-ui, -apple-system, sans-serif" }}
        suppressHydrationWarning
      >
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
