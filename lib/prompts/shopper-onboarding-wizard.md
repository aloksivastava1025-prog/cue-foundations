# Shopper Onboarding Wizard — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal as a first-session personalization flow on a fashion or lifestyle e-commerce site where tailoring the catalogue upfront increases conversion.

---

# Prompt — "ShopOnboarding" 4-step shopper onboarding card (pixel-perfect)

Copy everything below the line into any AI coding agent.

---

Build a React + TypeScript component `ShopOnboarding.tsx` (React 18, no other dependencies; font Inter 400/500/600). It is a single white rounded card, 440 px wide, that walks a shopper through four steps and ends on a personalised product edit with wishlist and bag.

| step | title | subtitle | content | Continue unlocks when |
|---|---|---|---|---|
| 1 | Who are you shopping for? | Pick everyone you buy for. We’ll tune every page to them. | 2×2 cards with pixel faces: Women, Men, Kids, Home (multi-select) | at least one is picked |
| 2 | Pick the styles you love | Type a style or tap one below. The more you add, the better your edit. | tag input + "Popular right now" suggestions | 3 or more styles |
| 3 | Your size and budget | So we only show things that fit — and fit your wallet. | size chips XS–XXL, UK shoe size stepper (3–13), budget slider ₹500–₹10,000+ | a clothing size is picked |
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
__DATA__
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
__MATCH__
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
__CSS__
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
