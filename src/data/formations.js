// x = % from left, y = % from top (0 = top = opponent goal, 100 = bottom = our goal)

export const FORMATIONS = {
  '4-3-3': {
    label: '4-3-3',
    starters: [
      { id: 's0',  pos: 'GK',  x: 50, y: 86 },
      { id: 's1',  pos: 'DF',  x: 14, y: 67 }, { id: 's2',  pos: 'DF', x: 37, y: 64 },
      { id: 's3',  pos: 'DF',  x: 63, y: 64 }, { id: 's4',  pos: 'DF', x: 86, y: 67 },
      { id: 's5',  pos: 'MF',  x: 19, y: 42 }, { id: 's6',  pos: 'MF', x: 50, y: 39 }, { id: 's7', pos: 'MF', x: 81, y: 42 },
      { id: 's8',  pos: 'FW',  x: 16, y: 18 }, { id: 's9',  pos: 'FW', x: 50, y: 15 }, { id: 's10', pos: 'FW', x: 84, y: 18 },
    ],
  },
  '4-4-2': {
    label: '4-4-2',
    starters: [
      { id: 's0',  pos: 'GK',  x: 50, y: 86 },
      { id: 's1',  pos: 'DF',  x: 12, y: 67 }, { id: 's2',  pos: 'DF', x: 37, y: 64 },
      { id: 's3',  pos: 'DF',  x: 63, y: 64 }, { id: 's4',  pos: 'DF', x: 88, y: 67 },
      { id: 's5',  pos: 'MF',  x: 10, y: 43 }, { id: 's6',  pos: 'MF', x: 37, y: 40 }, { id: 's7', pos: 'MF', x: 63, y: 40 }, { id: 's8', pos: 'MF', x: 90, y: 43 },
      { id: 's9',  pos: 'FW',  x: 33, y: 17 }, { id: 's10', pos: 'FW', x: 67, y: 17 },
    ],
  },
  '3-5-2': {
    label: '3-5-2',
    starters: [
      { id: 's0',  pos: 'GK',  x: 50, y: 86 },
      { id: 's1',  pos: 'DF',  x: 25, y: 66 }, { id: 's2',  pos: 'DF', x: 50, y: 63 }, { id: 's3', pos: 'DF', x: 75, y: 66 },
      { id: 's4',  pos: 'MF',  x:  9, y: 46 }, { id: 's5',  pos: 'MF', x: 28, y: 42 }, { id: 's6', pos: 'MF', x: 50, y: 39 },
      { id: 's7',  pos: 'MF',  x: 72, y: 42 }, { id: 's8',  pos: 'MF', x: 91, y: 46 },
      { id: 's9',  pos: 'FW',  x: 34, y: 17 }, { id: 's10', pos: 'FW', x: 66, y: 17 },
    ],
  },
  '4-2-3-1': {
    label: '4-2-3-1',
    starters: [
      { id: 's0',  pos: 'GK',  x: 50, y: 86 },
      { id: 's1',  pos: 'DF',  x: 12, y: 68 }, { id: 's2',  pos: 'DF', x: 37, y: 65 },
      { id: 's3',  pos: 'DF',  x: 63, y: 65 }, { id: 's4',  pos: 'DF', x: 88, y: 68 },
      { id: 's5',  pos: 'MF',  x: 33, y: 52 }, { id: 's6',  pos: 'MF', x: 67, y: 52 },
      { id: 's7',  pos: 'MF',  x: 14, y: 35 }, { id: 's8',  pos: 'MF', x: 50, y: 32 }, { id: 's9', pos: 'MF', x: 86, y: 35 },
      { id: 's10', pos: 'FW',  x: 50, y: 15 },
    ],
  },
  '5-3-2': {
    label: '5-3-2',
    starters: [
      { id: 's0',  pos: 'GK',  x: 50, y: 86 },
      { id: 's1',  pos: 'DF',  x:  8, y: 68 }, { id: 's2',  pos: 'DF', x: 26, y: 65 }, { id: 's3', pos: 'DF', x: 50, y: 63 },
      { id: 's4',  pos: 'DF',  x: 74, y: 65 }, { id: 's5',  pos: 'DF', x: 92, y: 68 },
      { id: 's6',  pos: 'MF',  x: 20, y: 42 }, { id: 's7',  pos: 'MF', x: 50, y: 39 }, { id: 's8', pos: 'MF', x: 80, y: 42 },
      { id: 's9',  pos: 'FW',  x: 33, y: 17 }, { id: 's10', pos: 'FW', x: 67, y: 17 },
    ],
  },
};

export const BENCH_SLOTS = [
  { id: 'b0', pos: 'GK', label: 'SUB GK' },
  { id: 'b1', pos: 'ANY', label: 'SUB 1' },
  { id: 'b2', pos: 'ANY', label: 'SUB 2' },
  { id: 'b3', pos: 'ANY', label: 'SUB 3' },
];

export const POSITION_LIMITS = { GK: 2, DF: 5, MF: 5, FW: 3 };

export const POSITION_COLORS = {
  GK:  { bg: 'bg-amber-500',   ring: 'ring-amber-400',   text: 'text-amber-400',   badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  DF:  { bg: 'bg-sky-500',     ring: 'ring-sky-400',     text: 'text-sky-400',     badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  MF:  { bg: 'bg-emerald-500', ring: 'ring-emerald-400', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  FW:  { bg: 'bg-rose-500',    ring: 'ring-rose-400',    text: 'text-rose-400',    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  ANY: { bg: 'bg-slate-500',   ring: 'ring-slate-400',   text: 'text-slate-400',   badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
};
