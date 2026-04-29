# CLAUDE.md — 이 저장소에서 Claude가 따라야 할 규칙

이 문서는 [Claude Code](https://claude.com/claude-code)가 본 저장소에서 작업할 때 자동으로 컨텍스트로 읽어들이는 가이드입니다.
사람이 매번 같은 지시를 반복하지 않도록, **이 프로젝트에서만 통용되는 합의사항**을 한 곳에 모읍니다.

> 이 프로젝트는 [README.md](README.md)에 명시된 대로 **Claude 단독 바이브 코딩** 으로 운영됩니다.
> 룰 정의는 [docs/GAME_RULES.md](docs/GAME_RULES.md) 참조.

---

## 1. 핵심 원칙 (어길 수 없음)

1. **main에 직접 push 금지.** 모든 변경은 PR을 통해 들어온다. 머지는 사람이 누른다.
2. **무작위성은 시드(seed) 주입으로만 만든다.** `Math.random()`, `new Random()` (인자 없음), `System.currentTimeMillis()` 기반 시드 등 비결정적 소스 직접 사용 금지. 셔플/AI/타이브레이크 등 모든 랜덤은 외부에서 주입 가능한 `RandomSource`를 통해서만.
3. **게임 상태는 서버가 권위(authoritative)** 다. 클라이언트는 의도(intent) 메시지만 보내고, 자기 상태를 추론·예측해 UI를 미리 바꾸지 않는다. 서버가 내려준 `legalMoves`만 활성화한다.
4. **게임 엔진 모듈은 프레임워크 의존성 0** 이다. Spring/JPA/HTTP 어떤 것도 import하지 않는다. 입력은 도메인 객체, 출력은 도메인 객체 + 이벤트 시퀀스. 어댑터(`api`, `persistence`)에서만 외부 세계와 연결.
5. **모든 변경은 테스트와 함께 들어온다.** 게임 룰 변경 = 테스트 갱신 동반 필수. 룰 회귀(regression)를 막는 테스트가 없다면 그 PR은 미완성이다.
6. **사람이 읽는 모든 텍스트는 한국어** 로 작성한다.
   - 적용 대상: 커밋 메시지(제목·본문 모두), PR 제목·본문, 문서(README/ADR/GAME_RULES 등 헤더 포함), 코드 주석, UI 카피, 에러 메시지.
   - 적용 안 함: **코드 식별자**(클래스/함수/변수/패키지/enum 키)는 영문 유지(§4-1 명명 규칙). 기술 약어·고유명(API, WebSocket, Spring Boot 등)도 그대로.
   - 커밋 컨벤션 접두어(`feat:`/`fix:`/`docs:`/`chore:` 등)는 관습대로 영문 유지하되 그 뒤 요약·본문은 한국어.
   - 도메인 단어를 한글 그대로 쓸 때는 코드 안에서 enum 영문 키 + 한글 표시 라벨로 분리(예: `GWANG("광")`).

---

## 2. 협업 모델

| 역할 | 사람 | Claude |
|------|------|--------|
| 방향성/요구사항 | ✔ | |
| 룰 해석 분쟁 결정 | ✔ | |
| 머지 / 배포 | ✔ | |
| 코드 작성 | | ✔ |
| 리팩터링 | | ✔ |
| 테스트 작성 | | ✔ |
| 문서 갱신 | | ✔ |
| 의존성 추가 제안 | | ✔ (PR 본문에 사유 명시) |
| 디자인/UX 큰 결정 | ✔ (스케치) | ✔ (구현) |

**원칙**: Claude는 사람의 의사결정을 대신하지 않는다. 큰 방향 변경(스택 교체, 룰 변경, 새 외부 서비스 도입 등)은 PR이 아니라 먼저 `docs/` 하위 문서로 제안한다.

---

## 3. 작업 흐름 (Workflow)

1. 작업 시작 시 항상 **현재 브랜치 확인** → 새 작업이면 `main`에서 새 브랜치 분기.
2. 브랜치 네이밍:
   - `feat/<area>-<short-desc>`  새 기능
   - `fix/<area>-<short-desc>`   버그 수정
   - `refactor/<area>-<short-desc>`
   - `docs/<short-desc>`         문서만
   - `chore/<short-desc>`        빌드/설정/CI 등
3. 작은 PR을 선호한다. 한 PR = 하나의 의도(intent). 1000줄을 넘기는 PR은 거의 항상 분할 가능.
4. PR 본문 형식 (필수):
   - **Summary**: 1~3 bullet
   - **Why**: 이 변경이 필요한 이유
   - **Out of scope**: 이 PR에서 의도적으로 안 한 것
   - **사람이 한 일 / Claude가 한 일** (이 프로젝트의 운영 원칙)
5. 커밋 메시지: 영문/한글 혼용 OK. 형식은 `<type>: <short imperative summary>` (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:` 중 하나).
6. **Co-author 트레일러 유지**: Claude가 만든 커밋엔 항상 다음 줄을 포함.
   ```
   Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
   ```

---

## 4. 코드 규칙

### 4-1. 명명 (Naming)

- **한국어 변수/함수/클래스명 금지.** 도메인 한국어는 enum 영문 키 + 표시용 한글 라벨로 분리한다.
  ```java
  // OK
  enum CardCategory {
      GWANG(20, "광"),
      YEOL(10, "열끗"),
      TTI(5, "띠"),
      PI(0, "피");
  }

  // 금지
  enum 패종류 { 광, 열끗, ... }
  ```
- 영문 표기는 표준 로마자 표기를 따른다: `gwang`, `yeolggeut`/`yeol`, `tti`, `pi`, `dan`(단), `wol`(월).
- 화투 12달은 `Month1..Month12` 또는 enum `Wol.JAN..DEC` (도메인 의미가 분명한 쪽 선택, **혼용 금지**).
- DB 컬럼/JSON 필드명은 snake_case, Java 식별자는 camelCase, 클래스/타입은 PascalCase.

### 4-2. 도메인 모델

- 모든 핵심 도메인 객체(`Card`, `Hand`, `Field`, `Pile`, `Player`, `GameRoom`, `Move`)는 **불변(immutable)** 이거나, 변경 시 **새 인스턴스를 반환** 한다.
- 상태 전이는 순수 함수로: `apply(state, move) -> (newState, events)`.
- 카드 ID는 `(month, slot)` 같은 고정 식별자 기반. 셔플은 객체를 다시 만들지 않고 ID 시퀀스만 재배열.

### 4-3. 무작위성 / 결정성

- `RandomSource` 인터페이스를 통해서만 무작위 사용. 테스트는 고정 시드 주입.
- 모든 게임은 `seed: long`로 재현 가능해야 한다. seed + Move 시퀀스로 임의의 시점 상태 복원 가능.
- 게임 시작 시 `seedHash = SHA256(seed)`만 클라이언트에 노출, 종료 시 `seed` 공개 → commit-reveal로 부정 셔플 방지.

### 4-4. 시간

- 게임 엔진에서 시간 비교는 `Clock` 주입. `Instant.now()` / `System.currentTimeMillis()` 직접 호출 금지.

### 4-5. 비-기능

- **로깅**: 게임 엔진 안에서는 SLF4J/직접 로거 금지. 이벤트(`Event`)를 반환하면 어댑터가 로깅한다.
- **예외**: 도메인 위반(룰 위반, 잘못된 move)은 체크드한 도메인 예외로. 시스템 예외(IO, DB)는 어댑터에서 잡거나 그대로 던짐.
- **Null**: 도메인 메서드는 null을 받지도 반환하지도 않는다. `Optional` 또는 빈 컬렉션.

---

## 5. 테스트 정책

### 5-1. 우선순위 (Test Pyramid)

1. **게임 엔진 단위 테스트** — 의존성 없는 순수 테스트. 룰 케이스 100% 커버 목표.
   - 분배(shuffle/deal) 결정성
   - 합법수 계산 (각 인원수, 각 단계)
   - 매칭 자동/선택, 쓸이
   - 단(短) 보너스 (홍/청/초 모두), 본점수 비교, 무승부
   - 비결정적 분기 없는지 (같은 시드 → 같은 결과)
2. **백엔드 통합 테스트** — Spring + Testcontainers (PostgreSQL/Redis).
3. **WebSocket 시나리오 테스트** — 2~5명 시뮬레이션, 재접속, 시간 초과 자동 패스.
4. **프론트엔드** — 컴포넌트 단위(Vitest + Testing Library) + e2e(Playwright)는 핵심 플로우만.

### 5-2. 안 할 것

- 모킹으로 룰 검증을 우회하지 않는다. 게임 엔진은 외부 의존성이 없으므로 mock 자체가 거의 필요 없어야 한다.
- 시간 의존 테스트는 항상 `Clock` 주입으로. `Thread.sleep` 금지.
- 무작위 의존 테스트는 항상 시드 고정으로.

---

## 6. 디렉터리/모듈 경계 (예정)

```
backend/
├── core/         # 순수 게임 엔진 (Spring/HTTP 의존성 X)
│   ├── card/         Card, Deck, Category enum
│   ├── game/         GameState, Move, Event, Engine
│   ├── score/        Scorer, Dan 룰
│   └── rng/          RandomSource, SeededRandom
├── api/          # REST + WebSocket 어댑터
│   ├── rest/
│   └── ws/           STOMP destinations, message DTO
├── persistence/  # JPA / Redis 어댑터
└── application/  # bootRun 진입점, Spring 구성

frontend/
├── src/
│   ├── domain/        타입 정의 (서버 DTO와 동기화, 자동 생성 권장)
│   ├── net/           WebSocket / REST 클라이언트
│   ├── store/         Zustand 슬라이스
│   ├── components/    Card, Field, Hand, Scoreboard, ...
│   └── routes/        Lobby, Room, Replay, ...
```

> 이 구조에서 `core`가 다른 모듈을 import하면 빌드가 깨지도록 설정한다 (Gradle 의존성 그래프).

---

## 7. 자주 쓰는 명령 (예정 — 코드 도입 후)

```bash
# 의존 서비스
docker compose -f infra/docker-compose.yml up -d

# 백엔드
./gradlew :backend:application:bootRun
./gradlew :backend:core:test           # 게임 엔진 단위 테스트만
./gradlew check                        # 전체 검사

# 프론트엔드
pnpm --filter frontend dev
pnpm --filter frontend test
pnpm --filter frontend lint
```

> 위 명령은 코드 스캐폴딩이 들어온 후 정식화. Claude는 코드를 추가하면서 이 섹션을 함께 갱신할 것.

---

## 8. 절대 하지 말 것 (Don'ts)

- ❌ main에 직접 push, force-push, history rewrite (머지된 커밋 amend)
- ❌ `Math.random()`, 시스템 시계 기반 시드, 비결정적 컬렉션 순회 (HashMap iteration 의존 등)
- ❌ 게임 엔진에서 Spring/HTTP/DB import
- ❌ 클라이언트에서 자체 룰 검증으로 UI 활성/비활성 결정 (서버 `legalMoves` 외 의존 금지)
- ❌ 한국어 식별자 사용
- ❌ 비밀(.env, 토큰, PAT 등) 커밋
- ❌ 사용자 동의 없는 새 외부 서비스/유료 의존성 추가
- ❌ "어차피 안 쓸 거니까" 같은 이유로 시드/리플레이/감사 가능성 깨기

---

## 9. 의문이 들 때 (When in doubt)

- 룰 해석이 애매하면 → [docs/GAME_RULES.md](docs/GAME_RULES.md)를 먼저 본다. 거기에도 없으면 코드를 짜기 전에 사람에게 묻는다.
- 큰 구조 변경이 필요하면 → 먼저 `docs/adr/ADR-NNNN-<topic>.md`로 제안 PR 부터 올린다 (Architecture Decision Record).
- 막히거나 시간이 오래 걸리면 → 작업을 작게 쪼갠 부분 PR로 자주 보고한다. 사람이 큰 PR을 리뷰하느라 막히는 것보다 낫다.
