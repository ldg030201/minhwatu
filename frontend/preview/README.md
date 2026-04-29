# 디자인 시안 (Design Preview)

> 본 디렉터리는 외부 디자인 도구(Claude Design)에서 받아온 **민화투 게임 보드 + 정산 화면 시안**을 원형 그대로 보관하는 곳입니다. 본 프로젝트의 정식 빌드 산출물이 아니며, 시안 검증과 비주얼 iteration 용도로만 사용합니다.

---

## 0. 한 줄 요약

- **무엇**: 게임 보드 + 정산 화면의 인터랙티브 프로토타입(React 18 + JSX + CSS).
- **어떻게**: 단일 `index.html`에서 babel-standalone으로 JSX를 그대로 실행. 빌드 도구 없음.
- **다음 단계**: 본 프로젝트의 `frontend/src/`(Vite + React + TS + Tailwind)로 점진 마이그레이션 — 별도 PR.

---

## 1. 띄우는 방법

브라우저는 보안상 `file://`로 열면 일부 모듈 스크립트가 동작하지 않을 수 있어, **로컬 정적 서버**로 띄우는 걸 권장합니다.

### 옵션 A — 파이썬

```bash
cd frontend/preview
python3 -m http.server 5500
# 브라우저: http://localhost:5500/
```

### 옵션 B — Node `serve`

```bash
npx serve frontend/preview -l 5500
# 브라우저: http://localhost:5500/
```

### 옵션 C — IntelliJ

`frontend/preview/index.html`을 우클릭 → **Open in Browser** → 내장 웹 서버.

---

## 2. 파일 구성

```
frontend/preview/
├── index.html              진입점. CDN으로 React/ReactDOM/Babel-standalone 로드 후 JSX 직접 실행
├── tokens.css              디자인 토큰(색·간격·반경·그림자·이징) — CSS 변수로 정의
├── card.css                HwatuCard 스타일
├── board.css               게임 보드 레이아웃 + 애니메이션
├── settlement.css          정산 화면 스타일
├── app.jsx                 App — 테마/스크린/Tweaks 오케스트레이션
├── game-board.jsx          GameBoard — 상단 바, 플레이어 영역, 바닥, 손패, 모달
├── settlement.jsx          Settlement — 승자 발표, 단(短) 마이크로 이벤트, 카테고리 합산
├── hwatu-card.jsx          HwatuCard — 12 × 4(광/열끗/띠/피) SVG 모티프 모음
├── cards-data.jsx          카드 데이터(예시 손패/바닥/획득 더미)
├── tweaks-panel.jsx        Tweaks(우하단) — 라이브 토글 패널
├── HANDOFF.md              디자이너 핸드오프 문서(컴포넌트 트리·props·토큰표·다음 작업)
└── screenshots/            반복 결과 스냅샷 5장 (01~05)
```

---

## 3. Tweaks 패널 (우하단)

라이브 토글 가능 항목:

| 항목 | 값 |
|------|----|
| 테마 | light / dark |
| 포인트 컬러 | muted / vivid / single |
| 카드 추상화 | minimal / mid / painterly |
| 카드 라벨 | hanja / hangul / none |
| 보드 레이아웃 | grid / hybrid / free |
| 애니메이션 강도 | minimal / mid / full |
| 화면 | board / settlement |

> 주의: `painterly` 추상화는 핸드오프 문서상 **다음 턴 작업**으로 표시되어 미구현 가능.

---

## 4. 본 프로젝트와의 관계

본 프로젝트의 정식 프런트엔드 스택은 **Vite + React 18 + TypeScript + Tailwind + Zustand + Framer Motion** 입니다([CLAUDE.md](../../CLAUDE.md), [docs/adr/0001-domain-and-module-boundaries.md](../../docs/adr/0001-domain-and-module-boundaries.md)).
본 디렉터리의 시안은 다음과 같이 흡수됩니다.

| 시안 자산 | 마이그레이션 목적지 (예정) |
|-----------|----------------------------|
| `tokens.css` (CSS 변수) | `frontend/tailwind.config.ts` extend.colors/spacing/radius/shadow/keyframes/animation |
| `hwatu-card.jsx` (12×4 SVG) | `frontend/src/components/HwatuCard/` (TSX 변환 + 타입 도입) |
| `game-board.jsx` | `frontend/src/routes/Game.tsx` + 하위 컴포넌트(`Hand`, `Field`, `Pile`, `Scoreboard`, `MatchPickModal`, `HintBar`, `PlayerStrip`) |
| `settlement.jsx` | `frontend/src/routes/Settlement.tsx` + `DanBurst`, `CategoryShelf` |
| `tweaks-panel.jsx` | `frontend/src/components/TweaksPanel/` (개발자 토글로 유지하거나 디자인 합의 후 제거) |
| `cards-data.jsx` (예시 데이터) | `frontend/src/lib/mock/` 또는 백엔드 연결 후 제거 |

마이그레이션 작업은 [HANDOFF.md](HANDOFF.md)의 컴포넌트 트리/props 시그니처/도메인 enum을 기준으로 진행합니다.

---

## 5. 알려진 한계 (디자이너 메모)

[HANDOFF.md §F](HANDOFF.md) 참조 — 요약:

1. 카드 모션의 from/to 좌표가 정적. 본 프로젝트에서는 `react-flip-toolkit` 또는 Framer Motion `layoutId`로 동적 계산 필요.
2. 다중매칭 모달의 후보 정렬을 `광 > 띠 > 열끗 > 피` 추천 순으로 개선 필요.
3. 점수 카운터업이 정산 진입 시만 동작. 게임 보드의 본점수도 카운터업 적용 필요.
4. `prefers-reduced-motion` 자동 감지 미구현.
5. 모바일 390 폭, 랜딩/로비/대기실 화면은 별도 턴.

---

## 6. 라이선스/외부 자산

- **폰트**: Pretendard(OFL), Noto Serif KR(OFL), JetBrains Mono(OFL) — 모두 임베드 가능 라이선스. CDN으로 로드.
- **카드 일러스트**: 본 시안의 모든 카드는 직접 그린 SVG 프리미티브(`line/path/circle/ellipse/rect`). 실제 화투 패 사진 트레이스 없음 — 라이선스 안전.
- **React/ReactDOM/Babel**: MIT, CDN 로드.

---

## 7. 수정 정책

- 본 디렉터리의 파일은 **원형 보존**이 원칙입니다. 시안과 본 프로젝트의 합의 변경이 발생하면 새 시안을 받아 갱신하는 형태로 운영합니다(이력은 git 히스토리로 추적).
- 작은 오류(오타, 깨진 링크 등)는 직접 고쳐도 OK. 단, 그 변경은 별도 커밋으로 분리하고 본 README에 기록할 것.
