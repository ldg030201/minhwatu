package com.minhwatu.core.card;

import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class DanTest {

    @Test
    void 단은_홍_청_초_3종이며_각_3개의_월을_포함한다() {
        assertThat(Dan.values()).hasSize(3);
        assertThat(Dan.HONG.wols()).hasSize(3);
        assertThat(Dan.CHEONG.wols()).hasSize(3);
        assertThat(Dan.CHO.wols()).hasSize(3);
    }

    @Test
    void 홍단은_1_2_3월이다() {
        assertThat(Dan.HONG.wols()).containsExactlyInAnyOrder(Wol.JAN, Wol.FEB, Wol.MAR);
    }

    @Test
    void 청단은_6_9_10월이다() {
        assertThat(Dan.CHEONG.wols()).containsExactlyInAnyOrder(Wol.JUN, Wol.SEP, Wol.OCT);
    }

    @Test
    void 초단은_4_5_7월이다() {
        assertThat(Dan.CHO.wols()).containsExactlyInAnyOrder(Wol.APR, Wol.MAY, Wol.JUL);
    }

    @Test
    void 모든_단의_월_집합은_서로_겹치지_않는다() {
        assertThat(intersect(Dan.HONG.wols(), Dan.CHEONG.wols())).isEmpty();
        assertThat(intersect(Dan.HONG.wols(), Dan.CHO.wols())).isEmpty();
        assertThat(intersect(Dan.CHEONG.wols(), Dan.CHO.wols())).isEmpty();
    }

    @Test
    void 단_3종을_합치면_총_9개월이고_8_11_12월은_제외된다() {
        Set<Wol> all = new java.util.HashSet<>();
        for (Dan d : Dan.values()) {
            all.addAll(d.wols());
        }
        assertThat(all).hasSize(9).doesNotContain(Wol.AUG, Wol.NOV, Wol.DEC);
    }

    @Test
    void ofWol은_단에_속한_월에_대해_올바른_단을_반환한다() {
        assertThat(Dan.ofWol(Wol.JAN)).contains(Dan.HONG);
        assertThat(Dan.ofWol(Wol.FEB)).contains(Dan.HONG);
        assertThat(Dan.ofWol(Wol.MAR)).contains(Dan.HONG);

        assertThat(Dan.ofWol(Wol.APR)).contains(Dan.CHO);
        assertThat(Dan.ofWol(Wol.MAY)).contains(Dan.CHO);
        assertThat(Dan.ofWol(Wol.JUL)).contains(Dan.CHO);

        assertThat(Dan.ofWol(Wol.JUN)).contains(Dan.CHEONG);
        assertThat(Dan.ofWol(Wol.SEP)).contains(Dan.CHEONG);
        assertThat(Dan.ofWol(Wol.OCT)).contains(Dan.CHEONG);
    }

    @Test
    void ofWol은_8_11_12월에_대해_빈_Optional을_반환한다() {
        assertThat(Dan.ofWol(Wol.AUG)).isEmpty();
        assertThat(Dan.ofWol(Wol.NOV)).isEmpty();
        assertThat(Dan.ofWol(Wol.DEC)).isEmpty();
    }

    @Test
    void 한글_한자_라벨이_지정대로다() {
        assertThat(Dan.HONG.hangul()).isEqualTo("홍단");
        assertThat(Dan.HONG.hanja()).isEqualTo("紅短");
        assertThat(Dan.CHEONG.hangul()).isEqualTo("청단");
        assertThat(Dan.CHEONG.hanja()).isEqualTo("靑短");
        assertThat(Dan.CHO.hangul()).isEqualTo("초단");
        assertThat(Dan.CHO.hanja()).isEqualTo("草短");
    }

    private static <T> Set<T> intersect(Set<T> a, Set<T> b) {
        Set<T> r = new java.util.HashSet<>(a);
        r.retainAll(b);
        return r;
    }
}
