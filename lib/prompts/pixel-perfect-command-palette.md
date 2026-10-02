# Pixel-Perfect Command Palette — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for productivity tools, SaaS dashboards, or internal apps where power users expect a Spotlight-style ⌘K launcher for fast navigation.

---

# Prompt — "CommandPalette" light command palette (pixel-perfect)

Copy everything below the line into any AI coding agent.

---

Build a React + TypeScript component `CommandPalette.tsx` (React 18, no other dependencies; font Inter 400/500/600). It is a light command palette, 600 px wide, made of:
- a soft grey shell around a white card;
- a search bar, then two sections of commands with real keyboard shortcuts shown as key caps, plus a **Files** section while searching;
- a footer with ↓ ↑ Move and ↵ Open.

## 1. Props

```ts
type Command = { id: string; t: string; ic: ReactNode; keys: string[]; chord?: string; seq?: string; kw?: string };
// keys: what the caps show — 'mod' renders ⌘ on Mac / Ctrl elsewhere, 'shift' renders ⇧
// chord: 'mod+b' / 'mod+shift+d' — works anytime     seq: 'g s' / 'h' — letter pairs, only while the palette is closed
type CommandPaletteProps = {
  commands?: Command[]; files?: { t: string; m: string }[];
  initialRecent?: string[];        // ids under "Jump back in", max 4 — default board, archive, invite, ideas
  defaultOpen?: boolean;           // true
  placeholder?: string;            // 'Search commands, people or files…'
  onRun?: (target) => void;        // { kind: 'command', command, via: 'click'|'enter'|'key' } | { kind: 'file', file, via }
  showToast?: boolean; showLauncher?: boolean;
  backdrop?: boolean;              // true: the root paints the blue-grey background and is min-height 100vh
  loadFont?: boolean; className?: string; style?: CSSProperties;
};
```

- **Root:** `<div class="cp">`, a **full-width** grid (`width: 100%`, so a centring flex parent can't shrink the palette below 600 px) that centres horizontally and anchors near the top (`padding-top: max(70px, 16vh)`), so the palette never jumps when the results shrink.
- **CSS:** inject the CSS below (scoped under `.cp`) in a `<style>`.
- **Backdrop (`cp-bg`, on by default):** `min-height: 100vh` and `#e7edf2` with soft `#d6e5f0` / `#dbe7ef` radial patches, so the grey shell stands out on any host page.

## 2. Look (1× sizes)

- **Shell:** `#f3f3f3`, padding 11, radius 22, with a 1 px `#dfe3e7` ring and a blue-tinted drop shadow.
- **Card:** `#fdfdfd`, radius 16.
- **Search:** 36 px tall, 10 px in from the card edges, radius 9, background `#f2f2f2`. It holds a 16 px magnifier, 13.5 px text, and a small × clear button that shows only when there's text.
- **Sections:**
  - **"Jump back in"** (history icon): the recent ids;
  - **"Shortcuts"** (bolt icon): every command *not* in recent, in the original order, so a command never disappears;
  - **"Files"** (folder icon): only while searching, with the file's meta text on the right.
  - Section labels are 11 px grey `#8f8f8f`, with an 18 px gap between sections.
- **Rows:**
  - 29 px tall at a 31 px pitch, running edge to edge across the card;
  - a 15 px stroke icon at 17 px from the left, then a 13.5 px label;
  - the active row is `#f4f4f4`.
- **Key caps:** 18 px squares (min-width 18, padding 0 4), white with a 1 px `#d5d5d5` inset ring and a 1 px bottom line, 9.5 px text, 3 px gap. `.down` presses them 1 px with a darker ring.
- **Footer:** 19 px white keys (↓ ↑ and ↵) with 11 px labels "Move" and "Open".
- **Toast:** a dark pill at the bottom centre with a green tick. "via shortcut" appears in grey when the command came from a key.
- **Launcher:** "Search or jump to… ⌘ K", fixed at the top centre, visible only while the palette is closed.

## 3. Behaviour

- **Search:**
  - matches the title plus keywords, case-insensitively;
  - the first match is bolded with `<mark>`, and the active row resets to the top on every change;
  - with no results: `Nothing matches “q”. Try a different word, or press Esc to clear.`
- **Keyboard and mouse:**
  - ↑/↓ wrap around and scroll the active row into view; hovering also sets the active row;
  - Enter runs the active row;
  - mousedown on the list doesn't steal focus from the input;
  - the footer keys press visually on ↑/↓/Enter.
- **Esc:** clears the search, or closes the palette if it's already empty. ⌘K (Ctrl+K off Mac) toggles it. A pointer press outside `.cmd` closes it.
- **Chords** (⌘B, ⌘I, ⌘⇧D, ⌘⇧S) work open or closed, and that row's caps press down.
- **Letter shortcuts** ("i m", "g s", "h") run only while the palette is closed and never while typing in a field. Keys must arrive within 900 ms of each other, and a key that only starts a longer shortcut waits for the next one.
- **Running:**
  - the row flashes (`ran`) and the toast shows;
  - commands move to the front of recent (max 4);
  - after 160 ms (240 ms for shortcuts) the palette closes, clears and resets.
- **Shortcut keys:** browsers reserve ⌘N/Ctrl+N, so don't use it. "Start a blank board" is ⌘B.

## 4. Data (use verbatim)

```tsx
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
```

## 5. Markup (the CSS depends on these classes)

```
div.cp
  button.launch(.hide) > text + span.kbd > span.cap ×2
  div.cmd(.closed)[role=dialog]
    div.card > label.search(.has) > svg + input[role=combobox] + button.clear
               div.list[role=listbox] > div.sec(svg + label) · button.item(.on)(.ran)[role=option] > span.ic + span.lb(mark) + span.caps > span.cap(.down)… | span.meta
                                     | div.empty > b
    div.foot > div(span.key(.down) ×2 + span "Move") · div(span.key + span "Open")
  div.toast(.show)[role=status] > i > svg + span(text + small)
```

## 6. CSS (inject verbatim)

```css
.cp, .cp *{box-sizing: border-box;}
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
.cp.cp-bg{min-height:100vh;background: radial-gradient(70% 60% at 85% 8%, #d6e5f0 0%, transparent 70%), radial-gradient(60% 55% at 8% 95%, #dbe7ef 0%, transparent 70%), #e7edf2;}
```

## 7. Acceptance checks

- **Opening:** it opens with the input focused and shows 7 commands.
- **Arrows:** ↓↓ makes "Share an invite link" active, and ↑ from the top wraps to "Get support".
- **Search:**
  - "set" leaves only "Workspace settings", with "set" bold;
  - "road" shows a Files section with Q3 roadmap, and Enter opens it with a toast and closes the palette;
  - "zzzz" shows the empty state.
- **Esc and toggle:** Ctrl+K reopens the palette. Esc clears the search, and a second Esc closes it.
- **Shortcuts while closed:**
  - Ctrl+⇧+D gives the toast "Go to overview · via shortcut", and the recent list then starts with "Go to overview" with all 7 commands still listed;
  - G then S runs "Ideas & feedback", H runs "Get support", and I then M runs "Share an invite link".
- **Shortcut while open:** Ctrl+B runs "Start a blank board".
- **Closing and width:** a click outside closes it. At 375 px wide there's no horizontal overflow.
- **Errors:** no console errors.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue209
