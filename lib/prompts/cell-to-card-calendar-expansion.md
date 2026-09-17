# Cell-to-Card Calendar Expansion — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal for productivity apps, booking platforms, or premium dashboard products needing a polished, Apple-style scheduling widget.

---

# Premium Calendar — Light/Dark with Cell-to-Card Expansion

Full-reference pixel-perfect spec. Any AI agent must reconstruct this exactly from this doc alone. No substitutions.

---

## 0. WHAT IT IS

A compact 7-column calendar (7 header tabs + 5 rows × 7 = 35 cells) with:
- iOS-style **light/dark theme toggle** at top (all colors driven by CSS variables that swap on `body.light-theme`)
- 7 day-of-week tabs (`MON`..`SUN`) — clicking one loads that day's dataset (offset + total days + activeDay + events)
- Each 48×48 cell shows a small day number, an event **icon** on top and a **red or teal notification dot** at top-right
- **Cell-to-card FLIP animation**: click an event → the cell scales/translates to viewport center, morphs into a 320×160 detail card (title + description + close button) with backdrop blur overlay. Click overlay or close → cell shrinks back to its original grid position.
- Dot marks as "read" (fades + scales to 0) after clicking

Design language: dark-first Apple-style. Inter 400/500/600/800. No bold body text (headings use 600, active day uses 700 which is the one exception — flag if switching to no-bold, otherwise leave 700 for the active day only).

---

## 1. HEAD

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Premium Calendar - Light & Dark</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap" rel="stylesheet">
</head>
```

Deps: Inter 400/500/600/800 only. No Tailwind, no JS libraries.

---

## 2. CSS — VERBATIM

Complete stylesheet (paste inside `<style>` in the head). Two token blocks: dark default on `:root`, light override on `body.light-theme`.

```css
:root {
  /* Dark theme (default) */
  --bg-color:            #000000;
  --text-primary:        #ffffff;
  --text-secondary:      #888888;
  --text-muted:          #666666;

  --cell-bg:             #161618;
  --cell-hover:          #262629;
  --cell-border:         transparent;
  --cell-border-hover:   rgba(255,255,255,0.15);
  --cell-shadow-hover:   0 10px 20px rgba(0,0,0,0.5);

  --header-bg:           #1a1a1c;
  --header-active-bg:    #242426;

  --icon-color:          #ffffff;

  --card-bg:             #000000;
  --card-border:         rgba(255,255,255,0.12);
  --card-shadow:         0 30px 60px rgba(0,0,0,1), inset 0 1px 0 rgba(255,255,255,0.05);
  --overlay-bg:          rgba(0,0,0,0.6);

  --btn-bg:              rgba(255,255,255,0.05);
  --btn-hover-bg:        rgba(255,255,255,0.15);

  --toggle-bg:           #39393d;
  --toggle-thumb:        #ffffff;
  --toggle-icon:         #777777;
}

body.light-theme {
  --bg-color:            #f2f2f7;
  --text-primary:        #111111;
  --text-secondary:      #666666;
  --text-muted:          #999999;

  --cell-bg:             #ffffff;
  --cell-hover:          #fafafa;
  --cell-border:         rgba(0,0,0,0.04);
  --cell-border-hover:   rgba(0,0,0,0.1);
  --cell-shadow-hover:   0 12px 24px rgba(0,0,0,0.08);

  --header-bg:           #e5e5ea;
  --header-active-bg:    #ffffff;

  --icon-color:          #111111;

  --card-bg:             #ffffff;
  --card-border:         rgba(0,0,0,0.08);
  --card-shadow:         0 30px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8);
  --overlay-bg:          rgba(255,255,255,0.6);

  --btn-bg:              rgba(0,0,0,0.05);
  --btn-hover-bg:        rgba(0,0,0,0.1);

  --toggle-bg:           #e5e5ea;
  --toggle-thumb:        #ffffff;
  --toggle-icon:         #8e8e93;
}

body {
  background-color: var(--bg-color);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  display: flex; justify-content: center; align-items: center;
  min-height: 100vh; margin: 0;
  overflow: hidden;
  transition: background-color 0.4s ease, color 0.4s ease;
}

.calendar-wrapper { display: flex; flex-direction: column; gap: 6px; }

/* Navbar with theme switch */
.cal-navbar { display: flex; justify-content: center; align-items: center; margin-bottom: 16px; }
.theme-switch {
  width: 56px; height: 32px;
  background-color: var(--toggle-bg);
  border-radius: 16px;
  padding: 3px; box-sizing: border-box;
  cursor: pointer; position: relative;
  transition: background-color 0.4s ease;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.15);
}
.switch-thumb {
  width: 26px; height: 26px;
  background-color: var(--toggle-thumb);
  border-radius: 50%;
  box-shadow: 0 3px 8px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.1);
  position: absolute; top: 3px; left: 3px;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 2;
}
.theme-switch.dark-active .switch-thumb { transform: translateX(24px); }
.switch-icons {
  position: absolute; inset: 0;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 10px; pointer-events: none;
  color: var(--toggle-icon); z-index: 1;
  transition: color 0.4s ease;
}
.icon-left, .icon-right {
  display: flex; align-items: center; justify-content: center;
  width: 12px; height: 12px;
}
.icon-left div  { width: 2px; height: 10px; background-color: currentColor; border-radius: 1px; }
.icon-right svg { width: 12px; height: 12px; }

/* Header row + grid */
.cal-header-row, .cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 48px);
  gap: 6px;
}

.cal-header {
  height: 28px;
  background-color: var(--header-bg);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}
.cal-header:hover  { color: var(--text-secondary); }
.cal-header.active {
  color: var(--text-primary);
  background-color: var(--header-active-bg);
  border: 1px solid var(--cell-border-hover);
  box-sizing: border-box;
  cursor: default;
}

.cal-cell {
  width: 48px; height: 48px;
  background-color: var(--cell-bg);
  border-radius: 12px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: flex-end;
  padding-bottom: 6px; box-sizing: border-box;
  position: relative;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
              background-color 0.3s, border 0.3s, box-shadow 0.3s;
  border: 1px solid var(--cell-border);
  cursor: default;
  animation: fadeScale 0.4s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}
@keyframes fadeScale {
  0%   { opacity: 0; transform: scale(0.9) translateY(4px); }
  100% { opacity: 1; transform: scale(1)   translateY(0);   }
}
.cal-cell.has-event { cursor: pointer; }
.cal-cell:hover:not(.empty) { background-color: var(--cell-hover); }
.cal-cell.has-event:hover {
  transform: scale(1.1);
  z-index: 10;
  border: 1px solid var(--cell-border-hover);
  box-shadow: var(--cell-shadow-hover);
}
.cal-cell.empty {
  background-color: transparent;
  border-color: transparent;
  pointer-events: none;
}

.day-num {
  font-size: 11px; color: var(--text-secondary);
  font-weight: 500;
  transition: color 0.3s;
}
.cal-cell.active-day .day-num {
  color: var(--text-primary);
  font-weight: 700;
  font-size: 12px;
}

.icon-slot {
  position: absolute; top: 6px; left: 50%;
  transform: translateX(-50%);
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px;
  pointer-events: none;
  color: var(--icon-color);
  transition: color 0.3s;
}
.icon-slot svg { width: 100%; height: 100%; }

.dot {
  position: absolute;
  top: -1px; right: -1px;
  width: 6px; height: 6px;
  border-radius: 50%;
  z-index: 5;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.dot.read { opacity: 0; transform: scale(0); }
.dot.teal { background-color: #00d2d3; }
.dot.red  { background-color: #ff4757; }

/* Expanded card overlay */
.expanded-overlay {
  position: fixed; inset: 0;
  background: var(--overlay-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: 0; pointer-events: none;
  transition: opacity 0.4s ease, background 0.4s ease;
  z-index: 100;
}
.expanded-overlay.active { opacity: 1; pointer-events: all; }

.expanded-card {
  position: fixed;
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
  border-radius: 12px;
  overflow: hidden;
  z-index: 101;
  opacity: 0; pointer-events: none;
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.4s;
}
.expanded-card.active { opacity: 1; pointer-events: all; border-radius: 20px; }

.expand-wrapper {
  width: 320px; height: 160px;
  display: flex; flex-direction: column;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.expanded-card.active .expand-wrapper { opacity: 1; transition-delay: 0.15s; }

.expand-header {
  display: flex; align-items: center;
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid var(--cell-border);
  transition: border-color 0.3s;
}
.expand-icon {
  width: 28px; height: 28px;
  margin-right: 14px;
  display: flex; align-items: center; justify-content: center;
  color: var(--icon-color);
}
.expand-title {
  flex: 1;
  font-size: 15px; font-weight: 600;
  color: var(--text-primary); letter-spacing: -0.2px;
  transition: color 0.3s;
}
.close-btn {
  background: var(--btn-bg);
  border: none; color: var(--text-secondary);
  width: 28px; height: 28px; padding: 0;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}
.close-btn:hover {
  background: var(--btn-hover-bg);
  color: var(--text-primary);
  transform: scale(1.1);
}
.expand-body {
  padding: 16px 20px;
  font-size: 13px; color: var(--text-secondary);
  line-height: 1.6;
  transition: color 0.3s;
}
```

Key numbers:
- Cell 48×48, radius 12, gap 6, header row height 28
- Grid = 7 cols × 5 rows = 35 cells total
- Cell hover scale `1.1`, has-event only. Empty cells `pointer-events: none`
- Day number 11px 500 (12px 700 when active-day)
- Dot 6×6 at `top: -1px; right: -1px`
- Icon slot 22×22 at `top: 6px, left: 50%` translateX(-50%)
- Toggle 56×32, thumb 26×26, thumb translate `24px` in dark-active state
- Expanded card final size 320×160 (fixed regardless of cell size), radius 20 when active, 12 at rest
- Ease `cubic-bezier(0.22, 1, 0.36, 1)` everywhere for the FLIP animation
- Ease `cubic-bezier(0.34, 1.56, 0.64, 1)` for cell hover scale + fadeScale

---

## 3. HTML STRUCTURE

```html
<body>
  <div class="calendar-wrapper">
    <!-- Theme switch -->
    <div class="cal-navbar">
      <div class="theme-switch dark-active" id="themeBtn">
        <div class="switch-icons">
          <div class="icon-left"><div></div></div>
          <div class="icon-right">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <circle cx="12" cy="12" r="8"/>
            </svg>
          </div>
        </div>
        <div class="switch-thumb"></div>
      </div>
    </div>

    <!-- Day-of-week tabs -->
    <div class="cal-header-row" id="headerRow">
      <div class="cal-header"          data-tab="mon">MON</div>
      <div class="cal-header"          data-tab="tue">TUE</div>
      <div class="cal-header active"   data-tab="wed">WED</div>
      <div class="cal-header"          data-tab="thu">THU</div>
      <div class="cal-header"          data-tab="fri">FRI</div>
      <div class="cal-header"          data-tab="sat">SAT</div>
      <div class="cal-header"          data-tab="sun">SUN</div>
    </div>

    <div class="cal-grid" id="calGrid"></div>
  </div>

  <div class="expanded-overlay" id="expandedOverlay"></div>
  <div class="expanded-card" id="expandedCard">
    <div class="expand-wrapper">
      <div class="expand-header">
        <div class="expand-icon" id="expandIcon"></div>
        <div class="expand-title" id="expandTitle">Event Title</div>
        <button class="close-btn" id="closeBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="expand-body" id="expandBody">Event Details...</div>
    </div>
  </div>
</body>
```

Copy — verbatim:

| Slot         | Text          |
|--------------|---------------|
| Title tag    | `Premium Calendar - Light & Dark` |
| Day tabs     | `MON TUE WED THU FRI SAT SUN` (initial active: WED) |
| Default title| `Event Title` |
| Default body | `Event Details...` |

---

## 4. ICONS — 7 verbatim SVG strings

Store in a `const icons = { ... }` map, keyed by name. Each is a self-contained inline `<svg>` (or `<div>` for Netflix). Do not modify paths.

```js
const icons = {
  openai:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0462 6.0462 0 0 0 5.3-3.1818 5.9847 5.9847 0 0 0 3.9976-2.9 6.051 6.051 0 0 0-.2756-8.0971zM11.6601 21.9363a4.0152 4.0152 0 0 1-2.9002-1.3l2.8093-1.6212a.9904.9904 0 0 0 .4952-.8571v-4.8727l3.4143 1.9702v3.4005a4.0534 4.0534 0 0 1-3.8186 1.2803zm-6.2205-2.6105a4.005 4.005 0 0 1-.9512-3.0454l2.8092 1.6212a.9904.9904 0 0 0 .9905 0l4.2173-2.4363v3.9404L9.091 21.376a4.043 4.043 0 0 1-3.6514-2.0502zm-1.8906-6.6666a4.0097 4.0097 0 0 1 1.949-1.7456v3.2424a.9904.9904 0 0 0 .4953.8571l4.2172 2.4364-1.707 2.9554-3.4144-1.9702a4.0534 4.0534 0 0 1-1.5401-5.7755zm10.7453-3.5226l-4.2173 2.4363-1.707-2.9554 3.4143-1.9702a4.0534 4.0534 0 0 1 5.7754 1.5401 4.0097 4.0097 0 0 1-.409 4.6853v-3.2423a.9904.9904 0 0 0-.4953-.8571zm3.8471 2.9103l-2.8092-1.6212a.9904.9904 0 0 0-.9905 0l-4.2173 2.4364v-3.9405l3.4144-1.9702a4.043 4.043 0 0 1 4.6026 5.0955zM12.3399 2.0637a4.0152 4.0152 0 0 1 2.9002 1.3l-2.8093 1.6212a.9904.9904 0 0 0-.4952.8571v4.8727L8.5213 8.7445V5.344A4.0534 4.0534 0 0 1 12.3399 2.0637zm-2.0398 9.3871l-1.6364-.9441 1.6364-.944 1.6365.944-1.6365 9.441z"/></svg>`,
  dribbble: `<svg viewBox="0 0 24 24" fill="#ea4c89"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm8.423-11.834c-.16-.044-2.613-.679-5.39-.245 1.01 2.82 1.576 5.485 1.62 5.7.5-1.127.876-2.33.876-3.6 0-.647-.042-1.278-.106-1.855zM14.622 18.25c-.067-.286-1.077-4.267-3.875-6.793-4.268.966-7.857.946-8.082.944a9.929 9.929 0 0 0 5.498 8.016c.334-1.42 1.054-4.57 2.459-7.167 2.279.803 4.072 1.77 5.082 2.378-.453.947-1.135 1.79-1.996 2.457L14.622 18.25zm-2.63-14.73c.31.066.626.155.947.269 1.137.404 2.185.992 3.1 1.724a8.6 8.6 0 0 0-4.047 1.993c-2.458-1.577-4.634-3.328-5.32-3.957.917-.466 1.928-.759 3.018-.838l2.302.81z"/></svg>`,
  netflix:  `<div style="color: #E50914; font-weight: 800; font-size: 16px; transform: scaleY(1.3);">N</div>`,
  sailboat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 18H2M16 14L10 2 4 14h12z"/><path d="M12 2v16"/></svg>`,
  appleTv:  `<svg viewBox="0 0 32 16" width="26" height="13" style="width:26px; height:auto; margin-top: 4px;"><path fill="currentColor" d="M9.5,6c-.1-1.3,1.1-2.1,2.4-2.2-.7-1-1.8-1.1-2.2-1.2-.9-.1-1.8.5-2.3.5-.5,0-1.2-.5-1.9-.5-1,0-1.9.5-2.4,1.4-1,1.7-.3,4.3.6,5.6.5.7,1,1.3,1.7,1.3.7,0,1-.4,1.8-.4.8,0,1,.4,1.8.4.7,0,1.2-.6,1.7-1.3.5-.7.7-1.3.7-1.3-.1,0-1.4-.5-1.4-2.1zM9.2,4.1C9.6,3.6,9.8,3,9.7,2.4c-.6,0-1.2.3-1.6.8-.3.4-.6,1-.5,1.6.6,0,1.2-.2,1.6-.7z"/><text x="13" y="11" fill="currentColor" font-family="Inter, sans-serif" font-size="10" font-weight="700">tv</text></svg>`,
  spotify:  `<svg viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.291c-.225.367-.696.48-1.063.255-2.91-1.776-6.577-2.18-10.89-1.196-.408.093-.815-.164-.908-.573-.092-.408.165-.815.574-.907 4.706-1.077 8.784-.627 12.033 1.357.367.225.48.696.254 1.064zm1.517-3.376c-.283.456-.884.6-1.341.317-3.342-2.057-8.455-2.686-12.224-1.472-.519.168-1.082-.116-1.25-.634-.168-.519.116-1.082.634-1.25 4.316-1.389 9.946-.689 13.864 1.722.457.283.6 1.042.317 1.499zm.135-3.535C15.112 7.994 8.775 7.785 5.109 8.898c-.624.189-1.282-.163-1.471-.787-.189-.624.163-1.282.787-1.471 4.298-1.305 11.272-1.054 16.035 1.771.554.329.736 1.044.406 1.598-.329.554-1.044.736-1.598.406z"/></svg>`,
  snowflake:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2v20m6.5-15.5l-13 11m13 0l-13-11"/></svg>`
};
```

Notes:
- `netflix` is intentionally a `<div>` with the styled letter `N` (red), not an SVG
- `dribbble` and `spotify` use brand hex fills (`#ea4c89` / `#1DB954`)
- `openai`, `sailboat`, `snowflake`, `appleTv` use `currentColor` — inherit from `.icon-slot` / `.expand-icon` (theme aware)

---

## 5. DATASETS (7 tabs) — VERBATIM

```js
const calendarData = {
  mon: {
    startOffset: 0, days: 31, activeDay: 5,
    events: {
      10: { icon: 'dribbble', dot: 'red',  title: 'UI Review',   desc: 'Reviewing Monday designs and component architecture.' },
      22: { icon: 'appleTv',  dot: 'teal', title: 'Apple Event', desc: 'Livestream for the new MacBooks and M4 chips.' }
    }
  },
  tue: {
    startOffset: 5, days: 28, activeDay: 12,
    events: {
      4:  { icon: 'openai',   dot: 'teal', title: 'GPT-5 Rumors',    desc: 'Checking Twitter for leaks and new AI agent frameworks.' },
      15: { icon: 'sailboat', dot: 'teal', title: 'Midjourney V7',   desc: 'Testing new photorealistic styles.' }
    }
  },
  wed: {
    startOffset: 1, days: 31, activeDay: 30,
    events: {
      3:  { icon: 'openai',    dot: 'teal', title: 'OpenAI DevDay',           desc: 'Tune in for the latest updates on GPT models and API features.' },
      12: { icon: 'dribbble',  dot: 'red',  title: 'Design Critique',         desc: 'Weekly team sync on Dribbble portfolio updates.' },
      15: { icon: 'netflix',   dot: 'teal', title: 'Stranger Things Premiere', desc: 'Season 5 finally drops. Block the calendar.' },
      16: { icon: 'sailboat',  dot: 'teal', title: 'Midjourney Prompt Jam',   desc: 'Exploring v6 parameters with the team.' },
      20: { icon: 'appleTv',   dot: 'teal', title: 'Severance S2',            desc: 'New episode drops tonight. Praise Kier.' },
      25: { icon: 'spotify',   dot: 'teal', title: 'Spotify Wrapped Drop',    desc: 'Check the new personalized data viz for this year.' },
      28: { icon: 'snowflake', dot: 'red',  title: 'Winter Ski Trip',         desc: 'Flight leaves at 6:00 AM from Gate D.' }
    }
  },
  thu: {
    startOffset: 3, days: 30, activeDay: 18,
    events: {
      8:  { icon: 'spotify', dot: 'teal', title: 'Podcast Release',    desc: 'Listening to the new tech design podcast.' },
      26: { icon: 'netflix', dot: 'red',  title: 'Tech Documentary',   desc: 'Watching the new Silicon Valley documentary.' }
    }
  },
  fri: {
    startOffset: 6, days: 31, activeDay: 2,
    events: {
      2:  { icon: 'dribbble',  dot: 'teal', title: 'Friday Push',      desc: 'Shipping the new UI components to production.' },
      20: { icon: 'snowflake', dot: 'red',  title: 'Company Retreat',  desc: 'Ice skating and winter team building.' }
    }
  },
  sat: {
    startOffset: 2, days: 30, activeDay: 10,
    events: {
      14: { icon: 'appleTv', dot: 'teal', title: 'Movie Marathon', desc: 'Binge watching the entire Lord of the Rings trilogy.' }
    }
  },
  sun: {
    startOffset: 4, days: 31, activeDay: 25,
    events: {
      9:  { icon: 'sailboat', dot: 'teal', title: 'Sailing Practice', desc: 'Out on the water testing the new rig.' },
      19: { icon: 'openai',   dot: 'red',  title: 'Side Project',     desc: 'Coding a new AI agent with ChatGPT.' }
    }
  }
};
```

Each dataset has:
- `startOffset` — how many empty cells to render at the top-left before day 1
- `days` — total days in the month
- `activeDay` — the day that gets `active-day` class (bold day number)
- `events` — map of day-number → `{ icon, dot, title, desc }`

Only 35 cells are rendered total, so days beyond `35 - startOffset` are not visible in the grid.

---

## 6. JS — RENDER GRID (verbatim)

```js
const grid     = document.getElementById('calGrid');
const overlay  = document.getElementById('expandedOverlay');
const expCard  = document.getElementById('expandedCard');
const expIcon  = document.getElementById('expandIcon');
const expTitle = document.getElementById('expandTitle');
const expBody  = document.getElementById('expandBody');
const closeBtn = document.getElementById('closeBtn');
let lastClickedRect = null;

function renderGrid(tabId) {
  grid.innerHTML = '';
  const data = calendarData[tabId];
  const totalCells = 35;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'cal-cell';
    cell.style.animationDelay = `${i * 0.015}s`;

    if (i < data.startOffset || i >= data.startOffset + data.days) {
      cell.classList.add('empty');
    } else {
      const day = i - data.startOffset + 1;
      cell.innerHTML = `<span class="day-num">${day}</span>`;
      if (day === data.activeDay) cell.classList.add('active-day');
      if (data.events[day]) {
        const eventData = data.events[day];
        cell.classList.add('has-event');
        cell.innerHTML += `
          <div class="icon-slot">${icons[eventData.icon]}</div>
          <div class="dot ${eventData.dot}"></div>
        `;
        cell.addEventListener('click', () => openCard(cell, eventData));
      }
    }
    grid.appendChild(cell);
  }
}

const headers = document.querySelectorAll('.cal-header');
headers.forEach(header => {
  header.addEventListener('click', (e) => {
    if (e.target.classList.contains('active')) return;
    headers.forEach(h => h.classList.remove('active'));
    e.target.classList.add('active');
    renderGrid(e.target.getAttribute('data-tab'));
  });
});
```

Stagger:
- Each cell `animationDelay = i * 0.015s`
- Diagonal wave with `fadeScale` keyframe (opacity 0 → 1, scale 0.9 → 1, translateY 4 → 0)

---

## 7. JS — FLIP CELL-TO-CARD (verbatim)

Uses the FLIP technique — first snap card to the cell's bounding rect, then animate to the final center position.

```js
function openCard(cell, eventData) {
  const rect = cell.getBoundingClientRect();
  lastClickedRect = rect;

  /* Mark dot as read */
  const dot = cell.querySelector('.dot');
  if (dot) dot.classList.add('read');

  /* Snap card to cell rect with NO transition */
  expCard.style.transition = 'none';
  expCard.style.top    = `${rect.top}px`;
  expCard.style.left   = `${rect.left}px`;
  expCard.style.width  = `${rect.width}px`;
  expCard.style.height = `${rect.height}px`;

  /* Fill content */
  expIcon.innerHTML   = icons[eventData.icon];
  expTitle.innerText  = eventData.title;
  expBody.innerHTML   = eventData.desc;

  expCard.classList.remove('active');
  expCard.style.opacity = '1';
  overlay.classList.add('active');

  /* Double-rAF so the browser paints the start state, THEN animate to final */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      expCard.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.4s';
      const finalWidth  = 320;
      const finalHeight = 160;
      const finalTop    = (window.innerHeight - finalHeight) / 2;
      const finalLeft   = (window.innerWidth  - finalWidth)  / 2;
      expCard.style.top    = `${finalTop}px`;
      expCard.style.left   = `${finalLeft}px`;
      expCard.style.width  = `${finalWidth}px`;
      expCard.style.height = `${finalHeight}px`;
      expCard.classList.add('active');
    });
  });
}

function closeCard() {
  overlay.classList.remove('active');
  expCard.classList.remove('active');

  if (lastClickedRect) {
    expCard.style.transition = 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.4s';
    expCard.style.top    = `${lastClickedRect.top}px`;
    expCard.style.left   = `${lastClickedRect.left}px`;
    expCard.style.width  = `${lastClickedRect.width}px`;
    expCard.style.height = `${lastClickedRect.height}px`;
  }
  setTimeout(() => { expCard.style.opacity = '0'; }, 500);
}

overlay.addEventListener('click', closeCard);
closeBtn.addEventListener('click', closeCard);
```

Timing:
- Opening: 600ms `cubic-bezier(0.22, 1, 0.36, 1)`. Final card size 320×160 centered.
- Closing: 500ms same ease, snaps back to `lastClickedRect`, then fades opacity to 0 after 500ms.

---

## 8. JS — THEME TOGGLE (verbatim)

```js
const themeBtn = document.getElementById('themeBtn');
let isLight = false;

themeBtn.addEventListener('click', () => {
  isLight = !isLight;
  if (isLight) {
    document.body.classList.add('light-theme');
    themeBtn.classList.remove('dark-active');
  } else {
    document.body.classList.remove('light-theme');
    themeBtn.classList.add('dark-active');
  }
});

/* Init */
renderGrid('wed');
```

`dark-active` moves the thumb to right (`translateX(24px)`). Dark is the DEFAULT initial state.

---

## 9. INTERACTION MAP

| State                    | Effect                                                                 |
|--------------------------|------------------------------------------------------------------------|
| Load                     | Dark theme active, WED tab active, 35 cells stagger-fade in (15ms each) |
| Click header tab         | Header pill activates, grid re-renders with new dataset                |
| Hover empty cell         | Nothing (`pointer-events: none`)                                       |
| Hover has-event cell     | Cell scales `1.1`, gets border + shadow                                |
| Hover any cell (not empty)| Bg swap `--cell-hover`                                                 |
| Click event cell         | Dot fades + scales to 0 (`read`), card FLIP-expands to center 320×160  |
| Click overlay / close    | Card shrinks back to origin cell rect, then fades                      |
| Click toggle             | Body class toggles `light-theme`, all CSS vars swap, 0.4s transitions   |

---

## 10. RESPONSIVE

- Fixed 48px cells + 6px gaps → wrapper is `48*7 + 6*6 = 372px` wide. Fits any viewport > 400px.
- Below 400px viewport add:
  ```css
  @media (max-width: 400px) {
    .cal-header-row, .cal-grid { grid-template-columns: repeat(7, 40px); }
    .cal-cell { width: 40px; height: 40px; }
  }
  ```
- Card final size 320×160 works on ≥380px viewports. Below that, add `max-width: calc(100vw - 32px)`.
- Prefers-reduced-motion:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .cal-cell, .expanded-card, .expanded-overlay, .theme-switch *, .switch-thumb { transition: none !important; animation: none !important; }
  }
  ```

---

## 11. DELIVERABLE

- One HTML file matching sections 1–8 in order
- One TSX drop-in `PremiumCalendar.tsx`. Assumes Inter loaded in target. All icons + datasets as top-level constants. `useState` for `tab` + `isLight` + expanded event ref. `useRef` for the calendar wrapper, expanded card + overlay, and `lastClickedRect`. Grid re-renders via React when `tab` changes; the FLIP animation still uses direct DOM `style` mutation because it needs to read `getBoundingClientRect` and force a double-rAF paint step. Cleanup detaches any pending `setTimeout` on close.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue175
