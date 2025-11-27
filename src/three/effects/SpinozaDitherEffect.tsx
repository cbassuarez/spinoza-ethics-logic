import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Effect } from 'postprocessing';
import { Color, Texture, Uniform, Vector2 } from 'three';
import * as THREE from 'three';
import { spinozaPortraitDataUrl } from '../spinozaPortrait';

export type EthicsPart = 1 | 2 | 3 | 4 | 5;

const PART_STYLES: Record<
  EthicsPart,
  {
    logicalResolution: [number, number];
    inkColor: [number, number, number];
  }
> = {
  1: { logicalResolution: [120, 120], inkColor: [0.08, 0.11, 0.2] },
  2: { logicalResolution: [160, 160], inkColor: [0.06, 0.18, 0.25] },
  3: { logicalResolution: [160, 160], inkColor: [0.1, 0.16, 0.22] },
  4: { logicalResolution: [180, 180], inkColor: [0.18, 0.16, 0.12] },
  5: { logicalResolution: [200, 200], inkColor: [0.22, 0.22, 0.22] },
};

const portraitTexture: Texture = new THREE.TextureLoader().load(spinozaPortraitDataUrl);
portraitTexture.minFilter = THREE.LinearFilter;
portraitTexture.magFilter = THREE.LinearFilter;
portraitTexture.generateMipmaps = false;
portraitTexture.wrapS = THREE.ClampToEdgeWrapping;
portraitTexture.wrapT = THREE.ClampToEdgeWrapping;

const spinozaDitherFragment = /* glsl */ `
uniform sampler2D uPortraitMap;
uniform float uTime;
uniform float uScroll;
uniform vec3 uBaseColor;
uniform vec2 uLogicalResolution;
uniform float uHighlight;

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

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outColor) {
  vec4 portrait = texture2D(uPortraitMap, uv);
  float luma = dot(portrait.rgb, vec3(0.299, 0.587, 0.114));
  float mask = 1.0 - smoothstep(0.80, 0.98, luma);

  if (mask < 0.01) {
    discard;
  }

  vec2 logicalUV = uv * uLogicalResolution;
  ivec2 coord = ivec2(mod(logicalUV, 8.0));
  float threshold = bayer8x8(coord.x, coord.y);

  float breathe = 0.04 * sin(uTime * 0.5);
  float scrollWave = 0.04 * uScroll;
  float intensity = clamp(mask + breathe + scrollWave + uHighlight, 0.0, 1.0);

  float on = step(threshold, intensity);
  float alpha = on * mask;

  if (alpha < 0.01) {
    discard;
  }

  vec3 ink = uBaseColor;

  outColor = vec4(ink, alpha);
}
`;

interface SpinozaDitherUniforms {
  uPortraitMap: Uniform<Texture>;
  uTime: Uniform<number>;
  uScroll: Uniform<number>;
  uBaseColor: Uniform<Color>;
  uLogicalResolution: Uniform<Vector2>;
  uHighlight: Uniform<number>;
}

class SpinozaHeroDitherEffectImpl extends Effect {
  public uniformsMap: SpinozaDitherUniforms;

  constructor(initialUniforms: { part: EthicsPart; portraitMap: Texture }) {
    const style = PART_STYLES[initialUniforms.part];

    const uPortraitMap = new Uniform(initialUniforms.portraitMap);
    const uTime = new Uniform(0);
    const uScroll = new Uniform(0);
    const uBaseColor = new Uniform(new Color().fromArray(style.inkColor));
    const uLogicalResolution = new Uniform(new Vector2(...style.logicalResolution));
    const uHighlight = new Uniform(0);

    const uniforms = new Map<string, Uniform<any>>([
      ['uPortraitMap', uPortraitMap],
      ['uTime', uTime],
      ['uScroll', uScroll],
      ['uBaseColor', uBaseColor],
      ['uLogicalResolution', uLogicalResolution],
      ['uHighlight', uHighlight],
    ]);

    super('SpinozaHeroDitherEffect', spinozaDitherFragment, { uniforms });

    // @ts-ignore - blendMode is configured internally
    this.blendMode.opacity.value = 1.0;

    this.uniformsMap = {
      uPortraitMap,
      uTime,
      uScroll,
      uBaseColor,
      uLogicalResolution,
      uHighlight,
    };
  }

  setPart(part: EthicsPart) {
    const style = PART_STYLES[part];
    this.uniformsMap.uBaseColor.value.setRGB(...style.inkColor);
    this.uniformsMap.uLogicalResolution.value.set(...style.logicalResolution);
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
  const effectRef = useRef<SpinozaHeroDitherEffectImpl | null>(null);

  const effect = useMemo(
    () => new SpinozaHeroDitherEffectImpl({ part, portraitMap: portraitTexture }),
    [part],
  );

  effectRef.current = effect;

  useEffect(() => {
    const material = (effect as any).blendMode?.material || (effect as any).material;
    if (material) {
      material.transparent = true;
      material.depthWrite = false;
    }
  }, [effect]);

  useFrame(({ clock }) => {
    const e = effectRef.current;
    if (!e) return;

    e.uniformsMap.uTime.value = clock.getElapsedTime();
    e.uniformsMap.uScroll.value = scrollProgress;

    const highlight = hoveredPart && hoveredPart === part ? 0.18 : hoveredItemId ? 0.1 : 0.0;
    e.uniformsMap.uHighlight.value = highlight;
  });

  useEffect(() => {
    effectRef.current?.setPart(part);
  }, [part]);

  return <primitive object={effect} />;
};
