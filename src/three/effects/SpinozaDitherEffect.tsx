import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Effect } from 'postprocessing';
import { Color, Uniform, Vector2 } from 'three';

export type EthicsPart = 1 | 2 | 3 | 4 | 5;

export interface SpinozaPartConfig {
  accent: Color;
  contrast: number;
  shimmerStrength: number;
  ditherScale: number;
}

export const SPINOZA_PART_CONFIG: Record<EthicsPart, SpinozaPartConfig> = {
  1: {
    accent: new Color('#8ea2ff'),
    contrast: 1.0,
    shimmerStrength: 0.03,
    ditherScale: 1.0,
  },
  2: {
    accent: new Color('#8ef5c6'),
    contrast: 1.05,
    shimmerStrength: 0.035,
    ditherScale: 1.1,
  },
  3: {
    accent: new Color('#f4d37f'),
    contrast: 1.1,
    shimmerStrength: 0.04,
    ditherScale: 1.2,
  },
  4: {
    accent: new Color('#f2a6b8'),
    contrast: 1.0,
    shimmerStrength: 0.03,
    ditherScale: 0.95,
  },
  5: {
    accent: new Color('#d3d3d3'),
    contrast: 0.95,
    shimmerStrength: 0.025,
    ditherScale: 0.9,
  },
};

const bayer8x8 = /* glsl */ `
float bayer8x8(int x, int y) {
  int index = y * 8 + x;
  int m[64];
  m[0] = 0;   m[1] = 48;  m[2] = 12;  m[3] = 60;  m[4] = 3;   m[5] = 51;  m[6] = 15;  m[7] = 63;
  m[8] = 32;  m[9] = 16;  m[10] = 44; m[11] = 28; m[12] = 35; m[13] = 19; m[14] = 47; m[15] = 31;
  m[16] = 8;  m[17] = 56; m[18] = 4;  m[19] = 52; m[20] = 11; m[21] = 59; m[22] = 7;  m[23] = 55;
  m[24] = 40; m[25] = 24; m[26] = 36; m[27] = 20; m[28] = 43; m[29] = 27; m[30] = 39; m[31] = 23;
  m[32] = 2;  m[33] = 50; m[34] = 14; m[35] = 62; m[36] = 1;  m[37] = 49; m[38] = 13; m[39] = 61;
  m[40] = 34; m[41] = 18; m[42] = 46; m[43] = 30; m[44] = 33; m[45] = 17; m[46] = 45; m[47] = 29;
  m[48] = 10; m[49] = 58; m[50] = 6;  m[51] = 54; m[52] = 9;  m[53] = 57; m[54] = 5;  m[55] = 53;
  m[56] = 42; m[57] = 26; m[58] = 38; m[59] = 22; m[60] = 41; m[61] = 25; m[62] = 37; m[63] = 21;
  return float(m[index]) / 64.0;
}
`;

export const spinozaDitherFragment = /* glsl */ `
uniform sampler2D tDiffuse;

uniform float uTime;
uniform float uScroll;
uniform float uContrast;
uniform float uShimmerStrength;
uniform float uDitherScale;
uniform vec3  uAccent;
uniform float uHighlight;
uniform vec2 uLogicalResolution;

varying vec2 vUv;

${bayer8x8}

vec3 applyContrast(vec3 color, float contrast) {
  return (color - 0.5) * contrast + 0.5;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outColor) {
  vec4 base = texture2D(tDiffuse, uv);
  vec3 color = base.rgb;

  color = pow(color, vec3(1.0 / 2.0));

  vec2 grid = uv * uLogicalResolution * uDitherScale;
  int bx = int(mod(floor(grid.x), 8.0));
  int by = int(mod(floor(grid.y), 8.0));
  float threshold = bayer8x8(bx, by);

  float shimmer = sin(uTime * 0.5 + threshold * 10.0) * uShimmerStrength;
  float scrollMod = (uScroll - 0.5) * 0.05;
  float t = clamp(threshold + shimmer + scrollMod, 0.0, 1.0);

  vec3 dithered;
  for (int i = 0; i < 3; i++) {
    float c = color[i];
    float effective = 0.5 + (t - 0.5);
    float bit = step(effective, c);
    dithered[i] = bit;
  }

  dithered = applyContrast(dithered, uContrast);

  float brightness = (dithered.r + dithered.g + dithered.b) / 3.0;
  float accentFactor = brightness * 0.6 + 0.1;
  vec3 tinted = mix(dithered, uAccent, accentFactor);

  if (uHighlight > 0.0) {
    float h = clamp(uHighlight, 0.0, 1.0);
    tinted = mix(tinted, vec3(1.0), h * 0.3);
  }

  outColor = vec4(tinted, base.a);
}

void main() {
  mainImage(texture2D(tDiffuse, vUv), vUv, gl_FragColor);
}
`;

export interface SpinozaDitherUniforms {
  uTime: Uniform<number>;
  uScroll: Uniform<number>;
  uContrast: Uniform<number>;
  uShimmerStrength: Uniform<number>;
  uDitherScale: Uniform<number>;
  uAccent: Uniform<Color>;
  uHighlight: Uniform<number>;
  uLogicalResolution: Uniform<Vector2>;
}

export class SpinozaDitherEffectImpl extends Effect {
  public uniformsMap: SpinozaDitherUniforms;

  constructor(config: { part: EthicsPart; logicalResolution: Vector2 }) {
    const partConfig = SPINOZA_PART_CONFIG[config.part];

    const uniforms = new Map<string, Uniform<any>>();
    const uTime = new Uniform(0);
    const uScroll = new Uniform(0);
    const uContrast = new Uniform(partConfig.contrast);
    const uShimmerStrength = new Uniform(partConfig.shimmerStrength);
    const uDitherScale = new Uniform(partConfig.ditherScale);
    const uAccent = new Uniform(partConfig.accent.clone());
    const uHighlight = new Uniform(0);
    const uLogicalResolution = new Uniform(config.logicalResolution.clone());

    uniforms.set('uTime', uTime);
    uniforms.set('uScroll', uScroll);
    uniforms.set('uContrast', uContrast);
    uniforms.set('uShimmerStrength', uShimmerStrength);
    uniforms.set('uDitherScale', uDitherScale);
    uniforms.set('uAccent', uAccent);
    uniforms.set('uHighlight', uHighlight);
    uniforms.set('uLogicalResolution', uLogicalResolution);

    super('SpinozaDitherEffect', spinozaDitherFragment, {
      uniforms,
    });

    this.uniformsMap = {
      uTime,
      uScroll,
      uContrast,
      uShimmerStrength,
      uDitherScale,
      uAccent,
      uHighlight,
      uLogicalResolution,
    };
  }

  setPart(part: EthicsPart) {
    const cfg = SPINOZA_PART_CONFIG[part];
    this.uniformsMap.uContrast.value = cfg.contrast;
    this.uniformsMap.uShimmerStrength.value = cfg.shimmerStrength;
    this.uniformsMap.uDitherScale.value = cfg.ditherScale;
    this.uniformsMap.uAccent.value.copy(cfg.accent);
  }
}

export interface SpinozaHeroDitherEffectProps {
  part: EthicsPart;
  hoveredPart?: EthicsPart | null;
  hoveredItemId?: string | null;
  scrollProgress: number;
  logicalWidth?: number;
  logicalHeight?: number;
}

export const SpinozaHeroDitherEffect: React.FC<SpinozaHeroDitherEffectProps> = ({
  part,
  hoveredPart,
  hoveredItemId,
  scrollProgress,
  logicalWidth = 320,
  logicalHeight = 180,
}) => {
  const effectRef = useRef<SpinozaDitherEffectImpl | null>(null);

  const effect = useMemo(() => {
    const res = new Vector2(logicalWidth, logicalHeight);
    return new SpinozaDitherEffectImpl({
      part,
      logicalResolution: res,
    });
  }, [logicalHeight, logicalWidth, part]);

  effectRef.current = effect;

  useFrame((state, delta) => {
    const e = effectRef.current;
    if (!e) return;

    e.uniformsMap.uTime.value += delta;
    e.uniformsMap.uScroll.value = scrollProgress;

    let highlight = 0;
    if (hoveredItemId) {
      highlight = 0.4;
    } else if (hoveredPart && hoveredPart === part) {
      highlight = 0.25;
    }
    e.uniformsMap.uHighlight.value += (highlight - e.uniformsMap.uHighlight.value) * 0.1;
  });

  React.useEffect(() => {
    if (effectRef.current) {
      effectRef.current.setPart(part);
    }
  }, [part]);

  return <primitive object={effect} />;
};
