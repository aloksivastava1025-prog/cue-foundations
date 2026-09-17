# Scrollspy Line Navigation — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for long-form editorial or novel-chapter blogs where readers need a minimal, elegant way to jump between dense sections.

---

**GLOBAL / PAGE LEVEL**
Build a pure HTML/CSS/JS minimalist blog layout with a custom left-side "scrollspy" line navigation. Use the Inter font with weights 400, 500, and 700. The page background is #ffffff and primary text is #333333. Implement a centered main container (`max-width: 720px`, `padding: 80px 20px 120px 20px`) holding a header image (`https://i.pinimg.com/736x/5c/cc/30/5ccc30436d61700ded360abc031f004f.jpg`) and 5 dense text sections representing novel chapters. The signature effect is a fixed left-side navigation panel consisting of tiny horizontal lines that expand when their corresponding section is in view, accompanied by a custom cinematic `requestAnimationFrame` smooth scroll when a line is clicked.

**GEOMETRY & PHYSICS**
Fix the left navigation container to the screen using `position: fixed`, `top: 50%`, `transform: translateY(-50%)`, and `left: 6vw`. Inside it, stack 5 navigation links as flex items in a column. To solve the hit-target problem for tiny UI elements, do not make the visible line the main element. Instead, make each anchor a flex container of exactly 40px width and 24px height to serve as a massive invisible clickable hitbox. Inside the anchor, use a `::before` pseudo-element to render the actual visual line: `height: 2px`, `width: 8px`, `background-color: #e0e0e0`, `border-radius: 2px`. Give the sections a `scroll-margin-top: 100px` so anchor scrolling leaves precise breathing room above the heading.

**LAYOUT & Z-INDEX**
Ensure the fixed left navigation has `z-index: 100`. The blog typography must mimic dense premium blogs: headings use `font-size: 22px`, `font-weight: 700`, `letter-spacing: -0.5px`, and `color: #111`; paragraphs use `font-size: 15px`, `line-height: 1.85`, `color: #333`, `letter-spacing: -0.2px`, and `text-align: justify`. Give each section a `min-height: 70vh` and padding of 60px on top and bottom. Provide tooltips on the nav lines using the `::after` pseudo-element positioned absolutely at `left: 36px`, appearing on hover with `opacity: 1` and `transform: translateY(-50%) translateX(0)`.

**SCROLL CHOREOGRAPHY**
Do not use CSS `scroll-behavior: smooth`, as it lacks premium easing. Instead, attach a click listener to the nav lines. Prevent default, calculate the target offset (target top + window scrollY - 100px), and execute a custom Javascript `requestAnimationFrame` loop. The scroll animation must last exactly 1000ms. Use the mathematical easeInOutQuart function defined as `t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2` to interpolate the `window.scrollTo` position. To track the active section during manual scrolling, attach a scroll event listener. Calculate the detection line at `window.scrollY + (window.innerHeight / 3)`. Loop through all sections, and if the detection line falls between a section's top and its bottom, extract its ID and apply the `.active` class to the corresponding nav line. 

**MATHEMATICAL ANIMATIONS**
When a nav line becomes active, transition its `::before` pseudo-element's width from 8px to 22px, and its background color to `#111`. On hover (if inactive), transition it to 14px width and `#999` color. Use a precise custom bezier curve for these CSS transitions: `transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue084
