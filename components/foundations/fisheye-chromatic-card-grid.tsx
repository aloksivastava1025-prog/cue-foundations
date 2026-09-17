/**
 * Cue Foundations · Fisheye Chromatic Card Grid
 * ────────────────────────────────────────────
 * An infinitely wrapping draggable 5×5 grid of image cards rendered in Three.js with a custom shader that bulges edges and splits RGB channels.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/fisheye-chromatic-card-grid.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue059
 *
 * Original Cue ID: cue059
 * Category: 3D & WebGL
 * ────────────────────────────────────────────
 */

/**
 * Edge Distortion Gallery — Infinite WebGL Card Grid with Fisheye + Chromatic Aberration
 * React + TypeScript + Three.js (npm i three @types/three)
 *
 * Usage:
 *   import EdgeDistortionGallery from './EdgeDistortionGallery';
 *   <EdgeDistortionGallery images={['/img1.jpg', '/img2.jpg', ...]} />
 *
 * Uses Three.js r128-compatible ESM imports. No addons scripts needed — imports
 * `EffectComposer`, `RenderPass`, `ShaderPass` from `three/examples/jsm/`.
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass }     from 'three/examples/jsm/postprocessing/ShaderPass.js';

const DEFAULT_IMAGES = [
  'https://i.pinimg.com/736x/aa/07/71/aa0771966b0d5b5060bf2c658c04b189.jpg',
  'https://i.pinimg.com/736x/c7/ce/94/c7ce943d488adaed5d08095d47561eb6.jpg',
  'https://i.pinimg.com/1200x/f6/39/84/f63984b0872a25e95bcadbe3bda3a275.jpg',
  'https://i.pinimg.com/236x/5d/7d/c4/5d7dc470354274887e4bfaf684906d0f.jpg',
  'https://i.pinimg.com/1200x/1b/06/4f/1b064f821cccc5aad2fb6adbd8325fad.jpg',
  'https://i.pinimg.com/736x/f6/7b/c8/f67bc8f81a69fef994f5d44d29fca451.jpg',
];

interface EdgeDistortionGalleryProps {
  images?: string[];
  /** wsrv.nl proxy prefix — needed for CORS-blocked hosts like Pinterest */
  corsProxy?: string;
  /** background CSS color for the canvas */
  bg?: string;
  /** grid rows/cols (default 5×5) */
  gridSize?: number;
  /** idle drift velocity (world units/frame) */
  drift?: [number, number];
}

const EDGE_DISTORTION_SHADER = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      vec2 uv  = vUv;
      vec2 pos = uv * 2.0 - 1.0;
      float r  = max(abs(pos.x), abs(pos.y));
      float edgeStrength = smoothstep(0.75, 1.05, r);
      float k = 0.3 * edgeStrength;
      vec2 distortedPos = pos / (1.0 + k * r * r);
      vec2 warpUv = distortedPos * 0.5 + 0.5;
      float offsetAmount = edgeStrength * 0.008;
      vec2 offset = normalize(pos) * offsetAmount;
      float red   = texture2D(tDiffuse, warpUv + offset).r;
      float green = texture2D(tDiffuse, warpUv).g;
      float blue  = texture2D(tDiffuse, warpUv - offset).b;
      gl_FragColor = vec4(red, green, blue, 1.0);
    }
  `,
};

function createRoundedAlphaMask(w = 600, h = 750, radius = 40): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  if ((ctx as any).roundRect) (ctx as any).roundRect(0, 0, w, h, radius);
  else ctx.rect(0, 0, w, h);
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

export default function EdgeDistortionGallery({
  images = DEFAULT_IMAGES,
  corsProxy = 'https://wsrv.nl/?url=',
  bg = '#ffffff',
  gridSize = 5,
  drift = [1.0, -0.5],
}: EdgeDistortionGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const mount = containerRef.current;

    // ── Scene / camera / renderer ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bg);

    const frustumSize = 2000;
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) /  2,
      frustumSize / 2,
      frustumSize / -2,
      -1000, 1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ── Alpha mask + grid ──
    const alphaMap = createRoundedAlphaMask(600, 750, 40);
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'Anonymous';
    const cardGeometry = new THREE.PlaneGeometry(600, 750);
    const cards: THREE.Mesh[] = [];

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const idx = (i * gridSize + j) % images.length;
        const proxied = corsProxy + encodeURIComponent(images[idx]);
        const texture = loader.load(proxied);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          alphaMap,
          transparent: true,
          alphaTest: 0.1,
        });
        const card = new THREE.Mesh(cardGeometry, material);
        const c = (gridSize - 1) / 2;
        card.position.x = (i - c) *  800;
        card.position.y = (j - c) * -950;
        scene.add(card);
        cards.push(card);
      }
    }

    // ── Post-processing ──
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const distortionPass = new ShaderPass(EDGE_DISTORTION_SHADER);
    (distortionPass as any).renderToScreen = true;
    composer.addPass(distortionPass);

    // ── Interaction state ──
    let isDragging = false;
    let prev = { x: 0, y: 0 };
    let driftX = drift[0], driftY = drift[1];
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      driftX = 0; driftY = 0;
    }
    const panSpeed = (frustumSize / window.innerHeight) * 1.5;

    // ── Handlers ──
    const onDown = (x: number, y: number) => { isDragging = true; prev = { x, y }; };
    const onMove = (x: number, y: number) => {
      if (!isDragging) return;
      const dx = x - prev.x, dy = y - prev.y;
      camera.position.x -= dx * panSpeed;
      camera.position.y += dy * panSpeed;
      prev = { x, y };
    };
    const onUp = () => { isDragging = false; };

    const md = (e: MouseEvent) => onDown(e.offsetX, e.offsetY);
    const mm = (e: MouseEvent) => onMove(e.offsetX, e.offsetY);
    const mu = () => onUp();
    const ml = () => onUp();

    const ts = (e: TouchEvent) => onDown(e.touches[0].clientX, e.touches[0].clientY);
    const tm = (e: TouchEvent) => onMove(e.touches[0].clientX, e.touches[0].clientY);
    const te = () => onUp();

    window.addEventListener('mousedown', md);
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
    window.addEventListener('mouseleave', ml);
    window.addEventListener('touchstart', ts);
    window.addEventListener('touchmove', tm);
    window.addEventListener('touchend', te);

    // ── Animate + infinite wrap ──
    const thresholdX = 800 * (gridSize / 2);
    const thresholdY = 950 * (gridSize / 2);

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!isDragging) {
        camera.position.x += driftX;
        camera.position.y += driftY;
      }
      cards.forEach(card => {
        if (card.position.x < camera.position.x - thresholdX) card.position.x += thresholdX * 2;
        if (card.position.x > camera.position.x + thresholdX) card.position.x -= thresholdX * 2;
        if (card.position.y < camera.position.y - thresholdY) card.position.y += thresholdY * 2;
        if (card.position.y > camera.position.y + thresholdY) card.position.y -= thresholdY * 2;
      });
      composer.render();
    };
    animate();

    // ── Resize ──
    const onResize = () => {
      const a = window.innerWidth / window.innerHeight;
      camera.left   = (frustumSize * a) / -2;
      camera.right  = (frustumSize * a) /  2;
      camera.top    =  frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup on unmount ──
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousedown', md);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
      window.removeEventListener('mouseleave', ml);
      window.removeEventListener('touchstart', ts);
      window.removeEventListener('touchmove', tm);
      window.removeEventListener('touchend', te);
      window.removeEventListener('resize', onResize);
      cards.forEach(c => {
        (c.material as THREE.MeshBasicMaterial).dispose();
        (c.material as THREE.MeshBasicMaterial).map?.dispose();
      });
      cardGeometry.dispose();
      alphaMap.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [images, corsProxy, bg, gridSize, drift[0], drift[1]]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0,
        cursor: 'grab',
        overflow: 'hidden',
      }}
      onMouseDown={(e) => { (e.currentTarget as HTMLDivElement).style.cursor = 'grabbing'; }}
      onMouseUp={(e)   => { (e.currentTarget as HTMLDivElement).style.cursor = 'grab'; }}
    />
  );
}
