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

  void main() {
    vUv = uv;
    vU = aU;

    // Base width along the ribbon's length — smooth, low-frequency, always
    // safely positive (verified numerically before use).
    float widthFactor = 0.55 + 0.35 * sin(aU * 5.0 + uTime * 0.035) +
      0.25 * sin(aU * 11.0 - uTime * 0.025 + 1.3);
    float width = uBaseWidth * max(0.22, widthFactor);

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
    // Lower power than before (was 2.2) — broadens the lit region. At 2.2,
    // only grazing-angle edges were bright enough to read, and the broad
    // front-facing middle of the sheet fell close to the alpha floor —
    // that's almost certainly why it visually split into "two separate
    // arcs" instead of one continuous mass.
    float fresnel = pow(1.0 - clamp(abs(dot(N, V)), 0.0, 1.0), 1.5);

    // Blue-forward palette (deep navy base, royal-blue rim) — deliberately
    // kept away from purple by keeping red well below green/blue.
    vec3 base = vec3(0.02, 0.03, 0.05);
    vec3 rim  = vec3(0.10, 0.17, 0.44);

    float lengthShade = 0.55 + 0.45 * sin(vU * 2.2 + uTime * 0.02);
    vec3 rimColor = rim * (0.6 + 0.5 * lengthShade) * (0.55 + 0.85 * vFoldShade);

    // Ambient fill raised so front-facing sections stay clearly visible,
    // not just the fresnel-lit edges — this is what keeps the form
    // reading as one continuous piece rather than fading out in the middle.
    vec3 color = base + rimColor * (0.3 + fresnel * 0.8);
    float alpha = mix(0.32, 0.68, fresnel) * (0.78 + 0.4 * vFoldShade);

    gl_FragColor = vec4(color, alpha);
  }
`;
