# Expandable Share Card — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Fits collaborative SaaS tools or document/note-sharing dashboards where a compact, permission-aware share modal needs polished micro-interactions.

---

# Share Card — Toggle · Multi-Token Invite · Shared Users

Full-reference pixel-perfect spec. Any AI agent must reconstruct this exactly from this doc alone. No substitutions.

---

## 0. WHAT IT IS

A 400px light-mode card that walks through 4 progressive stages of a "Share" flow:

1. **Access pill** with globe icon + "Anyone / Everyone with link can access" + a dark toggle (public by default).
2. **Link row** below with a truncated URL and a copy icon; on copy it flashes a green checkmark for 2s.
3. When the toggle is switched off → an **Invite** section grows in via a `grid-template-rows: 0fr → 1fr` trick, with an input that accepts multiple email tokens (add on Enter/Comma, remove on Backspace when empty, or click ✕ on the token).
4. Clicking **Invite** moves the pending tokens to a **Shared users list** below (also grid-row-expanding), with each row showing avatar + name + email + red `Remove` link.

Special-cased token: typing `chloe` or `chloe@acme.com` uses `https://i.pravatar.cc/150?u=chloe`. Any other name/email generates an avatar via `ui-avatars.com` from the parsed name.

Design language: minimal white card, muted-neutral tokens, black CTA. Weight caps at 700 for the card title only.

---

## 1. HEAD

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Expandable Share Card - Fully Functional</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
```

Deps: Inter 400/500/600/700. No Tailwind, no JS libraries.

---

## 2. CSS — VERBATIM

Paste entire block:

```css
body {
  background-color: #fafafa;
  font-family: 'Inter', sans-serif;
  display: flex; justify-content: center; align-items: center;
  min-height: 100vh; margin: 0;
}

.share-card {
  width: 400px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.02);
  border: 1px solid rgba(0,0,0,0.04);
  box-sizing: border-box;
  will-change: transform;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  letter-spacing: -0.2px;
}

/* Access pill */
.access-pill {
  display: flex; align-items: center;
  background-color: #f4f4f7;
  border-radius: 14px;
  padding: 8px 12px 8px 8px;
  margin-bottom: 12px;
  transition: background-color 0.3s ease;
}
.icon-box {
  width: 40px; height: 40px;
  background-color: #ffffff;
  border-radius: 10px;
  display: flex; justify-content: center; align-items: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  color: #6b7280;
  flex-shrink: 0;
}
.icon-box svg { width: 20px; height: 20px; stroke: currentColor; }

.pill-content { flex: 1; margin-left: 12px; }
.pill-title    { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 2px; }
.pill-subtitle { font-size: 12px; color: #6b7280; }

/* Toggle */
.toggle {
  width: 44px; height: 24px;
  background-color: #111827;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
}
.toggle .thumb {
  width: 20px; height: 20px;
  background-color: #ffffff;
  border-radius: 50%;
  position: absolute; top: 2px; left: 2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.toggle.active   .thumb { transform: translateX(20px); }
.toggle.inactive         { background-color: #d1d5db; }
.toggle.inactive .thumb { transform: translateX(0); }

/* Link row */
.link-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 4px;
}
.link-text {
  font-size: 13px; color: #9ca3af;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.copy-btn {
  color: #9ca3af;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  padding: 4px; border-radius: 6px;
  transition: color 0.2s, background-color 0.2s;
}
.copy-btn:hover { color: #111827; background-color: #f3f4f6; }
.copy-btn svg   { width: 16px; height: 16px; stroke: currentColor; }

/* Invite section — grid-row expand */
.invite-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.3s ease;
}
.invite-wrapper.expanded { grid-template-rows: 1fr; opacity: 1; }
.invite-inner {
  min-height: 0;
  overflow: visible;
  padding-top: 0;
  transition: padding-top 0.4s ease;
}
.invite-wrapper.expanded .invite-inner { padding-top: 24px; }

.invite-title {
  font-size: 14px; font-weight: 600; color: #111827;
  margin-bottom: 12px;
}
.invite-input-container {
  display: flex; align-items: center; flex-wrap: wrap;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  transition: border-color 0.2s;
  min-height: 40px;
}
.invite-input-container:focus-within { border-color: #d1d5db; }

.input-icon {
  padding: 0 10px;
  color: #9ca3af;
  display: flex; align-items: center;
}
.input-icon svg { width: 16px; height: 16px; stroke: currentColor; }

.tokens-wrapper { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }

/* Token */
.user-token {
  display: flex; align-items: center;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 2px 8px 2px 2px;
  animation: tokenPop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes tokenPop {
  0%   { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1);   opacity: 1; }
}
.user-token img  { width: 20px; height: 20px; border-radius: 50%; margin-right: 6px; object-fit: cover; }
.user-token span { font-size: 13px; font-weight: 500; color: #111827; margin-right: 4px; }
.user-token svg  { width: 14px; height: 14px; stroke: #9ca3af; cursor: pointer; transition: stroke 0.2s; }
.user-token svg:hover { stroke: #ef4444; }

.invite-input {
  flex: 1; border: none; outline: none;
  font-size: 13px; color: #111827;
  padding: 8px 0 8px 4px;
  background: transparent;
  min-width: 120px;
}
.invite-input::placeholder { color: #9ca3af; }

.invite-btn {
  background-color: #111827;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px; font-weight: 600;
  cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  transition: background-color 0.2s, transform 0.1s;
  margin-left: auto;
}
.invite-btn:hover  { background-color: #000000; }
.invite-btn:active { transform: scale(0.96); }
.invite-btn svg    { width: 14px; height: 14px; fill: currentColor; }

/* Shared users list — grid-row expand */
.shared-users-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.3s ease;
}
.shared-users-wrapper.expanded { grid-template-rows: 1fr; opacity: 1; }
.shared-users-inner {
  min-height: 0; overflow: hidden;
  padding-top: 0;
  transition: padding-top 0.4s ease;
}
.shared-users-wrapper.expanded .shared-users-inner { padding-top: 16px; }

.shared-users-list { display: flex; flex-direction: column; gap: 8px; }

.shared-user-card {
  display: flex; align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  animation: cardDrop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}
@keyframes cardDrop {
  0%   { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0);     }
}
.shared-user-card img {
  width: 36px; height: 36px; border-radius: 50%;
  margin-right: 12px;
  border: 2px solid #e0f2fe;
  object-fit: cover;
}
.shared-user-info { flex: 1; overflow: hidden; }
.shared-user-name  { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 2px;
                     white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.shared-user-email { font-size: 12px; color: #6b7280;
                     white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.remove-btn {
  font-size: 13px; font-weight: 500;
  color: #ef4444;
  cursor: pointer;
  padding: 6px; border-radius: 6px;
  transition: background-color 0.2s;
  flex-shrink: 0;
}
.remove-btn:hover { background-color: #fef2f2; }
```

Key numbers:
- Card 400px, radius 16px, padding 24px, bg white
- Card shadow: `0 12px 32px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.02)`
- Access pill bg `#f4f4f7`, radius 14, padding `8 12 8 8`
- Icon box 40×40 white, radius 10
- Toggle 44×24, thumb 20×20, translateX(20px) when `active`, bg `#111827` (on) / `#d1d5db` (off)
- Copy button color `#9ca3af`, hover `#111827` on `#f3f4f6`
- Invite input 40px min-height, radius 10, padding 4
- Token pill radius 20, padding `2 8 2 2`, `tokenPop` 0.2s bounce
- Invite btn: black `#111827`, radius 8, padding `8 14`, white text
- Shared user card radius 12, padding 12, avatar 36×36 with `2px solid #e0f2fe` border
- Remove btn red `#ef4444`, hover bg `#fef2f2`
- Grid-row expand: `0fr → 1fr` with `cubic-bezier(0.22, 1, 0.36, 1)` 0.4s
- Wait for reduced-motion: not built-in, add if needed

---

## 3. HTML STRUCTURE — VERBATIM

```html
<body>
  <div class="share-card">
    <div class="card-title">Share</div>

    <!-- Access pill -->
    <div class="access-pill">
      <div class="icon-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </div>
      <div class="pill-content">
        <div class="pill-title">Anyone</div>
        <div class="pill-subtitle">Everyone with link can access</div>
      </div>
      <div class="toggle active" id="accessToggle"><div class="thumb"></div></div>
    </div>

    <!-- Link row -->
    <div class="link-row">
      <div class="link-text">acme.com/enterprise/note/453</div>
      <div class="copy-btn" id="copyBtn" title="Copy link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </div>
    </div>

    <!-- Invite section (expands when toggle is off) -->
    <div class="invite-wrapper" id="inviteWrapper">
      <div class="invite-inner">
        <div class="invite-title">Invite</div>

        <div class="invite-input-container" id="inputContainer">
          <div class="input-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8"  x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>

          <div class="tokens-wrapper" id="tokensWrapper"></div>

          <input type="text" class="invite-input" id="inviteInput"
                 placeholder="Enter email to share" autocomplete="off" />

          <button class="invite-btn" id="inviteBtn">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            Invite
          </button>
        </div>

        <!-- Shared users (expands after invite) -->
        <div class="shared-users-wrapper" id="sharedUsersWrapper">
          <div class="shared-users-inner">
            <div class="shared-users-list" id="sharedUsersList"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
```

Copy — verbatim:

| Slot                  | Text                                    |
|-----------------------|-----------------------------------------|
| Title tag             | `Expandable Share Card - Fully Functional` |
| Card title            | `Share`                                 |
| Pill title            | `Anyone`                                |
| Pill subtitle         | `Everyone with link can access`         |
| Link                  | `acme.com/enterprise/note/453`          |
| Invite section title  | `Invite`                                |
| Input placeholder     | `Enter email to share`                  |
| Invite button label   | `Invite`                                |
| Remove button label   | `Remove`                                |

---

## 4. ICONS (all inline SVG)

All are Feather-style unless noted. `viewBox 0 0 24 24`, `stroke-linecap round`, `stroke-linejoin round`.

**1. Globe (access pill)** — `stroke-width 1.5`, `stroke: currentColor`, three shapes:
```
<circle cx="12" cy="12" r="10"/>
<line x1="2" y1="12" x2="22" y2="12"/>
<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
```

**2. Copy (link row)** — `stroke-width 2`:
```
<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
```

**2b. Checkmark (copy success flash)** — `stroke #10b981`, `stroke-width 2`:
```
<polyline points="20 6 9 17 4 12"/>
```

**3. User-plus (input icon)** — `stroke-width 2`:
```
<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
<circle cx="8.5" cy="7" r="4"/>
<line x1="20" y1="8"  x2="20" y2="14"/>
<line x1="23" y1="11" x2="17" y2="11"/>
```

**4. Token close (x)** — `stroke #9ca3af` (hover `#ef4444`), no fill:
```
<line x1="18" y1="6" x2="6" y2="18"/>
<line x1="6"  y1="6" x2="18" y2="18"/>
```

**5. Paper plane (invite button)** — solid fill `currentColor`, no stroke:
```
<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
```

---

## 5. STATE + BEHAVIOUR

Two boolean UI states and two arrays:

```js
let isPublic     = true;       /* toggle */
let tokens       = [];         /* pending pills in the input */
let sharedUsers  = [];         /* rows in the list below */
```

Each token / shared user object:
```
{ id: number, email: string, name: string, avatar: string }
```

`id` = `Date.now() + Math.random()` (unique enough for the session).

### Name derivation from any input

```js
function getNameFromEmail(str) {
  if (!str.includes('@')) return str.charAt(0).toUpperCase() + str.slice(1);
  let namePart = str.split('@')[0];
  return namePart.split(/[._-]/)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}
```

Examples:
- `chloe`             → `Chloe`
- `jane.doe`          → `Jane Doe`
- `jane_doe@acme.com` → `Jane Doe`

### Avatar rule

```js
const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e0f2fe&color=0369a1&rounded=true&size=40`;
```

**Special case** — typing `chloe` or `chloe@acme.com` uses `https://i.pravatar.cc/150?u=chloe` and forces name `Chloe` / email `chloe@acme.com`.

---

## 6. INTERACTIONS

| Event                              | Result                                                                                     |
|------------------------------------|--------------------------------------------------------------------------------------------|
| Click toggle (`.active` → off)     | `isPublic = false`. Toggle becomes `.inactive`. Invite wrapper `.expanded` (grid-row 1fr). Input focused. |
| Click toggle (off → `.active`)     | `isPublic = true`. Invite wrapper collapses (grid-row 0fr). Tokens are NOT cleared.        |
| Click copy button                  | `navigator.clipboard.writeText('acme.com/enterprise/note/453')`. Icon swaps to green checkmark, restores after 2000ms. |
| Type in input + Enter or `,`       | `preventDefault`, trim value, if non-empty: add token (with Chloe special case), clear input. |
| Backspace on empty input           | Remove the last token.                                                                     |
| Click token ✕                      | Remove that token.                                                                         |
| Click Invite                       | If input has residual text, add it as a token first. Then move ALL tokens → `sharedUsers`, clear `tokens`, expand `.shared-users-wrapper`. |
| Click `Remove` on a shared user    | Remove that user from `sharedUsers`. If list becomes empty, collapse `.shared-users-wrapper`. |

Placeholder logic: input placeholder is `Enter email to share` when `tokens.length === 0`, empty string otherwise.

---

## 7. STAGGER ON SHARED USER CARDS

Each newly rendered `.shared-user-card` gets:
```js
el.style.animationDelay = `${sharedUsersList.children.length * 0.05}s`;
```

Uses the `cardDrop` keyframe: `opacity 0 + translateY(-10px)` → `opacity 1 + translateY(0)`, `cubic-bezier(0.34, 1.56, 0.64, 1)` for a slight bounce landing.

---

## 8. RESPONSIVE

- 400px fixed width. Below 400px viewport, add `max-width: calc(100vw - 32px)`.
- Multi-token input wraps naturally via `flex-wrap: wrap` — no additional breakpoints needed.
- Prefers-reduced-motion:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .invite-wrapper, .shared-users-wrapper, .toggle .thumb, .user-token, .shared-user-card, .invite-btn { transition: none !important; animation: none !important; }
  }
  ```

---

## 9. DELIVERABLE

- One HTML file matching sections 1–7 in order
- One TSX drop-in `ShareCard.tsx`. Assumes Inter loaded in target. `useState` for `isPublic`, `tokens`, `sharedUsers`. `useRef` for the input DOM node (for `.focus()` and reading `.value`) and the copy button (for icon swap). Two `useEffect`-driven timeouts: the copy-checkmark restore (2000ms) and any cleanup. All handlers keep the Chloe special case verbatim.

---

**Awwwards-tier version →** https://cuedesign.space/component/cue176
