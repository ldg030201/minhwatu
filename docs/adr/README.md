# Architecture Decision Records

본 디렉터리는 본 프로젝트의 **구조적 결정**을 시간 순으로 보존하는 ADR(Architecture Decision Record) 모음입니다.

## 무엇을 ADR로 적는가

- 모듈/패키지 경계, 의존 방향, 빌드 시스템 같은 **다시 바꾸기 어려운 결정**
- 프레임워크/라이브러리 채택·교체
- 도메인 모델의 핵심 인바리언트(예: 시드 주입, 불변성, 서버 권위 등)
- 외부 시스템 연동 방식(WebSocket 프로토콜, 인증 흐름 등)

## 무엇을 ADR로 적지 않는가

- 작은 리팩터링, 변수명, 컴포넌트 디자인 같은 **로컬 결정**
- 코드만 보고도 알 수 있는 사실(현재 상태 설명) — 그건 코드 주석/README가 할 일
- 일회성 버그 수정 회고 — 그건 PR 본문/이슈가 할 일

## 작성 규칙

1. 파일명: `NNNN-kebab-case-title.md` (`0001-domain-and-module-boundaries.md`)
2. 번호는 충돌 없게 채번. PR 머지 시점에 번호 확정.
3. 메타 헤더:
   - `상태` — 제안(Proposed) / 채택(Accepted) / 대체됨(Superseded by ADR-NNNN) / 폐기(Deprecated)
   - `일자` — YYYY-MM-DD
   - `결정 동인` — 이 결정을 이끈 핵심 관심사
4. 본문 섹션:
   - **배경 (Context)** — 왜 결정이 필요했는가
   - **결정 (Decision)** — 무엇을 결정했는가
   - **근거 (Rationale)** — 왜 그렇게 결정했는가
   - **영향 (Consequences)** — 긍정/부정/중립 영향
   - **검토한 대안 (Alternatives considered)** — 검토했지만 채택하지 않은 안과 그 이유
   - **남은 질문 / 후속 (Open questions / Follow-ups)** — 남은 결정거리
5. 머지 후 ADR은 **수정하지 않는다**. 결정이 바뀌면 새 ADR을 만들고, 이전 ADR의 상태만 `대체됨 — ADR-NNNN`으로 한 줄 변경한다.

## 인덱스

| # | 제목 | 상태 |
|--:|------|------|
| [0001](0001-domain-and-module-boundaries.md) | 도메인 & 모듈 경계 | 채택 |
