"use client";


/**
 * Cue Foundations · Phantom Infinite Gallery
 * ────────────────────────────────────────────
 * An infinite draggable/throwable image grid with cursor spotlight, 3D arc tilt, and a typewriter-caption focus mode on click.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/phantom-infinite-gallery.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue129
 *
 * Original Cue ID: cue129
 * Category: Gallery & Images
 * ────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";

/* ============================================================================
   PhantomGallery
   ----------------------------------------------------------------------------
   Infinite draggable image grid on a dark stage. Cursor spotlight brightens
   the local area; everything else sits in shadow. Click any card to lift it
   out of its slot, land it in the center at ~1.5× cell size, and type the
   title / year / description in a monospaced typewriter with a blinking
   caret. Cursor tilts the focused card in 3D. Click anywhere to send it
   back. Full drag + throw / inertia + press-hold zoom preserved.
   ============================================================================ */

type Item = {
  title: string;
  src:   string;
  year:  number;
  desc:  string;
};

const ITEMS: Item[] = [
  { title: "Reveat",   src: "https://i.pinimg.com/1200x/97/86/c7/9786c75cf0594852c0097f263268f1b9.jpg", year: 2024, desc: "A study of stillness — the way an object waits for the light to notice it." },
  { title: "Nixole",   src: "https://i.pinimg.com/1200x/3d/2e/90/3d2e90b8d9f0f2212c4bb0d4cb00d1ab.jpg", year: 2023, desc: "Ambient forms from an afternoon that refused to hold a shape." },
  { title: "Syncrun",  src: "https://i.pinimg.com/1200x/a7/2c/6b/a72c6b401485df6e19218348f3fb2130.jpg", year: 2024, desc: "Two rhythms sharing one frame — the quieter one leads." },
  { title: "Lumae",    src: "https://i.pinimg.com/1200x/86/d7/70/86d77085718d949e7052ecc12a0d6114.jpg", year: 2023, desc: "Soft chroma — testing how gently a colour can arrive." },
  { title: "Falafel",  src: "https://i.pinimg.com/736x/e8/89/cc/e889ccd45a9edd0642d42b53b6d597d0.jpg",  year: 2024, desc: "A love letter to warm oil, crushed herbs and a very good afternoon." },
  { title: "Vault",    src: "https://i.pinimg.com/1200x/5e/49/7d/5e497d5e74f1be7e25c19b1358422837.jpg", year: 2024, desc: "The room where every idea we ever kept is still breathing." },
  { title: "Grain",    src: "https://i.pinimg.com/1200x/74/a8/a8/74a8a8540eeedc3870a1ab979a2c242a.jpg", year: 2023, desc: "Texture as memory — small unbeautiful things, honestly framed." },
  { title: "Pulse",    src: "https://i.pinimg.com/1200x/0e/bb/84/0ebb8414f9c7e419c2732dc8a5af3ea2.jpg", year: 2024, desc: "A frame taken between two heartbeats. Neither is louder." },
  { title: "Vera",     src: "https://i.pinimg.com/1200x/77/bd/d8/77bdd84c56688618569a4dc812112c7a.jpg", year: 2023, desc: "Portrait sequence, first pass — the honest one before we edited it." },
  { title: "Nexo",     src: "https://i.pinimg.com/1200x/f8/7f/dd/f87fdde4441ea5f3affbb4a6dfe25d1f.jpg", year: 2024, desc: "Where two systems meet, and briefly agree on a single language." },
  { title: "Kite",     src: "https://i.pinimg.com/736x/59/94/03/5994032453417acae9481e23a2268b15.jpg",  year: 2023, desc: "Tethered but not held — how weight and lift argue politely." },
  { title: "Aurora",   src: "https://i.pinimg.com/1200x/04/fc/40/04fc405577290da0c7818a43373a4d88.jpg", year: 2024, desc: "First light on skin — the exact minute before the room admits it." },
  { title: "Meridian", src: "https://i.pinimg.com/1200x/30/ce/26/30ce267bf4168ecaac4ea635a53a68c7.jpg", year: 2024, desc: "The imaginary line that decides where a day tips into the next." },
  { title: "Solace",   src: "https://i.pinimg.com/1200x/73/44/7d/73447d6054c3d7f1e5ac81bb262e50c8.jpg", year: 2023, desc: "A quiet interior. Nothing happens. This is the point." },
  { title: "Prism",    src: "https://i.pinimg.com/1200x/ad/e2/cb/ade2cb376704782ed5a5ed05c9c16757.jpg", year: 2024, desc: "The same subject, refracted six different ways — pick your favourite lie." },
  { title: "Halcyon",  src: "https://i.pinimg.com/1200x/1c/08/6e/1c086e74af3dad73d0990298881c5089.jpg", year: 2023, desc: "A season we made up so we could describe how the light felt." },
  { title: "Vessel",   src: "https://i.pinimg.com/1200x/7e/f7/99/7ef7990b1c5b1f417e5c9065da75a273.jpg", year: 2024, desc: "The container is always more interesting than what it carries." },
  { title: "Ember",    src: "https://i.pinimg.com/736x/42/22/7b/42227bb6e7c53faefd8afbc538e16c98.jpg",  year: 2023, desc: "The part of the fire that still has an opinion about the room." },
  { title: "Cascade",  src: "https://i.pinimg.com/736x/26/32/5b/26325bfd9131880dc4d695cd229508cc.jpg",  year: 2024, desc: "One thing giving way to the next, gracefully and without ceremony." },
];

const CFG = {
  cellSize:              200,
  hoverColor:            "#FF5588",
  cellPadding:           10,
  gap:                   12,
  arcAmount:             0.6,
  arcMaxAngleDeg:        28,
  arcAxis:               "horizontal" as "horizontal" | "vertical",
  edgeFade:              0.25,
  parallaxEnabled:       true,
  parallaxStrength:      0.1,
  parallaxEase:          0.12,
  parallaxWhileDragging: false,
  inertiaEnabled:        true,
  throwFriction:         0.92,
  throwVelocityScale:    1,
  throwMinSpeed:         80,
  throwMaxSpeed:         2500,
  zoomValue:             0.7,
  DRAG_THRESHOLD:        4,
  PRESS_ZOOM_DELAY:      120,
  GRID_SIZE:             20,
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function computePinnedOffset(prevSize: number, nextSize: number, pivot: {x:number;y:number}, prevOffset: {x:number;y:number}) {
  const worldX = (pivot.x - prevOffset.x) / prevSize;
  const worldY = (pivot.y - prevOffset.y) / prevSize;
  return { x: pivot.x - worldX * nextSize, y: pivot.y - worldY * nextSize };
}
const toRad = (d: number) => d * Math.PI / 180;

function calcArcTransform(opts: {
  cellCenterX: number; cellCenterY: number;
  viewportW: number; viewportH: number;
  arcAxis: "horizontal" | "vertical"; arcMaxAngleDeg: number; arcAmount: number;
}) {
  const { cellCenterX, cellCenterY, viewportW, viewportH, arcAxis, arcMaxAngleDeg, arcAmount } = opts;
  const maxAngle = toRad(arcMaxAngleDeg) * clamp(arcAmount, 0, 1);
  if (maxAngle === 0) return { z: 0, yawDeg: 0, pitchDeg: 0, edgeFactor: 0 };
  if (arcAxis === "horizontal") {
    const dx = (cellCenterX - viewportW / 2) / (viewportW / 2);
    const angle = dx * maxAngle;
    const radius = viewportW / (2 * Math.sin(Math.max(0.001, maxAngle)));
    const z = -radius * (Math.cos(angle) - 1);
    const yawDeg = -(angle * 180) / Math.PI;
    return { z, yawDeg, pitchDeg: 0, edgeFactor: Math.min(1, Math.abs(dx)) };
  } else {
    const dy = (cellCenterY - viewportH / 2) / (viewportH / 2);
    const angle = dy * maxAngle;
    const radius = viewportH / (2 * Math.sin(Math.max(0.001, maxAngle)));
    const z = -radius * (Math.cos(angle) - 1);
    const pitchDeg = angle * 180 / Math.PI;
    return { z, yawDeg: 0, pitchDeg, edgeFactor: Math.min(1, Math.abs(dy)) };
  }
}

export default function PhantomGallery() {
  const stageRef      = useRef<HTMLDivElement>(null);
  const gridRef       = useRef<HTMLDivElement>(null);
  const spotlightRef  = useRef<HTMLDivElement>(null);
  const focusCardRef  = useRef<HTMLDivElement>(null);
  const focusDimRef   = useRef<HTMLDivElement>(null);
  const focusImgRef   = useRef<HTMLImageElement>(null);
  const focusTitleRef = useRef<HTMLSpanElement>(null);
  const focusYearRef  = useRef<HTMLSpanElement>(null);
  const focusDescRef  = useRef<HTMLSpanElement>(null);
  const focusCaretRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    /* ------- Motion state ------- */
    let offset          = { x: 0, y: 0 };
    let targetOffset    = { x: 0, y: 0 };
    let inertia         = { x: 0, y: 0 };
    let velocity        = { x: 0, y: 0 };
    let mouseOffset     = { x: 0, y: 0 };
    let targetMouseOff  = { x: 0, y: 0 };
    let currentCellSize = CFG.cellSize;
    let targetCellSize  = CFG.cellSize;
    let viewport        = { w: window.innerWidth, h: window.innerHeight };
    let isPressing      = false;
    let isDragging      = false;
    let inertiaActive   = false;
    let pressPos        = { x: 0, y: 0 };
    let startOffset     = { x: 0, y: 0 };
    let lastMove        = { x: 0, y: 0, t: performance.now() };
    let pressTimer: number | null = null;
    let lastTime = performance.now();
    let rafId = 0;

    /* ------- Cell cache ------- */
    const stage = stageRef.current!;
    const grid  = gridRef.current!;
    const cellCache: Record<string, HTMLDivElement> = {};

    function ensureCell(gx: number, gy: number) {
      const key = `${gx}-${gy}`;
      let el = cellCache[key];
      if (!el) {
        el = document.createElement("div");
        el.className = "pg-cell";
        const thumb = document.createElement("div"); thumb.className = "pg-thumb";
        const meta  = document.createElement("div"); meta.className  = "pg-meta";
        const title = document.createElement("span"); title.className = "pg-title";
        const year  = document.createElement("span"); year.className  = "pg-year";
        meta.appendChild(title); meta.appendChild(year);
        el.appendChild(thumb); el.appendChild(meta);
        el.addEventListener("mouseenter", () => { el.style.backgroundColor = CFG.hoverColor; });
        el.addEventListener("mouseleave", () => { el.style.backgroundColor = "rgba(0,0,0,0.1)"; });
        grid.appendChild(el);
        cellCache[key] = el;
      }
      return el;
    }

    function render() {
      const cellWithGap = currentCellSize;
      const startX = Math.floor(-offset.x / cellWithGap) - 5;
      const startY = Math.floor(-offset.y / cellWithGap) - 5;
      const active = new Set<string>();

      for (let y = startY; y < startY + CFG.GRID_SIZE; y++) {
        for (let x = startX; x < startX + CFG.GRID_SIZE; x++) {
          const idx  = Math.abs((x + y * 3) % ITEMS.length);
          const item = ITEMS[idx];
          const key  = `${x}-${y}`;
          active.add(key);
          const el = ensureCell(x, y);

          const tileLeft = x * cellWithGap + offset.x + mouseOffset.x + inertia.x;
          const tileTop  = y * cellWithGap + offset.y + mouseOffset.y + inertia.y;
          const cx = tileLeft + currentCellSize / 2;
          const cy = tileTop  + currentCellSize / 2;

          const { z, yawDeg, pitchDeg, edgeFactor } = calcArcTransform({
            cellCenterX: cx, cellCenterY: cy,
            viewportW: viewport.w, viewportH: viewport.h,
            arcAxis: CFG.arcAxis,
            arcMaxAngleDeg: CFG.arcMaxAngleDeg,
            arcAmount: CFG.arcAmount,
          });
          const scale   = 1 - CFG.edgeFade * (edgeFactor * edgeFactor);
          const opacity = 1 - 0.4 * (edgeFactor * CFG.arcAmount);

          el.style.left    = tileLeft + "px";
          el.style.top     = tileTop  + "px";
          el.style.width   = currentCellSize + "px";
          el.style.height  = currentCellSize + "px";
          el.style.padding = CFG.cellPadding + "px";
          el.style.transform =
            `translate3d(0, 0, ${z}px) rotateY(${yawDeg}deg) rotateX(${pitchDeg}deg) scale(${scale})`;
          el.style.opacity = String(opacity);

          el.dataset.src   = item.src;
          el.dataset.title = item.title;
          el.dataset.year  = String(item.year);
          el.dataset.desc  = item.desc;

          const thumb = el.querySelector<HTMLDivElement>(".pg-thumb")!;
          thumb.style.backgroundImage = `url(${item.src})`;
          thumb.style.marginBottom = CFG.gap + "px";
          const [titleEl, yearEl] = el.querySelectorAll<HTMLSpanElement>(".pg-meta span");
          titleEl.textContent = item.title;
          yearEl.textContent  = String(item.year);
        }
      }
      for (const key in cellCache) {
        if (!active.has(key)) { cellCache[key].remove(); delete cellCache[key]; }
      }
    }

    /* ------- rAF loop ------- */
    function tick() {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      currentCellSize += (targetCellSize - currentCellSize) * 0.15;
      if (Math.abs(currentCellSize - targetCellSize) < 0.05) currentCellSize = targetCellSize;

      if (!isDragging) {
        offset.x += (targetOffset.x - offset.x) * 0.15;
        offset.y += (targetOffset.y - offset.y) * 0.15;
        if (Math.abs(offset.x - targetOffset.x) < 0.1) offset.x = targetOffset.x;
        if (Math.abs(offset.y - targetOffset.y) < 0.1) offset.y = targetOffset.y;
      }
      if (CFG.inertiaEnabled && inertiaActive) {
        const f = Math.pow(CFG.throwFriction, dt * 60);
        velocity.x *= f; velocity.y *= f;
        const speed = Math.hypot(velocity.x, velocity.y);
        if (speed < 1) {
          const dir = Math.atan2(velocity.y, velocity.x);
          velocity.x = Math.cos(dir) * 1e-4;
          velocity.y = Math.sin(dir) * 1e-4;
        }
        inertia.x += velocity.x * dt;
        inertia.y += velocity.y * dt;
      }
      const applyPa = CFG.parallaxEnabled && (CFG.parallaxWhileDragging || !isDragging);
      const paTx = applyPa ? targetMouseOff.x : 0;
      const paTy = applyPa ? targetMouseOff.y : 0;
      mouseOffset.x += (paTx - mouseOffset.x) * CFG.parallaxEase;
      mouseOffset.y += (paTy - mouseOffset.y) * CFG.parallaxEase;

      render();
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    /* ------- Interaction: pointer + spotlight ------- */
    function commitInertiaToBase() {
      offset = { x: offset.x + inertia.x, y: offset.y + inertia.y };
      targetOffset = { ...offset };
      inertia = { x: 0, y: 0 };
      inertiaActive = false;
    }

    const spotlightEl = spotlightRef.current!;
    function updateSpotlight(x: number, y: number) {
      spotlightEl.style.setProperty("--mx", x + "px");
      spotlightEl.style.setProperty("--my", y + "px");
    }
    updateSpotlight(window.innerWidth / 2, window.innerHeight / 2);

    const onPointerDown = (e: PointerEvent) => {
      if (inertiaActive || inertia.x !== 0 || inertia.y !== 0) commitInertiaToBase();
      stage.setPointerCapture(e.pointerId);
      isPressing = true;
      isDragging = false;
      stage.classList.remove("dragging");
      lastMove = { x: e.clientX, y: e.clientY, t: performance.now() };
      velocity = { x: 0, y: 0 };
      pressPos = { x: e.clientX, y: e.clientY };
      startOffset = { ...offset };

      if (pressTimer) clearTimeout(pressTimer);
      pressTimer = window.setTimeout(() => {
        if (!isDragging && isPressing) {
          const rect = stage.getBoundingClientRect();
          const pivot = { x: rect.width / 2, y: rect.height / 2 };
          const newSize = CFG.cellSize * CFG.zoomValue;
          const visibleOff = { x: offset.x + inertia.x, y: offset.y + inertia.y };
          const pinned = computePinnedOffset(currentCellSize, newSize, pivot, visibleOff);
          targetCellSize = newSize;
          targetOffset = pinned;
        }
      }, CFG.PRESS_ZOOM_DELAY);
    };

    const onPointerMove = (e: PointerEvent) => {
      updateSpotlight(e.clientX, e.clientY);
      if (isPressing) {
        const now = performance.now();
        const dt = Math.max(0.001, (now - lastMove.t) / 1000);
        const dx = e.clientX - lastMove.x;
        const dy = e.clientY - lastMove.y;
        const vx = clamp(dx / dt * CFG.throwVelocityScale, -CFG.throwMaxSpeed, CFG.throwMaxSpeed);
        const vy = clamp(dy / dt * CFG.throwVelocityScale, -CFG.throwMaxSpeed, CFG.throwMaxSpeed);
        velocity.x = vx * 0.6 + velocity.x * 0.4;
        velocity.y = vy * 0.6 + velocity.y * 0.4;
        lastMove = { x: e.clientX, y: e.clientY, t: now };
      }
      const suppressPa = isPressing || isDragging;
      if (CFG.parallaxEnabled && (CFG.parallaxWhileDragging || !isDragging) && !suppressPa) {
        const rect = stage.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const cx = rect.width / 2, cy = rect.height / 2;
        targetMouseOff.x = (cx - mx) * CFG.parallaxStrength;
        targetMouseOff.y = (cy - my) * CFG.parallaxStrength;
      }
      if (!isPressing) return;
      const dx = e.clientX - pressPos.x;
      const dy = e.clientY - pressPos.y;
      if (!isDragging && Math.hypot(dx, dy) > CFG.DRAG_THRESHOLD) {
        isDragging = true;
        stage.classList.add("dragging");
        startOffset = { ...offset };
      }
      if (isDragging) {
        offset.x = startOffset.x + dx;
        offset.y = startOffset.y + dy;
        targetOffset = { ...offset };
      }
    };

    const endPress = (e?: PointerEvent) => {
      const wasDragging = isDragging;
      isPressing = false;
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
      const speed = Math.hypot(velocity.x, velocity.y);
      if (CFG.inertiaEnabled && speed >= CFG.throwMinSpeed) inertiaActive = true;
      else { inertiaActive = false; inertia = { x: 0, y: 0 }; }
      isDragging = false;
      stage.classList.remove("dragging");

      const rect = stage.getBoundingClientRect();
      const pivot = { x: rect.width / 2, y: rect.height / 2 };
      const visibleOff = { x: offset.x + inertia.x, y: offset.y + inertia.y };
      const pinnedBack = computePinnedOffset(currentCellSize, CFG.cellSize, pivot, visibleOff);
      targetMouseOff = { x: 0, y: 0 };
      targetCellSize = CFG.cellSize;
      targetOffset = pinnedBack;

      if (!wasDragging && e && e.type === "pointerup") handleClick(e);
    };

    /* ------- Focus mode + typewriter + 3D tilt ------- */
    const focusDim   = focusDimRef.current!;
    const focusCard  = focusCardRef.current!;
    const focusImg   = focusImgRef.current!;
    const focusTitle = focusTitleRef.current!;
    const focusYear  = focusYearRef.current!;
    const focusDesc  = focusDescRef.current!;
    const focusCaret = focusCaretRef.current!;
    let focusOn = false;
    let focusCell: HTMLDivElement | null = null;

    let typeTimer: number | null = null;
    const stopTypewriter = () => {
      if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
      focusCaret.hidden = true;
    };
    const typewriter = (snap: { title: string; year: string; desc: string }) => {
      stopTypewriter();
      focusTitle.textContent = "";
      focusYear.textContent  = "";
      focusDesc.textContent  = "";
      focusCaret.hidden = false;
      const parts = [
        { el: focusTitle, text: snap.title, speed: 60 },
        { el: focusYear,  text: snap.year,  speed: 45 },
        { el: focusDesc,  text: snap.desc,  speed: 22 },
      ];
      let pi = 0, ci = 0;
      const step = () => {
        if (pi >= parts.length) {
          typeTimer = window.setTimeout(() => { focusCaret.hidden = true; }, 400);
          return;
        }
        const p = parts[pi];
        if (ci < p.text.length) {
          p.el.textContent += p.text[ci++];
          typeTimer = window.setTimeout(step, p.speed + Math.random() * 20);
        } else {
          pi++; ci = 0;
          typeTimer = window.setTimeout(step, 180);
        }
      };
      step();
    };

    function computeFinalSize() {
      const w = Math.min(currentCellSize * 1.5, window.innerWidth * 0.45);
      const h = w * 1.25;
      return { w, h };
    }

    function openFocus(cell: HTMLDivElement) {
      const rect = cell.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const { w: finalW, h: finalH } = computeFinalSize();
      const initScale = rect.width / finalW;

      const snap = {
        src:   cell.dataset.src   || "",
        title: cell.dataset.title || "",
        year:  cell.dataset.year  || "",
        desc:  cell.dataset.desc  || "",
      };
      focusImg.src = snap.src;
      focusTitle.textContent = "";
      focusYear.textContent  = "";
      focusDesc.textContent  = "";

      focusCard.style.width  = finalW + "px";
      focusCard.style.height = finalH + "px";
      focusCard.style.transition = "none";
      focusCard.style.left = cx + "px";
      focusCard.style.top  = cy + "px";
      focusCard.style.transform = `translate(-50%, -50%) scale(${initScale})`;
      focusCard.style.opacity = "0";
      /* force reflow */
      void focusCard.offsetHeight;
      focusCard.style.transition =
        "left 0.55s cubic-bezier(0.22, 1, 0.36, 1), " +
        "top 0.55s cubic-bezier(0.22, 1, 0.36, 1), " +
        "transform 0.6s cubic-bezier(0.34, 1.25, 0.64, 1), " +
        "opacity 0.3s ease";
      focusCard.style.opacity = "1";
      focusCard.style.left = (window.innerWidth  / 2) + "px";
      focusCard.style.top  = (window.innerHeight / 2) + "px";
      focusCard.style.transform = "translate(-50%, -50%) scale(1)";

      focusDim.classList.add("on");
      focusCard.classList.add("on");
      document.body.classList.add("pg-focused");
      focusOn = true;
      focusCell = cell;

      window.setTimeout(() => {
        if (!focusOn) return;
        typewriter(snap);
      }, 550);
    }
    function closeFocus() {
      if (!focusOn) return;
      stopTypewriter();
      const finalW = parseFloat(focusCard.style.width);
      let toLeft: number, toTop: number, toScale: number;
      if (focusCell && document.body.contains(focusCell)) {
        const rect = focusCell.getBoundingClientRect();
        toLeft  = rect.left + rect.width  / 2;
        toTop   = rect.top  + rect.height / 2;
        toScale = rect.width / finalW;
      } else {
        toLeft  = window.innerWidth  / 2;
        toTop   = window.innerHeight / 2;
        toScale = 0.3;
      }
      focusCard.style.left = toLeft + "px";
      focusCard.style.top  = toTop  + "px";
      focusCard.style.transform = `translate(-50%, -50%) scale(${toScale})`;
      focusCard.style.opacity = "0";
      focusDim.classList.remove("on");
      document.body.classList.remove("pg-focused");
      window.setTimeout(() => focusCard.classList.remove("on"), 450);
      focusOn = false;
      focusCell = null;
    }
    function handleClick(e: PointerEvent) {
      if (focusOn) { closeFocus(); return; }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const cell = hit && (hit as HTMLElement).closest && (hit as HTMLElement).closest(".pg-cell");
      if (cell) openFocus(cell as HTMLDivElement);
    }

    /* 3D tilt on focus card */
    let tiltRX = 0, tiltRY = 0, tiltTX = 0, tiltTY = 0;
    function tiltTick() {
      if (!focusOn) return;
      tiltRX += (tiltTX - tiltRX) * 0.14;
      tiltRY += (tiltTY - tiltRY) * 0.14;
      focusCard.style.transform =
        `translate(-50%, -50%) rotateX(${tiltRX}deg) rotateY(${tiltRY}deg) scale(1)`;
      requestAnimationFrame(tiltTick);
    }
    const onTiltMove = (e: MouseEvent) => {
      if (!focusOn) return;
      const rect = focusCard.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const cl = (v: number) => Math.max(-1.4, Math.min(1.4, v));
      tiltTY =  cl(dx) * 10;
      tiltTX = -cl(dy) * 10;
    };
    window.addEventListener("mousemove", onTiltMove);

    stage.addEventListener("pointerdown",   onPointerDown as any);
    stage.addEventListener("pointermove",   onPointerMove as any);
    stage.addEventListener("pointerup",     endPress      as any);
    stage.addEventListener("pointercancel", endPress      as any);
    stage.addEventListener("pointerleave",  () => { targetMouseOff = { x: 0, y: 0 }; });
    focusCard.addEventListener("click", closeFocus);
    focusDim.addEventListener("click",  closeFocus);

    const onResize = () => { viewport = { w: window.innerWidth, h: window.innerHeight }; };
    window.addEventListener("resize", onResize);

    /* When focus opens, kick the tilt loop */
    const focusObserver = new MutationObserver(() => {
      if (focusCard.classList.contains("on") && focusOn) {
        tiltRX = tiltRY = tiltTX = tiltTY = 0;
        requestAnimationFrame(tiltTick);
      }
    });
    focusObserver.observe(focusCard, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(rafId);
      stopTypewriter();
      focusObserver.disconnect();
      stage.removeEventListener("pointerdown",   onPointerDown as any);
      stage.removeEventListener("pointermove",   onPointerMove as any);
      stage.removeEventListener("pointerup",     endPress      as any);
      stage.removeEventListener("pointercancel", endPress      as any);
      window.removeEventListener("mousemove", onTiltMove);
      window.removeEventListener("resize", onResize);
      for (const key in cellCache) cellCache[key].remove();
    };
  }, []);

  return (
    <>
      <div id="pg-stage" ref={stageRef}>
        <div id="pg-grid" ref={gridRef}></div>
      </div>
      <div id="pg-dim"></div>
      <div id="pg-spotlight" ref={spotlightRef}></div>
      <div id="pg-vignette"></div>

      <div id="pg-focus-dim" ref={focusDimRef}></div>
      <div id="pg-focus-card" ref={focusCardRef}>
        <img id="pg-focus-img" ref={focusImgRef} alt="" />
        <div className="pg-cap">
          <div className="pg-cap-head">
            <span ref={focusTitleRef}></span>
            <span ref={focusYearRef}></span>
          </div>
          <div className="pg-cap-desc">
            <span ref={focusDescRef}></span>
            <span ref={focusCaretRef} className="pg-caret" hidden></span>
          </div>
        </div>
      </div>

      <style>{`
        #pg-stage {
          position: fixed; inset: 0; z-index: 1;
          background: #000; overflow: hidden;
          touch-action: none; cursor: grab; user-select: none;
          perspective: 1000px; transform-style: preserve-3d;
        }
        #pg-stage.dragging { cursor: grabbing; }
        #pg-grid { position: absolute; width: 100%; height: 100%; transform-style: preserve-3d; }
        .pg-cell {
          position: absolute;
          background-color: rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: background-color 0.3s ease;
          display: flex; flex-direction: column;
          box-sizing: border-box;
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }
        .pg-thumb {
          flex: 1;
          background-size: cover; background-position: center;
          border-radius: 4px;
        }
        .pg-meta {
          display: flex; justify-content: space-between; align-items: center;
          color: #808080;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 12px;
        }
        .pg-meta span:first-child { font-weight: 700; text-transform: uppercase; }

        #pg-dim {
          position: fixed; inset: 0; pointer-events: none; z-index: 8;
          background: rgba(0, 0, 0, 0.38);
        }
        #pg-spotlight {
          position: fixed; inset: 0; pointer-events: none; z-index: 9;
          background: radial-gradient(
            circle 340px at var(--mx, 50%) var(--my, 50%),
            rgba(255, 255, 255, 0.55)  0%,
            rgba(255, 255, 255, 0.30)  25%,
            rgba(255, 255, 255, 0.08)  50%,
            rgba(0, 0, 0, 0)           65%,
            rgba(0, 0, 0, 0.30)        100%
          );
          mix-blend-mode: overlay;
          transition: background 0.05s linear;
        }
        #pg-vignette {
          position: fixed; inset: 0; pointer-events: none; z-index: 10;
          background: radial-gradient(ellipse at center,
            transparent 30%,
            rgba(0,0,0,0.2) 60%,
            rgba(0,0,0,0.8) 90%,
            rgba(0,0,0,1) 100%);
        }

        #pg-focus-dim {
          position: fixed; inset: 0; pointer-events: none; z-index: 11;
          background: rgba(0, 0, 0, 0.72);
          opacity: 0;
          transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        #pg-focus-dim.on { opacity: 1; pointer-events: auto; cursor: pointer; }

        #pg-focus-card {
          position: fixed; z-index: 12;
          border-radius: 10px; overflow: hidden;
          background: #222;
          opacity: 0; pointer-events: none;
          box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.85);
          transform-style: preserve-3d;
        }
        #pg-focus-card.on { pointer-events: auto; cursor: pointer; }
        #pg-focus-card img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transform: translateZ(0);
        }
        .pg-cap {
          position: absolute;
          left: 20px; right: 20px; bottom: 18px;
          display: flex; flex-direction: column; gap: 6px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          color: rgba(255, 255, 255, 0.95);
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.02em;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.75);
        }
        .pg-cap-head {
          display: flex; justify-content: space-between; align-items: baseline;
          font-weight: 400;
          text-transform: uppercase;
        }
        .pg-cap-desc {
          font-size: 11px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.78);
          font-weight: 400;
        }
        .pg-caret {
          display: inline-block;
          width: 6px; height: 12px;
          background: rgba(255, 255, 255, 0.85);
          vertical-align: middle;
          margin-left: 2px;
          animation: pg-caret-blink 0.8s steps(1) infinite;
        }
        @keyframes pg-caret-blink { 50% { opacity: 0; } }

        body.pg-focused #pg-spotlight { opacity: 0; transition: opacity 0.4s ease; }
        body.pg-focused #pg-dim       { background: rgba(0, 0, 0, 0.72); transition: background 0.45s ease; }
        body.pg-focused              { perspective: 1400px; }

        @media (prefers-reduced-motion: reduce) {
          .pg-cell { transition: none !important; }
        }
      `}</style>
    </>
  );
}
