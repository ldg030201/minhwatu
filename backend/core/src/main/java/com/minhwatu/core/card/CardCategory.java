package com.minhwatu.core.card;

/**
 * 화투패의 분류. 모든 화투 게임에 공통이며, 민화투에서는 각 카드의 점수가 분류만으로 결정된다.
 * <p>
 * 점수표(민화투 표준):
 * <ul>
 *   <li>{@link #GWANG} 광 1장 = 20점, 5장</li>
 *   <li>{@link #YEOL} 열끗 1장 = 10점, 9장</li>
 *   <li>{@link #TTI} 띠 1장 = 5점, 10장</li>
 *   <li>{@link #PI} 피 1장 = 0점, 24장</li>
 * </ul>
 * 합계 240점, 48장.
 *
 * @see <a href="../../../../../../../docs/GAME_RULES.md">docs/GAME_RULES.md</a>
 */
public enum CardCategory {
    GWANG(20, "광", "光"),
    YEOL(10, "열끗", "十"),
    TTI(5, "띠", "短"),
    PI(0, "피", "皮");

    private final int points;
    private final String hangul;
    private final String hanja;

    CardCategory(int points, String hangul, String hanja) {
        this.points = points;
        this.hangul = hangul;
        this.hanja = hanja;
    }

    /** 카드 1장당 점수. */
    public int points() {
        return points;
    }

    /** 한글 라벨("광"/"열끗"/"띠"/"피"). */
    public String hangul() {
        return hangul;
    }

    /** 한자 라벨("光"/"十"/"短"/"皮"). */
    public String hanja() {
        return hanja;
    }
}
