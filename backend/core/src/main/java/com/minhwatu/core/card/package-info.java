/**
 * 화투 도메인 1차 모델: 월(Wol), 카드 분류(CardCategory), 단(Dan), 카드(Card)와 표준 카탈로그(CardCatalog).
 * <p>
 * 본 패키지는 ADR-0001에 따라 외부 라이브러리 의존성이 0이며, 모든 객체는 불변(immutable)이다.
 * 게임 엔진/딜러/스코어러는 이 패키지의 타입을 입력으로 받는다.
 *
 * @see <a href="../../../../../../../../docs/adr/0001-domain-and-module-boundaries.md">ADR-0001</a>
 */
package com.minhwatu.core.card;
