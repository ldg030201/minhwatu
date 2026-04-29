# frontend/

본 프로젝트의 프런트엔드 모듈. **Vite + React 18 + TypeScript + Tailwind v4 + Zustand + Framer Motion + React Router v7** 스택으로 동작합니다.

> 이번 PR로 빈 스캐폴딩이 들어왔습니다. 디자인 시안([preview/](preview/))의 컴포넌트 마이그레이션은 **다음 PR** 입니다.

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
├── preview/              디자인 시안(원형 보존 — preview/README.md 참조)
├── package.json
├── pnpm-lock.yaml
├── biome.json            Biome 린트/포맷 설정
├── tsconfig.json         프로젝트 references
├── tsconfig.app.json     앱 코드 (strict + 추가 안전 규칙)
├── tsconfig.node.json    Vite 설정 등 노드 코드
└── vite.config.ts        Vite + Tailwind 플러그인 + Vitest 설정
```

> 다음 PR에서 추가 예정: `src/components/`, `src/store/`, `src/net/`, `src/lib/`, `src/domain/`. 자세한 매핑은 [preview/README.md §4](preview/README.md) 참조.

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
