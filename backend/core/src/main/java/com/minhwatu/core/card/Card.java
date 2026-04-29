package com.minhwatu.core.card;

import java.util.Objects;
import java.util.Optional;

/**
 * 화투 한 장. 식별자(CardId)로 자기 동일성이 결정되며, 띠라면 어느 단(短)에 속하는지도 확인 가능.
 * <p>
 * 불변(immutable) record. {@link CardId#wol()}와 {@link CardId#category()}로 메타에 접근하므로 별도 필드는 없다.
 */
public record Card(CardId id) implements Comparable<Card> {

    public Card {
        Objects.requireNonNull(id, "id");
    }

    public Wol wol() {
        return id.wol();
    }

    public CardCategory category() {
        return id.category();
    }

    /** 본 카드가 띠라면 속한 단(홍/청/초). 띠가 아니거나 단에 속하지 않는 띠(12월 비띠)면 빈 Optional. */
    public Optional<Dan> dan() {
        if (category() != CardCategory.TTI) {
            return Optional.empty();
        }
        return Dan.ofWol(wol());
    }

    /** 카드 1장의 점수 (= 분류의 점수). */
    public int points() {
        return category().points();
    }

    /**
     * 정렬 기준: (월 번호 asc, 분류 자연 순서 asc, 슬롯 asc).
     * 분류 자연 순서는 GWANG > YEOL > TTI > PI 순(점수 내림차순과 동일).
     */
    @Override
    public int compareTo(Card other) {
        int byWol = Integer.compare(this.wol().number(), other.wol().number());
        if (byWol != 0) return byWol;
        int byCat = this.category().compareTo(other.category());
        if (byCat != 0) return byCat;
        return Integer.compare(this.id.slot(), other.id.slot());
    }

    @Override
    public String toString() {
        return id.serialize();
    }
}
