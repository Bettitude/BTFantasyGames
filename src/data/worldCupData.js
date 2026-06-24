// Game constants — not stored in DB
export const INITIAL_BUDGET = 100_000_000;

export const WC_PLAYERS = [
  { id: 1,  name: 'Kylian Mbappé',      country: 'FRA', pos: 'FW', price: 14_000_000, sel: 68.4, pts: 142 },
  { id: 2,  name: 'Erling Haaland',     country: 'NOR', pos: 'FW', price: 13_500_000, sel: 61.2, pts: 128 },
  { id: 3,  name: 'Vinicius Jr.',        country: 'BRA', pos: 'FW', price: 13_000_000, sel: 55.8, pts: 119 },
  { id: 4,  name: 'Jude Bellingham',    country: 'ENG', pos: 'MF', price: 12_500_000, sel: 52.1, pts: 114 },
  { id: 5,  name: 'Lionel Messi',       country: 'ARG', pos: 'FW', price: 11_500_000, sel: 48.7, pts: 107 },
  { id: 6,  name: 'Rodri',              country: 'ESP', pos: 'MF', price: 10_000_000, sel: 39.3, pts:  98 },
  { id: 7,  name: 'Kevin De Bruyne',    country: 'BEL', pos: 'MF', price: 11_000_000, sel: 44.6, pts:  96 },
  { id: 8,  name: 'Pedri',              country: 'ESP', pos: 'MF', price:  9_500_000, sel: 35.9, pts:  91 },
  { id: 9,  name: 'Bukayo Saka',        country: 'ENG', pos: 'MF', price: 10_500_000, sel: 41.2, pts:  89 },
  { id: 10, name: 'Neymar Jr.',         country: 'BRA', pos: 'FW', price: 10_000_000, sel: 36.5, pts:  85 },
  { id: 11, name: 'Virgil van Dijk',    country: 'NED', pos: 'DF', price:  8_000_000, sel: 28.4, pts:  78 },
  { id: 12, name: 'Rúben Dias',         country: 'POR', pos: 'DF', price:  7_500_000, sel: 24.1, pts:  72 },
  { id: 13, name: 'Manuel Neuer',       country: 'GER', pos: 'GK', price:  6_000_000, sel: 18.7, pts:  64 },
  { id: 14, name: 'Alisson',            country: 'BRA', pos: 'GK', price:  6_500_000, sel: 20.3, pts:  61 },
  { id: 15, name: 'Lamine Yamal',       country: 'ESP', pos: 'MF', price:  9_000_000, sel: 32.8, pts:  58 },
  { id: 16, name: 'Phil Foden',         country: 'ENG', pos: 'MF', price: 10_000_000, sel: 37.6, pts:  55 },
  { id: 17, name: 'Antoine Griezmann',  country: 'FRA', pos: 'FW', price:  9_500_000, sel: 33.2, pts:  52 },
  { id: 18, name: 'João Félix',         country: 'POR', pos: 'FW', price:  8_500_000, sel: 27.9, pts:  49 },
  { id: 19, name: 'Raphaël Varane',     country: 'FRA', pos: 'DF', price:  7_000_000, sel: 22.5, pts:  46 },
  { id: 20, name: 'Trent Alexander-Arnold', country: 'ENG', pos: 'DF', price: 8_500_000, sel: 30.1, pts: 43 },
];

export const MOCK_FIXTURES = [
  { id: 1,  status: 'NS',  date: 'Jun 11', time: '19:00', home: 'Mexico',    hCode: 'MEX', away: 'Canada',    aCode: 'CAN', venue: 'SoFi Stadium, LA' },
  { id: 2,  status: 'NS',  date: 'Jun 12', time: '16:00', home: 'Argentina', hCode: 'ARG', away: 'Ecuador',   aCode: 'ECU', venue: 'MetLife Stadium, NJ' },
  { id: 3,  status: 'NS',  date: 'Jun 12', time: '19:00', home: 'France',    hCode: 'FRA', away: 'Morocco',   aCode: 'MAR', venue: 'AT&T Stadium, Dallas' },
  { id: 4,  status: 'NS',  date: 'Jun 13', time: '16:00', home: 'England',   hCode: 'ENG', away: 'Germany',   aCode: 'GER', venue: 'Rose Bowl, LA' },
  { id: 5,  status: 'NS',  date: 'Jun 13', time: '19:00', home: 'Spain',     hCode: 'ESP', away: 'Croatia',   aCode: 'CRO', venue: 'Levi\'s Stadium, SF' },
  { id: 6,  status: 'NS',  date: 'Jun 14', time: '16:00', home: 'Brazil',    hCode: 'BRA', away: 'Colombia',  aCode: 'COL', venue: 'Hard Rock Stadium, Miami' },
  { id: 7,  status: 'FT',  date: 'Jun 10', time: '19:00', home: 'USA',       hCode: 'USA', away: 'Venezuela', aCode: 'VEN', venue: 'MetLife Stadium, NJ' },
  { id: 8,  status: 'FT',  date: 'Jun 10', time: '22:00', home: 'Bolivia',   hCode: 'BOL', away: 'Peru',      aCode: 'PER', venue: 'SoFi Stadium, LA' },
];

export const LEADERBOARD = [
  { rank: 1,  name: 'Los Galacticos',   manager: 'Carlos M.',   gwPts: 94, total: 521 },
  { rank: 2,  name: 'Samba Kings',      manager: 'Rafael S.',   gwPts: 88, total: 509 },
  { rank: 3,  name: 'Three Lions FC',   manager: 'James W.',    gwPts: 76, total: 498 },
  { rank: 4,  name: 'Le Bleu Elite',    manager: 'Pierre D.',   gwPts: 82, total: 487 },
  { rank: 5,  name: 'Selecão United',   manager: 'Lucas B.',    gwPts: 71, total: 476 },
  { rank: 6,  name: 'Clockwork Orange', manager: 'Daan V.',     gwPts: 68, total: 465 },
  { rank: 7,  name: 'Roja Warriors',    manager: 'Álvaro T.',   gwPts: 79, total: 454 },
  { rank: 8,  name: 'Águilas FC',       manager: 'Diego R.',    gwPts: 65, total: 443 },
  { rank: 9,  name: 'Albiceleste XI',   manager: 'Nicolás F.',  gwPts: 72, total: 432 },
  { rank: 10, name: 'Rising Lions',     manager: 'Youssef A.',  gwPts: 60, total: 421 },
];

// Static group-stage display data (never changes during tournament)
export const WC_GROUPS = [
  { group: 'A', teams: [{ name: 'USA',       code: 'USA' }, { name: 'Mexico',   code: 'MEX' }, { name: 'Canada',  code: 'CAN' }, { name: 'Venezuela', code: 'VEN' }] },
  { group: 'B', teams: [{ name: 'Argentina', code: 'ARG' }, { name: 'Ecuador',  code: 'ECU' }, { name: 'Bolivia', code: 'BOL' }, { name: 'Peru',      code: 'PER' }] },
  { group: 'C', teams: [{ name: 'France',    code: 'FRA' }, { name: 'Belgium',  code: 'BEL' }, { name: 'Morocco', code: 'MAR' }, { name: 'Senegal',   code: 'SEN' }] },
  { group: 'D', teams: [{ name: 'England',   code: 'ENG' }, { name: 'Germany',  code: 'GER' }, { name: 'Japan',   code: 'JPN' }, { name: 'Tunisia',   code: 'TUN' }] },
  { group: 'E', teams: [{ name: 'Spain',     code: 'ESP' }, { name: 'Portugal', code: 'POR' }, { name: 'Croatia', code: 'CRO' }, { name: 'Serbia',    code: 'SRB' }] },
  { group: 'F', teams: [{ name: 'Brazil',    code: 'BRA' }, { name: 'Colombia', code: 'COL' }, { name: 'Uruguay', code: 'URU' }, { name: 'Chile',     code: 'CHI' }] },
];
