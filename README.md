# 민화투 (Minhwatu) — Realtime Web

> 한국 전통 카드놀이 **민화투(民花鬪)** 를 웹에서 친구들과 실시간으로 즐길 수 있는 서비스.
> 이 저장소는 **Claude Code 단독 바이브 코딩(Vibe Coding)** 으로 진행되는 실험적 프로젝트입니다.

[![Vibe Coding](https://img.shields.io/badge/built%20with-Claude%20Code-blueviolet)](https://claude.com/claude-code)
[![Backend](https://img.shields.io/badge/backend-Spring%20Boot%203-green)]()
[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-blue)]()
[![Realtime](https://img.shields.io/badge/realtime-WebSocket%20%2F%20STOMP-orange)]()

---

## ✨ 한 줄 요약

> 화투 48장으로 즐기는 가장 단순한 형태의 한국 카드놀이, **민화투를 브라우저에서**.
> 룰은 [GAME_RULES.md](docs/GAME_RULES.md) 참고.

---

## 🌀 이 프로젝트는 "바이브 코딩(Vibe Coding)" 방식으로 만들어집니다

### 바이브 코딩이란?

[Andrej Karpathy가 명명한 표현](https://x.com/karpathy/status/1886192184808149383)으로, 사람이 **AI에게 "이런 느낌으로 가자(vibe)" 정도의 의도만 던지고**, 실제 코드 작성/수정/실행/디버깅의 대부분을 AI가 맡는 개발 방식을 말합니다.
사람은 코드를 한 줄씩 타이핑하지 않습니다 — 대신 **방향을 정하고, 결과를 검수하고, 다음 vibe를 던지는** 역할만 합니다.

### 이 프로젝트의 운영 원칙

이 저장소는 **Claude Code(Opus 4.7) 단 하나의 도구만 사용해서** 다음 원칙으로 만들어집니다.

1. **사람은 코드를 직접 작성하지 않는다**
   - PR/커밋의 거의 모든 라인은 Claude가 작성합니다.
   - 사람은 "방향성, 검수, 거절, Yes/No 의사결정"만 합니다.
2. **모든 변경은 PR을 통해 들어온다**
   - main 직접 푸시 금지.
   - PR 본문에 "이번 변경에서 사람이 한 일 / Claude가 한 일"을 명시.
3. **결정/규칙은 코드보다 문서에 먼저 적는다**
   - 새로운 룰/스택/구조 결정은 `docs/` 하위 마크다운에 먼저 합의.
   - Claude는 그 문서를 컨텍스트로 코드를 생성.
4. **테스트는 게임 엔진의 정확성을 보증하는 1순위 산출물**
   - 룰 위반 = 버그가 아니라 사기. 단위 테스트로 룰 100% 커버 목표.
5. **재현 가능한 게임**
   - 모든 게임은 시드(seed) + Move 시퀀스로 재현 가능해야 한다.
6. **사람의 권한**
   - 디자인 결정 / 룰 해석 분쟁 / 배포 트리거는 사람이 한다.
7. **AI의 권한**
   - 코드 작성, 리팩터링, 테스트 작성, 문서 갱신, 의존성 추가 제안.

### 왜 이렇게 하나요?

- Claude가 어디까지 갈 수 있는지 보고 싶어서.
- 룰이 명확한 보드게임은 LLM 기반 자동 코딩과 궁합이 좋습니다 — 정답이 검증 가능하니까요.
- 팀이 아니라 1인이 운영하는 사이드 프로젝트의 현실적인 속도를 늘려보는 실험.

### 협업 가이드 (Claude에게)

Claude가 이 저장소에서 작업할 때 따르는 규칙은 [`CLAUDE.md`](CLAUDE.md)에 정리될 예정입니다(미작성). 주요 항목 예고:

- 한국어 변수명 금지(도메인 한국어는 enum 영문 키 + 표시용 한글 라벨로 분리).
- 게임 엔진은 Spring 의존성 없는 순수 Java/Kotlin 모듈로.
- 모든 무작위성은 `Random(seed)` 주입 — 절대 `Math.random()` / 시스템 시계 직접 사용 금지.
- 클라이언트 코드는 **서버를 신뢰하고 자기 상태를 추론하지 않는다** — 서버가 내려준 `legalMoves`만 활성화.

---

## 🎮 게임 개요

| 항목 | 값 |
|------|----|
| 카드 수 | 48장 (화투 표준, 보너스패 미포함) |
| 인원 | 1차: 3·4명 / 2차: 2·5명 |
| 1판 시간 | 5~10분 |
| 점수 체계 | 광 20 / 열끗 10 / 띠 5 / 피 0, 단(短) 3종 보너스 |
| 승리 조건 | 인원별 본점수를 가장 큰 폭으로 초과한 사람 |

전체 룰과 구현 책임 정의는 [docs/GAME_RULES.md](docs/GAME_RULES.md) 참조.

---

## 🛠 기술 스택 — 그리고 왜 그걸 골랐는지

### Backend — **Spring Boot 3 / Java 21 / Gradle**

- 사용자 요청.
- WebSocket(STOMP), JPA, Security, Validation 등 실시간 게임에 필요한 빌딩블록이 표준 starter로 다 있음.
- Java 21 LTS의 record/sealed/pattern matching이 게임 도메인 모델링과 잘 맞음.

### Realtime — **WebSocket + STOMP**

- 게임 상태 동기화는 짧고 빈번한 양방향 메시지 → WebSocket이 정답.
- STOMP는 토픽/큐 시맨틱이 명확해 "방 전체 브로드캐스트 vs 개인 손패 전송"을 깔끔히 분리.

### Frontend — **React 18 + TypeScript + Vite**

- Claude가 가장 잘 다루는 조합 (= 바이브 코딩 효율 최대).
- Vite의 빠른 HMR이 카드 애니메이션 튜닝 사이클을 줄여줌.
- 상태관리: **Zustand** (Redux 대비 보일러플레이트 최소).
- 스타일: **TailwindCSS** (디자인 시스템 부재 상태에서 가장 빠른 일관성 확보).
- 애니메이션: **Framer Motion** (카드 이동/뒤집기에 최적).
- WS 클라이언트: `@stomp/stompjs` + `sockjs-client`.

### Storage

- **PostgreSQL** — 유저, 게임 결과, 리플레이(시드 + Move 로그) 영속화.
- **Redis** — 활성 룸 상태, 매칭 큐, 세션. 게임 중에는 in-memory + Redis 백업.

### Infra / DX

- **Docker Compose** — 로컬에서 `docker compose up` 한 방으로 backend + db + redis + frontend.
- **GitHub Actions** — PR마다 빌드/테스트/Lint.
- **OpenAPI(SpringDoc)** — REST 스펙 자동 문서화.
- **Testcontainers** — DB/Redis가 필요한 통합 테스트.

> 위 스택은 **MVP를 위한 기본값**이며, Claude가 작업하면서 더 나은 안을 제안하면 PR + 문서로 합의 후 변경합니다.

---

## 📂 (예정) 디렉터리 구조

```
minhwatu/
├── docs/                       # 룰, ADR, 아키텍처 문서
│   └── GAME_RULES.md
├── backend/                    # Spring Boot 애플리케이션
│   ├── core/                   # 순수 게임 엔진(프레임워크 의존성 X)
│   ├── api/                    # REST + WebSocket 어댑터
│   └── persistence/            # JPA / Redis 어댑터
├── frontend/                   # React + Vite 애플리케이션
│   ├── src/
│   └── public/
├── infra/
│   └── docker-compose.yml
├── .github/workflows/
└── README.md
```

> 현재는 문서만 존재합니다. 코드 스캐폴딩은 후속 PR에서.

---

## 🚀 시작하기 (예정 — 코드 도입 후)

```bash
# 1) 의존 서비스 띄우기
docker compose -f infra/docker-compose.yml up -d

# 2) 백엔드
cd backend && ./gradlew bootRun

# 3) 프론트엔드
cd frontend && pnpm install && pnpm dev

# 브라우저에서 http://localhost:5173 접속
```

---

## 🗺 로드맵

- [x] 게임 룰 문서화 (`docs/GAME_RULES.md`)
- [x] 프로젝트 README + 바이브 코딩 운영 원칙
- [ ] `CLAUDE.md` (Claude 작업 가이드라인)
- [ ] ADR-0001: 도메인 모델 / 패키지 경계
- [ ] 백엔드 게임 엔진 코어 (셔플, 합법수, 점수 계산) — 단위 테스트 우선
- [ ] WebSocket 실시간 룸 + 인-메모리 게임 매니저
- [ ] 프론트엔드 게임 보드 MVP (3명전)
- [ ] 게스트 매칭 + 방 코드 입장
- [ ] 게임 리플레이
- [ ] 시즌 랭킹
- [ ] AI 플레이어

---

## 🤝 기여

이 프로젝트는 **사람이 직접 코드를 작성하지 않는 실험**입니다. 외부 기여를 받게 된다면 다음 중 하나의 형태가 됩니다.

1. **이슈/제안 등록** (룰 해석, UX 아이디어, 버그 리포트) — 환영.
2. **Claude에게 던질 프롬프트 PR** — 어떤 문제를 어떤 식으로 풀게 할지 설계해서 보내주는 방식.
3. **사람이 직접 작성한 코드 PR** — 기본적으로 받지 않습니다(실험의 변수 통제 목적). 큰 도움이 필요할 때 별도로 공지.

자세한 협업 정책은 추후 `CONTRIBUTING.md` 로 분리.

---

## 📜 라이선스

미정 — MVP 이후 결정. 그 전까지는 코드/문서 모두 저자에게 권리가 귀속됩니다.

---

## 🙏 크레딧

- 게임 룰: [나무위키 — 민화투](https://namu.wiki/w/%EB%AF%BC%ED%99%94%ED%88%AC), [민화투 치는법 정리](https://playcard.warmissue.com/2024/09/minhwatu-rules.html), [위키백과 — 화투](https://ko.wikipedia.org/wiki/%ED%99%94%ED%88%AC)
- 카드 일러스트: 추후 라이선스 정리 후 명시.
- 빌드: 사람의 vibe + [Claude Code](https://claude.com/claude-code).
