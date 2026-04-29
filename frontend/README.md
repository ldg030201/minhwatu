# frontend/

본 프로젝트의 프런트엔드 모듈이 들어갈 디렉터리입니다. 정식 스택은 [Vite + React 18 + TypeScript + Tailwind + Zustand + Framer Motion](../README.md)이며, 정식 스캐폴딩은 다음 PR에서 추가됩니다.

---

## 현재 상태

| 항목 | 상태 |
|------|------|
| Vite 프로젝트 (`package.json`, `vite.config.ts`, `src/`, `index.html`) | 🟡 미생성 — 다음 PR |
| Tailwind 설정 (`tailwind.config.ts`, `postcss.config.js`) | 🟡 미생성 — 다음 PR |
| TypeScript 설정 (`tsconfig.json`) | 🟡 미생성 — 다음 PR |
| **디자인 시안** ([preview/](preview/)) | ✅ 본 PR로 통합 — 정적 HTML로 띄워 검증/iteration 가능 |

## 디렉터리 구조 (예정)

```
frontend/
├── preview/          (현재) 디자인 도구에서 받은 시안 — 정적 HTML+JSX
├── src/              (예정) Vite + React + TS 본격 구현
│   ├── domain/       서버 DTO 타입
│   ├── net/          WebSocket(STOMP) + REST 클라이언트
│   ├── store/        Zustand 슬라이스
│   ├── components/   HwatuCard, Hand, Field, Pile, Scoreboard, ChoicePairModal, …
│   ├── routes/       Lobby, Room, Game, Settlement, Replay
│   └── lib/          순수 헬퍼
├── public/           (예정) 정적 자산
├── index.html        (예정) Vite 진입점
├── package.json      (예정)
├── tailwind.config.ts (예정)
├── tsconfig.json     (예정)
└── vite.config.ts    (예정)
```

## 다음 단계 (별도 PR)

1. **Vite 스캐폴딩**: `pnpm create vite frontend --template react-ts` 동등한 구성을 본 디렉터리에 직접 셋업.
2. **Tailwind 도입**: [preview/HANDOFF.md §C](preview/HANDOFF.md)의 토큰을 `tailwind.config.ts` extend로 매핑.
3. **시안 마이그레이션**: `preview/`의 JSX 컴포넌트를 `src/`로 옮기면서 TSX 변환 + 타입 도입 + Tailwind 클래스화.
4. **개발 서버 가이드**: 본 README와 루트 [README.md](../README.md)의 "시작하기" 갱신.

마이그레이션 매핑은 [preview/README.md §4](preview/README.md)에 정리되어 있습니다.

## 시안만 띄워보고 싶다면

`preview/` 디렉터리의 [README](preview/README.md) 참고. 한 줄 요약:

```bash
python3 -m http.server 5500 --directory frontend/preview
# 브라우저: http://localhost:5500/
```
