package com.minhwatu.core.card;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class WolTest {

    @Test
    void enum은_총_12개이며_월_번호가_1부터_12까지_정확하다() {
        assertThat(Wol.values()).hasSize(12);
        for (int i = 0; i < 12; i++) {
            assertThat(Wol.values()[i].number()).isEqualTo(i + 1);
        }
    }

    @ParameterizedTest
    @ValueSource(ints = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12})
    void of로_조회한_월의_번호가_입력과_같다(int number) {
        assertThat(Wol.of(number).number()).isEqualTo(number);
    }

    @ParameterizedTest
    @ValueSource(ints = {0, -1, 13, 100})
    void of는_1에서_12_범위를_벗어나면_예외를_던진다(int badNumber) {
        assertThatThrownBy(() -> Wol.of(badNumber))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining(String.valueOf(badNumber));
    }

    @Test
    void 한자_한글_모티프_표기가_지정대로다() {
        assertThat(Wol.JAN.hanja()).isEqualTo("一月");
        assertThat(Wol.JAN.hangul()).isEqualTo("1월");
        assertThat(Wol.JAN.motifKo()).isEqualTo("송학");

        assertThat(Wol.AUG.motifKo()).isEqualTo("공산");
        assertThat(Wol.NOV.motifKo()).isEqualTo("오동");
        assertThat(Wol.DEC.motifKo()).isEqualTo("비");
    }
}
