"use client";


/**
 * Cue Foundations · Pixel-Perfect Shop Onboarding
 * ────────────────────────────────────────────
 * A four-step onboarding card that collects shopper preferences and ends in a personalised, scored product edit with wishlist and bag.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/pixel-perfect-shop-onboarding.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue207
 *
 * Original Cue ID: cue207
 * Category: Forms
 * ────────────────────────────────────────────
 */

/**
 * ShopOnboarding — a 4-step shopper onboarding card (React 18 + TypeScript, no other dependencies).
 *   1 · Who are you shopping for?   pixel-face cards, multi-select, at least one
 *   2 · Pick the styles you love     tag picker: Enter / comma to add, × or 2× Backspace to remove, suggestions, no duplicates, 3–12
 *   3 · Your size and budget         clothing size, UK shoe size stepper, budget slider (drag / keys)
 *   4 · Your edit is ready           matched products, match score, wishlist, add to bag, bag counter, checkout
 * The step bar, Back and Continue drive the flow; Continue unlocks only when the current step is complete,
 * and any finished step can be reopened from the step bar.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react';

/* ---------- types ---------- */
export type Audience = 'Women' | 'Men' | 'Kids' | 'Home';
export type ArtKind = 'shirt' | 'tee' | 'shoe' | 'pants' | 'bag' | 'dress' | 'cap' | 'vase' | 'kurta';
export type Product = { n: string; who: Audience; st: string[]; a: ArtKind; c: string; bg: string; p: number; was?: number };
export type ShopResult = { who: Audience[]; styles: string[]; size: string; shoe: number; budget: number; cart: string[]; wishlist: string[] };
export type ShopOnboardingProps = {
  products?: Product[];
  suggestions?: string[];
  defaultValues?: Partial<Pick<ShopResult, 'who' | 'styles' | 'size' | 'shoe' | 'budget'>>;
  onCheckout?: (result: ShopResult) => void;   // final button
  onCartChange?: (cart: string[]) => void;
  loadFont?: boolean;
  className?: string;
  style?: CSSProperties;
};

/* ---------- copy & data ---------- */
const COPY: Record<number, [string, string]> = {
  1: ['Who are you shopping for?', 'Pick everyone you buy for. We’ll tune every page to them.'],
  2: ['Pick the styles you love', 'Type a style or tap one below. The more you add, the better your edit.'],
  3: ['Your size and budget', 'So we only show things that fit — and fit your wallet.'],
  4: ['Your edit is ready', 'Hand-picked from today’s drops, matched to your styles, size and budget.'],
};
const MAXS = 12, MINS = 3, BMIN = 500, BMAX = 10000;
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SUGG = ['Streetwear', 'Denim', 'Ethnic', 'Workwear', 'Athleisure', 'Pastels', 'Vintage', 'Monochrome', 'Boho'];
const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

// 12×12 pixel sprites — one character per pixel, "." is empty
const PAL: Record<string, string> = { H: '#3b2a24', h: '#6b4a3a', S: '#f2c29b', E: '#1f1f22', M: '#c2366e', C: '#f39aa8', D: '#ee5c8e', T: '#2f5fc6', K: '#f5a524', k: '#b7761d', Y: '#ffd166',
  R: '#d9534f', r: '#a63b38', W: '#fff6e8', w: '#e8dcc6', G: '#8fc7ff', B: '#8a5a3c', g: '#2f9a5b', c: '#9a9aa2' };
const PX: Record<Audience, string[]> = {
  Women: ['...HHHHHH...', '..HHHHHHHH..', '.HHHhHHHHHH.', '.HHSSSSSSHH.', '.HSSSSSSSSH.', '.HSESSSSESH.', '.HSSSSSSSSH.', '.HSCSMMSCSH.', '.HHSSSSSSHH.', '.HH.SSSS.HH.', '...DDDDDD...', '..DDDDDDDD..'],
  Men:   ['............', '...HHHHHH...', '..HHHHHHHH..', '..HSSSHSSH..', '..SSSSSSSS..', '..SESSSSES..', '..SSSSSSSS..', '..SSSMMSSS..', '...SSSSSS...', '....SSSS....', '...TTTTTT...', '..TTTTTTTT..'],
  Kids:  ['............', '...KKKKKK...', '..KKKKKKKK..', '..kkkkkkkkkk', '..SSSSSSSS..', '.SSESSSSESS.', '.SCSSSSSSCS.', '.SSSSMMSSSS.', '..SSSSSSSS..', '....SSSS....', '...YYYYYY...', '..YYYYYYYY..'],
  Home:  ['.....RR..c..', '....RRRR.c..', '...RRRRRRc..', '..RRRRRRRR..', '.RRRRRRRRRR.', 'rrrrrrrrrrrr', '.WWWWWWWWWW.', '.WGGWWWWGGW.', '.WGGWBBWGGW.', '.WwwWBBWwwW.', '.WWWWBBWWWW.', 'gggggggggggg'],
};
const WHO: { n: Audience; d: string; c: string }[] = [
  { n: 'Women', d: 'Clothing, shoes, bags', c: '#fde3ee' },
  { n: 'Men', d: 'Shirts, denim, kicks', c: '#e3ecfd' },
  { n: 'Kids', d: 'Ages 2–12', c: '#fdf0d8' },
  { n: 'Home', d: 'Decor, linen, kitchen', c: '#e2f6e8' },
];
export const PRODUCTS: Product[] = [
  { n: 'Linen overshirt', who: 'Men', st: ['Linen', 'Minimal', 'Workwear'], a: 'shirt', c: '#d9c7a6', bg: '#f6efe2', p: 2499, was: 3299 },
  { n: 'Court sneakers', who: 'Women', st: ['Sneakers', 'Minimal', 'Athleisure', 'Monochrome'], a: 'shoe', c: '#ffffff', bg: '#e6e7ea', p: 3999 },
  { n: 'Linen wrap dress', who: 'Women', st: ['Linen', 'Boho', 'Pastels'], a: 'dress', c: '#e9a7b8', bg: '#fbe9ee', p: 3299, was: 4199 },
  { n: 'Relaxed straight jeans', who: 'Women', st: ['Denim', 'Vintage', 'Streetwear'], a: 'pants', c: '#4d6fa8', bg: '#e5ecf7', p: 2799 },
  { n: 'Boxy cotton tee', who: 'Men', st: ['Minimal', 'Streetwear', 'Monochrome'], a: 'tee', c: '#2a2a2e', bg: '#ececee', p: 999 },
  { n: 'Runner trainers', who: 'Men', st: ['Sneakers', 'Athleisure', 'Streetwear'], a: 'shoe', c: '#f5823f', bg: '#fdeee3', p: 5499, was: 6999 },
  { n: 'Chikankari kurta', who: 'Women', st: ['Ethnic', 'Pastels', 'Linen'], a: 'kurta', c: '#cfe3d2', bg: '#eef6ef', p: 2199 },
  { n: 'Canvas tote', who: 'Women', st: ['Minimal', 'Boho', 'Vintage'], a: 'bag', c: '#c7a27a', bg: '#f5ece2', p: 899 },
  { n: 'Kids rainbow tee', who: 'Kids', st: ['Pastels', 'Streetwear'], a: 'tee', c: '#8fb7ff', bg: '#e8f0ff', p: 599 },
  { n: 'Kids light-up sneakers', who: 'Kids', st: ['Sneakers', 'Athleisure'], a: 'shoe', c: '#ee5c8e', bg: '#fde6ee', p: 1799 },
  { n: 'Stoneware vase', who: 'Home', st: ['Minimal', 'Boho', 'Vintage'], a: 'vase', c: '#b9a48c', bg: '#f3eee8', p: 1299 },
  { n: 'Washed linen cushion', who: 'Home', st: ['Linen', 'Minimal', 'Pastels'], a: 'bag', c: '#a9c4b8', bg: '#ebf3ef', p: 799 },
  { n: 'Utility cargo pants', who: 'Men', st: ['Workwear', 'Streetwear'], a: 'pants', c: '#6e6a4f', bg: '#efeee6', p: 2299 },
  { n: 'Washed cap', who: 'Men', st: ['Streetwear', 'Vintage', 'Athleisure'], a: 'cap', c: '#2f5fc6', bg: '#e3ecfd', p: 699 },
];

/* ---------- small svg pieces ---------- */
const Pixel = ({ rows }: { rows: string[] }) => (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    {rows.flatMap((row, y) => [...row].map((ch, x) => (PAL[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={PAL[ch]} /> : null)))}
  </svg>
);
function Art({ a, c }: { a: ArtKind; c: string }) {
  switch (a) {
    case 'shirt': return <path d="M8 4 4 7l2 4 2-1v10h8V10l2 1 2-4-4-3-2 2h-4z" fill={c} />;
    case 'tee': return <path d="M8 4 3 8l2.5 3L8 10v10h8V10l2.5 1L21 8l-5-4c-.5 2-2 3-4 3s-3.5-1-4-3z" fill={c} />;
    case 'shoe': return <><path d="M3 15c0-3 1-6 3-8l4 4c2 1 6 1 9 2 1.5.5 2 2 2 3v1H3z" fill={c} /><path d="M3 18h18" stroke="#fff" strokeWidth="1.6" /></>;
    case 'pants': return <path d="M7 3h10l1 18h-4l-2-11-2 11H6z" fill={c} />;
    case 'bag': return <><path d="M5 8h14l-1 12H6z" fill={c} /><path d="M9 8a3 3 0 0 1 6 0" fill="none" stroke={c} strokeWidth="1.8" /></>;
    case 'dress': return <path d="M9 3h6l-1 5 5 13H5l5-13z" fill={c} />;
    case 'cap': return <><path d="M4 14a8 8 0 0 1 16 0z" fill={c} /><path d="M12 14h9" stroke={c} strokeWidth="2.4" strokeLinecap="round" /></>;
    case 'vase': return <path d="M9 3h6v3c3 2 4 5 3 9-1 4-3 6-6 6s-5-2-6-6c-1-4 0-7 3-9z" fill={c} />;
    case 'kurta': return <><path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3-2 3h-4z" fill={c} /><path d="M12 6v6" stroke="#fff" strokeWidth="1.4" /></>;
  }
}
const X = () => <svg width="9" height="9" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m2 2 8 8M10 2l-8 8" /></svg>;

/* ---------- matching ---------- */
// score: shared styles (×2) + audience match (×3); anything over budget is dropped; best 4, cheaper first on ties
export function matchProducts(list: Product[], who: Audience[], styles: string[], budget: number) {
  const want = styles.map((s) => s.toLowerCase());
  return list.map((x) => ({ x, s: x.st.filter((t) => want.includes(t.toLowerCase())).length * 2 + (who.includes(x.who) ? 3 : 0) }))
    .filter((r) => r.x.p <= budget && (who.includes(r.x.who) || !who.length))
    .sort((a, b) => b.s - a.s || a.x.p - b.x.p).slice(0, 4);
}

const CSS = `.so, .so *{box-sizing: border-box;}
.so{display:flex;justify-content:center;width:100%;font-family:Inter,system-ui,sans-serif;color:#1f1f22;-webkit-font-smoothing:antialiased;--page: #f0f0f0; --card: #fff; --card-2: #f7f7f8; --line: #e8e8ea; --ink: #1f1f22; --text: #5d5d64; --muted: #8e8e95; --g1: #f9b94a; --g2: #f5823f; --g3: #ee5c8e; --g4: #d65be6; --chip: #e6ecfb; --chip-ink: #2a2f45; --sugg: #ececee; --sel: #1f1f22;}
.so button, .so input{font: inherit; color: inherit;}
.so .card{width: min(100%, 440px); background: linear-gradient(180deg, #fff 0, #fbfbfb 100%); border-radius: 26px; padding: 26px 26px 20px; box-shadow: 0 0 0 1px var(--line), 0 1px 2px rgba(0,0,0,.03), 0 18px 40px -30px rgba(0,0,0,.2); overflow: hidden;}
.so .steps{display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;}
.so .steps button{height: 6px; padding: 0; border: 0; border-radius: 99px; background: #ececee; position: relative; overflow: hidden; cursor: pointer;}
.so .steps button:disabled{cursor: default;}
.so .steps button::after{content: ''; position: absolute; inset: 0; border-radius: inherit; transform: scaleX(var(--f, 0)); transform-origin: left; transition: transform .5s cubic-bezier(.3,.8,.3,1);}
.so .steps button::after{background: var(--ink);}
.so .top{display: flex; justify-content: space-between; align-items: center; margin-top: 7px; font-size: 11px;}
.so .top{color: var(--muted);}
.so .top b{font-weight: 500; color: var(--ink);}
.so .cart{display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: 99px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line); font-size: 11px; font-weight: 500; transition: transform .2s;}
.so .cart.bump{animation: so-bump .35s cubic-bezier(.3,1.6,.5,1);}
@keyframes so-bump{50% { transform: scale(1.18); }}
.so .badge{display: flex; width: fit-content; align-items: center; gap: 6px; margin: 22px auto 0; padding: 5px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--text); background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line);}
.so h1{margin: 14px 0 8px; text-align: center; font-size: 25px; font-weight: 500; letter-spacing: -.02em;}
.so .sub{margin: 0 auto; max-width: 340px; text-align: center; font-size: 14px; line-height: 1.45; color: var(--text);}
.so .stage{position: relative; margin-top: 20px; min-height: 282px;}
.so .pane{display: none;}
.so .pane.on{display: block; animation: so-inR .35s cubic-bezier(.2,.8,.2,1);}
.so .stage.back .pane.on{animation-name: so-inL;}
@keyframes so-inR{from { opacity: 0; transform: translateX(26px); }}
@keyframes so-inL{from { opacity: 0; transform: translateX(-26px); }}
.so .lbl{display: flex; align-items: baseline; justify-content: space-between; margin: 0 0 8px; font-size: 13.5px; font-weight: 500;}
.so .lbl span{color: var(--muted); font-weight: 400; margin-left: 3px;}
.so .lbl .cnt{font-size: 12px; font-variant-numeric: tabular-nums;}
.so .lbl .cnt.full{color: var(--ink); font-weight: 500;}
.so .hint{min-height: 16px; margin-top: 6px; font-size: 11.5px; color: var(--muted);}
.so .who{display: grid; grid-template-columns: 1fr 1fr; gap: 10px;}
.so .who button{display: flex; flex-direction: column; align-items: flex-start; gap: 18px; padding: 14px; border: 0; border-radius: 16px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line); cursor: pointer; text-align: left; transition: box-shadow .15s, transform .12s, background-color .15s;}
.so .who button:hover{background: #f1f1f3;}
.so .who button:active{transform: scale(.98);}
.so .who button[aria-pressed=true]{background: #fff; box-shadow: inset 0 0 0 2px var(--sel);}
.so .who .ic{width: 46px; height: 46px; border-radius: 12px; display: grid; place-items: center;}
.so .who .ic svg{width: 36px; height: 36px; shape-rendering: crispEdges; transition: transform .25s cubic-bezier(.3,1.6,.5,1);}
.so .who button:hover .ic svg, .so .who button[aria-pressed=true] .ic svg{transform: translateY(-2px) rotate(-4deg);}
.so .who b{display: block; font-size: 14.5px; font-weight: 500;}
.so .who small{display: block; margin-top: 2px; font-size: 12px; color: var(--muted);}
.so .who .ck{position: absolute;}
.so .who button{position: relative;}
.so .who button::after{content: ''; position: absolute; top: 12px; right: 12px; width: 18px; height: 18px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px #cfcfd4; background: #fff; transition: background-color .15s, box-shadow .15s;}
.so .who button[aria-pressed=true]::after{background: var(--sel) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='m3 6.2 2 2 4-4.4' fill='none' stroke='white' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 12px no-repeat; box-shadow: none;}
.so .tags{display: flex; flex-wrap: wrap; gap: 6px; min-height: 108px; padding: 9px; border-radius: 12px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line); cursor: text; align-content: flex-start; transition: box-shadow .2s;}
.so .tags:focus-within{box-shadow: inset 0 0 0 1px #c9cdd8, 0 0 0 3px #eef1fb;}
.so .tag{display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 6px 0 10px; border-radius: 7px; background: var(--chip); color: var(--chip-ink); font-size: 12.5px; animation: so-tagIn .22s cubic-bezier(.3,1.4,.5,1) both;}
.so .tag button{width: 16px; height: 16px; padding: 0; border: 0; border-radius: 4px; background: none; display: grid; place-items: center; color: var(--chip-ink); cursor: pointer; opacity: .75;}
.so .tag button:hover{opacity: 1; background: rgba(42,47,69,.1);}
.so .tag.pending{box-shadow: 0 0 0 1.5px var(--g3);}
@keyframes so-tagIn{from { opacity: 0; transform: scale(.8); }}
.so .tags input{flex: 1; min-width: 110px; height: 28px; border: 0; outline: 0; background: none; font-size: 12.5px; padding: 0 4px;}
.so .tags input::placeholder{color: var(--muted);}
.so .sg-l{margin: 12px 0 7px; font-size: 12px; color: var(--muted);}
.so .suggs{display: flex; flex-wrap: wrap; gap: 6px;}
.so .sg{height: 28px; padding: 0 10px; border: 0; border-radius: 7px; background: var(--sugg); font-size: 12.5px; cursor: pointer; transition: background-color .15s, transform .12s;}
.so .sg:hover{background: #e2e2e6;}
.so .sg:active{transform: scale(.95);}
.so .sg:disabled{opacity: .45; cursor: default;}
.so .sizes{display: flex; flex-wrap: wrap; gap: 6px;}
.so .sizes button{min-width: 46px; height: 36px; padding: 0 10px; border: 0; border-radius: 10px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line); font-size: 13px; font-weight: 500; cursor: pointer; transition: box-shadow .15s, background-color .15s;}
.so .sizes button[aria-pressed=true]{background: var(--sel); color: #fff; box-shadow: none;}
.so .row{display: flex; align-items: center; justify-content: space-between; margin-top: 20px;}
.so .row .lbl{margin: 0;}
.so .stepper{display: inline-flex; align-items: center; height: 36px; border-radius: 10px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line);}
.so .stepper button{width: 36px; height: 36px; border: 0; background: none; font-size: 17px; cursor: pointer; border-radius: 10px;}
.so .stepper button:hover{background: #ececef;}
.so .stepper button:disabled{opacity: .35; cursor: default;}
.so .stepper output{min-width: 66px; text-align: center; font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums;}
.so .budget{margin-top: 22px;}
.so .bud-v{font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums;}
.so .slider{position: relative; height: 24px; margin-top: 10px; border-radius: 99px; background: #eeeef0; touch-action: none; cursor: pointer;}
.so .slider .fill{position: absolute; left: 0; top: 0; bottom: 0; min-width: 24px; border-radius: inherit; background: var(--ink);}
.so .slider .knob{position: absolute; top: 2px; width: 20px; height: 20px; margin-left: -22px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.25); display: grid; place-items: center; outline: 0; transition: transform .15s;}
.so .slider .knob:focus-visible{box-shadow: 0 0 0 3px rgba(31,31,34,.3), 0 1px 3px rgba(0,0,0,.25);}
.so .slider.drag .knob{transform: scale(1.12);}
.so .scale{display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px; color: var(--muted);}
.so .edit-sum{display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px;}
.so .edit-sum span{height: 22px; padding: 0 8px; border-radius: 6px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line); font-size: 11px; line-height: 22px; color: var(--text);}
.so .grid{display: grid; grid-template-columns: 1fr 1fr; gap: 10px;}
.so .prod{position: relative; border-radius: 16px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line); padding: 8px; animation: so-tagIn .35s cubic-bezier(.3,1.3,.5,1) both;}
.so .prod .art{aspect-ratio: 1.7; border-radius: 11px; display: grid; place-items: center;}
.so .prod .art svg{width: 46%; height: 70%; transition: transform .3s cubic-bezier(.3,1.4,.5,1);}
.so .prod:hover .art svg{transform: scale(1.06) rotate(-4deg);}
.so .prod b{display: block; margin: 8px 2px 2px; font-size: 12.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
.so .prod .pr{display: flex; align-items: center; justify-content: space-between; margin: 0 2px; font-size: 12.5px;}
.so .prod .pr s{color: var(--muted); font-size: 11px; margin-left: 4px;}
.so .add{height: 26px; padding: 0 9px; border: 0; border-radius: 7px; background: var(--ink); color: #fff; font-size: 11.5px; font-weight: 500; cursor: pointer; transition: background-color .2s, transform .1s;}
.so .add:active{transform: scale(.94);}
.so .add.in{background: #2f9a5b;}
.so .heart{position: absolute; top: 14px; right: 14px; width: 28px; height: 28px; border: 0; border-radius: 50%; background: rgba(255,255,255,.9); display: grid; place-items: center; cursor: pointer; transition: transform .15s;}
.so .heart:active{transform: scale(.85);}
.so .heart svg path{transition: fill .2s, stroke .2s;}
.so .heart[aria-pressed=true] svg path{fill: #ee5c8e; stroke: #ee5c8e;}
.so .match{position: absolute; left: 14px; top: 14px; height: 20px; padding: 0 7px; border-radius: 99px; background: rgba(255,255,255,.92); font-size: 10px; font-weight: 600; line-height: 20px; color: var(--ink);}
.so .foot{display: flex; justify-content: space-between; margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--line);}
.so .btn{height: 42px; padding: 0 16px; border-radius: 12px; border: 1px solid #d9d9dd; background: #fff; font-size: 14.5px; font-weight: 500; cursor: pointer; transition: background-color .15s, transform .12s, opacity .2s;}
.so .btn:hover{background: #f6f6f7;}
.so .btn:active{transform: scale(.97);}
.so .btn.dark{background: #1f1f22; color: #fff; border-color: #1f1f22; box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #1f1f22;}
.so .btn.dark:hover{background: #333338;}
.so .btn:disabled{opacity: .35; cursor: default; transform: none;}
.so .btn[hidden]{display: none;}
.so .btn:focus-visible, .so .sg:focus-visible, .so .who button:focus-visible, .so .sizes button:focus-visible, .so .stepper button:focus-visible, .so .add:focus-visible, .so .heart:focus-visible, .so .tag button:focus-visible, .so .steps button:focus-visible{outline: 2px solid var(--ink); outline-offset: 2px;}
@media (max-width: 420px){.so .card{padding: 22px 18px 18px; border-radius: 22px;}
.so h1{font-size: 22px;}}
@media (prefers-reduced-motion: reduce){.so, .so *, .so *::before, .so *::after{animation: none !important; transition: none !important;}}`;

export default function ShopOnboarding({ products = PRODUCTS, suggestions = SUGG, defaultValues, onCheckout, onCartChange, loadFont = true, className, style }: ShopOnboardingProps) {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [who, setWho] = useState<Audience[]>(defaultValues?.who ?? ['Women']);
  const [styles, setStyles] = useState<string[]>(defaultValues?.styles ?? ['Linen', 'Sneakers', 'Minimal']);
  const [size, setSize] = useState<string | null>(defaultValues?.size ?? 'M');
  const [shoe, setShoe] = useState(defaultValues?.shoe ?? 7);
  const [budget, setBudgetRaw] = useState(defaultValues?.budget ?? 4000);
  const [cart, setCart] = useState<string[]>([]);
  const [wish, setWish] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [hint, setHint] = useState('');
  const [pendingDel, setPendingDel] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [bump, setBump] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!loadFont || document.getElementById('so-inter')) return;
    const l = document.createElement('link'); l.id = 'so-inter'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'; document.head.appendChild(l);
  }, [loadFont]);
  // the bag counter pops whenever the bag changes (restart the animation)
  useEffect(() => { if (!bump || !cartRef.current) return; const c = cartRef.current; c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }, [bump]);

  /* ---------- step 2 helpers ---------- */
  const has = (list: string[], s: string) => list.some((x) => x.toLowerCase() === s.toLowerCase());
  // adds one style; works on a running list so a comma-pasted batch is applied in one go
  const addTo = (list: string[], raw: string): string[] | null => {
    const s = raw.trim().replace(/\s+/g, ' ').slice(0, 28);
    if (!s) return null;
    if (has(list, s)) { setHint(`“${s}” is already on your list.`); return null; }
    if (list.length >= MAXS) { setHint('You’ve picked 12 styles — remove one to add another.'); return null; }
    setHint(''); setPendingDel(false); setLastAdded(s); return [...list, s];
  };
  const addStyle = (raw: string) => { const next = addTo(styles, raw); if (next) setStyles(next); return !!next; };
  const removeStyle = (s: string) => { setStyles((l) => l.filter((x) => x !== s)); setPendingDel(false); setHint(''); };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const v = draft;
    if ((e.key === 'Enter' || e.key === ',') && v.trim()) { e.preventDefault(); if (addStyle(v)) setDraft(''); }
    else if (e.key === 'Enter') e.preventDefault();
    else if (e.key === 'Backspace' && !v && styles.length) { e.preventDefault(); if (pendingDel) removeStyle(styles[styles.length - 1]); else setPendingDel(true); }
    else if (pendingDel) setPendingDel(false);
  };
  const onDraft = (v: string) => {
    if (!v.includes(',')) return setDraft(v);
    const parts = v.split(','); let list = styles;
    parts.slice(0, -1).forEach((p) => { const n = addTo(list, p); if (n) list = n; });
    if (list !== styles) setStyles(list);
    setDraft(parts[parts.length - 1]);
  };
  const full = styles.length >= MAXS;
  const hint2 = hint || (styles.length < MINS ? `Add ${MINS - styles.length} more to continue.` : '');

  /* ---------- step 3 helpers ---------- */
  const setBudget = (v: number) => setBudgetRaw(Math.round(Math.max(BMIN, Math.min(BMAX, v)) / 250) * 250);
  const at = (e: RPointerEvent) => { const r = sliderRef.current!.getBoundingClientRect(); return BMIN + Math.max(0, Math.min(1, (e.clientX - r.left - 12) / (r.width - 24))) * (BMAX - BMIN); };
  const pct = (budget - BMIN) / (BMAX - BMIN) * 100;
  const pos = `calc(${pct}% + ${24 * (1 - pct / 100)}px)`;
  const budText = budget >= BMAX ? 'No limit' : `Up to ${inr(budget)}`;
  const onKnobKey = (e: KeyboardEvent) => {
    const d = ({ ArrowRight: 250, ArrowUp: 250, ArrowLeft: -250, ArrowDown: -250, PageUp: 1000, PageDown: -1000 } as Record<string, number>)[e.key];
    if (d) { e.preventDefault(); setBudget(budget + d); } else if (e.key === 'Home') setBudget(BMIN); else if (e.key === 'End') setBudget(BMAX);
  };

  /* ---------- step 4 ---------- */
  const picks = useMemo(() => matchProducts(products, who, styles, budget), [products, who, styles, budget]);
  const toggleCart = (id: string) => { const next = cart.includes(id) ? cart.filter((x) => x !== id) : [...cart, id]; setCart(next); setBump((b) => b + 1); onCartChange?.(next); };
  const toggleWish = (id: string) => setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  /* ---------- flow ---------- */
  const valid = (st: number) => (st === 1 ? who.length > 0 : st === 2 ? styles.length >= MINS : st === 3 ? !!size : true);
  const go = (n: number, d: number) => { setDir(d); setStep(n); setLeaving(false); };
  const next = () => {
    if (!valid(step)) return;
    if (step < 4) return go(step + 1, 1);
    setLeaving(true);
    onCheckout?.({ who, styles, size: size!, shoe, budget, cart, wishlist: wish });
  };
  const nextLabel = step === 3 ? 'Show my edit' : step === 4 ? (leaving ? (cart.length ? 'Opening checkout…' : 'Opening the shop…') : cart.length ? `Checkout · ${cart.length}` : 'Start shopping') : 'Continue';
  const [title, sub] = COPY[step];

  return (
    <div className={'so' + (className ? ' ' + className : '')} style={style}>
      <style>{CSS}</style>
      <section className="card" aria-labelledby="so-title">
        <div className="steps" role="tablist" aria-label="Steps">
          {[1, 2, 3, 4].map((n, i) => (
            <button key={n} type="button" role="tab" aria-label={`Step ${n}`} aria-selected={n === step} disabled={n > step}
              style={{ '--f': i < step ? 1 : 0 } as CSSProperties} onClick={() => { if (n < step) go(n, -1); }} />
          ))}
        </div>
        <div className="top">
          <span><b>{step * 25}% of your edit</b> ready ✦</span>
          <span className="cart" ref={cartRef} aria-live="polite">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l-1 13H7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
            <span>{cart.length}</span>
          </span>
        </div>
        <div className="badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M10 2l1.8 5.2L17 9l-5.2 1.8L10 16l-1.8-5.2L3 9l5.2-1.8zM18 13l.9 2.6 2.6.9-2.6.9L18 20l-.9-2.6-2.6-.9 2.6-.9z" /></svg>
          <span>{step === 4 ? 'Your edit' : 'Smart picks'}</span>
        </div>
        <h1 id="so-title">{title}</h1>
        <p className="sub">{sub}</p>

        <div className={'stage' + (dir < 0 ? ' back' : '')} aria-live="polite">
          {/* 1 · who */}
          <div className={'pane' + (step === 1 ? ' on' : '')}>
            <div className="lbl">Shopping for <span>(pick any)</span></div>
            <div className="who">
              {WHO.map((w) => (
                <button key={w.n} type="button" aria-pressed={who.includes(w.n)}
                  onClick={() => setWho((l) => (l.includes(w.n) ? l.filter((x) => x !== w.n) : [...l, w.n]))}>
                  <span className="ic" style={{ background: w.c }}><Pixel rows={PX[w.n]} /></span>
                  <span><b>{w.n}</b><small>{w.d}</small></span>
                </button>
              ))}
            </div>
            <div className="hint">{step === 1 && !who.length ? 'Pick at least one to continue.' : ''}</div>
          </div>

          {/* 2 · styles */}
          <div className={'pane' + (step === 2 ? ' on' : '')}>
            <div className="lbl"><label htmlFor="so-st">Styles <span>(3 to 12)</span></label><span className={'cnt' + (full ? ' full' : '')}>{styles.length}/{MAXS}</span></div>
            <div className="tags" onClick={() => inputRef.current?.focus()}>
              {styles.map((s, i) => (
                <span key={s} className={'tag' + (pendingDel && i === styles.length - 1 ? ' pending' : '')} style={s === lastAdded ? undefined : { animation: 'none' }}>
                  {s}<button type="button" aria-label={`Remove ${s}`} onClick={(e) => { e.stopPropagation(); removeStyle(s); inputRef.current?.focus(); }}><X /></button>
                </span>
              ))}
              <input id="so-st" ref={inputRef} autoComplete="off" aria-describedby="so-h2" value={draft} disabled={full}
                placeholder={full ? 'That’s the maximum' : styles.length ? 'Add another style…' : 'Type a style, press Enter'}
                onChange={(e) => onDraft(e.target.value)} onKeyDown={onKey}
                onBlur={() => { if (draft.trim() && addStyle(draft)) setDraft(''); }} />
            </div>
            <div className="hint" id="so-h2" aria-live="polite">{hint2}</div>
            <div className="sg-l">Popular right now:</div>
            <div className="suggs">
              {suggestions.filter((s) => !has(styles, s)).map((s) => (
                <button key={s} type="button" className="sg" disabled={full} onClick={() => addStyle(s)}>{s}</button>
              ))}
              {suggestions.every((s) => has(styles, s)) && <span className="sg-l" style={{ margin: 0 }}>All added</span>}
            </div>
          </div>

          {/* 3 · size & budget */}
          <div className={'pane' + (step === 3 ? ' on' : '')}>
            <div className="lbl">Clothing size</div>
            <div className="sizes" role="group" aria-label="Clothing size">
              {SIZES.map((z) => <button key={z} type="button" aria-pressed={size === z} onClick={() => setSize((v) => (v === z ? null : z))}>{z}</button>)}
            </div>
            <div className="row"><span className="lbl">Shoe size <span>(UK)</span></span>
              <span className="stepper">
                <button type="button" aria-label="Smaller shoe size" disabled={shoe <= 3} onClick={() => setShoe((v) => Math.max(3, v - 1))}>−</button>
                <output aria-live="polite">UK {shoe}</output>
                <button type="button" aria-label="Bigger shoe size" disabled={shoe >= 13} onClick={() => setShoe((v) => Math.min(13, v + 1))}>+</button>
              </span>
            </div>
            <div className="budget">
              <div className="lbl" style={{ margin: 0 }}>Budget per item <span className="bud-v">{budText}</span></div>
              <div className={'slider' + (drag ? ' drag' : '')} ref={sliderRef}
                onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); setBudget(at(e)); }}
                onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) setBudget(at(e)); }}
                onPointerUp={() => setDrag(false)} onPointerCancel={() => setDrag(false)}>
                <span className="fill" style={{ width: pos }} />
                <span className="knob" style={{ left: pos }} role="slider" tabIndex={0} aria-label="Budget per item" aria-valuemin={BMIN} aria-valuemax={BMAX}
                  aria-valuenow={budget} aria-valuetext={budText} onKeyDown={onKnobKey}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="#444"><circle cx="2" cy="2" r=".9" /><circle cx="6" cy="2" r=".9" /><circle cx="2" cy="6" r=".9" /><circle cx="6" cy="6" r=".9" /></svg>
                </span>
              </div>
              <div className="scale"><span>₹500</span><span>₹10,000+</span></div>
            </div>
            <div className="hint">{size ? '' : 'Pick a clothing size to continue.'}</div>
          </div>

          {/* 4 · the edit (mounted only on step 4 so the cards animate in each time you arrive) */}
          <div className={'pane' + (step === 4 ? ' on' : '')}>
            {step === 4 && <>
              <div className="edit-sum">
                {[...who, ...styles.slice(0, 4), `Size ${size}`, `UK ${shoe}`, budget >= BMAX ? 'Any price' : `≤ ${inr(budget)}`].map((t, i) => <span key={i}>{t}</span>)}
              </div>
              <div className="grid">
                {!picks.length && <div className="hint" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>Nothing under this budget yet — try raising it a little.</div>}
                {picks.map(({ x, s }, i) => {
                  const inCart = cart.includes(x.n), liked = wish.includes(x.n);
                  return (
                    <article key={x.n} className="prod" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="art" style={{ background: x.bg }}><svg viewBox="0 0 24 24" aria-hidden="true"><Art a={x.a} c={x.c} /></svg></div>
                      <span className="match">{Math.min(99, 62 + s * 6)}% match</span>
                      <button type="button" className="heart" aria-pressed={liked} aria-label={`${liked ? 'Remove from' : 'Save to'} wishlist: ${x.n}`} onClick={() => toggleWish(x.n)}>
                        <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="#1f1f22" strokeWidth="1.8" strokeLinejoin="round" /></svg>
                      </button>
                      <b title={x.n}>{x.n}</b>
                      <div className="pr"><span>{inr(x.p)}{x.was ? <s>{inr(x.was)}</s> : null}</span>
                        <button type="button" className={'add' + (inCart ? ' in' : '')} onClick={() => toggleCart(x.n)}>{inCart ? 'Added ✓' : 'Add'}</button></div>
                    </article>
                  );
                })}
              </div>
            </>}
          </div>
        </div>

        <div className="foot">
          <button type="button" className="btn" disabled={step === 1} onClick={() => step > 1 && go(step - 1, -1)}>Back</button>
          <button type="button" className="btn dark" disabled={!valid(step)} onClick={next}>{nextLabel}</button>
        </div>
      </section>
    </div>
  );
}
