"use client";


/**
 * Cue Foundations · Expandable Share Card
 * ────────────────────────────────────────────
 * A white 400px share card with a public/private toggle, animated grid-row invite panel, multi-email token input, and expanding shared-users list.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/expandable-share-card.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue176
 *
 * Original Cue ID: cue176
 * Category: Forms
 * ────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";

/* ============================================================================
   ShareCard — access toggle · multi-token invite · shared users list
   ----------------------------------------------------------------------------
   Toggle OFF → invite section grid-row expands with a token-pill input.
   Enter/Comma to add tokens, Backspace on empty to remove last, ✕ to remove.
   Invite button moves pending tokens → shared users list (grid-row expands).
   Chloe (typed as "chloe" or "chloe@acme.com") uses a pravatar; anyone else
   generates an avatar via ui-avatars.com from the parsed name.
   Requires Inter in the target project. Zero deps.
   ============================================================================ */

const LINK = "acme.com/enterprise/note/453";

type UserRow = { id: number; email: string; name: string; avatar: string };

const nameFromEmail = (str: string) => {
  if (!str.includes("@")) return str.charAt(0).toUpperCase() + str.slice(1);
  const part = str.split("@")[0];
  return part
    .split(/[._-]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
};

const buildToken = (val: string): UserRow => {
  const key = val.toLowerCase();
  if (key === "chloe" || key === "chloe@acme.com") {
    return {
      id: Date.now() + Math.random(),
      email: "chloe@acme.com",
      name: "Chloe",
      avatar: "https://i.pravatar.cc/150?u=chloe",
    };
  }
  const name = nameFromEmail(val);
  return {
    id: Date.now() + Math.random(),
    email: val,
    name,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e0f2fe&color=0369a1&rounded=true&size=40`,
  };
};

export default function ShareCard() {
  const [isPublic, setIsPublic]       = useState(true);
  const [tokens, setTokens]           = useState<UserRow[]>([]);
  const [sharedUsers, setSharedUsers] = useState<UserRow[]>([]);
  const [copied, setCopied]           = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
  }, []);

  const onToggle = () => {
    const next = !isPublic;
    setIsPublic(next);
    if (!next) setTimeout(() => inputRef.current?.focus(), 0);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(LINK);
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      /* clipboard denied — silent */
    }
  };

  const addToken = (val: string) => setTokens((prev) => [...prev, buildToken(val)]);
  const removeToken = (id: number) => setTokens((prev) => prev.filter((t) => t.id !== id));

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = inputRef.current?.value.trim() ?? "";
      if (val) {
        addToken(val);
        if (inputRef.current) inputRef.current.value = "";
      }
    } else if (e.key === "Backspace" && inputRef.current?.value === "") {
      setTokens((prev) => prev.slice(0, -1));
    }
  };

  const onInvite = () => {
    const val = inputRef.current?.value.trim() ?? "";
    let pending = tokens;
    if (val) {
      const t = buildToken(val);
      pending = [...pending, t];
      if (inputRef.current) inputRef.current.value = "";
    }
    if (pending.length > 0) {
      setSharedUsers((prev) => [...prev, ...pending]);
      setTokens([]);
    }
  };

  const removeSharedUser = (id: number) => setSharedUsers((prev) => prev.filter((u) => u.id !== id));

  const inviteExpanded  = !isPublic;
  const sharedExpanded  = sharedUsers.length > 0;

  return (
    <div className="sc-root">
      <style>{CSS}</style>

      <div className="share-card">
        <div className="card-title">Share</div>

        <div className="access-pill">
          <div className="icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div className="pill-content">
            <div className="pill-title">Anyone</div>
            <div className="pill-subtitle">Everyone with link can access</div>
          </div>
          <div
            className={`toggle ${isPublic ? "active" : "inactive"}`}
            onClick={onToggle}
          >
            <div className="thumb" />
          </div>
        </div>

        <div className="link-row">
          <div className="link-text">{LINK}</div>
          <div className="copy-btn" onClick={onCopy} title="Copy link">
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </div>
        </div>

        <div className={`invite-wrapper${inviteExpanded ? " expanded" : ""}`}>
          <div className="invite-inner">
            <div className="invite-title">Invite</div>

            <div className="invite-input-container">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>

              <div className="tokens-wrapper">
                {tokens.map((t) => (
                  <div key={t.id} className="user-token">
                    <img src={t.avatar} alt={t.name} />
                    <span>{t.name}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      onClick={() => removeToken(t.id)}
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                ))}
              </div>

              <input
                ref={inputRef}
                type="text"
                className="invite-input"
                placeholder={tokens.length > 0 ? "" : "Enter email to share"}
                autoComplete="off"
                onKeyDown={onKeyDown}
              />

              <button className="invite-btn" onClick={onInvite}>
                <svg viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                Invite
              </button>
            </div>

            <div className={`shared-users-wrapper${sharedExpanded ? " expanded" : ""}`}>
              <div className="shared-users-inner">
                <div className="shared-users-list">
                  {sharedUsers.map((u, i) => (
                    <div
                      key={u.id}
                      className="shared-user-card"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <img src={u.avatar} alt={u.name} />
                      <div className="shared-user-info">
                        <div className="shared-user-name">{u.name}</div>
                        <div className="shared-user-email">{u.email}</div>
                      </div>
                      <div
                        className="remove-btn"
                        onClick={() => removeSharedUser(u.id)}
                      >
                        Remove
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS = `
  .sc-root {
    background-color: #fafafa;
    font-family: 'Inter', sans-serif;
    display: flex; justify-content: center; align-items: center;
    min-height: 100vh; margin: 0;
  }
  .sc-root .share-card {
    width: 400px; background: #ffffff;
    border-radius: 16px; padding: 24px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.02);
    border: 1px solid rgba(0,0,0,0.04); box-sizing: border-box;
    will-change: transform;
  }
  .sc-root .card-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 16px; letter-spacing: -0.2px; }

  .sc-root .access-pill {
    display: flex; align-items: center;
    background-color: #f4f4f7;
    border-radius: 14px; padding: 8px 12px 8px 8px;
    margin-bottom: 12px;
    transition: background-color 0.3s ease;
  }
  .sc-root .icon-box {
    width: 40px; height: 40px; background-color: #ffffff;
    border-radius: 10px;
    display: flex; justify-content: center; align-items: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    color: #6b7280; flex-shrink: 0;
  }
  .sc-root .icon-box svg { width: 20px; height: 20px; stroke: currentColor; }
  .sc-root .pill-content { flex: 1; margin-left: 12px; }
  .sc-root .pill-title    { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 2px; }
  .sc-root .pill-subtitle { font-size: 12px; color: #6b7280; }

  .sc-root .toggle {
    width: 44px; height: 24px; background-color: #111827;
    border-radius: 12px; position: relative; cursor: pointer;
    transition: background-color 0.3s ease; flex-shrink: 0;
  }
  .sc-root .toggle .thumb {
    width: 20px; height: 20px; background-color: #ffffff; border-radius: 50%;
    position: absolute; top: 2px; left: 2px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .sc-root .toggle.active   .thumb { transform: translateX(20px); }
  .sc-root .toggle.inactive         { background-color: #d1d5db; }
  .sc-root .toggle.inactive .thumb { transform: translateX(0); }

  .sc-root .link-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 4px;
  }
  .sc-root .link-text {
    font-size: 13px; color: #9ca3af;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sc-root .copy-btn {
    color: #9ca3af; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    padding: 4px; border-radius: 6px;
    transition: color 0.2s, background-color 0.2s;
  }
  .sc-root .copy-btn:hover { color: #111827; background-color: #f3f4f6; }
  .sc-root .copy-btn svg   { width: 16px; height: 16px; stroke: currentColor; }

  .sc-root .invite-wrapper {
    display: grid; grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
  }
  .sc-root .invite-wrapper.expanded { grid-template-rows: 1fr; opacity: 1; }
  .sc-root .invite-inner {
    min-height: 0; overflow: visible;
    padding-top: 0;
    transition: padding-top 0.4s ease;
  }
  .sc-root .invite-wrapper.expanded .invite-inner { padding-top: 24px; }

  .sc-root .invite-title { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 12px; }
  .sc-root .invite-input-container {
    display: flex; align-items: center; flex-wrap: wrap;
    border: 1px solid #e5e7eb; border-radius: 10px;
    padding: 4px; background-color: #ffffff;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    transition: border-color 0.2s;
    min-height: 40px;
  }
  .sc-root .invite-input-container:focus-within { border-color: #d1d5db; }

  .sc-root .input-icon { padding: 0 10px; color: #9ca3af; display: flex; align-items: center; }
  .sc-root .input-icon svg { width: 16px; height: 16px; stroke: currentColor; }

  .sc-root .tokens-wrapper { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }

  .sc-root .user-token {
    display: flex; align-items: center;
    background-color: #ffffff;
    border: 1px solid #e5e7eb; border-radius: 20px;
    padding: 2px 8px 2px 2px;
    animation: sc-tokenPop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes sc-tokenPop {
    0%   { transform: scale(0.9); opacity: 0; }
    100% { transform: scale(1);   opacity: 1; }
  }
  .sc-root .user-token img  { width: 20px; height: 20px; border-radius: 50%; margin-right: 6px; object-fit: cover; }
  .sc-root .user-token span { font-size: 13px; font-weight: 500; color: #111827; margin-right: 4px; }
  .sc-root .user-token svg  { width: 14px; height: 14px; stroke: #9ca3af; cursor: pointer; transition: stroke 0.2s; }
  .sc-root .user-token svg:hover { stroke: #ef4444; }

  .sc-root .invite-input {
    flex: 1; border: none; outline: none;
    font-size: 13px; color: #111827;
    padding: 8px 0 8px 4px;
    background: transparent;
    min-width: 120px;
  }
  .sc-root .invite-input::placeholder { color: #9ca3af; }

  .sc-root .invite-btn {
    background-color: #111827; color: #ffffff;
    border: none; border-radius: 8px;
    padding: 8px 14px;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    transition: background-color 0.2s, transform 0.1s;
    margin-left: auto;
  }
  .sc-root .invite-btn:hover  { background-color: #000000; }
  .sc-root .invite-btn:active { transform: scale(0.96); }
  .sc-root .invite-btn svg    { width: 14px; height: 14px; fill: currentColor; }

  .sc-root .shared-users-wrapper {
    display: grid; grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
  }
  .sc-root .shared-users-wrapper.expanded { grid-template-rows: 1fr; opacity: 1; }
  .sc-root .shared-users-inner {
    min-height: 0; overflow: hidden;
    padding-top: 0;
    transition: padding-top 0.4s ease;
  }
  .sc-root .shared-users-wrapper.expanded .shared-users-inner { padding-top: 16px; }
  .sc-root .shared-users-list { display: flex; flex-direction: column; gap: 8px; }

  .sc-root .shared-user-card {
    display: flex; align-items: center;
    border: 1px solid #e5e7eb; border-radius: 12px;
    padding: 12px; background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    animation: sc-cardDrop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  }
  @keyframes sc-cardDrop {
    0%   { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0);     }
  }
  .sc-root .shared-user-card img {
    width: 36px; height: 36px; border-radius: 50%;
    margin-right: 12px;
    border: 2px solid #e0f2fe; object-fit: cover;
  }
  .sc-root .shared-user-info { flex: 1; overflow: hidden; }
  .sc-root .shared-user-name  { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 2px;
                                white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sc-root .shared-user-email { font-size: 12px; color: #6b7280;
                                white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .sc-root .remove-btn {
    font-size: 13px; font-weight: 500; color: #ef4444;
    cursor: pointer; padding: 6px; border-radius: 6px;
    transition: background-color 0.2s; flex-shrink: 0;
  }
  .sc-root .remove-btn:hover { background-color: #fef2f2; }
`;
