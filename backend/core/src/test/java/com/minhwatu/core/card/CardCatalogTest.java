package com.minhwatu.core.card;

import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * 표준 화투 48장 카탈로그의 정확성을 검증한다. 본 테스트가 깨지면 룰 자체가 깨지는 것이므로
 * 가장 보수적으로 유지(GAME_RULES.md와 정합).
 */
class CardCatalogTest {

    @Test
    void 정확히_48장이다() {
        assertThat(CardCatalog.all()).hasSize(48);
    }

    @Test
    void id가_모두_서로_다르다() {
        Set<CardId> ids = new HashSet<>();
        for (Card c : CardCatalog.all()) {
            assertThat(ids.add(c.id()))
                .as("중복 id 발견: %s", c.id())
                .isTrue();
        }
    }

    @Test
    void 분류별_장수가_표준과_일치한다() {
        assertThat(CardCatalog.ofCategory(CardCategory.GWANG)).hasSize(5);
        assertThat(CardCatalog.ofCategory(CardCategory.YEOL)).hasSize(9);
        assertThat(CardCatalog.ofCategory(CardCategory.TTI)).hasSize(10);
        assertThat(CardCatalog.ofCategory(CardCategory.PI)).hasSize(24);
    }

    @Test
    void 광은_1_3_8_11_12월에만_있다() {
        var months = CardCatalog.ofCategory(CardCategory.GWANG).stream()
            .map(c -> c.wol().number()).sorted().toList();
        assertThat(months).containsExactly(1, 3, 8, 11, 12);
    }

    @Test
    void 띠는_8월과_11월을_제외한_10개월에_있다() {
        var months = CardCatalog.ofCategory(CardCategory.TTI).stream()
            .map(c -> c.wol().number()).sorted().toList();
        assertThat(months).containsExactly(1, 2, 3, 4, 5, 6, 7, 9, 10, 12);
    }

    @Test
    void 열끗은_1_3_11월을_제외한_9개월에_있다() {
        var months = CardCatalog.ofCategory(CardCategory.YEOL).stream()
            .map(c -> c.wol().number()).sorted().toList();
        assertThat(months).containsExactly(2, 4, 5, 6, 7, 8, 9, 10, 12);
    }

    @Test
    void 모든_월에_정확히_4장이_있다() {
        for (Wol w : Wol.values()) {
            assertThat(CardCatalog.ofWol(w))
                .as("월 %s", w)
                .hasSize(4);
        }
    }

    @Test
    void _11월은_광1_피3이고_띠와_열끗이_없다() {
        var nov = CardCatalog.ofWol(Wol.NOV);
        assertThat(nov.stream().filter(c -> c.category() == CardCategory.GWANG)).hasSize(1);
        assertThat(nov.stream().filter(c -> c.category() == CardCategory.PI)).hasSize(3);
        assertThat(nov.stream().filter(c -> c.category() == CardCategory.YEOL)).isEmpty();
        assertThat(nov.stream().filter(c -> c.category() == CardCategory.TTI)).isEmpty();
    }

    @Test
    void _12월은_광_열끗_띠_피_각_1장이다() {
        var dec = CardCatalog.ofWol(Wol.DEC);
        assertThat(dec.stream().filter(c -> c.category() == CardCategory.GWANG)).hasSize(1);
        assertThat(dec.stream().filter(c -> c.category() == CardCategory.YEOL)).hasSize(1);
        assertThat(dec.stream().filter(c -> c.category() == CardCategory.TTI)).hasSize(1);
        assertThat(dec.stream().filter(c -> c.category() == CardCategory.PI)).hasSize(1);
    }

    @Test
    void _8월은_광_열끗_피2이고_띠가_없다() {
        var aug = CardCatalog.ofWol(Wol.AUG);
        assertThat(aug.stream().filter(c -> c.category() == CardCategory.GWANG)).hasSize(1);
        assertThat(aug.stream().filter(c -> c.category() == CardCategory.YEOL)).hasSize(1);
        assertThat(aug.stream().filter(c -> c.category() == CardCategory.PI)).hasSize(2);
        assertThat(aug.stream().filter(c -> c.category() == CardCategory.TTI)).isEmpty();
    }

    @Test
    void 점수의_총합은_240이다() {
        int total = CardCatalog.all().stream().mapToInt(Card::points).sum();
        assertThat(total).isEqualTo(240);
        // 분류별로 쪼개도 240
        int byCat = CardCatalog.ofCategory(CardCategory.GWANG).size() * 20
                  + CardCatalog.ofCategory(CardCategory.YEOL).size() * 10
                  + CardCatalog.ofCategory(CardCategory.TTI).size() * 5
                  + CardCatalog.ofCategory(CardCategory.PI).size() * 0;
        assertThat(byCat).isEqualTo(240);
    }

    @Test
    void 단별_띠가_정확히_3장씩이고_12월_비띠는_어느_단에도_속하지_않는다() {
        var ttiCards = CardCatalog.ofCategory(CardCategory.TTI);
        long hong = ttiCards.stream().filter(c -> c.dan().filter(d -> d == Dan.HONG).isPresent()).count();
        long cheong = ttiCards.stream().filter(c -> c.dan().filter(d -> d == Dan.CHEONG).isPresent()).count();
        long cho = ttiCards.stream().filter(c -> c.dan().filter(d -> d == Dan.CHO).isPresent()).count();

        assertThat(hong).isEqualTo(3);
        assertThat(cheong).isEqualTo(3);
        assertThat(cho).isEqualTo(3);

        // 12월 비띠
        Card dec = CardCatalog.byId(CardId.of(Wol.DEC, CardCategory.TTI));
        assertThat(dec.dan()).isEmpty();
    }

    @Test
    void byId로_특정_카드를_조회할_수_있다() {
        Card c = CardCatalog.byId(CardId.of(Wol.AUG, CardCategory.GWANG));
        assertThat(c.wol()).isEqualTo(Wol.AUG);
        assertThat(c.category()).isEqualTo(CardCategory.GWANG);
    }

    @Test
    void byId는_없는_카드에_대해_예외를_던진다() {
        // 8월에는 띠가 없으므로 카탈로그에 존재하지 않는다
        assertThatThrownBy(() -> CardCatalog.byId(CardId.of(Wol.AUG, CardCategory.TTI)))
            .isInstanceOf(java.util.NoSuchElementException.class);
    }

    @Test
    void all은_정렬되어_있다() {
        List<Card> sorted = CardCatalog.all().stream().sorted().toList();
        assertThat(CardCatalog.all()).containsExactlyElementsOf(sorted);
    }

    @Test
    void all은_불변_리스트이다() {
        List<Card> all = CardCatalog.all();
        assertThatThrownBy(() -> all.add(new Card(CardId.of(Wol.JAN, CardCategory.GWANG))))
            .isInstanceOf(UnsupportedOperationException.class);
    }
}
