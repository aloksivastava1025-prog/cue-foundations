"use client";


/**
 * Cue Foundations · Stacked Deck Scroll Reveal
 * ────────────────────────────────────────────
 * A pinned scroll sequence where staggered cards stack, then fly out one by one to reveal an editorial case-study deck.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/stacked-deck-scroll-reveal.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue148
 *
 * Original Cue ID: cue148
 * Category: Scroll Animations
 * ────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/* ============================================================================
   StackScroll — pinned deck of stacked cards with fly-out reveal
   ----------------------------------------------------------------------------
   N cards start below the viewport. On scroll, they slide up into a staggered
   stack (each 42px lower + 4.5% scaled down from the one above). Then top card
   flies out top-left (`y -115vh, rotate -25deg`), the cards behind advance one
   position forward. Repeat until only the last card remains.

   White plain sections wrap it: intro with "Scroll down ↓", outro with
   "↑ End · Scroll up to replay". CMS-friendly via `cards` array.
   ============================================================================ */

export type Tone = "1" | "2" | "3" | "4" | "5";

export type StackCard = {
  title:      string;
  index:      string;
  lede:       string;
  body:       string;
  ctaLabel:   string;
  ctaHref:    string;
  image:      string;
  imageAlt?:  string;
  tone:       Tone;
};

type Props = {
  introHint?:     string;
  outroHint?:     string;
  sectionTitle?:  string;
  cards?:         StackCard[];
};

const DEFAULT_CARDS: StackCard[] = [
  { title: "Fable",   index: "01", lede: "A brand book for a slow-fashion label based in Kyoto.",
    body: "Editorial identity, print system, and a season one lookbook — built for a label that ships four collections a year and takes its time between them.",
    ctaLabel: "View the case", ctaHref: "#",
    image: "https://i.pinimg.com/1200x/c6/55/aa/c655aa60b6f4ddabf2bf277d43c1a0f6.jpg", tone: "1" },
  { title: "Contour", index: "02", lede: "Motion identity for an eyewear studio.",
    body: "A logotype that opens, closes, and folds like a pair of frames — plus the motion kit for social, retail screens, and short films.",
    ctaLabel: "See the loops", ctaHref: "#",
    image: "https://i.pinimg.com/736x/cd/31/03/cd31039a8e616b2cd2dae9bda9be4160.jpg", tone: "2" },
  { title: "Ember",   index: "03", lede: "Packaging and print for a natural incense line.",
    body: "Six scents, six labels, one folded card that opens into a burn guide. All screen-printed on uncoated stock — the ink smells almost as good as the box.",
    ctaLabel: "Read the case", ctaHref: "#",
    image: "https://i.pinimg.com/736x/d6/d3/c9/d6d3c9cdf076cbfe41366bc5ee34f1ec.jpg", tone: "3" },
  { title: "Halo",    index: "04", lede: "Art direction for a jewelry season.",
    body: "Twenty-four pieces, four sittings, one lookbook — shot in raking daylight across a single week in early spring. Prop-free, colour-graded warm.",
    ctaLabel: "Browse the book", ctaHref: "#",
    image: "https://i.pinimg.com/736x/f3/a6/86/f3a686ce4bc1941f5559a17dafbc17c9.jpg", tone: "4" },
  { title: "Bloom",   index: "05", lede: "Editorial layout for a print quarterly.",
    body: "Issue No. 07 — a 148-page magazine on slow craft, printed once a season on a single Heidelberg. We handle every stage from grid to bindery brief.",
    ctaLabel: "Read Issue 07", ctaHref: "#",
    image: "https://i.pinimg.com/1200x/6e/6e/2f/6e6e2fcce0e3c824f254ed8f9f7cbacd.jpg", tone: "5" },
];

const PEEK = 42;
const SCALE_STEP = 0.045;

export default function StackScroll({
  introHint    = "Scroll down",
  outroHint    = "End · Scroll up to replay",
  sectionTitle = "Our practice",
  cards        = DEFAULT_CARDS,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* ============ Lenis smooth scroll ============ */
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const rafFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    /* ============ Grab cards ============ */
    const cardEls = gsap.utils.toArray<HTMLElement>(rootRef.current?.querySelectorAll(".ss-card") ?? []);
    if (!cardEls.length) return;

    const stackPose = (index: number) => ({
      y: index * PEEK,
      scale: 1 - index * SCALE_STEP,
    });

    /* Initial state — cards pushed below viewport */
    cardEls.forEach((card, i) => {
      gsap.set(card, {
        zIndex: cardEls.length - i,
        y: window.innerHeight * 0.72 + i * PEEK,
        scale: stackPose(i).scale * 0.9,
        rotate: 0,
        transformOrigin: "50% 0%",
      });
    });

    /* ============ Master pinned timeline ============ */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#ss-stack",
        start: "top top",
        end: () => `+=${cardEls.length * window.innerHeight}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    /* Phase 1 — cards slide up into their stack positions */
    cardEls.forEach((card, i) => {
      tl.to(card, { ...stackPose(i), ease: "power3.out", duration: 1.35 }, i * 0.06);
    });
    tl.to({}, { duration: 0.35 });

    /* Phase 2 — each front card flies out; cards behind advance */
    const flyAt = tl.duration();
    const flying = cardEls.slice(0, -1);

    flying.forEach((card, i) => {
      const time = flyAt + i;
      const behind = cardEls.slice(i + 1);

      tl.to(card, {
        y: () => -window.innerHeight * 1.15,
        rotate: -25,
        scale: 0.94,
        ease: "none",
        duration: 1,
      }, time);

      tl.to(behind, {
        y:     (index: number) => stackPose(index).y,
        scale: (index: number) => stackPose(index).scale,
        ease:  "none",
        duration: 1,
      }, time);
    });
    tl.to({}, { duration: 0.4 });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(rafFn);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tl.kill();
    };
  }, [cards]);

  return (
    <div ref={rootRef}>
      <section className="ss-plain ss-plain--intro">
        <div className="ss-plain__inner">
          <span>{introHint}</span>
          <span className="ss-arrow">↓</span>
        </div>
      </section>

      <section className="ss-stack" id="ss-stack">
        <div className="ss-stack__header"><h2>{sectionTitle}</h2></div>
        <div className="ss-stack__stage">
          <div className="ss-stack__deck">
            {cards.map((c, i) => (
              <article className="ss-card" data-tone={c.tone} key={i}>
                <div className="ss-card__content">
                  <div className="ss-card__top">
                    <h3 className="ss-card__title">{c.title}</h3>
                    <span className="ss-card__index">{c.index}</span>
                  </div>
                  <p className="ss-card__lede">{c.lede}</p>
                  <p className="ss-card__body">{c.body}</p>
                  <a className="ss-card__cta" href={c.ctaHref}>
                    {c.ctaLabel}
                    <span className="ss-card__cta-arrow" aria-hidden="true">→</span>
                  </a>
                </div>
                <div className="ss-card__media">
                  <div className="ss-card__frame">
                    <img src={c.image} alt={c.imageAlt ?? c.title} referrerPolicy="no-referrer" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ss-plain ss-plain--outro" id="ss-outro">
        <div className="ss-plain__inner">
          <span className="ss-arrow">↑</span>
          <span>{outroHint}</span>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

        .__cue-globals-stripped { margin: 0; padding: 0; background: #ffffff; }
        html { scroll-behavior: auto; }
        html.lenis, html.lenis .__cue-globals-stripped { height: auto; }

        .ss-card, .ss-plain, .ss-stack, .ss-stack * {
          box-sizing: border-box;
          font-family: "DM Sans", system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .ss-plain {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          background: #ffffff;
        }
        .ss-plain__inner {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #5c5c5c;
        }
        .ss-arrow { display: inline-block; animation: ss-nudge 1.8s ease-in-out infinite; }
        .ss-plain--outro .ss-arrow { animation: ss-nudgeUp 1.8s ease-in-out infinite; }
        @keyframes ss-nudge   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px);  } }
        @keyframes ss-nudgeUp { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

        .ss-stack {
          position: relative;
          background: #121212;
          color: #fff;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: clamp(1.75rem, 4vh, 2.75rem) 1.25rem clamp(2rem, 5vh, 3.5rem);
        }
        .ss-stack__header {
          flex-shrink: 0;
          text-align: center;
          z-index: 20;
          pointer-events: none;
          margin: 2rem 0 clamp(1.5rem, 5vh, 3.5rem);
        }
        .ss-stack__header h2 {
          font-family: "Instrument Serif", serif;
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 400;
          margin: 0;
        }
        .ss-stack__stage { position: relative; width: min(1100px, 100%); flex: 0 0 auto; margin: auto 0; }
        .ss-stack__deck  { position: relative; width: 100%; height: min(62vh, 540px); }

        .ss-card {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(1rem, 3vw, 2.5rem);
          padding: clamp(1.25rem, 3vw, 2.25rem);
          border-radius: 2px;
          transform-origin: center top;
          will-change: transform;
          box-shadow: 0 18px 50px rgba(0,0,0,0.28);
        }
        .ss-card[data-tone="1"] { background: #d6ef4a; color: #141414; }
        .ss-card[data-tone="2"] { background: #f4f4f2; color: #141414; }
        .ss-card[data-tone="3"] { background: #6db5a8; color: #141414; }
        .ss-card[data-tone="4"] { background: #e8d5c4; color: #141414; }
        .ss-card[data-tone="5"] { background: #c8b8e8; color: #141414; }

        .ss-card__content { display: flex; flex-direction: column; min-width: 0; }
        .ss-card__top {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 1rem; margin-bottom: 0.65rem;
        }
        .ss-card__title {
          font-family: "Instrument Serif", serif;
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .ss-card__index {
          font-family: "Instrument Serif", serif;
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          opacity: 0.35; line-height: 1; flex-shrink: 0;
        }
        .ss-card__lede { font-size: clamp(0.85rem, 1.4vw, 1rem);  line-height: 1.45; max-width: 28ch; opacity: 0.75; margin: 0 0 auto; }
        .ss-card__body { font-size: clamp(0.8rem,  1.2vw, 0.92rem); line-height: 1.55; max-width: 36ch; opacity: 0.85; margin: 1.5rem 0 1.25rem; }

        .ss-card__cta {
          display: inline-flex; align-items: center; gap: 0.75rem;
          align-self: flex-start;
          background: #111; color: #fff;
          text-decoration: none;
          font-size: 0.85rem;
          padding: 0.55rem 0.55rem 0.55rem 1rem;
          transition: transform 0.25s ease;
        }
        .ss-card__cta:hover { transform: translateY(-1px); }
        .ss-card__cta-arrow {
          display: grid; place-items: center;
          width: 1.75rem; height: 1.75rem;
          background: #d6ef4a; color: #111;
          font-size: 0.95rem;
        }

        .ss-card__media { position: relative; min-height: 0; display: flex; justify-content: flex-end; align-items: stretch; }
        .ss-card__frame {
          width: 100%; height: 100%;
          overflow: hidden;
          background: #1a1a1a;
          box-shadow: 0 10px 28px rgba(0,0,0,0.14);
        }
        .ss-card__frame img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          animation: ss-kenburns 12s ease-in-out infinite alternate;
        }
        @keyframes ss-kenburns {
          from { transform: scale(1);    }
          to   { transform: scale(1.08); }
        }

        @media (max-width: 768px) {
          .ss-stack__header { margin-bottom: clamp(1.75rem, 5vh, 2.75rem); }
          .ss-card {
            grid-template-columns: 1fr;
            grid-template-rows: minmax(220px, 55%) 1fr;
          }
          .ss-card__media { order: -1; height: 100%; }
          .ss-card__frame { width: 100%; height: 100%; aspect-ratio: auto; }
          .ss-card__body  { margin: 0.75rem 0 1rem; font-size: 0.8rem; }
          .ss-card__lede  { font-size: 0.85rem; }
          .ss-stack__deck { height: min(72vh, 620px); }
        }
      `}</style>
    </div>
  );
}
