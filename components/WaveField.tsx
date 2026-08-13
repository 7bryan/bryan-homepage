"use client";

import { useEffect, useRef } from "react";

// Compact, self-contained 2D gradient (Perlin-style) noise — no dependencies.
function createNoise2D(seed: number) {
  const perm = new Uint8Array(256);
  for (let i = 0; i < 256; i++) perm[i] = i;

  let s = seed;
  function rand() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  }
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = perm[i];
    perm[i] = perm[j];
    perm[j] = tmp;
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

  const gradients: [number, number][] = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  function fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  function lerp(a: number, b: number, t: number) {
    return a + t * (b - a);
  }
  function grad(hash: number, x: number, y: number) {
    const g = gradients[hash & 7];
    return g[0] * x + g[1] * y;
  }

  return function noise2D(x: number, y: number) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = p[p[X] + Y];
    const ab = p[p[X] + Y + 1];
    const ba = p[p[X + 1] + Y];
    const bb = p[p[X + 1] + Y + 1];
    const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
    const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);
    return (lerp(x1, x2, v) + 1) / 2;
  };
}

const NUM_STRANDS = 8;
const STRAND_SPACING = 13; // px between adjacent strands in the bundle
const STEP_LEN = 7;

type StrandConfig = {
  offset: number;
  peakAlpha: number;
  lineWidth: number;
  glow: boolean;
  wobbleSeed: number;
};

export default function WaveField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const noise2D = createNoise2D(1337);
    const NOISE_SCALE = 0.0022;
    const TIME_SCALE = 0.00004;
    const BASE_ANGLE = -0.5; // radians — general up-right drift direction
    const ANGLE_SPAN = 1.3; // curl amount layered on top of the base drift

    let width = 0;
    let height = 0;
    let steps = 0;
    let startX = 0;
    let startY = 0;
    let rafId = 0;
    let time = 0;

    const strands: StrandConfig[] = Array.from(
      { length: NUM_STRANDS },
      (_, i) => {
        const centerDist =
          Math.abs(i - (NUM_STRANDS - 1) / 2) / ((NUM_STRANDS - 1) / 2);
        const isHighlight = centerDist < 0.4;
        return {
          offset: (i - (NUM_STRANDS - 1) / 2) * STRAND_SPACING,
          peakAlpha: isHighlight
            ? 0.32 - centerDist * 0.2
            : 0.1 - centerDist * 0.03,
          lineWidth: isHighlight ? 1.7 : 1.1,
          glow: isHighlight,
          wobbleSeed: i * 1.7,
        };
      },
    );

    function angleAt(x: number, y: number, t: number) {
      const n = noise2D(x * NOISE_SCALE, y * NOISE_SCALE + t * TIME_SCALE);
      return BASE_ANGLE + (n - 0.5) * ANGLE_SPAN;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Enter from the lower-left, off-canvas, so the path is already
      // established before it becomes visible.
      startX = -200;
      startY = height * 0.58;

      // Guarantee the path fully exits the canvas rather than running out
      // of steps mid-screen — this is what caused the old "cut off" look.
      const travel = Math.hypot(width, height) * 1.6;
      steps = Math.ceil(travel / STEP_LEN);
    }

    function tracePath(t: number) {
      const points: { x: number; y: number; dx: number; dy: number }[] = [];
      let x = startX;
      let y = startY;
      const pad = 400;

      for (let i = 0; i < steps; i++) {
        const angle = angleAt(x, y, t);
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        x += dx * STEP_LEN;
        y += dy * STEP_LEN;
        points.push({ x, y, dx, dy });
        if (x < -pad || x > width + pad || y < -pad || y > height + pad) {
          break;
        }
      }
      return points;
    }

    function drawFrame(t: number) {
      ctx!.clearRect(0, 0, width, height);
      const spine = tracePath(t);
      if (spine.length < 2) return;

      for (const strand of strands) {
        let firstX = 0;
        let firstY = 0;
        let lastX = 0;
        let lastY = 0;

        ctx!.beginPath();
        for (let i = 0; i < spine.length; i++) {
          const pt = spine[i];
          // Normal to the path direction, for lateral offset.
          const nx = -pt.dy;
          const ny = pt.dx;
          const wobble =
            Math.sin(t * 0.00005 + strand.wobbleSeed) * 3 +
            Math.sin(i * 0.05 + strand.wobbleSeed * 2) * 2;
          const ox = pt.x + nx * (strand.offset + wobble);
          const oy = pt.y + ny * (strand.offset + wobble);

          if (i === 0) {
            firstX = ox;
            firstY = oy;
            ctx!.moveTo(ox, oy);
          } else {
            ctx!.lineTo(ox, oy);
          }
          lastX = ox;
          lastY = oy;
        }

        const gradient = ctx!.createLinearGradient(
          firstX,
          firstY,
          lastX,
          lastY,
        );
        const a = strand.peakAlpha;
        gradient.addColorStop(0, "rgba(255,255,255,0)");
        gradient.addColorStop(0.16, `rgba(255,255,255,${a * 0.7})`);
        gradient.addColorStop(0.5, `rgba(255,255,255,${a})`);
        gradient.addColorStop(0.84, `rgba(255,255,255,${a * 0.7})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = strand.lineWidth;
        if (strand.glow) {
          ctx!.shadowColor = "rgba(255,255,255,0.3)";
          ctx!.shadowBlur = 5;
        } else {
          ctx!.shadowBlur = 0;
        }
        ctx!.stroke();
      }
      ctx!.shadowBlur = 0;
    }

    function loop() {
      time += 16;
      drawFrame(time);
      rafId = requestAnimationFrame(loop);
    }

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else if (!reduceMotion) {
        loop();
      }
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    if (reduceMotion) {
      drawFrame(0);
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
