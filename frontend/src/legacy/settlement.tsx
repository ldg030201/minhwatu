// @ts-nocheck
// settlement.tsx — 시안에서 옮겨온 정산 화면(원형 보존 1차 마이그).
// 점수 카운터업, 단(短) 마이크로 이벤트, 승자 발표 포함.

import * as React from 'react';
import {
  CARD_BY_ID as CBI,
  CARD_CATEGORY as CC,
  MONTH_LABELS as ML,
} from './cards-data';
import { HwatuCard } from './hwatu-card';

// ── animated counter ─────────────────────────────────────────────────────────
function useCounter(target, { duration = 800, delay = 0, enabled = true } = {}) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    if (!enabled) { setV(target); return; }
    let raf, start;
    const t0 = performance.now() + delay;
    const tick = (t) => {
      if (t < t0) { raf = requestAnimationFrame(tick); return; }
      if (start === undefined) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay, enabled]);
  return v;
}

// 단(短) detection — returns array of { kind, ribbonIds, points, label }
function detectDan(captured) {
  const ttiCards = captured.TTI.map(id => CBI[id]).filter(Boolean);
  const dans = [];
  const red = ttiCards.filter(c => c.ribbon === "RED_POEM");
  const blue = ttiCards.filter(c => c.ribbon === "BLUE");
  const green = ttiCards.filter(c => c.ribbon === "GREEN");
  if (red.length >= 3) dans.push({ kind: "RED_POEM", cards: red.slice(0, 3), points: 30, label: "홍단", hanja: "紅短", color: "red" });
  if (blue.length >= 3) dans.push({ kind: "BLUE", cards: blue.slice(0, 3), points: 30, label: "청단", hanja: "靑短", color: "indigo" });
  if (green.length >= 3) dans.push({ kind: "GREEN", cards: green.slice(0, 3), points: 30, label: "초단", hanja: "草短", color: "green" });
  return dans;
}

function settlementScore(captured) {
  const g = captured.GWANG.length;
  const y = captured.YEOL.length;
  const t = captured.TTI.length;
  const p = captured.PI.length;
  let breakdown = [];
  let total = 0;
  // 광 점수 (5광=15, 4광=10, 3광=5, 비포함3광=2)
  if (g === 5) { breakdown.push({ k: "오광", v: 15 }); total += 15; }
  else if (g === 4) { breakdown.push({ k: "사광", v: 10 }); total += 10; }
  else if (g === 3) { breakdown.push({ k: "삼광", v: 5 }); total += 5; }
  // 열끗
  if (y >= 5) { const v = y - 4; breakdown.push({ k: `열끗 ${y}장`, v }); total += v; }
  // 띠
  if (t >= 5) { const v = t - 4; breakdown.push({ k: `띠 ${t}장`, v }); total += v; }
  // 피
  if (p >= 10) { const v = p - 9; breakdown.push({ k: `피 ${p}장`, v }); total += v; }
  // 단(短) bonuses
  const dans = detectDan(captured);
  for (const d of dans) {
    breakdown.push({ k: d.label, v: 3, dan: d });  // 단은 3점 (룰마다 다름; 시안은 3점)
    total += 3;
  }
  // 고도리/청단/홍단 등 추가 보너스는 추후
  return { total, breakdown, dans };
}

function CategoryShelf({ label, hanja, count, ids, tone, delay, animate }) {
  const v = useCounter(count, { duration: 700, delay, enabled: animate });
  return (
    <div className={`shelf tone-${tone}`}>
      <div className="shelf-head">
        <div className="shelf-label">
          <span className="shelf-name">{label}</span>
          <span className="shelf-hanja serif">{hanja}</span>
        </div>
        <div className="shelf-count tabnum">
          <span>{v}</span><span className="shelf-count-of">/{count}</span>
        </div>
      </div>
      <div className="shelf-strip">
        {ids.map((id, i) => {
          const c = CBI[id];
          if (!c) return null;
          return (
            <div key={id + i} className="shelf-card"
                 style={{ marginLeft: i ? -28 : 0, zIndex: i,
                          animationDelay: `${delay + i * 60}ms` }}>
              <HwatuCard month={c.month} cat={c.cat} ribbon={c.ribbon}
                         size="md" labelMode="hangul" abstraction="mid"
                         isLegal isDisabled onClick={() => {}}/>
            </div>
          );
        })}
        {ids.length === 0 && <div className="shelf-empty">없음</div>}
      </div>
    </div>
  );
}

function DanBurst({ dan, delay = 0, opponents = 3 }) {
  // micro-event: 3 ribbon cards converge, +30 score floats up
  const [phase, setPhase] = React.useState("hidden");
  React.useEffect(() => {
    const t1 = setTimeout(() => setPhase("converge"), delay);
    const t2 = setTimeout(() => setPhase("burst"), delay + 600);
    const t3 = setTimeout(() => setPhase("settle"), delay + 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [delay]);

  return (
    <div className={`dan-burst phase-${phase} tone-${dan.color}`}>
      <div className="dan-eyebrow serif">{dan.hanja}</div>
      <div className="dan-title">{dan.label} 성립</div>

      <div className="dan-stage">
        {dan.cards.map((c, i) => (
          <div key={c.id} className="dan-card" data-idx={i}>
            <HwatuCard month={c.month} cat={c.cat} ribbon={c.ribbon}
                       size="md" labelMode="hangul" abstraction="mid"
                       isLegal isDisabled onClick={() => {}}/>
          </div>
        ))}
        <div className="dan-tie" aria-hidden="true"/>
      </div>

      <div className="dan-points">
        <span className="dan-pts-num tabnum">+30</span>
        <span className="dan-pts-mult">× {opponents}</span>
        <span className="dan-pts-eq">=</span>
        <span className="dan-pts-total tabnum">+{30 * opponents}</span>
      </div>
    </div>
  );
}

function PlayerColumn({ player, captured, isWinner, animate, delay }) {
  const score = settlementScore(captured);
  const totalAnim = useCounter(score.total, { duration: 1200, delay: delay + 600, enabled: animate });

  return (
    <div className={`pc ${isWinner ? "winner" : ""}`}>
      <div className="pc-head">
        <div className="pc-avatar" style={{ background: player.color }}>
          <span className="serif">{player.name[0]}</span>
        </div>
        <div className="pc-name-block">
          <div className="pc-name">{player.name}</div>
          {isWinner && <div className="pc-winner-pill">승</div>}
        </div>
        <div className="pc-total">
          <div className="pc-total-num tabnum">{totalAnim}</div>
          <div className="pc-total-lbl">본점수</div>
        </div>
      </div>

      <div className="pc-shelves">
        <CategoryShelf label="광" hanja="光" count={captured.GWANG.length} ids={captured.GWANG}
                       tone="gold" delay={delay} animate={animate}/>
        <CategoryShelf label="열끗" hanja="十" count={captured.YEOL.length} ids={captured.YEOL}
                       tone="indigo" delay={delay + 150} animate={animate}/>
        <CategoryShelf label="띠" hanja="短" count={captured.TTI.length} ids={captured.TTI}
                       tone="red" delay={delay + 300} animate={animate}/>
        <CategoryShelf label="피" hanja="皮" count={captured.PI.length} ids={captured.PI}
                       tone="neutral" delay={delay + 450} animate={animate}/>
      </div>

      <div className="pc-breakdown">
        {score.breakdown.length === 0 ? (
          <div className="pc-bd-empty">획득 점수 없음 — 다음 판으로</div>
        ) : score.breakdown.map((b, i) => (
          <div key={i} className={`pc-bd-row ${b.dan ? `is-dan tone-${b.dan.color}` : ""}`}>
            <span className="pc-bd-k">{b.k}</span>
            <span className="pc-bd-v tabnum">+{b.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settlement({ tweaks, onScreen, capturedAll, players }) {
  // animation gate — re-trigger by toggling
  const [run, setRun] = React.useState(0);
  const animate = tweaks.animationIntensity !== "minimal";

  // determine winner
  const scores = Object.entries(capturedAll).map(([k, c]) => ({ k, total: settlementScore(c).total }));
  scores.sort((a, b) => b.total - a.total);
  const winnerKey = scores[0].k;

  // dan events from winner
  const winnerDans = detectDan(capturedAll[winnerKey]);

  return (
    <div className="settlement bg-tatami">
      <div className="settle-top">
        <button className="tb-btn ghost" onClick={() => onScreen("board")}>← 게임으로</button>
        <div className="settle-eyebrow serif">第 1 局 終了</div>
        <button className="tb-btn ghost" onClick={() => setRun(r => r + 1)}>↻ 애니메이션 재생</button>
      </div>

      <div className="settle-hero">
        <div className="settle-hero-eyebrow">라운드 종료</div>
        <h1 className="settle-hero-title">
          <span className="settle-winner-name">{players[winnerKey].name}</span>
          <span className="settle-hero-of">의 승리</span>
        </h1>
        <div className="settle-hero-sub">
          본점수 <b className="tabnum">{scores[0].total}</b>점 · {winnerDans.length > 0 ? `${winnerDans.map(d => d.label).join(" + ")} 보너스` : "본점수 단독"}
        </div>
      </div>

      {/* Dan bursts — micro-events */}
      {animate && winnerDans.length > 0 && (
        <div className="dan-row" key={`dan-${run}`}>
          {winnerDans.map((d, i) => (
            <DanBurst key={d.kind} dan={d} delay={400 + i * 600} opponents={3}/>
          ))}
        </div>
      )}

      {/* Player columns */}
      <div className="pc-grid" key={`pc-${run}`}>
        {Object.entries(capturedAll).map(([k, c], i) => (
          <PlayerColumn
            key={k}
            player={players[k]}
            captured={c}
            isWinner={k === winnerKey}
            animate={animate}
            delay={i * 200}
          />
        ))}
      </div>

      <div className="settle-actions">
        <button className="settle-btn primary">다음 판 →</button>
        <button className="settle-btn ghost">방 나가기</button>
        <button className="settle-btn ghost" onClick={() => onScreen("board")}>이전 보드 다시 보기</button>
      </div>
    </div>
  );
}

export { Settlement, settlementScore, detectDan };
