// DEVELOPMENT NOTE or whatever:

// Flowing sheet shader — v3. v2 fixed the "flat ribbon" problem by adding
// rows across the width, but the surface still lit like folded PAPER: each
// vertex used one flat, hand-picked normal direction (the ribbon's cross
// vector) regardless of how much the fold math actually bent the surface
// at that point. That mismatch between "how it's shaped" and "how it's
// lit" is exactly what reads as stiff paper instead of liquid glass.
//
// Fix: compute the REAL surface normal analytically, via central
// differences of the same displacement function used to place the vertex
// (sample two neighbors along the length and two across the width, take
// the cross product of the resulting tangent vectors). Now the lighting
// continuously follows the actual curvature of every fold, which is what
// gives a smooth, liquid look instead of a faceted, papery one.
//
// Shading itself was also softened: lower-contrast fold shading, gentler
// fresnel falloffs, and calmer "fine" fold amplitude relative to the
// broad/coarse fold — fewer small crumples, more big smooth sweeps.
//
// All shape variation remains pure sine/cosine (zero noise).

export const vertexShader = /* glsl */ `
  attribute vec3 aCenter;
  attribute vec3 aTangent;
  attribute vec3 aFrenetNormal;
  attribute vec3 aFrenetBinormal;
  attribute float aU;
  attribute float aRowT;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vU;
  varying float vFoldShade;

  uniform float uTime;
  uniform float uBaseWidth;
  // Multiplies the whole cross-section outward. Used to render a second,
  // "puffed out" copy of this exact geometry as a soft glow pass behind
  // the main surface.
  uniform float uExpand;
  // Total world-space arc length of the base curve — lets us convert a
  // small step in aU into a small step in world space, so we can sample a
  // "neighboring" point along the curve for the normal calculation below.
  uniform float uCurveLength;

  // Same displacement math as before, just factored into a function so it
  // can be evaluated at the real vertex AND at its neighbors (for the
  // normal). u/rowT/center/tangent/fn/fb are passed explicitly rather than
  // reading attributes directly, so it can be reused for neighbor samples.
  vec3 computeDisplaced(float u, float rowT, vec3 center, vec3 tangent, vec3 fn, vec3 fb) {
    float widthFactor = 0.55 + 0.35 * sin(u * 5.0 + uTime * 0.035) +
      0.25 * sin(u * 11.0 - uTime * 0.025 + 1.3);
    float w = uBaseWidth * max(0.22, widthFactor) * uExpand;

    float twist = 1.2 * sin(u * 3.0 + uTime * 0.02);
    vec3 side = normalize(cos(twist) * fn + sin(twist) * fb);
    vec3 normalDir = normalize(cross(side, tangent));

    // Fine layer toned down relative to the coarse layer vs. v2 — reads as
    // a couple of big smooth sweeps with gentle secondary ripple, rather
    // than many small crumples.
    float foldSideFine = w * (
      0.3 * sin(u * 2.2 + rowT * 1.6 + uTime * 0.02) +
      0.18 * sin(u * 3.7 - rowT * 2.1 - uTime * 0.015 + 2.0)
    );
    float foldSideCoarse = w * 0.4 * sin(u * 1.1 + rowT * 0.8 + uTime * 0.012 + 0.5);
    float foldSide = foldSideFine + foldSideCoarse;

    float foldDepthFine = w * (
      0.42 * sin(u * 1.7 + rowT * 2.4 + uTime * 0.018 + 1.0) +
      0.24 * cos(u * 2.9 - rowT * 1.3 + uTime * 0.012)
    );
    float foldDepthCoarse = w * 0.5 * sin(u * 0.9 - rowT * 0.6 + uTime * 0.01 + 2.2);
    float foldDepth = foldDepthFine + foldDepthCoarse;

    return center + side * (rowT * w * 0.5 + foldSide) + normalDir * foldDepth;
  }

  void main() {
    vUv = uv;
    vU = aU;

    float twist = 1.2 * sin(aU * 3.0 + uTime * 0.02);
    vec3 side = normalize(cos(twist) * aFrenetNormal + sin(twist) * aFrenetBinormal);
    vec3 normalDir = normalize(cross(side, aTangent));

    vec3 displaced = computeDisplaced(aU, aRowT, aCenter, aTangent, aFrenetNormal, aFrenetBinormal);

    // --- Analytic normal via central differences ---
    float epsU = 0.35 / 200.0;
    float epsV = 0.06;

    vec3 centerU1 = aCenter + aTangent * (epsU * uCurveLength);
    vec3 centerU0 = aCenter - aTangent * (epsU * uCurveLength);

    vec3 pU1 = computeDisplaced(aU + epsU, aRowT, centerU1, aTangent, aFrenetNormal, aFrenetBinormal);
    vec3 pU0 = computeDisplaced(aU - epsU, aRowT, centerU0, aTangent, aFrenetNormal, aFrenetBinormal);
    vec3 pV1 = computeDisplaced(aU, aRowT + epsV, aCenter, aTangent, aFrenetNormal, aFrenetBinormal);
    vec3 pV0 = computeDisplaced(aU, aRowT - epsV, aCenter, aTangent, aFrenetNormal, aFrenetBinormal);

    vec3 dPdU = pU1 - pU0;
    vec3 dPdV = pV1 - pV0;
    vec3 surfaceNormal = normalize(cross(dPdV, dPdU));

    // Keep the normal pointing to the same general side as the ribbon's
    // natural outward direction, so lighting never flips inside-out.
    if (dot(surfaceNormal, normalDir) < 0.0) {
      surfaceNormal = -surfaceNormal;
    }

    // Softer fold-shade signal — same fold phase as before, gentler
    // contrast so ridges fade into valleys smoothly instead of banding.
    float foldShadeRaw = 0.5 + 0.5 * sin(aU * 1.7 + aRowT * 2.4 + uTime * 0.018 + 1.0);
    vFoldShade = pow(foldShadeRaw, 1.05);

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vNormal = normalize(normalMatrix * surfaceNormal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vU;
  varying float vFoldShade;
  uniform float uTime;

  // The palette used to be hardcoded here. Now it's driven by uniforms so
  // each page can hand this shader a different color scheme (see uColor*
  // defaults / theme presets in FlowingSheet.tsx) without touching any of
  // the shape/lighting math above.
  uniform vec3 uCore;
  uniform vec3 uMid;
  uniform vec3 uRim;
  uniform vec3 uHot;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);
    float facing = clamp(abs(dot(N, V)), 0.0, 1.0);

    // Both fresnel terms softened vs. v2 — broader, lower-contrast falloff
    // reads as smooth glass rather than a hard-edged glint.
    float fresnelBroad = pow(1.0 - facing, 1.3);
    float fresnelTight = pow(1.0 - facing, 3.5);

    float lengthShade = 0.55 + 0.45 * sin(vU * 2.2 + uTime * 0.02);

    vec3 color = uCore;
    color = mix(color, uMid, clamp(vFoldShade * 0.55 + 0.25, 0.0, 1.0));
    color = mix(color, uRim, fresnelBroad * (0.55 + 0.45 * lengthShade));
    color += uHot * fresnelTight * 0.4; // gentler highlight than v2

    float alpha = mix(0.24, 0.46, fresnelBroad) * (0.82 + 0.22 * vFoldShade);

    gl_FragColor = vec4(color, alpha);
  }
`;

// Simpler, broader, much fainter pass — reuses the same vertex shader with
// uExpand > 1 to render a puffed-out duplicate of the surface behind the
// main one, giving a soft outer glow without any blur/post-processing pass.
export const fragmentShaderGlow = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  uniform vec3 uGlowColor;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);
    float facing = clamp(abs(dot(N, V)), 0.0, 1.0);
    float fresnel = pow(1.0 - facing, 1.0);

    float alpha = fresnel * 0.16; // deliberately faint — a halo, not a shape

    gl_FragColor = vec4(uGlowColor, alpha);
  }
`;
