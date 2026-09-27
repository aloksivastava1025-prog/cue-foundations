/**
 * Cue Foundations · Grid-Row Profile Expander
 * ────────────────────────────────────────────
 * A beige profile card that expands upward via the grid-row 0fr-to-1fr trick to reveal a nested menu and light/dark/system theme switcher.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/grid-row-profile-expander.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue186
 *
 * Original Cue ID: cue186
 * Category: Navigation
 * ────────────────────────────────────────────
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * ExpandableProfileMenu — beige profile card that expands UPWARD on click to
 * reveal a white sub-menu and a 3-button theme switcher (Light / Dark / System).
 * Uses the grid-template-rows 0fr → 1fr trick to animate auto-height smoothly.
 *
 * Theme controls toggle a class on <body>: default `dark-mode` when Dark is
 * picked, cleared when Light. "System" follows prefers-color-scheme.
 */

type MenuItem = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  danger?: boolean;
};

type Section = MenuItem[];

const iconHome     = <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const iconPages    = <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const iconActivity = <svg viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const iconSite     = <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><circle cx="12" cy="12" r="3"/></svg>;
const iconUser     = <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const iconDocs     = <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const iconSignout  = <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

const iconSun     = <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const iconMoon    = <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const iconMonitor = <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;

const DEFAULT_SECTIONS: Section[] = [
  [
    { label: "Home",            icon: iconHome },
    { label: "Pages",           icon: iconPages },
    { label: "Activity stream", icon: iconActivity },
    { label: "Site settings",   icon: iconSite },
  ],
  [
    { label: "My preferences & profile", icon: iconUser },
    { label: "Documentations",           icon: iconDocs },
    { label: "Sign out",                 icon: iconSignout, danger: true },
  ],
];

export default function ExpandableProfileMenu({
  name = "Tanvir Hasan",
  email = "tanvir@hugeicons.com",
  badge = "Admin",
  avatarSrc = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150",
  sections = DEFAULT_SECTIONS,
  defaultTheme = "light",
  applyThemeToBody = true,
}: {
  name?: string;
  email?: string;
  badge?: string;
  avatarSrc?: string;
  sections?: Section[];
  defaultTheme?: "light" | "dark" | "system";
  applyThemeToBody?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">(defaultTheme);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!applyThemeToBody) return;
    const apply = (dark: boolean) => document.body.classList.toggle("dark-mode", dark);
    if (theme === "dark") apply(true);
    else if (theme === "light") apply(false);
    else {
      const mq = matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches);
      const handler = () => apply(mq.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme, applyThemeToBody]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setExpanded(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <>
      <style>{css}</style>
      <div
        ref={wrapRef}
        className={`epm-wrapper${expanded ? " epm-expanded" : ""}`}
      >
        <div className="epm-content-grid">
          <div className="epm-content-inner">
            <div className="epm-content">
              <div className="epm-white-box">
                {sections.map((sec, si) => (
                  <div key={si}>
                    <ul className="epm-list">
                      {sec.map((it, ii) => (
                        <li
                          key={ii}
                          className={it.danger ? "epm-sign-out" : ""}
                          onClick={(e) => {
                            e.stopPropagation();
                            it.onClick?.();
                          }}
                        >
                          {it.icon}
                          {it.label}
                        </li>
                      ))}
                    </ul>
                    {si < sections.length - 1 && <div className="epm-divider" />}
                  </div>
                ))}
              </div>

              <div className="epm-theme-switcher">
                <button
                  type="button"
                  className={`epm-theme-btn${theme === "light" ? " epm-active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setTheme("light"); }}
                  aria-label="Light theme"
                >
                  {iconSun}
                </button>
                <button
                  type="button"
                  className={`epm-theme-btn${theme === "dark" ? " epm-active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setTheme("dark"); }}
                  aria-label="Dark theme"
                >
                  {iconMoon}
                </button>
                <button
                  type="button"
                  className={`epm-theme-btn${theme === "system" ? " epm-active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setTheme("system"); }}
                  aria-label="System theme"
                >
                  {iconMonitor}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="epm-profile-trigger"
          onClick={() => setExpanded((v) => !v)}
        >
          <img src={avatarSrc} alt="" className="epm-avatar" />
          <div className="epm-profile-info">
            <div className="epm-name-row">
              <span className="epm-name">{name}</span>
              {badge && <span className="epm-badge">{badge}</span>}
            </div>
            <span className="epm-email">{email}</span>
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
.epm-wrapper {
  background: #F6F5F0;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.05);
  width: 320px;
  max-width: calc(100vw - 32px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #333333;
}

.epm-content-grid {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.epm-wrapper.epm-expanded .epm-content-grid { grid-template-rows: 1fr; }

.epm-content-inner {
  overflow: hidden;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.epm-wrapper.epm-expanded .epm-content-inner {
  opacity: 1;
  transform: translateY(0);
}

.epm-content { display: flex; flex-direction: column; }

.epm-white-box {
  background: #FFFFFF;
  border-radius: 12px;
  margin: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.epm-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.epm-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: background 0.2s, color 0.2s;
}
.epm-list li:hover { background: #F3F4F6; color: #111827; }
.epm-list li svg {
  width: 18px;
  height: 18px;
  stroke: #9CA3AF;
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
  transition: stroke 0.2s;
}
.epm-list li:hover svg { stroke: #4B5563; }

.epm-divider {
  height: 1px;
  background: #F3F4F6;
  margin: 0 4px;
}

.epm-list li.epm-sign-out { color: #DC2626; }
.epm-list li.epm-sign-out svg { stroke: #DC2626; }
.epm-list li.epm-sign-out:hover { background: #FEF2F2; color: #B91C1C; }
.epm-list li.epm-sign-out:hover svg { stroke: #B91C1C; }

.epm-theme-switcher {
  display: flex;
  background: rgba(0,0,0,0.04);
  padding: 4px;
  border-radius: 12px;
  margin: 0 4px 4px 4px;
}
.epm-theme-btn {
  flex: 1;
  border: none;
  background: transparent;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  transition: all 0.2s;
}
.epm-theme-btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.epm-theme-btn.epm-active {
  background: #FFFFFF;
  color: #111827;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.epm-profile-trigger {
  background: transparent;
  padding: 12px 16px 16px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.epm-profile-trigger:hover { background: rgba(0,0,0,0.02); }

.epm-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #FFFFFF;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  flex-shrink: 0;
}

.epm-profile-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.epm-name-row { display: flex; align-items: center; gap: 8px; }
.epm-name { font-size: 15px; font-weight: 600; color: #111827; }
.epm-badge {
  font-size: 11px;
  font-weight: 500;
  color: #6B7280;
  border: 1px solid #E5E7EB;
  background: rgba(255,255,255,0.5);
  padding: 2px 6px;
  border-radius: 12px;
}
.epm-email {
  font-size: 13px;
  font-weight: 400;
  color: #9CA3AF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Dark theme — driven by body.dark-mode */
body.dark-mode .epm-wrapper {
  background: #1A1A1A;
  border-color: rgba(255,255,255,0.1);
}
body.dark-mode .epm-white-box { background: #262626; }
body.dark-mode .epm-list li { color: #D1D5DB; }
body.dark-mode .epm-list li:hover { background: #333333; color: #FFFFFF; }
body.dark-mode .epm-list li svg { stroke: #9CA3AF; }
body.dark-mode .epm-list li:hover svg { stroke: #E5E7EB; }
body.dark-mode .epm-divider { background: #333333; }
body.dark-mode .epm-theme-switcher { background: rgba(255,255,255,0.05); }
body.dark-mode .epm-theme-btn.epm-active { background: #333333; color: #FFFFFF; }
body.dark-mode .epm-profile-trigger:hover { background: rgba(255,255,255,0.05); }
body.dark-mode .epm-name { color: #FFFFFF; }
body.dark-mode .epm-badge {
  border-color: #404040;
  background: rgba(255,255,255,0.1);
  color: #D1D5DB;
}
body.dark-mode .epm-list li.epm-sign-out { color: #EF4444; }
body.dark-mode .epm-list li.epm-sign-out svg { stroke: #EF4444; }
body.dark-mode .epm-list li.epm-sign-out:hover { background: rgba(239,68,68,0.1); color: #F87171; }
body.dark-mode .epm-list li.epm-sign-out:hover svg { stroke: #F87171; }
body { transition: background-color 0.3s ease; }
body.dark-mode { background-color: #000000; }

@media (prefers-reduced-motion: reduce) {
  .epm-wrapper, .epm-content-grid, .epm-content-inner {
    transition: none !important;
  }
  .epm-content-inner { transform: none !important; }
}
`;
