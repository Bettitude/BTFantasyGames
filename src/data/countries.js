// Maps api-football 3-letter country codes → { name, flag }
// flag = flagcdn.com 2-letter (or subdivision) code
export const COUNTRIES = {
  ALG: { name: 'Algeria',              flag: 'dz' },
  ARG: { name: 'Argentina',            flag: 'ar' },
  AUS: { name: 'Australia',            flag: 'au' },
  AUT: { name: 'Austria',              flag: 'at' },
  BEL: { name: 'Belgium',              flag: 'be' },
  BIH: { name: 'Bosnia & Herzegovina', flag: 'ba' },
  BRA: { name: 'Brazil',               flag: 'br' },
  CAN: { name: 'Canada',               flag: 'ca' },
  CGO: { name: 'Congo DR',             flag: 'cd' },
  CIV: { name: "Ivory Coast",          flag: 'ci' },
  COL: { name: 'Colombia',             flag: 'co' },
  CPV: { name: 'Cape Verde',           flag: 'cv' },
  CRO: { name: 'Croatia',              flag: 'hr' },
  CUR: { name: 'Curaçao',              flag: 'cw' },
  CZE: { name: 'Czechia',              flag: 'cz' },
  ECU: { name: 'Ecuador',              flag: 'ec' },
  EGY: { name: 'Egypt',                flag: 'eg' },
  ENG: { name: 'England',              flag: 'gb-eng' },
  ESP: { name: 'Spain',                flag: 'es' },
  FRA: { name: 'France',               flag: 'fr' },
  GER: { name: 'Germany',              flag: 'de' },
  GHA: { name: 'Ghana',                flag: 'gh' },
  HAI: { name: 'Haiti',                flag: 'ht' },
  IRN: { name: 'Iran',                 flag: 'ir' },
  IRQ: { name: 'Iraq',                 flag: 'iq' },
  JOR: { name: 'Jordan',               flag: 'jo' },
  JPN: { name: 'Japan',                flag: 'jp' },
  KOR: { name: 'South Korea',          flag: 'kr' },
  KSA: { name: 'Saudi Arabia',         flag: 'sa' },
  MAR: { name: 'Morocco',              flag: 'ma' },
  MEX: { name: 'Mexico',               flag: 'mx' },
  NED: { name: 'Netherlands',          flag: 'nl' },
  NOR: { name: 'Norway',               flag: 'no' },
  NZL: { name: 'New Zealand',          flag: 'nz' },
  PAN: { name: 'Panama',               flag: 'pa' },
  PAR: { name: 'Paraguay',             flag: 'py' },
  POR: { name: 'Portugal',             flag: 'pt' },
  QAT: { name: 'Qatar',                flag: 'qa' },
  RSA: { name: 'South Africa',         flag: 'za' },
  SCO: { name: 'Scotland',             flag: 'gb-sct' },
  SEN: { name: 'Senegal',              flag: 'sn' },
  SUI: { name: 'Switzerland',          flag: 'ch' },
  SWE: { name: 'Sweden',               flag: 'se' },
  TUN: { name: 'Tunisia',              flag: 'tn' },
  TUR: { name: 'Türkiye',              flag: 'tr' },
  URU: { name: 'Uruguay',              flag: 'uy' },
  USA: { name: 'USA',                  flag: 'us' },
  UZB: { name: 'Uzbekistan',           flag: 'uz' },
};

export function countryName(code) {
  return COUNTRIES[code?.toUpperCase()]?.name ?? code ?? '';
}

export function flagUrl(code) {
  const alpha2 = COUNTRIES[code?.toUpperCase()]?.flag;
  if (!alpha2) return null;
  return `https://flagcdn.com/w40/${alpha2}.png`;
}

// For search: returns true if query matches the code or country name
export function matchesCountry(code, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    code?.toLowerCase().includes(q) ||
    countryName(code).toLowerCase().includes(q)
  );
}
