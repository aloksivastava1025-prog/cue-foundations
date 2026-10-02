"use client";


/**
 * Cue Foundations · Pixel-Perfect Command Palette
 * ────────────────────────────────────────────
 * A light, pixel-precise command palette with keyboard navigation, key-cap chords, letter sequences, file search, and toast feedback on run.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/pixel-perfect-command-palette.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue209
 *
 * Original Cue ID: cue209
 * Category: Navigation
 * ────────────────────────────────────────────
 */

/**
 * CommandPalette — a light command palette (React 18 + TypeScript, no other dependencies).
 *  - Search filters commands (title + keywords) and files, with the match in bold; "Files" appears while searching.
 *  - ↑/↓ move (wraps), hover moves, Enter runs; Esc clears the search, then closes. ⌘/Ctrl+K toggles.
 *  - Shortcuts really work: chords like ⌘B / ⌘⇧D anytime; letter pairs like "G S" while the palette is closed.
 *  - Running closes the palette, shows a toast and moves the command to the top of "Jump back in".
 */
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/* ---------- types ---------- */
export type Command = { id: string; t: string; ic: ReactNode; keys: string[]; chord?: string; seq?: string; kw?: string };
export type FileItem = { t: string; m: string };
export type RunTarget = { kind: 'command'; command: Command; via: 'click' | 'enter' | 'key' } | { kind: 'file'; file: FileItem; via: 'click' | 'enter' };
export type CommandPaletteProps = {
  commands?: Command[];
  files?: FileItem[];
  initialRecent?: string[];        // ids shown under "Jump back in" (max 4)
  defaultOpen?: boolean;           // default true
  placeholder?: string;
  onRun?: (target: RunTarget) => void;
  showToast?: boolean;             // default true
  showLauncher?: boolean;          // the "Search or jump to…" button while closed; default true
  backdrop?: boolean;              // the soft blue-grey full-height background; default true (set false to sit on your own page)
  loadFont?: boolean;
  className?: string;
  style?: CSSProperties;
};

/* ---------- icons ---------- */
const I = ({ children }: { children: ReactNode }) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
const S12 = ({ children }: { children: ReactNode }) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
export const ICONS = {
  plus: <I><path d="M12 5v14M5 12h14" /></I>,
  archive: <I><rect x="4" y="4" width="16" height="5" rx="1" /><path d="M5.5 9v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9M10 13h4" /></I>,
  link: <I><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></I>,
  bulb: <I><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" /></I>,
  grid: <I><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="4" rx="1.5" /><rect x="13.5" y="11" width="6.5" height="9" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /></I>,
  gear: <I><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></I>,
  help: <I><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.7c0 1.7-2.4 2.1-2.4 3.6M12 17h.01" /></I>,
  file: <I><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></I>,
};
const SEC_ICON = {
  recent: <S12><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></S12>,
  short: <S12><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></S12>,
  files: <S12><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></S12>,
};
const SHIFT = <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"><path d="M6 1.5 1.5 6.5h2.5V10.5h4V6.5h2.5z" /></svg>;

/* ---------- data (keys: 'mod' = ⌘ on Mac / Ctrl elsewhere, 'shift' = ⇧) ---------- */
export const COMMANDS: Command[] = [
  { id: 'board', t: 'Start a blank board', ic: ICONS.plus, keys: ['mod', 'B'], chord: 'mod+b', kw: 'new create project canvas' },
  { id: 'archive', t: 'Browse the archive', ic: ICONS.archive, keys: ['mod', 'I'], chord: 'mod+i', kw: 'old past history' },
  { id: 'invite', t: 'Share an invite link', ic: ICONS.link, keys: ['I', 'M'], seq: 'i m', kw: 'member people team add' },
  { id: 'ideas', t: 'Ideas & feedback', ic: ICONS.bulb, keys: ['G', 'S'], seq: 'g s', kw: 'suggestion request vote' },
  { id: 'overview', t: 'Go to overview', ic: ICONS.grid, keys: ['mod', 'shift', 'D'], chord: 'mod+shift+d', kw: 'dashboard home stats' },
  { id: 'settings', t: 'Workspace settings', ic: ICONS.gear, keys: ['mod', 'shift', 'S'], chord: 'mod+shift+s', kw: 'preferences account billing' },
  { id: 'support', t: 'Get support', ic: ICONS.help, keys: ['H'], seq: 'h', kw: 'help centre docs contact' },
];
export const FILES: FileItem[] = [
  { t: 'Q3 roadmap', m: 'Board · edited 2h ago' }, { t: 'Brand guidelines', m: 'PDF · 4.2 MB' }, { t: 'Pricing page copy', m: 'Doc · edited yesterday' },
  { t: 'Team offsite photos', m: 'Folder · 48 items' }, { t: 'Onboarding checklist', m: 'Doc · shared with you' }, { t: 'Launch week plan', m: 'Board · edited Mon' },
];

const CSS = `.cp, .cp *{box-sizing: border-box;}
.cp{width:100%;box-sizing:border-box;display:grid;justify-items:center;align-items:start;padding:max(70px, 16vh) 16px 24px;font-family:Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;--shell: #f3f3f3; --shell-line: #e7e7e7; --card: #fdfdfd; --field: #f2f2f2; --row: #f4f4f4; --ink: #2a2a2a; --text: #3b3b3b; --dim: #8f8f8f; --cap-line: #d5d5d5;}
.cp button, .cp input{font: inherit; color: inherit;}
.cp .launch{position: fixed; top: 22px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; height: 34px; padding: 0 8px 0 12px; border: 0; border-radius: 10px; background: rgba(255,255,255,.92); box-shadow: 0 0 0 1px #dfe3e7, 0 6px 18px -10px rgba(25,55,85,.3); color: var(--dim); font-size: 13px; cursor: pointer; transition: opacity .2s;}
.cp .launch.hide{opacity: 0; pointer-events: none;}
.cp .launch:hover{color: var(--ink);}
.cp .launch .kbd{display: inline-flex; gap: 3px;}
.cp .cmd{width: min(600px, 100%); padding: 11px; border-radius: 22px; background: var(--shell); box-shadow: 0 0 0 1px #dfe3e7, 0 1px 2px rgba(20,40,60,.06), 0 30px 70px -28px rgba(25,55,85,.38); transition: opacity .18s, transform .22s cubic-bezier(.2,.9,.3,1.1);}
.cp .cmd.closed{opacity: 0; transform: translateY(6px) scale(.97); pointer-events: none;}
.cp .card{border-radius: 16px; background: var(--card); box-shadow: 0 1px 2px rgba(0,0,0,.04); padding: 10px 0 8px;}
.cp .search{display: flex; align-items: center; gap: 9px; height: 36px; margin: 0 10px; padding: 0 12px; border-radius: 9px; background: var(--field);}
.cp .search svg{flex: none; color: #555;}
.cp .search input{flex: 1; min-width: 0; border: 0; outline: 0; background: none; font-size: 13.5px; letter-spacing: -.005em; color: var(--ink);}
.cp .search input::placeholder{color: #6b6b6b;}
.cp .search .clear{width: 20px; height: 20px; border: 0; border-radius: 6px; background: #e4e4e4; display: none; place-items: center; cursor: pointer; color: #666;}
.cp .search.has .clear{display: grid;}
.cp .list{max-height: 330px; overflow: auto; padding-top: 14px; scrollbar-width: thin; scrollbar-color: #ddd transparent;}
.cp .sec{padding: 0 15px 6px; display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--dim);}
.cp .sec:not(:first-child){margin-top: 18px;}
.cp .item{position: relative; display: flex; align-items: center; gap: 13px; width: 100%; height: 29px; margin: 2px 0; padding: 0 15px 0 17px; border: 0; background: none; text-align: left; cursor: pointer; font-size: 13.5px; letter-spacing: -.005em; color: var(--text);}
.cp .item.on{background: var(--row);}
.cp .item .ic{width: 16px; display: grid; place-items: center; color: #555; flex: none;}
.cp .item .lb{flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
.cp .item .lb mark{background: none; color: var(--ink); font-weight: 600;}
.cp .item .meta{font-size: 11.5px; color: var(--dim); margin-right: 4px;}
.cp .item.ran{animation: cp-ran .5s ease-out;}
@keyframes cp-ran{30% { background: #e9eef3; }}
.cp .caps{display: flex; gap: 3px;}
.cp .cap{min-width: 18px; height: 18px; padding: 0 4px; border-radius: 4px; background: #fff; box-shadow: inset 0 0 0 1px var(--cap-line), 0 1px 0 #e2e2e2; display: grid; place-items: center; font-size: 9.5px; color: #555; transition: transform .08s, box-shadow .08s, background-color .08s;}
.cp .cap svg{display: block;}
.cp .cap.down{transform: translateY(1px); background: #f1f1f1; box-shadow: inset 0 0 0 1px #c8c8c8;}
.cp .empty{padding: 26px 16px 30px; text-align: center; font-size: 13px; color: var(--dim); line-height: 1.6;}
.cp .empty b{color: var(--ink); font-weight: 500;}
.cp .foot{display: flex; align-items: center; justify-content: space-between; padding: 12px 6px 1px 6px; font-size: 11px; color: #3e3e3e;}
.cp .foot > div{display: flex; align-items: center; gap: 6px;}
.cp .key{width: 19px; height: 19px; border-radius: 5px; background: #fff; display: grid; place-items: center; box-shadow: 0 1px 1px rgba(0,0,0,.06); color: #444; transition: transform .08s, background-color .08s;}
.cp .key.down{transform: translateY(1px); background: #ececec;}
.cp .foot span{margin-left: 4px;}
.cp .toast{position: fixed; left: 50%; bottom: 28px; transform: translate(-50%, 12px); display: flex; align-items: center; gap: 9px; height: 38px; padding: 0 14px 0 10px; border-radius: 11px; background: #1f1f1f; color: #f4f4f4; font-size: 13px; box-shadow: 0 14px 30px -12px rgba(0,0,0,.45); opacity: 0; pointer-events: none; transition: opacity .2s, transform .25s cubic-bezier(.2,.9,.3,1.2);}
.cp .toast.show{opacity: 1; transform: translate(-50%, 0);}
.cp .toast i{width: 20px; height: 20px; border-radius: 6px; background: #2f2f2f; display: grid; place-items: center;}
.cp .toast small{color: #9b9b9b; font-size: 12px; margin-left: 4px;}
.cp .item:focus-visible, .cp .launch:focus-visible, .cp .clear:focus-visible{outline: 2px solid #8bb8d6; outline-offset: -2px;}
@media (prefers-reduced-motion: reduce){.cp, .cp *, .cp *::before, .cp *::after{transition: none !important; animation: none !important;}}
.cp.cp-bg{min-height:100vh;background: radial-gradient(70% 60% at 85% 8%, #d6e5f0 0%, transparent 70%), radial-gradient(60% 55% at 8% 95%, #dbe7ef 0%, transparent 70%), #e7edf2;}`;

const Mark = ({ t, q }: { t: string; q: string }) => {
  const i = q ? t.toLowerCase().indexOf(q) : -1;
  if (i < 0) return <>{t}</>;
  return <>{t.slice(0, i)}<mark>{t.slice(i, i + q.length)}</mark>{t.slice(i + q.length)}</>;
};

export default function CommandPalette({
  commands = COMMANDS, files = FILES, initialRecent = ['board', 'archive', 'invite', 'ideas'], defaultOpen = true,
  placeholder = 'Search commands, people or files…', onRun, showToast = true, showLauncher = true, backdrop = true, loadFont = true, className, style,
}: CommandPaletteProps) {
  const uid = useId().replace(/:/g, '');
  const [open, setOpen] = useState(defaultOpen);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState(initialRecent.slice(0, 4));
  const [mac, setMac] = useState(false);
  const [toast, setToast] = useState<{ text: string; sub: string; show: boolean }>({ text: '', sub: '', show: false });
  const [down, setDown] = useState<string[]>([]);       // pressed caps: 'row:<id>', 'kDown', 'kUp', 'kEnter'
  const [ran, setRan] = useState(-1);
  const input = useRef<HTMLInputElement>(null), root = useRef<HTMLDivElement>(null), listRef = useRef<HTMLDivElement>(null);
  const seq = useRef(''), seqT = useRef(0), toastT = useRef(0), timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };
  const byId = useMemo(() => Object.fromEntries(commands.map((c) => [c.id, c])), [commands]);

  useEffect(() => { setMac(/Mac|iPhone|iPad/.test(navigator.platform)); }, []);
  useEffect(() => {
    if (!loadFont || document.getElementById('cp-inter')) return;
    const l = document.createElement('link'); l.id = 'cp-inter'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'; document.head.appendChild(l);
  }, [loadFont]);
  useEffect(() => { if (defaultOpen) later(() => input.current?.focus(), 60); return () => { timers.current.forEach(clearTimeout); clearTimeout(toastT.current); clearTimeout(seqT.current); }; }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- groups ---------- */
  const query = q.trim().toLowerCase();
  const hit = (c: Command) => !query || `${c.t} ${c.kw ?? ''}`.toLowerCase().includes(query);
  type Row = { kind: 'command'; c: Command } | { kind: 'file'; f: FileItem };
  const groups = useMemo(() => {
    const g: { key: keyof typeof SEC_ICON; h: string; rows: Row[] }[] = [
      { key: 'recent', h: 'Jump back in', rows: recent.map((id) => byId[id]).filter(Boolean).filter(hit).map((c) => ({ kind: 'command', c })) },
      { key: 'short', h: 'Shortcuts', rows: commands.filter((c) => !recent.includes(c.id)).filter(hit).map((c) => ({ kind: 'command', c })) },
      { key: 'files', h: 'Files', rows: query ? files.filter((f) => f.t.toLowerCase().includes(query)).map((f) => ({ kind: 'file', f })) : [] },
    ];
    return g.filter((x) => x.rows.length);
  }, [recent, commands, files, query, byId]);   // eslint-disable-line react-hooks/exhaustive-deps
  const rows = groups.flatMap((g) => g.rows);
  const act = Math.min(active, Math.max(0, rows.length - 1));
  useEffect(() => { document.getElementById(`${uid}-o${act}`)?.scrollIntoView({ block: 'nearest' }); }, [act, uid]);

  /* ---------- actions ---------- */
  const press = (ids: string[]) => { setDown((d) => [...d, ...ids]); later(() => setDown((d) => d.filter((x) => !ids.includes(x))), 140); };
  const say = (text: string, sub = '') => { if (!showToast) return; setToast({ text, sub, show: true }); clearTimeout(toastT.current); toastT.current = window.setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200); };
  const doOpen = () => { setOpen(true); setActive(0); later(() => input.current?.focus(), 30); };
  const doClose = () => { setOpen(false); input.current?.blur(); };
  const finish = (ms: number) => later(() => { doClose(); setQ(''); setActive(0); setRan(-1); }, ms);
  const runRow = (r: Row, i: number, via: 'click' | 'enter') => {
    setRan(i);
    if (r.kind === 'file') { say(`Opening “${r.f.t}”`, r.f.m); onRun?.({ kind: 'file', file: r.f, via }); }
    else { say(r.c.t); onRun?.({ kind: 'command', command: r.c, via }); setRecent((l) => [r.c.id, ...l.filter((x) => x !== r.c.id)].slice(0, 4)); }
    finish(160);
  };
  const runKey = (id: string) => {
    const c = byId[id]; if (!c) return;
    const i = rows.findIndex((r) => r.kind === 'command' && r.c.id === id); if (i >= 0) setRan(i);
    say(c.t, 'via shortcut'); onRun?.({ kind: 'command', command: c, via: 'key' }); setRecent((l) => [id, ...l.filter((x) => x !== id)].slice(0, 4));
    finish(240);
  };

  /* ---------- keyboard (global) ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = mac ? e.metaKey : e.ctrlKey, k = e.key.toLowerCase();
      if (mod && k === 'k') { e.preventDefault(); open ? doClose() : doOpen(); return; }
      const chord = (mod ? 'mod+' : '') + (e.shiftKey ? 'shift+' : '') + k;
      const c = commands.find((x) => x.chord === chord);
      if (mod && c) { e.preventDefault(); press([`row:${c.id}`]); runKey(c.id); return; }
      if (open) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (rows.length) setActive((act + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length); press([e.key === 'ArrowDown' ? 'kDown' : 'kUp']); return; }
        if (e.key === 'Enter') { e.preventDefault(); press(['kEnter']); if (rows[act]) runRow(rows[act], act, 'enter'); return; }
        if (e.key === 'Escape') { e.preventDefault(); if (q) { setQ(''); setActive(0); } else doClose(); }
        return;
      }
      // closed: letter pairs ("g s") and single letters ("h"), never while typing in a field
      const t = e.target as HTMLElement | null;
      if (mod || e.altKey || t?.closest?.('input, textarea, [contenteditable=true]') || !/^[a-z]$/.test(k)) return;
      seq.current = (seq.current ? seq.current + ' ' : '') + k; clearTimeout(seqT.current); seqT.current = window.setTimeout(() => (seq.current = ''), 900);
      const exact = commands.find((x) => x.seq === seq.current), prefix = commands.some((x) => x.seq?.startsWith(seq.current + ' '));
      if (exact && !prefix) { seq.current = ''; e.preventDefault(); runKey(exact.id); } else if (!prefix && !exact) seq.current = '';
    };
    const onDown = (e: PointerEvent) => { if (open && !(e.target as Element).closest?.('.cmd')) doClose(); };
    addEventListener('keydown', onKey); addEventListener('pointerdown', onDown);
    return () => { removeEventListener('keydown', onKey); removeEventListener('pointerdown', onDown); };
  });

  const cap = (k: string, i: number, pressed: boolean) => <span key={i} className={'cap' + (pressed ? ' down' : '')}>{k === 'mod' ? (mac ? '⌘' : 'Ctrl') : k === 'shift' ? SHIFT : k}</span>;
  let n = -1;

  return (
    <div ref={root} className={'cp' + (backdrop ? ' cp-bg' : '') + (className ? ' ' + className : '')} style={style}>
      <style>{CSS}</style>
      {showLauncher && (
        <button className={'launch' + (open ? ' hide' : '')} aria-label="Open command palette" onClick={doOpen}>
          Search or jump to… <span className="kbd"><span className="cap">{mac ? '⌘' : 'Ctrl'}</span><span className="cap">K</span></span>
        </button>
      )}

      <div className={'cmd' + (open ? '' : ' closed')} role="dialog" aria-label="Command palette">
        <div className="card">
          <label className={'search' + (query ? ' has' : '')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
            <input ref={input} value={q} placeholder={placeholder} autoComplete="off" spellCheck={false} role="combobox" aria-expanded="true" aria-controls={`${uid}-list`} aria-autocomplete="list"
              aria-activedescendant={rows.length ? `${uid}-o${act}` : undefined} onChange={(e) => { setQ(e.target.value); setActive(0); }} />
            <button className="clear" type="button" aria-label="Clear search" onClick={(e) => { e.preventDefault(); setQ(''); setActive(0); input.current?.focus(); }}>
              <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="m2 2 6 6M8 2 2 8" /></svg>
            </button>
          </label>
          <div className="list" id={`${uid}-list`} role="listbox" aria-label="Commands" ref={listRef} onMouseDown={(e) => e.preventDefault()}>
            {groups.length ? groups.map((g) => [
              <div key={g.key} className="sec" role="presentation">{SEC_ICON[g.key]}{g.h}</div>,
              ...g.rows.map((r) => {
                const i = ++n, on = i === act;
                const common = { id: `${uid}-o${i}`, role: 'option', 'aria-selected': on, tabIndex: -1, className: 'item' + (on ? ' on' : '') + (ran === i ? ' ran' : ''),
                  onPointerMove: () => { if (i !== act) setActive(i); }, onClick: () => runRow(r, i, 'click') } as const;
                return r.kind === 'file'
                  ? <button key={'f' + r.f.t} {...common}><span className="ic">{ICONS.file}</span><span className="lb"><Mark t={r.f.t} q={query} /></span><span className="meta">{r.f.m}</span></button>
                  : <button key={r.c.id} {...common}><span className="ic">{r.c.ic}</span><span className="lb"><Mark t={r.c.t} q={query} /></span>
                      <span className="caps">{r.c.keys.map((k, j) => cap(k, j, down.includes(`row:${r.c.id}`)))}</span></button>;
              }),
            ]) : <div className="empty">Nothing matches <b>“{q.trim()}”</b>.<br />Try a different word, or press Esc to clear.</div>}
          </div>
        </div>
        <div className="foot">
          <div>
            <span className={'key' + (down.includes('kDown') ? ' down' : '')}><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" /></svg></span>
            <span className={'key' + (down.includes('kUp') ? ' down' : '')}><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" /></svg></span>
            <span>Move</span>
          </div>
          <div>
            <span className={'key' + (down.includes('kEnter') ? ' down' : '')}><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2.5v3.5a1.5 1.5 0 0 1-1.5 1.5H2.5M4.5 5.5l-2 2 2 2" /></svg></span>
            <span>Open</span>
          </div>
        </div>
      </div>

      {showToast && (
        <div className={'toast' + (toast.show ? ' show' : '')} role="status" aria-live="polite">
          <i><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#7fd39b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m2.5 6.3 2.3 2.3 4.7-5" /></svg></i>
          <span>{toast.text}{toast.sub && <small>{toast.sub}</small>}</span>
        </div>
      )}
    </div>
  );
}
