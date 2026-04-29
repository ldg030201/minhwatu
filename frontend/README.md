# frontend/

본 프로젝트의 프런트엔드 모듈. **Vite + React 18 + TypeScript + Tailwind v4 + Zustand + Framer Motion + React Router v7** 스택으로 동작합니다.

> 디자인 시안의 1차 마이그레이션이 들어와 `/game`, `/settlement` 라우트가 실제로 동작합니다. 시안 코드는 `src/legacy/` 아래에 원형 보존 중이며, 점진적으로 `src/components`/`src/store` 등으로 분리합니다.

---

## 빠른 시작

```bash
cd frontend
corepack enable pnpm    # 최초 1회 (Node 20+ 내장)
pnpm install            # 의존성 설치
pnpm dev                # 개발 서버 (http://localhost:5173)
```

## 명령어

| 명령 | 설명 |
|------|------|
| `pnpm dev` | Vite 개발 서버 (포트 5173 고정) |
| `pnpm build` | 타입 체크 + 프로덕션 빌드 (`dist/`) |
| `pnpm preview` | 빌드 결과 정적 서빙 |
| `pnpm test` | Vitest 1회 실행 |
| `pnpm test:watch` | Vitest watch 모드 |
| `pnpm lint` | Biome 린트 |
| `pnpm format` | Biome 포맷 적용(쓰기) |
| `pnpm check` | Biome 린트 + 포맷 + 임포트 정렬 한 번에 |

## 디렉터리 구조

```
frontend/
├── index.html            Vite 진입점
├── src/
│   ├── main.tsx          엔트리 — RouterProvider 마운트
│   ├── App.tsx           루트 레이아웃 (Outlet)
│   ├── routes/
│   │   ├── Lobby.tsx     '/'         로비 (stub)
│   │   ├── Game.tsx      '/game'     게임 보드 (stub)
│   │   └── Settlement.tsx '/settlement' 정산 (stub)
│   ├── styles/index.css  Tailwind v4 + 디자인 토큰 + 글로벌 베이스
│   ├── setup-tests.ts    Vitest 테스트 셋업 (jest-dom 매처)
│   ├── App.test.tsx      샘플 단위 테스트
│   └── vite-env.d.ts
├── preview/              디자인 시안 원본(정적 HTML — preview/README.md 참조)
├── src/legacy/           시안의 JSX를 .tsx로 옮겨놓은 1차 마이그 코드(점진 분리 대상)
├── package.json
├── pnpm-lock.yaml
├── biome.json            Biome 린트/포맷 설정
├── tsconfig.json         프로젝트 references
├── tsconfig.app.json     앱 코드 (strict + 추가 안전 규칙)
├── tsconfig.node.json    Vite 설정 등 노드 코드
└── vite.config.ts        Vite + Tailwind 플러그인 + Vitest 설정
```

## src/legacy/ 운영 정책

`src/legacy/` 안의 코드는 **시안에서 그대로 옮겨온 1차 마이그**입니다.

- 모든 `.tsx` 파일 상단에 `// @ts-nocheck` — strict 검증을 임시 보류(점진 타입화 예정)
- `biome.json`의 `files.ignore`에 `src/legacy/**` 등록 — 린트/포맷 대상에서 제외
- 외부에 노출되는 export는 `HwatuCard`, `HwatuCardBack`, `GameBoard`, `Settlement`, `useTweaks`, `TweaksPanel`, `TweakSection`, `TweakRadio`, …
- 시안 css 4종(`tokens.css`/`card.css`/`board.css`/`settlement.css`)은 `src/legacy/styles/`로 옮기고 `src/main.tsx`에서 import

### 점진 분리 계획 (다음 PR들)
1. `src/legacy/hwatu-card.tsx` → `src/components/HwatuCard/` (월별 motif 분리, props 타입 도입)
2. `src/legacy/tweaks-panel.tsx` → `src/components/TweaksPanel/` + `src/store/tweaks.ts`(Zustand로 useTweaks 대체)
3. `src/legacy/game-board.tsx` → `src/routes/Game.tsx` 본격 + 하위 컴포넌트(`Hand`, `Field`, `Pile`, `Scoreboard`, `MatchPickModal`, `HintBar`, `PlayerStrip`)
4. `src/legacy/settlement.tsx` → `src/routes/Settlement.tsx` 본격 + `DanBurst`, `CategoryShelf`
5. `src/legacy/cards-data.ts` → `src/domain/card.ts`(타입) + `src/lib/cards/catalog.ts`
6. `src/legacy/styles/*.css` → 컴포넌트별 Tailwind 클래스로 점진 변환 후 삭제

## 스택 결정 요약

| 영역 | 선택 | 이유 |
|------|------|------|
| 번들러 | **Vite 6** | SPA + 빠른 HMR, 게임 클라이언트에 최적 |
| UI | **React 18** | 디자인 시안 기반(마이그 비용 0), 생태계 |
| 언어 | **TypeScript 5 (strict)** | 도메인 모델 안전성. `exactOptionalPropertyTypes`까지 켬 |
| 스타일 | **Tailwind v4** | CSS-first config(`@theme`)로 시안의 토큰을 그대로 흡수 |
| 라우팅 | **React Router v7** | 안정 + 단순한 라우트(Lobby/Game/Settlement) |
| 상태 관리 | **Zustand 5** | 보일러 없이 게임 상태 분할 |
| 애니메이션 | **Framer Motion 11** | 카드 `layoutId` 기반 from/to 보간 |
| 아이콘 | **lucide-react** | 시안 핸드오프에서 명시 |
| 린트/포맷 | **Biome 1** | ESLint+Prettier 합본 대안. 단일 도구, 빠름 |
| 단위 테스트 | **Vitest + RTL** | Vite 생태계 정합 |
| 패키지 매니저 | **pnpm 10** | corepack으로 Node 내장 |

자세한 트레이드오프는 (선택적으로) 추후 ADR-0002로 분리.

## 디자인 토큰 매핑

[preview/HANDOFF.md §C/§D](preview/HANDOFF.md)의 토큰을 [src/styles/index.css](src/styles/index.css)의 `@theme {}` 블록에 1:1 매핑했습니다. Tailwind 클래스가 자동으로 다음을 인식합니다.

- 색상: `bg-bg`, `text-ink`, `text-ink-2`, `bg-paulownia`, `text-maple-soft`, …
- 폰트: `font-sans`, `font-serif`, `font-mono`
- 둥근 모서리: `rounded-card`, `rounded-pill`, `rounded-xl`, …
- 그림자: `shadow-card`, `shadow-lift`, `shadow-legal`, …
- 카드 크기: `w-card-w`, `h-card-h`, `gap-card-gap-2`, …
- 애니메이션: `animate-flip-reveal`, `animate-modal-rise`, …

## 시안만 띄워보고 싶다면

```bash
python3 -m http.server 5500 --directory frontend/preview
# http://localhost:5500/
```

자세한 안내는 [preview/README.md](preview/README.md).
