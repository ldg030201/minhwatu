# 민화투 핸드오프 — 게임 보드 + 정산

> 이번 턴 산출물: `index.html` (단일 진입점 인터랙티브 프로토타입) + 본 문서.
> 다음 턴: 랜딩 / 로비 / 대기실 / 다중매칭 모달 디테일 / 단일 카드 변형 (광·열끗·띠·피 5종 풀 컴플리션).

---

## A. 컴포넌트 트리

```
<App>                         app.jsx           — 테마/스크린/Tweaks 오케스트레이션
├── <GameBoard>               game-board.jsx
│   ├── <TopBar>                                 — 로고/방코드/턴/타이머/화면스위치
│   ├── <PlayerStrip ×3>                         — 상/좌/우 (top|left|right)
│   │   ├── ps-meta (avatar + name + score)
│   │   ├── ps-hand (face-down stacked backs)
│   │   └── ps-captured (4 카테고리 미니칩)
│   ├── <FloorBoard>                             — grid|hybrid|free 레이아웃 분기
│   │   └── <HwatuCard ×N>
│   ├── <DrawPile>                               — 산패 + count
│   ├── <MyCaptured>                             — 4개 shelf + 본점수 + 진행률 바
│   ├── <MyHand>                                 — fan-arc 손패
│   ├── <HintBar>                                — 라이브 힌트
│   └── <MatchPickModal>                         — 다중 매칭 선택
└── <Settlement>              settlement.jsx
    ├── settle-hero (승자 발표)
    ├── <DanBurst ×N>                            — 단(短) 마이크로 이벤트
    └── <PlayerColumn ×4>
        ├── <CategoryShelf ×4>                   — 광/열끗/띠/피 카드 strip + 카운터업
        └── pc-breakdown (점수 산출 행)

<HwatuCard>                   hwatu-card.jsx    — 모든 카드의 단일 컴포넌트
├── <CardMotif> → 12 × 4 motif 분기
└── <Ribbon> (TTI 전용)
```

---

## B. props 시그니처

### `<HwatuCard>`
```ts
interface HwatuCardProps {
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  cat: 'GWANG' | 'YEOL' | 'TTI' | 'PI';
  ribbon?: 'RED_POEM' | 'BLUE' | 'GREEN';   // TTI일 때만
  size?: 'sm' | 'md' | 'lg';                // default: md (56×88)
  abstraction?: 'minimal' | 'mid' | 'painterly';
  labelMode?: 'hanja' | 'hangul' | 'none';
  isLegal?: boolean;                        // 합법수 — outline + opacity
  isSelected?: boolean;                     // 손패에서 선택됨
  isDisabled?: boolean;                     // 클릭 비활성
  faceDown?: boolean;                       // 뒷면
  rotate?: number;                          // 회전 deg
  onClick?: () => void;
  ariaLabel?: string;                       // 자동 생성 ('1월 광' 등)
  className?: string;
  style?: React.CSSProperties;
}
```

### `<FloorBoard>`
```ts
interface FloorBoardProps {
  floor: CardData[];
  layout: 'grid' | 'hybrid' | 'free';
  abstraction: HwatuCardProps['abstraction'];
  labelMode: HwatuCardProps['labelMode'];
  legalIds: Set<string>;                    // 하이라이트할 카드 id
  selectedFloorId: string | null;
  onPickFloor: (id: string) => void;
  capturingIds: Set<string>;                // 캡처 애니메이션 중인 카드
}
```

### `<MyHand>`
```ts
interface MyHandProps {
  hand: CardData[];
  abstraction; labelMode;
  floor: CardData[];                        // 매칭 가능 여부 계산용
  selectedHandId: string | null;
  onPickHand: (id: string) => void;
  animationMode: 'minimal' | 'mid' | 'full';
}
```

### `<MyCaptured>`
```ts
interface MyCapturedProps {
  captured: { GWANG: string[], YEOL: string[], TTI: string[], PI: string[] };
  score: { total, gwang, yeol, tti, pi };
}
```

### `<MatchPickModal>`
```ts
interface MatchPickModalProps {
  ctx: { handCard: CardData; matches: string[] };
  floor: CardData[];
  abstraction; labelMode;
  onPick: (floorId: string) => void;
  onClose: () => void;
}
```

### `<DanBurst>`
```ts
interface DanBurstProps {
  dan: { kind: 'RED_POEM'|'BLUE'|'GREEN'; cards: CardData[]; points: 30; label: string; hanja: string; color: 'red'|'indigo'|'green' };
  delay?: number;
  opponents?: number;                       // 점수 곱 표시용
}
```

### `<Settlement>`
```ts
interface SettlementProps {
  tweaks: TweakState;
  onScreen: (s: 'board' | 'settlement') => void;
  capturedAll: { me, p2, p3, p4 };
  players: Record<PlayerKey, { name: string; color: string }>;
}
```

---

## C. tailwind.config.ts 확장본

> 본 시안은 CSS 변수로 작성됨 (`tokens.css`). Tailwind 적용 시 변수→theme 매핑.

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        // 따뜻한 중성
        bg:        { DEFAULT: '#f1ebe0', 2: '#ebe3d4', 3: '#e3d9c6', elev: '#faf6ee' },
        ink:       { DEFAULT: '#1b1a17', 2: '#4a4740', 3: '#6b6960', 4: '#908d83' },
        line:      { DEFAULT: 'rgba(27,26,23,0.10)', 2: 'rgba(27,26,23,0.18)' },

        // 포인트 — muted 톤 (기본). vivid/single 토큰은 data-attribute로 전환.
        maple:     { DEFAULT: '#a84235', soft: '#c46b5e', bg: '#f5e2dd' },  // 단풍
        pine:      { DEFAULT: '#3a6647', soft: '#6b8c75', bg: '#dde6dd' },  // 송학
        paulownia: { DEFAULT: '#b89456', soft: '#d4b884', bg: '#f1e6cc' },  // 오동
        rain:      { DEFAULT: '#3b4a6b', soft: '#6a7a9c', bg: '#d8dbe5' },  // 비/물 (보조)

        // 카드 면
        card: { face: '#f9f3e6', edge: '#e8dec5', back: '#6b1f1a', backEdge: '#4a1611' },
      },

      fontFamily: {
        sans:  ['"Pretendard Variable"', 'Pretendard', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif KR"', '"Nanum Myeongjo"', 'serif'],   // 카드 한자/한글 명조
        mono:  ['"JetBrains Mono"', 'ui-monospace', 'monospace'],   // 방 코드/타임스탬프
      },

      fontSize: {
        // 게임 UI는 12–14가 베이스, 14가 액션 라벨. 32+는 점수 디스플레이.
        'tag':    ['10px', { lineHeight: '14px', letterSpacing: '0.05em' }],
        'meta':   ['11px', { lineHeight: '15px' }],
        'body':   ['13px', { lineHeight: '18px' }],
        'btn':    ['13px', { lineHeight: '18px', fontWeight: '600' }],
        'h-card': ['28px', { lineHeight: '1', fontWeight: '700' }],
        'h-page': ['56px', { lineHeight: '1.05', fontWeight: '700', letterSpacing: '-0.02em' }],
      },

      spacing: {
        // 4px 그리드. 카드 갭은 6/10/14가 기본.
        'card-gap':  '6px',
        'card-gap2': '10px',
        'card-gap3': '14px',
      },

      borderRadius: {
        'card':  '8px',     // 화투 카드
        'sm':    '6px',
        'md':    '10px',
        'lg':    '14px',
        'xl':    '22px',
        'pill':  '999px',
      },

      boxShadow: {
        // 따뜻한 톤의 그림자 (검정 대신 갈색 베이스)
        'soft':   '0 1px 2px rgba(50,38,22,0.06), 0 1px 1px rgba(50,38,22,0.04)',
        'card':   '0 1px 0 rgba(255,255,255,.6) inset, 0 2px 4px rgba(50,38,22,.08), 0 1px 1px rgba(50,38,22,.06)',
        'lift':   '0 1px 0 rgba(255,255,255,.6) inset, 0 12px 24px rgba(50,38,22,.18), 0 4px 8px rgba(50,38,22,.10)',
        'legal':  '0 0 0 2px rgba(199,160,89,.55), 0 8px 18px rgba(199,160,89,.25)',
        'panel':  '0 8px 24px rgba(50,38,22,.10), 0 2px 6px rgba(50,38,22,.06)',
      },

      transitionTimingFunction: {
        'out':    'cubic-bezier(0.22, 1, 0.36, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      width: {
        'card':    '56px',
        'card-lg': '72px',
        'card-sm': '40px',
      },
      height: {
        'card':    '88px',
        'card-lg': '112px',
        'card-sm': '64px',
      },

      keyframes: {
        ringPulse:  { '0%,100%': { boxShadow: '0 0 0 4px rgba(184,148,86,.18)' }, '50%': { boxShadow: '0 0 0 8px rgba(184,148,86,.05)' } },
        legalPulse: { '0%,100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
        flipReveal: { '0%': { transform: 'rotateY(180deg) scale(.92)' }, '60%': { transform: 'rotateY(0) scale(1.06)' }, '100%': { transform: 'rotateY(0) scale(1)' } },
        captureFly: { 'to': { transform: 'translate(var(--cap-x), var(--cap-y)) scale(.5)', opacity: '0' } },
        shelfRise:  { 'from': { transform: 'translateY(12px)', opacity: '0' }, 'to': { transform: 'translateY(0)', opacity: '1' } },
        modalRise:  { 'from': { opacity: '0', transform: 'translateY(20px) scale(.96)' }, 'to': { opacity: '1', transform: 'translateY(0) scale(1)' } },
      },
      animation: {
        'ring-pulse':  'ringPulse 1.4s ease-in-out infinite',
        'legal-pulse': 'legalPulse 1.6s ease-in-out infinite',
        'flip-reveal': 'flipReveal 520ms cubic-bezier(0.34,1.56,0.64,1) both',
        'capture-fly': 'captureFly 560ms cubic-bezier(0.22,1,0.36,1) forwards',
        'shelf-rise':  'shelfRise 500ms cubic-bezier(0.34,1.56,0.64,1) both',
        'modal-rise':  'modalRise 320ms cubic-bezier(0.34,1.56,0.64,1)',
      },
    },
  },
} satisfies Config;
```

---

## D. 디자인 토큰 표

### Color (라이트)
| Token | Hex | 용도 |
|---|---|---|
| `--bg` | `#f1ebe0` | 페이지 배경 (오프화이트, 다다미 톤) |
| `--bg-2` | `#ebe3d4` | 패널 베이스 (바닥/모달 백드롭) |
| `--bg-3` | `#e3d9c6` | 트랙/세컨더리 |
| `--bg-elev` | `#faf6ee` | 카드/강조 패널 (한 단계 떠 있음) |
| `--ink` | `#1b1a17` | 본문/숫자/제목 |
| `--ink-2` | `#4a4740` | 보조 텍스트 |
| `--ink-3` | `#6b6960` | 힌트/메타 |
| `--ink-4` | `#908d83` | 비활성/플레이스홀더 |
| `--accent-red` | `#a84235` | 단풍 — 점수/승자 |
| `--accent-green` | `#3a6647` | 송학 — 차분한 액션 |
| `--accent-gold` | `#b89456` | 오동 — **주 포인트**, 합법수 링, 진행률 |
| `--accent-indigo` | `#3b4a6b` | 비/물 — 야간/보조 |

### Color (다크 — 카페 무드)
| Token | Hex |
|---|---|
| `--bg` | `#1a1816` |
| `--bg-elev` | `#25221d` |
| `--ink` | `#f1ece1` |
| `--accent-red` | `#c8534a` |
| `--accent-gold` | `#d4b075` |

### Spacing (4px 그리드)
| Token | px | 용도 |
|---|---|---|
| `card-gap` | 6 | 손패 fan 내부 |
| `card-gap2` | 10 | 셀 간 |
| `card-gap3` | 14 | 패널 간 |
| `pad-panel` | 14–18 | 카드/패널 내부 |

### Radius
| Token | px |
|---|---|
| `--r-card` | 8 |
| `--r-sm` | 6 |
| `--r-md` | 10 (버튼) |
| `--r-lg` | 14 (패널) |
| `--r-xl` | 22 (모달/플레이어 컬럼) |
| `--r-pill` | 999 (태그/타이머) |

### Shadow
| Token | 용도 |
|---|---|
| `--sh-1` | 채팅칩, 띠/피 미니칩 |
| `--sh-2` | 모달/힌트바 |
| `--sh-3` | 정산 카드 |
| `--sh-card` | 카드 기본 — 종이 두께감 |
| `--sh-card-lift` | 호버 시 살짝 떠오름 |
| `--sh-card-legal` | 합법수 — 골드 outer ring |

### Typography
| Token | font · size · weight | 용도 |
|---|---|---|
| `tag` | sans · 10px · 500 / `letter-spacing 0.05em` | 카테고리 라벨, 메타 |
| `meta` | sans · 11–12px · 400 | 보조 텍스트 |
| `body` | sans · 13px · 400 | 본문 |
| `btn` | sans · 13px · 600 | 버튼 |
| `h-card` | sans · 28–32px · 700 / `tabular-nums` | 점수 디스플레이 |
| `h-page` | sans · 56px · 700 / `letter-spacing -0.02em` | 정산 hero |
| `card-hanja` | serif (Noto Serif KR) · 6–8px | 카드 위 한자 |
| `mono-meta` | mono · 11px | 방 코드 |

### Easing
| Token | bezier | 용도 |
|---|---|---|
| `--ez-out` | `0.22, 1, 0.36, 1` | 카드 이동/모달 페이드 |
| `--ez-spring` | `0.34, 1.56, 0.64, 1` | 단(短) 카드 등장, 모달 라이즈 |

---

## E. 카드 일러스트 시스템

- **viewBox**: 56 × 88 (2:7 → 정확히 2:11/14, 화투 비율 유지)
- **구조**: `[0] body 카드면 → [1] sky band (cat에 따라 16 or 20px) → [2] motif → [3] 코너 한자 라벨 → [4] 카테고리 미니필 (좌하)`
- **광 (光) 표식**: 좌상단 8px 원에 `光` 명조
- **모티프**: 모두 SVG primitives (line/path/circle/ellipse/rect)로 직접 그림. 어떤 트레이스도 없음.
- **추상화 모드**:
  - `minimal`: 모티프 제거, 색면 + 한자 1자
  - `mid` (기본): 식물/동물 핵심 실루엣 + 색면 (민화 톤)
  - `painterly`: (미구현 — 다음 턴) 붓터치 스타일

### 그려진 카드
- **풀 모티프 (요청대로)**: 1·3·8·11·12월 광·열끗(해당 시)·띠·피 모두 + 2·4·5·6·7·9·10월 광·열끗·띠·피 시스템 확장 샘플
- **단(短) 시스템**: 홍단(明恒紅 한자) / 청단 / 초단 — Ribbon 컴포넌트로 통일

---

## F. 알려진 한계 / 다음 턴 작업

1. **카드 모션 풀 사이클**: 손패→바닥 throw 애니메이션은 `capture-fly` 클래스로 시작했으나 키프레임 좌표가 정적임. 실제로는 react-flip-toolkit 또는 Framer Motion `layoutId`로 from/to 좌표를 동적 계산해야 함.
2. **다중매칭 모달의 후보 정렬**: 현재는 floor 순서 그대로. UX 개선: 광 > 띠 > 열끗 > 피 추천 순서.
3. **점수 카운터업**: settlement 진입 시만 동작. 게임 보드의 본점수는 `pulse` 클래스 깜빡임만 있고, 숫자 자체는 즉시 변경. 굴러가는 카운터로 교체 필요.
4. **`prefers-reduced-motion`** 감지: Tweaks의 `animationIntensity`만 노출. CSS 미디어 쿼리로 자동 다운그레이드 추가 권장.
5. **모바일 390폭**: 본 턴은 데스크탑 1440만. 모바일은 별도 턴.
6. **랜딩/로비/대기실**: 미구현.

---

## G. 도메인 enum / 데이터 셰이프

```ts
enum CardCategory { GWANG = 'GWANG', YEOL = 'YEOL', TTI = 'TTI', PI = 'PI' }

const CATEGORY_LABEL_KO: Record<CardCategory, string> = {
  GWANG: '광', YEOL: '열끗', TTI: '띠', PI: '피'
};

interface CardData {
  id: string;                           // '1-G' | '3-T' | '11-P2' ...
  month: 1..12;
  cat: CardCategory;
  ribbon?: 'RED_POEM' | 'BLUE' | 'GREEN';
}

interface PlayerCaptured {
  GWANG: string[]; YEOL: string[]; TTI: string[]; PI: string[];
}

// Zustand store shape (제안)
interface GameStore {
  hand: CardData[];
  floor: CardData[];
  pile: CardData[];
  captured: Record<PlayerKey, PlayerCaptured>;
  turn: PlayerKey;
  pickHand(id: string): void;
  pickFloor(id: string): void;
  resolveCapture(handId: string, floorId: string): void;
  flipFromPile(): void;
}
```

---

**Tweaks 패널** (우하단)에서 라이브 토글:
- 테마 (light/dark)
- 포인트 컬러 (muted/vivid/single)
- 카드 추상화 (minimal/mid/painterly)
- 카드 라벨 (hanja/hangul/none)
- 보드 레이아웃 (grid/hybrid/free)
- 애니메이션 (minimal/mid/full)
- 화면 (board/settlement)
