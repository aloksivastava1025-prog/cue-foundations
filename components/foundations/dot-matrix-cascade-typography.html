/**
 * Cue Foundations · Dot-Matrix Cascade Typography
 * ────────────────────────────────────────────
 * A canvas-based engine converts typed text into scanline dot arrays that cascade outward from a central axis with wave-eased timing and drifting hue color.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/dot-matrix-cascade-typography.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue087
 *
 * Original Cue ID: cue087
 * Category: Text Animations
 * ────────────────────────────────────────────
 */

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mathematical Dot-Matrix Cascade</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        canvas {
            display: block;
            width: 100vw;
            height: 100vh;
            object-fit: contain;
            /* Default z-index per constraints */
        }
        
        /* Dashboard Styling */
        #dashboard {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 10;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-width: 220px;
        }
        
        .dash-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            font-size: 13px;
            font-weight: 600;
            color: #333;
        }
        
        .dash-row input[type="text"] {
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 6px 8px;
            font-family: inherit;
            font-weight: 700;
            width: 120px;
            outline: none;
            transition: border-color 0.2s;
        }
        .dash-row input[type="text"]:focus {
            border-color: #666;
        }
        
        .dash-row input[type="color"] {
            border: 1px solid #ccc;
            padding: 0;
            width: 48px;
            height: 28px;
            cursor: pointer;
            border-radius: 4px;
            outline: none;
        }
        
        .dash-row input[type="range"] {
            cursor: pointer;
            width: 120px;
            accent-color: #333;
        }
    </style>
</head>
<body>

    <div id="dashboard">
        <div class="dash-row">
            Text <input type="text" id="textIn" value="SYNC" maxlength="8">
        </div>
        <div class="dash-row">
            Color <input type="color" id="colorIn" value="#f2c94c">
        </div>
        <div class="dash-row">
            Scale <input type="range" id="scaleIn" min="0.2" max="2.0" step="0.05" value="0.75">
        </div>
    </div>

    <canvas id="matrixCanvas"></canvas>

    <script>
    // System Grid Constants
    const REF_W = 600;
    const REF_H = 337;
    const AXIS = 281.5;
    const ROW_START = 76.5;
    const ROW_PITCH = 20.5;
    const NUM_ROWS = 10;
    const STROKE_HEIGHT = 18;
    const FPS_LIMIT = 10;

    // Delay Law Variables
    const DOWN_AT = 4.85;
    const DOWN_RATE = 0.58;
    const UP_AT = 4.56;
    const UP_RATE = 0.42;
    const PINCH_DOWN = [4.98, 0.68];
    const PINCH_UP = [4.73, 0.4];

    // Defined Easing Excursion Array (25 Frames)
    const WAVE = [
      0.001, 0.003, 0.009, 0.028, 0.07, 0.148, 0.334, 0.674, 0.872, 0.95, 0.985,
      0.998, 0.998, 0.985, 0.95, 0.873, 0.676, 0.33, 0.129, 0.052, 0.016, 0.003,
      0.001, 0.0, 0.001,
    ];

    function hexToHsl(hex) {
        hex = hex.replace(/^#/, '');
        let r = parseInt(hex.substring(0, 2), 16) / 255;
        let g = parseInt(hex.substring(2, 4), 16) / 255;
        let b = parseInt(hex.substring(4, 6), 16) / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s, l];
    }

    function getDelay(row, zone) {
        if (zone === 0) return DOWN_AT + row * DOWN_RATE;
        if (zone === 2) return UP_AT + row * UP_RATE;
        // Alternating logic for mid-zones based on even/odd rows
        return (row % 2 === 0) ? PINCH_DOWN[0] + row * PINCH_DOWN[1] : PINCH_UP[0] + row * PINCH_UP[1];
    }

    function generateWordSegments(text) {
        const c = document.createElement('canvas');
        c.width = REF_W;
        c.height = REF_H;
        const ctx = c.getContext('2d', { willReadFrequently: true });

        // Draw solid black backdrop
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, REF_W, REF_H);

        // Render Typography (170px sans-serif at center)
        ctx.font = '900 170px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        
        // Offset Y slightly downwards to perfectly straddle the defined 10 rows
        ctx.fillText(text, REF_W / 2, REF_H / 2 + 15);

        // Pre-measure character spatial zones (Index 0, Index 1.., Index 2 (last))
        let bounds = [];
        let totalW = ctx.measureText(text).width;
        let curX = (REF_W - totalW) / 2;
        for (let i = 0; i < text.length; i++) {
            let cw = ctx.measureText(text[i]).width;
            bounds.push({ minX: curX, maxX: curX + cw, i: i });
            curX += cw;
        }

        let segments = [];

        // Scan the 10 rows geometrically mapping pixels to spans
        for (let r = 0; r < NUM_ROWS; r++) {
            let y = Math.round(ROW_START + r * ROW_PITCH);
            let imgData = ctx.getImageData(0, y, REF_W, 1).data;
            let inSpan = false;
            let x0 = 0;

            for (let x = 0; x <= REF_W; x++) {
                // Alpha threshold detection
                let alpha = (x < REF_W) ? imgData[x * 4] : 0; 
                if (alpha > 128 && !inSpan) {
                    inSpan = true;
                    x0 = x;
                } else if (alpha <= 128 && inSpan) {
                    inSpan = false;
                    let x1 = x - 1;
                    if (x1 >= x0) {
                        let mid = (x0 + x1) / 2;
                        let zone = 1; // Default to middle
                        let charIdx = 0;
                        
                        // Map midpoint to pre-measured character boundaries
                        for (let b of bounds) {
                            if (mid >= b.minX && mid <= b.maxX) {
                                charIdx = b.i;
                                break;
                            }
                        }
                        
                        if (charIdx === 0) zone = 0; // First letter
                        else if (charIdx === text.length - 1 && text.length > 1) zone = 2; // Last letter

                        segments.push({
                            row: r,
                            rowY: ROW_START + r * ROW_PITCH,
                            zone: zone,
                            x0: x0,
                            x1: x1,
                            delay: getDelay(r, zone)
                        });
                    }
                }
            }
        }
        return segments;
    }

    class DashCascade {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            
            // Dashboard UI Map
            this.textIn = document.getElementById('textIn');
            this.colorIn = document.getElementById('colorIn');
            this.scaleIn = document.getElementById('scaleIn');

            // Internal State Initialization
            this.text = this.textIn.value;
            this.baseHex = this.colorIn.value;
            this.scale = parseFloat(this.scaleIn.value);
            this.baseHSL = hexToHsl(this.baseHex);

            this.segments = [];
            this.globalFrame = 0;
            this.hueClock = 0;
            this.hoverTarget = 0;
            this.hoverState = 0;

            this.isActive = true;
            this.lastTime = performance.now();
            this.accumulator = 0;
            
            this.W = 0;
            this.H = 0;

            this.initEvents();
            this.parseText();
            
            this.loop = this.loop.bind(this);
            requestAnimationFrame(this.loop);
        }

        initEvents() {
            // Dashboard Listeners
            this.textIn.addEventListener('input', e => {
                this.text = e.target.value || " ";
                this.parseText();
            });
            this.colorIn.addEventListener('input', e => {
                this.baseHex = e.target.value;
                this.baseHSL = hexToHsl(this.baseHex);
            });
            this.scaleIn.addEventListener('input', e => {
                this.scale = parseFloat(e.target.value);
            });

            // Hover Micro-interactions
            this.canvas.addEventListener('mouseenter', () => this.hoverTarget = 1);
            this.canvas.addEventListener('mouseleave', () => this.hoverTarget = 0);

            // Responsive Handlers
            const ro = new ResizeObserver(() => this.resize());
            ro.observe(document.body);

            // Performance Handlers
            const io = new IntersectionObserver(entries => {
                this.isActive = entries[0].isIntersecting;
            }, { threshold: 0.2 });
            io.observe(this.canvas);

            document.addEventListener('visibilitychange', () => {
                this.isActive = !document.hidden;
            });
        }

        resize() {
            const dpr = window.devicePixelRatio || 1;
            this.W = window.innerWidth * dpr;
            this.H = window.innerHeight * dpr;
            this.canvas.width = this.W;
            this.canvas.height = this.H;
        }

        parseText() {
            this.segments = generateWordSegments(this.text);
        }

        loop(time) {
            requestAnimationFrame(this.loop);

            // Suspend logic if out of view
            if (!this.isActive) {
                this.lastTime = time;
                return;
            }

            let dt = (time - this.lastTime) / 1000;
            this.lastTime = time;
            if (dt > 0.5) dt = 0.5; // Prevent large delta jumps on tab switches

            // Linear Hover State Integration over 0.5s Ease
            let step = dt / 0.5;
            if (this.hoverState < this.hoverTarget) this.hoverState = Math.min(1, this.hoverState + step);
            if (this.hoverState > this.hoverTarget) this.hoverState = Math.max(0, this.hoverState - step);

            // Color Speed Drift (Multiplies by 1.6 on hover)
            let speedMult = 1 + 0.6 * this.hoverState;
            this.hueClock += dt * speedMult;

            // Frame Step Locking logic (Exactly 10 FPS)
            this.accumulator += dt;
            const frameTime = 1 / FPS_LIMIT;

            if (this.accumulator >= frameTime) {
                let ticks = Math.floor(this.accumulator / frameTime);
                this.accumulator -= ticks * frameTime;
                this.globalFrame += ticks;
                
                // Triggers matrix redraw exactly on frame tick
                this.render();
            }
        }

        render() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.W, this.H);

            const offsetX = (this.W - REF_W * this.scale) / 2;
            const offsetY = (this.H - REF_H * this.scale) / 2;

            ctx.lineCap = 'round';
            ctx.lineWidth = STROKE_HEIGHT * this.scale;

            let satLift = 0.07 * this.hoverState;

            this.segments.forEach(seg => {
                // Wave Math mapping 80 global frames to 25 peak frames
                let t = Math.floor(this.globalFrame - seg.delay * 3) % 80;
                if (t < 0) t += 80;
                let val = (t >= 0 && t < WAVE.length) ? WAVE[t] : 0;
                let multiplier = 1 - val; // The peak pushes the dash towards the zero-axis

                // Axis contraction map
                let mX0 = AXIS + (seg.x0 - AXIS) * multiplier;
                let mX1 = AXIS + (seg.x1 - AXIS) * multiplier;
                
                let width = (mX1 - mX0) * this.scale;
                let drawY = offsetY + seg.rowY * this.scale;

                // Tri-band Overlapping Cosines for Shimmering Color Generation
                let u = 0.02, v = 0.3, s1 = 2, s2 = 3;
                let hueShift = Math.cos(this.hueClock * s1 + mX0 * u) * 12 + 
                               Math.cos(this.hueClock * s2 + seg.row * v) * 12;

                let h = this.baseHSL[0] + hueShift;
                let s = Math.min(100, (this.baseHSL[1] + satLift) * 100);
                let l = this.baseHSL[2] * 100;

                ctx.strokeStyle = `hsl(${h}, ${s}%, ${l}%)`;
                ctx.fillStyle = ctx.strokeStyle;

                // Path execution logic based on physical geometric threshold
                ctx.beginPath();
                if (width < 0.5) {
                    // Force a perfect circle via arc if horizontal width approaches zero
                    let cx = offsetX + ((mX0 + mX1) / 2) * this.scale;
                    ctx.arc(cx, drawY, (STROKE_HEIGHT / 2) * this.scale, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Classic dash segments
                    ctx.moveTo(offsetX + mX0 * this.scale, drawY);
                    ctx.lineTo(offsetX + mX1 * this.scale, drawY);
                    ctx.stroke();
                }
            });
        }
    }

    // Engine Bootstrap
    window.addEventListener('DOMContentLoaded', () => {
        new DashCascade(document.getElementById('matrixCanvas'));
    });
    </script>
</body>
</html>
