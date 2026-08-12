"use client";

import { useEffect, useRef } from "react";

type WaveLine = {
  baseY: number;
  amp1: number;
  amp2: number;
  freq1: number;
  freq2: number;
  speed1: number;
  speed2: number;
  phase: number;
  alpha: number;
  lineWidth: number;
  glow: boolean;
};

export default function WaveField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let lines: WaveLine[] = [];
    let rafId = 0;
    let time = 0;

    function buildLines() {
      const count = Math.max(8, Math.min(14, Math.round(width / 160)));
      const spacing = height / count;
      lines = Array.from({ length: count }, (_, i) => {
        const isHighlight = Math.random() < 0.22;
        return {
          baseY:
            (i + 0.5) * spacing + (Math.random() - 0.5) * spacing * 0.5,
          amp1: 18 + Math.random() * 34,
          amp2: 8 + Math.random() * 18,
          freq1: 0.0018 + Math.random() * 0.0016,
          freq2: 0.004 + Math.random() * 0.003,
          speed1: 0.15 + Math.random() * 0.15,
          speed2: 0.25 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
          alpha: isHighlight
            ? 0.12 + Math.random() * 0.08
            : 0.025 + Math.random() * 0.035,
          lineWidth: isHighlight ? 1.6 : 1.1 + Math.random() * 0.4,
          glow: isHighlight,
        };
      });
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
      buildLines();
    }

    function drawFrame(t: number) {
      ctx!.clearRect(0, 0, width, height);
      const step = Math.max(6, Math.round(width / 220));

      for (const line of lines) {
        ctx!.beginPath();
        for (let x = -20; x <= width + 20; x += step) {
          const y =
            line.baseY +
            Math.sin(x * line.freq1 + t * line.speed1 + line.phase) *
              line.amp1 +
            Math.sin(x * line.freq2 - t * line.speed2 + line.phase * 1.6) *
              line.amp2;
          if (x === -20) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.strokeStyle = `rgba(255,255,255,${line.alpha})`;
        ctx!.lineWidth = line.lineWidth;
        if (line.glow) {
          ctx!.shadowColor = "rgba(255,255,255,0.35)";
          ctx!.shadowBlur = 6;
        } else {
          ctx!.shadowBlur = 0;
        }
        ctx!.stroke();
      }
      ctx!.shadowBlur = 0;
    }

    function loop() {
      time += 0.016;
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
