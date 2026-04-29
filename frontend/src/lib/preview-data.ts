// 시안에서 가져온 데모 상태(플레이어, 최종 획득 더미, Tweaks 기본값).
// 본격 게임 상태는 추후 백엔드 연결 + Zustand store로 대체.

export const TWEAK_DEFAULTS = {
  theme: 'light',
  cardAbstraction: 'mid',
  boardLayout: 'hybrid',
  labelMode: 'hanja',
  accentTone: 'muted',
  animationIntensity: 'full',
  showHintBar: true,
};

export const PLAYERS = {
  me: { name: '나', color: 'linear-gradient(135deg,#b89456,#d4b884)' },
  p2: { name: '준호', color: 'linear-gradient(135deg,#a84235,#c46b5e)' },
  p3: { name: '지우', color: 'linear-gradient(135deg,#3a6647,#6b8c75)' },
  p4: { name: '민서', color: 'linear-gradient(135deg,#3b4a6b,#6a7a9c)' },
};

// 데모 정산 상태 — "나"가 홍단 + 청단으로 승리하는 시나리오
export const FINAL_CAPTURED = {
  me: {
    GWANG: ['1-G', '3-G', '8-G'],
    YEOL: ['2-Y', '8-Y', '9-Y'],
    TTI: ['1-T', '2-T', '3-T', '6-T', '9-T', '10-T'],
    PI: ['1-P2', '11-P2', '11-P3', '5-P1', '5-P2'],
  },
  p2: {
    GWANG: ['12-G'],
    YEOL: ['7-Y', '10-Y'],
    TTI: ['7-T', '12-T'],
    PI: ['4-P1', '4-P2', '7-P1', '7-P2', '12-P'],
  },
  p3: {
    GWANG: ['11-G'],
    YEOL: [] as string[],
    TTI: ['4-T'],
    PI: ['3-P1', '3-P2', '6-P1', '6-P2', '8-P1', '8-P2', '10-P1', '10-P2'],
  },
  p4: {
    GWANG: [] as string[],
    YEOL: ['4-Y', '5-Y', '6-Y'],
    TTI: ['5-T'],
    PI: ['1-P1', '2-P1', '2-P2', '9-P1', '9-P2', '11-P1'],
  },
};
