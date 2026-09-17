"use client";


/**
 * Cue Foundations · Dot Graph Card
 * ────────────────────────────────────────────
 * A minimalist revenue card with an animated percentage counter and a dot-matrix bar chart that pops in and reveals tooltips on hover.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/dot-graph-card.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue174
 *
 * Original Cue ID: cue174
 * Category: Sections & Layouts
 * ────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";

/* ============================================================================
   DotGraphCard — 460px revenue card with popping-dot histogram + tab switch
   ----------------------------------------------------------------------------
   Header: label + big +N% counter (animated with easeOutQuart) + 3 tabs.
   Body: horizontal columns of 4×4 dots (light = past period, dark = current).
   Dots pop in with a diagonal stagger. Hover any column → others dim + active
   dots scale 1.4× + tooltip shows {label} {amount}. Right edge masks to blank.
   Requires Inter in the target project. Zero deps.
   ============================================================================ */

type Tab = "daily" | "weekly" | "monthly";
type Row = { val: number; type: "light" | "dark" };

const DATASETS: Record<Tab, { revenue: number; labelLeft: string; labelRight: string; raw: Row[] }> = {
  monthly: {
    revenue: 326,
    labelLeft:  "MAY $3,250",
    labelRight: "JUN $12,392",
    raw: [
      { val: 2, type: "light" }, { val: 2, type: "light" }, { val: 2, type: "light" },
      { val: 3, type: "light" }, { val: 6, type: "light" }, { val: 8, type: "light" },
      { val: 3, type: "light" }, { val: 2, type: "light" }, { val: 4, type: "light" },
      { val: 5, type: "light" }, { val: 3, type: "light" }, { val: 2, type: "light" },
      { val: 2, type: "light" }, { val: 1, type: "light" }, { val: 1, type: "light" },
      { val: 1, type: "light" }, { val: 2, type: "light" }, { val: 3, type: "light" },
      { val: 2, type: "light" }, { val: 1, type: "light" }, { val: 2, type: "light" },
      { val: 1, type: "light" }, { val: 1, type: "light" },
      { val: 3, type: "dark" },  { val: 4, type: "dark" },  { val: 5, type: "dark" },
      { val: 7, type: "dark" },  { val: 13, type: "dark" }, { val: 9, type: "dark" },
      { val: 7, type: "dark" },  { val: 8, type: "dark" },  { val: 6, type: "dark" },
      { val: 5, type: "dark" },  { val: 4, type: "dark" },  { val: 4, type: "dark" },
      { val: 3, type: "dark" },  { val: 2, type: "dark" },  { val: 2, type: "dark" },
      { val: 1, type: "dark" },  { val: 2, type: "dark" },  { val: 1, type: "dark" },
      { val: 4, type: "dark" },  { val: 2, type: "dark" },  { val: 3, type: "dark" },
      { val: 4, type: "dark" },  { val: 5, type: "dark" },  { val: 4, type: "dark" },
      { val: 3, type: "dark" },  { val: 4, type: "dark" },
    ],
  },
  weekly: {
    revenue: 84,
    labelLeft:  "LAST WK $1,120",
    labelRight: "THIS WK $2,840",
    raw: [
      { val: 1, type: "light" }, { val: 2, type: "light" }, { val: 3, type: "light" },
      { val: 2, type: "light" }, { val: 5, type: "light" }, { val: 3, type: "light" },
      { val: 2, type: "light" }, { val: 4, type: "light" }, { val: 5, type: "light" },
      { val: 3, type: "light" }, { val: 2, type: "light" }, { val: 2, type: "light" },
      { val: 4, type: "dark" },  { val: 5, type: "dark" },  { val: 8, type: "dark" },
      { val: 11, type: "dark" }, { val: 9, type: "dark" },  { val: 7, type: "dark" },
      { val: 6, type: "dark" },  { val: 8, type: "dark" },  { val: 5, type: "dark" },
      { val: 4, type: "dark" },  { val: 3, type: "dark" },  { val: 6, type: "dark" },
    ],
  },
  daily: {
    revenue: 12,
    labelLeft:  "YESTERDAY $420",
    labelRight: "TODAY $680",
    raw: [
      { val: 1, type: "light" }, { val: 2, type: "light" }, { val: 1, type: "light" },
      { val: 3, type: "light" }, { val: 4, type: "light" }, { val: 2, type: "light" },
      { val: 1, type: "light" }, { val: 2, type: "light" }, { val: 1, type: "light" },
      { val: 3, type: "dark" },  { val: 5, type: "dark" },  { val: 7, type: "dark" },
      { val: 4, type: "dark" },  { val: 6, type: "dark" },  { val: 8, type: "dark" },
      { val: 5, type: "dark" },  { val: 3, type: "dark" },  { val: 4, type: "dark" },
    ],
  },
};

const TAB_ORDER: Tab[] = ["daily", "weekly", "monthly"];
const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);

export default function DotGraphCard() {
  const [activeTab, setActiveTab] = useState<Tab>("monthly");

  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef   = useRef<HTMLDivElement>(null);
  const counterRef   = useRef<HTMLSpanElement>(null);
  const leftLabelRef  = useRef<HTMLDivElement>(null);
  const rightLabelRef = useRef<HTMLDivElement>(null);

  const currentCounterVal = useRef(0);
  const rafRef            = useRef<number | null>(null);

  const animateCounter = (target: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const duration = 1200;
    const start = currentCounterVal.current;
    const diff  = target - start;
    const t0    = performance.now();

    const step = (now: number) => {
      const elapsed = now - t0;
      const p = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(p);
      currentCounterVal.current = Math.round(start + diff * eased);
      if (counterRef.current) counterRef.current.innerText = String(currentCounterVal.current);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        currentCounterVal.current = target;
        if (counterRef.current) counterRef.current.innerText = String(target);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const container = containerRef.current;
    const tooltip   = tooltipRef.current;
    if (!container || !tooltip) return;

    const config = DATASETS[activeTab];
    container.innerHTML = "";

    if (leftLabelRef.current)  leftLabelRef.current.innerText  = config.labelLeft;
    if (rightLabelRef.current) rightLabelRef.current.innerText = config.labelRight;

    animateCounter(config.revenue);

    let count = 1;
    const data = config.raw.map((d, i) => {
      let prefix = "";
      if (activeTab === "monthly") prefix = d.type === "light" ? "May"     : "Jun";
      if (activeTab === "weekly")  prefix = d.type === "light" ? "Last Wk" : "This Wk";
      if (activeTab === "daily")   prefix = d.type === "light" ? "Yest"    : "Today";
      if (i > 0 && config.raw[i - 1].type !== d.type) count = 1;
      return {
        val: d.val,
        type: d.type,
        label: `${prefix} ${count++}`,
        amount: `$${(d.val * 240 + 100).toLocaleString()}`,
      };
    });

    data.forEach((item, colIndex) => {
      const col = document.createElement("div");
      col.className = "graph-col";

      col.addEventListener("mouseenter", () => {
        const rect = col.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const leftPos = rect.left - containerRect.left + rect.width / 2;
        tooltip.innerHTML = `${item.label} <span class="amount">${item.amount}</span>`;
        tooltip.style.opacity = "1";
        tooltip.style.left = `${leftPos}px`;
        tooltip.style.top  = "-15px";
      });
      col.addEventListener("mouseleave", () => { tooltip.style.opacity = "0"; });

      for (let i = 0; i < item.val; i++) {
        const dot = document.createElement("div");
        dot.className = `dot ${item.type}`;
        dot.style.animationDelay = `${colIndex * 0.02 + i * 0.04}s`;
        col.appendChild(dot);
      }
      container.appendChild(col);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="dgc-root">
      <style>{`
        .dgc-root {
          display: flex; justify-content: center; align-items: center;
          min-height: 100vh;
          background-color: #e5e5e5;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }
        .dgc-root .graph-card {
          width: 460px;
          background-color: #f9f9f9;
          border-radius: 24px;
          border: 1px solid #eaeaea;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          display: flex; flex-direction: column;
          overflow: hidden; position: relative;
        }
        .dgc-root .card-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 24px 32px 20px 32px;
        }
        .dgc-root .header-left { display: flex; flex-direction: column; gap: 4px; }
        .dgc-root .label-title {
          font-size: 11px; font-weight: 500; color: #777;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .dgc-root .revenue-value {
          font-size: 42px; font-weight: 300; color: #111;
          line-height: 1; letter-spacing: -1px;
          display: flex; align-items: baseline;
        }
        .dgc-root .revenue-value .percent {
          font-size: 24px; font-weight: 300; margin-left: 2px;
        }
        .dgc-root .header-right { display: flex; gap: 16px; padding-top: 4px; }
        .dgc-root .time-tab {
          font-size: 11px; font-weight: 500; color: #aaa;
          letter-spacing: 0.5px; text-transform: uppercase;
          cursor: pointer; transition: color 0.2s;
          background: none; border: none; padding: 0;
          font-family: inherit;
        }
        .dgc-root .time-tab:hover  { color: #666; }
        .dgc-root .time-tab.active { color: #111; }
        .dgc-root .divider { height: 1px; background-color: #eaeaea; width: 100%; }
        .dgc-root .card-body { padding: 32px 32px 24px 32px; position: relative; }
        .dgc-root .graph-container {
          display: flex; align-items: flex-end; gap: 5px;
          height: 120px;
          -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
                  mask-image: linear-gradient(to right, black 85%, transparent 100%);
          position: relative;
        }
        .dgc-root .graph-col {
          display: flex; flex-direction: column-reverse; gap: 5px;
          cursor: crosshair;
          padding: 20px 0 0 0; margin-top: -20px;
          transition: opacity 0.3s ease;
        }
        .dgc-root .graph-container:hover .graph-col { opacity: 0.25; }
        .dgc-root .graph-container .graph-col:hover { opacity: 1; }
        .dgc-root .graph-col:hover .dot             { transform: scale(1.4); }

        .dgc-root .dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background-color: #555;
          opacity: 0;
          animation: dgc-popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dgc-root .dot.light { background-color: #c4c4c4; }
        .dgc-root .dot.dark  { background-color: #555;    }

        @keyframes dgc-popIn {
          0%   { opacity: 0; transform: translateY(10px) scale(0); }
          100% { opacity: 1; transform: translateY(0)    scale(1); }
        }

        .dgc-root .graph-labels {
          display: flex; justify-content: space-between;
          margin-top: 16px;
          font-size: 12px; font-weight: 500;
          font-family: 'Inter', monospace;
        }
        .dgc-root .label-may { color: #a0a0a0; padding-left: 0px; }
        .dgc-root .label-jun { color: #111; position: absolute; left: 215px; }

        .dgc-root .tooltip {
          position: absolute; top: 0; left: 0;
          background: #111; color: #fff;
          padding: 6px 10px; border-radius: 6px;
          font-size: 11px; font-weight: 500;
          pointer-events: none; opacity: 0;
          transform: translate(-50%, -10px);
          transition: opacity 0.2s, transform 0.1s ease-out;
          z-index: 10; white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .dgc-root .tooltip .amount { color: #a0a0a0; margin-left: 4px; }

        @media (prefers-reduced-motion: reduce) {
          .dgc-root .dot { animation: none !important; opacity: 1; transform: none; }
          .dgc-root .graph-col,
          .dgc-root .time-tab,
          .dgc-root .tooltip { transition: none !important; }
        }
      `}</style>

      <div className="graph-card">
        <div className="card-header">
          <div className="header-left">
            <div className="label-title">Revenue</div>
            <div className="revenue-value">+<span ref={counterRef}>0</span><span className="percent">%</span></div>
          </div>
          <div className="header-right">
            {TAB_ORDER.map((t) => (
              <button
                key={t}
                type="button"
                className={`time-tab${activeTab === t ? " active" : ""}`}
                data-tab={t}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div className="card-body">
          <div ref={tooltipRef} className="tooltip" />
          <div ref={containerRef} className="graph-container" />

          <div className="graph-labels">
            <div ref={leftLabelRef}  className="label-may">MAY $3,250</div>
            <div ref={rightLabelRef} className="label-jun">JUN $12,392</div>
          </div>
        </div>
      </div>
    </div>
  );
}
