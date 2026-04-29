import { Link } from 'react-router-dom';

import { GameBoard } from '@/legacy/game-board';
import { TweakRadio, TweakSection, TweaksPanel, useTweaks } from '@/legacy/tweaks-panel';
import { TWEAK_DEFAULTS } from '@/lib/preview-data';

export function GameRoute() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <div className="relative">
      <nav className="px-4 pt-3">
        <Link to="/" className="text-meta text-ink-3 hover:text-ink">
          ← 로비
        </Link>
      </nav>

      <GameBoard tweaks={t} screen="board" onScreen={() => undefined} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="카드">{null}</TweakSection>
        <TweakRadio
          label="추상화"
          value={t.cardAbstraction}
          options={['minimal', 'mid', 'painterly']}
          onChange={(v: string) => setTweak('cardAbstraction', v)}
        />
        <TweakRadio
          label="라벨"
          value={t.labelMode}
          options={['hanja', 'hangul', 'none']}
          onChange={(v: string) => setTweak('labelMode', v)}
        />
        <TweakSection label="보드">{null}</TweakSection>
        <TweakRadio
          label="레이아웃"
          value={t.boardLayout}
          options={['grid', 'hybrid', 'free']}
          onChange={(v: string) => setTweak('boardLayout', v)}
        />
        <TweakSection label="모션">{null}</TweakSection>
        <TweakRadio
          label="강도"
          value={t.animationIntensity}
          options={['minimal', 'mid', 'full']}
          onChange={(v: string) => setTweak('animationIntensity', v)}
        />
      </TweaksPanel>
    </div>
  );
}
