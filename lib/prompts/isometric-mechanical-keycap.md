# Isometric Mechanical Keycap — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** A standout CTA for a hardware, gaming peripheral, or developer-tool product page where tactile realism reinforces the physical product being sold.

---

**GLOBAL / PAGE LEVEL**
Build a pure HTML/CSS 3D isometric button component representing a physical mechanical keyboard keycap sitting in a deeply recessed socket. Use the Inter font with weights 500 and 600. The page background is #f6f5f4. Implement a dynamic CSS variables theme system on the root level mapping to 5 distinct color themes (Default off-white, Blue, Red, Green, Black). Create a top-anchored palette container (absolute, top 40px) holding 5 square swatches (36x36, border-radius 4px). The signature effect is a true physical 3D extrusion generated via a Javascript loop injecting 50 microscopic div layers translated along the Z-axis, squashed dynamically using scaleZ for a tactile mechanical press.

**GEOMETRY & PHYSICS**
Set the main scene container to have `perspective: 2000px`. The button container must be strictly 220px wide and 140px high, heavily rotated into a perfect isometric perspective using `transform: rotateX(60deg) rotateZ(-45deg)` and `transform-style: preserve-3d`. To create the beveled, truncated pyramid shape of a real mechanical key, inject exactly 50 absolute divs (layers). For each layer at index `z` from 1 to 50, apply `translateZ(z px)` and scale it down progressively using the formula `scale(1 - (z / 50) * 0.2)`. The top face sits exactly at `translateZ(50px)` with `scale(0.8)`. The socket beneath the button extends outward with `inset: -20px` to create a wider footprint. 

**LAYOUT & Z-INDEX**
Stack elements strictly in this order from bottom to top: background grid lines, the socket hole, the layer injection wrapper, the 50 dynamically generated side layers, and finally the top face. The grid lines must be pushed down to `translateZ(-1px)`. The socket remains at `translateZ(0)`. All generated layers and the top face must reside inside the layer injection wrapper which must have `transform-style: preserve-3d`. The top face holds the text "Launch" perfectly centered with font-size 42px. 

**MATHEMATICAL ANIMATIONS**
The mechanical press interaction is driven purely by CSS on the `:active` pseudo-class of the main button. Do not transition 50 individual layers. Instead, apply `transform: scaleZ(0.3)` to the entire layer injection wrapper on active state. Use `transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)` to create a rapid, snappy physical spring compression effect. For the color theme switching, use `transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease` on the top face and side layers. On swatch hover, lift the swatch using `transform: translateY(-2px)` with a smooth 0.2s ease. 

**STYLING & DEPTH CUES**
To simulate directional lighting on the sloped 3D sides without complex 3D math, apply `background: linear-gradient(135deg, var(--layer-left) 50%, var(--layer-right) 50%)` to all 50 injected layers. This mathematically splits the left and right visible faces into distinct solid colors forming a sharp edge. Make the socket look deeply recessed by combining an outer white border (`2px solid #ffffff`), an outer drop shadow, and three strong inset box-shadows (a dark shadow for the top/left inner wall, a white highlight for the bottom/right wall, and a deep ambient shadow). Give the top face a subtle pillowed depth using an inset shadow of `0 0 20px rgba(0,0,0,0.03)` and a light inner rim highlight.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue083
