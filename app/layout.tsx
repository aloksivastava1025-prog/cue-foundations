import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Cue Foundations — components with the AI prompts that designed them",
  description:
    "Free MIT-licensed React components curated from Cue's premium library. Every one ships with the AI prompt used to design it.",
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
        {children}
      </body>
    </html>
  );
}
