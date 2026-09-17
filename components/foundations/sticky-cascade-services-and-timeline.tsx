/**
 * Cue Foundations · Sticky Cascade Services & Timeline
 * ────────────────────────────────────────────
 * A sticky-cascade services deck with file-folder tab cards paired with a blur-reveal about section and scroll-drawn timeline.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/sticky-cascade-services-and-timeline.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue067
 *
 * Original Cue ID: cue067
 * Category: Sections & Layouts
 * ────────────────────────────────────────────
 */

/**
 * Services Deck (Sticky Cascade) + About Timeline
 *
 * Deps:  npm i framer-motion
 * Font:  Manrope 400/500/600 via <link> in global head.
 *
 * Usage:
 *   import ServicesAboutPage from './ServicesAboutPage';
 *   <ServicesAboutPage />
 *
 * Or use pieces independently:
 *   <ServicesDeck items={...} />
 *   <AboutTimeline heading="..." experience={...} />
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

/* ═══ Types ══════════════════════════════════════════ */
export interface ServiceItem {
  num: string;
  title: string;
  color: string;
  top: number;
  tags: string[];
  desc: string;
  img: string;
}
export interface ExperienceItem {
  role: string;
  date: string;
  workplace: string;
  desc: string;
}

/* ═══ Defaults ═══════════════════════════════════════ */
const DEFAULT_SERVICES: ServiceItem[] = [
  { num: '01', title: 'What is Cue?', color: '#F9FFDE', top: 120,
    tags: ['Components', 'Curated', 'Library', 'Design System'],
    desc: 'Cue is a meticulously curated component library designed for the modern web. It bridges the gap between high-end aesthetic design and developer-friendly code, offering a comprehensive suite of premium UI elements that elevate your digital products instantly.',
    img: 'https://i.pinimg.com/736x/2b/05/80/2b0580d548248a24d6e4f84bc413a142.jpg' },
  { num: '02', title: 'Awwwards-tier craft.', color: '#D9F0FF', top: 150,
    tags: ['Awwwards', 'SOTD', 'Premium', 'Craft'],
    desc: 'Every component in the Cue library is crafted with the same obsessive attention to detail found in Site of the Day winners. We focus on hyper-polished micro-interactions, flawless typography, and fluid spring physics to deliver a cinematic user experience.',
    img: 'https://i.pinimg.com/736x/26/32/5b/26325bfd9131880dc4d695cd229508cc.jpg' },
  { num: '03', title: 'Paste-ready prompts.', color: '#D8FFAB', top: 180,
    tags: ['AI Prompts', 'Bolt', 'v0', 'Cursor'],
    desc: 'Accelerate your workflow with AI-optimized blueprints. Simply copy and paste our exact prompt strings into Bolt, v0, or Cursor, and watch as complex, animated layouts are generated flawlessly with zero design friction.',
    img: 'https://i.pinimg.com/736x/2e/0a/74/2e0a74bd4db9a61a4f6061feb620b607.jpg' },
  { num: '04', title: 'Working code always.', color: '#84F5E8', top: 210,
    tags: ['HTML', 'CSS', 'JS', 'React'],
    desc: 'No more wrestling with broken abstractions or half-finished concepts. Cue provides production-ready HTML, CSS, and JS components. Everything runs beautifully out of the box, letting you ship stunning landing pages this weekend.',
    img: 'https://i.pinimg.com/736x/2a/4e/30/2a4e308d142e5c38b1d7c83025566e47.jpg' },
];

const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  { role: 'Cue v1.0 Launched',        date: '2024 - Present', workplace: 'The Component Revolution',
    desc: 'Empowering thousands of builders worldwide with paste-ready, Awwwards-tier components perfectly optimized for modern AI code generators like Bolt and Cursor.' },
  { role: 'Prototyping & Physics',    date: '2023 - 2024',    workplace: 'Perfecting The Craft',
    desc: 'We obsessed over spring animations and fluid micro-interactions, meticulously bridging the gap between high-end aesthetic design and developer-friendly code.' },
  { role: 'Architecting The System',  date: '2022 - 2023',    workplace: 'Laying The Foundation',
    desc: 'Building the robust design system that powers Cue. We focused on accessible markup, scalable Tailwind utilities, and flawless React structures.' },
  { role: 'The Agency Origins',       date: '2020 - 2022',    workplace: 'Where It All Started',
    desc: 'Before Cue, we ran an award-winning digital studio, designing and engineering bespoke web experiences for hyper-growth startups and visionary brands.' },
];

const EASE_HERO = [0.16, 1, 0.3, 1] as const;

const cardReveal: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: EASE_HERO } },
};

/* ═══ ServiceCard ════════════════════════════════════ */
function ServiceCard({ data, index }: { data: ServiceItem; index: number }) {
  return (
    <motion.div
      className="w-full max-w-[1000px] mx-auto sticky"
      style={{ top: data.top, zIndex: index + 1 }}
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className="flex drop-shadow-sm">
        {/* Flat tab */}
        <div
          className="flex items-center gap-4 px-6 py-4 rounded-tl-[16px] relative z-10 w-[240px] md:w-[280px]"
          style={{ backgroundColor: data.color }}
        >
          <span className="text-[18px] font-medium text-[#101519]">{data.num}</span>
          <span className="text-[20px] md:text-[24px] font-medium text-[#101519] whitespace-nowrap">{data.title}</span>
        </div>
        {/* Skewed mask */}
        <div className="w-[80px] relative overflow-hidden -ml-4 z-0">
          <div
            className="absolute inset-0 rounded-tr-[16px] origin-bottom-left"
            style={{ backgroundColor: data.color, transform: 'skewX(50deg)' }}
          />
        </div>
      </div>

      {/* Body */}
      <div
        className="flex flex-col md:flex-row gap-[32px] p-[32px] md:p-[48px] rounded-tr-[16px] rounded-b-[16px] drop-shadow-2xl shadow-black/5"
        style={{ backgroundColor: data.color }}
      >
        <div className="w-full md:w-1/2 flex flex-col gap-6 md:gap-8 justify-center">
          <div className="flex flex-wrap gap-2">
            {data.tags.map(t => (
              <span key={t} className="text-[10px] md:text-[12px] font-medium text-[#414548] border border-[#929496] px-3 py-1 rounded-full uppercase tracking-wide">{t}</span>
            ))}
          </div>
          <p className="text-[14px] text-[#101519] leading-relaxed max-w-[90%]">{data.desc}</p>
        </div>
        <div className="w-full md:w-1/2">
          <div className="w-full aspect-video rounded-[8px] overflow-hidden bg-white/20">
            <motion.img
              src={data.img}
              alt={data.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══ ServicesDeck ═══════════════════════════════════ */
export function ServicesDeck({ items = DEFAULT_SERVICES }: { items?: ServiceItem[] }) {
  return (
    <section id="services" className="pt-[96px] w-full flex flex-col items-center gap-[64px] bg-white px-4">
      <div className="flex flex-col items-center text-center gap-6 z-10 relative">
        <div className="text-[12px] font-medium text-[#E1790A] border border-[#B5B7B8] px-4 py-2 rounded-full uppercase tracking-wider bg-white">
          CUE LIBRARY
        </div>
        <h4 className="text-[20px] md:text-[24px] font-medium text-[#101519] max-w-[700px] leading-snug">
          The ultimate curated component library for AI builders. Awwwards-tier craft, paste-ready prompts, and production-grade code that just works.
        </h4>
      </div>
      <div className="w-full flex flex-col relative pb-[200px]">
        {items.map((s, i) => <ServiceCard key={s.num} data={s} index={i} />)}
      </div>
    </section>
  );
}

/* ═══ BlurText ═══════════════════════════════════════ */
function BlurText({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
  };
  const child: Variants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(10px)', transition: { type: 'spring', damping: 20, stiffness: 100 } },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', damping: 20, stiffness: 100 } },
  };
  return (
    <motion.div
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={child} style={{ marginRight: '0.25em' }}>{w}</motion.span>
      ))}
    </motion.div>
  );
}

/* ═══ ExperienceRow ══════════════════════════════════ */
function ExperienceRow({ data, isLast }: { data: ExperienceItem; isLast: boolean }) {
  return (
    <div className="flex flex-row gap-6 md:gap-12 w-full relative z-10 group">
      <div className="w-[40px] flex flex-col items-center shrink-0 mt-2 relative">
        <motion.div
          initial={{ opacity: 0.2 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: '-150px' }}
          transition={{ duration: 0.4 }}
          className="w-[12px] h-[12px] rounded-full border-[2px] border-[#101519] bg-white z-20"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className={`flex flex-col gap-4 w-full ${isLast ? 'pb-0' : 'pb-16'}`}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <h5 className="text-[20px] text-[#101519] font-semibold">{data.role}</h5>
          <p className="text-[14px] text-[#606366] whitespace-nowrap">{data.date}</p>
        </div>
        <p className="text-[14px] text-[#606366] uppercase tracking-widest">{data.workplace}</p>
        <p className="text-[16px] text-[#606366] leading-relaxed max-w-[600px]">{data.desc}</p>
      </motion.div>
    </div>
  );
}

/* ═══ AboutTimeline ══════════════════════════════════ */
export function AboutTimeline({
  paragraphs = [
    "We are a collective of obsessive engineers and designers who believe that AI generation shouldn't mean the end of craft. With a deep understanding of motion physics and UI aesthetics, we create components that feel both intentional and premium.",
    "Whether it's perfecting a complex layout, refining a fluid micro-interaction, or optimizing code for AI prompts, our goal is always the same: empower you to build work that resonates.",
  ],
  experience = DEFAULT_EXPERIENCE,
}: {
  paragraphs?: [string, string];
  experience?: ExperienceItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start center', 'end center'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="about" className="py-[96px] w-full min-h-screen flex flex-col items-center gap-[64px] bg-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-[12px] text-[#E1790A] border border-[#B5B7B8] rounded-full px-4 py-2 uppercase tracking-wide font-medium"
      >
        About Cue
      </motion.div>

      <div className="max-w-[800px] flex flex-col gap-8 text-center text-balance mx-auto">
        <BlurText text={paragraphs[0]} className="text-[24px] md:text-[32px] md:leading-[1.4] text-[#101519]" />
        <BlurText text={paragraphs[1]} className="text-[20px] md:text-[28px] md:leading-[1.4] text-[#606366]" />
      </div>

      <div ref={containerRef} className="flex flex-col w-full max-w-[800px] mt-[64px] relative">
        <div className="absolute left-[19px] top-[14px] bottom-[10px] w-[2px] bg-[#101519] opacity-20 z-0" />
        <motion.div
          style={{ scaleY, transformOrigin: 'top' }}
          className="absolute left-[19px] top-[14px] bottom-[10px] w-[2px] bg-[#101519] z-10"
        />
        {experience.map((item, i) => (
          <ExperienceRow key={i} data={item} isLast={i === experience.length - 1} />
        ))}
      </div>
    </section>
  );
}

/* ═══ Wrapper ═══════════════════════════════════════ */
export default function ServicesAboutPage() {
  return (
    <main className="bg-white min-h-screen font-['Manrope',sans-serif]" style={{ scrollBehavior: 'smooth', overflowX: 'hidden' }}>
      <ServicesDeck />
      <AboutTimeline />
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          main * { animation: none !important; transition: none !important; filter: none !important; }
        }
      `}</style>
    </main>
  );
}
