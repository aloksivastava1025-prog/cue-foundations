"use client";


/**
 * Cue Foundations · Cell-to-Card Calendar Expansion
 * ────────────────────────────────────────────
 * A themeable weekly calendar grid where clicking an event cell performs a FLIP animation into a centered detail card with backdrop blur.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/cell-to-card-calendar-expansion.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue175
 *
 * Original Cue ID: cue175
 * Category: Sections & Layouts
 * ────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";

/* ============================================================================
   PremiumCalendar — light/dark 7×5 grid with FLIP cell-to-card expansion
   ----------------------------------------------------------------------------
   7 day-tabs (MON..SUN), 35 cells per tab. Each event cell has an icon + a
   red/teal dot. Click → FLIP animate from cell rect to 320×160 detail card.
   Toggle at top swaps CSS variables for full light/dark reskin.
   Requires Inter in the target project. Zero deps.
   ============================================================================ */

type Tab = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type Dot = "red" | "teal";
type IconName = "openai" | "dribbble" | "netflix" | "sailboat" | "appleTv" | "spotify" | "snowflake";
type EventData = { icon: IconName; dot: Dot; title: string; desc: string };
type TabData = { startOffset: number; days: number; activeDay: number; events: Record<number, EventData> };

const ICONS: Record<IconName, string> = {
  openai:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0462 6.0462 0 0 0 5.3-3.1818 5.9847 5.9847 0 0 0 3.9976-2.9 6.051 6.051 0 0 0-.2756-8.0971zM11.6601 21.9363a4.0152 4.0152 0 0 1-2.9002-1.3l2.8093-1.6212a.9904.9904 0 0 0 .4952-.8571v-4.8727l3.4143 1.9702v3.4005a4.0534 4.0534 0 0 1-3.8186 1.2803zm-6.2205-2.6105a4.005 4.005 0 0 1-.9512-3.0454l2.8092 1.6212a.9904.9904 0 0 0 .9905 0l4.2173-2.4363v3.9404L9.091 21.376a4.043 4.043 0 0 1-3.6514-2.0502zm-1.8906-6.6666a4.0097 4.0097 0 0 1 1.949-1.7456v3.2424a.9904.9904 0 0 0 .4953.8571l4.2172 2.4364-1.707 2.9554-3.4144-1.9702a4.0534 4.0534 0 0 1-1.5401-5.7755zm10.7453-3.5226l-4.2173 2.4363-1.707-2.9554 3.4143-1.9702a4.0534 4.0534 0 0 1 5.7754 1.5401 4.0097 4.0097 0 0 1-.409 4.6853v-3.2423a.9904.9904 0 0 0-.4953-.8571zm3.8471 2.9103l-2.8092-1.6212a.9904.9904 0 0 0-.9905 0l-4.2173 2.4364v-3.9405l3.4144-1.9702a4.043 4.043 0 0 1 4.6026 5.0955zM12.3399 2.0637a4.0152 4.0152 0 0 1 2.9002 1.3l-2.8093 1.6212a.9904.9904 0 0 0-.4952.8571v4.8727L8.5213 8.7445V5.344A4.0534 4.0534 0 0 1 12.3399 2.0637zm-2.0398 9.3871l-1.6364-.9441 1.6364-.944 1.6365.944-1.6365 9.441z"/></svg>`,
  dribbble: `<svg viewBox="0 0 24 24" fill="#ea4c89"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm8.423-11.834c-.16-.044-2.613-.679-5.39-.245 1.01 2.82 1.576 5.485 1.62 5.7.5-1.127.876-2.33.876-3.6 0-.647-.042-1.278-.106-1.855zM14.622 18.25c-.067-.286-1.077-4.267-3.875-6.793-4.268.966-7.857.946-8.082.944a9.929 9.929 0 0 0 5.498 8.016c.334-1.42 1.054-4.57 2.459-7.167 2.279.803 4.072 1.77 5.082 2.378-.453.947-1.135 1.79-1.996 2.457L14.622 18.25zm-2.63-14.73c.31.066.626.155.947.269 1.137.404 2.185.992 3.1 1.724a8.6 8.6 0 0 0-4.047 1.993c-2.458-1.577-4.634-3.328-5.32-3.957.917-.466 1.928-.759 3.018-.838l2.302.81z"/></svg>`,
  netflix:  `<div style="color: #E50914; font-weight: 800; font-size: 16px; transform: scaleY(1.3);">N</div>`,
  sailboat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 18H2M16 14L10 2 4 14h12z"/><path d="M12 2v16"/></svg>`,
  appleTv:  `<svg viewBox="0 0 32 16" width="26" height="13" style="width:26px; height:auto; margin-top: 4px;"><path fill="currentColor" d="M9.5,6c-.1-1.3,1.1-2.1,2.4-2.2-.7-1-1.8-1.1-2.2-1.2-.9-.1-1.8.5-2.3.5-.5,0-1.2-.5-1.9-.5-1,0-1.9.5-2.4,1.4-1,1.7-.3,4.3.6,5.6.5.7,1,1.3,1.7,1.3.7,0,1-.4,1.8-.4.8,0,1,.4,1.8.4.7,0,1.2-.6,1.7-1.3.5-.7.7-1.3.7-1.3-.1,0-1.4-.5-1.4-2.1zM9.2,4.1C9.6,3.6,9.8,3,9.7,2.4c-.6,0-1.2.3-1.6.8-.3.4-.6,1-.5,1.6.6,0,1.2-.2,1.6-.7z"/><text x="13" y="11" fill="currentColor" font-family="Inter, sans-serif" font-size="10" font-weight="700">tv</text></svg>`,
  spotify:  `<svg viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.291c-.225.367-.696.48-1.063.255-2.91-1.776-6.577-2.18-10.89-1.196-.408.093-.815-.164-.908-.573-.092-.408.165-.815.574-.907 4.706-1.077 8.784-.627 12.033 1.357.367.225.48.696.254 1.064zm1.517-3.376c-.283.456-.884.6-1.341.317-3.342-2.057-8.455-2.686-12.224-1.472-.519.168-1.082-.116-1.25-.634-.168-.519.116-1.082.634-1.25 4.316-1.389 9.946-.689 13.864 1.722.457.283.6 1.042.317 1.499zm.135-3.535C15.112 7.994 8.775 7.785 5.109 8.898c-.624.189-1.282-.163-1.471-.787-.189-.624.163-1.282.787-1.471 4.298-1.305 11.272-1.054 16.035 1.771.554.329.736 1.044.406 1.598-.329.554-1.044.736-1.598.406z"/></svg>`,
  snowflake:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 2v20m6.5-15.5l-13 11m13 0l-13-11"/></svg>`,
};

const CALENDAR_DATA: Record<Tab, TabData> = {
  mon: { startOffset: 0, days: 31, activeDay: 5,
    events: {
      10: { icon: "dribbble", dot: "red",  title: "UI Review",   desc: "Reviewing Monday designs and component architecture." },
      22: { icon: "appleTv",  dot: "teal", title: "Apple Event", desc: "Livestream for the new MacBooks and M4 chips." },
    } },
  tue: { startOffset: 5, days: 28, activeDay: 12,
    events: {
      4:  { icon: "openai",   dot: "teal", title: "GPT-5 Rumors",  desc: "Checking Twitter for leaks and new AI agent frameworks." },
      15: { icon: "sailboat", dot: "teal", title: "Midjourney V7", desc: "Testing new photorealistic styles." },
    } },
  wed: { startOffset: 1, days: 31, activeDay: 30,
    events: {
      3:  { icon: "openai",    dot: "teal", title: "OpenAI DevDay",             desc: "Tune in for the latest updates on GPT models and API features." },
      12: { icon: "dribbble",  dot: "red",  title: "Design Critique",           desc: "Weekly team sync on Dribbble portfolio updates." },
      15: { icon: "netflix",   dot: "teal", title: "Stranger Things Premiere",  desc: "Season 5 finally drops. Block the calendar." },
      16: { icon: "sailboat",  dot: "teal", title: "Midjourney Prompt Jam",     desc: "Exploring v6 parameters with the team." },
      20: { icon: "appleTv",   dot: "teal", title: "Severance S2",              desc: "New episode drops tonight. Praise Kier." },
      25: { icon: "spotify",   dot: "teal", title: "Spotify Wrapped Drop",      desc: "Check the new personalized data viz for this year." },
      28: { icon: "snowflake", dot: "red",  title: "Winter Ski Trip",           desc: "Flight leaves at 6:00 AM from Gate D." },
    } },
  thu: { startOffset: 3, days: 30, activeDay: 18,
    events: {
      8:  { icon: "spotify", dot: "teal", title: "Podcast Release",  desc: "Listening to the new tech design podcast." },
      26: { icon: "netflix", dot: "red",  title: "Tech Documentary", desc: "Watching the new Silicon Valley documentary." },
    } },
  fri: { startOffset: 6, days: 31, activeDay: 2,
    events: {
      2:  { icon: "dribbble",  dot: "teal", title: "Friday Push",     desc: "Shipping the new UI components to production." },
      20: { icon: "snowflake", dot: "red",  title: "Company Retreat", desc: "Ice skating and winter team building." },
    } },
  sat: { startOffset: 2, days: 30, activeDay: 10,
    events: {
      14: { icon: "appleTv", dot: "teal", title: "Movie Marathon", desc: "Binge watching the entire Lord of the Rings trilogy." },
    } },
  sun: { startOffset: 4, days: 31, activeDay: 25,
    events: {
      9:  { icon: "sailboat", dot: "teal", title: "Sailing Practice", desc: "Out on the water testing the new rig." },
      19: { icon: "openai",   dot: "red",  title: "Side Project",     desc: "Coding a new AI agent with ChatGPT." },
    } },
};

const TABS: Tab[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function PremiumCalendar() {
  const [tab, setTab]         = useState<Tab>("wed");
  const [isLight, setIsLight] = useState(false);

  const cardRef    = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const iconRef    = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const bodyRef    = useRef<HTMLDivElement>(null);
  const lastRectRef = useRef<DOMRect | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLight) document.body.classList.add("light-theme");
    else         document.body.classList.remove("light-theme");
  }, [isLight]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const openCard = (cellEl: HTMLDivElement, ev: EventData) => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    const iconEl = iconRef.current;
    const titleEl = titleRef.current;
    const bodyEl = bodyRef.current;
    if (!card || !overlay || !iconEl || !titleEl || !bodyEl) return;

    const rect = cellEl.getBoundingClientRect();
    lastRectRef.current = rect;

    const dot = cellEl.querySelector(".dot");
    if (dot) dot.classList.add("read");

    card.style.transition = "none";
    card.style.top    = `${rect.top}px`;
    card.style.left   = `${rect.left}px`;
    card.style.width  = `${rect.width}px`;
    card.style.height = `${rect.height}px`;

    iconEl.innerHTML  = ICONS[ev.icon];
    titleEl.innerText = ev.title;
    bodyEl.innerHTML  = ev.desc;

    card.classList.remove("active");
    card.style.opacity = "1";
    overlay.classList.add("active");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.transition = "all 0.6s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.4s";
        const finalW = 320, finalH = 160;
        const finalTop  = (window.innerHeight - finalH) / 2;
        const finalLeft = (window.innerWidth  - finalW) / 2;
        card.style.top    = `${finalTop}px`;
        card.style.left   = `${finalLeft}px`;
        card.style.width  = `${finalW}px`;
        card.style.height = `${finalH}px`;
        card.classList.add("active");
      });
    });
  };

  const closeCard = () => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay) return;

    overlay.classList.remove("active");
    card.classList.remove("active");

    if (lastRectRef.current) {
      const r = lastRectRef.current;
      card.style.transition = "all 0.5s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.4s";
      card.style.top    = `${r.top}px`;
      card.style.left   = `${r.left}px`;
      card.style.width  = `${r.width}px`;
      card.style.height = `${r.height}px`;
    }

    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      if (cardRef.current) cardRef.current.style.opacity = "0";
    }, 500);
  };

  const data = CALENDAR_DATA[tab];

  return (
    <>
      <style>{CSS}</style>

      <div className="calendar-wrapper">
        <div className="cal-navbar">
          <div
            className={`theme-switch${isLight ? "" : " dark-active"}`}
            onClick={() => setIsLight((v) => !v)}
          >
            <div className="switch-icons">
              <div className="icon-left"><div /></div>
              <div className="icon-right">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </div>
            </div>
            <div className="switch-thumb" />
          </div>
        </div>

        <div className="cal-header-row">
          {TABS.map((t) => (
            <div
              key={t}
              className={`cal-header${tab === t ? " active" : ""}`}
              data-tab={t}
              onClick={() => setTab(t)}
            >
              {t.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="cal-grid">
          {Array.from({ length: 35 }).map((_, i) => {
            const isEmpty = i < data.startOffset || i >= data.startOffset + data.days;
            const day = isEmpty ? 0 : i - data.startOffset + 1;
            const isActive = !isEmpty && day === data.activeDay;
            const ev = !isEmpty ? data.events[day] : undefined;

            const classes = [
              "cal-cell",
              isEmpty  ? "empty"      : "",
              isActive ? "active-day" : "",
              ev       ? "has-event"  : "",
            ].filter(Boolean).join(" ");

            return (
              <div
                key={`${tab}-${i}`}
                className={classes}
                style={{ animationDelay: `${i * 0.015}s` }}
                onClick={ev ? (e) => openCard(e.currentTarget as HTMLDivElement, ev) : undefined}
              >
                {!isEmpty && <span className="day-num">{day}</span>}
                {ev && (
                  <>
                    <div className="icon-slot" dangerouslySetInnerHTML={{ __html: ICONS[ev.icon] }} />
                    <div className={`dot ${ev.dot}`} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div ref={overlayRef} className="expanded-overlay" onClick={closeCard} />
      <div ref={cardRef}    className="expanded-card">
        <div className="expand-wrapper">
          <div className="expand-header">
            <div ref={iconRef} className="expand-icon" />
            <div ref={titleRef} className="expand-title">Event Title</div>
            <button className="close-btn" onClick={closeCard}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div ref={bodyRef} className="expand-body">Event Details...</div>
        </div>
      </div>
    </>
  );
}

const CSS = `
  :root {
    --bg-color: #000000; --text-primary: #ffffff; --text-secondary: #888888; --text-muted: #666666;
    --cell-bg: #161618; --cell-hover: #262629; --cell-border: transparent; --cell-border-hover: rgba(255,255,255,0.15);
    --cell-shadow-hover: 0 10px 20px rgba(0,0,0,0.5);
    --header-bg: #1a1a1c; --header-active-bg: #242426;
    --icon-color: #ffffff;
    --card-bg: #000000; --card-border: rgba(255,255,255,0.12);
    --card-shadow: 0 30px 60px rgba(0,0,0,1), inset 0 1px 0 rgba(255,255,255,0.05);
    --overlay-bg: rgba(0,0,0,0.6);
    --btn-bg: rgba(255,255,255,0.05); --btn-hover-bg: rgba(255,255,255,0.15);
    --toggle-bg: #39393d; --toggle-thumb: #ffffff; --toggle-icon: #777777;
  }
  body.light-theme {
    --bg-color: #f2f2f7; --text-primary: #111111; --text-secondary: #666666; --text-muted: #999999;
    --cell-bg: #ffffff; --cell-hover: #fafafa; --cell-border: rgba(0,0,0,0.04); --cell-border-hover: rgba(0,0,0,0.1);
    --cell-shadow-hover: 0 12px 24px rgba(0,0,0,0.08);
    --header-bg: #e5e5ea; --header-active-bg: #ffffff;
    --icon-color: #111111;
    --card-bg: #ffffff; --card-border: rgba(0,0,0,0.08);
    --card-shadow: 0 30px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8);
    --overlay-bg: rgba(255,255,255,0.6);
    --btn-bg: rgba(0,0,0,0.05); --btn-hover-bg: rgba(0,0,0,0.1);
    --toggle-bg: #e5e5ea; --toggle-thumb: #ffffff; --toggle-icon: #8e8e93;
  }
  body {
    background-color: var(--bg-color); color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    display: flex; justify-content: center; align-items: center;
    min-height: 100vh; margin: 0; overflow: hidden;
    transition: background-color 0.4s ease, color 0.4s ease;
  }
  .calendar-wrapper { display: flex; flex-direction: column; gap: 6px; }
  .cal-navbar { display: flex; justify-content: center; align-items: center; margin-bottom: 16px; }
  .theme-switch {
    width: 56px; height: 32px; background-color: var(--toggle-bg);
    border-radius: 16px; padding: 3px; box-sizing: border-box;
    cursor: pointer; position: relative;
    transition: background-color 0.4s ease;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.15);
  }
  .switch-thumb {
    width: 26px; height: 26px; background-color: var(--toggle-thumb);
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
  .icon-left, .icon-right { display: flex; align-items: center; justify-content: center; width: 12px; height: 12px; }
  .icon-left div { width: 2px; height: 10px; background-color: currentColor; border-radius: 1px; }
  .icon-right svg { width: 12px; height: 12px; }

  .cal-header-row, .cal-grid { display: grid; grid-template-columns: repeat(7, 48px); gap: 6px; }

  .cal-header {
    height: 28px; background-color: var(--header-bg);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.5px;
    cursor: pointer; transition: all 0.2s ease;
    border: 1px solid transparent;
  }
  .cal-header:hover { color: var(--text-secondary); }
  .cal-header.active {
    color: var(--text-primary);
    background-color: var(--header-active-bg);
    border: 1px solid var(--cell-border-hover);
    box-sizing: border-box; cursor: default;
  }

  .cal-cell {
    width: 48px; height: 48px;
    background-color: var(--cell-bg);
    border-radius: 12px;
    display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
    padding-bottom: 6px; box-sizing: border-box;
    position: relative;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s, border 0.3s, box-shadow 0.3s;
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
    transform: scale(1.1); z-index: 10;
    border: 1px solid var(--cell-border-hover);
    box-shadow: var(--cell-shadow-hover);
  }
  .cal-cell.empty { background-color: transparent; border-color: transparent; pointer-events: none; }

  .day-num { font-size: 11px; color: var(--text-secondary); font-weight: 500; transition: color 0.3s; }
  .cal-cell.active-day .day-num { color: var(--text-primary); font-weight: 700; font-size: 12px; }

  .icon-slot {
    position: absolute; top: 6px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; pointer-events: none;
    color: var(--icon-color); transition: color 0.3s;
  }
  .icon-slot svg { width: 100%; height: 100%; }

  .dot {
    position: absolute; top: -1px; right: -1px;
    width: 6px; height: 6px; border-radius: 50%; z-index: 5;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  .dot.read { opacity: 0; transform: scale(0); }
  .dot.teal { background-color: #00d2d3; }
  .dot.red  { background-color: #ff4757; }

  .expanded-overlay {
    position: fixed; inset: 0;
    background: var(--overlay-bg);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
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
    border-radius: 12px; overflow: hidden;
    z-index: 101;
    opacity: 0; pointer-events: none;
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.4s;
  }
  .expanded-card.active { opacity: 1; pointer-events: all; border-radius: 20px; }

  .expand-wrapper {
    width: 320px; height: 160px;
    display: flex; flex-direction: column;
    opacity: 0; transition: opacity 0.3s ease;
  }
  .expanded-card.active .expand-wrapper { opacity: 1; transition-delay: 0.15s; }

  .expand-header {
    display: flex; align-items: center;
    padding: 20px 20px 16px 20px;
    border-bottom: 1px solid var(--cell-border);
    transition: border-color 0.3s;
  }
  .expand-icon {
    width: 28px; height: 28px; margin-right: 14px;
    display: flex; align-items: center; justify-content: center;
    color: var(--icon-color);
  }
  .expand-title {
    flex: 1; font-size: 15px; font-weight: 600;
    color: var(--text-primary); letter-spacing: -0.2px;
    transition: color 0.3s;
  }
  .close-btn {
    background: var(--btn-bg); border: none; color: var(--text-secondary);
    width: 28px; height: 28px; padding: 0;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%; transition: all 0.2s;
  }
  .close-btn:hover { background: var(--btn-hover-bg); color: var(--text-primary); transform: scale(1.1); }
  .expand-body {
    padding: 16px 20px;
    font-size: 13px; color: var(--text-secondary);
    line-height: 1.6; transition: color 0.3s;
  }
`;
