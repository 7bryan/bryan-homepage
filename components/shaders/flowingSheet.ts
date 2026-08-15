// Flowing sheet shader — v2. The previous version's cross-section only had
// two vertices (left/right edge), which meant no matter how much the width
// varied, it could only ever read as a ribbon/strip. This version uses
// several rows across the width (aRowT ranges continuously, not just -1/1),
// each independently displaced by smooth large-scale fold functions that
// vary across BOTH length (aU) and width (aRowT) — that's what produces
// actual ridges/folds across the surface instead of a flat strip.
//
// All shape variation remains pure sine/cosine (zero noise) — guaranteed
// to stay large-scale and never drift into visible texture.

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
  // the main surface — safer than scaling the mesh's transform, since the
  // curve isn't centered at the origin (object-space scale would shift it
  // off-center rather than genuinely expanding its own silhouette).
  uniform float uExpand;

  void main() {
    vUv = uv;
    vU = aU;

    // Base width along the ribbon's length — smooth, low-frequency, always
    // safely positive (verified numerically before use).
    float widthFactor = 0.55 + 0.35 * sin(aU * 5.0 + uTime * 0.035) +
      0.25 * sin(aU * 11.0 - uTime * 0.025 + 1.3);
    float width = uBaseWidth * max(0.22, widthFactor) * uExpand;

    float twist = 1.2 * sin(aU * 3.0 + uTime * 0.02);
    vec3 side = normalize(cos(twist) * aFrenetNormal + sin(twist) * aFrenetBinormal);
    vec3 normalDir = normalize(cross(side, aTangent));

    // Fold displacement, at TWO scales layered together: a coarse, large
    // fold (broad gradual bends) plus a finer ripple on top of it. Single-
    // frequency folding read as one smooth undulation rather than distinct
    // folds — layering two frequencies is what gives "multiple gradual
    // bends" rather than one gentle wave.
    float foldSideFine = width * (
      0.5 * sin(aU * 2.2 + aRowT * 1.6 + uTime * 0.02) +
      0.3 * sin(aU * 3.7 - aRowT * 2.1 - uTime * 0.015 + 2.0)
    );
    float foldSideCoarse = width * 0.4 * sin(aU * 1.1 + aRowT * 0.8 + uTime * 0.012 + 0.5);
    float foldSide = foldSideFine + foldSideCoarse;

    float foldDepthFine = width * (
      0.7 * sin(aU * 1.7 + aRowT * 2.4 + uTime * 0.018 + 1.0) +
      0.4 * cos(aU * 2.9 - aRowT * 1.3 + uTime * 0.012)
    );
    float foldDepthCoarse = width * 0.5 * sin(aU * 0.9 - aRowT * 0.6 + uTime * 0.01 + 2.2);
    float foldDepth = foldDepthFine + foldDepthCoarse;

    vec3 displaced = aCenter
      + side * (aRowT * width * 0.5 + foldSide)
      + normalDir * foldDepth;

    // Ties fragment shading to the fold structure (ridges read brighter,
    // valleys darker), with contrast sharpened (pow > 1) so ridges vs.
    // valleys are clearly distinguishable rather than blending into one
    // smooth gradient.
    float foldShadeRaw = 0.5 + 0.5 * sin(aU * 1.7 + aRowT * 2.4 + uTime * 0.018 + 1.0);
    vFoldShade = pow(foldShadeRaw, 1.7);

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vNormal = normalize(normalMatrix * normalDir);
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

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);
    float facing = clamp(abs(dot(N, V)), 0.0, 1.0);

    // Two separate fresnel terms: a broad one for general edge lighting,
    // and a much tighter one for a small "hot" highlight band — this pair
    // is what gives a glass/liquid feel (a soft lit edge PLUS a narrower
    // bright glint) rather than one uniform glow.
    float fresnelBroad = pow(1.0 - facing, 1.6);
    float fresnelTight = pow(1.0 - facing, 5.5);

    // Layered material, dark to light: core -> indigo -> blue-violet rim.
    vec3 core   = vec3(0.014, 0.018, 0.032);
    vec3 mid    = vec3(0.05, 0.045, 0.13);
    vec3 rim    = vec3(0.11, 0.14, 0.38);
    vec3 hot    = vec3(0.22, 0.24, 0.5);

    float lengthShade = 0.55 + 0.45 * sin(vU * 2.2 + uTime * 0.02);

    vec3 color = core;
    color = mix(color, mid, clamp(vFoldShade * 0.7 + 0.15, 0.0, 1.0));
    color = mix(color, rim, fresnelBroad * (0.6 + 0.5 * lengthShade));
    color += hot * fresnelTight * 0.55; // restrained hot highlight, additive

    // Pulled back from the previous version — kept visible/continuous
    // (per the earlier "splits into two arcs" fix) but not brighter than
    // the reference, which stays mostly dark with restrained highlights.
    float alpha = mix(0.22, 0.5, fresnelBroad) * (0.75 + 0.35 * vFoldShade);

    gl_FragColor = vec4(color, alpha);
  }
`;

// Simpler, broader, much fainter pass — reuses the same vertex shader with
// uExpand > 1 to render a puffed-out duplicate of the surface behind the
// main one, giving a soft outer glow without any blur/post-processing pass.
export const fragmentShaderGlow = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);
    float facing = clamp(abs(dot(N, V)), 0.0, 1.0);
    float fresnel = pow(1.0 - facing, 1.1);

    vec3 glowColor = vec3(0.09, 0.11, 0.3);
    float alpha = fresnel * 0.16; // deliberately faint — a halo, not a shape

    gl_FragColor = vec4(glowColor, alpha);
  }
`;
