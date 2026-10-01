/**
 * Cue Foundations · Interactive Card Sphere
 * ────────────────────────────────────────────
 * A draggable, flickable sphere of flat SVG/HTML cards that coasts to a stop with one hero card centered, no photos or gradients.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/interactive-card-sphere.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue200
 *
 * Original Cue ID: cue200
 * Category: 3D & WebGL
 * ────────────────────────────────────────────
 */

/**
 * CardSphere — an interactive field of flat graphic cards on a transparent sphere.
 * Drag / flick / scroll (or arrow keys) to turn it; it coasts and settles one big "hero" card at the front.
 * Double-click (or T) flips white ↔ #111. Fills its container; sized from u = min(width, 0.8·height).
 *
 *   <div style={{ height: '100vh' }}><CardSphere /></div>
 *
 * React 18+, no other dependencies. Font: Inter 500/600/700 (loaded unless loadFont={false}).
 * The animation writes styles straight to DOM nodes in one requestAnimationFrame loop — no re-renders.
 */
import { useEffect, useRef, type CSSProperties } from 'react';

export type CardSphereProps = {
  /** starting theme; double-click or T toggles it (disable with allowThemeToggle={false}) */
  theme?: 'light' | 'dark';
  allowThemeToggle?: boolean;
  onThemeChange?: (theme: 'light' | 'dark') => void;
  /** called when a hero card settles at the front (index 0–7) */
  onSettle?: (hero: number) => void;
  loadFont?: boolean;
  className?: string;
  style?: CSSProperties;
};

/* ---------- palette (flat colours from the reference) ---------- */
const LIME = '#d5fe4f', INK = '#0d0d0d', CARD = '#1d1d1d', PAPER = '#f2f2f0', GREY = '#d9d9d6';

/* ---------- maths ---------- */
type Vec = { x: number; y: number; z: number };
type Quat = [number, number, number, number];
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const bez = (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
  let t = x;
  for (let i = 0; i < 6; i++) {
    const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3 - x;
    const d = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
    if (Math.abs(d) < 1e-6) break;
    t = clamp(t - cx / d);
  }
  return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
};
const SETTLE = bez(0.25, 0.75, 0.2, 1);                   // fast start, long glide
const V = (x: number, y: number, z: number): Vec => ({ x, y, z });
const norm = (a: Vec) => { const n = Math.hypot(a.x, a.y, a.z) || 1; return V(a.x / n, a.y / n, a.z / n); };
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a: Vec, b: Vec) => V(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
const qmul = (a: Quat, b: Quat): Quat => [
  a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3], a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
  a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1], a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]];
const qaxis = (axis: Vec, ang: number): Quat => { const s = Math.sin(ang / 2), a = norm(axis); return [Math.cos(ang / 2), a.x * s, a.y * s, a.z * s]; };
const qnorm = (q: Quat): Quat => { const n = Math.hypot(q[0], q[1], q[2], q[3]); return [q[0] / n, q[1] / n, q[2] / n, q[3] / n]; };
const qrot = (q: Quat, v: Vec): Vec => {
  const [w, x, y, z] = q, ix = w * v.x + y * v.z - z * v.y, iy = w * v.y + z * v.x - x * v.z, iz = w * v.z + x * v.y - y * v.x, iw = -x * v.x - y * v.y - z * v.z;
  return V(ix * w + iw * -x + iy * -z - iz * -y, iy * w + iw * -y + iz * -x - ix * -z, iz * w + iw * -z + ix * -y - iy * -x);
};
const qslerp = (a: Quat, b: Quat, t: number): Quat => {
  let c = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  if (c < 0) { b = [-b[0], -b[1], -b[2], -b[3]]; c = -c; }
  if (c > 0.9995) return qnorm([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)]);
  const th = Math.acos(c), s = Math.sin(th), ka = Math.sin((1 - t) * th) / s, kb = Math.sin(t * th) / s;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb, a[3] * ka + b[3] * kb];
};
const qbetween = (from: Vec, to: Vec): Quat => {
  const c = clamp(dot(from, to), -1, 1);
  if (c > 0.99999) return [1, 0, 0, 0];
  return qaxis(c < -0.99999 ? V(0, 1, 0) : cross(from, to), Math.acos(c));
};
const fib = (n: number, i: number, off = 0) => {
  const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), t = Math.PI * (3 - Math.sqrt(5)) * i + off;
  return V(Math.cos(t) * r, y, Math.sin(t) * r);
};

/* ---------- artwork (each card is authored at its own base size; text in base px) ---------- */
const ICONS: Record<string, string> = {
  x: 'M30 30 L48 48 M70 30 L52 48 M30 70 L48 52 M70 70 L52 52 M48 48 H52 M48 52 H52 M48 48 V52 M52 48 V52',
  ring: 'M50 22 A28 28 0 1 1 49.9 22',
  flower: 'M50 20 A10 10 0 1 1 49.9 20 M50 40 V82 M50 56 L38 46 M50 56 L62 46 M50 70 L40 62 M50 70 L60 62',
  layers: 'M50 24 L80 40 L50 56 L20 40 Z M20 52 L50 68 L80 52 M20 64 L50 80 L80 64',
  basket: 'M22 42 H78 L70 78 H30 Z M36 42 L44 24 M64 42 L56 24 M36 56 V66 M50 56 V66 M64 56 V66',
  person: 'M50 22 A12 12 0 1 1 49.9 22 M26 80 C26 58 74 58 74 80',
  search: 'M44 26 A18 18 0 1 1 43.9 26 M57 57 L76 76',
};
const SHAPES: Record<string, string> = {
  circle: '<circle cx="50" cy="50" r="30"/>',
  arch: '<path d="M22 80V48a28 28 0 0 1 56 0v32z"/>',
  quarter: '<path d="M22 78V22a56 56 0 0 1 56 56z"/>',
  halves: '<path d="M20 50a15 15 0 0 1 30 0zM50 50a15 15 0 0 0 30 0z"/>',
  plus: '<path d="M42 20h16v22h22v16H58v22H42V58H20V42h22z"/>',
  stack: '<rect x="22" y="22" width="56" height="14" rx="7"/><rect x="22" y="43" width="40" height="14" rx="7"/><rect x="22" y="64" width="50" height="14" rx="7"/>',
};
const iconSvg = (k: string, size: number) =>
  `<svg viewBox="0 0 100 100" width="${size}" height="${size}"><path d="${ICONS[k]}" fill="none" stroke="#f2f2f2" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.01 7"/></svg>`;
const dotCluster = (w: number, h: number, col: string, seedN: number) => {
  let s = seedN * 9301 + 49297; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let out = '';
  for (let y = 0; y < 5; y++) for (let x = 0; x < 4; x++) { const v = r(); if (v < 0.22) continue; out += `<circle cx="${16 + x * 23}" cy="${14 + y * 24}" r="${2.5 + v * 8.5}"/>`; }
  return `<svg viewBox="0 0 100 124" width="${w * 0.82}" height="${h * 0.82}"><g fill="${col}">${out}</g></svg>`;
};

type CardType = 'lime' | 'icon' | 'chip' | 'box' | 'dots' | 'type' | 'shape' | 'target' | 'swatch' | 'stripe' | 'poster' | 'words';
type Card = {
  type: CardType; w: number; h: number; rz: number; p: Vec; hero?: boolean;
  icon?: string; morph?: boolean; col?: string; seed?: number; bg?: string; fg?: string; shape?: string; cols?: string[];
  el?: HTMLDivElement; hv?: number; ic?: string;
};
const lbl = 'position:absolute;font-family:Inter,system-ui,sans-serif;font-weight:600;line-height:1;letter-spacing:-.04em;color:#0d0d0d';
const ART: Record<CardType, (w: number, h: number, o: Card) => string> = {
  lime: (w) => `<div style="font-size:${w * 0.3}px">Cue.</div>`,
  icon: (w, _h, o) => iconSvg(o.icon || 'search', w * 0.72),
  chip: (w) => `<span style="font-size:${w * 0.17}px;padding:${w * 0.07}px ${w * 0.1}px;border-radius:${w * 0.04}px">Cue.</span>`,
  box: (w) => `<span style="font-size:${w * 0.2}px;padding:${w * 0.1}px ${w * 0.09}px;border-radius:${w * 0.02}px;box-shadow:0 0 ${w * 0.1}px rgba(255,255,255,.75),0 0 ${w * 0.3}px rgba(255,255,255,.35)">Cue.<svg viewBox="0 0 10 10" width="${w * 0.12}" height="${w * 0.12}" style="margin-left:${w * 0.05}px"><g fill="#bdbdbd">${[[2, 2], [5, 2], [8, 2], [2, 5], [5, 5], [2, 8], [5, 8], [8, 8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9"/>`).join('')}</g></svg></span>`,
  dots: (w, h, o) => dotCluster(w, h, o.col || LIME, o.seed || 3),
  type: (w) => `<div style="font:600 ${w * 0.46}px/1 Inter,system-ui,sans-serif;letter-spacing:-.06em;color:${INK}">Aa</div><div style="${lbl};left:${w * 0.07}px;bottom:${w * 0.07}px;font-size:${w * 0.06}px;font-weight:500;color:#6b6b6b">Inter 600</div><div style="${lbl};right:${w * 0.07}px;bottom:${w * 0.07}px;font-size:${w * 0.06}px;font-weight:500;color:#6b6b6b">−6%</div>`,
  shape: (w, _h, o) => `<svg viewBox="0 0 100 100" width="${w * 0.7}" height="${w * 0.7}"><g fill="${o.fg || INK}">${SHAPES[o.shape || 'circle']}</g></svg>`,
  target: (w) => `<svg viewBox="0 0 100 100" width="${w * 0.78}" height="${w * 0.78}"><g fill="none" stroke="${INK}" stroke-width="1.6"><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="16"/></g><circle cx="50" cy="50" r="5" fill="${INK}"/><g stroke="${INK}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="0.01 4.5"><path d="M50 2V98M2 50H98"/></g></svg>`,
  swatch: (w, _h, o) => `<div style="position:absolute;inset:0;display:grid;grid-template-rows:2fr 1fr 1fr">${(o.cols || [LIME, INK, PAPER]).map((c) => `<div style="background:${c};position:relative"><span style="${lbl};left:${w * 0.08}px;bottom:${w * 0.06}px;font-size:${w * 0.075}px;font-weight:500;color:${c === INK ? PAPER : INK}">${c.toUpperCase()}</span></div>`).join('')}</div>`,
  stripe: (w, h) => `<svg viewBox="0 0 100 120" width="${w}" height="${h}" preserveAspectRatio="none" style="position:absolute;inset:0"><g fill="${INK}">${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="0" y="${12 + i * 17}" width="100" height="${3 + i * 1.6}"/>`).join('')}</g></svg>`,
  poster: (w, h) => `<div style="width:${w * 0.8}px;height:${h * 0.86}px;border-radius:${w * 0.012}px;background:#fbfbfa;position:relative;overflow:hidden">
      <div style="${lbl};left:${w * 0.05}px;top:${w * 0.05}px;font-size:${w * 0.05}px;line-height:1.12;font-weight:500">Where design<br>meets code</div>
      <svg viewBox="0 0 100 100" style="position:absolute;left:14%;top:26%;width:72%;height:auto"><circle cx="50" cy="50" r="38" fill="${INK}"/><path d="M50 12a38 38 0 0 1 0 76z" fill="${LIME}"/></svg>
      <div style="${lbl};right:${w * 0.05}px;bottom:${w * 0.05}px;font-size:${w * 0.046}px">Cue.</div></div>`,
  words: (w) => `<div style="font:700 ${w * 0.15}px/1.02 Inter,system-ui,sans-serif;letter-spacing:-.05em;color:${PAPER};padding:${w * 0.08}px;align-self:end">Copy.<br>Paste.<br><span style="color:${LIME}">Ship.</span></div>`,
};

const HEROES: Omit<Card, 'p'>[] = [
  { type: 'lime', w: 412, h: 515, rz: -1.5 },
  { type: 'dots', col: LIME, seed: 5, w: 420, h: 528, rz: 0.5 },
  { type: 'type', w: 390, h: 495, rz: -1 },
  { type: 'icon', icon: 'search', morph: true, w: 415, h: 516, rz: 1 },
  { type: 'target', w: 410, h: 501, rz: -0.5 },
  { type: 'poster', w: 420, h: 525, rz: 1.5 },
  { type: 'box', w: 421, h: 533, rz: -1 },
  { type: 'words', w: 420, h: 525, rz: 0.8 },
];
const TYPES: CardType[] = ['lime', 'lime', 'lime', 'icon', 'icon', 'icon', 'dots', 'dots', 'shape', 'shape', 'shape', 'swatch', 'stripe', 'type', 'chip', 'target'];
const ICK = ['layers', 'basket', 'person', 'search', 'ring', 'x', 'flower'];
const P = 2;                                               // camera distance / sphere radius
const NS = 64;                                             // small-card slots on the sphere

/** builds the same field every time (seeded) */
function buildCards(): Card[] {
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const heroes: Card[] = HEROES.map((o, i) => ({ ...o, p: fib(8, i, 1.1), hero: true }));
  const shapes = Object.keys(SHAPES);
  const small: Card[] = [];
  for (let i = 0; i < NS; i++) {
    const p = fib(NS, i, 0.37);
    p.x += (rnd() - 0.5) * 0.08; p.y += (rnd() - 0.5) * 0.08; p.z += (rnd() - 0.5) * 0.08;
    const q = norm(p);
    if (heroes.some((h) => dot(h.p, q) > 0.9)) continue;   // keep air around each hero
    const type = TYPES[Math.floor(rnd() * TYPES.length)];
    const w = type === 'chip' ? 130 + rnd() * 60 : 110 + rnd() * 120;
    const h = type === 'chip' ? w * 0.55 : w * (1.05 + rnd() * 0.3);
    const o: Card = { type, w, h, p: q, icon: ICK[Math.floor(rnd() * ICK.length)], rz: (rnd() - 0.5) * 8, seed: Math.floor(rnd() * 999) };
    if (type === 'shape') { const pair = [[PAPER, INK], [LIME, INK], [CARD, LIME], [CARD, PAPER]][Math.floor(rnd() * 4)]; o.bg = pair[0]; o.fg = pair[1]; o.shape = shapes[Math.floor(rnd() * shapes.length)]; }
    if (type === 'dots' && rnd() < 0.4) { o.bg = LIME; o.col = INK; }
    if (type === 'lime') { o.type = 'dots'; o.bg = LIME; o.col = INK; }   // small lime cards carry the dot mark
    if (type === 'stripe' && rnd() < 0.5) o.bg = PAPER;
    if (type === 'swatch') o.cols = [[LIME, INK, PAPER], [INK, LIME, GREY], [PAPER, GREY, INK]][Math.floor(rnd() * 3)];
    small.push(o);
  }
  return [...heroes, ...small];
}

const CSS = `
.csph{position:relative;width:100%;height:100%;min-height:320px;overflow:hidden;background:#fff;contain:strict;user-select:none;-webkit-user-select:none;outline:none;touch-action:none;cursor:grab;transition:background-color 0s}
.csph.dark{background:#111}
.csph.grabbing{cursor:grabbing}
.csph-c{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform,opacity;overflow:hidden;backface-visibility:hidden;box-sizing:border-box}
.csph-lime{background:${LIME};display:grid;place-items:center;font:700 1px/1 Inter,system-ui,sans-serif;color:${INK};letter-spacing:-.05em}
.csph-icon,.csph-dots,.csph-words{background:${CARD};display:grid;place-items:center}
.csph-words{place-items:end start}
.csph-chip{background:#151515;display:grid;place-items:center}
.csph-chip span{background:#f4f4f4;color:#111;font:600 1px/1 Inter,system-ui,sans-serif;letter-spacing:-.03em;display:block}
.csph-box{background:${INK};display:grid;place-items:center}
.csph-box span{background:#fafafa;color:#111;font:600 1px/1 Inter,system-ui,sans-serif;letter-spacing:-.05em;display:flex;align-items:center}
.csph-poster{background:${GREY};display:grid;place-items:center}
.csph-type{background:${PAPER};display:grid;place-items:center}
.csph-shape{display:grid;place-items:center}
.csph-target,.csph-swatch,.csph-stripe{background:${LIME};display:grid;place-items:center}
@media (prefers-reduced-motion:reduce){.csph-c{will-change:auto}}
`;

export default function CardSphere({
  theme = 'light', allowThemeToggle = true, onThemeChange, onSettle, loadFont = true, className, style,
}: CardSphereProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cb = useRef({ onThemeChange, onSettle, allowThemeToggle });
  cb.current = { onThemeChange, onSettle, allowThemeToggle };

  // theme prop → class (the user can still toggle it)
  useEffect(() => { rootRef.current?.classList.toggle('dark', theme === 'dark'); }, [theme]);

  useEffect(() => {
    const root = rootRef.current!;
    const ALL = buildCards();
    const heroes = ALL.filter((o) => o.hero);
    for (const o of ALL) {
      const e = document.createElement('div');
      e.className = 'csph-c csph-' + o.type;
      e.style.width = o.w + 'px'; e.style.height = o.h + 'px'; e.style.borderRadius = Math.max(4, o.w * 0.03) + 'px';
      if (o.bg) e.style.background = o.bg;
      e.innerHTML = ART[o.type](o.w, o.h, o);
      (e as HTMLDivElement & { _o?: Card })._o = o;
      root.appendChild(e); o.el = e; o.hv = 1;
    }

    let W = 0, H = 0, u = 1, F = 1, Ax = 1, Ay = 1;
    const size = () => {
      const r = root.getBoundingClientRect(); W = r.width; H = r.height;
      u = Math.min(W, H * 0.8) / 720; F = 502 * u;
      // stretch the sphere into an ellipsoid that fills the frame
      Ax = Math.max(1, (W / 2) / (F * 0.577) * 0.97); Ay = Math.max(1, (H / 2) / (F * 0.577) * 0.97);
    };
    size();
    const ro = new ResizeObserver(size); ro.observe(root);

    const FRONT = V(0, 0, 1);
    let rot = qbetween(heroes[0].p, FRONT);
    let wv = V(0, 0, 0);
    let drag: { x: number; y: number; moved: number } | null = null;
    let snap: { from: Quat; to: Quat; t0: number; ms: number; hero: number } | null = null;
    let hover: Card | null = null, lastInput = 0, settled = true;   // settled: at rest, no snap needed

    const startSnap = (target?: Card | null) => {
      const sp = Math.hypot(wv.x, wv.y, wv.z);
      const ahead = sp > 0 ? qnorm(qmul(qaxis(wv, Math.min(2.4, sp * 0.3)), rot)) : rot;
      let best = target || heroes[0], bz = -2;
      if (!target) for (const h of heroes) { const z = qrot(ahead, h.p).z; if (z > bz) { bz = z; best = h; } }
      const to = qnorm(qmul(qbetween(qrot(rot, best.p), FRONT), rot));
      const ang = 2 * Math.acos(clamp(Math.abs(rot[0] * to[0] + rot[1] * to[1] + rot[2] * to[2] + rot[3] * to[3])));
      snap = { from: rot, to, t0: performance.now(), ms: 420 + ang * 260, hero: heroes.indexOf(best) }; settled = false;
    };

    const render = (dt: number) => {
      const cx = W / 2, cy = H / 2;
      if (!drag && !snap) {
        const sp = Math.hypot(wv.x, wv.y, wv.z);
        if (sp > 0.02) { rot = qnorm(qmul(qaxis(wv, sp * dt), rot)); const k = Math.pow(0.88, dt * 30); wv = V(wv.x * k, wv.y * k, wv.z * k); }
        if (!settled && sp < 1.6 && performance.now() - lastInput > 60) startSnap();
      }
      if (snap) {
        const t = clamp((performance.now() - snap.t0) / snap.ms);
        rot = qslerp(snap.from, snap.to, SETTLE(t));
        if (t >= 1) { const h = snap.hero; snap = null; wv = V(0, 0, 0); settled = true; cb.current.onSettle?.(h); }
      }
      for (const o of ALL) {
        const e = o.el!;
        const q = qrot(rot, o.p), d = P - q.z, s = 1 / d;
        const sx = cx + q.x * F * s * Ax, sy = cy - q.y * F * s * Ay;
        const k = clamp((q.z - 0.2) / 0.55);
        const hf = o.hero ? lerp(0.5, 1, k * k * (3 - 2 * k)) : 0.5;   // heroes grow only near the front
        const sc = s * u * hf;
        const ry = Math.atan2(q.x, Math.max(0.2, q.z)) * 57.3 * 0.35, rx = Math.atan2(q.y, Math.max(0.2, q.z)) * 57.3 * 0.35;
        o.hv = lerp(o.hv ?? 1, o === hover ? 1.04 : 1, 1 - Math.pow(0.001, dt));
        const ew = o.w * sc * o.hv, eh = o.h * sc * o.hv;
        if (sx + ew < -40 || sx - ew > W + 40 || sy + eh < -40 || sy - eh > H + 40) { if (e.style.display !== 'none') e.style.display = 'none'; continue; }
        if (e.style.display === 'none') e.style.display = '';
        e.style.transform = `translate(${sx}px,${sy}px) scale(${sc * o.hv}) perspective(${o.w * 2.6}px) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${o.rz}deg) translate(${-o.w / 2}px,${-o.h / 2}px)`;
        e.style.zIndex = String(Math.round((3 - d) * 1000));
        e.style.opacity = String(o.hero ? clamp((q.z + 0.9) / 0.3) : clamp((q.z + 0.8) / 0.35));
        if (o.morph) {
          const ic = q.z > 0.97 ? 'flower' : q.z > 0.6 ? (o.ic === 'flower' ? 'flower' : 'x') : 'search';
          if (o.ic !== ic) { o.ic = ic; e.innerHTML = iconSvg(ic, o.w * 0.72); }
        }
      }
    };

    const samples: [number, number, number][] = [];
    const turn = (dx: number, dy: number) => {
      const ang = Math.hypot(dx / Ax, dy / Ay) / (F * 0.5);
      if (ang > 0) rot = qnorm(qmul(qaxis(V(dy / Ay, dx / Ax, 0), ang), rot));
    };
    const flick = (vx: number, vy: number) => { const k = 1 / (F * 0.5); wv = V((vy / Ay) * k, (vx / Ax) * k, 0); };
    const cardAt = (t: EventTarget | null) => ((t as Element | null)?.closest?.('.csph-c') as (HTMLElement & { _o?: Card }) | null)?._o ?? null;
    const toggle = () => {
      if (!cb.current.allowThemeToggle) return;
      const dark = root.classList.toggle('dark');
      cb.current.onThemeChange?.(dark ? 'dark' : 'light');
    };

    const onDown = (e: PointerEvent) => {
      root.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY, moved: 0 }; snap = null; wv = V(0, 0, 0); settled = false;
      samples.length = 0; root.classList.add('grabbing');
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) { hover = cardAt(e.target); return; }
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy);
      turn(dx, dy);
      const now = performance.now(); samples.push([now, dx, dy]);
      while (samples.length && now - samples[0][0] > 90) samples.shift();
    };
    const onUp = (e: PointerEvent) => {
      if (!drag) return;
      root.classList.remove('grabbing');
      const moved = drag.moved; drag = null; lastInput = performance.now();
      if (moved < 6) { const o = cardAt(e.target); startSnap(o && o.hero ? o : null); return; }   // click → bring it to the front
      const span = samples.length > 1 ? Math.max(0.016, (samples[samples.length - 1][0] - samples[0][0]) / 1000) : 0.016;
      flick(samples.reduce((a, s) => a + s[1], 0) / span, samples.reduce((a, s) => a + s[2], 0) / span);
    };
    const onLeave = () => { if (!drag) hover = null; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); snap = null; settled = false;
      const dx = -(e.shiftKey ? e.deltaY : e.deltaX), dy = e.shiftKey ? 0 : -e.deltaY;
      turn(dx * 0.6, dy * 0.6); flick(dx * 9, dy * 9); lastInput = performance.now() + 90;
    };
    const onKey = (e: KeyboardEvent) => {
      const m = ({ ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] } as Record<string, number[]>)[e.key];
      if (m) { e.preventDefault(); snap = null; settled = false; flick(-m[0] * 1500 * u, -m[1] * 1500 * u); lastInput = performance.now(); }
      if (e.key === 't' || e.key === 'T') toggle();
    };
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('wheel', onWheel, { passive: false });
    root.addEventListener('keydown', onKey);
    root.addEventListener('dblclick', toggle);

    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!document.hidden) render(dt);
    };
    render(0);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onUp);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('keydown', onKey);
      root.removeEventListener('dblclick', toggle);
      ALL.forEach((o) => o.el?.remove());
    };
  }, []);

  return (
    <>
      {loadFont && <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap" />}
      <style>{CSS}</style>
      <div
        ref={rootRef}
        className={['csph', theme === 'dark' ? 'dark' : '', className].filter(Boolean).join(' ')}
        style={style}
        tabIndex={0}
        role="application"
        aria-label="Cue cards. Drag, scroll or use the arrow keys to turn; double-click or press T to switch light and dark."
      />
    </>
  );
}
