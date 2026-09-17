/**
 * Cue Foundations · Isometric Mechanical Keycap
 * ────────────────────────────────────────────
 * A pure CSS/JS button styled as a physically extruded mechanical keycap in an isometric socket, with a snappy spring-press animation and theme-switchable colors.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/isometric-mechanical-keycap.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue083
 *
 * Original Cue ID: cue083
 * Category: Buttons
 * ────────────────────────────────────────────
 */

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Isometric Keyboard Key</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            /* Default Off-White Theme */
            --btn-top: #f4f2f1;
            --btn-top-pressed: #ece9e8;
            --btn-text: #4a423f;
            --btn-border: #ccc8c7;
            --btn-border-pressed: #c4c0bf;
            --layer-left: #d8d4d3;
            --layer-right: #eeeceb;
            --btn-shadow: rgba(0,0,0,0.03);
        }

        /* Blue Theme */
        body.theme-blue {
            --btn-top: #3b82f6;
            --btn-top-pressed: #2563eb;
            --btn-text: #ffffff;
            --btn-border: #1d4ed8;
            --btn-border-pressed: #1e3a8a;
            --layer-left: #1d4ed8;
            --layer-right: #60a5fa;
            --btn-shadow: rgba(0,0,0,0.1);
        }

        /* Red Theme */
        body.theme-red {
            --btn-top: #ef4444;
            --btn-top-pressed: #dc2626;
            --btn-text: #ffffff;
            --btn-border: #b91c1c;
            --btn-border-pressed: #991b1b;
            --layer-left: #b91c1c;
            --layer-right: #f87171;
            --btn-shadow: rgba(0,0,0,0.1);
        }

        /* Green Theme */
        body.theme-green {
            --btn-top: #10b981;
            --btn-top-pressed: #059669;
            --btn-text: #ffffff;
            --btn-border: #047857;
            --btn-border-pressed: #065f46;
            --layer-left: #047857;
            --layer-right: #34d399;
            --btn-shadow: rgba(0,0,0,0.1);
        }

        /* Black Theme */
        body.theme-black {
            --btn-top: #27272a;
            --btn-top-pressed: #18181b;
            --btn-text: #ffffff;
            --btn-border: #000000;
            --btn-border-pressed: #000000;
            --layer-left: #000000;
            --layer-right: #52525b;
            --btn-shadow: rgba(0,0,0,0.4);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f6f5f4;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
            transition: background-color 0.4s ease;
        }

        /* --- COLOR PALETTE UI (Redesigned) --- */
        .palette-container {
            position: absolute;
            top: 40px;
            display: flex;
            align-items: center;
            gap: 6px;
            z-index: 100;
            background: #e8e6e5;
            padding: 6px;
            border-radius: 8px;
            border: 2px solid #d4d0cf;
            box-shadow: inset 2px 2px 5px rgba(0,0,0,0.05);
        }

        .swatch {
            width: 36px;
            height: 36px;
            border-radius: 4px; /* User requested 4px */
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 2px solid transparent;
        }

        .swatch:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }

        /* Active swatch state */
        .swatch.active {
            border: 2px solid #333 !important; /* Force border */
            transform: translateY(-1px);
            box-shadow: 0 2px 5px rgba(0,0,0,0.15);
        }

        /* --- SCENE --- */
        .scene {
            perspective: 2000px; 
        }

        /* The Main Button Container */
        .btn-3d {
            position: relative;
            width: 220px;
            height: 140px;
            /* Exact Isometric Angle */
            transform: rotateX(60deg) rotateZ(-45deg);
            transform-style: preserve-3d;
            cursor: pointer;
            outline: none;
            border: none;
            background: transparent;
            user-select: none;
            -webkit-user-select: none;
        }

        /* The Hole / Socket it sits in */
        .btn-socket {
            position: absolute;
            inset: -20px;
            background: #e4e2e1;
            border-radius: 24px;
            border: 2px solid #ffffff; 
            box-shadow: 
                0 5px 15px rgba(0,0,0,0.05), 
                inset 4px 4px 8px rgba(0,0,0,0.12), 
                inset -4px -4px 8px rgba(255,255,255,0.8), 
                inset 10px 10px 20px rgba(0,0,0,0.04); 
            transform: translateZ(0);
        }

        /* Grid lines */
        .grid-lines {
            position: absolute;
            inset: -100px;
            background-image: 
                linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
            background-size: 20px 20px;
            transform: translateZ(-1px);
            pointer-events: none;
        }

        /* Extrusion Wrapper */
        .btn-extrusion {
            position: absolute;
            inset: 0;
            transform-style: preserve-3d;
            transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
            transform: scaleZ(1);
        }

        /* The Solid 3D Layers (Sloped Sides) */
        .btn-layer {
            position: absolute;
            inset: 0;
            border-radius: 16px;
            background: linear-gradient(135deg, var(--layer-left) 50%, var(--layer-right) 50%);
            box-shadow: inset 0 0 0 1px var(--btn-shadow);
            transition: background 0.3s ease;
        }

        /* The Top Face */
        .btn-top {
            position: absolute;
            inset: 0;
            background: var(--btn-top);
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            
            color: var(--btn-text);
            font-size: 42px;
            font-weight: 500;
            letter-spacing: 1px;
            
            border: 2px solid var(--btn-border);
            box-shadow: 
                inset 0 0 20px rgba(0,0,0,0.03), 
                inset 2px 2px 5px rgba(255,255,255,1);
            
            transform: translateZ(50px) scale(0.8); 
            transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }

        /* --- CLICK ANIMATION --- */
        .btn-3d:active .btn-extrusion {
            transform: scaleZ(0.3);
        }
        
        .btn-3d:active .btn-top {
            background: var(--btn-top-pressed);
            border-color: var(--btn-border-pressed);
        }

    </style>
</head>
<body>

    <!-- UI Color Palette -->
    <div class="palette-container">
        <!-- The data-theme corresponds to the CSS class added to the body -->
        <div class="swatch active" data-theme="theme-default" style="background: #f4f2f1; border-color: #000;"></div>
        <div class="swatch" data-theme="theme-blue" style="background: #3b82f6;"></div>
        <div class="swatch" data-theme="theme-red" style="background: #ef4444;"></div>
        <div class="swatch" data-theme="theme-green" style="background: #10b981;"></div>
        <div class="swatch" data-theme="theme-black" style="background: #27272a;"></div>
    </div>

    <!-- 3D Scene -->
    <div class="scene">
        <div class="grid-lines"></div>
        <button class="btn-3d" id="launchBtn">
            <div class="btn-socket"></div>
            
            <div class="btn-extrusion" id="extrusion">
                <div class="btn-top">Launch</div>
            </div>
        </button>
    </div>

    <script>
        // --- Generate 3D Layers ---
        const extrusion = document.getElementById('extrusion');
        const topFace = document.querySelector('.btn-top');
        const depth = 50; 
        const shrinkFactor = 0.2; 
        
        for (let z = 1; z < depth; z++) {
            const layer = document.createElement('div');
            layer.classList.add('btn-layer');
            const scale = 1 - (z / depth) * shrinkFactor;
            layer.style.transform = `translateZ(${z}px) scale(${scale})`;
            extrusion.insertBefore(layer, topFace);
        }
        
        const finalScale = 1 - shrinkFactor;
        topFace.style.transform = `translateZ(${depth}px) scale(${finalScale})`;

        // --- Theme Palette Logic ---
        const swatches = document.querySelectorAll('.swatch');
        
        swatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                // Remove active styling from all swatches
                swatches.forEach(s => {
                    s.classList.remove('active');
                });
                
                // Add active styling to clicked swatch
                swatch.classList.add('active');
                
                // Update body class
                const themeClass = swatch.getAttribute('data-theme');
                document.body.className = ''; // Clear existing themes
                if (themeClass !== 'theme-default') {
                    document.body.classList.add(themeClass);
                }
            });
        });
    </script>

</body>
</html>
