package com.minhwatu.core.card;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * 표준 화투 48장의 정전(正典). 보너스패(쌍피)는 포함하지 않는다.
 * <p>
 * 구성:
 * <ul>
 *   <li>광 5장 (1·3·8·11·12월)</li>
 *   <li>열끗 9장 (2·4·5·6·7·8·9·10·12월)</li>
 *   <li>띠 10장 (1·2·3·4·5·6·7·9·10·12월)</li>
 *   <li>피 24장 (1~10월 각 2장 + 11월 3장 + 12월 1장)</li>
 * </ul>
 * 합 48장, 만점 240.
 *
 * @see <a href="../../../../../../../docs/GAME_RULES.md">docs/GAME_RULES.md §2</a>
 */
public final class CardCatalog {

    private static final List<Card> CARDS;
    private static final Map<CardId, Card> BY_ID;

    static {
        List<Card> list = new ArrayList<>(48);

        // 광 — 1, 3, 8, 11, 12월
        for (Wol w : List.of(Wol.JAN, Wol.MAR, Wol.AUG, Wol.NOV, Wol.DEC)) {
            list.add(new Card(CardId.of(w, CardCategory.GWANG)));
        }

        // 열끗 — 광·띠와 동일 월에는 없는 경우가 있음. 표준 분포 명시:
        // 2(매조), 4(흑싸리), 5(난초), 6(모란), 7(홍싸리), 8(공산), 9(국화), 10(단풍), 12(비)
        for (Wol w : List.of(Wol.FEB, Wol.APR, Wol.MAY, Wol.JUN, Wol.JUL,
                             Wol.AUG, Wol.SEP, Wol.OCT, Wol.DEC)) {
            list.add(new Card(CardId.of(w, CardCategory.YEOL)));
        }

        // 띠 — 1, 2, 3월(홍단) + 4, 5, 7월(초단) + 6, 9, 10월(청단) + 12월(비띠)
        // 8월·11월에는 띠가 없다.
        for (Wol w : List.of(Wol.JAN, Wol.FEB, Wol.MAR,
                             Wol.APR, Wol.MAY, Wol.JUL,
                             Wol.JUN, Wol.SEP, Wol.OCT,
                             Wol.DEC)) {
            list.add(new Card(CardId.of(w, CardCategory.TTI)));
        }

        // 피 — 각 월의 남은 슬롯을 모두 피로 채운다.
        // 한 월의 카드 수는 항상 4장이므로, (광/열끗/띠 합산)을 4에서 뺀 만큼이 피 슬롯 수.
        for (Wol w : Wol.values()) {
            int existing = (int) list.stream().filter(c -> c.wol() == w).count();
            int piCount = 4 - existing;
            for (int slot = 1; slot <= piCount; slot++) {
                list.add(new Card(CardId.of(w, CardCategory.PI, slot)));
            }
        }

        Collections.sort(list); // (월 asc, 분류 asc, 슬롯 asc)

        CARDS = List.copyOf(list);

        Map<CardId, Card> byId = new LinkedHashMap<>(64);
        for (Card c : CARDS) {
            byId.put(c.id(), c);
        }
        BY_ID = Collections.unmodifiableMap(byId);
    }

    private CardCatalog() {
        // 정적 정전이므로 인스턴스화 금지.
    }

    /** 표준 48장(불변, 정렬됨). */
    public static List<Card> all() {
        return CARDS;
    }

    /** id로 카드 조회. 존재하지 않으면 NoSuchElementException. */
    public static Card byId(CardId id) {
        Card c = BY_ID.get(id);
        if (c == null) {
            throw new NoSuchElementException("카드를 찾을 수 없습니다: " + id);
        }
        return c;
    }

    /** 특정 월의 카드 4장(정렬됨). */
    public static List<Card> ofWol(Wol wol) {
        return CARDS.stream().filter(c -> c.wol() == wol).toList();
    }

    /** 특정 분류의 카드 전부(정렬됨). */
    public static List<Card> ofCategory(CardCategory category) {
        return CARDS.stream().filter(c -> c.category() == category).toList();
    }
}
