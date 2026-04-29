package com.minhwatu.core.card;

import java.util.Optional;
import java.util.Set;

/**
 * 단(短). 같은 색/계열 띠 3장을 모았을 때 성립하는 보너스 족보.
 * <p>
 * 표준 매핑:
 * <ul>
 *   <li>{@link #HONG} 홍단(紅短): 1, 2, 3월 띠 (붉은색 단자쿠)</li>
 *   <li>{@link #CHEONG} 청단(靑短): 6, 9, 10월 띠 (파란색 단자쿠)</li>
 *   <li>{@link #CHO} 초단(草短): 4, 5, 7월 띠 (글씨 띠)</li>
 * </ul>
 * 8월·11월에는 띠가 없고, 12월의 비띠는 단(短)에 포함되지 않는다.
 * <p>
 * 민화투에서 단을 완성하면 상대방 각각에게서 30점씩 뺏어온다.
 *
 * @see <a href="../../../../../../../docs/GAME_RULES.md">docs/GAME_RULES.md §2-2, §5-2</a>
 */
public enum Dan {
    HONG(Set.of(Wol.JAN, Wol.FEB, Wol.MAR), "홍단", "紅短"),
    CHEONG(Set.of(Wol.JUN, Wol.SEP, Wol.OCT), "청단", "靑短"),
    CHO(Set.of(Wol.APR, Wol.MAY, Wol.JUL), "초단", "草短");

    private final Set<Wol> wols;
    private final String hangul;
    private final String hanja;

    Dan(Set<Wol> wols, String hangul, String hanja) {
        this.wols = wols;
        this.hangul = hangul;
        this.hanja = hanja;
    }

    /** 본 단에 속하는 월들(불변 Set). */
    public Set<Wol> wols() {
        return wols;
    }

    /** 한글 라벨("홍단"/"청단"/"초단"). */
    public String hangul() {
        return hangul;
    }

    /** 한자 라벨("紅短"/"靑短"/"草短"). */
    public String hanja() {
        return hanja;
    }

    /**
     * 주어진 월의 띠가 어느 단에 속하는지 반환한다. 단에 속하지 않는 월(8·11·12)이면 빈 Optional.
     */
    public static Optional<Dan> ofWol(Wol wol) {
        for (Dan d : values()) {
            if (d.wols.contains(wol)) {
                return Optional.of(d);
            }
        }
        return Optional.empty();
    }
}
