// game-board.jsx — main game board screen with all 5 zones.

const { HwatuCard, HwatuCardBack, MONTH_LABELS, CARD_CATEGORY, CARD_CATALOG } = window;

// Build a quick lookup for finding card meta
const CARD_BY_ID = Object.fromEntries(CARD_CATALOG.map(c => [c.id, c]));

// ── demo state generator ───────────────────────────────────────────────────
// Sets up a realistic mid-game state so the prototype feels alive.
function makeDemoState() {
  // hand for the player ("나")
  const hand = ["3-G", "5-T", "9-Y", "10-Y", "7-T", "12-G", "1-T", "4-P1", "6-Y", "11-G"]
    .map(id => ({ ...CARD_BY_ID[id] }));

  // floor cards (바닥) — 8 cards
  const floor = ["3-T", "9-T", "5-Y", "11-P1", "8-G", "10-T", "2-Y", "12-T"]
    .map(id => ({ ...CARD_BY_ID[id] }));

  // pile remaining
  const pile = ["1-G", "1-P1", "2-P1", "4-Y", "6-T", "7-Y", "8-Y", "9-P1", "10-P1", "11-P2", "12-Y"]
    .map(id => ({ ...CARD_BY_ID[id] }));

  // already captured cards by player
  const captured = {
    me:   { GWANG: ["1-G".replace("1-G","")].filter(Boolean), YEOL: ["2-Y", "8-Y"], TTI: ["6-T"], PI: ["1-P2", "11-P2", "11-P3"] }
            ,
    p2:   { GWANG: [], YEOL: ["7-Y"], TTI: ["4-T", "7-T".replace("7-T","")].filter(Boolean), PI: ["4-P1", "4-P2", "5-P1", "5-P2"] },
    p3:   { GWANG: ["11-G".replace("11-G","")].filter(Boolean), YEOL: [], TTI: ["3-T".replace("3-T","")].filter(Boolean), PI: ["3-P1", "6-P1", "8-P1"] },
    p4:   { GWANG: [], YEOL: ["10-Y".replace("10-Y","")].filter(Boolean), TTI: ["10-T".replace("10-T","")].filter(Boolean), PI: ["6-P2", "8-P2", "9-P2", "10-P2", "12-P"] },
  };
  // Clean: strip empties
  for (const p of Object.keys(captured)) {
    for (const k of Object.keys(captured[p])) {
      captured[p][k] = captured[p][k].filter(Boolean);
    }
  }

  return { hand, floor, pile, captured };
}

// ── helper: are two cards same month → "matchable" ───────────────────────────
function legalMatchesOnFloor(handCard, floor) {
  return floor.filter(f => f.month === handCard.month).map(f => f.id);
}

// ── score calc (simplified 민화투 본점 계산) ────────────────────────────────────
function calcScore(captured) {
  const gwang = captured.GWANG.length;
  const yeol = captured.YEOL.length;
  const tti = captured.TTI.length;
  const pi = captured.PI.length;

  let score = 0;
  // 광 점수
  if (gwang === 5) score += 15;
  else if (gwang === 4) score += 10;
  else if (gwang === 3) score += 5;
  // 열끗
  score += Math.max(0, yeol - 4);
  // 띠
  score += Math.max(0, tti - 4);
  // 피
  score += Math.max(0, pi - 9);

  return { total: score, gwang, yeol, tti, pi };
}

// ── PlayerStrip — top/left/right opponents ─────────────────────────────────
function PlayerStrip({ player, position, isCurrent, captured }) {
  const isVertical = position === "left" || position === "right";
  const handCount = player.handCount;

  return (
    <div className={`player-strip pos-${position} ${isCurrent ? "is-turn" : ""}`}>
      <div className="ps-meta">
        <div className="ps-avatar" style={{ background: player.color }}>
          <span className="serif">{player.name[0]}</span>
        </div>
        <div className="ps-info">
          <div className="ps-name">{player.name}</div>
          <div className="ps-sub tabnum">
            손패 {handCount}장 · 점수 <b>{calcScore(captured).total}</b>
          </div>
        </div>
        {isCurrent && <div className="ps-turn-pill">차례</div>}
      </div>

      <div className={`ps-hand ${isVertical ? "vert" : "horz"}`}>
        {Array.from({ length: handCount }).map((_, i) => (
          <div key={i} className="ps-card-back" style={{
            transform: `${isVertical ? "" : `rotate(${(i - handCount / 2) * 1.5}deg)`} translateY(${isVertical ? 0 : -(handCount - Math.abs(i - handCount / 2)) * 0.4}px)`,
            zIndex: i,
          }}>
            <HwatuCardBack size="sm"/>
          </div>
        ))}
      </div>

      <div className="ps-captured">
        {["GWANG", "YEOL", "TTI", "PI"].map(k => {
          const count = captured[k].length;
          if (count === 0) return (
            <div key={k} className="ps-cap-cell empty">
              <span className="ps-cap-lbl">{CARD_CATEGORY[k].label}</span>
              <span className="ps-cap-num tabnum">·</span>
            </div>
          );
          return (
            <div key={k} className={`ps-cap-cell tone-${CARD_CATEGORY[k].color}`}>
              <span className="ps-cap-lbl">{CARD_CATEGORY[k].label}</span>
              <span className="ps-cap-num tabnum">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── FloorBoard — center area ───────────────────────────────────────────────
function FloorBoard({ floor, layout, abstraction, labelMode, legalIds, selectedFloorId, onPickFloor, capturingIds }) {
  // layout: "grid" (12-month grid), "free" (chaotic), "hybrid" (grid + jitter)
  const month12 = Array.from({ length: 12 }, (_, i) => i + 1);

  if (layout === "grid") {
    return (
      <div className="floor-board layout-grid">
        {month12.map(m => {
          const cardsThisMonth = floor.filter(c => c.month === m);
          return (
            <div key={m} className="fb-cell">
              <div className="fb-cell-head serif">{MONTH_LABELS[m].hanja}</div>
              <div className="fb-cell-stack">
                {cardsThisMonth.map((c, i) => (
                  <div key={c.id} className={`fb-card-wrap ${legalIds.has(c.id) ? "legal-target" : ""}`}
                       style={{ "--card-rotate": "0deg", marginLeft: i ? -36 : 0 }}>
                    <HwatuCard
                      month={c.month} cat={c.cat} ribbon={c.ribbon}
                      abstraction={abstraction} labelMode={labelMode}
                      isLegal={legalIds.size === 0 || legalIds.has(c.id)}
                      isSelected={selectedFloorId === c.id}
                      isDisabled={legalIds.size > 0 && !legalIds.has(c.id)}
                      onClick={() => onPickFloor(c.id)}
                      className={capturingIds.has(c.id) ? "capture-fly" : ""}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // hybrid / free — flow layout with jitter
  const isFree = layout === "free";
  return (
    <div className={`floor-board layout-${layout}`}>
      {floor.map((c, i) => {
        const seed = (c.month * 7 + i * 13) % 100;
        const rot = isFree ? ((seed - 50) / 8) : ((seed - 50) / 25);
        const tx = isFree ? ((seed - 50) / 6) : 0;
        const ty = isFree ? (((seed * 3) % 60 - 30) / 8) : 0;
        return (
          <div key={c.id}
               className={`fb-card-wrap ${legalIds.has(c.id) ? "legal-target" : ""}`}
               style={{ "--card-rotate": `${rot}deg`, transform: `translate(${tx}px, ${ty}px)` }}>
            <HwatuCard
              month={c.month} cat={c.cat} ribbon={c.ribbon}
              abstraction={abstraction} labelMode={labelMode}
              isLegal={legalIds.size === 0 || legalIds.has(c.id)}
              isSelected={selectedFloorId === c.id}
              isDisabled={legalIds.size > 0 && !legalIds.has(c.id)}
              onClick={() => onPickFloor(c.id)}
              rotate={rot}
              className={capturingIds.has(c.id) ? "capture-fly" : ""}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── DrawPile — 산패 ──────────────────────────────────────────────────────────
function DrawPile({ count, flipping }) {
  return (
    <div className="draw-pile" aria-label={`산패 남은 카드 ${count}장`}>
      <div className="dp-stack">
        {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
          <div key={i} className="dp-card" style={{
            transform: `translate(${-i}px, ${-i * 0.6}px) rotate(${(i - 2) * 0.6}deg)`,
            zIndex: i,
          }}>
            <HwatuCardBack size="md"/>
          </div>
        ))}
      </div>
      <div className="dp-meta">
        <div className="dp-count tabnum">{count}</div>
        <div className="dp-label">산패</div>
      </div>
      {flipping && <div className="dp-flip-hint">▶ 뒤집는 중</div>}
    </div>
  );
}

// ── MyHand ──────────────────────────────────────────────────────────────────
function MyHand({ hand, abstraction, labelMode, floor, selectedHandId, onPickHand, animationMode }) {
  return (
    <div className="my-hand">
      <div className="mh-meta">
        <span className="mh-name serif">나</span>
        <span className="mh-sub">손패 <b className="tabnum">{hand.length}</b>장</span>
      </div>
      <div className="mh-cards">
        {hand.map((c, i) => {
          const matches = legalMatchesOnFloor(c, floor);
          // a card is always playable; "legal" here just means it'll match something
          const isLegal = true;
          const willMatch = matches.length > 0;
          const total = hand.length;
          const center = (total - 1) / 2;
          const offset = i - center;
          const rot = offset * 1.6;
          const lift = -Math.abs(offset) * 0.8;
          return (
            <div key={c.id} className="mh-card-wrap"
                 style={{
                   transform: `translateY(${lift}px) rotate(${rot}deg)`,
                   zIndex: 10 + i,
                   "--card-rotate": `${rot}deg`,
                 }}>
              <HwatuCard
                month={c.month} cat={c.cat} ribbon={c.ribbon} size="lg"
                abstraction={abstraction} labelMode={labelMode}
                isLegal={isLegal}
                isSelected={selectedHandId === c.id}
                onClick={() => onPickHand(c.id)}
                rotate={rot}
              />
              {!willMatch && (
                <div className="mh-no-match" aria-label="매칭 카드 없음 — 그냥 내려놓기">새로</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MyCaptured — 획득 더미 ──────────────────────────────────────────────────
function MyCaptured({ captured, score }) {
  const cats = ["GWANG", "YEOL", "TTI", "PI"];
  const targetScore = 7;
  const pct = Math.min(100, (score.total / targetScore) * 100);

  return (
    <div className="my-captured">
      <div className="mc-head">
        <div className="mc-title">획득 더미</div>
        <div className="mc-score">
          <div className="mc-score-num tabnum">{score.total}</div>
          <div className="mc-score-lbl">본점수</div>
        </div>
      </div>

      <div className="mc-progress" role="progressbar" aria-valuenow={score.total} aria-valuemin="0" aria-valuemax={targetScore}>
        <div className="mc-progress-fill" style={{ width: `${pct}%` }}/>
        <div className="mc-progress-marks">
          {[3, 5, 7].map(m => (
            <div key={m} className="mc-mark" style={{ left: `${(m / targetScore) * 100}%` }}>
              <span className="tabnum">{m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mc-cats">
        {cats.map(k => {
          const ids = captured[k];
          const def = CARD_CATEGORY[k];
          return (
            <div key={k} className={`mc-cat tone-${def.color}`}>
              <div className="mc-cat-head">
                <span className="mc-cat-name">{def.label}</span>
                <span className="mc-cat-count tabnum">{ids.length}</span>
              </div>
              <div className="mc-cat-strip">
                {ids.map((id, i) => {
                  const c = CARD_BY_ID[id];
                  if (!c) return null;
                  return (
                    <div key={id + i} className="mc-cat-card" style={{ marginLeft: i ? -22 : 0, zIndex: i }}>
                      <HwatuCard month={c.month} cat={c.cat} ribbon={c.ribbon}
                                 size="sm" labelMode="hangul" abstraction="mid"
                                 isLegal={false} isDisabled
                                 onClick={() => {}}/>
                    </div>
                  );
                })}
                {ids.length === 0 && <div className="mc-cat-empty">·</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── TopBar — turn indicator + chat + pause ──────────────────────────────────
function TopBar({ turn, timeLeft, onOpenSettlement, onOpenMatchModal, onScreen, screen }) {
  return (
    <div className="top-bar">
      <div className="tb-left">
        <div className="tb-logo serif">민화투</div>
        <div className="tb-room mono">방 코드 · A7K-2P</div>
      </div>
      <div className="tb-center">
        <div className="tb-turn">
          <span className="tb-turn-name">{turn.name}</span>
          <span className="tb-turn-lbl">의 차례</span>
        </div>
        <div className="tb-timer">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="11" fill="none" stroke="var(--line-2)" strokeWidth="2"/>
            <circle cx="14" cy="14" r="11" fill="none" stroke="var(--accent-gold)"
                    strokeWidth="2" strokeDasharray={2 * Math.PI * 11}
                    strokeDashoffset={2 * Math.PI * 11 * (1 - timeLeft / 30)}
                    transform="rotate(-90 14 14)" strokeLinecap="round"/>
          </svg>
          <span className="tabnum">{timeLeft}s</span>
        </div>
      </div>
      <div className="tb-right">
        <button className="tb-btn ghost" onClick={onOpenMatchModal}>다중매칭</button>
        <button className="tb-btn ghost" onClick={() => onScreen(screen === "board" ? "settlement" : "board")}>
          {screen === "board" ? "정산 →" : "← 게임"}
        </button>
        <button className="tb-btn icon" aria-label="채팅">💬</button>
        <button className="tb-btn icon" aria-label="설정">⚙</button>
      </div>
    </div>
  );
}

// ── Main GameBoard component ────────────────────────────────────────────────
function GameBoard({ tweaks, onScreen, screen }) {
  const [state, setState] = React.useState(() => makeDemoState());
  const [selectedHandId, setSelectedHandId] = React.useState(null);
  const [selectedFloorId, setSelectedFloorId] = React.useState(null);
  const [matchModalOpen, setMatchModalOpen] = React.useState(false);
  const [matchModalCtx, setMatchModalCtx] = React.useState(null);
  const [capturingIds, setCapturingIds] = React.useState(new Set());
  const [pulseScore, setPulseScore] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(22);

  // countdown
  React.useEffect(() => {
    const t = setInterval(() => setTimeLeft(s => (s > 0 ? s - 1 : 30)), 1000);
    return () => clearInterval(t);
  }, []);

  // demo opponents
  const opponents = [
    { name: "준호", color: "linear-gradient(135deg,#a84235,#c46b5e)", handCount: 9 },
    { name: "지우", color: "linear-gradient(135deg,#3a6647,#6b8c75)", handCount: 9 },
    { name: "민서", color: "linear-gradient(135deg,#3b4a6b,#6a7a9c)", handCount: 9 },
  ];

  const me = { name: "나", handCount: state.hand.length, captured: state.captured.me };

  // legal floor highlights when a hand card is selected
  const legalFloorIds = React.useMemo(() => {
    if (!selectedHandId) return new Set();
    const handCard = state.hand.find(c => c.id === selectedHandId);
    if (!handCard) return new Set();
    return new Set(legalMatchesOnFloor(handCard, state.floor));
  }, [selectedHandId, state.hand, state.floor]);

  function handlePickHand(id) {
    if (selectedHandId === id) {
      setSelectedHandId(null);
      return;
    }
    setSelectedHandId(id);
    // if multi-match → open modal
    const card = state.hand.find(c => c.id === id);
    const matches = legalMatchesOnFloor(card, state.floor);
    if (matches.length >= 2) {
      // auto-open modal after small delay so user sees highlights first
      setTimeout(() => {
        setMatchModalCtx({ handCard: card, matches });
        setMatchModalOpen(true);
      }, 350);
    }
  }

  function handlePickFloor(floorId) {
    if (!selectedHandId) return;
    const handCard = state.hand.find(c => c.id === selectedHandId);
    if (!handCard) return;
    const matches = legalMatchesOnFloor(handCard, state.floor);
    if (!matches.includes(floorId)) return;

    executeCapture(handCard, floorId);
  }

  function executeCapture(handCard, floorId) {
    // animate capture
    const newCapturing = new Set([handCard.id, floorId]);
    setCapturingIds(newCapturing);

    setTimeout(() => {
      setState(prev => {
        const newHand = prev.hand.filter(c => c.id !== handCard.id);
        const newFloor = prev.floor.filter(c => c.id !== floorId);

        // also draw + flip from pile
        const flipped = prev.pile[0];
        let nextPile = prev.pile.slice(1);
        let captured = { ...prev.captured };
        const myCap = { ...captured.me };

        // capture handCard + floor card
        myCap[handCard.cat] = [...myCap[handCard.cat], handCard.id];
        const floorCard = prev.floor.find(c => c.id === floorId);
        if (floorCard) myCap[floorCard.cat] = [...myCap[floorCard.cat], floorCard.id];

        // flipped card: try to match floor too
        let nextFloor = newFloor;
        if (flipped) {
          const flippedMatches = newFloor.filter(c => c.month === flipped.month);
          if (flippedMatches.length === 1) {
            myCap[flipped.cat] = [...myCap[flipped.cat], flipped.id];
            myCap[flippedMatches[0].cat] = [...myCap[flippedMatches[0].cat], flippedMatches[0].id];
            nextFloor = newFloor.filter(c => c.id !== flippedMatches[0].id);
          } else {
            nextFloor = [...newFloor, flipped];
          }
        }

        captured.me = myCap;
        return { hand: newHand, floor: nextFloor, pile: nextPile, captured };
      });

      setCapturingIds(new Set());
      setSelectedHandId(null);
      setSelectedFloorId(null);
      setPulseScore(true);
      setTimeout(() => setPulseScore(false), 700);
    }, 460);
  }

  function handleMatchPick(floorId) {
    setMatchModalOpen(false);
    if (!matchModalCtx) return;
    setTimeout(() => executeCapture(matchModalCtx.handCard, floorId), 120);
  }

  function openMatchPreview() {
    // demo: open with 12-T as the multi-match scenario (seed two of same month)
    // pick a hand card whose month has multiple floor matches; if none, use 9-Y (since 9-T is on floor + we add fake)
    setMatchModalCtx({
      handCard: state.hand.find(c => c.month === 9) || state.hand[0],
      matches: state.floor.filter(c => c.month === 9).map(c => c.id),
      // add a synthetic second match for preview if only one
    });
    // synthetic preview if only 1
    setMatchModalOpen(true);
  }

  const myScore = calcScore(state.captured.me);

  return (
    <div className="board-screen bg-tatami">
      <TopBar
        turn={{ name: me.name }}
        timeLeft={timeLeft}
        onOpenSettlement={() => onScreen("settlement")}
        onOpenMatchModal={openMatchPreview}
        onScreen={onScreen} screen={screen}
      />

      <div className="board-grid">
        {/* opponents */}
        <div className="zone-top">
          <PlayerStrip player={opponents[1]} position="top"
                       isCurrent={false} captured={state.captured.p3}/>
        </div>
        <div className="zone-left">
          <PlayerStrip player={opponents[0]} position="left"
                       isCurrent={false} captured={state.captured.p2}/>
        </div>
        <div className="zone-right">
          <PlayerStrip player={opponents[2]} position="right"
                       isCurrent={false} captured={state.captured.p4}/>
        </div>

        {/* center: floor + draw pile */}
        <div className="zone-center">
          <div className="zone-center-inner">
            <FloorBoard
              floor={state.floor}
              layout={tweaks.boardLayout}
              abstraction={tweaks.cardAbstraction}
              labelMode={tweaks.labelMode}
              legalIds={legalFloorIds}
              selectedFloorId={selectedFloorId}
              onPickFloor={handlePickFloor}
              capturingIds={capturingIds}
            />
            <div className="draw-pile-slot">
              <DrawPile count={state.pile.length}/>
            </div>
          </div>
        </div>

        {/* bottom: my captured + my hand */}
        <div className="zone-bottom">
          <div className={`zone-bottom-inner ${pulseScore ? "score-pulse" : ""}`}>
            <MyCaptured captured={state.captured.me} score={myScore}/>
            <MyHand
              hand={state.hand}
              abstraction={tweaks.cardAbstraction}
              labelMode={tweaks.labelMode}
              floor={state.floor}
              selectedHandId={selectedHandId}
              onPickHand={handlePickHand}
              animationMode={tweaks.animationIntensity}
            />
          </div>
        </div>
      </div>

      {matchModalOpen && matchModalCtx && (
        <MatchPickModal
          ctx={matchModalCtx}
          floor={state.floor}
          abstraction={tweaks.cardAbstraction}
          labelMode={tweaks.labelMode}
          onPick={handleMatchPick}
          onClose={() => { setMatchModalOpen(false); setSelectedHandId(null); }}
        />
      )}

      <HintBar
        selectedHandId={selectedHandId}
        legalCount={legalFloorIds.size}
      />
    </div>
  );
}

function HintBar({ selectedHandId, legalCount }) {
  let msg;
  if (!selectedHandId) msg = "손패에서 카드를 골라보세요";
  else if (legalCount === 0) msg = "매칭 카드 없음 — 바닥에 그냥 내려놓기";
  else if (legalCount === 1) msg = "바닥 카드를 클릭해 가져가기";
  else msg = `같은 월 카드 ${legalCount}장 — 어떤 걸 가져갈지 선택`;
  return (
    <div className="hint-bar" role="status" aria-live="polite">
      <span className="hint-dot"/>
      <span>{msg}</span>
    </div>
  );
}

// ── Match Pick Modal — 다중 매칭 ────────────────────────────────────────────
function MatchPickModal({ ctx, floor, abstraction, labelMode, onPick, onClose }) {
  // ensure at least 2 options for the demo preview
  const candidates = floor.filter(c => c.month === ctx.handCard.month);
  const options = candidates.length >= 2
    ? candidates
    : [...candidates, ...floor.filter(c => c.month !== ctx.handCard.month).slice(0, Math.max(0, 2 - candidates.length))];

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-label="다중 매칭 선택">
      <div className="modal-card">
        <div className="modal-head">
          <div className="modal-eyebrow serif">多重 マッチング</div>
          <div className="modal-title">같은 월 카드가 둘 이상이에요</div>
          <div className="modal-sub">어떤 카드를 가져갈지 선택하세요.</div>
        </div>

        <div className="modal-body">
          <div className="modal-handcard">
            <div className="modal-tag">내가 낸 카드</div>
            <HwatuCard month={ctx.handCard.month} cat={ctx.handCard.cat}
                       ribbon={ctx.handCard.ribbon} size="lg"
                       abstraction={abstraction} labelMode={labelMode}
                       isDisabled onClick={() => {}}/>
          </div>

          <div className="modal-arrow serif">⤳</div>

          <div className="modal-options">
            <div className="modal-tag">바닥 후보</div>
            <div className="modal-option-row">
              {options.map(c => (
                <button key={c.id} className="modal-option" onClick={() => onPick(c.id)}>
                  <HwatuCard month={c.month} cat={c.cat} ribbon={c.ribbon} size="lg"
                             abstraction={abstraction} labelMode={labelMode}
                             isLegal isDisabled={false}
                             onClick={() => onPick(c.id)}/>
                  <div className="modal-option-meta">
                    <span>{CARD_CATEGORY[c.cat].label}</span>
                    <span className="tabnum">{CARD_CATEGORY[c.cat].points}점</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <button className="modal-btn ghost" onClick={onClose}>취소</button>
          <span className="modal-hint">팁 — 띠/광 우선이 보통은 정답이에요</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { GameBoard, calcScore, CARD_BY_ID });
