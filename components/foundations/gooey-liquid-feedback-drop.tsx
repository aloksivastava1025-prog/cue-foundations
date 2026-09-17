/**
 * Cue Foundations · Gooey Liquid Feedback Drop
 * ────────────────────────────────────────────
 * A scroll-triggered liquid blob simulated with a custom RAF physics engine and SVG gooey filter that bounces, morphs into a dark feedback modal, and rockets away on submit.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/gooey-liquid-feedback-drop.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue091
 *
 * Original Cue ID: cue091
 * Category: Visual Effects 
 * ────────────────────────────────────────────
 */

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Liquid Gravity Morphing Feedback</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #ffffff;
      --text: #1a1a1a;
      --ball: #000000;
    }

    .__cue-globals-stripped {
      margin: 0;
      padding: 0;
      background-color: var(--bg);
      font-family: 'Inter', sans-serif;
      color: var(--text);
      /* Extremely tall body to allow scrolling */
      height: 300vh;
      overflow-x: hidden;
    }

    /* Dummy Editorial Content */
    .hero {
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .hero h1 { font-size: 5vw; font-weight: 500; letter-spacing: -2px; margin: 0; }
    .hero p { font-size: 1.5vw; color: #666; margin-top: 1rem; }
    
    .content-block {
      max-width: 800px;
      margin: 0 auto 200px auto;
      padding: 2rem;
    }
    .content-block h2 { font-size: 2.5rem; letter-spacing: -1px; margin-bottom: 2rem;}
    .content-block p { font-size: 1.25rem; line-height: 1.6; color: #444; margin-bottom: 2rem;}

    /* The Gravity Object Container */
    #gravity-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1000;
      display: flex;
      justify-content: center;
    }

    /* The SVG Gooey Filter makes the drop stretchy and liquid! */
    .gooey-active {
      filter: url('#goo');
      -webkit-filter: url('#goo');
    }

    /* The "Tap" or source of the liquid at the top of the screen */
    #liquid-tap {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 280px; /* Much wider tap so the surface tension spreads more broadly */
      height: 60px;
      background-color: var(--ball);
      border-radius: 10px; /* Flat top, rounded edges */
      transition: opacity 0.4s ease;
      /* Hidden initially until drop triggers */
      opacity: 0; 
    }

    /* The Shape itself */
    #morph-shape {
      position: absolute;
      background-color: var(--ball);
      /* Base resting size (the liquid drop) */
      width: 60px;
      height: 60px;
      border-radius: 50%;
      transform-origin: bottom center;
      
      /* Only transition dimensions and radius. 
         Transform (Y position and squish) is driven by JS! */
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      /* Hidden initially */
      opacity: 0;
    }

    /* When expanded, we animate transform so the modal opens smoothly */
    #morph-shape.transitioning {
      transition: width 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                  height 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                  border-radius 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                  background-color 0.4s ease,
                  transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Make it clickable once it rests */
    #morph-shape.resting {
      pointer-events: auto;
      cursor: pointer;
    }

    /* Drop Shadow only applies when resting */
    #morph-shape.resting-shadow {
      box-shadow: 0 30px 60px rgba(0,0,0,0.2);
    }

    #morph-shape.resting:hover {
      background-color: #1a1a1a;
      transform: translate(calc(var(--x) * 1px), calc(var(--y) * 1px - 5px)) scale(1.05) !important;
    }

    /* Expanded Modal Form State */
    #morph-shape.expanded {
      width: 380px;
      height: 420px;
      border-radius: 24px;
      pointer-events: auto;
      cursor: default;
    }

    /* Hint text next to the ball */
    .hint-tooltip {
      position: absolute;
      color: #888;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    /* Interior Form Elements */
    .form-content {
      width: 100%;
      height: 100%;
      padding: 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
      transition-delay: 0s;
      color: white;
    }
    
    #morph-shape.expanded .form-content {
      opacity: 1;
      pointer-events: auto;
      transition-delay: 0.3s;
    }

    .form-header {
      font-size: 24px;
      font-weight: 500;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }

    .form-sub {
      color: #888;
      font-size: 14px;
      margin-bottom: 32px;
    }

    .emoji-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;
    }
    
    .emoji-rate {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 50%;
      width: 54px;
      height: 54px;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      filter: grayscale(100%) opacity(0.6);
    }
    .emoji-rate:hover, .emoji-rate.selected {
      filter: grayscale(0%) opacity(1);
      transform: scale(1.15);
      border-color: rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.05);
    }

    .input-field {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 16px;
      color: white;
      font-family: inherit;
      font-size: 14px;
      resize: none;
      height: 80px;
      margin-bottom: 24px;
      outline: none;
      transition: border 0.2s;
    }
    .input-field:focus {
      border-color: rgba(255,255,255,0.4);
    }

    .submit-btn {
      background: white;
      color: black;
      border: none;
      border-radius: 100px;
      padding: 16px;
      font-weight: 500;
      font-size: 15px;
      cursor: pointer;
      transition: transform 0.2s ease, opacity 0.2s;
    }
    .submit-btn:hover {
      transform: scale(1.02);
    }
    .submit-btn:active {
      transform: scale(0.98);
    }

  </style>
</head>
<body>

  <!-- SVG Filter for the Liquid Detach Sequence -->
  <svg width="0" height="0" style="position: absolute;">
    <defs>
      <!-- Explicitly setting large bounds (x, y, width, height) prevents the SVG filter from clipping moving elements -->
      <filter id="goo" x="-50%" y="-50%" width="200%" height="200%">
        <!-- Blur creates the swelling/necking base. -->
        <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
        <!-- Alpha threshold creates the sharp edge and the snap! -->
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
    </defs>
  </svg>

  <div class="hero">
    <h1>Liquid Detach Interaction</h1>
    <p>Scroll down to see the exact 5-stage water detachment sequence.</p>
    <div style="margin-top: 40px; font-size: 32px; animation: bounce 2s infinite;">&darr;</div>
  </div>

  <div class="content-block">
    <div style="height: 1000px;"></div>
  </div>

  <!-- The Physics Overlay -->
  <div id="gravity-container">
    
    <!-- The origin "Tap" -->
    <div id="liquid-tap"></div>

    <div class="hint-tooltip" id="hint">Got a sec? &rarr;</div>
    
    <!-- The falling drop that turns into a modal -->
    <div id="morph-shape">
      <div class="form-content">
        <div class="form-header">How's the experience?</div>
        <div class="form-sub">We'd love to hear your thoughts.</div>
        
        <div class="emoji-row">
          <button class="emoji-rate">😡</button>
          <button class="emoji-rate">😕</button>
          <button class="emoji-rate">😐</button>
          <button class="emoji-rate">😃</button>
          <button class="emoji-rate">🔥</button>
        </div>

        <textarea class="input-field" placeholder="Tell us why..."></textarea>
        <button class="submit-btn" id="submit-btn">Send Feedback</button>
      </div>
    </div>
  </div>

  <script>
    const container = document.getElementById('gravity-container');
    const shape = document.getElementById('morph-shape');
    const tap = document.getElementById('liquid-tap');
    const hint = document.getElementById('hint');
    const submitBtn = document.getElementById('submit-btn');
    const emojis = document.querySelectorAll('.emoji-rate');
    
    // Physics State
    let triggered = false;
    let state = 'hidden'; // hidden, swelling, falling, resting, expanded, submitted
    
    // Y-axis physics
    let y = -20; // Start inside the tap
    let vy = 0;
    let swellVy = 0.5; // Initial dripping speed
    const gravity = 1.2;
    const bounceFactorY = 0.55; 
    
    // X-axis physics (Rightward bounce logic)
    let x = 0;
    let vx = 0; // Starts at 0, drops straight down!
    const bounceFactorX = 0.8;
    const frictionX = 0.94; // Slows down rolling

    // Scale for squish effect
    let scaleX = 1;
    let scaleY = 1;
    
    // Detach Point
    const detachY = 130; // Increased so it stretches further before snapping

    // Calculate boundaries
    const floorOffset = 60;
    let floorY = window.innerHeight - floorOffset;
    let rightWall = window.innerWidth / 2 - 60; // Max distance it can travel right

    // Window resize handler
    window.addEventListener('resize', () => {
      floorY = window.innerHeight - floorOffset;
      rightWall = window.innerWidth / 2 - 60;
      if (state === 'resting') {
        y = floorY;
        updateTransform();
      }
    });

    // Scroll Trigger
    window.addEventListener('scroll', () => {
      if (!triggered && window.scrollY > window.innerHeight * 0.3) {
        triggered = true;
        state = 'swelling'; // Phase 1: The Swell & Necking
        shape.style.opacity = '1';
        tap.style.opacity = '1';
        container.classList.add('gooey-active');
        requestAnimationFrame(physicsLoop);
      }
    });

    // The Physics Loop
    function physicsLoop() {
      if (state === 'swelling') {
        // Accelerate downwards as the drop gets heavier (instead of slowing down)
        swellVy += 0.25; 
        y += swellVy;
        
        // Steady drift to the right while attached
        x += 1.5; 
        
        // Once it reaches the snap point, gravity takes over
        if (y > detachY) {
          state = 'falling';
          vy = swellVy; // Inherit the dripping speed into freefall
          vx = 6; // Pre-apply rightward momentum as it snaps
        }

      } else if (state === 'falling') {
        // Phase 2: Freefall & Bounce
        vy += gravity;
        y += vy;
        
        // Apply Horizontal momentum
        x += vx;

        // Floor collision
        if (y >= floorY) {
          const impact = Math.abs(vy);
          y = floorY;
          vy *= -bounceFactorY;
          vx *= frictionX; // lose horizontal speed on floor friction
          
          // The moment it hits the floor for the first time, shoot it to the right!
          if (vx === 6 && impact > 10) {
            vx = 12; // Strong rightward kick on first bounce
          }
          
          // Squish effect based on impact force
          if (impact > 5) {
            scaleX = 1 + (impact * 0.015);
            scaleY = 1 - (impact * 0.015);
          }
          
          // Rest condition
          if (impact < 3 && Math.abs(y - floorY) < 5 && Math.abs(vx) < 0.5) {
            y = floorY;
            vy = 0;
            vx = 0;
            state = 'resting';
            shape.classList.add('resting');
            shape.classList.add('resting-shadow');
            
            // Remove gooey filter so the text inside the modal will render cleanly
            container.classList.remove('gooey-active');
            // Fade out the tap
            tap.style.opacity = '0';
            
            // Show hint text to the left of the final position
            setTimeout(() => {
              if (state === 'resting') {
                hint.style.opacity = '1';
              }
            }, 400);
          }
        }

        // Right Wall collision (don't roll completely off screen)
        if (x > rightWall) {
          x = rightWall;
          vx *= -bounceFactorX;
        }

      } else if (state === 'submitted') {
        // Reverse gravity (Rocket launch)
        vy -= gravity * 1.5;
        y += vy;
        
        // Stretch vertically
        scaleY = 1 + Math.abs(vy) * 0.02;
        scaleX = 1 - Math.abs(vy) * 0.01;
      }

      // Spring back scale to 1 for the squish effect
      if (state === 'falling' || state === 'submitted' || state === 'resting') {
        scaleX += (1 - scaleX) * 0.2;
        scaleY += (1 - scaleY) * 0.2;
      }

      updateTransform();

      // Keep looping if not resting or expanded
      if (state !== 'expanded' || (state === 'submitted' && y > -1000)) {
        requestAnimationFrame(physicsLoop);
      }
    }

    function updateTransform() {
      // Store current X, Y in CSS variables for hover states
      shape.style.setProperty('--x', `${x}`);
      shape.style.setProperty('--y', `${y}`);
      
      if (state === 'swelling') {
        // Pure translation while detaching
        shape.style.transform = `translate(${x}px, ${y}px)`;
      } else if (state === 'resting') {
        // Base transform (no scale) so hover CSS scale works cleanly
        shape.style.transform = `translate(${x}px, ${y}px)`;
        // Position hint to the left of the ball
        hint.style.transform = `translate(${x - 90}px, ${y - 30}px)`;
      } else if (state === 'expanded') {
        // Expand upwards: subtract height difference (420 - 60 = 360)
        shape.style.transform = `translate(${x}px, ${y - 360}px)`;
      } else {
        shape.style.transform = `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`;
      }
    }

    // Interaction handlers
    shape.addEventListener('click', (e) => {
      if (state === 'resting') {
        state = 'expanded';
        shape.classList.remove('resting');
        shape.classList.remove('resting-shadow');
        shape.classList.add('transitioning');
        shape.classList.add('expanded');
        hint.style.opacity = '0';
        
        y = floorY;
        
        // Prevent the 380px modal from clipping off the edges of the screen
        const maxSafeX = (window.innerWidth / 2) - (380 / 2) - 20; // 20px padding
        const minSafeX = -(window.innerWidth / 2) + (380 / 2) + 20;
        
        if (x > maxSafeX) x = maxSafeX;
        if (x < minSafeX) x = minSafeX;
        
        updateTransform();
      }
    });

    // Form logic
    emojis.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        emojis.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    submitBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state !== 'expanded') return;
      
      shape.classList.remove('expanded');
      submitBtn.innerText = "Sent!";
      
      setTimeout(() => {
        shape.classList.remove('transitioning');
        state = 'submitted';
        vy = -15; 
        requestAnimationFrame(physicsLoop);
      }, 500);
    });

  </script>
</body>
</html>
