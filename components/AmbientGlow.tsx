"use client";

import dynamic from "next/dynamic";

const AuroraCanvas = dynamic(() => import("./AuroraCanvas"), {
  ssr: false,
});

export default function AmbientGlow() {
  return <AuroraCanvas />;
}
