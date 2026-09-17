# Minimal AI Dev Workspace — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

> **Use case:** Ideal as the core interface for a developer-focused AI coding assistant or SaaS product where clarity and low-distraction chat UX matter most.

---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevAgent - Clean Developer Workspace</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@500;600&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    
    <style>
        :root {
            /* Subtle Off-White vs White Theme */
            --sidebar-bg: #F8F8F6;       /* Warm Off-white (Cream tint) for sidebar */
            --main-bg: #FFFFFF;          /* Pure white for main workspace */
            --pure-white: #FFFFFF;       /* Pure white for cards & inputs */
            --top-bar-bg: #F8F8F6;       /* Warm Off-white for chat top bar */
            
            --text-dark: #1F1F1F;
            --text-muted: #737373;
            --text-light: #A3A3A3;
            --border-light: #EBEBEB;
            --border-dashed: #D4D4D4;
            --hover-bg: #EAEAEA;
            --active-nav-bg: #EAEAEA;
            --accent-blue-bg: #EFF6FF;
            --accent-blue-text: #2563EB;
            
            /* Typography */
            --font-sans: 'Inter', sans-serif;
            --font-serif: 'Playfair Display', serif;
            --font-mono: 'Fira Code', monospace;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--font-sans);
            color: var(--text-dark);
            background-color: var(--main-bg);
            height: 100vh;
            display: flex;
            overflow: hidden;
            -webkit-font-smoothing: antialiased;
        }

        /* --- SIDEBAR --- */
        .sidebar {
            width: 260px;
            background-color: var(--sidebar-bg);
            border-right: 1px solid var(--border-light);
            display: flex;
            flex-direction: column;
            padding: 24px 16px;
            flex-shrink: 0;
            z-index: 10;
        }

        .sidebar-header {
            display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
        }

        .logo-box {
            background-color: #555555; color: white; font-size: 0.75rem; font-weight: 600;
            width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
            border-radius: 4px; letter-spacing: 0.5px;
        }

        .header-actions { display: flex; gap: 8px; color: var(--text-light); }
        .header-actions svg { width: 16px; height: 16px; cursor: pointer; transition: color 0.2s; }
        .header-actions svg:hover { color: var(--text-dark); }

        .company-name {
            font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; justify-content: space-between;
            margin-bottom: 16px; cursor: pointer;
        }
        .company-name svg { width: 14px; height: 14px; color: var(--text-muted); }

        .btn-create {
            background-color: #2D2D2D; color: white; border: none; border-radius: 6px;
            padding: 8px; width: 100%; font-size: 0.8rem; font-weight: 500; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 24px; transition: background 0.2s;
        }
        .btn-create:hover { background-color: #1a1a1a; }

        /* Navigation */
        .nav-list { display: flex; flex-direction: column; gap: 4px; }
        .nav-item {
            display: flex; align-items: center; gap: 10px; padding: 6px 12px; border-radius: 6px;
            color: var(--text-muted); text-decoration: none; font-size: 0.8rem; font-weight: 500;
            transition: all 0.2s ease; cursor: pointer;
        }
        .nav-item svg { width: 16px; height: 16px; stroke-width: 1.5; fill: none; stroke: currentColor; }
        .nav-item:hover, .nav-subitem:hover { background-color: var(--hover-bg); color: var(--text-dark); }
        .nav-item.active, .nav-subitem.active { background-color: var(--active-nav-bg); color: var(--text-dark); }

        .nav-group { display: flex; flex-direction: column; margin-top: 4px; margin-bottom: 4px; }
        .nav-sublist {
            display: flex; flex-direction: column; margin-left: 20px; padding-left: 8px;
            border-left: 1px solid var(--border-light); margin-top: 4px; gap: 4px;
        }
        .nav-subitem {
            text-decoration: none; color: #888888; font-size: 0.75rem; padding: 6px 8px; border-radius: 4px;
            transition: all 0.2s; cursor: pointer;
        }

        /* Sidebar Footer (Logout) */
        .sidebar-footer {
            margin-top: auto;
            padding-top: 16px;
            border-top: 1px dashed var(--border-light);
        }
        .text-danger { color: #EF4444 !important; }
        .text-danger:hover { background-color: #FEF2F2 !important; }

        /* --- MAIN CONTENT & SPA VIEWS --- */
        .main-content {
            flex-grow: 1; display: flex; flex-direction: column;
            background-color: var(--main-bg); height: 100vh; position: relative;
        }

        .app-view {
            display: none; /* SPA Hide by default */
            flex-direction: column; width: 100%; height: 100%;
        }
        .app-view.active-view { display: flex; } /* Show when active */

        .scrollable-area {
            flex-grow: 1; overflow-y: auto; padding: 80px 40px 20px 40px;
            display: flex; flex-direction: column; align-items: center; scroll-behavior: smooth;
        }
        
        .chat-input-wrapper {
            padding: 0 40px 40px 40px; display: flex; justify-content: center;
            background-color: var(--main-bg); flex-shrink: 0; width: 100%;
        }

        .center-container { width: 100%; max-width: 720px; display: flex; flex-direction: column; margin: 0 auto;}

        /* --- VIEW 1: CODE COPILOT (CHAT) --- */
        .landing-view { align-items: center; text-align: center; margin-bottom: 24px; animation: fadeIn 0.4s ease; }
        .main-icon { width: 28px; height: 28px; margin-bottom: 24px; color: var(--text-dark); }
        
        h1.title { font-family: var(--font-serif); font-size: 1.75rem; font-weight: 500; margin-bottom: 8px; letter-spacing: -0.5px; }
        p.subtitle { color: var(--text-muted); font-size: 0.85rem; font-weight: 400; margin-bottom: 24px; }

        .chat-history-view { display: none; width: 100%; flex-direction: column; padding-bottom: 20px; }

        /* State toggling within Copilot View */
        body.chat-active .landing-view, 
        body.chat-active .context-pills,
        body.chat-active .workflows-section { display: none !important; }
        body.chat-active .chat-history-view { display: flex; }
        body.chat-active .scrollable-area { padding-top: 40px; }

        .chat-message { display: flex; gap: 16px; margin-bottom: 32px; animation: slideUp 0.3s ease forwards; opacity: 0; transform: translateY(10px); }
        .chat-message.user { justify-content: flex-end; }
        
        .message-avatar {
            width: 28px; height: 28px; border-radius: 4px; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 600;
        }
        .ai-avatar { background-color: #555; color: white; }
        
        .message-content { max-width: 85%; font-size: 0.9rem; line-height: 1.6; color: var(--text-dark); }
        .user .message-content { background-color: var(--sidebar-bg); padding: 12px 16px; border-radius: 12px; border-bottom-right-radius: 4px; }
        
        .message-content p { margin-bottom: 12px; }
        .message-content p:last-child { margin-bottom: 0; }
        .message-content pre {
            background-color: var(--sidebar-bg); padding: 12px; border-radius: 8px; font-family: var(--font-mono);
            font-size: 0.8rem; overflow-x: auto; margin-bottom: 12px; border: 1px solid var(--border-light);
        }
        .message-content code { font-family: var(--font-mono); font-size: 0.8rem; background: var(--sidebar-bg); padding: 2px 4px; border-radius: 4px; }

        .reasoning-block {
            margin-bottom: 16px; border-left: 2px solid var(--border-dashed); padding-left: 12px;
            color: var(--text-muted); font-size: 0.8rem;
        }
        .reasoning-block details summary { cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; outline: none; }
        .reasoning-block details summary::-webkit-details-marker { display: none; }
        .reasoning-block details summary::marker { display: none; }
        .thinking-pulse { animation: pulse 1.5s infinite; color: var(--text-dark); }
        .thought-content { margin-top: 8px; font-family: var(--font-mono); font-size: 0.75rem; opacity: 0.8; }

        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .chat-box {
            border: 1px solid var(--border-light); border-radius: 12px; background-color: var(--pure-white);
            box-shadow: 0 4px 20px rgba(0,0,0,0.02); display: flex; flex-direction: column;
            transition: border-color 0.3s, box-shadow 0.3s; overflow: hidden; width: 100%;
        }
        .chat-box.focused { border-color: #D1D1D1; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }

        .chat-top-bar {
            display: flex; align-items: center; gap: 16px; padding: 10px 16px; 
            background-color: var(--top-bar-bg); border-bottom: 1px solid var(--border-light);
        }
        .top-btn {
            background: none; border: none; display: flex; align-items: center; gap: 6px;
            color: var(--text-muted); font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: color 0.2s;
        }
        .top-btn svg { width: 14px; height: 14px; }
        .top-btn:hover { color: var(--text-dark); }
        .model-select { margin-left: auto; display: flex; align-items: center; gap: 6px; color: var(--text-dark); font-size: 0.75rem; font-weight: 500; cursor: pointer; }
        .model-select svg { width: 14px; height: 14px; color: #D97757; fill: currentColor; }

        textarea {
            width: 100%; border: none; resize: none; outline: none; padding: 16px 16px; min-height: 80px; max-height: 250px;
            font-size: 0.85rem; font-family: var(--font-sans); color: var(--text-dark); line-height: 1.5; background-color: var(--pure-white);
            overflow-y: hidden;
        }
        textarea::placeholder { color: #AFAFAF; font-weight: 400; }

        .chat-bottom-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background-color: var(--pure-white); }
        .pill-btn {
            display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; border: none;
            font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease;
        }
        .pill-btn svg { width: 14px; height: 14px; }
        .btn-gray { background-color: var(--top-bar-bg); color: var(--text-dark); border: 1px solid var(--border-light); }
        .btn-gray:hover { background-color: #EAEAEA; }
        .btn-blue { background-color: var(--accent-blue-bg); color: var(--accent-blue-text); }
        .btn-blue:hover { background-color: #DBEAFE; }

        .btn-submit {
            margin-left: auto; width: 32px; height: 32px; border-radius: 8px; background-color: #EBEBEB; color: #A3A3A3;
            border: none; display: flex; align-items: center; justify-content: center; cursor: not-allowed; transition: all 0.2s;
        }
        .btn-submit.active { background-color: #2D2D2D; color: white; cursor: pointer; }
        .btn-submit.active:hover { background-color: #1a1a1a; }
        .btn-submit svg { width: 16px; height: 16px; }

        .context-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 48px; width: 100%; max-width: 720px; justify-content: center;}
        .pill-dashed {
            padding: 6px 12px; font-size: 0.75rem; font-weight: 500; color: var(--text-muted);
            border: 1px dashed var(--border-dashed); border-radius: 6px; background-color: var(--pure-white);
            cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 4px;
        }
        .pill-dashed:hover { color: var(--text-dark); border-color: #A3A3A3; background: var(--main-bg); }
        .pill-dashed.selected { border-color: var(--text-dark); border-style: solid; color: var(--text-dark); background: var(--sidebar-bg); }

        .workflows-section { width: 100%; max-width: 720px; }
        .workflows-header { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 600; color: var(--text-dark); margin-bottom: 16px; }
        .workflows-header svg { width: 14px; height: 14px; fill: currentColor; }

        .workflow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .workflow-card {
            background-color: var(--pure-white); border: 1px solid var(--border-light); border-radius: 10px; padding: 16px;
            cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; gap: 10px;
        }
        .workflow-card:hover { border-color: #D1D1D1; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transform: translateY(-2px); }
        .card-icon { width: 28px; height: 28px; border-radius: 6px; background: var(--top-bar-bg); display: flex; align-items: center; justify-content: center; color: var(--text-dark); }
        .card-icon svg { width: 14px; height: 14px; }
        .workflow-card h3 { font-size: 0.8rem; font-weight: 600; color: var(--text-dark); }
        .workflow-card p { font-size: 0.7rem; color: var(--text-muted); line-height: 1.4; }

        /* --- GLOBAL VIEW STYLES (For Repos, Pipelines, etc) --- */
        .view-header {
            padding: 32px 40px 16px 40px; display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid var(--border-light); background: var(--main-bg); flex-shrink: 0;
        }
        .view-title { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 500; color: var(--text-dark); }
        .view-actions { display: flex; gap: 12px; }
        .search-bar {
            display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--sidebar-bg);
            border: 1px solid var(--border-light); border-radius: 6px; width: 240px;
        }
        .search-bar svg { width: 14px; height: 14px; color: var(--text-muted); }
        .search-bar input { border: none; background: transparent; outline: none; font-size: 0.75rem; width: 100%; color: var(--text-dark); }
        
        .view-content { padding: 24px 40px; overflow-y: auto; flex-grow: 1; }

        /* --- VIEW 2: REPOSITORIES --- */
        .repo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .repo-card {
            background: var(--pure-white); border: 1px solid var(--border-light); border-radius: 10px;
            padding: 20px; display: flex; flex-direction: column; gap: 12px; transition: 0.2s; cursor: pointer;
        }
        .repo-card:hover { border-color: #D1D1D1; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transform: translateY(-2px); }
        .repo-title { font-size: 0.9rem; font-weight: 600; color: var(--text-dark); display: flex; align-items: center; gap: 8px;}
        .repo-title svg { width: 14px; height: 14px; color: var(--text-muted); }
        .repo-desc { font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; }
        .repo-meta {
            display: flex; align-items: center; justify-content: space-between; font-size: 0.7rem;
            color: var(--text-muted); margin-top: auto; padding-top: 16px; border-top: 1px dashed var(--border-dashed);
        }
        .lang-pill { display: flex; align-items: center; gap: 6px; }
        .lang-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .lang-ts { background-color: #3178C6; }
        .lang-rs { background-color: #DEA584; }
        .lang-py { background-color: #3572A5; }

        /* --- VIEW 3: PIPELINES --- */
        .pipeline-list { display: flex; flex-direction: column; gap: 12px; }
        .pipeline-item {
            display: flex; align-items: center; justify-content: space-between; padding: 16px 20px;
            background: var(--pure-white); border: 1px solid var(--border-light); border-radius: 8px;
            cursor: pointer; transition: background 0.2s;
        }
        .pipeline-item:hover { background: #FAFAFA; }
        .pipe-left { display: flex; align-items: center; gap: 16px; }
        .status-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .status-success { background: #ECFDF5; color: #10B981; }
        .status-failed { background: #FEF2F2; color: #EF4444; }
        .status-running { background: #EFF6FF; color: #3B82F6; }
        .status-running svg { animation: spin 2s linear infinite; }
        .pipe-details h4 { font-size: 0.85rem; font-weight: 500; color: var(--text-dark); margin-bottom: 4px; }
        .pipe-details p { font-size: 0.75rem; color: var(--text-muted); display: flex; gap: 12px; align-items: center; }
        .pipe-details span { display: flex; align-items: center; gap: 4px; }
        .pipe-right { font-size: 0.75rem; color: var(--text-muted); text-align: right; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* --- VIEW 4: BUILD HISTORY --- */
        .history-table-wrapper { background: var(--pure-white); border: 1px solid var(--border-light); border-radius: 10px; overflow: hidden; }
        .history-table { width: 100%; border-collapse: collapse; text-align: left; }
        .history-table th { padding: 16px 20px; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--border-light); background: var(--top-bar-bg); text-transform: uppercase; letter-spacing: 0.5px;}
        .history-table td { padding: 16px 20px; font-size: 0.8rem; color: var(--text-dark); border-bottom: 1px dashed var(--border-dashed); }
        .history-table tr:last-child td { border-bottom: none; }
        .history-table tr:hover td { background: #FAFAFA; }
        .badge { padding: 4px 8px; border-radius: 99px; font-size: 0.7rem; font-weight: 600; }
        .badge-success { background: #ECFDF5; color: #10B981; }
        .badge-failed { background: #FEF2F2; color: #EF4444; }

        /* --- VIEW 5: DOCUMENTATION --- */
        .doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        .doc-folder {
            display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px;
            background: var(--pure-white); border: 1px solid var(--border-light); border-radius: 12px;
            cursor: pointer; transition: 0.2s; text-align: center;
        }
        .doc-folder:hover { border-color: #D1D1D1; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transform: translateY(-2px); }
        .doc-folder svg { width: 32px; height: 32px; color: var(--text-muted); stroke-width: 1.5; }
        .doc-folder:hover svg { color: var(--text-dark); }
        .doc-folder span { font-size: 0.85rem; font-weight: 500; color: var(--text-dark); }
        .doc-meta { font-size: 0.7rem; color: var(--text-muted); }

    </style>
</head>
<body>

    <!-- SIDEBAR -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <div class="logo-box">AG</div>
            <div class="header-actions">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            </div>
        </div>

        <div class="company-name">
            Antigravity Labs
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>

        <button class="btn-create" id="btn-new-chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Chat
        </button>

        <nav class="nav-list">
            <a href="#" class="nav-item active" data-target="view-copilot">
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Code Copilot
            </a>
            <a href="#" class="nav-item" data-target="view-repositories">
                <svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                Repositories
            </a>
            
            <div class="nav-group">
                <a href="#" class="nav-item" data-target="view-pipelines">
                    <svg viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    Pipelines
                </a>
                <div class="nav-sublist">
                    <a href="#" class="nav-subitem" data-target="view-pipelines">CI/CD Configs</a>
                    <a href="#" class="nav-subitem" data-target="view-pipelines">Deployments</a>
                    <a href="#" class="nav-subitem" data-target="view-pipelines">Test Suites</a>
                </div>
            </div>

            <a href="#" class="nav-item" data-target="view-history">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Build History
            </a>
            <a href="#" class="nav-item" data-target="view-documentation">
                <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                Documentation
            </a>
        </nav>

        <div class="sidebar-footer">
            <a href="#" class="nav-item text-danger">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
            </a>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
        
        <!-- ========================================== -->
        <!-- VIEW 1: CODE COPILOT (CHAT)                -->
        <!-- ========================================== -->
        <div id="view-copilot" class="app-view active-view">
            <div class="scrollable-area" id="scroll-area">
                <!-- LANDING VIEW -->
                <div id="landing-view" class="landing-view center-container">
                    <svg class="main-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="19.07" y2="4.93"></line></svg>
                    <h1 class="title">Welcome to DevAgent</h1>
                    <p class="subtitle">Accelerate your coding, debugging, and deployments.</p>
                </div>

                <!-- CHAT HISTORY VIEW -->
                <div id="chat-history-view" class="chat-history-view"></div>

                <!-- CONTEXT PILLS -->
                <div class="context-pills" id="context-pills">
                    <span class="pill-dashed">GitHub <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span>
                    <span class="pill-dashed">Jira <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span>
                    <span class="pill-dashed">AWS <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span>
                    <span class="pill-dashed">Vercel <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></span>
                </div>

                <!-- RECOMMENDED WORKFLOWS -->
                <div class="workflows-section" id="workflows-section">
                    <div class="workflows-header">
                        <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        Recommended Workflows
                    </div>
                    <div class="workflow-grid">
                        <div class="workflow-card" data-prompt="Can you help me review the latest pull request? Please check for performance bottlenecks and standard compliance.">
                            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
                            <div><h3>Review Pull Request</h3><p>Analyze code changes for bugs, performance issues, and standards.</p></div>
                        </div>
                        <div class="workflow-card" data-prompt="Generate a comprehensive unit test suite using Jest and React Testing Library for the main navigation component.">
                            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
                            <div><h3>Generate Unit Tests</h3><p>Automatically write comprehensive test suites for your components.</p></div>
                        </div>
                        <div class="workflow-card" data-prompt="I have a memory leak in my Node.js application. Where should I start looking to debug the stack trace?">
                            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg></div>
                            <div><h3>Debug Stack Trace</h3><p>Paste an error log to find the root cause and get a fix instantly.</p></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chat-input-wrapper">
                <div class="center-container">
                    <div class="chat-box" id="chat-box">
                        <div class="chat-top-bar">
                            <button class="top-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> Select Repo</button>
                            <button class="top-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> Set Branch / PR</button>
                            <div class="model-select"><svg viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg> Claude 3.5 Sonnet</div>
                        </div>
                        <textarea id="chat-input" placeholder="Ask DevAgent to generate code, review PRs, or debug..." spellcheck="false" rows="1"></textarea>
                        <div class="chat-bottom-bar">
                            <button class="pill-btn btn-gray"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg> Attach files</button>
                            <button class="pill-btn btn-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> Web Search</button>
                            <button class="btn-submit" id="btn-submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- VIEW 2: REPOSITORIES                       -->
        <!-- ========================================== -->
        <div id="view-repositories" class="app-view">
            <div class="view-header">
                <h2 class="view-title">Repositories</h2>
                <div class="view-actions">
                    <div class="search-bar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search repositories...">
                    </div>
                    <button class="btn-create" style="margin-bottom:0; width:auto; padding:8px 16px;">New Repository</button>
                </div>
            </div>
            <div class="view-content">
                <div class="repo-grid">
                    <div class="repo-card">
                        <div class="repo-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            antigravity-core
                        </div>
                        <div class="repo-desc">Core agent engine for processing reasoning pipelines and tool orchestration.</div>
                        <div class="repo-meta">
                            <div class="lang-pill"><span class="lang-dot lang-ts"></span> TypeScript</div>
                            <div>Updated 2h ago</div>
                        </div>
                    </div>
                    <div class="repo-card">
                        <div class="repo-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            motion-ui-kit
                        </div>
                        <div class="repo-desc">Premium component library for Antigravity web interfaces.</div>
                        <div class="repo-meta">
                            <div class="lang-pill"><span class="lang-dot lang-ts"></span> TypeScript</div>
                            <div>Updated 5h ago</div>
                        </div>
                    </div>
                    <div class="repo-card">
                        <div class="repo-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            data-pipeline-rs
                        </div>
                        <div class="repo-desc">High-performance Rust microservice for telemetry ingestion.</div>
                        <div class="repo-meta">
                            <div class="lang-pill"><span class="lang-dot lang-rs"></span> Rust</div>
                            <div>Updated 1d ago</div>
                        </div>
                    </div>
                    <div class="repo-card">
                        <div class="repo-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            python-eval-scripts
                        </div>
                        <div class="repo-desc">Benchmarking and evaluation scripts for the LLM outputs.</div>
                        <div class="repo-meta">
                            <div class="lang-pill"><span class="lang-dot lang-py"></span> Python</div>
                            <div>Updated 3d ago</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- VIEW 3: PIPELINES                          -->
        <!-- ========================================== -->
        <div id="view-pipelines" class="app-view">
            <div class="view-header">
                <h2 class="view-title">Active Pipelines</h2>
                <div class="view-actions">
                    <button class="pill-btn btn-gray">Filter: All Branches</button>
                </div>
            </div>
            <div class="view-content">
                <div class="pipeline-list">
                    
                    <div class="pipeline-item">
                        <div class="pipe-left">
                            <div class="status-icon status-running"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg></div>
                            <div class="pipe-details">
                                <h4>Deploy to Production</h4>
                                <p>
                                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg> main</span>
                                    <span>#a8c4f92</span>
                                    <span>feat: add E2E routing views</span>
                                </p>
                            </div>
                        </div>
                        <div class="pipe-right">
                            <div style="color: var(--text-dark); font-weight: 500; font-size: 0.8rem; margin-bottom:4px;">Running</div>
                            <div>01m 24s</div>
                        </div>
                    </div>

                    <div class="pipeline-item">
                        <div class="pipe-left">
                            <div class="status-icon status-success"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                            <div class="pipe-details">
                                <h4>E2E Integration Tests</h4>
                                <p>
                                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg> feature/chat-ux</span>
                                    <span>#b391d1a</span>
                                    <span>fix: textarea resize bug</span>
                                </p>
                            </div>
                        </div>
                        <div class="pipe-right">
                            <div style="color: var(--text-dark); font-weight: 500; font-size: 0.8rem; margin-bottom:4px;">Success</div>
                            <div>04m 12s</div>
                        </div>
                    </div>

                    <div class="pipeline-item">
                        <div class="pipe-left">
                            <div class="status-icon status-failed"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>
                            <div class="pipe-details">
                                <h4>Build Rust Microservice</h4>
                                <p>
                                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg> main</span>
                                    <span>#9c231ff</span>
                                    <span>chore: update dependencies</span>
                                </p>
                            </div>
                        </div>
                        <div class="pipe-right">
                            <div style="color: var(--text-dark); font-weight: 500; font-size: 0.8rem; margin-bottom:4px;">Failed</div>
                            <div>00m 45s</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- VIEW 4: HISTORY                            -->
        <!-- ========================================== -->
        <div id="view-history" class="app-view">
            <div class="view-header">
                <h2 class="view-title">Build History</h2>
                <div class="view-actions">
                    <div class="search-bar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search logs...">
                    </div>
                </div>
            </div>
            <div class="view-content">
                <div class="history-table-wrapper">
                    <table class="history-table">
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
                            <tr>
                                <td style="font-family: var(--font-mono);">#BLD-8912</td>
                                <td>antigravity-core</td>
                                <td>Commit <span style="color:var(--text-muted);">#a8c4f92</span></td>
                                <td><span class="badge badge-success">Success</span></td>
                                <td>Aug 29, 14:32</td>
                            </tr>
                            <tr>
                                <td style="font-family: var(--font-mono);">#BLD-8911</td>
                                <td>motion-ui-kit</td>
                                <td>Manual Trigger</td>
                                <td><span class="badge badge-success">Success</span></td>
                                <td>Aug 29, 11:15</td>
                            </tr>
                            <tr>
                                <td style="font-family: var(--font-mono);">#BLD-8910</td>
                                <td>data-pipeline-rs</td>
                                <td>Commit <span style="color:var(--text-muted);">#9c231ff</span></td>
                                <td><span class="badge badge-failed">Failed</span></td>
                                <td>Aug 28, 09:45</td>
                            </tr>
                            <tr>
                                <td style="font-family: var(--font-mono);">#BLD-8909</td>
                                <td>antigravity-core</td>
                                <td>Scheduled</td>
                                <td><span class="badge badge-success">Success</span></td>
                                <td>Aug 28, 00:00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- VIEW 5: DOCUMENTATION                      -->
        <!-- ========================================== -->
        <div id="view-documentation" class="app-view">
            <div class="view-header">
                <h2 class="view-title">Documentation Library</h2>
                <div class="view-actions">
                    <button class="pill-btn btn-blue">Upload Doc</button>
                </div>
            </div>
            <div class="view-content">
                <div class="doc-grid">
                    <div class="doc-folder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        <div>
                            <span>API References</span>
                            <div class="doc-meta">12 Articles</div>
                        </div>
                    </div>
                    <div class="doc-folder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        <div>
                            <span>Component Guidelines</span>
                            <div class="doc-meta">24 Articles</div>
                        </div>
                    </div>
                    <div class="doc-folder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        <div>
                            <span>Deployment Architecture</span>
                            <div class="doc-meta">8 Articles</div>
                        </div>
                    </div>
                    <div class="doc-folder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        <div>
                            <span>Security Protocols</span>
                            <div class="doc-meta">3 Articles</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <script>
        /* ========================================================= */
        /* ROUTING / VIEW SWITCHING LOGIC                            */
        /* ========================================================= */
        const navItems = document.querySelectorAll('.nav-item, .nav-subitem');
        const appViews = document.querySelectorAll('.app-view');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');
                if (!targetId) return;

                // 1. Remove active class from all nav items
                document.querySelectorAll('.nav-item.active, .nav-subitem.active').forEach(n => n.classList.remove('active'));
                
                // 2. Add active class to clicked item (and its parent if it's a subitem)
                item.classList.add('active');
                if (item.classList.contains('nav-subitem')) {
                    // find parent nav-item
                    const parentGroup = item.closest('.nav-group');
                    if (parentGroup) {
                        const parentLink = parentGroup.querySelector('.nav-item');
                        if (parentLink) parentLink.classList.add('active');
                    }
                }

                // 3. Hide all views, show the target view
                appViews.forEach(view => view.classList.remove('active-view'));
                const targetView = document.getElementById(targetId);
                if (targetView) {
                    targetView.classList.add('active-view');
                }
            });
        });


        /* ========================================================= */
        /* CODE COPILOT (CHAT) LOGIC                                 */
        /* ========================================================= */
        const chatInput = document.getElementById('chat-input');
        const btnSubmit = document.getElementById('btn-submit');
        const chatBox = document.getElementById('chat-box');
        const scrollArea = document.getElementById('scroll-area');
        const chatHistoryView = document.getElementById('chat-history-view');
        const btnNewChat = document.getElementById('btn-new-chat');

        // Auto-resize textarea
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            
            if (this.value.trim().length > 0) {
                btnSubmit.classList.add('active');
            } else {
                btnSubmit.classList.remove('active');
            }
        });

        chatInput.addEventListener('focus', () => chatBox.classList.add('focused'));
        chatInput.addEventListener('blur', () => chatBox.classList.remove('focused'));

        // Handle Enter
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitMessage();
            }
        });

        btnSubmit.addEventListener('click', submitMessage);

        // Context Pills toggle
        document.querySelectorAll('.pill-dashed').forEach(pill => {
            pill.addEventListener('click', () => {
                pill.classList.toggle('selected');
                const icon = pill.querySelector('svg line:nth-child(2)');
                if (pill.classList.contains('selected')) {
                    if(icon) icon.style.display = 'none'; // Turn + into -
                } else {
                    if(icon) icon.style.display = 'block';
                }
            });
        });

        // Recommended Workflows
        document.querySelectorAll('.workflow-card').forEach(card => {
            card.addEventListener('click', () => {
                const prompt = card.getAttribute('data-prompt');
                chatInput.value = prompt;
                chatInput.dispatchEvent(new Event('input'));
                submitMessage();
            });
        });

        // New Chat Button
        btnNewChat.addEventListener('click', () => {
            // Force nav back to copilot
            document.querySelector('.nav-item[data-target="view-copilot"]').click();
            
            // Reset chat state
            document.body.classList.remove('chat-active');
            chatHistoryView.innerHTML = '';
            chatInput.value = '';
            chatInput.style.height = 'auto';
            btnSubmit.classList.remove('active');
        });

        function submitMessage() {
            const text = chatInput.value.trim();
            if (!text) return;

            document.body.classList.add('chat-active');
            appendUserMessage(text);
            chatInput.value = '';
            chatInput.style.height = 'auto';
            btnSubmit.classList.remove('active');
            simulateAI(text);
        }

        function appendUserMessage(text) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-message user';
            msgDiv.innerHTML = `<div class="message-content">${escapeHTML(text)}</div>`;
            chatHistoryView.appendChild(msgDiv);
            scrollToBottom();
        }

        function simulateAI(prompt) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-message ai';
            const reasoningId = 'reasoning-' + Date.now();
            
            msgDiv.innerHTML = `
                <div class="message-avatar ai-avatar">AG</div>
                <div class="message-content">
                    <div class="reasoning-block" id="${reasoningId}">
                        <details open>
                            <summary><svg class="thinking-pulse" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg> <span>Reasoning...</span></summary>
                            <div class="thought-content">Analyzing context from Repositories...<br>Identifying intent...</div>
                        </details>
                    </div>
                    <div class="final-response" style="display:none;"></div>
                </div>
            `;
            chatHistoryView.appendChild(msgDiv);
            scrollToBottom();

            setTimeout(() => {
                const thoughtContent = msgDiv.querySelector('.thought-content');
                thoughtContent.innerHTML += `<br>Generating optimal code structure...<br>Formatting response.`;
                scrollToBottom();
            }, 1000);

            setTimeout(() => {
                const reasoningSummary = msgDiv.querySelector('summary span');
                const thinkingIcon = msgDiv.querySelector('.thinking-pulse');
                const finalContent = msgDiv.querySelector('.final-response');
                const details = msgDiv.querySelector('details');

                thinkingIcon.classList.remove('thinking-pulse');
                thinkingIcon.innerHTML = `<polyline points="20 6 9 17 4 12"></polyline>`; // Checkmark
                reasoningSummary.innerText = "Thought Process (2.5s)";
                details.removeAttribute('open');
                
                finalContent.innerHTML = generateMockResponse(prompt);
                finalContent.style.display = 'block';
                finalContent.style.animation = 'fadeIn 0.5s ease';
                scrollToBottom();

            }, 2500);
        }

        function generateMockResponse(prompt) {
            const p = prompt.toLowerCase();
            if (p.includes('review') || p.includes('pull request')) {
                return `
                    <p>I've reviewed the latest changes in the pull request. The logic looks sound, but there is a potential performance bottleneck in the loop.</p>
                    <p>Instead of mapping over the array multiple times, you can combine the operations:</p>
                    <pre><code>// Recommended Refactor
const processedData = rawData.reduce((acc, item) => {
    if (item.isValid) {
        acc.push(transform(item));
    }
    return acc;
}, []);</code></pre>
                    <p>I also verified that this complies with our internal styling guidelines.</p>
                `;
            }
            if (p.includes('test') || p.includes('jest')) {
                return `
                    <p>Sure, here is a comprehensive test suite for the component using <code>Jest</code> and <code>React Testing Library</code>.</p>
                    <pre><code>import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from './Navigation';

describe('Navigation Component', () => {
  it('renders all links correctly', () => {
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
    this.listeners.forEach(fn => fn(this.state));
  }
}</code></pre>
                <p>Let me know if you want me to expand on any specific part of this implementation!</p>
            `;
        }

        function scrollToBottom() {
            scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' });
        }

        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
        }
    </script>
</body>
</html>

---

**Awwwards-tier version →** https://cuedesign.space/component/cue102
