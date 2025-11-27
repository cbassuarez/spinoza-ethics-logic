import React from 'react';
import { SpinozaHeroCanvas } from '../three/SpinozaHeroDitherLayer';
import type { EthicsPart } from '../three/effects/SpinozaDitherEffect';

interface SpinozaHeroSectionProps {
  currentPart: EthicsPart;
  hoveredPart?: EthicsPart | null;
  hoveredItemId?: string | null;
}

export const SpinozaHeroSection: React.FC<SpinozaHeroSectionProps> = ({
  currentPart,
  hoveredPart,
  hoveredItemId,
}) => {
  return (
    <section
      aria-label="Spinoza workspace hero"
      className="card"
      style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'center' }}
    >
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">A portrait of Spinoza anchors the workspace while you explore the text.</h2>
        <p className="text-slate-700">
          The dithered portrait responds to the current Part of the Ethics and your navigation through propositions, subtly
          shifting its palette and texture as you move.
        </p>
      </div>
      <div style={{ position: 'relative', width: '100%', maxWidth: '420px', aspectRatio: '16/9', marginLeft: 'auto' }}>
        <SpinozaHeroCanvas part={currentPart} hoveredPart={hoveredPart} hoveredItemId={hoveredItemId} />
      </div>
    </section>
  );
};
