import { Link } from 'react-router-dom';

import { Settlement } from '@/legacy/settlement';
import { TweakRadio, TweakSection, TweaksPanel, useTweaks } from '@/legacy/tweaks-panel';
import { FINAL_CAPTURED, PLAYERS, TWEAK_DEFAULTS } from '@/lib/preview-data';

export function SettlementRoute() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <div className="relative">
      <nav className="px-4 pt-3">
        <Link to="/" className="text-meta text-ink-3 hover:text-ink">
          ← 로비
        </Link>
      </nav>

      <Settlement tweaks={t} onScreen={() => undefined} capturedAll={FINAL_CAPTURED} players={PLAYERS} />

      <TweaksPanel title="Tweaks">
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
