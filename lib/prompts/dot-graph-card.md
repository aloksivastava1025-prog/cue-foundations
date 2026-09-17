# Dot Graph Card — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for fintech dashboards or SaaS analytics landing pages where a compact, restrained data visualization needs to feel precise and tactile.

---

# Dot Graph Card — Revenue with Popping Dots

Full-reference pixel-perfect spec. Any AI agent must reconstruct this exactly from this doc alone. No substitutions.

---

## 0. WHAT IT IS

A 460px rounded off-white card. Header shows a big low-weight `+N%` revenue counter (animates from 0 with easeOutQuart) alongside three time-tabs (Daily / Weekly / Monthly). Body is a horizontal grid of narrow columns, each a stack of 4×4px dots (like a discrete bar chart). Two color classes: light-grey dots for the "previous" period and dark-grey dots for the "current" period. Dots pop-in from below with a diagonal stagger on load / dataset switch. On hover, other columns dim to 25% opacity and the active column dots scale to 1.4×, and a small black tooltip shows the column's label + amount. Bottom row: `MAY $3,250` (grey, left) and `JUN $12,392` (black, positioned at `left: 215px`).

Right edge fades to transparent via a CSS mask — implies more data off-screen.

Design language: minimalist neutral. Inter 300/400/500/600. No bold.

---

## 1. HEAD

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dot Graph Card</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
```

Deps: Inter 300/400/500/600 from Google Fonts. No Tailwind, no JS libraries.

---

## 2. CSS — VERBATIM

Paste the entire block:

```css
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e5e5e5;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.graph-card {
  width: 460px;
  background-color: #f9f9f9;
  border-radius: 24px;
  border: 1px solid #eaeaea;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 32px 20px 32px;
}
.header-left { display: flex; flex-direction: column; gap: 4px; }

.label-title {
  font-size: 11px;
  font-weight: 500;
  color: #777;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.revenue-value {
  font-size: 42px;
  font-weight: 300;
  color: #111;
  line-height: 1;
  letter-spacing: -1px;
  display: flex;
  align-items: baseline;
}
.revenue-value .percent {
  font-size: 24px;
  font-weight: 300;
  margin-left: 2px;
}

.header-right { display: flex; gap: 16px; padding-top: 4px; }

.time-tab {
  font-size: 11px;
  font-weight: 500;
  color: #aaa;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s;
}
.time-tab:hover  { color: #666; }
.time-tab.active { color: #111; }

.divider { height: 1px; background-color: #eaeaea; width: 100%; }

.card-body { padding: 32px 32px 24px 32px; position: relative; }

.graph-container {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 120px;
  -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
          mask-image: linear-gradient(to right, black 85%, transparent 100%);
  position: relative;
}

.graph-col {
  display: flex;
  flex-direction: column-reverse;
  gap: 5px;
  cursor: crosshair;
  padding: 20px 0 0 0;
  margin-top: -20px;
  transition: opacity 0.3s ease;
}

.graph-container:hover .graph-col { opacity: 0.25; }
.graph-container .graph-col:hover { opacity: 1;    }
.graph-col:hover .dot             { transform: scale(1.4); }

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #555;
  opacity: 0;
  animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dot.light { background-color: #c4c4c4; }
.dot.dark  { background-color: #555;    }

@keyframes popIn {
  0%   { opacity: 0; transform: translateY(10px) scale(0); }
  100% { opacity: 1; transform: translateY(0)    scale(1); }
}

.graph-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Inter', monospace;
}
.label-may { color: #a0a0a0; padding-left: 0px; }
.label-jun { color: #111;    position: absolute; left: 215px; }

.tooltip {
  position: absolute;
  top: 0; left: 0;
  background: #111;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -10px);
  transition: opacity 0.2s, transform 0.1s ease-out;
  z-index: 10;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.tooltip .amount { color: #a0a0a0; margin-left: 4px; }
```

Key numbers:
- Card `460px` wide, radius `24px`, bg `#f9f9f9`, border `1px #eaeaea`
- Header padding `24 32 20 32`; body padding `32 32 24 32`
- Revenue value 42px weight 300, `.percent` 24px weight 300
- Tab label 11px 500, colors `#aaa` → `#666` hover → `#111` active
- Graph container height `120px`, gap `5px`
- Column gap `5px`, `padding: 20px 0 0 0; margin-top: -20px;` (creates a 20px hover buffer above without shifting the layout)
- Dots `4×4`, dark `#555` / light `#c4c4c4`
- Mask fade: `to right, black 85%, transparent 100%`
- Hover: other cols opacity `0.25`, active col opacity `1`, active dots `scale(1.4)`
- Bottom labels 12px 500, right label absolute `left: 215px`
- Tooltip: bg `#111`, radius 6px, padding `6 10`, 11px 500, `translate(-50%, -10px)`

---

## 3. HTML STRUCTURE

```html
<body>
  <div class="graph-card">
    <div class="card-header">
      <div class="header-left">
        <div class="label-title">Revenue</div>
        <div class="revenue-value">+<span id="revenueCounter">0</span><span class="percent">%</span></div>
      </div>
      <div class="header-right">
        <div class="time-tab"        data-tab="daily">Daily</div>
        <div class="time-tab"        data-tab="weekly">Weekly</div>
        <div class="time-tab active" data-tab="monthly">Monthly</div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="card-body">
      <div class="tooltip" id="tooltip"></div>
      <div class="graph-container" id="dotGraph"></div>

      <div class="graph-labels">
        <div class="label-may" id="labelLeft">MAY $3,250</div>
        <div class="label-jun" id="labelRight">JUN $12,392</div>
      </div>
    </div>
  </div>
</body>
```

Copy — verbatim:

| Slot              | Text            |
|-------------------|-----------------|
| Title tag         | `Dot Graph Card` |
| Header label      | `Revenue`       |
| Prefix (before N) | `+`             |
| Suffix            | `%`             |
| Tab 1             | `Daily`         |
| Tab 2             | `Weekly`        |
| Tab 3 (active)    | `Monthly`       |
| Default left      | `MAY $3,250`    |
| Default right     | `JUN $12,392`   |

---

## 4. DATASETS — VERBATIM

```js
const datasets = {
  monthly: {
    revenue: 326,
    labelLeft:  'MAY $3,250',
    labelRight: 'JUN $12,392',
    raw: [
      /* May — 23 light cols */
      { val: 2, type: 'light' }, { val: 2, type: 'light' }, { val: 2, type: 'light' },
      { val: 3, type: 'light' }, { val: 6, type: 'light' }, { val: 8, type: 'light' },
      { val: 3, type: 'light' }, { val: 2, type: 'light' }, { val: 4, type: 'light' },
      { val: 5, type: 'light' }, { val: 3, type: 'light' }, { val: 2, type: 'light' },
      { val: 2, type: 'light' }, { val: 1, type: 'light' }, { val: 1, type: 'light' },
      { val: 1, type: 'light' }, { val: 2, type: 'light' }, { val: 3, type: 'light' },
      { val: 2, type: 'light' }, { val: 1, type: 'light' }, { val: 2, type: 'light' },
      { val: 1, type: 'light' }, { val: 1, type: 'light' },
      /* Jun — 26 dark cols */
      { val: 3, type: 'dark' },  { val: 4, type: 'dark' },  { val: 5, type: 'dark' },
      { val: 7, type: 'dark' },  { val: 13, type: 'dark' }, { val: 9, type: 'dark' },
      { val: 7, type: 'dark' },  { val: 8, type: 'dark' },  { val: 6, type: 'dark' },
      { val: 5, type: 'dark' },  { val: 4, type: 'dark' },  { val: 4, type: 'dark' },
      { val: 3, type: 'dark' },  { val: 2, type: 'dark' },  { val: 2, type: 'dark' },
      { val: 1, type: 'dark' },  { val: 2, type: 'dark' },  { val: 1, type: 'dark' },
      { val: 4, type: 'dark' },  { val: 2, type: 'dark' },  { val: 3, type: 'dark' },
      { val: 4, type: 'dark' },  { val: 5, type: 'dark' },  { val: 4, type: 'dark' },
      { val: 3, type: 'dark' },  { val: 4, type: 'dark' }
    ]
  },
  weekly: {
    revenue: 84,
    labelLeft:  'LAST WK $1,120',
    labelRight: 'THIS WK $2,840',
    raw: [
      { val: 1, type: 'light' }, { val: 2, type: 'light' }, { val: 3, type: 'light' },
      { val: 2, type: 'light' }, { val: 5, type: 'light' }, { val: 3, type: 'light' },
      { val: 2, type: 'light' }, { val: 4, type: 'light' }, { val: 5, type: 'light' },
      { val: 3, type: 'light' }, { val: 2, type: 'light' }, { val: 2, type: 'light' },
      { val: 4, type: 'dark' },  { val: 5, type: 'dark' },  { val: 8, type: 'dark' },
      { val: 11, type: 'dark' }, { val: 9, type: 'dark' },  { val: 7, type: 'dark' },
      { val: 6, type: 'dark' },  { val: 8, type: 'dark' },  { val: 5, type: 'dark' },
      { val: 4, type: 'dark' },  { val: 3, type: 'dark' },  { val: 6, type: 'dark' }
    ]
  },
  daily: {
    revenue: 12,
    labelLeft:  'YESTERDAY $420',
    labelRight: 'TODAY $680',
    raw: [
      { val: 1, type: 'light' }, { val: 2, type: 'light' }, { val: 1, type: 'light' },
      { val: 3, type: 'light' }, { val: 4, type: 'light' }, { val: 2, type: 'light' },
      { val: 1, type: 'light' }, { val: 2, type: 'light' }, { val: 1, type: 'light' },
      { val: 3, type: 'dark' },  { val: 5, type: 'dark' },  { val: 7, type: 'dark' },
      { val: 4, type: 'dark' },  { val: 6, type: 'dark' },  { val: 8, type: 'dark' },
      { val: 5, type: 'dark' },  { val: 3, type: 'dark' },  { val: 4, type: 'dark' }
    ]
  }
};
```

Counts:
- Monthly: **23 light + 26 dark = 49 cols**, revenue `326`
- Weekly:  **12 light + 12 dark = 24 cols**, revenue `84`
- Daily:   **9 light + 9 dark  = 18 cols**, revenue `12`

Tooltip label prefixes per timeframe (see §7):
- `monthly` → `May {n}` / `Jun {n}`
- `weekly`  → `Last Wk {n}` / `This Wk {n}`
- `daily`   → `Yest {n}` / `Today {n}`

Tooltip amount formula (mock): `$${(val * 240 + 100).toLocaleString()}`.

---

## 5. JS — COUNTER (paste verbatim)

```js
let animationFrameId = null;
let currentCounterVal = 0;

function easeOutQuart(x) { return 1 - Math.pow(1 - x, 4); }

function animateCounter(targetValue) {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  const duration = 1200;
  const startValue = currentCounterVal;
  const difference = targetValue - startValue;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    currentCounterVal = Math.round(startValue + difference * eased);
    counterElement.innerText = currentCounterVal;
    if (progress < 1) animationFrameId = requestAnimationFrame(step);
    else { currentCounterVal = targetValue; counterElement.innerText = targetValue; }
  }
  animationFrameId = requestAnimationFrame(step);
}
```

- Duration `1200ms`, ease `easeOutQuart` (`1 - (1-x)^4`)
- Value stored in module-scope `currentCounterVal` so subsequent tab switches lerp from the current value, not from 0

---

## 6. JS — RENDER + TABS (paste verbatim)

```js
const graphContainer = document.getElementById('dotGraph');
const tooltip        = document.getElementById('tooltip');
const counterElement = document.getElementById('revenueCounter');

function renderGraph(timeframe) {
  const config = datasets[timeframe];
  graphContainer.innerHTML = '';

  document.getElementById('labelLeft').innerText  = config.labelLeft;
  document.getElementById('labelRight').innerText = config.labelRight;

  animateCounter(config.revenue);

  /* Hydrate columns with per-column label + amount */
  let count = 1;
  const data = config.raw.map((d, i) => {
    let labelPrefix = '';
    if (timeframe === 'monthly') labelPrefix = d.type === 'light' ? 'May'     : 'Jun';
    if (timeframe === 'weekly')  labelPrefix = d.type === 'light' ? 'Last Wk' : 'This Wk';
    if (timeframe === 'daily')   labelPrefix = d.type === 'light' ? 'Yest'    : 'Today';
    if (i > 0 && config.raw[i - 1].type !== d.type) count = 1;   /* reset on transition */
    return {
      val: d.val,
      type: d.type,
      label: `${labelPrefix} ${count++}`,
      amount: `$${(d.val * 240 + 100).toLocaleString()}`,
    };
  });

  data.forEach((item, colIndex) => {
    const col = document.createElement('div');
    col.className = 'graph-col';

    col.addEventListener('mouseenter', () => {
      const rect = col.getBoundingClientRect();
      const containerRect = graphContainer.getBoundingClientRect();
      const leftPos = rect.left - containerRect.left + (rect.width / 2);
      tooltip.innerHTML = `${item.label} <span class="amount">${item.amount}</span>`;
      tooltip.style.opacity = '1';
      tooltip.style.left = `${leftPos}px`;
      tooltip.style.top  = `-15px`;
    });
    col.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });

    for (let i = 0; i < item.val; i++) {
      const dot = document.createElement('div');
      dot.className = `dot ${item.type}`;
      const delay = (colIndex * 0.02) + (i * 0.04);   /* diagonal wave */
      dot.style.animationDelay = `${delay}s`;
      col.appendChild(dot);
    }
    graphContainer.appendChild(col);
  });
}

const tabs = document.querySelectorAll('.time-tab');
tabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    if (e.target.classList.contains('active')) return;
    tabs.forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    renderGraph(e.target.getAttribute('data-tab'));
  });
});

renderGraph('monthly');
```

Stagger formula for popIn delay:
- `delay = colIndex * 0.02 + dotIndex * 0.04` (seconds)
- Creates a diagonal wave from bottom-left to top-right

Tooltip positioning:
- `left` = column's left edge relative to container + half its width (centers under the column)
- `top` = `-15px` (sits above graph, translated `translate(-50%, -10px)` in CSS)

---

## 7. INTERACTION MAP

| State                    | Result                                                       |
|--------------------------|--------------------------------------------------------------|
| Load                     | Counter animates 0 → target (1200ms easeOutQuart). Dots pop in with diagonal stagger. |
| Tab click                | Container clears, dots re-render, counter lerps from current to new target. |
| Hover graph              | ALL columns dim to `opacity: 0.25` (300ms ease)              |
| Hover a column           | That column stays at `opacity: 1`, dots inside `scale(1.4)`  |
| Column mouseenter        | Tooltip fades in at column center, shows `{label} {amount}`  |
| Column mouseleave        | Tooltip fades out                                            |
| Tab hover                | Color `#aaa` → `#666`                                        |
| Tab active               | Color `#111`                                                 |

---

## 8. RESPONSIVE

- Card fixed 460px wide. Below 460px viewport, add `max-width: 100%` to `.graph-card` to prevent horizontal overflow.
- The `left: 215px` on `.label-jun` is positioned at the transition between the last light column and the first dark column (rough middle). Adjust if the dataset column count changes.
- Right-edge mask (`85% → 100% transparent`) suggests more data — do not remove even on narrow screens.
- Prefers-reduced-motion:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .dot { animation: none !important; opacity: 1; transform: none; }
    .graph-col, .time-tab, .tooltip { transition: none !important; }
  }
  ```
  And short-circuit `animateCounter` to set `counterElement.innerText = targetValue` immediately.

---

## 9. DELIVERABLE

- One HTML file matching sections 1–6 in order
- One TSX drop-in `DotGraphCard.tsx`. Assumes Inter loaded in target. All three datasets live inside the component as a top-level constant. Uses `useState` for the active tab, `useRef` for the counter mutable state + rAF id. `useEffect` re-renders the DOM columns whenever tab changes; cleanup cancels any pending counter frame. Zero deps.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue174
