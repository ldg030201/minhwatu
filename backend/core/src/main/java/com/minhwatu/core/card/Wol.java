package com.minhwatu.core.card;

/**
 * 화투의 월(月). 1월 ~ 12월. 각 월은 표시용 한자/한글과 대표 모티프를 가진다.
 * <p>
 * 식별자(이름)는 enum 영문 키, 표시 라벨은 별도 필드(CLAUDE.md §4-1).
 * <p>
 * <b>ordinal()이 아니라 {@link #number()}를 사용한다.</b> ordinal()은 0부터 시작해 월 번호와 어긋난다.
 */
public enum Wol {
    JAN(1, "一月", "1월", "송학"),
    FEB(2, "二月", "2월", "매조"),
    MAR(3, "三月", "3월", "벚꽃"),
    APR(4, "四月", "4월", "흑싸리"),
    MAY(5, "五月", "5월", "난초"),
    JUN(6, "六月", "6월", "모란"),
    JUL(7, "七月", "7월", "홍싸리"),
    AUG(8, "八月", "8월", "공산"),
    SEP(9, "九月", "9월", "국화"),
    OCT(10, "十月", "10월", "단풍"),
    NOV(11, "十一月", "11월", "오동"),
    DEC(12, "十二月", "12월", "비");

    private final int number;
    private final String hanja;
    private final String hangul;
    private final String motifKo;

    Wol(int number, String hanja, String hangul, String motifKo) {
        this.number = number;
        this.hanja = hanja;
        this.hangul = hangul;
        this.motifKo = motifKo;
    }

    /** 1 ~ 12. */
    public int number() {
        return number;
    }

    /** 한자 라벨(예: "一月"). 카드 위 표기에 사용. */
    public String hanja() {
        return hanja;
    }

    /** 한글 라벨(예: "1월"). UI 본문에 사용. */
    public String hangul() {
        return hangul;
    }

    /** 대표 모티프의 한글 표기(예: "송학"). */
    public String motifKo() {
        return motifKo;
    }

    /**
     * 1 ~ 12 사이의 정수에 해당하는 월을 반환한다.
     *
     * @throws IllegalArgumentException 1 ~ 12 범위 밖일 때
     */
    public static Wol of(int number) {
        if (number < 1 || number > 12) {
            throw new IllegalArgumentException("월은 1~12 사이여야 합니다: " + number);
        }
        return values()[number - 1];
    }
}
