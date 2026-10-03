"use client";

/**
 * Cue Foundations · Outline Inspector Panel
 * ────────────────────────────────────────────
 * A pixel-perfect design-tool settings panel with scrub sliders, a color picker, form menu, and mirror switch for configuring outline shapes.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/outline-inspector-panel.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue220
 *
 * Original Cue ID: cue220
 * Category: Forms
 * ────────────────────────────────────────────
 */

/**
 * OutlinePanel — a design-tool settings panel (React 18, no other dependencies).
 *  - Form: a select with a menu (icons + tick); ↑/↓ on the closed select steps through the options.
 *  - Thickness and Size: scrub sliders where the whole row is the track. Press on the track to jump there and drag;
 *    press on the number to scrub relative to where you started; double-click the number (or Enter) to type a value.
 *  - Tint: a colour row (hex on hover) with a picker: saturation/value square, hue bar, hex field and presets.
 *  - Mirror: a switch.
 * The CSS below is generated from index.html by _build/build.py (scoped under .os).
 */
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react';

export type OutlineForm = 'semi' | 'circle' | 'quarter' | 'wave' | 'line';
export type OutlineSettings = { shape: OutlineForm; weight: number; color: string; radius: number; flip: boolean };
export type OutlinePanelProps = {
  defaultValue?: Partial<OutlineSettings>;
  /** Called with all settings after every change. */
  onChange?: (settings: OutlineSettings) => void;
  /** #ececed page that centres the panel (default true). */
  backdrop?: boolean;
  loadFont?: boolean;
  className?: string;
  style?: CSSProperties;
};

const CSS = `__CSS__`;

export const DEFAULT_SETTINGS: OutlineSettings = { shape: 'semi', weight: 4, color: '#ef6a3a', radius: 268, flip: false };
const FORMS: [OutlineForm, string, string][] = [
  ['semi', 'Arch', 'M4 16a8 8 0 0 1 16 0'],
  ['circle', 'Ring', 'M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16'],
  ['quarter', 'Corner', 'M5 19A14 14 0 0 1 19 5'],
  ['wave', 'Ripple', 'M3 12c3-6 6-6 9 0s6 6 9 0'],
  ['line', 'Straight', 'M4 12h16'],
];
const PRESETS = ['#ef6a3a', '#f2b33d', '#3fb68b', '#2fa4d9', '#3b82f6', '#8b5cf6', '#ec5c9a', '#2b2b2e'];

/* ---------- colour maths ---------- */
type HSV = [h: number, s: number, v: number];
const hsv2rgb = (h: number, s: number, v: number) => { const f = (n: number) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5), f(3), f(1)].map((x) => Math.round(x * 255)); };
const rgb2hex = (rgb: number[]) => '#' + rgb.map((x) => x.toString(16).padStart(2, '0')).join('');
function hex2hsv(hex: string): HSV {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), c = mx - mn;
  let h = 0; if (c) h = mx === r ? ((g - b) / c) % 6 : mx === g ? (b - r) / c + 2 : (r - g) / c + 4;
  return [(h * 60 + 360) % 360, mx ? c / mx : 0, mx];
}

/** Pointer drag inside an element, reported as 0–1 on both axes. */
function useDrag(fn: (x: number, y: number) => void) {
  const fnRef = useRef(fn); fnRef.current = fn;
  const go = (e: RPointerEvent<HTMLDivElement>) => { const r = e.currentTarget.getBoundingClientRect(); fnRef.current(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))); };
  const on = useRef(false);
  return {
    onPointerDown: (e: RPointerEvent<HTMLDivElement>) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); on.current = true; go(e); },
    onPointerMove: (e: RPointerEvent<HTMLDivElement>) => { if (on.current) go(e); },
    onPointerUp: () => { on.current = false; },
  };
}

/* ---------- scrub slider: the whole row is the track ---------- */
type SliderProps = { id: string; label: string; min: number; max: number; step: number; floor?: number; dots?: boolean; value: number; onSet: (v: number) => void };
function Slider({ id, label, min, max, step, floor = min, dots, value, onSet }: SliderProps) {
  const el = useRef<HTMLDivElement>(null), lb = useRef<HTMLSpanElement>(null), inp = useRef<HTMLInputElement>(null);
  const [box, setBox] = useState({ w: 0, lr: 0 });                   // row width and the label's right edge
  const [drag, setDrag] = useState<{ x: number; v: number; rel: boolean } | null>(null);
  const [editing, setEditing] = useState(false);
  const onVal = useRef(false), done = useRef(false);
  const valRef = useRef(value); valRef.current = value;

  useLayoutEffect(() => {
    const measure = () => { const r = el.current, l = lb.current; if (r && l) setBox({ w: r.clientWidth, lr: l.offsetLeft + l.offsetWidth }); };
    measure(); addEventListener('resize', measure); document.fonts?.ready.then(measure);
    return () => removeEventListener('resize', measure);
  }, []);
  useLayoutEffect(() => { if (editing && inp.current) { done.current = false; inp.current.focus(); inp.current.select(); } }, [editing]);

  const set = (v: number) => { v = Math.min(max, Math.max(floor, Math.round(v / step) * step)); if (v !== valRef.current) onSet(v); };
  const at = (clientX: number) => { const r = el.current!.getBoundingClientRect(); return min + (clientX - r.left) / r.width * (max - min); };
  const commit = (ok: boolean) => {
    if (done.current) return; done.current = true;
    const n = parseFloat(inp.current?.value ?? ''); setEditing(false); if (ok && !isNaN(n)) set(n); el.current?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const big = e.shiftKey ? 10 : 1, k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowUp') set(value + step * big);
    else if (k === 'ArrowLeft' || k === 'ArrowDown') set(value - step * big);
    else if (k === 'Home') set(floor); else if (k === 'End') set(max);
    else if (k === 'Enter') setEditing(true); else return;
    e.preventDefault();
  };

  const p = (value - min) / (max - min), fx = p * box.w;
  const small = fx - 10 < box.lr + 8;
  const steps: number[] = []; if (dots) for (let v = min + step; v < max; v += step) steps.push(v);
  return (
    <div ref={el} className={'row slider' + (drag ? ' drag' : '')} id={id} role="slider" tabIndex={0} aria-label={label} aria-valuemin={floor} aria-valuemax={max} aria-valuenow={value}
      onPointerDown={(e) => {
        if (e.button !== 0 || (e.target as HTMLElement).closest('input')) return;
        e.preventDefault(); e.currentTarget.focus(); e.currentTarget.setPointerCapture(e.pointerId);
        const rel = !!(e.target as HTMLElement).closest('.val'); onVal.current = rel;
        setDrag({ x: e.clientX, v: value, rel }); if (!rel) set(at(e.clientX));
      }}
      onPointerMove={(e) => { if (drag) set(drag.rel ? drag.v + (e.clientX - drag.x) / el.current!.getBoundingClientRect().width * (max - min) : at(e.clientX)); }}
      onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)}
      onDoubleClick={() => { if (onVal.current) setEditing(true); }}     // pointer capture retargets the event to the row
      onKeyDown={onKey}>
      <div className={'fill' + (p >= 1 ? ' full' : '') + (small ? ' small' : '')} style={{ width: p * 100 + '%' }}><i className="grip" /></div>
      {dots && (
        <div className="dots">
          {steps.map((v) => { const x = (v - min) / (max - min) * box.w; return <i key={v} style={{ left: (v - min) / (max - min) * 100 + '%', opacity: x > fx + 12 && x < box.w - 44 && x > 80 ? 1 : 0 }} />; })}
        </div>
      )}
      <span ref={lb} className="lb">{label}</span>
      <span className="val">
        {editing
          ? <input ref={inp} defaultValue={String(value)} aria-label={label} onPointerDown={(e) => e.stopPropagation()} onBlur={() => commit(true)}
              onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') commit(true); if (e.key === 'Escape') commit(false); }} />
          : value}
      </span>
    </div>
  );
}

/* ---------- panel ---------- */
export default function OutlinePanel({ defaultValue, onChange, backdrop = true, loadFont = true, className, style }: OutlinePanelProps) {
  const [s, setS] = useState<OutlineSettings>(() => ({ ...DEFAULT_SETTINGS, ...defaultValue }));
  const sRef = useRef(s);
  const [hsv, setHsv] = useState<HSV>(() => hex2hsv(s.color));            // kept separately so hue survives greys
  const [hexText, setHexText] = useState(s.color.toUpperCase());
  const [pop, setPop] = useState<{ kind: 'menu' | 'picker'; top: number } | null>(null);
  const [hi, setHi] = useState(0);
  const formBtn = useRef<HTMLButtonElement>(null), tintBtn = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null), hexRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loadFont || document.getElementById('os-fonts')) return;
    const l = document.createElement('link'); l.id = 'os-fonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(l);
  }, [loadFont]);

  const update = (patch: Partial<OutlineSettings>) => { const next = { ...sRef.current, ...patch }; sRef.current = next; setS(next); onChange?.(next); };
  const setForm = (k: OutlineForm) => update({ shape: k });
  const setColor = (hex: string, fromInput = false) => { hex = hex.toLowerCase(); setHsv(hex2hsv(hex)); if (!fromInput) setHexText(hex.toUpperCase()); update({ color: hex }); };
  const setFromHsv = (h: number, sat: number, v: number) => { const hex = rgb2hex(hsv2rgb(h, sat, v)); setHsv([h, sat, v]); setHexText(hex.toUpperCase()); update({ color: hex }); };

  /* popovers */
  const btnFor = (kind: 'menu' | 'picker') => (kind === 'menu' ? formBtn : tintBtn).current!;
  const show = (kind: 'menu' | 'picker') => { const b = btnFor(kind); setPop({ kind, top: b.offsetTop + b.offsetHeight + 6 }); };
  const hide = (focus?: boolean) => { if (!pop) return; const b = btnFor(pop.kind); setPop(null); if (focus) b.focus(); };
  useLayoutEffect(() => {
    const p = popRef.current; if (!pop || !p) return;
    const b = btnFor(pop.kind);
    if (p.getBoundingClientRect().bottom > innerHeight - 8 && b.getBoundingClientRect().top - p.offsetHeight - 6 > 8) {   // no room below: open above
      const top = b.offsetTop - p.offsetHeight - 6; if (top !== pop.top) { setPop({ ...pop, top }); return; }
    }
    if (pop.kind === 'menu') (p.querySelectorAll('button')[hi] as HTMLButtonElement | undefined)?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pop]);
  useLayoutEffect(() => { if (pop?.kind === 'picker' && hexRef.current) { hexRef.current.focus(); hexRef.current.select(); } }, [pop?.kind]);
  useEffect(() => {
    if (!pop) return;
    const b = btnFor(pop.kind);
    const down = (e: PointerEvent) => { const t = e.target as Node; if (!popRef.current?.contains(t) && !b.contains(t)) setPop(null); };
    const key = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); setPop(null); b.focus(); } };
    document.addEventListener('pointerdown', down); addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); removeEventListener('keydown', key); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pop]);

  const focusOption = (i: number) => { setHi(i); (popRef.current?.querySelectorAll('button')[i] as HTMLButtonElement | undefined)?.focus(); };
  const sv = useDrag((x, y) => setFromHsv(hsv[0], x, 1 - y));
  const hue = useDrag((x) => setFromHsv(x * 359.9, hsv[1], hsv[2]));
  const name = FORMS.find(([k]) => k === s.shape)?.[1] ?? '';
  const menuOpen = pop?.kind === 'menu', pickerOpen = pop?.kind === 'picker';

  return (
    <div className={'os' + (backdrop ? '' : ' nobd') + (className ? ' ' + className : '')} style={style}>
      <style>{CSS}</style>
      <aside className="panel" id="panel" aria-label="Outline settings">
        <div className="sec"><h3>Outline</h3></div>
        <div className="rows">
          <button ref={formBtn} className={'row select' + (menuOpen ? ' open' : '')} id="shapeBtn" aria-haspopup="listbox" aria-expanded={menuOpen}
            onClick={() => { if (menuOpen) return hide(true); setHi(FORMS.findIndex(([k]) => k === s.shape)); show('menu'); }}
            onKeyDown={(e) => {
              if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return; e.preventDefault();
              const i = FORMS.findIndex(([k]) => k === sRef.current.shape), n = FORMS.length;
              setForm(FORMS[(i + (e.key === 'ArrowDown' ? 1 : n - 1)) % n][0]);          // arrows on the closed select step through the forms
            }}>
            <span className="lb">Form</span><span className="val" id="shapeVal">{name}</span>
            <svg className="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 9.5l4-4 4 4M8 14.5l4 4 4-4" /></svg>
          </button>
          <Slider id="weight" label="Thickness" min={0} floor={1} max={10} step={1} dots value={s.weight} onSet={(v) => update({ weight: v })} />
          <button ref={tintBtn} className={'row color' + (pickerOpen ? ' open' : '')} id="colorBtn" aria-haspopup="dialog" aria-expanded={pickerOpen}
            onClick={() => (pickerOpen ? hide(true) : show('picker'))}>
            <span className="lb">Tint</span><span className="val hex" id="hexVal">{s.color}</span><span className="sw" id="sw" style={{ '--c': s.color } as CSSProperties} />
          </button>
          <Slider id="radius" label="Size" min={0} max={500} step={1} value={s.radius} onSet={(v) => update({ radius: v })} />
          <button className="row switch" id="flip" role="switch" aria-checked={s.flip} onClick={() => update({ flip: !sRef.current.flip })}>
            <span className="lb">Mirror</span><span className="tg" />
          </button>
        </div>

        <div ref={menuOpen ? popRef : undefined} className={'pop menu' + (menuOpen ? ' open' : '')} id="shapeMenu" role="listbox" aria-label="Form" style={menuOpen ? { top: pop.top } : undefined}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); focusOption((hi + (e.key === 'ArrowDown' ? 1 : FORMS.length - 1)) % FORMS.length); }
            if (e.key === 'Tab') setPop(null);
          }}>
          {FORMS.map(([k, n, d], i) => (
            <button key={k} role="option" data-k={k} aria-selected={s.shape === k} className={menuOpen && hi === i ? 'hi' : undefined}
              onPointerMove={() => { if (hi !== i) focusOption(i); }} onClick={() => { setForm(k); hide(true); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={d} /></svg>{n}
              <svg className="ck" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            </button>
          ))}
        </div>
        <div ref={pickerOpen ? popRef : undefined} className={'pop picker' + (pickerOpen ? ' open' : '')} id="picker" role="dialog" aria-label="Tint" style={pickerOpen ? { top: pop.top } : undefined}>
          <div className="sv" id="sv" style={{ '--h': `hsl(${hsv[0]}, 100%, 50%)` } as CSSProperties} {...sv}>
            <span className="knob" id="svKnob" style={{ left: hsv[1] * 100 + '%', top: (1 - hsv[2]) * 100 + '%', background: s.color }} />
          </div>
          <div className="hue" id="hue" {...hue}>
            <span className="knob" id="hueKnob" style={{ left: hsv[0] / 360 * 100 + '%', background: `hsl(${hsv[0]}, 100%, 50%)` }} />
          </div>
          <div className="hexrow">
            <label htmlFor="hexIn">Hex</label>
            <input ref={hexRef} id="hexIn" maxLength={7} spellCheck={false} autoComplete="off" value={hexText}
              onChange={(e) => {
                setHexText(e.target.value);
                let v = e.target.value.trim(); if (!v.startsWith('#')) v = '#' + v;
                if (/^#[0-9a-f]{6}$/i.test(v)) setColor(v, true); else if (/^#[0-9a-f]{3}$/i.test(v)) setColor('#' + [...v.slice(1)].map((c) => c + c).join(''), true);
              }}
              onBlur={() => setHexText(sRef.current.color.toUpperCase())}
              onKeyDown={(e) => { if (e.key === 'Enter') hide(true); }} />
          </div>
          <div className="presets" id="presets">
            {PRESETS.map((c) => <button key={c} style={{ '--c': c } as CSSProperties} data-c={c} aria-label={c} onClick={() => setColor(c)} />)}
          </div>
        </div>
      </aside>
    </div>
  );
}
