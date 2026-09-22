/**
 * Cue Foundations · Morphing Pill Duration Editor
 * ────────────────────────────────────────────
 * A time-duration input that fuses into a single capsule in view mode and splits into editable rounded pills with a pencil-to-check icon crossfade.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/morphing-pill-duration-editor.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue180
 *
 * Original Cue ID: cue180
 * Category: Forms
 * ────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";

/**
 * TimeDurationEditor — three-pill duration input that morphs from a fused
 * capsule (view) into three separate rounded rectangles (edit) on click.
 * Drop it anywhere; no external CSS file needed — styles are inlined below.
 */
export default function TimeDurationEditor({
  defaultHours = 2,
  defaultMinutes = 30,
  onChange,
}: {
  defaultHours?: number;
  defaultMinutes?: number;
  onChange?: (h: number, m: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [hours, setHours] = useState(String(defaultHours));
  const [minutes, setMinutes] = useState(String(defaultMinutes));
  const hrRef = useRef<HTMLInputElement>(null);
  const minRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      const t = setTimeout(() => {
        hrRef.current?.focus();
        hrRef.current?.select();
      }, 300);
      return () => clearTimeout(t);
    } else {
      hrRef.current?.blur();
      minRef.current?.blur();
      onChange?.(Number(hours) || 0, Number(minutes) || 0);
    }
  }, [editing]);

  const clamp = (raw: string) => raw.replace(/[^0-9]/g, "").slice(0, 2);
  const widthFor = (v: string) => (v.length > 1 ? 26 : 14);

  return (
    <>
      <style>{css}</style>
      <div className={`tde-container${editing ? " editing" : ""}`}>
        <div className="tde-pill tde-part-1">
          <div className="tde-value-wrapper">
            <input
              ref={hrRef}
              type="text"
              inputMode="numeric"
              value={hours}
              style={{ width: editing ? 32 : widthFor(hours) }}
              onChange={(e) => setHours(clamp(e.target.value))}
            />
            <span className="tde-label">Hr.</span>
          </div>
        </div>
        <div className="tde-pill tde-part-2">
          <div className="tde-value-wrapper">
            <input
              ref={minRef}
              type="text"
              inputMode="numeric"
              value={minutes}
              style={{ width: editing ? 32 : widthFor(minutes) }}
              onChange={(e) => setMinutes(clamp(e.target.value))}
            />
            <span className="tde-label">Min.</span>
          </div>
        </div>
        <button
          type="button"
          className="tde-pill tde-part-3"
          onClick={() => setEditing((v) => !v)}
          aria-label={editing ? "Save duration" : "Edit duration"}
        >
          <svg className="tde-icon tde-icon-pencil" viewBox="0 0 24 24">
            <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z" />
          </svg>
          <svg
            className="tde-icon tde-icon-check"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    </>
  );
}

const css = `
.tde-container {
  display: inline-flex;
  gap: 0;
  transition: gap 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
.tde-pill {
  background-color: #F4F5F8;
  height: 60px;
  display: flex;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  box-sizing: border-box;
  border: none;
}
.tde-part-1 { border-radius: 16px 0 0 16px; padding: 0 6px 0 24px; }
.tde-part-2 { border-radius: 0; padding: 0 12px 0 6px; }
.tde-part-3 {
  border-radius: 0 16px 16px 0;
  padding: 0 24px 0 12px;
  cursor: pointer;
  position: relative;
  width: 60px;
  justify-content: center;
}

.tde-container.editing { gap: 12px; }
.tde-container.editing .tde-pill { border-radius: 16px; }
.tde-container.editing .tde-part-1 { padding: 0 24px; }
.tde-container.editing .tde-part-2 { padding: 0 24px; }
.tde-container.editing .tde-part-3 { padding: 0; width: 60px; }

.tde-value-wrapper {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.tde-container input {
  width: 14px;
  font-size: 22px;
  font-weight: 700;
  color: #000;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  font-family: inherit;
  text-align: right;
  pointer-events: none;
  transition: width 0.3s ease;
}
.tde-container.editing input {
  pointer-events: auto;
  text-align: center;
}
.tde-container.editing input:focus { color: #2563EB; }
.tde-container input::selection { background: rgba(37, 99, 235, 0.2); }

.tde-label {
  font-size: 22px;
  font-weight: 500;
  color: #A0A4AB;
}

.tde-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.tde-icon-pencil {
  color: #717680;
  fill: currentColor;
  transform: translate(calc(-50% - 4px), -50%);
  opacity: 1;
}
.tde-container.editing .tde-icon-pencil {
  transform: translate(-50%, 150%);
  opacity: 0;
}
.tde-icon-check {
  color: #000;
  stroke-width: 3;
  transform: translate(-50%, -150%);
  opacity: 0;
}
.tde-container.editing .tde-icon-check {
  transform: translate(-50%, -50%);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .tde-container, .tde-pill, .tde-icon, .tde-container input {
    transition: none !important;
  }
}
`;
