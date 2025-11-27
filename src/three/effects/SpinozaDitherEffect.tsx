import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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

export const spinozaDitherFragment = /* glsl */`
uniform float uTime;
uniform float uScroll;
uniform float uContrast;
uniform float uShimmerStrength;
uniform float uDitherScale;
uniform vec3  uAccent;
uniform float uHighlight;
uniform vec2  uLogicalResolution;

// 8×8 Bayer ordered dither matrix as a constant float array
float bayer8x8(int x, int y) {
  int index = y * 8 + x;
  const float m[64] = float[64](
     0.0, 48.0, 12.0, 60.0,  3.0, 51.0, 15.0, 63.0,
    32.0, 16.0, 44.0, 28.0, 35.0, 19.0, 47.0, 31.0,
     8.0, 56.0,  4.0, 52.0, 11.0, 59.0,  7.0, 55.0,
    40.0, 24.0, 36.0, 20.0, 43.0, 27.0, 39.0, 23.0,
     2.0, 50.0, 14.0, 62.0,  1.0, 49.0, 13.0, 61.0,
    34.0, 18.0, 46.0, 30.0, 33.0, 17.0, 45.0, 29.0,
    10.0, 58.0,  6.0, 54.0,  9.0, 57.0,  5.0, 53.0,
    42.0, 26.0, 38.0, 22.0, 41.0, 25.0, 37.0, 21.0
  );
  return m[index] / 64.0;
}

vec3 applyContrast(vec3 color, float contrast) {
  return (color - 0.5) * contrast + 0.5;
}

float ditherChannel(float c, float effectiveThreshold) {
  float bit = step(effectiveThreshold, c);
  return bit;
}

// postprocessing injects a main() that calls:
//
//   mainImage(inputColor, vUv, gl_FragColor);
//
// so we only implement this:
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outColor) {
  vec4 base = inputColor;
  vec3 color = base.rgb;

  // gamma-ish adjustment
  color = pow(color, vec3(1.0 / 2.0));

  // Logical coords for ordered dither
  vec2 grid = uv * uLogicalResolution * uDitherScale;
  int bx = int(mod(floor(grid.x), 8.0));
  int by = int(mod(floor(grid.y), 8.0));
  float threshold = bayer8x8(bx, by); // 0..1

  float shimmer = sin(uTime * 0.5 + threshold * 10.0) * uShimmerStrength;
  float scrollMod = (uScroll - 0.5) * 0.05; // tiny
  float t = clamp(threshold + shimmer + scrollMod, 0.0, 1.0);

  // Bias around mid-gray 0.5
  float effective = 0.5 + (t - 0.5);

  // 2 levels per channel: ordered 1-bit dither
  float r = ditherChannel(color.r, effective);
  float g = ditherChannel(color.g, effective);
  float b = ditherChannel(color.b, effective);
  vec3 dithered = vec3(r, g, b);

  dithered = applyContrast(dithered, uContrast);

  // Accent and highlight
  float brightness = (dithered.r + dithered.g + dithered.b) / 3.0;
  float accentFactor = brightness * 0.6 + 0.1;
  vec3 tinted = mix(dithered, uAccent, accentFactor);

  if (uHighlight > 0.0) {
    float h = clamp(uHighlight, 0.0, 1.0);
    tinted = mix(tinted, vec3(1.0), h * 0.3);
  }

  outColor = vec4(tinted, base.a);
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

  constructor(config: { part: EthicsPart; logicalResolution?: Vector2 }) {
    const partConfig = SPINOZA_PART_CONFIG[config.part];

    const uniforms = new Map<string, Uniform<any>>();
    const uTime = new Uniform(0);
    const uScroll = new Uniform(0);
    const uContrast = new Uniform(partConfig.contrast);
    const uShimmerStrength = new Uniform(partConfig.shimmerStrength);
    const uDitherScale = new Uniform(partConfig.ditherScale);
    const uAccent = new Uniform(partConfig.accent.clone());
    const uHighlight = new Uniform(0);
    const uLogicalResolution = new Uniform((config.logicalResolution ?? new Vector2(1, 1)).clone());

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
}

export const SpinozaHeroDitherEffect: React.FC<SpinozaHeroDitherEffectProps> = ({
  part,
  hoveredPart,
  hoveredItemId,
  scrollProgress,
}) => {
  const effectRef = useRef<SpinozaDitherEffectImpl | null>(null);
  const { size } = useThree();

  const effect = useMemo(() => {
    const res = new Vector2(size.width / 4, size.height / 4);
    return new SpinozaDitherEffectImpl({
      part,
      logicalResolution: res,
    });
  }, [part, size.height, size.width]);

  effectRef.current = effect;

  useFrame((state, delta) => {
    const e = effectRef.current;
    if (!e) return;

    e.uniformsMap.uTime.value += delta;
    e.uniformsMap.uScroll.value = scrollProgress;
    const { width, height } = state.size;
    e.uniformsMap.uLogicalResolution.value.set(width / 4, height / 4);

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
