// hwatu-card.jsx — the visual card component.
// Original 민화-flat illustration system. NEVER traces real 화투 photographs.
// All silhouettes are simplified shapes drawn from primitives.

const { MONTH_LABELS, CARD_CATEGORY, MONTH_PALETTE } = window;

// ── motif renderers ──────────────────────────────────────────────────────────
// Each takes (palette, accentMore) and draws into a 56x88 viewBox.
// Coordinates: cards are 56 wide × 88 tall; motif sits roughly y=14..76 below sky band.

function PineBranch({ x = 28, y = 36, scale = 1, color = "#1d3a26", accent = "#3a6647" }) {
  // 솔잎 다발 — three needle-fan clusters.
  const t = (n) => n * scale;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="14" ry="3" fill={color} opacity=".25" />
      {[-12, 0, 12].map((dx, i) => (
        <g key={i} transform={`translate(${dx},${i === 1 ? -2 : 0})`}>
          {[-22, -10, 0, 10, 22].map((deg, j) => (
            <line key={j} x1="0" y1="0"
                  x2={Math.sin(deg * Math.PI / 180) * 8}
                  y2={-Math.cos(deg * Math.PI / 180) * 8}
                  stroke={j === 2 ? color : accent} strokeWidth="1.5" strokeLinecap="round"/>
          ))}
          <circle cx="0" cy="0" r="1.5" fill={color}/>
        </g>
      ))}
    </g>
  );
}

function Crane({ x = 28, y = 50, color = "#f5ede0", accent = "#a84235" }) {
  // 학 — abstracted: white teardrop body, red crown dot, simple legs.
  return (
    <g transform={`translate(${x},${y})`}>
      {/* body */}
      <path d="M -10 0 Q -8 -7 0 -8 Q 12 -8 13 0 Q 12 5 0 5 Q -10 4 -10 0 Z"
            fill={color} stroke="#1b1a17" strokeWidth=".6"/>
      {/* neck + head */}
      <path d="M 11 -3 Q 17 -10 16 -16" stroke={color} strokeWidth="2.5"
            strokeLinecap="round" fill="none"/>
      <circle cx="16" cy="-16" r="2" fill={color} stroke="#1b1a17" strokeWidth=".5"/>
      {/* red crown */}
      <circle cx="16" cy="-17" r="1.4" fill={accent}/>
      {/* beak */}
      <line x1="17" y1="-16" x2="20" y2="-15" stroke="#1b1a17" strokeWidth=".6" strokeLinecap="round"/>
      {/* legs */}
      <line x1="-3" y1="5" x2="-3" y2="11" stroke="#1b1a17" strokeWidth=".7"/>
      <line x1="3" y1="5"  x2="3"  y2="11" stroke="#1b1a17" strokeWidth=".7"/>
      {/* tail flick */}
      <path d="M -10 0 L -16 -2 L -14 2 Z" fill="#1b1a17"/>
    </g>
  );
}

function CherryBlossomCurtain({ palette }) {
  // 3월 만막(幔幕) under cherries — abstracted as a striped curtain band.
  return (
    <g>
      {/* curtain band */}
      <rect x="6" y="50" width="44" height="14" fill={palette.ground} rx="2"/>
      <rect x="6" y="50" width="44" height="3" fill="#f5ede0" opacity=".7"/>
      <rect x="6" y="61" width="44" height="3" fill="#f5ede0" opacity=".7"/>
      {/* tassels */}
      <circle cx="14" cy="64" r="2" fill={palette.accent}/>
      <circle cx="42" cy="64" r="2" fill={palette.accent}/>
      {/* blossoms above */}
      {[[14, 28], [22, 22], [30, 28], [38, 22], [46, 28], [18, 36], [34, 36], [42, 36]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          {[0, 72, 144, 216, 288].map(d => (
            <ellipse key={d} cx="0" cy="-2.6"
              transform={`rotate(${d})`}
              rx="1.6" ry="2.2" fill="#f5d8de" stroke="#a84235" strokeWidth=".3"/>
          ))}
          <circle r=".9" fill={palette.accent}/>
        </g>
      ))}
    </g>
  );
}

function CherryPi({ palette }) {
  // pi version — tree branch with blossoms only
  return (
    <g>
      <path d="M 12 70 Q 28 30 46 22" stroke="#3d2818" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {[[18, 56], [26, 44], [34, 36], [42, 28], [22, 64], [38, 30]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          {[0, 72, 144, 216, 288].map(d => (
            <ellipse key={d} cx="0" cy="-2.4"
              transform={`rotate(${d})`}
              rx="1.5" ry="2.1" fill="#f5d8de" stroke="#a84235" strokeWidth=".3"/>
          ))}
        </g>
      ))}
    </g>
  );
}

function FullMoon({ palette }) {
  // 8월 공산 — black/dark hill silhouette + huge moon
  return (
    <g>
      <circle cx="38" cy="34" r="14" fill={palette.accent}/>
      <circle cx="38" cy="34" r="14" fill="#fff8e0" opacity=".15"/>
      {/* hill silhouette */}
      <path d="M 0 70 Q 20 50 28 56 Q 38 64 56 56 L 56 88 L 0 88 Z" fill={palette.ground}/>
      <path d="M 0 70 Q 20 50 28 56 Q 38 64 56 56" stroke="#1b1a17" strokeWidth=".4" fill="none" opacity=".4"/>
    </g>
  );
}

function Geese({ palette }) {
  // 8월 열끗 — three flying geese (V formation)
  return (
    <g>
      <FullMoon palette={palette}/>
      {[[18, 30], [28, 24], [38, 30]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <path d="M -4 0 Q 0 -3 4 0" stroke="#1b1a17" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
          <path d="M -3 0 L 0 -2 L 3 0" stroke="#1b1a17" strokeWidth=".6" fill="none"/>
        </g>
      ))}
    </g>
  );
}

function Paulownia({ palette }) {
  // 11월 오동 — large paulownia leaves + flower clusters (phoenix omitted, abstracted).
  return (
    <g>
      {/* leaves — three trefoils */}
      <g fill={palette.accent} opacity=".95">
        <path d="M 28 18 Q 16 22 14 36 Q 22 38 28 30 Q 34 38 42 36 Q 40 22 28 18 Z"
              stroke="#1b1a17" strokeWidth=".4"/>
      </g>
      <g fill={palette.accent} opacity=".7">
        <path d="M 14 40 Q 6 44 6 56 Q 14 58 18 50 Q 22 56 26 52 Q 24 42 14 40 Z"
              stroke="#1b1a17" strokeWidth=".4"/>
        <path d="M 42 40 Q 50 44 50 56 Q 42 58 38 50 Q 34 56 30 52 Q 32 42 42 40 Z"
              stroke="#1b1a17" strokeWidth=".4"/>
      </g>
      {/* leaf veins */}
      <line x1="28" y1="20" x2="28" y2="34" stroke="#1b1a17" strokeWidth=".4" opacity=".5"/>
      {/* flower cluster */}
      {[[26, 60], [32, 64], [28, 68]].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="2" ry="1.4" fill="#d4a86b" stroke="#1b1a17" strokeWidth=".3"/>
      ))}
    </g>
  );
}

function RainUmbrella({ palette }) {
  // 12월 비광 — rain streaks + umbrella + small figure (abstracted to silhouette).
  return (
    <g>
      {/* rain streaks */}
      {[10, 16, 20, 26, 36, 44, 50].map((x, i) => (
        <line key={i} x1={x} y1={20 + (i % 3) * 4} x2={x - 3} y2={36 + (i % 3) * 4}
              stroke="#a8bfd8" strokeWidth="1" opacity=".7"/>
      ))}
      {/* umbrella */}
      <path d="M 16 50 Q 28 38 42 50 L 42 52 L 16 52 Z" fill="#1b1a17"/>
      <line x1="29" y1="50" x2="29" y2="68" stroke="#1b1a17" strokeWidth="1.2"/>
      <path d="M 29 68 Q 32 70 30 72" stroke="#1b1a17" strokeWidth="1" fill="none"/>
      {/* willow accent (small) */}
      <path d="M 12 56 Q 8 62 14 70" stroke={palette.accent} strokeWidth="1" fill="none" opacity=".7"/>
    </g>
  );
}

function Swallow({ palette }) {
  // 12월 비 열끗 — swallow silhouette
  return (
    <g>
      <path d="M 18 38 Q 28 30 38 38 L 34 42 L 36 48 L 28 44 L 20 48 L 22 42 Z"
            fill="#1b1a17"/>
      <line x1="28" y1="44" x2="28" y2="56" stroke="#1b1a17" strokeWidth=".6"/>
    </g>
  );
}

function Plum({ palette }) {
  // 2월 매조 — plum blossom branch + nightingale
  return (
    <g>
      <path d="M 10 70 Q 22 40 48 24" stroke="#3d2818" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {[[16, 58], [22, 50], [30, 38], [38, 30]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          {[0, 72, 144, 216, 288].map(d => (
            <ellipse key={d} cx="0" cy="-2.2"
              transform={`rotate(${d})`}
              rx="1.4" ry="1.9" fill="#f5e3d8" stroke="#a84235" strokeWidth=".3"/>
          ))}
          <circle r=".7" fill={palette.accent}/>
        </g>
      ))}
      {/* bird */}
      <ellipse cx="40" cy="44" rx="4" ry="3" fill="#3a6647"/>
      <circle cx="44" cy="42" r="1.6" fill="#3a6647"/>
      <line x1="45" y1="42" x2="47" y2="42" stroke="#1b1a17" strokeWidth=".5"/>
    </g>
  );
}

function BlackBush({ palette }) {
  // 4월 흑싸리
  return (
    <g>
      <path d="M 28 70 L 28 28" stroke="#1b1a17" strokeWidth="1.5"/>
      {[[20, 32, -25], [36, 32, 25], [16, 44, -30], [40, 44, 30], [22, 56, -20], [34, 56, 20]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
          <ellipse cx="0" cy="0" rx="6" ry="2.5" fill="#1b1a17"/>
        </g>
      ))}
      <circle cx="42" cy="26" r="2.5" fill={palette.accent} opacity=".9"/>
    </g>
  );
}

function Orchid({ palette }) {
  // 5월 난초
  return (
    <g>
      {[-30, -10, 10, 30].map((r, i) => (
        <path key={i} d="M 0 0 Q 4 -20 12 -32"
              transform={`translate(28,68) rotate(${r})`}
              stroke="#3a6647" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      ))}
      {[[24, 38], [32, 36], [28, 30]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          {[0, 60, 120, 180, 240, 300].map(d => (
            <ellipse key={d} cx="0" cy="-1.6"
              transform={`rotate(${d})`}
              rx="1.1" ry="1.6" fill={palette.accent}/>
          ))}
        </g>
      ))}
    </g>
  );
}

function Peony({ palette }) {
  // 6월 모란
  return (
    <g>
      {[[20, 56, 8], [38, 50, 9], [26, 36, 10]].map(([cx, cy, r], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          {[0, 60, 120, 180, 240, 300].map(d => (
            <ellipse key={d} cx="0" cy={-r * 0.5}
              transform={`rotate(${d})`}
              rx={r * 0.5} ry={r * 0.7} fill="#f5e3d8" stroke="#a84235" strokeWidth=".4"/>
          ))}
          <circle r="2" fill={palette.accent}/>
        </g>
      ))}
      {/* leaves */}
      <ellipse cx="14" cy="46" rx="5" ry="2" transform="rotate(-30 14 46)" fill="#3a6647"/>
      <ellipse cx="44" cy="40" rx="5" ry="2" transform="rotate(20 44 40)" fill="#3a6647"/>
    </g>
  );
}

function RedBush({ palette }) {
  // 7월 홍싸리
  return (
    <g>
      <path d="M 28 70 Q 28 50 26 30" stroke="#5e2818" strokeWidth="1.5" fill="none"/>
      {[[20, 36, -25], [36, 38, 25], [18, 50, -30], [40, 50, 30], [22, 62, -20], [34, 62, 20]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="5" ry="2.2" fill={palette.sky}
                 transform={`rotate(${r} ${x} ${y})`}/>
      ))}
    </g>
  );
}

function Boar({ palette }) {
  // 7월 멧돼지
  return (
    <g transform="translate(28,46)">
      <RedBush palette={palette}/>
      <ellipse cx="0" cy="14" rx="11" ry="6" fill="#3d2818"/>
      <ellipse cx="-9" cy="13" rx="4" ry="3" fill="#3d2818"/>
      <line x1="-12" y1="13" x2="-15" y2="11" stroke="#f5ede0" strokeWidth=".8"/>
      <circle cx="-11" cy="12" r=".5" fill="#f5ede0"/>
      <line x1="-4" y1="20" x2="-4" y2="23" stroke="#3d2818" strokeWidth="1"/>
      <line x1="4" y1="20" x2="4" y2="23" stroke="#3d2818" strokeWidth="1"/>
    </g>
  );
}

function Chrysanthemum({ palette }) {
  // 9월 국화 — large radial blossom + sake-cup hint
  return (
    <g>
      <g transform="translate(28,42)">
        {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map(d => (
          <ellipse key={d} cx="0" cy="-9"
            transform={`rotate(${d})`}
            rx="3" ry="9" fill="#f5d484" stroke="#a84235" strokeWidth=".4"/>
        ))}
        <circle r="3.5" fill={palette.accent}/>
        <circle r="1.5" fill="#f5e3d8"/>
      </g>
      {/* leaf */}
      <ellipse cx="14" cy="62" rx="6" ry="2.5" transform="rotate(-30 14 62)" fill="#3a6647"/>
      <ellipse cx="42" cy="62" rx="6" ry="2.5" transform="rotate(30 42 62)" fill="#3a6647"/>
    </g>
  );
}

function Maple({ palette }) {
  // 10월 단풍
  return (
    <g>
      {/* trunk */}
      <path d="M 18 70 Q 22 50 28 36 Q 36 22 44 16" stroke="#3d2818" strokeWidth="1.5" fill="none"/>
      {[[22, 52], [30, 38], [40, 26], [16, 60], [36, 44]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          {/* maple leaf — simplified 5-pointed */}
          {[0, 72, 144, 216, 288].map(d => (
            <ellipse key={d} cx="0" cy="-2.6"
              transform={`rotate(${d})`}
              rx="1.6" ry="2.6" fill={palette.accent} stroke="#5e1f18" strokeWidth=".3"/>
          ))}
          <circle r=".8" fill="#5e1f18"/>
        </g>
      ))}
    </g>
  );
}

function Deer({ palette }) {
  // 10월 사슴 (열끗)
  return (
    <g>
      <Maple palette={palette}/>
      <g transform="translate(20,58)">
        {/* body */}
        <ellipse cx="0" cy="0" rx="8" ry="3.5" fill="#c47a4a"/>
        <ellipse cx="-7" cy="-2" rx="3" ry="2.5" fill="#c47a4a"/>
        <line x1="-9" y1="-4" x2="-10" y2="-7" stroke="#3d2818" strokeWidth="1"/>
        <line x1="-7" y1="-4" x2="-7" y2="-7" stroke="#3d2818" strokeWidth="1"/>
        {/* legs */}
        <line x1="-3" y1="3" x2="-3" y2="7" stroke="#3d2818" strokeWidth=".8"/>
        <line x1="4" y1="3" x2="4" y2="7" stroke="#3d2818" strokeWidth=".8"/>
        <circle cx="-9" cy="-3" r=".3" fill="#1b1a17"/>
      </g>
    </g>
  );
}

// ── ribbons (띠) ──────────────────────────────────────────────────────────────
function Ribbon({ kind, palette }) {
  // RED_POEM (홍단), GREEN (초단), BLUE (청단)
  const fill = kind === "RED_POEM" ? "#c8534a" : kind === "BLUE" ? "#3b4a6b" : "#3a6647";
  return (
    <g>
      <rect x="6" y="46" width="44" height="14" rx="2" fill={fill}
            stroke="#1b1a17" strokeWidth=".4" opacity=".95"/>
      {/* fold ends */}
      <path d="M 6 46 L 4 50 L 6 60 Z" fill={fill} opacity=".8"/>
      <path d="M 50 46 L 52 50 L 50 60 Z" fill={fill} opacity=".8"/>
      {/* poem characters for 홍단 */}
      {kind === "RED_POEM" && (
        <g fill="#f5ede0" fontFamily="serif" fontSize="6" textAnchor="middle">
          <text x="16" y="56">明</text>
          <text x="28" y="56">恒</text>
          <text x="40" y="56">紅</text>
        </g>
      )}
      {kind === "BLUE" && (
        <line x1="10" y1="53" x2="46" y2="53" stroke="#f5ede0" strokeWidth=".5" opacity=".5"/>
      )}
    </g>
  );
}

// ── motif dispatcher ─────────────────────────────────────────────────────────
function CardMotif({ month, cat, ribbon, palette, accentMore }) {
  // GWANG cards
  if (cat === "GWANG") {
    if (month === 1)  return <><PineBranch x={16} y={32} scale={1.3}/><Crane x={36} y={50} accent={palette.accent}/></>;
    if (month === 3)  return <CherryBlossomCurtain palette={palette}/>;
    if (month === 8)  return <FullMoon palette={palette}/>;
    if (month === 11) return <Paulownia palette={palette}/>;
    if (month === 12) return <RainUmbrella palette={palette}/>;
  }
  // YEOL cards
  if (cat === "YEOL") {
    if (month === 2)  return <Plum palette={palette}/>;
    if (month === 4)  return <BlackBush palette={palette}/>;
    if (month === 5)  return <Orchid palette={palette}/>;
    if (month === 6)  return <Peony palette={palette}/>;
    if (month === 7)  return <Boar palette={palette}/>;
    if (month === 8)  return <Geese palette={palette}/>;
    if (month === 9)  return <Chrysanthemum palette={palette}/>;
    if (month === 10) return <Deer palette={palette}/>;
    if (month === 12) return <Swallow palette={palette}/>;
  }
  // TTI — ribbon over month motif (small)
  if (cat === "TTI") {
    return (
      <>
        {month === 1  && <PineBranch x={28} y={28} scale={.85}/>}
        {month === 2  && <Plum palette={palette}/>}
        {month === 3  && <CherryPi palette={palette}/>}
        {month === 4  && <BlackBush palette={palette}/>}
        {month === 5  && <Orchid palette={palette}/>}
        {month === 6  && <Peony palette={palette}/>}
        {month === 7  && <RedBush palette={palette}/>}
        {month === 9  && <Chrysanthemum palette={palette}/>}
        {month === 10 && <Maple palette={palette}/>}
        {month === 12 && <RainUmbrella palette={palette}/>}
        <Ribbon kind={ribbon} palette={palette}/>
      </>
    );
  }
  // PI — bare motif
  if (cat === "PI") {
    if (month === 1)  return <PineBranch x={28} y={42} scale={1.1}/>;
    if (month === 2)  return <Plum palette={palette}/>;
    if (month === 3)  return <CherryPi palette={palette}/>;
    if (month === 4)  return <BlackBush palette={palette}/>;
    if (month === 5)  return <Orchid palette={palette}/>;
    if (month === 6)  return <Peony palette={palette}/>;
    if (month === 7)  return <RedBush palette={palette}/>;
    if (month === 8)  return <FullMoon palette={palette}/>;
    if (month === 9)  return <Chrysanthemum palette={palette}/>;
    if (month === 10) return <Maple palette={palette}/>;
    if (month === 11) return <Paulownia palette={palette}/>;
    if (month === 12) return <RainUmbrella palette={palette}/>;
  }
  return null;
}

// ── card faces ───────────────────────────────────────────────────────────────

function HwatuCardBack({ size = "md" }) {
  const W = size === "lg" ? 72 : size === "sm" ? 40 : 56;
  const H = size === "lg" ? 112 : size === "sm" ? 64 : 88;
  return (
    <svg viewBox="0 0 56 88" width={W} height={H} style={{ display: "block" }}>
      <defs>
        <pattern id="cb" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M 0 3 L 3 0 L 6 3 L 3 6 Z" fill="none" stroke="#3a0e0a" strokeWidth=".5"/>
        </pattern>
      </defs>
      <rect x="1" y="1" width="54" height="86" rx="4" fill="var(--card-back)"
            stroke="var(--card-back-edge)" strokeWidth="1"/>
      <rect x="1" y="1" width="54" height="86" rx="4" fill="url(#cb)" opacity=".4"/>
      <rect x="5" y="5" width="46" height="78" rx="3" fill="none"
            stroke="#f5e3d8" strokeWidth=".5" opacity=".5"/>
      <text x="28" y="50" textAnchor="middle" fontFamily="serif"
            fontSize="20" fill="#f5e3d8" opacity=".75">花</text>
    </svg>
  );
}

function HwatuCard({
  month, cat, ribbon,
  size = "md",                  // sm | md | lg
  abstraction = "mid",          // minimal | mid | painterly
  labelMode = "hanja",          // hanja | hangul | none
  isLegal = true,
  isSelected = false,
  isDisabled = false,
  faceDown = false,
  rotate = 0,
  onClick,
  ariaLabel,
  highlightTier,                // for category tinting in 획득 더미
  className = "",
  style = {},
}) {
  if (faceDown) {
    return (
      <div className={`hwatu-card facedown ${className}`}
           style={{ transform: `rotate(${rotate}deg)`, ...style }}
           role="img" aria-label="뒷면 카드">
        <HwatuCardBack size={size}/>
      </div>
    );
  }

  const palette = MONTH_PALETTE[month];
  const lbl = MONTH_LABELS[month];
  const catDef = CARD_CATEGORY[cat];

  const W = size === "lg" ? 72 : size === "sm" ? 40 : 56;
  const H = size === "lg" ? 112 : size === "sm" ? 64 : 88;

  // category badge color
  const badgeColor = {
    GWANG: "var(--accent-gold)",
    YEOL:  "var(--accent-indigo)",
    TTI:   "var(--accent-red)",
    PI:    "var(--ink-3)",
  }[cat];

  const motif = (
    <CardMotif month={month} cat={cat} ribbon={ribbon} palette={palette}/>
  );

  // minimal mode strips motif details, keeps only sky band + label
  const showMotif = abstraction !== "minimal";

  const labelText =
    labelMode === "none" ? "" :
    labelMode === "hangul" ? lbl.han :
    lbl.hanja;

  const aria = ariaLabel ?? `${lbl.han} ${catDef.label}`;

  return (
    <button
      type="button"
      className={`hwatu-card ${isLegal ? "legal" : "illegal"} ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""} ${className}`}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      aria-label={aria}
      aria-pressed={isSelected}
      style={{
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      <svg viewBox="0 0 56 88" width={W} height={H} style={{ display: "block" }}>
        {/* card body */}
        <rect x="1" y="1" width="54" height="86" rx="4"
              fill="var(--card-face)" stroke="var(--card-face-edge)" strokeWidth=".75"/>
        {/* sky band */}
        <rect x="1" y="1" width="54" height={cat === "GWANG" ? 20 : 16} rx="4" fill={palette.sky}/>
        <rect x="1" y={cat === "GWANG" ? 18 : 14} width="54" height="2" fill={palette.ground} opacity=".4"/>

        {/* corner tick (paper feel) */}
        <path d="M 1 1 L 5 1 L 1 5 Z" fill="var(--card-face-edge)" opacity=".4"/>

        {/* category badge — top-left for 광 */}
        {cat === "GWANG" && (
          <g>
            <circle cx="9" cy="11" r="6.5" fill="var(--card-face)" opacity=".95"/>
            <circle cx="9" cy="11" r="6.5" fill="none" stroke="var(--accent-gold)" strokeWidth=".6"/>
            <text x="9" y="14" textAnchor="middle" fontFamily="serif" fontSize="8"
                  fill="var(--accent-gold)" fontWeight="600">光</text>
          </g>
        )}

        {/* motif */}
        {showMotif && motif}

        {/* abstract minimal alt: just a swatch */}
        {!showMotif && (
          <g>
            <rect x="14" y="30" width="28" height="36" rx="4" fill={palette.ground} opacity=".4"/>
            <text x="28" y="54" textAnchor="middle" fontFamily="serif" fontSize="14"
                  fill={palette.accent}>{lbl.hanjaMotif[0]}</text>
          </g>
        )}

        {/* corner label */}
        {labelText && (
          <g>
            <text x="51" y="84" textAnchor="end" fontFamily={labelMode === "hanja" ? "serif" : "var(--font-sans)"}
                  fontSize={labelMode === "hanja" ? 7 : 6}
                  fill="var(--ink-2)" opacity=".75">
              {labelText}
            </text>
          </g>
        )}

        {/* category mini-pill bottom-left */}
        <g>
          <rect x="3" y="78" width="14" height="7" rx="2" fill={badgeColor} opacity=".9"/>
          <text x="10" y="83.5" textAnchor="middle" fontSize="5" fontFamily="var(--font-sans)"
                fill="#faf6ee" fontWeight="600">{catDef.label}</text>
        </g>
      </svg>

      {isSelected && <span className="hc-ring" aria-hidden="true"/>}
    </button>
  );
}

Object.assign(window, { HwatuCard, HwatuCardBack });
