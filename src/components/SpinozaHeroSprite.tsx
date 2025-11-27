import React from 'react';
import { SpinozaHeroSpriteCanvas } from '../three/SpinozaHeroDitherLayer';
import type { EthicsPart } from '../three/effects/SpinozaDitherEffect';

interface SpinozaHeroSpriteProps {
  currentPart: EthicsPart;
  hoveredPart?: EthicsPart | null;
  hoveredItemId?: string | null;
}

export const SpinozaHeroSprite: React.FC<SpinozaHeroSpriteProps> = ({
  currentPart,
  hoveredPart,
  hoveredItemId,
}) => {
  return (
    <div
      aria-hidden="true"
      style={{ width: '40px', height: '40px', display: 'inline-block' }}
      className="rounded-md bg-slate-100"
    >
      <SpinozaHeroSpriteCanvas part={currentPart} hoveredPart={hoveredPart} hoveredItemId={hoveredItemId} />
    </div>
  );
};
