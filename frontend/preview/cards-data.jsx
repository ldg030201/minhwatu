// cards.jsx — HwatuCard SVG component + month/category data
// All artwork is original abstracted illustration (민화 평면 + 색면 톤).
// Composition system: outer cream face + colored "sky band" at top,
// hero silhouette in center, optional poetic ribbon at bottom.

const MONTH_LABELS = {
  1:  { hanja: "一月", han: "1월",  motif: "송학",  hanjaMotif: "松鶴" },
  2:  { hanja: "二月", han: "2월",  motif: "매조",  hanjaMotif: "梅鳥" },
  3:  { hanja: "三月", han: "3월",  motif: "벚꽃",  hanjaMotif: "櫻花" },
  4:  { hanja: "四月", han: "4월",  motif: "흑싸리", hanjaMotif: "黑萩" },
  5:  { hanja: "五月", han: "5월",  motif: "난초",  hanjaMotif: "蘭草" },
  6:  { hanja: "六月", han: "6월",  motif: "모란",  hanjaMotif: "牡丹" },
  7:  { hanja: "七月", han: "7월",  motif: "홍싸리", hanjaMotif: "紅萩" },
  8:  { hanja: "八月", han: "8월",  motif: "공산",  hanjaMotif: "空山" },
  9:  { hanja: "九月", han: "9월",  motif: "국화",  hanjaMotif: "菊花" },
  10: { hanja: "十月", han: "10월", motif: "단풍",  hanjaMotif: "丹楓" },
  11: { hanja: "十一月", han: "11월", motif: "오동", hanjaMotif: "梧桐" },
  12: { hanja: "十二月", han: "12월", motif: "비",   hanjaMotif: "雨" },
};

// Category enum (English keys, Korean labels per spec)
const CARD_CATEGORY = {
  GWANG: { key: "GWANG", label: "광",  hanja: "光", points: 20, color: "gold" },
  YEOL:  { key: "YEOL",  label: "끗", hanja: "十", points: 10, color: "indigo" },
  TTI:   { key: "TTI",   label: "단",  hanja: "短", points: 5,  color: "red" },
  PI:    { key: "PI",    label: "피",  hanja: "皮", points: 1,  color: "neutral" },
};

// Month sky-band tints for the top stripe of each card (민화 색면)
const MONTH_PALETTE = {
  1:  { sky: "#3a6647", ground: "#1d3a26", accent: "#a84235" }, // 송학 — 솔잎 그린, 학의 빨강
  2:  { sky: "#c46b5e", ground: "#7a2820", accent: "#f3d97a" }, // 매조 — 매화 핑크
  3:  { sky: "#e9c2cc", ground: "#c08596", accent: "#a84235" }, // 벚꽃 — 연분홍
  4:  { sky: "#3d3324", ground: "#1f1812", accent: "#7a4a2a" }, // 흑싸리
  5:  { sky: "#7d8c5b", ground: "#4a5836", accent: "#d4b075" }, // 난초
  6:  { sky: "#a84235", ground: "#6b231b", accent: "#3a6647" }, // 모란
  7:  { sky: "#9c4d3a", ground: "#5e2818", accent: "#3a4a2a" }, // 홍싸리 + 멧돼지
  8:  { sky: "#2a3a55", ground: "#15203a", accent: "#f1e6cc" }, // 공산 — 밤하늘 + 보름달
  9:  { sky: "#b89456", ground: "#7a5e2c", accent: "#a84235" }, // 국화
  10: { sky: "#a84235", ground: "#6b2218", accent: "#d4b075" }, // 단풍
  11: { sky: "#3b4a6b", ground: "#1f2a44", accent: "#b89456" }, // 오동
  12: { sky: "#3b4a6b", ground: "#1f2a44", accent: "#a84235" }, // 비
};

// Card catalog: which (month, category, slot) cards exist.
// We'll mark which are "fully drawn" vs "schematic placeholder" via the renderer.
// Standard 화투 distribution: each month has 4 cards split across categories.
const CARD_CATALOG = [
  // 1월 송학: 광, 띠(홍단), 피, 피
  { id: "1-G",   month: 1, cat: "GWANG" },
  { id: "1-T",   month: 1, cat: "TTI", ribbon: "RED_POEM" },
  { id: "1-P1",  month: 1, cat: "PI" },
  { id: "1-P2",  month: 1, cat: "PI" },
  // 2월 매조: 열끗, 띠(홍단), 피, 피
  { id: "2-Y",   month: 2, cat: "YEOL" },
  { id: "2-T",   month: 2, cat: "TTI", ribbon: "RED_POEM" },
  { id: "2-P1",  month: 2, cat: "PI" },
  { id: "2-P2",  month: 2, cat: "PI" },
  // 3월 벚꽃: 광, 띠(홍단), 피, 피
  { id: "3-G",   month: 3, cat: "GWANG" },
  { id: "3-T",   month: 3, cat: "TTI", ribbon: "RED_POEM" },
  { id: "3-P1",  month: 3, cat: "PI" },
  { id: "3-P2",  month: 3, cat: "PI" },
  // 4월 흑싸리: 열끗, 띠(초단), 피, 피
  { id: "4-Y",   month: 4, cat: "YEOL" },
  { id: "4-T",   month: 4, cat: "TTI", ribbon: "GREEN" },
  { id: "4-P1",  month: 4, cat: "PI" },
  { id: "4-P2",  month: 4, cat: "PI" },
  // 5월 난초: 열끗, 띠(초단), 피, 피
  { id: "5-Y",   month: 5, cat: "YEOL" },
  { id: "5-T",   month: 5, cat: "TTI", ribbon: "GREEN" },
  { id: "5-P1",  month: 5, cat: "PI" },
  { id: "5-P2",  month: 5, cat: "PI" },
  // 6월 모란: 열끗, 띠(청단), 피, 피
  { id: "6-Y",   month: 6, cat: "YEOL" },
  { id: "6-T",   month: 6, cat: "TTI", ribbon: "BLUE" },
  { id: "6-P1",  month: 6, cat: "PI" },
  { id: "6-P2",  month: 6, cat: "PI" },
  // 7월 홍싸리: 열끗, 띠(초단), 피, 피
  { id: "7-Y",   month: 7, cat: "YEOL" },
  { id: "7-T",   month: 7, cat: "TTI", ribbon: "GREEN" },
  { id: "7-P1",  month: 7, cat: "PI" },
  { id: "7-P2",  month: 7, cat: "PI" },
  // 8월 공산: 광, 열끗, 피, 피
  { id: "8-G",   month: 8, cat: "GWANG" },
  { id: "8-Y",   month: 8, cat: "YEOL" },
  { id: "8-P1",  month: 8, cat: "PI" },
  { id: "8-P2",  month: 8, cat: "PI" },
  // 9월 국화: 열끗, 띠(청단), 피, 피
  { id: "9-Y",   month: 9, cat: "YEOL" },
  { id: "9-T",   month: 9, cat: "TTI", ribbon: "BLUE" },
  { id: "9-P1",  month: 9, cat: "PI" },
  { id: "9-P2",  month: 9, cat: "PI" },
  // 10월 단풍: 열끗, 띠(청단), 피, 피
  { id: "10-Y",  month: 10, cat: "YEOL" },
  { id: "10-T",  month: 10, cat: "TTI", ribbon: "BLUE" },
  { id: "10-P1", month: 10, cat: "PI" },
  { id: "10-P2", month: 10, cat: "PI" },
  // 11월 오동: 광, 피, 피, 피
  { id: "11-G",  month: 11, cat: "GWANG" },
  { id: "11-P1", month: 11, cat: "PI" },
  { id: "11-P2", month: 11, cat: "PI" },
  { id: "11-P3", month: 11, cat: "PI" },
  // 12월 비: 광, 열끗, 띠, 피
  { id: "12-G",  month: 12, cat: "GWANG" },
  { id: "12-Y",  month: 12, cat: "YEOL" },
  { id: "12-T",  month: 12, cat: "TTI", ribbon: "GREEN" },
  { id: "12-P",  month: 12, cat: "PI" },
];

// expose to window so other Babel scripts can read
Object.assign(window, { MONTH_LABELS, CARD_CATEGORY, MONTH_PALETTE, CARD_CATALOG });
