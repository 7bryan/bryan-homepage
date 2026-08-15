"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  vertexShader,
  fragmentShader,
  fragmentShaderGlow,
} from "./shaders/flowingSheet";

const SEGMENTS = 200; // resolution along the curve's length
const ROWS = 13; // resolution across the width — raised from 9 to smoothly
// resolve the newly added coarse fold layer without faceting.

export default function FlowingSheet({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const glowMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const vw = viewport.width;
    const vh = viewport.height;

    // Multiple large bends occupying the upper region, entering from the
    // left and exiting off the right — verified numerically (outside this
    // component) to have zero intersection with the hero text's bounding
    // box, and to have ~12 local direction changes (genuine multi-lobe
    // folding, not one gentle S-curve).
    const points = [
      new THREE.Vector3(-1.3 * vw, 0.35 * vh, -0.3),
      new THREE.Vector3(-0.95 * vw, 0.55 * vh, 0.4),
      new THREE.Vector3(-0.55 * vw, 0.3 * vh, -0.4),
      new THREE.Vector3(-0.15 * vw, 0.52 * vh, 0.5),
      new THREE.Vector3(0.15 * vw, 0.1 * vh, -0.3),
      new THREE.Vector3(0.5 * vw, 0.55 * vh, 0.4),
      new THREE.Vector3(0.85 * vw, -0.05 * vh, -0.35),
      new THREE.Vector3(1.2 * vw, 0.35 * vh, 0.3),
    ];
    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.55);

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
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("aCenter", new THREE.Float32BufferAttribute(centers, 3));
    geo.setAttribute("aTangent", new THREE.Float32BufferAttribute(tangents, 3));
    geo.setAttribute("aFrenetNormal", new THREE.Float32BufferAttribute(frenetNormals, 3));
    geo.setAttribute("aFrenetBinormal", new THREE.Float32BufferAttribute(frenetBinormals, 3));
    geo.setAttribute("aU", new THREE.Float32BufferAttribute(us, 1));
    geo.setAttribute("aRowT", new THREE.Float32BufferAttribute(rowTs, 1));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);

    return geo;
  }, [viewport.width, viewport.height]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      // Increased again from the previous 0.42 — still read as too thin.
      uBaseWidth: { value: viewport.height * 0.62 },
      uExpand: { value: 1.0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Separate uniforms object for the glow pass — same base width/time, but
  // puffed outward (uExpand > 1) to render a soft halo behind the main
  // surface using the identical geometry and vertex math.
  const glowUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseWidth: { value: viewport.height * 0.62 },
      uExpand: { value: 1.35 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
