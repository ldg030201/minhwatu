# ADR-0001 — 도메인 & 모듈 경계

- **상태**: 채택(Accepted)
- **일자**: 2026-04-29
- **결정 동인**: 룰 정확성 검증 가능성, 바이브 코딩 시 회귀 방지, 향후 AI 플레이어/리플레이 도입 확장성
- **대체 대상**: —

> 이 ADR은 [docs/GAME_RULES.md](../GAME_RULES.md)와 [CLAUDE.md](../../CLAUDE.md)에서 합의한 원칙을 모듈/패키지 경계로 구체화하는 첫 결정입니다.

---

## 1. 배경 (Context)

본 프로젝트는 실시간 민화투 웹 서비스를 만든다. 다음 두 가지가 핵심 위험이다.

1. **룰 정확성**: 화투 게임은 룰 분기가 많다(다중 매칭, 쓸이, 단 보너스, 인원별 본점수 등). 룰이 한 번 깨지면 사기 게임이 된다. 룰 검증을 외부 시스템(DB/네트워크/시간) 없이 빠르게, 100% 결정적으로 돌릴 수 있어야 한다.
2. **바이브 코딩 회귀**: 사람이 코드를 줄 단위로 읽지 않고 Claude가 큰 변경을 만들기 때문에, 모듈 경계가 흐릿하면 *"룰을 고쳤는데 알고 보니 컨트롤러도 같이 바뀌어 회귀했다"* 같은 사고가 일어난다. 경계는 코드가 아니라 빌드 시스템(Gradle)이 강제해야 한다.

또한 다음 기능이 백로그에 있다. 모듈 구조가 이를 막아서는 안 된다.

- **리플레이/감사**: seed + Move 시퀀스로 모든 게임 재구성
- **AI 플레이어**: 룰 엔진을 헤드리스로 호출
- **부정 셔플 방지**: commit-reveal (시작 시 hash, 종료 시 seed 공개)
- **다양한 어댑터**: 현재는 WebSocket+REST, 추후 모바일 푸시/카카오톡 봇 등 확장 가능성

## 2. 결정 (Decision)

### 2-1. Backend는 Gradle 멀티 모듈로 분리한다

```
backend/
├── core/          # 순수 게임 엔진 — Spring/HTTP/DB 의존성 0
├── api/           # REST + WebSocket(STOMP) 어댑터 + DTO
├── persistence/   # JPA(PostgreSQL) + Redis 어댑터
└── application/   # bootRun 진입점, 모든 모듈 wiring
```

의존 방향 (한 방향만 허용):

```
            ┌──────────────┐
            │ application  │
            └──────┬───────┘
                   │ depends on
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   ┌────────┐ ┌─────────┐ ┌───────────┐
   │  api   │ │persistnc│ │           │
   └───┬────┘ └────┬────┘ │           │
       │           │      │   core    │
       └───────────┴─────►│           │
                          └───────────┘
```

- `core`는 다른 모듈을 import하지 않는다. (`api`/`persistence`/`application` 어떤 것도)
- `api`, `persistence`는 `core`만 import. 서로 직접 import 금지.
- `application`만 모든 모듈을 import해서 Spring Bean으로 wiring.
- 위 규칙은 **각 모듈의 `build.gradle.kts` `dependencies` 블록으로 강제**한다. 위반 시 컴파일 실패 = CI 실패.

### 2-2. core 모듈 내부 패키지 구조

```
backend/core/src/main/java/com/minhwatu/core/
├── card/           Card, CardCategory, Wol(월), Dan(단)
├── game/           GameState, Phase, Move, MoveResult, Event
├── engine/         Engine — apply(state, move) -> (newState, events)
├── deal/           Dealer — seed 기반 셔플/분배
├── score/          Scorer — 단/약/본점수 계산
├── rng/            RandomSource, SeededRandom
└── error/          DomainException 계층
```

- `core`는 **Java standard library + JSR-310(java.time) 만 허용**. 외부 라이브러리 0.
  - 예외 후보: 향후 `Lombok`이 필요해도 컴파일 타임 only로 제한해 런타임 의존성을 만들지 않는다.
- `core` 내부에서 모든 객체는 **불변(immutable)**. 상태 전이는 `apply(state, move) -> (newState, events)` 순수 함수.
- 시간/무작위는 모두 주입: `Clock`, `RandomSource`. core는 `Instant.now()`/`new Random()` 호출 금지.

### 2-3. api 모듈

- REST 컨트롤러 + STOMP `@MessageMapping` 핸들러.
- DTO ↔ 도메인 모델 변환은 `api` 안에서. core는 DTO를 모른다.
- 예외 매핑: `DomainException` → HTTP 4xx / WS error frame 변환.
- WebSocket 메시지 종류는 sealed interface로 표현해 컴파일 타임 exhaustiveness 보장.

### 2-4. persistence 모듈

- JPA Entity는 core 도메인과 별도 클래스로 둔다(엔티티 ↔ 도메인 매퍼). core가 JPA annotation을 모르게.
- Redis는 활성 룸 상태와 매칭 큐만. 영속 데이터(유저, 게임 결과, 리플레이)는 PostgreSQL.
- 리플레이는 `(gameId, seed, moveSeq[])`만 저장 → core의 `replay(seed, moves)`로 임의 시점 상태 재생.

### 2-5. application 모듈

- `@SpringBootApplication` 진입점.
- `core`의 인터페이스(`RandomSource`, `Clock`, `GameRepository`)를 빈으로 wiring.
- 운영/로컬 프로파일 분기.

### 2-6. Frontend는 단일 Vite 프로젝트, 도메인 폴더로 경계

```
frontend/src/
├── domain/        타입 정의 (서버 DTO와 1:1 — 자동 생성 권장)
├── net/           WebSocket(STOMP) + REST 클라이언트
├── store/         Zustand 슬라이스 (room, hand, score, ui)
├── components/    HwatuCard, Hand, Field, Pile, Scoreboard, ChoicePairModal, …
├── routes/        Lobby, Room, Game, Replay
└── lib/           순수 헬퍼 (애니메이션 토큰, 점수 표시 포맷터 등)
```

- 컴포넌트는 **서버가 내려준 `legalMoves`만 활성화**. 자체 룰 검증으로 UI를 활성/비활성 결정 금지.
- `domain/` 타입은 백엔드 OpenAPI/JSON 스키마에서 자동 생성하는 것을 검토(추후 ADR).

## 3. 근거 (Rationale)

### 왜 backend 멀티 모듈인가

- 단일 모듈로 시작해 패키지 컨벤션만으로 경계를 지킬 수도 있다. 그러나 바이브 코딩 환경에서는 **컴파일러가 막아주지 않는 규칙은 결국 깨진다**. 멀티 모듈은 의존 방향을 빌드 그래프로 못 박는 가장 단순한 방법.
- 모듈 분리는 추후 AI 학습/시뮬레이션을 위해 `core`를 단독 jar로 떼낼 때도 필요.

### 왜 core에 의존성을 0으로 두는가

- 게임 룰 단위 테스트가 Spring 컨텍스트 없이 ms 단위로 돌아야 한다. 룰 회귀 테스트는 수백~수천 케이스가 될 수 있고, 한 번 돌리는 데 30초 이상 걸리면 사람들이 안 돌린다.
- DB/네트워크 의존이 있으면 같은 입력에 다른 결과가 나올 수 있고, 그것은 결정성을 깬다.

### 왜 도메인/엔티티를 분리하는가

- JPA 엔티티는 lazy loading, dirty checking, equals/hashCode 등 영속화 관심사를 가진다. 이걸 core가 알면 게임 로직이 영속화 트랜잭션에 묶이게 되고, 테스트 단순성이 깨진다.
- 매퍼 한 단계의 비용 < 결합으로 인한 회귀 비용.

### 왜 frontend는 단일 모듈인가

- 게임 UI 자체가 본질적으로 한 화면(게임 보드)이 압도적 비중. 모듈 분리의 실익이 적다.
- 추후 관전자/리플레이 등이 별도 라우트로 추가되면 그때 패키지/번들 분리 검토.

## 4. 영향 (Consequences)

**긍정**

- 게임 룰 변경 PR은 `core` 모듈 안에서만 끝난다. 회귀 영향 범위가 명확.
- AI 플레이어 / 시뮬레이션 / CLI 리플레이 도구를 만들 때 `core`만 의존하면 된다.
- 신규 어댑터(예: 모바일 push, 카톡 봇)는 `core`를 재사용하며 별도 모듈로 추가 가능.
- 컴파일러가 잘못된 import를 차단하므로 "섞이면 안 되는 두 코드"를 사람이 매번 안 봐도 된다.

**부정/비용**

- Gradle 멀티 모듈 셋업 + 모듈 간 boilerplate 약간.
- core ↔ api 사이에 매퍼 코드가 필요(Java records를 활용해 짧게 유지).
- IDE에서 모듈 사이 점프가 단일 모듈보다 한 단계 더 걸린다.

**중립**

- 의존성 방향이 강제되므로 "core에 잠깐만 SLF4J 쓰고 싶다" 같은 유혹이 막힌다. 이는 의도된 마찰이다.

## 5. 검토한 대안 (Alternatives considered)

### A. 단일 backend 모듈 + 패키지 컨벤션만 (`com.minhwatu.core.*`, `com.minhwatu.api.*`)

- 셋업이 간단. 한 모듈 안에서 자유롭게 import 가능.
- ❌ 의존 방향이 컴파일러에 강제되지 않아 vibe coding 환경에서 깨질 위험. 채택하지 않음.

### B. Hexagonal/Ports&Adapters 풀 적용 (도메인이 인터페이스만 노출, 어댑터가 구현 주입)

- 정석. 추후 어댑터 추가 시 가장 깔끔.
- 현 단계에서는 오버엔지니어링. 본 ADR의 4-모듈 분리는 헥사고날의 가벼운 변형(core가 outbound 인터페이스를 정의하고 persistence가 구현하는 정도까지만).
- 향후 도입할 경우 ADR-NNNN으로 이행을 명시한다.

### C. Backend 단일 모듈 + Frontend도 단일 — 가장 단순

- 시작은 빠르지만 룰 단위 테스트가 Spring 컨텍스트에 묶일 위험이 큼.
- ❌ 채택하지 않음.

### D. Kotlin으로 backend 작성

- record/sealed/data class 활용에 더 자연스러움.
- 본 프로젝트는 Java 21로 시작 (사용자 합의). Kotlin 도입은 별도 ADR로 검토 가능.

## 6. 남은 질문 / 후속 (Open questions / Follow-ups)

- ADR-0002 (예정): WebSocket 메시지 스키마 + 재접속 프로토콜
- ADR-0003 (예정): 시드 commit-reveal 정확한 형식 (HMAC vs SHA256, 공개 시점)
- ADR-0004 (예정): 프론트엔드 도메인 타입 자동 생성 방법 (OpenAPI vs 수동 동기화)
- 빌드 도구: Gradle Kotlin DSL 채택 (vs Groovy DSL) — 기본 채택, 별도 ADR 불필요로 분류

## 7. 참고 (References)

- [docs/GAME_RULES.md](../GAME_RULES.md) — 룰 정의와 구현 책임 분배
- [CLAUDE.md](../../CLAUDE.md) — 프로젝트 규칙(시드 주입, 서버 권위, 한국어 식별자 금지 등)
- [README.md](../../README.md) — 바이브 코딩 운영 원칙과 기술 스택
