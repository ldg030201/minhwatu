package com.minhwatu.core.card;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CardTest {

    @Test
    void points는_분류의_점수와_같다() {
        assertThat(card(Wol.JAN, CardCategory.GWANG).points()).isEqualTo(20);
        assertThat(card(Wol.AUG, CardCategory.YEOL).points()).isEqualTo(10);
        assertThat(card(Wol.JAN, CardCategory.TTI).points()).isEqualTo(5);
        assertThat(card(Wol.JAN, CardCategory.PI).points()).isEqualTo(0);
    }

    @Test
    void 띠는_dan을_정상_반환하지만_띠가_아닌_카드는_빈Optional() {
        assertThat(card(Wol.JAN, CardCategory.TTI).dan()).contains(Dan.HONG);
        assertThat(card(Wol.JUN, CardCategory.TTI).dan()).contains(Dan.CHEONG);
        assertThat(card(Wol.APR, CardCategory.TTI).dan()).contains(Dan.CHO);

        // 12월 비띠는 단에 속하지 않는다(GAME_RULES.md §2-2)
        assertThat(card(Wol.DEC, CardCategory.TTI).dan()).isEmpty();

        // 띠가 아닌 카드는 dan() 조회 자체가 빈 Optional
        assertThat(card(Wol.JAN, CardCategory.GWANG).dan()).isEmpty();
        assertThat(card(Wol.AUG, CardCategory.YEOL).dan()).isEmpty();
    }

    @Test
    void 정렬_순서는_월_분류_슬롯_순이다() {
        var c1 = card(Wol.JAN, CardCategory.GWANG);
        var c2 = card(Wol.JAN, CardCategory.TTI);
        var c3 = card(Wol.FEB, CardCategory.GWANG);
        var c4 = new Card(CardId.of(Wol.NOV, CardCategory.PI, 3));
        var c5 = new Card(CardId.of(Wol.NOV, CardCategory.PI, 1));

        assertThat(c1).isLessThan(c2);   // 같은 월 — 분류로 비교 (광 < 띠)
        assertThat(c2).isLessThan(c3);   // 다른 월
        assertThat(c5).isLessThan(c4);   // 같은 월/분류 — 슬롯으로 비교
    }

    @Test
    void toString은_id_serialize와_동일하다() {
        var c = card(Wol.AUG, CardCategory.GWANG);
        assertThat(c.toString()).isEqualTo("8-G");
    }

    private static Card card(Wol w, CardCategory cat) {
        return new Card(CardId.of(w, cat));
    }
}
