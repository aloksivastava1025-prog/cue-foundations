/**
 * Awwwards-style hover word-flip. On hover, the original text
 * slides up out of view while an identical copy slides up from
 * below into place. Requires the parent to have the `group` class
 * so hover propagates.
 */
export function SlideText({ children }: { children: string }) {
  return (
    <span
      className="relative inline-block overflow-hidden align-middle leading-[1.2]"
      style={{ height: "1.2em" }}
    >
      <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute left-0 top-full block transition-transform duration-300 ease-out group-hover:-translate-y-full">
        {children}
      </span>
    </span>
  )
}
