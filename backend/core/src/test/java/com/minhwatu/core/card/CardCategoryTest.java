package com.minhwatu.core.card;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CardCategoryTest {

    @Test
    void 분류는_광_열끗_띠_피_4종이며_점수가_민화투_표준과_일치한다() {
        assertThat(CardCategory.values()).hasSize(4);
        assertThat(CardCategory.GWANG.points()).isEqualTo(20);
        assertThat(CardCategory.YEOL.points()).isEqualTo(10);
        assertThat(CardCategory.TTI.points()).isEqualTo(5);
        assertThat(CardCategory.PI.points()).isEqualTo(0);
    }

    @Test
    void 한글_한자_라벨이_지정대로다() {
        assertThat(CardCategory.GWANG.hangul()).isEqualTo("광");
        assertThat(CardCategory.GWANG.hanja()).isEqualTo("光");

        assertThat(CardCategory.YEOL.hangul()).isEqualTo("열끗");
        assertThat(CardCategory.YEOL.hanja()).isEqualTo("十");

        assertThat(CardCategory.TTI.hangul()).isEqualTo("띠");
        assertThat(CardCategory.TTI.hanja()).isEqualTo("短");

        assertThat(CardCategory.PI.hangul()).isEqualTo("피");
        assertThat(CardCategory.PI.hanja()).isEqualTo("皮");
    }

    @Test
    void enum_자연_순서는_점수_내림차순과_일치한다() {
        // 자연 순서가 GWANG > YEOL > TTI > PI 인지
        var values = CardCategory.values();
        for (int i = 0; i < values.length - 1; i++) {
            assertThat(values[i].points())
                .as("i=%d: %s (%d) >= %s (%d)", i, values[i], values[i].points(),
                    values[i + 1], values[i + 1].points())
                .isGreaterThanOrEqualTo(values[i + 1].points());
        }
    }
}
