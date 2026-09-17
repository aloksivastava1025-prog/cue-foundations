# Coming Soon — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.


---

Build a highly polished, Awwwards-winning cinematic preloader using pure HTML and Vanilla CSS. Strictly follow these dense engineering constraints.

GLOBAL / PAGE LEVEL
The technology stack is pure HTML/CSS. The layout requires a 100vh flexbox container centering a relative `.stage` element with hidden overflow on the body. The background must be exact #FFFFFF. Import Google Font Outfit and use font-weight 300 for all typography. Implement mobile responsiveness flawlessly by applying CSS `transform: scale(min(1, 100vw / 650px))` to the `.stage` container so absolute geometric paths never break on small screens. Use external image URLs for assets.

MATHEMATICAL ANIMATIONS
The core animation drives a train of image tiles along an exact bezier curve using CSS `offset-path`. For the moving tiles, the animation MUST use exactly `travel 5600ms cubic-bezier(0.45, 0, 0.2, 1) infinite both`. The keyframes block `@keyframes travel` must interpolate `offset-distance` from 0% to 100%. There are exactly 8 `.tile` elements that compose the train. You must stagger them chronologically via precise negative animation delays:
```css
tile_delays: [0ms, -210ms, -420ms, -630ms, -840ms, -1050ms, -1260ms, -1470ms]
```
For the text reveal, it must synchronize mathematically with the moving train using a wiping mask. Animate the text container's `clip-path` from `inset(0 100% 0 0)` to `inset(0 0 0 0)` using exactly `wipeReveal 5600ms cubic-bezier(0.45, 0, 0.2, 1) -700ms infinite both`. 

GEOMETRY & PHYSICS
The physical coordinate route for all `offset-path` properties (tiles and any masks) must be strictly this SVG string:
```css
path('M 215.3 204.2 C 220.4 204.2, 235.5 204.1, 245.7 204.0 C 255.8 203.9, 265.9 203.9, 276.0 203.8 C 286.1 203.7, 296.3 203.7, 306.4 203.6 C 316.5 203.5, 326.6 203.5, 336.7 203.4 C 346.9 203.3, 357.0 203.3, 367.1 203.2 C 377.2 203.1, 387.4 203.1, 397.5 203.0 C 407.6 203.0, 417.7 202.9, 427.8 202.9 C 438.0 202.8, 453.1 202.7, 458.2 202.7')
```
Set `offset-rotate: auto` for all tiles so their bounding boxes orient themselves perfectly along the curve's tangent.

LAYOUT & Z-INDEX
The `.stage` container must be strictly `width: 600px` and `height: 400px`. The text element containing "Coming soon..." must be absolute positioned exactly at `top: 203.5px`, `left: 215.3px`, with `width: 243px` and `transform: translateY(-50%)` to align flawlessly with the path coordinates. Set typography to `#888888`, size 1rem, and `letter-spacing: 2px`. Its `zIndex` must be 0. The 8 `.tile` elements must have `position: absolute`, `left: 0`, `top: 0`, `width: 46px`, `height: 46px`, `border-radius: 10px`, `background-size: cover`, `border: 2px solid #fff`, and `box-shadow: 0 6px 14px -4px rgba(0,0,0,0.35)`. By DOM order, they naturally stack above the text (`zIndex` > 0).

ROUTING / COMPOSITION
Embed everything efficiently into a single index HTML and CSS structure. Ensure the DOM places the text div before the 8 tile divs. Use these direct proxy image sources sequentially for the tiles:
```text
https://images.weserv.nl/?url=i.pinimg.com/1200x/0b/36/f8/0b36f83f83bee29f5d9089c6caffa996.jpg
https://images.weserv.nl/?url=i.pinimg.com/1200x/27/e8/f7/27e8f7e5cde73cef92f561051b72101a.jpg
https://images.weserv.nl/?url=i.pinimg.com/1200x/01/5e/65/015e65a2bbc2e4f6f02c6046803225cb.jpg
https://images.weserv.nl/?url=i.pinimg.com/736x/b0/25/d1/b025d110515212a551e28278dd5f3728.jpg
https://images.weserv.nl/?url=i.pinimg.com/736x/d5/0f/a7/d50fa79f58489d451cd884f1135163c9.jpg
https://images.weserv.nl/?url=i.pinimg.com/736x/d0/69/85/d069851b172378f6a0e8d95da4ffeab8.jpg
https://images.weserv.nl/?url=i.pinimg.com/736x/2f/61/90/2f6190000beb64bec84f9e0156c0c9b2.jpg
https://images.weserv.nl/?url=i.pinimg.com/1200x/74/a8/a8/74a8a8540eeedc3870a1ab979a2c242a.jpg
```
The final visual journey is a cinematic, endlessly looping train of avatars travelling along a hyper-precise vector wave, seamlessly unmasking a "Coming soon..." message in its wake with flawless mathematical timing.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue014
