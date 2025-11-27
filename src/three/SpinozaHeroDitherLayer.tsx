import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { SpinozaHeroDitherEffect, EthicsPart } from './effects/SpinozaDitherEffect';
import { useScrollProgress } from '../hooks/useScrollProgress';
import type { ThreeElements } from '@react-three/fiber';

interface SpinozaHeroCanvasProps {
  part: EthicsPart;
  hoveredPart?: EthicsPart | null;
  hoveredItemId?: string | null;
}

type PortraitProps = ThreeElements['mesh'];

const SpinozaPortraitPlane: React.FC<PortraitProps> = (props) => {
  return (
    <mesh {...props}>
      <planeGeometry args={[2.5, 2.5]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
};

const SpinozaHeroScene: React.FC<SpinozaHeroCanvasProps> = ({ part, hoveredPart, hoveredItemId }) => {
  const scrollProgress = useScrollProgress();

  return (
    <>
      <SpinozaPortraitPlane position={[0, 0, 0]} />
      <EffectComposer multisampling={0}>
        <SpinozaHeroDitherEffect
          part={part}
          hoveredPart={hoveredPart}
          hoveredItemId={hoveredItemId}
          scrollProgress={scrollProgress}
        />
      </EffectComposer>
    </>
  );
};

export const SpinozaHeroCanvas: React.FC<SpinozaHeroCanvasProps> = (props) => {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 35 }} style={{ width: '100%', height: '100%' }}>
      <SpinozaHeroScene {...props} />
    </Canvas>
  );
};

interface SpinozaHeroSpriteCanvasProps {
  part: EthicsPart;
  hoveredPart?: EthicsPart | null;
  hoveredItemId?: string | null;
}

const SpinozaHeroSpriteScene: React.FC<SpinozaHeroSpriteCanvasProps> = ({ part, hoveredPart, hoveredItemId }) => {
  const scrollProgress = useScrollProgress();

  return (
    <>
      <SpinozaPortraitPlane position={[0, 0, 0]} />
      <EffectComposer multisampling={0}>
        <SpinozaHeroDitherEffect
          part={part}
          hoveredPart={hoveredPart}
          hoveredItemId={hoveredItemId}
          scrollProgress={scrollProgress}
        />
      </EffectComposer>
    </>
  );
};

export const SpinozaHeroSpriteCanvas: React.FC<SpinozaHeroSpriteCanvasProps> = (props) => {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 35 }} style={{ width: '100%', height: '100%' }}>
      <SpinozaHeroSpriteScene {...props} />
    </Canvas>
  );
};
