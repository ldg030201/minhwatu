package com.minhwatu.core.card;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CardIdTest {

    @Test
    void 광_열끗_띠는_슬롯이_생략된_형식으로_직렬화된다() {
        assertThat(CardId.of(Wol.JAN, CardCategory.GWANG).serialize()).isEqualTo("1-G");
        assertThat(CardId.of(Wol.AUG, CardCategory.YEOL).serialize()).isEqualTo("8-Y");
        assertThat(CardId.of(Wol.JAN, CardCategory.TTI).serialize()).isEqualTo("1-T");
    }

    @Test
    void 피는_슬롯이_항상_표기된다() {
        assertThat(CardId.of(Wol.JAN, CardCategory.PI, 1).serialize()).isEqualTo("1-P1");
        assertThat(CardId.of(Wol.JAN, CardCategory.PI, 2).serialize()).isEqualTo("1-P2");
        assertThat(CardId.of(Wol.NOV, CardCategory.PI, 3).serialize()).isEqualTo("11-P3");
        assertThat(CardId.of(Wol.DEC, CardCategory.PI, 1).serialize()).isEqualTo("12-P1");
    }

    @Test
    void 슬롯이_2_이상인_광_열끗_띠는_슬롯도_표기된다() {
        // 표준 카탈로그엔 등장하지 않는 케이스이지만 형식상 처리.
        assertThat(CardId.of(Wol.JAN, CardCategory.GWANG, 2).serialize()).isEqualTo("1-G2");
    }

    @Test
    void slot이_1_미만이면_생성_시_예외() {
        assertThatThrownBy(() -> CardId.of(Wol.JAN, CardCategory.PI, 0))
            .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> CardId.of(Wol.JAN, CardCategory.PI, -1))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void null_월_또는_분류는_NPE() {
        assertThatThrownBy(() -> new CardId(null, CardCategory.GWANG, 1))
            .isInstanceOf(NullPointerException.class);
        assertThatThrownBy(() -> new CardId(Wol.JAN, null, 1))
            .isInstanceOf(NullPointerException.class);
    }

    @Test
    void 동일_세_값이면_record_동등성이_성립한다() {
        var a = CardId.of(Wol.MAR, CardCategory.TTI);
        var b = CardId.of(Wol.MAR, CardCategory.TTI);
        assertThat(a).isEqualTo(b);
        assertThat(a.hashCode()).isEqualTo(b.hashCode());
    }
}
