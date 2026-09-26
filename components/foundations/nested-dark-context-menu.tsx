/**
 * Cue Foundations · Nested Dark Context Menu
 * ────────────────────────────────────────────
 * A dark, ClickUp-style dropdown menu with a right-flyout submenu that springs from its parent item using class-toggled transforms.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/nested-dark-context-menu.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue184
 *
 * Original Cue ID: cue184
 * Category: Navigation
 * ────────────────────────────────────────────
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * ContextMenuFlyout — dark ClickUp-style context menu with a right-flyout
 * submenu. Trigger button opens the main menu; clicking "Create New"
 * expands the submenu. Click-outside closes both levels.
 *
 * By default it renders the exact ClickUp reference (Rename / Copy Link /
 * Create New with 8-item submenu / Color & Icon / Space Settings / ...).
 * Pass your own `items` to override.
 */

type Item = {
  label: string;
  icon: ReactNode;
  danger?: boolean;
  subtext?: string;                    // renders as .complex (2-line item)
  submenu?: Item[];                    // if present, shows right-chevron and opens right flyout
  onSelect?: () => void;
  hasFurtherChevron?: boolean;         // static right chevron even without full submenu
};

/* ---------- Icons (16×16, stroke 1.5, round caps) ---------- */
const I = (children: ReactNode) => (
  <svg className="cmf-icon" viewBox="0 0 24 24">{children}</svg>
);
const CH = (children: ReactNode) => (
  <svg className="cmf-chevron-right" viewBox="0 0 24 24">{children}</svg>
);

const iconRename       = I(<><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>);
const iconCopy         = I(<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>);
const iconPlus         = I(<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>);
const iconList         = I(<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>);
const iconDoc          = I(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>);
const iconForm         = I(<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>);
const iconWhiteboard   = I(<><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M12 8v8"/><path d="M8 12h8"/></>);
const iconFolder       = I(<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>);
const iconSprint       = I(<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>);
const iconTemplateStar = I(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>);
const iconImport       = I(<><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></>);
const iconColor        = I(<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>);
const iconSettings     = I(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>);
const iconTemplateDoc  = I(<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></>);
const iconFav          = I(<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>);
const iconHide         = I(<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>);
const iconDuplicate    = I(<><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>);
const iconArchive      = I(<><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></>);
const iconTrash        = I(<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>);

const DEFAULT_ITEMS: (Item | "divider")[] = [
  { label: "Rename",        icon: iconRename },
  { label: "Copy Link",     icon: iconCopy },
  "divider",
  {
    label: "Create New",
    icon: iconPlus,
    submenu: [
      { label: "List",          icon: iconList },
      { label: "Doc",           icon: iconDoc },
      { label: "Form",          icon: iconForm },
      { label: "Whiteboard",    icon: iconWhiteboard },
      "divider" as unknown as Item,
      { label: "Folder",        icon: iconFolder },
      { label: "Sprint Folder", icon: iconSprint },
      "divider" as unknown as Item,
      { label: "From Template", icon: iconTemplateStar },
      { label: "Import",        icon: iconImport, hasFurtherChevron: true },
    ] as Item[],
  },
  { label: "Color & Icon",    icon: iconColor,       submenu: [] },
  { label: "Space Settings",  icon: iconSettings,    submenu: [] },
  { label: "Templates",       icon: iconTemplateDoc, submenu: [] },
  "divider",
  { label: "Add to Favorites", icon: iconFav },
  {
    label: "Hide Space",
    icon: iconHide,
    subtext: "You'll retain access to this Space, but it won't show in your sidebar",
  },
  "divider",
  { label: "Duplicate", icon: iconDuplicate },
  { label: "Archive",   icon: iconArchive },
  { label: "Delete",    icon: iconTrash, danger: true },
];

export default function ContextMenuFlyout({
  triggerLabel = "Click Me",
  items = DEFAULT_ITEMS,
  footerLabel = "Manage Permissions",
  onFooterClick,
}: {
  triggerLabel?: string;
  items?: (Item | "divider")[];
  footerLabel?: string;
  onFooterClick?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeSub, setActiveSub] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveSub(null);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="cmf-wrapper" ref={wrapRef}>
        <button
          type="button"
          className={`cmf-trigger${open ? " cmf-open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
            if (open) setActiveSub(null);
          }}
        >
          {triggerLabel}
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <div
          className={`cmf-menu-container${open ? " cmf-show" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cmf-context-menu">
            {items.map((it, i) => {
              if (it === "divider") return <div key={i} className="cmf-divider" />;
              return (
                <MenuItem
                  key={i}
                  item={it}
                  index={i}
                  isActive={activeSub === i}
                  onToggleSub={() => setActiveSub((v) => (v === i ? null : i))}
                />
              );
            })}
            <div className="cmf-divider" />
            <button
              type="button"
              className="cmf-manage-btn"
              onClick={onFooterClick}
            >
              {footerLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function MenuItem({
  item,
  isActive,
  onToggleSub,
}: {
  item: Item;
  index: number;
  isActive: boolean;
  onToggleSub: () => void;
}) {
  const hasSub = Array.isArray(item.submenu) && item.submenu.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasSub) {
      onToggleSub();
    } else {
      item.onSelect?.();
    }
  };

  const classes = [
    "cmf-menu-item",
    item.subtext ? "cmf-complex" : "",
    item.danger ? "cmf-danger" : "",
    isActive ? "cmf-active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={handleClick}>
      {item.icon}
      {item.subtext ? (
        <div className="cmf-item-text-group">
          <div>{item.label}</div>
          <div className="cmf-item-subtext">{item.subtext}</div>
        </div>
      ) : (
        <>{item.label}</>
      )}
      {(hasSub || item.hasFurtherChevron) &&
        CH(<polyline points="9 18 15 12 9 6" />)}

      {hasSub && (
        <div className="cmf-submenu">
          {item.submenu!.map((sub, si) => {
            if ((sub as unknown) === "divider")
              return <div key={si} className="cmf-divider" />;
            const s = sub as Item;
            return (
              <div
                key={si}
                className={`cmf-menu-item${s.hasFurtherChevron ? "" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  s.onSelect?.();
                }}
              >
                {s.icon}
                {s.label}
                {s.hasFurtherChevron && CH(<polyline points="9 18 15 12 9 6" />)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const css = `
.cmf-wrapper {
  position: relative;
  display: inline-block;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.cmf-trigger {
  background: #1C1C1E;
  border: 1px solid rgba(255,255,255,0.1);
  color: #F1F1F1;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  transition: background 0.1s;
}
.cmf-trigger:hover { background: rgba(255,255,255,0.08); }
.cmf-trigger svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.2s ease;
}
.cmf-trigger.cmf-open svg { transform: rotate(90deg); }

.cmf-menu-container {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  visibility: hidden;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.15s ease-out, transform 0.15s ease-out, visibility 0.15s;
  z-index: 50;
}
.cmf-menu-container.cmf-show {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
}

.cmf-context-menu {
  width: 270px;
  background: #1C1C1E;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow:
    0 16px 48px rgba(0,0,0,0.4),
    0 4px 12px rgba(0,0,0,0.2);
  padding: 8px;
  box-sizing: border-box;
}

.cmf-menu-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #F1F1F1;
  transition: background 0.1s ease;
  position: relative;
  user-select: none;
}
.cmf-menu-item:hover,
.cmf-menu-item.cmf-active { background: rgba(255,255,255,0.08); }

.cmf-menu-item.cmf-complex {
  align-items: flex-start;
  padding: 8px 12px 10px 12px;
}
.cmf-menu-item.cmf-complex .cmf-icon { margin-top: 2px; }

.cmf-item-text-group { display: flex; flex-direction: column; }
.cmf-item-subtext {
  font-size: 12px;
  color: #8E8E93;
  margin-top: 4px;
  line-height: 1.4;
  font-weight: 400;
}

.cmf-icon {
  width: 16px;
  height: 16px;
  margin-right: 12px;
  stroke: #A1A1A6;
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}

.cmf-menu-item.cmf-danger { color: #FF453A; }
.cmf-menu-item.cmf-danger .cmf-icon { stroke: #FF453A; }

.cmf-chevron-right {
  margin-left: auto;
  width: 14px;
  height: 14px;
  stroke: #8E8E93;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  transition: opacity 0.1s;
  flex-shrink: 0;
}
.cmf-menu-item:hover .cmf-chevron-right,
.cmf-menu-item.cmf-active .cmf-chevron-right { opacity: 1; }

.cmf-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 6px 0;
}

.cmf-manage-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.02);
  border-radius: 8px;
  color: #F1F1F1;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.1s;
  font-family: inherit;
}
.cmf-manage-btn:hover { background: rgba(255,255,255,0.1); }

.cmf-submenu {
  position: absolute;
  top: 0;
  left: calc(100% + 4px);
  width: 220px;
  background: #1C1C1E;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.2);
  padding: 8px;
  visibility: hidden;
  opacity: 0;
  transform: translateX(-8px) scale(0.98);
  transform-origin: left center;
  transition: opacity 0.15s ease-out, transform 0.15s ease-out, visibility 0.15s;
  z-index: 10;
}
.cmf-menu-item.cmf-active .cmf-submenu {
  visibility: visible;
  opacity: 1;
  transform: translateX(0) scale(1);
}

@media (max-width: 479px) {
  .cmf-submenu {
    position: static;
    width: 100%;
    margin-top: 4px;
    transform-origin: top center;
    transform: translateY(-4px) scale(0.98);
  }
  .cmf-menu-item.cmf-active .cmf-submenu { transform: translateY(0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .cmf-menu-container, .cmf-submenu, .cmf-trigger svg {
    transition: none !important;
    transform: none !important;
  }
}
`;
