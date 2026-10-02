# Pixel-Perfect Shop Onboarding — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal as a first-session onboarding flow on a D2C fashion or lifestyle e-commerce site that wants to personalise the catalogue before checkout.

---

# Prompt — "ShopOnboarding" 4-step shopper onboarding card (pixel-perfect)

Copy everything below the line into any AI coding agent.

---

Build a React + TypeScript component `ShopOnboarding.tsx` (React 18, no other dependencies; font Inter 400/500/600). It is a single white rounded card, 440 px wide, that walks a shopper through four steps and ends on a personalised product edit with wishlist and bag.

| step | title | subtitle | content | Continue unlocks when |
|---|---|---|---|---|
| 1 | Who are you shopping for? | Pick everyone you buy for. We’ll tune every page to them. | 2×2 cards with pixel faces: Women, Men, Kids, Home (multi-select) | at least one is picked |
| 2 | Pick the styles you love | Type a style or tap one below. The more you add, the better your edit. | tag input + "Popular right now" suggestions | 3 or more styles |
| 3 | Your size and budget | So we only show things that fit ��� and fit your wallet. | size chips XS–XXL, UK shoe size stepper (3–13), budget slider ₹500–₹10,000+ | a clothing size is picked |
| 4 | Your edit is ready | Hand-picked from today’s drops, matched to your styles, size and budget. | summary pills + 4 matched product cards | always |

The look is **monochrome**: the step bar, the slider fill, the selected states and the primary button are all `#1f1f22`. No gradients. The only colour comes from the pixel faces, the soft icon tiles and the product art tiles.

## 1. Props

```ts
type ShopOnboardingProps = {
  products?: Product[];          // default: the 14-item catalogue below
  suggestions?: string[];        // default: Streetwear, Denim, Ethnic, Workwear, Athleisure, Pastels, Vintage, Monochrome, Boho
  defaultValues?: Partial<{ who: Audience[]; styles: string[]; size: string; shoe: number; budget: number }>;
  onCheckout?: (r: ShopResult) => void;   // the final button: { who, styles, size, shoe, budget, cart, wishlist }
  onCartChange?: (cart: string[]) => void;
  loadFont?: boolean; className?: string; style?: CSSProperties;
};
```

- **Defaults:** who = ['Women'], styles = ['Linen', 'Sneakers', 'Minimal'], size 'M', shoe 7, budget 4000.
- **Root:** `<div class="so">` (flex, centred) containing `<section class="card">`. Inject the CSS below (scoped under `.so`) in a `<style>`.

## 2. Header (every step)

- **Step bar:** `.steps` is a 4-column grid of 6 px pill buttons. Each button's `::after` is `scaleX(var(--f))` and `--f` is 1 for steps up to and including the current one. The transition is `.5s cubic-bezier(.3,.8,.3,1)`.
  - Buttons for steps you haven't reached are disabled.
  - Clicking an earlier step jumps back to it, with the slide-from-left animation.
- **Top row:** on the left, `<b>{step·25}% of your edit</b> ready ✦` (the bold part is ink, the rest muted). On the right, the bag pill: a bag icon plus the count. Every time the bag changes, the pill replays the `bump` animation (scale 1.18 at 50%).
- **Badge:** a grey pill (sparkle icon + "SMART PICKS"). On step 4 it reads "YOUR EDIT".
- **Title and subtitle:** the h1 is 25 px / 500, centred; the subtitle is 14 px, muted, max 340 px wide.

## 3. Behaviour

### Step 1 · who
- Each card toggles `aria-pressed`. A selected card gets a 2 px ink ring and a black check circle (top-right `::after`).
- The pixel face lifts on hover or when selected (`translateY(-2px) rotate(-4deg)`).
- With nothing picked, the hint reads "Pick at least one to continue." and Continue is disabled.

### Step 2 · styles (tag picker)
- **Adding:** Enter or "," adds the trimmed text. Whitespace is collapsed and the text is cut to 28 characters. Pasting "a, b," adds both. Blur also adds whatever is typed.
- **Duplicates** are checked case-insensitively, with the hint `“x” is already on your list.`
- **Cap:** at 12 styles the input is disabled with the placeholder "That’s the maximum", and all suggestions are disabled. The counter `n/12` turns bold ink.
- **Removing:**
  - × removes a chip and refocuses the input.
  - Backspace on an empty input first marks the last chip `.pending` (pink ring). A second Backspace removes it. Any other key clears the mark.
- **Hint:** below 3 styles it reads "Add N more to continue." unless a duplicate or cap message is showing.
- **Suggestions** already on the list are hidden. When none are left, it shows "All added".
- **Animation:** only a newly added chip plays `tagIn` (pop from scale .8).

### Step 3 · size & budget
- **Size:** chips toggle a single size (clicking the selected one clears it, and the hint reads "Pick a clothing size to continue.").
- **Shoe size:** the stepper shows `UK n` and is clamped to 3–13, with the − and + buttons disabled at the ends.
- **Slider:**
  - track 24 px tall; knob 20 px; fill and knob position = `calc(p% + 24·(1−p/100) px)`;
  - pointer drag with pointer capture (`.drag` scales the knob 1.12);
  - keys: arrows ±250, PageUp/PageDown ±1000, Home/End;
  - values snap to 250;
  - the label reads "Up to ₹4,000", or "No limit" at 10,000.

### Step 4 · the edit
- **Summary pills:** who + the first 4 styles + `Size M` + `UK 7` + `≤ ₹4,000` (or "Any price").
- **Cards:** `matchProducts` (below) gives up to 4 cards, in a 2-column grid. Each card has:
  - an art tile (aspect 1.7, flat SVG item on a soft background);
  - "NN% match" (`min(99, 62 + score·6)`);
  - a heart button that toggles the wishlist (pink fill);
  - the name (ellipsis), the price with an optional struck-out old price, and Add ⇄ "Added ✓" (green `#2f9a5b`).
- **Animation:** cards play `tagIn` with a 60 ms stagger **only when the step opens**. Add and heart clicks must not replay it.
- **No matches:** "Nothing under this budget yet — try raising it a little."

### Footer
- **Back:** disabled on step 1.
- **Primary button:** "Continue" on steps 1–2, "Show my edit" on step 3. On step 4 it reads "Start shopping", or "Checkout · n" once the bag has items. Clicking it there shows "Opening checkout…" (or "Opening the shop…") and calls `onCheckout`.
- **Slides:** panes slide in from the right going forward (`inR`), and from the left going back or jumping back (`inL`, via `.stage.back`).
- **Choices are kept** when moving back and forth.

### Accessibility
- Visible focus rings on every control.
- The slider is `role=slider` with valuenow and valuetext.
- `prefers-reduced-motion` turns off all animations.

## 4. Data, copy and pixel sprites (use verbatim)

```tsx
/* ---------- copy & data ---------- */
const COPY: Record<number, [string, string]> = {
  1: ['Who are you shopping for?', 'Pick everyone you buy for. We’ll tune every page to them.'],
  2: ['Pick the styles you love', 'Type a style or tap one below. The more you add, the better your edit.'],
  3: ['Your size and budget', 'So we only show things that fit — and fit your wallet.'],
  4: ['Your edit is ready', 'Hand-picked from today’s drops, matched to your styles, size and budget.'],
};
const MAXS = 12, MINS = 3, BMIN = 500, BMAX = 10000;
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SUGG = ['Streetwear', 'Denim', 'Ethnic', 'Workwear', 'Athleisure', 'Pastels', 'Vintage', 'Monochrome', 'Boho'];
const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

// 12×12 pixel sprites — one character per pixel, "." is empty
const PAL: Record<string, string> = { H: '#3b2a24', h: '#6b4a3a', S: '#f2c29b', E: '#1f1f22', M: '#c2366e', C: '#f39aa8', D: '#ee5c8e', T: '#2f5fc6', K: '#f5a524', k: '#b7761d', Y: '#ffd166',
  R: '#d9534f', r: '#a63b38', W: '#fff6e8', w: '#e8dcc6', G: '#8fc7ff', B: '#8a5a3c', g: '#2f9a5b', c: '#9a9aa2' };
const PX: Record<Audience, string[]> = {
  Women: ['...HHHHHH...', '..HHHHHHHH..', '.HHHhHHHHHH.', '.HHSSSSSSHH.', '.HSSSSSSSSH.', '.HSESSSSESH.', '.HSSSSSSSSH.', '.HSCSMMSCSH.', '.HHSSSSSSHH.', '.HH.SSSS.HH.', '...DDDDDD...', '..DDDDDDDD..'],
  Men:   ['............', '...HHHHHH...', '..HHHHHHHH..', '..HSSSHSSH..', '..SSSSSSSS..', '..SESSSSES..', '..SSSSSSSS..', '..SSSMMSSS..', '...SSSSSS...', '....SSSS....', '...TTTTTT...', '..TTTTTTTT..'],
  Kids:  ['............', '...KKKKKK...', '..KKKKKKKK..', '..kkkkkkkkkk', '..SSSSSSSS..', '.SSESSSSESS.', '.SCSSSSSSCS.', '.SSSSMMSSSS.', '..SSSSSSSS..', '....SSSS....', '...YYYYYY...', '..YYYYYYYY..'],
  Home:  ['.....RR..c..', '....RRRR.c..', '...RRRRRRc..', '..RRRRRRRR..', '.RRRRRRRRRR.', 'rrrrrrrrrrrr', '.WWWWWWWWWW.', '.WGGWWWWGGW.', '.WGGWBBWGGW.', '.WwwWBBWwwW.', '.WWWWBBWWWW.', 'gggggggggggg'],
};
const WHO: { n: Audience; d: string; c: string }[] = [
  { n: 'Women', d: 'Clothing, shoes, bags', c: '#fde3ee' },
  { n: 'Men', d: 'Shirts, denim, kicks', c: '#e3ecfd' },
  { n: 'Kids', d: 'Ages 2–12', c: '#fdf0d8' },
  { n: 'Home', d: 'Decor, linen, kitchen', c: '#e2f6e8' },
];
export const PRODUCTS: Product[] = [
  { n: 'Linen overshirt', who: 'Men', st: ['Linen', 'Minimal', 'Workwear'], a: 'shirt', c: '#d9c7a6', bg: '#f6efe2', p: 2499, was: 3299 },
  { n: 'Court sneakers', who: 'Women', st: ['Sneakers', 'Minimal', 'Athleisure', 'Monochrome'], a: 'shoe', c: '#ffffff', bg: '#e6e7ea', p: 3999 },
  { n: 'Linen wrap dress', who: 'Women', st: ['Linen', 'Boho', 'Pastels'], a: 'dress', c: '#e9a7b8', bg: '#fbe9ee', p: 3299, was: 4199 },
  { n: 'Relaxed straight jeans', who: 'Women', st: ['Denim', 'Vintage', 'Streetwear'], a: 'pants', c: '#4d6fa8', bg: '#e5ecf7', p: 2799 },
  { n: 'Boxy cotton tee', who: 'Men', st: ['Minimal', 'Streetwear', 'Monochrome'], a: 'tee', c: '#2a2a2e', bg: '#ececee', p: 999 },
  { n: 'Runner trainers', who: 'Men', st: ['Sneakers', 'Athleisure', 'Streetwear'], a: 'shoe', c: '#f5823f', bg: '#fdeee3', p: 5499, was: 6999 },
  { n: 'Chikankari kurta', who: 'Women', st: ['Ethnic', 'Pastels', 'Linen'], a: 'kurta', c: '#cfe3d2', bg: '#eef6ef', p: 2199 },
  { n: 'Canvas tote', who: 'Women', st: ['Minimal', 'Boho', 'Vintage'], a: 'bag', c: '#c7a27a', bg: '#f5ece2', p: 899 },
  { n: 'Kids rainbow tee', who: 'Kids', st: ['Pastels', 'Streetwear'], a: 'tee', c: '#8fb7ff', bg: '#e8f0ff', p: 599 },
  { n: 'Kids light-up sneakers', who: 'Kids', st: ['Sneakers', 'Athleisure'], a: 'shoe', c: '#ee5c8e', bg: '#fde6ee', p: 1799 },
  { n: 'Stoneware vase', who: 'Home', st: ['Minimal', 'Boho', 'Vintage'], a: 'vase', c: '#b9a48c', bg: '#f3eee8', p: 1299 },
  { n: 'Washed linen cushion', who: 'Home', st: ['Linen', 'Minimal', 'Pastels'], a: 'bag', c: '#a9c4b8', bg: '#ebf3ef', p: 799 },
  { n: 'Utility cargo pants', who: 'Men', st: ['Workwear', 'Streetwear'], a: 'pants', c: '#6e6a4f', bg: '#efeee6', p: 2299 },
  { n: 'Washed cap', who: 'Men', st: ['Streetwear', 'Vintage', 'Athleisure'], a: 'cap', c: '#2f5fc6', bg: '#e3ecfd', p: 699 },
];
```

Render a sprite as a `viewBox="0 0 12 12"` SVG with one `<rect x y width=1.02 height=1.02 fill>` per non-"." character, sized 36 px inside a 46 px rounded tile (`shape-rendering: crispEdges`).

Product art paths, all in a 24-unit viewBox with `fill = c`:
- shirt `M8 4 4 7l2 4 2-1v10h8V10l2 1 2-4-4-3-2 2h-4z`
- tee `M8 4 3 8l2.5 3L8 10v10h8V10l2.5 1L21 8l-5-4c-.5 2-2 3-4 3s-3.5-1-4-3z`
- shoe `M3 15c0-3 1-6 3-8l4 4c2 1 6 1 9 2 1.5.5 2 2 2 3v1H3z` + a white sole line `M3 18h18`
- pants `M7 3h10l1 18h-4l-2-11-2 11H6z`
- bag `M5 8h14l-1 12H6z` + a handle `M9 8a3 3 0 0 1 6 0` (stroke)
- dress `M9 3h6l-1 5 5 13H5l5-13z`
- cap `M4 14a8 8 0 0 1 16 0z` + a brim `M12 14h9` (stroke 2.4)
- vase `M9 3h6v3c3 2 4 5 3 9-1 4-3 6-6 6s-5-2-6-6c-1-4 0-7 3-9z`
- kurta `M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3-2 3h-4z` + a white placket `M12 6v6`

## 5. Matching (use verbatim)

```ts
/* ---------- matching ---------- */
// score: shared styles (×2) + audience match (×3); anything over budget is dropped; best 4, cheaper first on ties
export function matchProducts(list: Product[], who: Audience[], styles: string[], budget: number) {
  const want = styles.map((s) => s.toLowerCase());
  return list.map((x) => ({ x, s: x.st.filter((t) => want.includes(t.toLowerCase())).length * 2 + (who.includes(x.who) ? 3 : 0) }))
    .filter((r) => r.x.p <= budget && (who.includes(r.x.who) || !who.length))
    .sort((a, b) => b.s - a.s || a.x.p - b.x.p).slice(0, 4);
}
```

## 6. Markup (the CSS depends on these classes)

```
div.so > section.card
  div.steps[role=tablist] > button[role=tab][style=--f]×4
  div.top > span(b …% of your edit + " ready ✦") + span.cart(.bump) > svg + span count
  div.badge > svg + span · h1 · p.sub
  div.stage(.back)
    div.pane(.on)  1: div.lbl("Shopping for" span"(pick any)") · div.who > button[aria-pressed] > span.ic(bg) > svg sprite + span(b + small) · div.hint
    div.pane       2: div.lbl(label + span.cnt(.full)) · div.tags > span.tag(.pending) > text + button(×) … + input · div.hint · div.sg-l · div.suggs > button.sg…
    div.pane       3: div.lbl · div.sizes > button[aria-pressed]×6 · div.row > span.lbl + span.stepper(button − · output · button +)
                      div.budget > div.lbl(span.bud-v) · div.slider(.drag) > span.fill + span.knob[role=slider] > svg(4 dots) · div.scale · div.hint
    div.pane       4: div.edit-sum > span… · div.grid > article.prod > div.art > svg · span.match · button.heart · b · div.pr > span(price s) + button.add(.in)
  div.foot > button.btn Back + button.btn.dark (primary)
```

## 7. CSS (inject verbatim)

```css
.so, .so *{box-sizing: border-box;}
.so{display:flex;justify-content:center;width:100%;font-family:Inter,system-ui,sans-serif;color:#1f1f22;-webkit-font-smoothing:antialiased;--page: #f0f0f0; --card: #fff; --card-2: #f7f7f8; --line: #e8e8ea; --ink: #1f1f22; --text: #5d5d64; --muted: #8e8e95; --g1: #f9b94a; --g2: #f5823f; --g3: #ee5c8e; --g4: #d65be6; --chip: #e6ecfb; --chip-ink: #2a2f45; --sugg: #ececee; --sel: #1f1f22;}
.so button, .so input{font: inherit; color: inherit;}
.so .card{width: min(100%, 440px); background: linear-gradient(180deg, #fff 0, #fbfbfb 100%); border-radius: 26px; padding: 26px 26px 20px; box-shadow: 0 0 0 1px var(--line), 0 1px 2px rgba(0,0,0,.03), 0 18px 40px -30px rgba(0,0,0,.2); overflow: hidden;}
.so .steps{display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;}
.so .steps button{height: 6px; padding: 0; border: 0; border-radius: 99px; background: #ececee; position: relative; overflow: hidden; cursor: pointer;}
.so .steps button:disabled{cursor: default;}
.so .steps button::after{content: ''; position: absolute; inset: 0; border-radius: inherit; transform: scaleX(var(--f, 0)); transform-origin: left; transition: transform .5s cubic-bezier(.3,.8,.3,1);}
.so .steps button::after{background: var(--ink);}
.so .top{display: flex; justify-content: space-between; align-items: center; margin-top: 7px; font-size: 11px;}
.so .top{color: var(--muted);}
.so .top b{font-weight: 500; color: var(--ink);}
.so .cart{display: inline-flex; align-items: center; gap: 5px; height: 22px; padding: 0 8px; border-radius: 99px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line); font-size: 11px; font-weight: 500; transition: transform .2s;}
.so .cart.bump{animation: so-bump .35s cubic-bezier(.3,1.6,.5,1);}
@keyframes so-bump{50% { transform: scale(1.18); }}
.so .badge{display: flex; width: fit-content; align-items: center; gap: 6px; margin: 22px auto 0; padding: 5px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--text); background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line);}
.so h1{margin: 14px 0 8px; text-align: center; font-size: 25px; font-weight: 500; letter-spacing: -.02em;}
.so .sub{margin: 0 auto; max-width: 340px; text-align: center; font-size: 14px; line-height: 1.45; color: var(--text);}
.so .stage{position: relative; margin-top: 20px; min-height: 282px;}
.so .pane{display: none;}
.so .pane.on{display: block; animation: so-inR .35s cubic-bezier(.2,.8,.2,1);}
.so .stage.back .pane.on{animation-name: so-inL;}
@keyframes so-inR{from { opacity: 0; transform: translateX(26px); }}
@keyframes so-inL{from { opacity: 0; transform: translateX(-26px); }}
.so .lbl{display: flex; align-items: baseline; justify-content: space-between; margin: 0 0 8px; font-size: 13.5px; font-weight: 500;}
.so .lbl span{color: var(--muted); font-weight: 400; margin-left: 3px;}
.so .lbl .cnt{font-size: 12px; font-variant-numeric: tabular-nums;}
.so .lbl .cnt.full{color: var(--ink); font-weight: 500;}
.so .hint{min-height: 16px; margin-top: 6px; font-size: 11.5px; color: var(--muted);}
.so .who{display: grid; grid-template-columns: 1fr 1fr; gap: 10px;}
.so .who button{display: flex; flex-direction: column; align-items: flex-start; gap: 18px; padding: 14px; border: 0; border-radius: 16px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line); cursor: pointer; text-align: left; transition: box-shadow .15s, transform .12s, background-color .15s;}
.so .who button:hover{background: #f1f1f3;}
.so .who button:active{transform: scale(.98);}
.so .who button[aria-pressed=true]{background: #fff; box-shadow: inset 0 0 0 2px var(--sel);}
.so .who .ic{width: 46px; height: 46px; border-radius: 12px; display: grid; place-items: center;}
.so .who .ic svg{width: 36px; height: 36px; shape-rendering: crispEdges; transition: transform .25s cubic-bezier(.3,1.6,.5,1);}
.so .who button:hover .ic svg, .so .who button[aria-pressed=true] .ic svg{transform: translateY(-2px) rotate(-4deg);}
.so .who b{display: block; font-size: 14.5px; font-weight: 500;}
.so .who small{display: block; margin-top: 2px; font-size: 12px; color: var(--muted);}
.so .who .ck{position: absolute;}
.so .who button{position: relative;}
.so .who button::after{content: ''; position: absolute; top: 12px; right: 12px; width: 18px; height: 18px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px #cfcfd4; background: #fff; transition: background-color .15s, box-shadow .15s;}
.so .who button[aria-pressed=true]::after{background: var(--sel) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='m3 6.2 2 2 4-4.4' fill='none' stroke='white' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 12px no-repeat; box-shadow: none;}
.so .tags{display: flex; flex-wrap: wrap; gap: 6px; min-height: 108px; padding: 9px; border-radius: 12px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line); cursor: text; align-content: flex-start; transition: box-shadow .2s;}
.so .tags:focus-within{box-shadow: inset 0 0 0 1px #c9cdd8, 0 0 0 3px #eef1fb;}
.so .tag{display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 6px 0 10px; border-radius: 7px; background: var(--chip); color: var(--chip-ink); font-size: 12.5px; animation: so-tagIn .22s cubic-bezier(.3,1.4,.5,1) both;}
.so .tag button{width: 16px; height: 16px; padding: 0; border: 0; border-radius: 4px; background: none; display: grid; place-items: center; color: var(--chip-ink); cursor: pointer; opacity: .75;}
.so .tag button:hover{opacity: 1; background: rgba(42,47,69,.1);}
.so .tag.pending{box-shadow: 0 0 0 1.5px var(--g3);}
@keyframes so-tagIn{from { opacity: 0; transform: scale(.8); }}
.so .tags input{flex: 1; min-width: 110px; height: 28px; border: 0; outline: 0; background: none; font-size: 12.5px; padding: 0 4px;}
.so .tags input::placeholder{color: var(--muted);}
.so .sg-l{margin: 12px 0 7px; font-size: 12px; color: var(--muted);}
.so .suggs{display: flex; flex-wrap: wrap; gap: 6px;}
.so .sg{height: 28px; padding: 0 10px; border: 0; border-radius: 7px; background: var(--sugg); font-size: 12.5px; cursor: pointer; transition: background-color .15s, transform .12s;}
.so .sg:hover{background: #e2e2e6;}
.so .sg:active{transform: scale(.95);}
.so .sg:disabled{opacity: .45; cursor: default;}
.so .sizes{display: flex; flex-wrap: wrap; gap: 6px;}
.so .sizes button{min-width: 46px; height: 36px; padding: 0 10px; border: 0; border-radius: 10px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line); font-size: 13px; font-weight: 500; cursor: pointer; transition: box-shadow .15s, background-color .15s;}
.so .sizes button[aria-pressed=true]{background: var(--sel); color: #fff; box-shadow: none;}
.so .row{display: flex; align-items: center; justify-content: space-between; margin-top: 20px;}
.so .row .lbl{margin: 0;}
.so .stepper{display: inline-flex; align-items: center; height: 36px; border-radius: 10px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line);}
.so .stepper button{width: 36px; height: 36px; border: 0; background: none; font-size: 17px; cursor: pointer; border-radius: 10px;}
.so .stepper button:hover{background: #ececef;}
.so .stepper button:disabled{opacity: .35; cursor: default;}
.so .stepper output{min-width: 66px; text-align: center; font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums;}
.so .budget{margin-top: 22px;}
.so .bud-v{font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums;}
.so .slider{position: relative; height: 24px; margin-top: 10px; border-radius: 99px; background: #eeeef0; touch-action: none; cursor: pointer;}
.so .slider .fill{position: absolute; left: 0; top: 0; bottom: 0; min-width: 24px; border-radius: inherit; background: var(--ink);}
.so .slider .knob{position: absolute; top: 2px; width: 20px; height: 20px; margin-left: -22px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.25); display: grid; place-items: center; outline: 0; transition: transform .15s;}
.so .slider .knob:focus-visible{box-shadow: 0 0 0 3px rgba(31,31,34,.3), 0 1px 3px rgba(0,0,0,.25);}
.so .slider.drag .knob{transform: scale(1.12);}
.so .scale{display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px; color: var(--muted);}
.so .edit-sum{display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px;}
.so .edit-sum span{height: 22px; padding: 0 8px; border-radius: 6px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line); font-size: 11px; line-height: 22px; color: var(--text);}
.so .grid{display: grid; grid-template-columns: 1fr 1fr; gap: 10px;}
.so .prod{position: relative; border-radius: 16px; background: var(--card-2); box-shadow: inset 0 0 0 1px var(--line); padding: 8px; animation: so-tagIn .35s cubic-bezier(.3,1.3,.5,1) both;}
.so .prod .art{aspect-ratio: 1.7; border-radius: 11px; display: grid; place-items: center;}
.so .prod .art svg{width: 46%; height: 70%; transition: transform .3s cubic-bezier(.3,1.4,.5,1);}
.so .prod:hover .art svg{transform: scale(1.06) rotate(-4deg);}
.so .prod b{display: block; margin: 8px 2px 2px; font-size: 12.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
.so .prod .pr{display: flex; align-items: center; justify-content: space-between; margin: 0 2px; font-size: 12.5px;}
.so .prod .pr s{color: var(--muted); font-size: 11px; margin-left: 4px;}
.so .add{height: 26px; padding: 0 9px; border: 0; border-radius: 7px; background: var(--ink); color: #fff; font-size: 11.5px; font-weight: 500; cursor: pointer; transition: background-color .2s, transform .1s;}
.so .add:active{transform: scale(.94);}
.so .add.in{background: #2f9a5b;}
.so .heart{position: absolute; top: 14px; right: 14px; width: 28px; height: 28px; border: 0; border-radius: 50%; background: rgba(255,255,255,.9); display: grid; place-items: center; cursor: pointer; transition: transform .15s;}
.so .heart:active{transform: scale(.85);}
.so .heart svg path{transition: fill .2s, stroke .2s;}
.so .heart[aria-pressed=true] svg path{fill: #ee5c8e; stroke: #ee5c8e;}
.so .match{position: absolute; left: 14px; top: 14px; height: 20px; padding: 0 7px; border-radius: 99px; background: rgba(255,255,255,.92); font-size: 10px; font-weight: 600; line-height: 20px; color: var(--ink);}
.so .foot{display: flex; justify-content: space-between; margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--line);}
.so .btn{height: 42px; padding: 0 16px; border-radius: 12px; border: 1px solid #d9d9dd; background: #fff; font-size: 14.5px; font-weight: 500; cursor: pointer; transition: background-color .15s, transform .12s, opacity .2s;}
.so .btn:hover{background: #f6f6f7;}
.so .btn:active{transform: scale(.97);}
.so .btn.dark{background: #1f1f22; color: #fff; border-color: #1f1f22; box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #1f1f22;}
.so .btn.dark:hover{background: #333338;}
.so .btn:disabled{opacity: .35; cursor: default; transform: none;}
.so .btn[hidden]{display: none;}
.so .btn:focus-visible, .so .sg:focus-visible, .so .who button:focus-visible, .so .sizes button:focus-visible, .so .stepper button:focus-visible, .so .add:focus-visible, .so .heart:focus-visible, .so .tag button:focus-visible, .so .steps button:focus-visible{outline: 2px solid var(--ink); outline-offset: 2px;}
@media (max-width: 420px){.so .card{padding: 22px 18px 18px; border-radius: 22px;}
.so h1{font-size: 22px;}}
@media (prefers-reduced-motion: reduce){.so, .so *, .so *::before, .so *::after{animation: none !important; transition: none !important;}}
```

## 8. Acceptance checks

- **Step 1:** unpicking Women leaves nothing picked, so Continue is disabled and the hint shows. Picking Men + Home enables it.
- **Step 2:**
  - removing 2 of the 3 default chips disables Continue ("Add 2 more to continue.");
  - typing "Workwear, Streetwear," adds both, and tapping "Vintage" adds it;
  - "linen" shows the duplicate hint;
  - Backspace twice on an empty input removes the last chip;
  - filling to 12 disables the input and the suggestions.
- **Step 3:**
  - unselecting M disables "Show my edit";
  - + + makes UK 9;
  - dragging the slider to 30% shows "Up to ₹3,250", and → makes it "Up to ₹3,500".
- **Step 4:**
  - no card costs more than the budget;
  - adding 2 makes the bag pill read 2 and the button "Checkout · 2";
  - a heart fills pink;
  - clicking Add does not re-animate the other cards.
- **Jumping:** step-bar segment 2 jumps back with the styles kept, and Continue twice returns to step 4 with the bag still at 2.
- **Width and errors:** no horizontal overflow at 375 px wide, and no console errors.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue207
