/**
 * Cue Foundations · Minimal AI Dev Workspace
 * ────────────────────────────────────────────
 * A clean, off-white developer copilot workspace with sidebar navigation, chat history, and a code-aware chat input box.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/minimal-ai-dev-workspace.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue102
 *
 * Original Cue ID: cue102
 * Category: Sections & Layouts
 * ────────────────────────────────────────────
 */

/**
 * DevAgent Workspace — 5-View SPA (Chat with Reasoning + Repos/Pipelines/History/Docs)
 *
 * Zero external deps. Scoped `dw-*` classes.
 * Component takes over the viewport (position: fixed). Treat as a route.
 *
 * Global head (fonts):
 *   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@500;600&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
 *
 * Usage:
 *   <DevAgentWorkspace />
 *
 *   <DevAgentWorkspace
 *     initialView="view-copilot"
 *     orgName="Antigravity Labs"
 *     mockResponder={(prompt) => `<p>Custom response for: ${prompt}</p>`}
 *     onLogout={() => auth.signOut()}
 *   />
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

type ViewId =
  | 'view-copilot'
  | 'view-repositories'
  | 'view-pipelines'
  | 'view-history'
  | 'view-documentation';

interface DevAgentWorkspaceProps {
  initialView?: ViewId;
  orgName?: string;
  mockResponder?: (prompt: string) => string;
  onLogout?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  reasoningState?: 'thinking' | 'thinking-more' | 'done';
  finalHTML?: string;
}

const CONTEXT_PILLS = ['GitHub', 'Jira', 'AWS', 'Vercel'];

const WORKFLOWS: Array<{ title: string; desc: string; prompt: string; icon: React.ReactNode }> = [
  {
    title: 'Review Pull Request',
    desc: 'Analyze code changes for bugs, performance issues, and standards.',
    prompt:
      'Can you help me review the latest pull request? Please check for performance bottlenecks and standard compliance.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: 'Generate Unit Tests',
    desc: 'Automatically write comprehensive test suites for your components.',
    prompt:
      'Generate a comprehensive unit test suite using Jest and React Testing Library for the main navigation component.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: 'Debug Stack Trace',
    desc: 'Paste an error log to find the root cause and get a fix instantly.',
    prompt:
      'I have a memory leak in my Node.js application. Where should I start looking to debug the stack trace?',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
];

function escapeHTML(s: string) {
  return s.replace(/[&<>'"]/g, (t) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t)
  );
}

function defaultMockResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (/review|pull request/.test(p)) {
    return `
      <p>I've reviewed the latest changes in the pull request. The logic looks sound, but there is a potential performance bottleneck in the loop.</p>
      <p>Instead of mapping over the array multiple times, you can combine the operations:</p>
      <pre><code>// Recommended Refactor
const processedData = rawData.reduce((acc, item) =&gt; {
    if (item.isValid) {
        acc.push(transform(item));
    }
    return acc;
}, []);</code></pre>
      <p>I also verified that this complies with our internal styling guidelines.</p>
    `;
  }
  if (/test|jest/.test(p)) {
    return `
      <p>Sure, here is a comprehensive test suite for the component using <code>Jest</code> and <code>React Testing Library</code>.</p>
      <pre><code>import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from './Navigation';

describe('Navigation Component', () =&gt; {
  it('renders all links correctly', () =&gt; {
    render(&lt;Navigation /&gt;);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});</code></pre>
    `;
  }
  return `
    <p>I have analyzed your request based on the current repository context.</p>
    <p>To implement this effectively, we should ensure that the state management is decoupled from the UI components. Here is a basic structural recommendation:</p>
    <pre><code>export class StateManager {
  constructor(initialState) {
    this.state = initialState;
    this.listeners = new Set();
  }

  update(newState) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(fn =&gt; fn(this.state));
  }
}</code></pre>
    <p>Let me know if you want me to expand on any specific part of this implementation!</p>
  `;
}

export default function DevAgentWorkspace({
  initialView = 'view-copilot',
  orgName = 'Antigravity Labs',
  mockResponder = defaultMockResponse,
  onLogout,
}: DevAgentWorkspaceProps) {
  const [activeView, setActiveView] = useState<ViewId>(initialView);
  const [chatActive, setChatActive] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [focused, setFocused] = useState(false);
  const [selectedPills, setSelectedPills] = useState<Set<string>>(new Set());

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollAreaRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, []);

  const autosize = useCallback(() => {
    const t = textareaRef.current;
    if (!t) return;
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 'px';
  }, []);

  useEffect(() => {
    autosize();
  }, [input, autosize]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const simulateAI = useCallback(
    (prompt: string) => {
      const id = 'ai-' + Date.now();
      setMessages((m) => [...m, { id, role: 'ai', text: prompt, reasoningState: 'thinking' }]);

      window.setTimeout(() => {
        setMessages((m) =>
          m.map((msg) => (msg.id === id ? { ...msg, reasoningState: 'thinking-more' } : msg))
        );
      }, 1000);

      window.setTimeout(() => {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === id
              ? { ...msg, reasoningState: 'done', finalHTML: mockResponder(prompt) }
              : msg
          )
        );
      }, 2500);
    },
    [mockResponder]
  );

  const submit = useCallback(
    (raw?: string) => {
      const text = (raw ?? input).trim();
      if (!text) return;
      setChatActive(true);
      setMessages((m) => [...m, { id: 'u-' + Date.now(), role: 'user', text }]);
      setInput('');
      simulateAI(text);
    },
    [input, simulateAI]
  );

  const startNewChat = () => {
    setActiveView('view-copilot');
    setChatActive(false);
    setMessages([]);
    setInput('');
  };

  const navRoot: Array<{ id: ViewId; label: string; icon: React.ReactNode }> = [
    {
      id: 'view-copilot',
      label: 'Code Copilot',
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: 'view-repositories',
      label: 'Repositories',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className={`dw-scope ${chatActive ? 'dw-chat-active' : ''}`}>
        <aside className="dw-sidebar">
          <div className="dw-sidebar-header">
            <div className="dw-logo-box">AG</div>
            <div className="dw-header-actions">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </div>
          </div>

          <div className="dw-company-name">
            {orgName}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <button className="dw-btn-create" onClick={startNewChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Chat
          </button>

          <nav className="dw-nav-list">
            {navRoot.map((n) => (
              <a
                key={n.id}
                href="#"
                className={`dw-nav-item ${activeView === n.id ? 'dw-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView(n.id);
                }}
              >
                {n.icon}
                {n.label}
              </a>
            ))}

            <div className="dw-nav-group">
              <a
                href="#"
                className={`dw-nav-item ${activeView === 'view-pipelines' ? 'dw-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('view-pipelines');
                }}
              >
                <svg viewBox="0 0 24 24">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Pipelines
              </a>
              <div className="dw-nav-sublist">
                {['CI/CD Configs', 'Deployments', 'Test Suites'].map((label) => (
                  <a
                    key={label}
                    href="#"
                    className="dw-nav-subitem"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveView('view-pipelines');
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="#"
              className={`dw-nav-item ${activeView === 'view-history' ? 'dw-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('view-history');
              }}
            >
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Build History
            </a>
            <a
              href="#"
              className={`dw-nav-item ${activeView === 'view-documentation' ? 'dw-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('view-documentation');
              }}
            >
              <svg viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Documentation
            </a>
          </nav>

          <div className="dw-sidebar-footer">
            <a
              href="#"
              className="dw-nav-item dw-text-danger"
              onClick={(e) => {
                e.preventDefault();
                onLogout?.();
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </a>
          </div>
        </aside>

        <main className="dw-main-content">
          {/* VIEW: COPILOT */}
          <div className={`dw-app-view ${activeView === 'view-copilot' ? 'dw-active-view' : ''}`}>
            <div ref={scrollAreaRef} className="dw-scrollable-area">
              {!chatActive && (
                <>
                  <div className="dw-landing-view dw-center-container">
                    <svg className="dw-main-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <line x1="12" y1="2" x2="12" y2="22" />
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
                    </svg>
                    <h1 className="dw-title">Welcome to DevAgent</h1>
                    <p className="dw-subtitle">Accelerate your coding, debugging, and deployments.</p>
                  </div>

                  <div className="dw-context-pills">
                    {CONTEXT_PILLS.map((label) => {
                      const on = selectedPills.has(label);
                      return (
                        <span
                          key={label}
                          className={`dw-pill-dashed ${on ? 'dw-selected' : ''}`}
                          onClick={() =>
                            setSelectedPills((prev) => {
                              const next = new Set(prev);
                              if (next.has(label)) next.delete(label);
                              else next.add(label);
                              return next;
                            })
                          }
                        >
                          {label}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <line x1="5" y1="12" x2="19" y2="12" />
                            {!on && <line x1="12" y1="5" x2="12" y2="19" />}
                          </svg>
                        </span>
                      );
                    })}
                  </div>

                  <div className="dw-workflows-section">
                    <div className="dw-workflows-header">
                      <svg viewBox="0 0 24 24">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      Recommended Workflows
                    </div>
                    <div className="dw-workflow-grid">
                      {WORKFLOWS.map((w) => (
                        <div
                          key={w.title}
                          className="dw-workflow-card"
                          onClick={() => submit(w.prompt)}
                        >
                          <div className="dw-card-icon">{w.icon}</div>
                          <div>
                            <h3>{w.title}</h3>
                            <p>{w.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {chatActive && (
                <div className="dw-chat-history-view">
                  {messages.map((m) => (
                    <ChatBubble key={m.id} msg={m} />
                  ))}
                </div>
              )}
            </div>

            <div className="dw-chat-input-wrapper">
              <div className="dw-center-container">
                <div className={`dw-chat-box ${focused ? 'dw-focused' : ''}`}>
                  <div className="dw-chat-top-bar">
                    <button className="dw-top-btn" type="button">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                      Select Repo
                    </button>
                    <button className="dw-top-btn" type="button">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      Set Branch / PR
                    </button>
                    <div className="dw-model-select">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                      </svg>
                      Claude 3.5 Sonnet
                    </div>
                  </div>
                  <textarea
                    ref={textareaRef}
                    className="dw-textarea"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        submit();
                      }
                    }}
                    placeholder="Ask DevAgent to generate code, review PRs, or debug..."
                    spellCheck={false}
                    rows={1}
                  />
                  <div className="dw-chat-bottom-bar">
                    <button className="dw-pill-btn dw-btn-gray" type="button">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                      Attach files
                    </button>
                    <button className="dw-pill-btn dw-btn-blue" type="button">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      Web Search
                    </button>
                    <button
                      className={`dw-btn-submit ${input.trim() ? 'dw-active' : ''}`}
                      type="button"
                      onClick={() => submit()}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VIEW: REPOSITORIES */}
          <div className={`dw-app-view ${activeView === 'view-repositories' ? 'dw-active-view' : ''}`}>
            <div className="dw-view-header">
              <h2 className="dw-view-title">Repositories</h2>
              <div className="dw-view-actions">
                <div className="dw-search-bar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input type="text" placeholder="Search repositories..." />
                </div>
                <button className="dw-btn-create dw-btn-create-inline">New Repository</button>
              </div>
            </div>
            <div className="dw-view-content">
              <div className="dw-repo-grid">
                {[
                  { name: 'antigravity-core', desc: 'Core agent engine for processing reasoning pipelines and tool orchestration.', lang: 'ts', langLabel: 'TypeScript', updated: '2h ago' },
                  { name: 'motion-ui-kit', desc: 'Premium component library for Antigravity web interfaces.', lang: 'ts', langLabel: 'TypeScript', updated: '5h ago' },
                  { name: 'data-pipeline-rs', desc: 'High-performance Rust microservice for telemetry ingestion.', lang: 'rs', langLabel: 'Rust', updated: '1d ago' },
                  { name: 'python-eval-scripts', desc: 'Benchmarking and evaluation scripts for the LLM outputs.', lang: 'py', langLabel: 'Python', updated: '3d ago' },
                ].map((r) => (
                  <div key={r.name} className="dw-repo-card">
                    <div className="dw-repo-title">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                      {r.name}
                    </div>
                    <div className="dw-repo-desc">{r.desc}</div>
                    <div className="dw-repo-meta">
                      <div className="dw-lang-pill">
                        <span className={`dw-lang-dot dw-lang-${r.lang}`} /> {r.langLabel}
                      </div>
                      <div>Updated {r.updated}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* VIEW: PIPELINES */}
          <div className={`dw-app-view ${activeView === 'view-pipelines' ? 'dw-active-view' : ''}`}>
            <div className="dw-view-header">
              <h2 className="dw-view-title">Active Pipelines</h2>
              <div className="dw-view-actions">
                <button className="dw-pill-btn dw-btn-gray">Filter: All Branches</button>
              </div>
            </div>
            <div className="dw-view-content">
              <div className="dw-pipeline-list">
                <PipelineRow
                  status="running"
                  name="Deploy to Production"
                  branch="main"
                  hash="#a8c4f92"
                  msg="feat: add E2E routing views"
                  statusLabel="Running"
                  duration="01m 24s"
                />
                <PipelineRow
                  status="success"
                  name="E2E Integration Tests"
                  branch="feature/chat-ux"
                  hash="#b391d1a"
                  msg="fix: textarea resize bug"
                  statusLabel="Success"
                  duration="04m 12s"
                />
                <PipelineRow
                  status="failed"
                  name="Build Rust Microservice"
                  branch="main"
                  hash="#9c231ff"
                  msg="chore: update dependencies"
                  statusLabel="Failed"
                  duration="00m 45s"
                />
              </div>
            </div>
          </div>

          {/* VIEW: HISTORY */}
          <div className={`dw-app-view ${activeView === 'view-history' ? 'dw-active-view' : ''}`}>
            <div className="dw-view-header">
              <h2 className="dw-view-title">Build History</h2>
              <div className="dw-view-actions">
                <div className="dw-search-bar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input type="text" placeholder="Search logs..." />
                </div>
              </div>
            </div>
            <div className="dw-view-content">
              <div className="dw-history-table-wrapper">
                <table className="dw-history-table">
                  <thead>
                    <tr>
                      <th>Build ID</th>
                      <th>Repository</th>
                      <th>Trigger</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: '#BLD-8912', repo: 'antigravity-core', trigger: <>Commit <span className="dw-muted">#a8c4f92</span></>, ok: true, date: 'Aug 29, 14:32' },
                      { id: '#BLD-8911', repo: 'motion-ui-kit', trigger: 'Manual Trigger', ok: true, date: 'Aug 29, 11:15' },
                      { id: '#BLD-8910', repo: 'data-pipeline-rs', trigger: <>Commit <span className="dw-muted">#9c231ff</span></>, ok: false, date: 'Aug 28, 09:45' },
                      { id: '#BLD-8909', repo: 'antigravity-core', trigger: 'Scheduled', ok: true, date: 'Aug 28, 00:00' },
                    ].map((r) => (
                      <tr key={r.id}>
                        <td className="dw-mono">{r.id}</td>
                        <td>{r.repo}</td>
                        <td>{r.trigger}</td>
                        <td>
                          <span className={`dw-badge ${r.ok ? 'dw-badge-success' : 'dw-badge-failed'}`}>
                            {r.ok ? 'Success' : 'Failed'}
                          </span>
                        </td>
                        <td>{r.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* VIEW: DOCUMENTATION */}
          <div className={`dw-app-view ${activeView === 'view-documentation' ? 'dw-active-view' : ''}`}>
            <div className="dw-view-header">
              <h2 className="dw-view-title">Documentation Library</h2>
              <div className="dw-view-actions">
                <button className="dw-pill-btn dw-btn-blue">Upload Doc</button>
              </div>
            </div>
            <div className="dw-view-content">
              <div className="dw-doc-grid">
                {[
                  { label: 'API References', count: 12 },
                  { label: 'Component Guidelines', count: 24 },
                  { label: 'Deployment Architecture', count: 8 },
                  { label: 'Security Protocols', count: 3 },
                ].map((d) => (
                  <div key={d.label} className="dw-doc-folder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <div>
                      <span>{d.label}</span>
                      <div className="dw-doc-meta">{d.count} Articles</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function ChatBubble({ msg }: { msg: ChatMessage }) {
  if (msg.role === 'user') {
    return (
      <div className="dw-chat-message dw-user">
        <div className="dw-message-content" dangerouslySetInnerHTML={{ __html: escapeHTML(msg.text) }} />
      </div>
    );
  }
  const isDone = msg.reasoningState === 'done';
  const thoughtHTML =
    msg.reasoningState === 'thinking'
      ? 'Analyzing context from Repositories...<br>Identifying intent...'
      : 'Analyzing context from Repositories...<br>Identifying intent...<br>Generating optimal code structure...<br>Formatting response.';

  return (
    <div className="dw-chat-message dw-ai">
      <div className="dw-message-avatar dw-ai-avatar">AG</div>
      <div className="dw-message-content">
        <div className="dw-reasoning-block">
          <details open={!isDone}>
            <summary>
              {isDone ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg className="dw-thinking-pulse" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                </svg>
              )}
              <span>{isDone ? 'Thought Process (2.5s)' : 'Reasoning...'}</span>
            </summary>
            <div className="dw-thought-content" dangerouslySetInnerHTML={{ __html: thoughtHTML }} />
          </details>
        </div>
        {isDone && msg.finalHTML && (
          <div className="dw-final-response" dangerouslySetInnerHTML={{ __html: msg.finalHTML }} />
        )}
      </div>
    </div>
  );
}

function PipelineRow({
  status,
  name,
  branch,
  hash,
  msg,
  statusLabel,
  duration,
}: {
  status: 'running' | 'success' | 'failed';
  name: string;
  branch: string;
  hash: string;
  msg: string;
  statusLabel: string;
  duration: string;
}) {
  const iconMap = {
    running: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
      </svg>
    ),
    success: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    failed: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  };
  return (
    <div className="dw-pipeline-item">
      <div className="dw-pipe-left">
        <div className={`dw-status-icon dw-status-${status}`}>{iconMap[status]}</div>
        <div className="dw-pipe-details">
          <h4>{name}</h4>
          <p>
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="6" y1="3" x2="6" y2="15" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="M18 9a9 9 0 0 1-9 9" />
              </svg>
              {branch}
            </span>
            <span>{hash}</span>
            <span>{msg}</span>
          </p>
        </div>
      </div>
      <div className="dw-pipe-right">
        <div className="dw-pipe-status">{statusLabel}</div>
        <div>{duration}</div>
      </div>
    </div>
  );
}

const CSS = `
.dw-scope {
  --sidebar-bg: #F8F8F6;
  --main-bg: #FFFFFF;
  --pure-white: #FFFFFF;
  --top-bar-bg: #F8F8F6;
  --text-dark: #1F1F1F;
  --text-muted: #737373;
  --text-light: #A3A3A3;
  --border-light: #EBEBEB;
  --border-dashed: #D4D4D4;
  --hover-bg: #EAEAEA;
  --active-nav-bg: #EAEAEA;
  --accent-blue-bg: #EFF6FF;
  --accent-blue-text: #2563EB;
  position: fixed;
  inset: 0;
  display: flex;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: var(--text-dark);
  background: var(--main-bg);
  -webkit-font-smoothing: antialiased;
}
.dw-scope, .dw-scope * { box-sizing: border-box; margin: 0; padding: 0; }

.dw-sidebar {
  width: 260px;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  flex-shrink: 0;
  z-index: 10;
}
.dw-sidebar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.dw-logo-box { background: #555; color: #fff; font-size: 0.75rem; font-weight: 600; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 4px; letter-spacing: 0.5px; }
.dw-header-actions { display: flex; gap: 8px; color: var(--text-light); }
.dw-header-actions svg { width: 16px; height: 16px; cursor: pointer; transition: color 0.2s; }
.dw-header-actions svg:hover { color: var(--text-dark); }

.dw-company-name { font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; cursor: pointer; }
.dw-company-name svg { width: 14px; height: 14px; color: var(--text-muted); }

.dw-btn-create {
  background: #2D2D2D; color: #fff; border: none; border-radius: 6px;
  padding: 8px; width: 100%; font-size: 0.8rem; font-weight: 500; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 24px;
  transition: background 0.2s; font-family: inherit;
}
.dw-btn-create:hover { background: #1a1a1a; }
.dw-btn-create-inline { width: auto; padding: 8px 16px; margin-bottom: 0; }

.dw-nav-list { display: flex; flex-direction: column; gap: 4px; }
.dw-nav-item {
  display: flex; align-items: center; gap: 10px; padding: 6px 12px; border-radius: 6px;
  color: var(--text-muted); text-decoration: none;
  font-size: 0.8rem; font-weight: 500;
  transition: all 0.2s ease; cursor: pointer;
}
.dw-nav-item svg { width: 16px; height: 16px; stroke-width: 1.5; fill: none; stroke: currentColor; }
.dw-nav-item:hover, .dw-nav-subitem:hover { background: var(--hover-bg); color: var(--text-dark); }
.dw-nav-item.dw-active, .dw-nav-subitem.dw-active { background: var(--active-nav-bg); color: var(--text-dark); }

.dw-nav-group { display: flex; flex-direction: column; margin: 4px 0; }
.dw-nav-sublist {
  display: flex; flex-direction: column;
  margin-left: 20px; padding-left: 8px;
  border-left: 1px solid var(--border-light);
  margin-top: 4px; gap: 4px;
}
.dw-nav-subitem {
  text-decoration: none; color: #888;
  font-size: 0.75rem; padding: 6px 8px; border-radius: 4px;
  transition: all 0.2s; cursor: pointer;
}

.dw-sidebar-footer { margin-top: auto; padding-top: 16px; border-top: 1px dashed var(--border-light); }
.dw-text-danger { color: #EF4444 !important; }
.dw-text-danger:hover { background: #FEF2F2 !important; }

.dw-main-content { flex-grow: 1; display: flex; flex-direction: column; background: var(--main-bg); height: 100vh; position: relative; }
.dw-app-view { display: none; flex-direction: column; width: 100%; height: 100%; }
.dw-app-view.dw-active-view { display: flex; }

.dw-scrollable-area {
  flex-grow: 1; overflow-y: auto; padding: 80px 40px 20px;
  display: flex; flex-direction: column; align-items: center;
  scroll-behavior: smooth;
}
.dw-chat-input-wrapper { padding: 0 40px 40px; display: flex; justify-content: center; background: var(--main-bg); flex-shrink: 0; width: 100%; }
.dw-center-container { width: 100%; max-width: 720px; display: flex; flex-direction: column; margin: 0 auto; }

.dw-landing-view { align-items: center; text-align: center; margin-bottom: 24px; animation: dw-fadeIn 0.4s ease; }
.dw-main-icon { width: 28px; height: 28px; margin-bottom: 24px; color: var(--text-dark); }
.dw-title { font-family: 'Playfair Display', serif; font-size: 1.75rem; font-weight: 500; margin-bottom: 8px; letter-spacing: -0.5px; }
.dw-subtitle { color: var(--text-muted); font-size: 0.85rem; font-weight: 400; margin-bottom: 24px; }

.dw-chat-history-view { display: flex; flex-direction: column; padding-bottom: 20px; width: 100%; max-width: 720px; }
.dw-scope.dw-chat-active .dw-scrollable-area { padding-top: 40px; }

.dw-chat-message { display: flex; gap: 16px; margin-bottom: 32px; animation: dw-slideUp 0.3s ease forwards; opacity: 0; transform: translateY(10px); }
.dw-chat-message.dw-user { justify-content: flex-end; }
.dw-message-avatar { width: 28px; height: 28px; border-radius: 4px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 600; }
.dw-ai-avatar { background: #555; color: #fff; }
.dw-message-content { max-width: 85%; font-size: 0.9rem; line-height: 1.6; color: var(--text-dark); }
.dw-user .dw-message-content { background: var(--sidebar-bg); padding: 12px 16px; border-radius: 12px; border-bottom-right-radius: 4px; }
.dw-message-content p { margin-bottom: 12px; }
.dw-message-content p:last-child { margin-bottom: 0; }
.dw-message-content pre { background: var(--sidebar-bg); padding: 12px; border-radius: 8px; font-family: 'Fira Code', monospace; font-size: 0.8rem; overflow-x: auto; margin-bottom: 12px; border: 1px solid var(--border-light); }
.dw-message-content code { font-family: 'Fira Code', monospace; font-size: 0.8rem; background: var(--sidebar-bg); padding: 2px 4px; border-radius: 4px; }

.dw-reasoning-block { margin-bottom: 16px; border-left: 2px solid var(--border-dashed); padding-left: 12px; color: var(--text-muted); font-size: 0.8rem; }
.dw-reasoning-block details summary { cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; outline: none; list-style: none; }
.dw-reasoning-block details summary::-webkit-details-marker { display: none; }
.dw-reasoning-block details summary::marker { display: none; }
.dw-thinking-pulse { animation: dw-pulse 1.5s infinite; color: var(--text-dark); }
.dw-thought-content { margin-top: 8px; font-family: 'Fira Code', monospace; font-size: 0.75rem; opacity: 0.8; }
.dw-final-response { animation: dw-fadeIn 0.5s ease; }

@keyframes dw-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
@keyframes dw-slideUp { to { opacity: 1; transform: translateY(0); } }
@keyframes dw-fadeIn { from { opacity: 0; } to { opacity: 1; } }

.dw-chat-box {
  border: 1px solid var(--border-light); border-radius: 12px;
  background: var(--pure-white);
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  display: flex; flex-direction: column;
  transition: border-color 0.3s, box-shadow 0.3s;
  overflow: hidden; width: 100%;
}
.dw-chat-box.dw-focused { border-color: #D1D1D1; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }

.dw-chat-top-bar { display: flex; align-items: center; gap: 16px; padding: 10px 16px; background: var(--top-bar-bg); border-bottom: 1px solid var(--border-light); }
.dw-top-btn { background: none; border: none; display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: color 0.2s; font-family: inherit; }
.dw-top-btn svg { width: 14px; height: 14px; }
.dw-top-btn:hover { color: var(--text-dark); }
.dw-model-select { margin-left: auto; display: flex; align-items: center; gap: 6px; color: var(--text-dark); font-size: 0.75rem; font-weight: 500; cursor: pointer; }
.dw-model-select svg { width: 14px; height: 14px; color: #D97757; fill: currentColor; }

.dw-textarea {
  width: 100%; border: none; resize: none; outline: none;
  padding: 16px; min-height: 80px; max-height: 250px;
  font-size: 0.85rem; font-family: 'Inter', sans-serif; color: var(--text-dark);
  line-height: 1.5; background: var(--pure-white);
  overflow-y: hidden;
}
.dw-textarea::placeholder { color: #AFAFAF; font-weight: 400; }

.dw-chat-bottom-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: var(--pure-white); }
.dw-pill-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 99px; border: none;
  font-size: 0.75rem; font-weight: 500; cursor: pointer;
  transition: all 0.2s ease; font-family: inherit;
}
.dw-pill-btn svg { width: 14px; height: 14px; }
.dw-btn-gray { background: var(--top-bar-bg); color: var(--text-dark); border: 1px solid var(--border-light); }
.dw-btn-gray:hover { background: #EAEAEA; }
.dw-btn-blue { background: var(--accent-blue-bg); color: var(--accent-blue-text); }
.dw-btn-blue:hover { background: #DBEAFE; }

.dw-btn-submit {
  margin-left: auto; width: 32px; height: 32px; border-radius: 8px;
  background: #EBEBEB; color: #A3A3A3; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: not-allowed; transition: all 0.2s;
}
.dw-btn-submit.dw-active { background: #2D2D2D; color: #fff; cursor: pointer; }
.dw-btn-submit.dw-active:hover { background: #1a1a1a; }
.dw-btn-submit svg { width: 16px; height: 16px; }

.dw-context-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 48px; width: 100%; max-width: 720px; justify-content: center; }
.dw-pill-dashed {
  padding: 6px 12px; font-size: 0.75rem; font-weight: 500;
  color: var(--text-muted); border: 1px dashed var(--border-dashed);
  border-radius: 6px; background: var(--pure-white); cursor: pointer;
  transition: all 0.2s; display: inline-flex; align-items: center; gap: 4px;
}
.dw-pill-dashed:hover { color: var(--text-dark); border-color: #A3A3A3; background: var(--main-bg); }
.dw-pill-dashed.dw-selected { border-color: var(--text-dark); border-style: solid; color: var(--text-dark); background: var(--sidebar-bg); }

.dw-workflows-section { width: 100%; max-width: 720px; }
.dw-workflows-header { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 600; color: var(--text-dark); margin-bottom: 16px; }
.dw-workflows-header svg { width: 14px; height: 14px; fill: currentColor; }
.dw-workflow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.dw-workflow-card {
  background: var(--pure-white); border: 1px solid var(--border-light);
  border-radius: 10px; padding: 16px;
  cursor: pointer; transition: all 0.2s ease;
  display: flex; flex-direction: column; gap: 10px;
}
.dw-workflow-card:hover { border-color: #D1D1D1; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transform: translateY(-2px); }
.dw-card-icon { width: 28px; height: 28px; border-radius: 6px; background: var(--top-bar-bg); display: flex; align-items: center; justify-content: center; color: var(--text-dark); }
.dw-card-icon svg { width: 14px; height: 14px; }
.dw-workflow-card h3 { font-size: 0.8rem; font-weight: 600; color: var(--text-dark); }
.dw-workflow-card p { font-size: 0.7rem; color: var(--text-muted); line-height: 1.4; }

.dw-view-header { padding: 32px 40px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); background: var(--main-bg); flex-shrink: 0; }
.dw-view-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 500; color: var(--text-dark); }
.dw-view-actions { display: flex; gap: 12px; align-items: center; }
.dw-search-bar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--sidebar-bg); border: 1px solid var(--border-light); border-radius: 6px; width: 240px; }
.dw-search-bar svg { width: 14px; height: 14px; color: var(--text-muted); }
.dw-search-bar input { border: none; background: transparent; outline: none; font-size: 0.75rem; width: 100%; color: var(--text-dark); font-family: inherit; }
.dw-view-content { padding: 24px 40px; overflow-y: auto; flex-grow: 1; }

.dw-repo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.dw-repo-card {
  background: var(--pure-white); border: 1px solid var(--border-light);
  border-radius: 10px; padding: 20px;
  display: flex; flex-direction: column; gap: 12px;
  transition: 0.2s; cursor: pointer;
}
.dw-repo-card:hover { border-color: #D1D1D1; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transform: translateY(-2px); }
.dw-repo-title { font-size: 0.9rem; font-weight: 600; color: var(--text-dark); display: flex; align-items: center; gap: 8px; }
.dw-repo-title svg { width: 14px; height: 14px; color: var(--text-muted); }
.dw-repo-desc { font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; }
.dw-repo-meta { display: flex; align-items: center; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); margin-top: auto; padding-top: 16px; border-top: 1px dashed var(--border-dashed); }
.dw-lang-pill { display: flex; align-items: center; gap: 6px; }
.dw-lang-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.dw-lang-ts { background: #3178C6; }
.dw-lang-rs { background: #DEA584; }
.dw-lang-py { background: #3572A5; }

.dw-pipeline-list { display: flex; flex-direction: column; gap: 12px; }
.dw-pipeline-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: var(--pure-white); border: 1px solid var(--border-light); border-radius: 8px; cursor: pointer; transition: background 0.2s; }
.dw-pipeline-item:hover { background: #FAFAFA; }
.dw-pipe-left { display: flex; align-items: center; gap: 16px; }
.dw-status-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.dw-status-success { background: #ECFDF5; color: #10B981; }
.dw-status-failed { background: #FEF2F2; color: #EF4444; }
.dw-status-running { background: #EFF6FF; color: #3B82F6; }
.dw-status-running svg { animation: dw-spin 2s linear infinite; }
.dw-pipe-details h4 { font-size: 0.85rem; font-weight: 500; color: var(--text-dark); margin-bottom: 4px; }
.dw-pipe-details p { font-size: 0.75rem; color: var(--text-muted); display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.dw-pipe-details span { display: flex; align-items: center; gap: 4px; }
.dw-pipe-right { font-size: 0.75rem; color: var(--text-muted); text-align: right; }
.dw-pipe-status { color: var(--text-dark); font-weight: 500; font-size: 0.8rem; margin-bottom: 4px; }
@keyframes dw-spin { 100% { transform: rotate(360deg); } }

.dw-history-table-wrapper { background: var(--pure-white); border: 1px solid var(--border-light); border-radius: 10px; overflow: hidden; }
.dw-history-table { width: 100%; border-collapse: collapse; text-align: left; }
.dw-history-table th { padding: 16px 20px; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--border-light); background: var(--top-bar-bg); text-transform: uppercase; letter-spacing: 0.5px; }
.dw-history-table td { padding: 16px 20px; font-size: 0.8rem; color: var(--text-dark); border-bottom: 1px dashed var(--border-dashed); }
.dw-history-table tr:last-child td { border-bottom: none; }
.dw-history-table tr:hover td { background: #FAFAFA; }
.dw-mono { font-family: 'Fira Code', monospace; }
.dw-muted { color: var(--text-muted); }
.dw-badge { padding: 4px 8px; border-radius: 99px; font-size: 0.7rem; font-weight: 600; }
.dw-badge-success { background: #ECFDF5; color: #10B981; }
.dw-badge-failed { background: #FEF2F2; color: #EF4444; }

.dw-doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.dw-doc-folder {
  display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px;
  background: var(--pure-white); border: 1px solid var(--border-light); border-radius: 12px;
  cursor: pointer; transition: 0.2s; text-align: center;
}
.dw-doc-folder:hover { border-color: #D1D1D1; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transform: translateY(-2px); }
.dw-doc-folder svg { width: 32px; height: 32px; color: var(--text-muted); stroke-width: 1.5; }
.dw-doc-folder:hover svg { color: var(--text-dark); }
.dw-doc-folder span { font-size: 0.85rem; font-weight: 500; color: var(--text-dark); }
.dw-doc-meta { font-size: 0.7rem; color: var(--text-muted); }

@media (max-width: 900px) {
  .dw-sidebar { width: 220px; padding: 16px 12px; }
  .dw-workflow-grid { grid-template-columns: 1fr; }
  .dw-scrollable-area, .dw-view-content { padding-left: 20px; padding-right: 20px; }
  .dw-chat-input-wrapper { padding: 0 16px 24px; }
}

@media (prefers-reduced-motion: reduce) {
  .dw-chat-message { animation: none; opacity: 1; transform: none; }
  .dw-thinking-pulse { animation: none; opacity: 0.7; }
  .dw-status-running svg { animation: none; }
  .dw-workflow-card:hover, .dw-repo-card:hover, .dw-doc-folder:hover { transform: none; }
  .dw-final-response { animation: none; }
}
`;
