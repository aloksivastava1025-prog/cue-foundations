# Hyperframes Composition Brief: Cue Kit

## Objective
Create a short launch-style brag video for Cue Kit — the open-source, MIT-licensed React component library at kit.cuedesign.space. The video should feel like a short editorial film about web design, not a SaaS ad. Cue Kit enters as the answer to a rhetorical question, not as a pitched product.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: vertical — 1080x1920
- Duration: 24 seconds

## Source Material
- Project root: `C:\Users\Peeyush\cue-foundations`
- Primary files read: `README.md`, `app/page.tsx`, `app/globals.css`
- Product name: **Cue Kit**
- Tagline / strongest claim: *The interaction library for websites that refuse to look generic.*
- Key UI or visual moment to recreate: **NONE — user explicitly asked "text + gradient only, no images or screenshots of components".** The video is a pure typographic film on shifting gradient backgrounds. No product UI is rendered.
- Copy that must appear verbatim:
  - `The web has never looked this good.`
  - `So why does everything still feel the same?`
  - `Cue Kit.`
  - `The interaction library`
  - `for websites that refuse to look generic.`
  - `OPEN SOURCE`
  - `MIT LICENSED`
  - `47+ COMPONENTS · WEEKLY DROPS`
  - `kit.cuedesign.space`
  - `Open source · MIT · Free forever`

## Creative Direction
- Tone preset: **cinematic**
- Creative direction: editorial × experimental web-design film — Cue Kit enters as the answer, not the ad
- Interpretation: Wide silence around each line. Big display type. Two-color palette (indigo + off-white on deep black). Reveals slow-and-deliberate. Pace comes from held silence between hits, not motion density.
- Angle: Not another SaaS explainer. A short editorial film about the state of the web — everything is technically impressive, yet somehow all feels the same. Cue Kit enters at the end as the answer. Should feel like it belongs on Awwwards' own homepage, not in an ad break.
- Hook: *"The web has never looked this good."* rises on a deep-black canvas, calm and declarative.
- Outro / punchline: *"For websites that refuse to look generic."* → URL fades in → hold → fade to black. No CTA button.
- Avoid:
  - Generic SaaS language ("streamline", "10x", "workflow")
  - Abstract filler visuals (particles, waveforms, generic geometry)
  - Product screenshots, mockup frames, browser chrome
  - CTA buttons or arrows on the outro
  - Whooshes, risers, drop cues, cinematic-trailer clichés

## Visual Identity
- Background: **`#0A0A0A`** (deep black — one shade darker than the site's white canvas to feel filmic)
- Text: **`#FFFFFF`** primary · **`rgba(255, 255, 255, 0.72)`** secondary
- Accent: **`#3D50E8`** (Cue paid's electric indigo; deepened from the site's `#5C6DFF` for shader blend)
- Display font: **Inter** (500-700 weights) — the site's typography spine
- Body font: **Inter**
- Visual references from the project: only the color system and Inter typography. No component visuals per the "text + gradient only" constraint. Gradient/shader backgrounds substitute for the missing product screenshots — they become the "premium surface" that carries the film feel.

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract. 5 scenes, 24 seconds total.

Scene summary:
1. **Hook** — 3s — Line rises character-by-character on deep black: "The web has never looked this good."
2. **The turn** — 5s — Three-phrase stack, growing in weight: "So why does…" / "everything still feel" / "the same?"
3. **Reveal** — 5s — Background shifts to indigo liquid-metal shader. Big "Cue Kit." lands. Two subtitle lines follow: "The interaction library" / "for websites that refuse to look generic."
4. **Category burst** — 6s — Three quick hard-cut labels over shifting gradient backgrounds: "OPEN SOURCE" / "MIT LICENSED" / "47+ COMPONENTS · WEEKLY DROPS"
5. **Outro** — 5s — Return to calm indigo mesh. "kit.cuedesign.space" builds centered, with "Open source · MIT · Free forever" as subtitle. Fade to black.

## Audio
- Audio role: **cinematic support**
- Audio arc: fade in atmospheric bed on scene 1, hold quiet through the question in scene 2, one restrained swell + sub-hit on the "Cue Kit" landing in scene 3, settle back through scene 4, fade to silence under the URL in scene 5.
- Music: cinematic minimal ambient — dark editorial, subtle sub, no percussion or vocals. Pick from bundled brag assets (or leave silent if no match; the visuals are strong enough to carry).
- Music treatment: fade in over ~1s at start, hold at ~-6 dB during typography beats, small swell (+2 dB) at ~8-9s (Cue Kit reveal), fade out over last 0.8s.
- Music cue guidance: detect at composition via `npx hyperframes beats` or `analyze_music_cues.py`. Only 1 strong cue lock needed — the "Cue Kit" landing at ~8.5s. Beat-grid not needed (no fast sequential text).
- Audio-reactive treatment: **subtle** — the liquid-metal shader intensity in scene 3 may breathe with music RMS at the reveal moment only. No visualizers, no waveform bars.
- Audio-coupled moments:
  - Scene 3 (Cue Kit reveal, ~8.5s) — swell + sub-hit + shader breath
  - No other coupled moments — the film is silent-forward
- SFX selection guidance: at most one dry sub-hit on the Cue Kit reveal. No card-arrival SFX for the category burst — music alone carries the rhythm. No whooshes, no risers.
- SFX analysis guidance: consult `<skill-dir>/assets/sfx/sfx-analysis.md` if selecting a sub-hit; prefer low high-frequency-risk files given the polished, restrained tone.
- Exact SFX choice: Hyperframes decides file, timestamp, density, volume.
- Audio files: place chosen music in `brag-output/composition/assets/music/`.

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills (`hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`). Do not enter the hyperframes entry-point intent interview or route into its generic promo/launch-video workflow. Prefer native Hyperframes conventions over anything in /brag.

Requirements:
- Show at least one real element from the source project — the tagline "for websites that refuse to look generic", the URL kit.cuedesign.space, and the exact indigo `#3D50E8` accent all count. No UI mockups per user constraint.
- Keep all text readable in the final render — reading floor: short label ~0.8s settled, sentence ~0.3s per word.
- Duration must be within 15-25 seconds. Target 24s.
- Include the planned music/SFX layer if bundled assets support the "cinematic minimal ambient" mood; otherwise fall back to silence (do NOT force a poorly-matched track).
- Treat /brag audio notes as guidance; choose SFX after the visual animation exists.
- Music cue: aim for the "Cue Kit" landing (~8.5s) to sit within ±0.15s of a strong cue. Only 1 lock needed.
- Sequential category burst (scene 4) uses hard cuts, not beat-grid text; readability floor per label is ~1.5s settled.
- Honor the fade-to-silence outro — final 0.8s should feel like the room hushing.
- Audio-reactive workflow: extract RMS if music is present, wire only the liquid-metal shader intensity in scene 3.
- Use local assets only; no runtime CDN dependencies.
- Run `npx hyperframes check` before render — brag's single gate.
- Vertical 1080x1920 — respect safe zones; keep display type inside 90% of canvas width on the shortest side.
