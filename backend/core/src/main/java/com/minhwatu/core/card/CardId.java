package com.minhwatu.core.card;

import java.util.Objects;

/**
 * 카드 식별자. (월, 분류, 슬롯) 세 값으로 결정된다.
 * <p>
 * 슬롯은 같은 (월, 분류)로 카드가 여러 장 존재할 때(주로 피)를 구분하기 위한 1부터 시작하는 정수이다.
 * 광/열끗/띠는 한 월에 1장씩이라 슬롯이 항상 1, 피만 월에 따라 1~3이다.
 * <p>
 * 직렬화 형식: {@code "<month>-<catCode><slot?>"} (예: "1-G", "8-Y", "11-P3", "12-T").
 * slot이 1인 광/열끗/띠는 슬롯 번호를 생략한다.
 */
public record CardId(Wol wol, CardCategory category, int slot) {

    public CardId {
        Objects.requireNonNull(wol, "wol");
        Objects.requireNonNull(category, "category");
        if (slot < 1) {
            throw new IllegalArgumentException("slot은 1 이상이어야 합니다: " + slot);
        }
    }

    /** 슬롯 1짜리 카드(광/열끗/띠/12월 비피). */
    public static CardId of(Wol wol, CardCategory category) {
        return new CardId(wol, category, 1);
    }

    /** 슬롯이 있는 카드(주로 피). */
    public static CardId of(Wol wol, CardCategory category, int slot) {
        return new CardId(wol, category, slot);
    }

    /**
     * 직렬화: {@code "<month>-<code>[<slot>]"}.
     * code는 G(광)/Y(열끗)/T(띠)/P(피).
     */
    public String serialize() {
        StringBuilder sb = new StringBuilder()
            .append(wol.number())
            .append('-')
            .append(codeOf(category));
        if (category == CardCategory.PI) {
            // 피는 항상 슬롯을 노출(1~3) — 11월·12월은 1, 2가 아니라 명시적으로 표기해 가독성 보장.
            sb.append(slot);
        } else if (slot != 1) {
            sb.append(slot);
        }
        return sb.toString();
    }

    @Override
    public String toString() {
        return serialize();
    }

    private static char codeOf(CardCategory c) {
        return switch (c) {
            case GWANG -> 'G';
            case YEOL -> 'Y';
            case TTI -> 'T';
            case PI -> 'P';
        };
    }
}
