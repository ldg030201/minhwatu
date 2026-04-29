// @ts-nocheck
// 시안에서 옮겨온 카드 카탈로그/메타. 본 PR에서는 ESM export로만 변경하고
// 타입화·정리는 다음 PR에서 진행한다(점진 마이그레이션 정책).

export const MONTH_LABELS = {
  1: { hanja: '一月', han: '1월', motif: '송학', hanjaMotif: '松鶴' },
  2: { hanja: '二月', han: '2월', motif: '매조', hanjaMotif: '梅鳥' },
  3: { hanja: '三月', han: '3월', motif: '벚꽃', hanjaMotif: '櫻花' },
  4: { hanja: '四月', han: '4월', motif: '흑싸리', hanjaMotif: '黑萩' },
  5: { hanja: '五月', han: '5월', motif: '난초', hanjaMotif: '蘭草' },
  6: { hanja: '六月', han: '6월', motif: '모란', hanjaMotif: '牡丹' },
  7: { hanja: '七月', han: '7월', motif: '홍싸리', hanjaMotif: '紅萩' },
  8: { hanja: '八月', han: '8월', motif: '공산', hanjaMotif: '空山' },
  9: { hanja: '九月', han: '9월', motif: '국화', hanjaMotif: '菊花' },
  10: { hanja: '十月', han: '10월', motif: '단풍', hanjaMotif: '丹楓' },
  11: { hanja: '十一月', han: '11월', motif: '오동', hanjaMotif: '梧桐' },
  12: { hanja: '十二月', han: '12월', motif: '비', hanjaMotif: '雨' },
};

// 시안의 정식 한국어 표기(광/열끗/띠/피)에 맞춰 label은 단축형 사용.
// 정식 명칭은 docs/GAME_RULES.md의 "광/열끗/띠/피" 그대로다.
// UI 표기는 1글자 한글 + 한자 조합. 다음 PR에서 점진 검토.
export const CARD_CATEGORY = {
  GWANG: { key: 'GWANG', label: '광', hanja: '光', points: 20, color: 'gold' },
  YEOL: { key: 'YEOL', label: '끗', hanja: '十', points: 10, color: 'indigo' },
  TTI: { key: 'TTI', label: '단', hanja: '短', points: 5, color: 'red' },
  PI: { key: 'PI', label: '피', hanja: '皮', points: 1, color: 'neutral' },
};

export const MONTH_PALETTE = {
  1: { sky: '#3a6647', ground: '#1d3a26', accent: '#a84235' },
  2: { sky: '#c46b5e', ground: '#7a2820', accent: '#f3d97a' },
  3: { sky: '#e9c2cc', ground: '#c08596', accent: '#a84235' },
  4: { sky: '#3d3324', ground: '#1f1812', accent: '#7a4a2a' },
  5: { sky: '#7d8c5b', ground: '#4a5836', accent: '#d4b075' },
  6: { sky: '#a84235', ground: '#6b231b', accent: '#3a6647' },
  7: { sky: '#9c4d3a', ground: '#5e2818', accent: '#3a4a2a' },
  8: { sky: '#2a3a55', ground: '#15203a', accent: '#f1e6cc' },
  9: { sky: '#b89456', ground: '#7a5e2c', accent: '#a84235' },
  10: { sky: '#a84235', ground: '#6b2218', accent: '#d4b075' },
  11: { sky: '#3b4a6b', ground: '#1f2a44', accent: '#b89456' },
  12: { sky: '#3b4a6b', ground: '#1f2a44', accent: '#a84235' },
};

export const CARD_CATALOG = [
  { id: '1-G', month: 1, cat: 'GWANG' },
  { id: '1-T', month: 1, cat: 'TTI', ribbon: 'RED_POEM' },
  { id: '1-P1', month: 1, cat: 'PI' },
  { id: '1-P2', month: 1, cat: 'PI' },
  { id: '2-Y', month: 2, cat: 'YEOL' },
  { id: '2-T', month: 2, cat: 'TTI', ribbon: 'RED_POEM' },
  { id: '2-P1', month: 2, cat: 'PI' },
  { id: '2-P2', month: 2, cat: 'PI' },
  { id: '3-G', month: 3, cat: 'GWANG' },
  { id: '3-T', month: 3, cat: 'TTI', ribbon: 'RED_POEM' },
  { id: '3-P1', month: 3, cat: 'PI' },
  { id: '3-P2', month: 3, cat: 'PI' },
  { id: '4-Y', month: 4, cat: 'YEOL' },
  { id: '4-T', month: 4, cat: 'TTI', ribbon: 'GREEN' },
  { id: '4-P1', month: 4, cat: 'PI' },
  { id: '4-P2', month: 4, cat: 'PI' },
  { id: '5-Y', month: 5, cat: 'YEOL' },
  { id: '5-T', month: 5, cat: 'TTI', ribbon: 'GREEN' },
  { id: '5-P1', month: 5, cat: 'PI' },
  { id: '5-P2', month: 5, cat: 'PI' },
  { id: '6-Y', month: 6, cat: 'YEOL' },
  { id: '6-T', month: 6, cat: 'TTI', ribbon: 'BLUE' },
  { id: '6-P1', month: 6, cat: 'PI' },
  { id: '6-P2', month: 6, cat: 'PI' },
  { id: '7-Y', month: 7, cat: 'YEOL' },
  { id: '7-T', month: 7, cat: 'TTI', ribbon: 'GREEN' },
  { id: '7-P1', month: 7, cat: 'PI' },
  { id: '7-P2', month: 7, cat: 'PI' },
  { id: '8-G', month: 8, cat: 'GWANG' },
  { id: '8-Y', month: 8, cat: 'YEOL' },
  { id: '8-P1', month: 8, cat: 'PI' },
  { id: '8-P2', month: 8, cat: 'PI' },
  { id: '9-Y', month: 9, cat: 'YEOL' },
  { id: '9-T', month: 9, cat: 'TTI', ribbon: 'BLUE' },
  { id: '9-P1', month: 9, cat: 'PI' },
  { id: '9-P2', month: 9, cat: 'PI' },
  { id: '10-Y', month: 10, cat: 'YEOL' },
  { id: '10-T', month: 10, cat: 'TTI', ribbon: 'BLUE' },
  { id: '10-P1', month: 10, cat: 'PI' },
  { id: '10-P2', month: 10, cat: 'PI' },
  { id: '11-G', month: 11, cat: 'GWANG' },
  { id: '11-P1', month: 11, cat: 'PI' },
  { id: '11-P2', month: 11, cat: 'PI' },
  { id: '11-P3', month: 11, cat: 'PI' },
  { id: '12-G', month: 12, cat: 'GWANG' },
  { id: '12-Y', month: 12, cat: 'YEOL' },
  { id: '12-T', month: 12, cat: 'TTI', ribbon: 'GREEN' },
  { id: '12-P', month: 12, cat: 'PI' },
];

export const CARD_BY_ID = Object.fromEntries(CARD_CATALOG.map((c) => [c.id, c]));
