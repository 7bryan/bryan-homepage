"use client";

import { Canvas } from "@react-three/fiber";
import FlowingSheet from "./FlowingSheet";

export default function AuroraCanvas() {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ fov: 45, position: [0, 0, 6], near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <FlowingSheet reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
