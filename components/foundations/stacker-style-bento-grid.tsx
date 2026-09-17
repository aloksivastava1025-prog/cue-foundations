"use client";


/**
 * Cue Foundations · Stacker Style Bento Grid
 * ────────────────────────────────────────────
 * A white-page features section with a masked headline reveal and a 3/2/2/3 bento grid of animated flowchart, profile, and network cards.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/stacker-style-bento-grid.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue171
 *
 * Original Cue ID: cue171
 * Category: Sections & Layouts
 * ────────────────────────────────────────────
 */

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
   StackerBento — Features 5-col bento grid with 4 cards + Awwwards reveals
   ----------------------------------------------------------------------------
   Row 1: Sync Feeds (col-span-3) · Enrich (col-span-2)
   Row 2: Teamwork    (col-span-2) · Distribute (col-span-3)
   Requires Tailwind + Inter + gsap in the target project.
   ============================================================================ */

export default function StackerBento() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".header-section", start: "top 80%" },
      });
      tl.fromTo(".awwwards-text-line",
        { y: "120%", rotateZ: 2, transformOrigin: "0% 0%" },
        { y: "0%",   rotateZ: 0, duration: 1.4, stagger: 0.15, ease: "power4.out" }
      ).fromTo(".header-anim",
        { y: 30, opacity: 0 },
        { y: 0,  opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" },
        "-=1.0"
      );

      gsap.fromTo(".bento-card",
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".bento-grid", start: "top 70%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="stacker-root">
      <style>{`
        .stacker-root {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background-color: #ffffff;
          color: #111827;
          padding: 5rem 1.5rem;
        }
        .stacker-root .bento-card {
          background-color: #fafafa;
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .stacker-root .visual-area {
          position: relative;
          flex-grow: 1;
          min-height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .stacker-root .svg-lines {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none; z-index: 0;
        }
        .stacker-root .floating-shadow {
          box-shadow: 0 12px 30px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.03);
        }
        .stacker-root .flow-node {
          background: white;
          border-radius: 12px;
          padding: 10px 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.02);
          display: flex; flex-direction: column;
          align-items: center; gap: 2px;
          z-index: 10;
        }
      `}</style>

      <div className="w-full border-y border-gray-200 bg-white">
        <div className="max-w-[1100px] mx-auto border-x border-gray-200 pt-16 pb-16 px-6 lg:px-10">

          {/* HEADER */}
          <div className="header-section max-w-4xl mx-auto text-center mb-16">
            <div className="header-anim inline-flex items-center gap-1.5 bg-[#eff2ff] text-[#5c6dff] px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Features
            </div>

            <h2 className="text-[40px] md:text-[44px] leading-[1.2] font-medium text-[#2d2d2d] mb-4 flex flex-col items-center">
              <div className="overflow-hidden pt-2 pb-1">
                <div className="awwwards-text-line translate-y-full">The complete toolkit for managing</div>
              </div>
              <div className="overflow-hidden pt-2 pb-1">
                <div className="awwwards-text-line text-[#5c6dff] translate-y-full">product feeds at scale</div>
              </div>
            </h2>

            <p className="header-anim text-[#6b7280] text-[16px] md:text-[17px] font-normal max-w-[600px] mx-auto leading-relaxed">
              We empower developers and technical teams to create, simulate, <br /> and manage AI-driven workflows visually
            </p>
          </div>

          <div className="bento-grid grid grid-cols-1 md:grid-cols-5 gap-4 w-full mx-auto">

            {/* ==== CARD 1 — Sync Feeds ==== */}
            <div className="bento-card md:col-span-3 p-8">
              <div className="mb-6 z-10 relative">
                <div className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-2">Sync Feeds</div>
                <h3 className="text-[22px] font-semibold text-gray-900 leading-snug">Centralize all your product data</h3>
              </div>

              <div className="visual-area">
                <svg className="svg-lines" viewBox="0 0 600 300" preserveAspectRatio="none">
                  <path d="M150 70 L450 70"           stroke="#e5e7eb" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                  <path d="M220 70 L220 160 L280 160" stroke="#e5e7eb" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                  <path d="M380 70 L380 160 L320 160" stroke="#e5e7eb" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                  <path d="M300 160 L300 240"         stroke="#e5e7eb" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                </svg>

                <div className="flex flex-col items-center gap-8 w-full z-10 relative mt-4">
                  <div className="flex items-center justify-between w-[85%]">
                    <FlowNode
                      label="Customers" count="2,490 Available"
                      iconBg="bg-purple-100" iconColor="text-purple-600" roundedFull
                      icon={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>}
                    />
                    <FlowNode
                      label="Orders" count="11,559 Completed"
                      iconBg="bg-orange-100" iconColor="text-orange-500"
                      icon={<>
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </>}
                    />
                    <FlowNode
                      label="Shipments" count="11,224 Shipped"
                      iconBg="bg-emerald-100" iconColor="text-emerald-500"
                      icon={<>
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </>}
                    />
                  </div>

                  <div className="flex items-center justify-center gap-6 w-full">
                    <FlowNode
                      label="Projects" count="23 Tasks"
                      iconBg="bg-pink-100" iconColor="text-pink-500" small
                      icon={<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />}
                    />
                    <FlowNode
                      label="Interviews" count="12 Completed"
                      iconBg="bg-rose-100" iconColor="text-rose-500" small
                      icon={<>
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </>}
                    />
                  </div>

                  <div className="bg-[#1a1a1a] text-white px-4 py-2 rounded-full text-[11px] font-medium flex items-center gap-1.5 shadow-lg mt-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Import
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-gray-500 leading-relaxed mt-6 z-10 relative max-w-[85%]">
                Import effortlessly from XML, Shopify, or WooCommerce. MagicFeedPro syncs your entire catalog automatically into one unified dashboard.
              </p>
            </div>

            {/* ==== CARD 2 — Enrich ==== */}
            <div className="bento-card md:col-span-2 p-8">
              <div className="mb-6 z-10 relative">
                <div className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-2">Enrich</div>
                <h3 className="text-[22px] font-semibold text-gray-900 leading-snug">AI-Powered Catalog Optimization</h3>
              </div>

              <div className="visual-area flex justify-center items-center">
                <div className="bg-white rounded-2xl w-[80%] floating-shadow p-5 relative z-10">
                  <div className="absolute left-[-16px] top-4 flex flex-col gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center floating-shadow text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center floating-shadow text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute right-[-12px] top-6 flex flex-col gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-black         border-2 border-white" />
                    <div className="w-6 h-6 rounded-full bg-purple-600    border-2 border-white" />
                    <div className="w-6 h-6 rounded-full bg-green-500     border-2 border-white" />
                    <div className="w-6 h-6 rounded-full bg-orange-400    border-2 border-white" />
                  </div>

                  <div className="w-12 h-12 rounded-full overflow-hidden mb-3 shadow-inner bg-blue-100 flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="font-semibold text-gray-800 text-sm mb-4">Fatima Uma</div>

                  <div className="flex justify-between items-center text-[11px] mb-2">
                    <span className="text-gray-400 font-medium">Home town</span>
                    <span className="text-gray-800 font-semibold">Singapore</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] mb-5">
                    <span className="text-gray-400 font-medium">Bookings</span>
                    <span className="text-gray-800 font-semibold">3 times</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="bg-[#1a1a1a] text-white px-3 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1 hover:bg-black transition-colors">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      Call
                    </button>
                    <button className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-[10px] font-semibold hover:bg-gray-200 transition-colors">
                      Message
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-gray-500 leading-relaxed mt-6 z-10 relative">
                Automatically rewrite titles and descriptions with SEO-rich copy that ranks higher and converts better across all sales channels.
              </p>
            </div>

            {/* ==== CARD 3 — Teamwork ==== */}
            <div className="bento-card md:col-span-2 p-8">
              <div className="mb-6 z-10 relative">
                <div className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-2">Teamwork</div>
                <h3 className="text-[22px] font-semibold text-gray-900 leading-snug">Review and approve changes together</h3>
              </div>

              <div className="visual-area flex justify-center items-center">
                <div className="bg-white rounded-2xl w-[90%] floating-shadow p-4 pt-10 relative z-10">
                  <div className="absolute top-[-10px] left-4 bg-white border border-gray-100 rounded-full px-3 py-1.5 text-[9px] font-semibold text-gray-400 flex items-center gap-1.5 floating-shadow">
                    Comment on
                    <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[8px]">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.9 8.2c-.4-.3-.9-.4-1.5-.4-1.2 0-1.8.4-1.8 1.1 0 .6.5 1 1.7 1.3l.8.2c2.1.5 3.3 1.5 3.3 3.4 0 2.2-1.7 3.5-4.5 3.5-1.9 0-3.6-.5-4.8-1.3v-2.3c1.3.8 3.1 1.3 4.8 1.3 1.5 0 2.2-.5 2.2-1.2 0-.6-.5-1-1.8-1.3l-.7-.2c-2-.5-3.2-1.5-3.2-3.4 0-2 1.6-3.4 4.1-3.4 1.7 0 3.2.4 4.3 1.1V8.2z" />
                      </svg>
                      Stripe
                    </div>
                  </div>

                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-semibold mt-0.5">L</div>
                    <div>
                      <div className="text-[11px] font-semibold text-gray-800 mb-1">Lucas Muller</div>
                      <p className="text-[12px] text-gray-700 leading-tight">
                        <span className="text-indigo-600 font-medium">@Andy</span> when can we review the proposal?
                      </p>
                      <div className="flex gap-2 mt-3">
                        <div className="bg-gray-50 border border-gray-100 rounded-full px-2 py-1 text-[9px] font-medium text-gray-500 flex items-center gap-1">
                          <span className="text-red-500">📌</span> 8
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-full px-2 py-1 text-[9px] font-medium text-gray-500 flex items-center gap-1">
                          <span>✌️</span> 3
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-full px-2 py-1 text-[9px] font-medium text-gray-500 flex items-center gap-1">
                          <span>🚀</span> 7
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-gray-400">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-gray-500 leading-relaxed mt-6 z-10 relative">
                Leave comments, review bulk optimizations, and collaborate with your team to ensure every product listing is perfect before going live.
              </p>
            </div>

            {/* ==== CARD 4 — Distribute ==== */}
            <div className="bento-card md:col-span-3 p-8">
              <div className="mb-6 z-10 relative">
                <div className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-2">Distribute</div>
                <h3 className="text-[22px] font-semibold text-gray-900 leading-snug">Publish to every sales channel</h3>
              </div>

              <div className="visual-area relative">
                <div className="absolute inset-0 z-0 opacity-20" style={{
                  backgroundSize: "40px 40px",
                  backgroundImage:
                    "linear-gradient(to right, #d1d5db 1px, transparent 1px), linear-gradient(to bottom, #d1d5db 1px, transparent 1px)",
                }} />

                <svg className="svg-lines z-0 opacity-40" viewBox="0 0 600 300" preserveAspectRatio="none">
                  <path d="M300 150 L200 100" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
                  <path d="M300 150 L200 200" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
                  <path d="M300 150 L400 100" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
                  <path d="M300 150 L450 200" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
                </svg>

                <div className="relative z-10 w-full h-[200px] flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#1a1a1a] rounded-[20px] flex items-center justify-center floating-shadow z-20">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="absolute w-10 h-10 bg-white rounded-xl flex items-center justify-center floating-shadow" style={{ top: "20%", left: "30%" }}>
                    <div className="w-5 h-5 bg-green-500 rounded-sm flex flex-col items-center justify-center text-white p-0.5">
                      <div className="w-full h-1/2 border-b border-white" />
                      <div className="w-full h-1/2 flex"><div className="w-1/2 border-r border-white" /></div>
                    </div>
                  </div>

                  <div className="absolute w-10 h-10 bg-white rounded-xl flex items-center justify-center floating-shadow" style={{ bottom: "20%", left: "25%" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="absolute w-10 h-10 bg-white rounded-xl flex items-center justify-center floating-shadow" style={{ top: "20%", right: "30%" }}>
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex flex-col items-center justify-center gap-[2px]">
                      <div className="w-2.5 h-0.5 bg-white rounded-full" />
                      <div className="w-3.5 h-0.5 bg-white rounded-full" />
                      <div className="w-2   h-0.5 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="absolute w-10 h-10 bg-white rounded-xl flex items-center justify-center floating-shadow" style={{ bottom: "15%", right: "20%" }}>
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-[9px] font-semibold tracking-tighter">qb</div>
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-gray-500 leading-relaxed mt-6 z-10 relative max-w-[85%]">
                Push your optimized product feeds instantly to Google Merchant Center, Meta, TikTok, and localized Shopify Markets effortlessly.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Flow node helper ---------- */
type FlowNodeProps = {
  label: string;
  count: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  small?: boolean;
  roundedFull?: boolean;
};
function FlowNode({ label, count, iconBg, iconColor, icon, small, roundedFull }: FlowNodeProps) {
  const size    = small ? "w-5 h-5" : "w-6 h-6";
  const shape   = roundedFull ? "rounded-full" : (small ? "rounded-sm" : "rounded-md");
  const iconSize = small ? 10 : 12;
  return (
    <div className="flow-node">
      <div className="flex items-center gap-2">
        <div className={`${size} ${shape} ${iconBg} flex items-center justify-center ${iconColor}`}>
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            {icon}
          </svg>
        </div>
        <span className="text-[13px] font-semibold text-gray-800">{label}</span>
      </div>
      <span className={`text-[9px] font-medium text-gray-400 tracking-wide uppercase ${small ? "mt-0.5" : "mt-1"}`}>{count}</span>
    </div>
  );
}
