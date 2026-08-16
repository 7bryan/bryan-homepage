"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  vertexShader,
  fragmentShader,
  fragmentShaderGlow,
} from "./shaders/flowingSheet";

const SEGMENTS = 200; // resolution along the curve's length
const ROWS = 18; // resolution across the width — raised from 13 for a
// smoother silhouette now that normals are curvature-based (see shader).

// Color presets — each is [core, mid, rim, hot, glow] as 0..1 RGB triples.
// Same brightness/contrast balance as the original indigo palette, just
// hue-shifted, so every theme stays equally "restrained/dark" rather than
// some looking washed out or blown out relative to the others.
export const FLOWING_SHEET_THEMES = {
  // Default — cool indigo/blue-violet (Home).
  indigo: {
    core: [0.014, 0.018, 0.032],
    mid: [0.05, 0.045, 0.13],
    rim: [0.11, 0.14, 0.38],
    hot: [0.22, 0.24, 0.5],
    glow: [0.09, 0.11, 0.3],
  },
  // Magenta/violet (e.g. Projects).
  magenta: {
    core: [0.03, 0.012, 0.03],
    mid: [0.13, 0.03, 0.12],
    rim: [0.42, 0.08, 0.35],
    hot: [0.55, 0.15, 0.45],
    glow: [0.32, 0.07, 0.28],
  },
  // Teal/cyan (e.g. About).
  teal: {
    core: [0.01, 0.03, 0.03],
    mid: [0.03, 0.12, 0.12],
    rim: [0.07, 0.35, 0.38],
    hot: [0.15, 0.5, 0.5],
    glow: [0.06, 0.28, 0.3],
  },
  // Aurora green (e.g. Writing).
  aurora: {
    core: [0.012, 0.03, 0.015],
    mid: [0.03, 0.13, 0.05],
    rim: [0.08, 0.4, 0.15],
    hot: [0.2, 0.55, 0.25],
    glow: [0.07, 0.32, 0.12],
  },
  // Warm amber/gold (e.g. Resume/Contact).
  amber: {
    core: [0.03, 0.02, 0.01],
    mid: [0.13, 0.09, 0.02],
    rim: [0.4, 0.28, 0.06],
    hot: [0.55, 0.4, 0.12],
    glow: [0.32, 0.22, 0.05],
  },
} as const;

export type FlowingSheetTheme = keyof typeof FLOWING_SHEET_THEMES;

// Route → theme mapping, used when no explicit `theme` prop is passed.
// EDIT THIS to match your actual routes/desired colors — this is the one
// place that controls "which page gets which color."
const ROUTE_THEMES: Record<string, FlowingSheetTheme> = {
  "/": "indigo",
  "/projects": "teal",
  "/about": "magenta",
  "/contact": "amber",
};

function themeForPathname(pathname: string | null): FlowingSheetTheme {
  if (!pathname) return "indigo";
  if (ROUTE_THEMES[pathname]) return ROUTE_THEMES[pathname];
  // Fallback for nested routes, e.g. "/projects/some-slug" still gets the
  // "/projects" theme.
  const topLevel = "/" + (pathname.split("/")[1] ?? "");
  return ROUTE_THEMES[topLevel] ?? "indigo";
}

export default function FlowingSheet({
  reduceMotion,
  theme: themeProp,
}: {
  reduceMotion: boolean;
  // Optional explicit override. If omitted, the theme is derived
  // automatically from the current route via ROUTE_THEMES above — this is
  // what makes the color change on navigation even when FlowingSheet is
  // mounted once in a persistent layout rather than per-page.
  theme?: FlowingSheetTheme;
}) {
  const pathname = usePathname();
  const theme = themeProp ?? themeForPathname(pathname);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const glowMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const { geometry, curveLength } = useMemo(() => {
    const vw = viewport.width;
    const vh = viewport.height;

    // Multiple large bends occupying the upper region, entering from the
    // left and exiting off the right — verified numerically (outside this
    // component) to have zero intersection with the hero text's bounding
    // box, and to have ~12 local direction changes (genuine multi-lobe
    // folding, not one gentle S-curve).
    const xOffset = 0.2; // shifts the whole curve right, in vw units — tweak this to move it further left/right
    const points = [
      new THREE.Vector3((-1.3 + xOffset) * vw, 0.35 * vh, -0.3),
      new THREE.Vector3((-0.95 + xOffset) * vw, 0.55 * vh, 0.4),
      new THREE.Vector3((-0.55 + xOffset) * vw, 0.3 * vh, -0.4),
      new THREE.Vector3((-0.15 + xOffset) * vw, 0.52 * vh, 0.5),
      new THREE.Vector3((0.15 + xOffset) * vw, 0.1 * vh, -0.3),
      new THREE.Vector3((0.5 + xOffset) * vw, 0.55 * vh, 0.4),
      new THREE.Vector3((0.85 + xOffset) * vw, -0.05 * vh, -0.35),
      new THREE.Vector3((1.2 + xOffset) * vw, 0.35 * vh, 0.3),
    ];
    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.55);
    const curveLength = curve.getLength();

    const framePoints = curve.getSpacedPoints(SEGMENTS);
    const frames = curve.computeFrenetFrames(SEGMENTS, false);

    const positions: number[] = [];
    const centers: number[] = [];
    const tangents: number[] = [];
    const frenetNormals: number[] = [];
    const frenetBinormals: number[] = [];
    const us: number[] = [];
    const rowTs: number[] = [];
    const uvs: number[] = [];

    for (let i = 0; i <= SEGMENTS; i++) {
      const u = i / SEGMENTS;
      const c = framePoints[i];
      const t = frames.tangents[i];
      const n = frames.normals[i];
      const b = frames.binormals[i];

      for (let j = 0; j < ROWS; j++) {
        const rowT = (j / (ROWS - 1)) * 2 - 1; // -1..1 across the width

        // The vertex shader fully recomputes the real displaced position;
        // this is just a valid placeholder for BufferGeometry's required
        // "position" attribute.
        positions.push(c.x, c.y, c.z);
        centers.push(c.x, c.y, c.z);
        tangents.push(t.x, t.y, t.z);
        frenetNormals.push(n.x, n.y, n.z);
        frenetBinormals.push(b.x, b.y, b.z);
        us.push(u);
        rowTs.push(rowT);
        uvs.push(u, j / (ROWS - 1));
      }
    }

    const indices: number[] = [];
    const idx = (i: number, j: number) => i * ROWS + j;
    for (let i = 0; i < SEGMENTS; i++) {
      for (let j = 0; j < ROWS - 1; j++) {
        const a = idx(i, j);
        const b2 = idx(i, j + 1);
        const c2 = idx(i + 1, j);
        const d = idx(i + 1, j + 1);
        indices.push(a, c2, b2);
        indices.push(b2, c2, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geo.setAttribute("aCenter", new THREE.Float32BufferAttribute(centers, 3));
    geo.setAttribute("aTangent", new THREE.Float32BufferAttribute(tangents, 3));
    geo.setAttribute(
      "aFrenetNormal",
      new THREE.Float32BufferAttribute(frenetNormals, 3),
    );
    geo.setAttribute(
      "aFrenetBinormal",
      new THREE.Float32BufferAttribute(frenetBinormals, 3),
    );
    geo.setAttribute("aU", new THREE.Float32BufferAttribute(us, 1));
    geo.setAttribute("aRowT", new THREE.Float32BufferAttribute(rowTs, 1));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);

    return { geometry: geo, curveLength };
  }, [viewport.width, viewport.height]);

  const palette = FLOWING_SHEET_THEMES[theme];

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      // Increased again from the previous 0.42 — still read as too thin.
      uBaseWidth: { value: viewport.height * 0.62 },
      uExpand: { value: 1.0 },
      uCurveLength: { value: curveLength },
      uCore: { value: new THREE.Color(...palette.core) },
      uMid: { value: new THREE.Color(...palette.mid) },
      uRim: { value: new THREE.Color(...palette.rim) },
      uHot: { value: new THREE.Color(...palette.hot) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [curveLength, theme],
  );

  // Separate uniforms object for the glow pass — same base width/time, but
  // puffed outward (uExpand > 1) to render a soft halo behind the main
  // surface using the identical geometry and vertex math.
  const glowUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseWidth: { value: viewport.height * 0.62 },
      uExpand: { value: 1.35 },
      uCurveLength: { value: curveLength },
      uGlowColor: { value: new THREE.Color(...palette.glow) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [curveLength, theme],
  );

  useFrame((state) => {
    const vh = viewport.height;
    if (materialRef.current) {
      materialRef.current.uniforms.uBaseWidth.value = vh * 0.62;
    }
    if (glowMaterialRef.current) {
      glowMaterialRef.current.uniforms.uBaseWidth.value = vh * 0.62;
    }
    if (reduceMotion) return;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (glowMaterialRef.current) {
      glowMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    // Deliberately no group rotation this time — the spec was explicit
    // that the whole object should never spin; all motion now lives in
    // the per-vertex fold animation instead.
  });

  return (
    <group ref={groupRef}>
      {/* frustumCulled disabled on both meshes: the vertex shader displaces
          geometry well outside the raw "position" attribute's bounds
          (which only holds the undisplaced curve centerline), so Three's
          automatic bounding-sphere culling would be computed from the
          wrong data. */}
      <mesh geometry={geometry} frustumCulled={false} renderOrder={0}>
        <shaderMaterial
          ref={glowMaterialRef}
          uniforms={glowUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShaderGlow}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={geometry} frustumCulled={false} renderOrder={1}>
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
