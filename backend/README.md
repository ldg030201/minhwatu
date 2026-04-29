# backend/

본 프로젝트의 백엔드(Java 21 + Gradle 멀티 모듈)입니다.
ADR-0001에 따라 4개 모듈로 분리되며, **`core`는 외부 라이브러리 의존성을 두지 않는다**(JUnit/AssertJ는 testImplementation에만).

> 본 PR로 멀티 모듈 셋업과 `core/card` 도메인(월·분류·단·카드·카탈로그) + 단위 테스트가 들어왔습니다. `engine/score/deal/rng/error`와 `api/persistence/application` 모듈은 후속 PR입니다.

---

## 빠른 시작

```bash
cd backend
./gradlew :core:test          # 도메인 단위 테스트만 빠르게
./gradlew check               # 모든 검사
./gradlew clean test          # 클린 후 재실행
```

## 모듈 구조 (ADR-0001)

```
backend/
├── settings.gradle.kts
├── build.gradle.kts
├── gradlew, gradlew.bat
├── gradle/wrapper/
└── core/                  순수 게임 엔진 — 외부 의존성 0
    ├── build.gradle.kts
    └── src/
        ├── main/java/com/minhwatu/core/
        │   └── card/      Wol/CardCategory/Dan/CardId/Card/CardCatalog
        └── test/java/com/minhwatu/core/
            └── card/      대응 단위 테스트
```

후속 모듈(다음 PR들):

```
├── api/                   REST + WebSocket(STOMP) 어댑터
├── persistence/           JPA(PostgreSQL) + Redis 어댑터
└── application/           bootRun 진입점, 모든 모듈 wiring
```

의존 방향: `application` → `{api, persistence, core}`, `{api, persistence}` → `core`. **`core`는 어떤 모듈도 import하지 않는다.** 빌드 그래프(`subprojects` 구성)로 강제.

## 명명 / 코딩 규칙

- 한국어 식별자 금지(클래스/메서드/필드). 도메인 한국어는 enum 영문 키 + 한글 표시 라벨로 분리. 예: `CardCategory.GWANG.hangul() == "광"`.
- **Java enum의 ordinal() 사용 금지** — 월/분류 같이 비즈니스 의미가 있는 enum은 별도 `number()` 같은 명시 필드를 둔다.
- 모든 도메인 객체는 불변(record/`final`).
- 시간/무작위는 주입(`Clock`, `RandomSource`) — `Instant.now()`/`new Random()` 직접 호출 금지(다음 PR에서 도입).
- 테스트 메서드명은 한국어 가능. **단, Java 식별자는 숫자로 시작할 수 없다** — 숫자로 시작해야 하면 `_` 접두(예: `_11월은_광1_피3이고_띠와_열끗이_없다`).

## 테스트 정책 요약

- 단위 테스트: 외부 의존성 0, 결정적, ms 단위.
- 룰 변경은 반드시 회귀 테스트와 함께(CLAUDE.md §1, §5).
- 모킹으로 룰 검증을 우회하지 않는다.

## 현재 테스트 커버 (1차)

- `Wol` enum의 12개월·번호·라벨
- `CardCategory` 4종·점수·라벨·자연 순서
- `Dan` 3종(홍/청/초)·월 매핑·8/11/12월 비포함 검증
- `CardId` 직렬화(`"1-G"`/`"11-P3"` 등)·검증
- `Card` 점수·dan 조회·정렬
- `CardCatalog` 표준 48장(분류별 5/9/10/24, 월별 4장, 광 5월·11월 0열끗 0띠 등 분포 정합, 점수 합 240, 단별 띠 3장씩, 12월 비띠 단 미포함, 불변 리스트)

## 다음 단계 (후속 PR)

1. `core/rng` — `RandomSource` + `SeededRandom` (commit-reveal 시드)
2. `core/deal` — `Dealer` (인원수별 손패/바닥/더미 분배, 고정 시드 결정성)
3. `core/game` — `GameState`, `Move`, `Phase`, `Event`
4. `core/engine` — `Engine.apply(state, move)` 순수 함수
5. `core/score` — `Scorer` (광/열끗/띠/피 합산 + 단 보너스 + 본점수 비교)
6. `api`, `persistence`, `application` — 어댑터 + Spring 진입점
