/**
 * Preview route layout — pass-through only. The docs `RootLayout`
 * sets `body` to `min-h-full flex flex-col`, which fights components
 * that expect a plain document body (fullscreen accordions, scroll
 * scenes). This layout renders children directly so the component
 * owns the iframe's viewport with no wrapper interference.
 */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
