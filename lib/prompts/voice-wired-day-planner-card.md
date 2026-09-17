# Voice-Wired Day Planner Card — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

> **Use case:** Ideal as a productivity or lifestyle app dashboard widget for Linear/Cron/Todoist-style tools where daily task tracking needs tactile, stateful polish.

---

# Tasks & Events Timeline — Fully-Wired Day Planner Card with Voice Player + Calendar Modal

> **This is an ADDITION to my existing project. DO NOT create a new HTML file. DO NOT overwrite my current `<body>`, `<html>`, or global styles.**
> Drop this into my existing HTML at the spot I mark. If Inter is already loaded from Google Fonts, reuse — don't duplicate. Namespace new class names to avoid collisions.

Build a pixel-perfect **tasks & events timeline card** — the kind of daily planner you'd see on a Linear/Cron/Todoist-tier product. A 310-wide white card holds a filterable timeline (Life / Home & Family / Work / All), each item has a **completed / active / faded / upcoming** state, dashed blue connector shows continuation from the last-completed node. Below floats a **voice-note player** pill with an animated waveform that fills as time advances. Clicking a calendar icon opens a **fully functional month-view calendar modal** with prev/next navigation, real month arithmetic, and date-range selection. Everything wired, no dead buttons.

Award-winning polish, zero libraries, pure HTML + CSS + vanilla JS.

---

## FRAMEWORK

- Plain **HTML + CSS + vanilla JS**. No React, no libraries.
- Single Google Font: **Inter** (weights 400 / 500 / 600 / 700).
- All icons inline SVG.

---

## ASSETS

Fonts only:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

No images. Every icon (back, sun, checkmark, calendar, waveform, trash, play/pause, send, chevrons) is inline SVG.

---

## DESIGN TOKENS (paste verbatim)

```css
:root {
  --bg-color: #f7f7f9;
  --card-bg: #ffffff;
  --text-main: #111111;
  --text-secondary: #71717a;
  --text-tertiary: #a1a1aa;
  --accent-blue: #3251f2;
  --accent-blue-light: #eef1fe;
  --line-color: #e4e4e7;
}
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
body {
  background-color: #f4f4f7;
  background-image: radial-gradient(#d4d4d8 1px, transparent 1px);
  background-size: 20px 20px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 100vh; padding: 20px;
}
```

Body has a **subtle dot-grid** background using a 1px radial-gradient repeat at 20×20 spacing — reads as printer-grade paper texture.

---

## SECTION 1 — Main card

```css
.container { width: 310px; display: flex; flex-direction: column; gap: 12px; }

.card {
  background: var(--card-bg);
  border-radius: 28px;
  padding: 24px 20px;
  box-shadow:
    0 20px 40px -10px rgba(0,0,0,0.05),
    0 0 1px rgba(0,0,0,0.1);
}

.back-btn {
  background: none; border: none; cursor: pointer;
  color: var(--text-main); margin-bottom: 24px;
  display: flex; align-items: center;
  opacity: 0.7; transition: opacity 0.2s;
}
.back-btn:hover { opacity: 1; }

.date { font-size: 13px; color: var(--text-secondary); font-weight: 500; margin-bottom: 8px; }
.title {
  font-size: 24px; font-weight: 700; color: var(--text-main);
  margin-bottom: 20px; letter-spacing: -0.5px;
}
```

Card header markup:

```html
<div class="card">
  <button class="back-btn">
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  </button>

  <div class="date">November 11, 2025</div>
  <h1 class="title">Tasks & Events</h1>
  <!-- filters + timeline below -->
</div>
```

---

## SECTION 2 — Filter pills

```html
<div class="filters">
  <div class="filter-pill active" data-filter="All">All</div>
  <div class="filter-pill" data-filter="Life">
    <!-- sun SVG -->
    Life
  </div>
  <div class="filter-pill" data-filter="Home & Family">Home & Family</div>
  <div class="filter-pill" data-filter="Work">Work</div>
</div>
```

```css
.filters {
  display: flex; gap: 8px; margin-bottom: 32px;
  overflow-x: auto; scrollbar-width: none;
}
.filters::-webkit-scrollbar { display: none; }

.filter-pill {
  padding: 7px 14px; border-radius: 20px;
  font-size: 13px; font-weight: 500;
  background: #f4f4f5; color: var(--text-secondary);
  cursor: pointer; white-space: nowrap;
  display: flex; align-items: center; gap: 6px;
  transition: all 0.2s;
}
.filter-pill:hover { background: #e4e4e7; }
.filter-pill.active {
  background: var(--accent-blue);
  color: #fff;
  box-shadow: 0 4px 12px rgba(50,81,242,0.25);
}
```

Behavior — clicking a pill filters the timeline by `data-category`; "All" shows every item. Only one pill active at a time.

---

## SECTION 3 — Timeline (the star of the card)

```css
.timeline {
  position: relative;
  display: flex; flex-direction: column; gap: 24px;
}
/* Continuous vertical line running through every node */
.timeline::before {
  content: '';
  position: absolute;
  left: 59.5px;              /* 40px time col + 12px gap + 7.5px half-node */
  top: 10px; bottom: 10px;
  width: 1px; background: var(--line-color);
  z-index: 1;
}
.timeline-item {
  display: flex; align-items: flex-start; gap: 12px;
  position: relative; z-index: 2;
  opacity: 0;
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  cursor: pointer;
  padding: 8px; margin: -8px;
  border-radius: 12px;
  transition: transform 0.2s, background 0.2s;
}
.timeline-item:hover { background: rgba(0,0,0,0.02); }
.timeline-item:nth-child(1) { animation-delay: 0.1s; }
.timeline-item:nth-child(2) { animation-delay: 0.2s; }
.timeline-item:nth-child(3) { animation-delay: 0.3s; }
.timeline-item:nth-child(4) { animation-delay: 0.4s; }
.timeline-item:nth-child(5) { animation-delay: 0.5s; }

.time {
  width: 40px; font-size: 13.5px; font-weight: 500;
  color: var(--text-secondary);
  flex-shrink: 0;
  display: flex; align-items: center;
}
.time.active { color: var(--accent-blue); }
.time.faded { color: #d4d4d8; }

.node {
  width: 15px; height: 15px; border-radius: 50%;
  background: #fff; border: 2px solid var(--line-color);
  flex-shrink: 0;
  display: flex; justify-content: center; align-items: center;
  margin-top: 1.5px; position: relative;
}
.node.completed { background: var(--accent-blue); border-color: var(--accent-blue); color: #fff; }
.node.active    { border-color: var(--accent-blue); }
.node.faded     { background: #e4e4e7; border-color: #e4e4e7; }

.content { font-size: 14px; font-weight: 500; color: var(--text-main); display: flex; align-items: center; justify-content: space-between; width: 100%; }
.content.completed { color: var(--text-secondary); text-decoration: line-through; }
.content.faded     { color: var(--text-tertiary); }

/* Blue dashed connector — only from last completed node to the next non-completed */
.dashed-line {
  position: absolute;
  top: 13px; left: 5px;
  width: 1px; height: 38px;
  background: repeating-linear-gradient(to bottom, var(--accent-blue) 0, var(--accent-blue) 4px, transparent 4px, transparent 8px);
  z-index: 3;
}

@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0%,100% { transform: scale(1); } 50% { transform: scale(1.3); } }
```

### 8 sample items (exact copy)

| Time | State | Category | Content |
|---|---|---|---|
| 07:51 | completed | Life | Journal for 3 min |
| 09:00 | completed | Work | Sync with team |
| 11:39 | active | Life | Finish book (only 64 pages left!!) |
| 11:39 | faded | Life | From voice note... |
| 14:00 | upcoming | Home & Family | Grocery shopping |
| 15:30 | upcoming | Life | Workout |
| 16:30 | upcoming | Work | Review PRs |
| 19:00 | upcoming | Home & Family | Dinner at Lucca *(with "Open in calendar" button)* |

**Active-item indicator**: prepend a `<span style="margin-right: 4px; font-size: 16px;">•</span>` inside the `.time` element for the active row.

**"Open in calendar" button** (only on the last "Dinner" row):
```html
<div class="open-btn" id="cal-trigger-1">
  Open in
  <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
</div>
```
```css
.open-btn {
  background: var(--accent-blue-light);
  color: var(--accent-blue);
  padding: 6px 10px; border-radius: 12px;
  font-size: 12px; font-weight: 600;
  display: flex; align-items: center; gap: 4px;
  cursor: pointer; transition: opacity 0.2s;
}
.open-btn:hover { opacity: 0.8; }
```

### Interaction — click any timeline item → recompute states

Clicking any row makes it **active**; every row above it becomes **completed**; every row below stays **upcoming** (except the row marked `data-faded="true"` which retains its faded look).

```js
timeline.addEventListener('click', (e) => {
  const clicked = e.target.closest('.timeline-item');
  if (!clicked) return;
  const visible = allItems.filter(it => it.style.display !== 'none');
  const idx = visible.indexOf(clicked);
  visible.forEach((item, i) => {
    const time = item.querySelector('.time');
    const node = item.querySelector('.node');
    const content = item.querySelector('.content');
    time.className = 'time'; node.className = 'node'; content.className = 'content';
    time.innerHTML = time.textContent.replace('•','').trim();
    node.innerHTML = '';
    if (i < idx) {
      node.classList.add('completed'); content.classList.add('completed');
      node.innerHTML = '<svg viewBox="0 0 24 24" width="9" height="9" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (i === idx) {
      time.classList.add('active');
      time.innerHTML = `<span style="margin-right:4px;font-size:16px;">•</span>${time.textContent}`;
      node.classList.add('active');
      node.style.animation = 'none'; void node.offsetWidth;
      node.style.animation = 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
    } else if (item.dataset.faded === 'true') {
      time.classList.add('faded'); node.classList.add('faded'); content.classList.add('faded');
    }
  });
  updateDashedLines();
});
```

### Dashed connector — dynamic, only between last-completed and next-upcoming

```js
function updateDashedLines() {
  const visible = allItems.filter(it => it.style.display !== 'none');
  visible.forEach(it => { const d = it.querySelector('.dashed-line'); if (d) d.remove(); });
  for (let i = 0; i < visible.length - 1; i++) {
    const cur = visible[i], next = visible[i+1];
    if (cur.querySelector('.node.completed') && !next.querySelector('.node.completed')) {
      cur.querySelector('.node').innerHTML += '<div class="dashed-line"></div>';
    }
  }
}
```

### Filter behavior

```js
filters.forEach(filter => {
  filter.addEventListener('click', () => {
    filters.forEach(f => f.classList.remove('active'));
    filter.classList.add('active');
    const cat = filter.dataset.filter;
    let visibleCount = 0;
    allItems.forEach(item => {
      if (cat === 'All' || item.dataset.category === cat) {
        item.style.display = 'flex';
        item.style.animation = 'none'; void item.offsetWidth;
        item.style.animation = 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        item.style.animationDelay = (visibleCount * 0.1) + 's';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });
    updateDashedLines();
  });
});
```

Filtered items re-fade-in with staggered 0.1s delay each.

---

## SECTION 4 — Floating voice-note player pill

```html
<div class="player-card" id="player-card">
  <div class="player-left">
    <div class="notes-icon"><!-- stacked notes SVG --></div>
    <div class="player-time">
      <span id="player-dot" style="margin-right:4px;font-size:16px;">•</span>
      <span id="time-text">0:04</span>
      <div class="waveform-container" style="position:relative;width:66px;height:20px;margin-left:8px;cursor:pointer;">
        <!-- Grey base waveform SVG -->
        <!-- Blue overlay with clip-path animation -->
      </div>
    </div>
  </div>
  <div class="player-actions">
    <div class="action-btn" id="trash-btn"><!-- trash SVG --></div>
    <div class="action-btn" id="play-pause-btn">
      <svg id="play-icon"  ...><polygon points="5 3 19 12 5 21 5 3"/></svg>
      <svg id="pause-icon" ...><line x1="9" y1="6" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="18"/></svg>
    </div>
    <div class="action-btn primary"><!-- send/paper-plane SVG --></div>
    <div class="action-btn transparent" id="cal-trigger-2"><!-- calendar-plus SVG --></div>
  </div>
</div>
```

```css
.player-card {
  background: var(--card-bg);
  border-radius: 100px;
  padding: 10px 12px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.05);
  width: 100%;
  opacity: 0;
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.6s;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.player-left { display: flex; align-items: center; gap: 8px; }
.notes-icon { width: 28px; height: 28px; display: flex; justify-content: center; align-items: center; color: var(--text-tertiary); }
.player-time {
  font-size: 13.5px; font-weight: 500;
  color: var(--accent-blue);
  display: flex; align-items: center;
}
.player-actions { display: flex; align-items: center; gap: 4px; }

.action-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: #f4f4f5;
  display: flex; justify-content: center; align-items: center;
  cursor: pointer; color: var(--text-secondary);
  transition: all 0.2s;
}
.action-btn:hover     { background: #e4e4e7; }
.action-btn.primary   { background: var(--accent-blue); color: #fff; box-shadow: 0 4px 10px rgba(50,81,242,0.3); }
.action-btn.primary:hover { background: #2540d6; }
.action-btn.transparent { background: transparent; width: 28px; height: 28px; }
.action-btn.transparent:hover { color: var(--text-main); }

@keyframes shrinkOut { to { transform: scale(0.8); opacity: 0; } }
```

### Waveform — 2-layer SVG, blue reveals via `clip-path`

Grey base waveform is 6 vertical bars (`x1=2,7,12,17,22,27`) + a horizontal dashed tail from x=33 to x=66. Blue overlay is identical but wrapped in a div with `clip-path: inset(0 83% 0 0)` initially. As time advances, `clip-path` shrinks the right inset — the blue reveals from left to right.

### Play/pause loop

```js
let isPlaying = true, currentTime = 4, interval;
const maxTime = 24;

function updatePlayerState() {
  if (isPlaying) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    playerDot.style.opacity = '1';
    interval = setInterval(() => {
      if (currentTime >= maxTime) { isPlaying = false; updatePlayerState(); return; }
      currentTime++;
      timeText.textContent = `0:${String(currentTime).padStart(2,'0')}`;
      const remainPct = 100 - (currentTime / maxTime) * 100;
      waveOverlay.style.clipPath = `inset(0 ${remainPct}% 0 0)`;
    }, 1000);
  } else {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    playerDot.style.opacity = '0.4';
    clearInterval(interval);
  }
}
updatePlayerState();
playPauseBtn.addEventListener('click', () => { isPlaying = !isPlaying; updatePlayerState(); });
```

### Trash — shrink-out animation, then remove from DOM

```js
trashBtn.addEventListener('click', () => {
  playerCard.style.animation = 'shrinkOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
  setTimeout(() => playerCard.remove(), 400);
});
```

---

## SECTION 5 — Fully-working calendar modal

Two triggers open it: `#cal-trigger-1` ("Open in" pill on the Dinner row) and `#cal-trigger-2` (calendar-plus button on the player). Close via Confirm / Cancel / click-outside.

```css
.calendar-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.15);
  backdrop-filter: blur(2px);
  display: flex; justify-content: center; align-items: center;
  z-index: 100;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s;
}
.calendar-modal-overlay.show { opacity: 1; pointer-events: auto; }
.calendar-modal {
  width: 320px;
  background: #fff;
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03);
  transform: translateY(20px) scale(0.95);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.calendar-modal-overlay.show .calendar-modal { transform: translateY(0) scale(1); }

@media (min-width: 800px) {
  .calendar-modal { transform: translate(350px, 20px) scale(0.95); }
  .calendar-modal-overlay.show .calendar-modal { transform: translate(350px, 0) scale(1); }
}
```

Header title `Start Project` + chevrons; body has month/year dropdowns (`Feb ▾ 2078 ▾`) with prev/next arrows on either side, then `MO TU WE TH FR SA SU` day-header grid, then a 6-row date grid, then Confirm (blue pill) + Cancel (ghost).

```css
.cal-grid {
  display: grid; grid-template-columns: repeat(7, 1fr);
  row-gap: 6px; column-gap: 4px;
  text-align: center;
  font-size: 13.5px; font-weight: 600; color: var(--text-main);
  margin-bottom: 24px;
}
.cal-grid > div {
  height: 32px;
  display: flex; justify-content: center; align-items: center;
  border-radius: 12px;
  cursor: pointer; position: relative;
  color: #3f3f46; transition: 0.2s;
}
.cal-grid > div:hover:not(.faded):not(.selected) { background: #f4f4f5; }
.cal-grid > div.faded    { color: #d4d4d8; }
.cal-grid > div.selected { background: var(--accent-blue); color: #fff; }
.cal-grid > div .dot {
  position: absolute; bottom: 3px;
  width: 4px; height: 4px;
  background: var(--accent-blue); border-radius: 50%;
}
```

### Real calendar arithmetic + range-select

```js
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let currentMonth = new Date().getMonth();
let currentYear  = new Date().getFullYear();
let rangeStart = null, rangeEnd = null;

function renderCalendar() {
  monthDropdown.innerHTML = `${monthNames[currentMonth]} <svg .../>`;
  yearDropdown.innerHTML  = `${currentYear} <svg .../>`;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrev = new Date(currentYear, currentMonth, 0).getDate();
  const startIdx = firstDay === 0 ? 6 : firstDay - 1;   // Sun-first → Mon-first

  let html = '';
  for (let i = startIdx - 1; i >= 0; i--) html += `<div class="faded">${daysInPrev - i}</div>`;
  for (let i = 1; i <= daysInMonth; i++) {
    const dot = (i === 18) ? '<div class="dot"></div>' : '';
    html += `<div>${i}${dot}</div>`;
  }
  const total = startIdx + daysInMonth;
  const rem   = (Math.ceil(total / 7) * 7) - total;
  for (let i = 1; i <= rem; i++) html += `<div class="faded">${i}</div>`;

  calGrid.innerHTML = html;
  rangeStart = null; rangeEnd = null;
  attachGridListeners();
}
function attachGridListeners() {
  const cells = [...calGrid.children];
  cells.forEach((cell, idx) => {
    cell.addEventListener('click', () => {
      if (cell.classList.contains('faded')) return;
      if (rangeStart === null || (rangeStart !== null && rangeEnd !== null)) {
        rangeStart = idx; rangeEnd = null;
      } else if (rangeStart !== null && rangeEnd === null) {
        if (idx < rangeStart) { rangeEnd = rangeStart; rangeStart = idx; }
        else rangeEnd = idx;
      }
      cells.forEach((c, i) => {
        c.classList.remove('selected');
        if (rangeStart !== null && rangeEnd === null && i === rangeStart) c.classList.add('selected');
        else if (rangeStart !== null && rangeEnd !== null && i >= rangeStart && i <= rangeEnd && !c.classList.contains('faded'))
          c.classList.add('selected');
      });
    });
  });
}
prevArrows.forEach(a => a.addEventListener('click', () => {
  currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
}));
nextArrows.forEach(a => a.addEventListener('click', () => {
  currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
}));
renderCalendar();
```

**Range-select flow**: 1st click = start; 2nd click = end (auto-swaps if user clicks earlier day); 3rd click resets and starts a new range. `.faded` days from prev/next month are unclickable.

Modal open/close:
```js
function openCal(e) { if (e) e.stopPropagation(); calModal.classList.add('show'); }
function closeCal()   { calModal.classList.remove('show'); }
[calTrigger1, calTrigger2].forEach(t => t && t.addEventListener('click', openCal));
[calConfirm, calCancel].forEach(b => b.addEventListener('click', closeCal));
calModal.addEventListener('click', e => { if (e.target === calModal) closeCal(); });
```

---

## Responsive

- **≥ 400px** — as specified. Card is 310px, calendar modal is 320px centered.
- **≤ 400px**:
  ```css
  @media (max-width: 400px) {
    .container { width: 100%; }
  }
  ```
- **≥ 800px** — calendar modal shifts right +350px so it doesn't cover the source card:
  ```css
  @media (min-width: 800px) {
    .calendar-modal { transform: translate(350px, 20px) scale(0.95); }
    .calendar-modal-overlay.show .calendar-modal { transform: translate(350px, 0) scale(1); }
  }
  ```
- **`prefers-reduced-motion: reduce`**: disable fadeUp / pop / shrinkOut on load, keep opacity 1 immediately.
- Test at 375, 400, 640, 800, 1024, 1440.

---

## Deliverable checklist (all must be true)

- [ ] Body has dot-grid background (1px radial-gradient at 20×20 spacing on `#f4f4f7`).
- [ ] Main card is exactly **310px wide**, `border-radius: 28px`, `padding: 24px 20px`, soft two-layer shadow.
- [ ] Header: back arrow, `November 11, 2025`, then `Tasks & Events` at 24px / weight 700 / -0.5px letter-spacing.
- [ ] 4 filter pills (All / Life / Home & Family / Work). Active pill is `#3251f2` with `0 4px 12px rgba(50,81,242,0.25)` shadow. "Life" pill includes a sun SVG.
- [ ] Timeline uses a continuous 1px vertical line at `left: 59.5px`, running from top:10px to bottom:10px.
- [ ] 8 items in exact order with correct states as tabled above.
- [ ] Active row prepends a `•` glyph, blue-colored time text.
- [ ] Completed nodes are filled blue with a white ✓ SVG inside; completed content has `text-decoration: line-through`.
- [ ] Faded rows (only `data-faded="true"` ones) have grey time / grey-fill node / muted content.
- [ ] Blue dashed connector `background: repeating-linear-gradient(to bottom, #3251f2 0, #3251f2 4px, transparent 4px, transparent 8px)` appears ONLY from the last-completed node down to the next-upcoming node (recomputed on every state change).
- [ ] Clicking any item recomputes: `<clicked>` becomes active, everything above → completed, below → upcoming.
- [ ] "Open in" pill appears only on the 8th row (Dinner) — light-blue background `#eef1fe` with blue text + calendar SVG.
- [ ] Timeline items fade-up with 0.6s cubic-bezier(0.16,1,0.3,1), staggered 0.1s per item.
- [ ] Filter pills re-fade the visible items with 0.1s stagger on category change; hidden items get `display: none`.
- [ ] Floating **voice player** pill sits below the card, radius 100px, contains: notes icon, blue `0:04` time, 66×20 waveform (6 grey vertical bars + dashed tail), 4 action buttons on the right (trash / play-pause / send-primary-blue / calendar-transparent).
- [ ] Waveform has a blue overlay identical to the grey one, revealed via `clip-path: inset(0 % 0 0)` shrinking as time advances (100 → 0% right inset over 24s).
- [ ] Play state: pause icon visible, dot at opacity 1, `setInterval(1000)` increments the counter. Pause state: play icon visible, dot at 0.4.
- [ ] Trash button plays `shrinkOut 0.4s` and removes the player from DOM after animation.
- [ ] Calendar modal opens from BOTH the "Open in" pill (row 8) AND the calendar-plus button in the player.
- [ ] Modal has: `Start Project` header, prev/next chevrons, month/year dropdowns, MO-first day header, 6-row date grid with `.faded` days from adjacent months, blue-selected days, Confirm (blue) + Cancel (ghost) buttons.
- [ ] Calendar uses REAL date arithmetic — prev/next changes month + wraps year at Dec/Jan.
- [ ] Range-select: 1st tap sets start, 2nd tap sets end (auto-swap if earlier), 3rd tap resets. Faded cells are non-clickable.
- [ ] Dot marker under day 18 as a design accent.
- [ ] Modal opens with `translateY(20)+scale(0.95) → 0/1` over 0.3s; closes via Confirm / Cancel / click-outside.
- [ ] `prefers-reduced-motion: reduce` disables all fadeUp / pop / shrinkOut animations.
- [ ] No console errors, no dead buttons, no missing wiring.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue055
