export function calculatePoints(stats = {}, position = 'FW') {
  let pts = 0;
  const {
    minutes = 0, goals = 0, assists = 0,
    cleanSheet = false, yellowCards = 0, redCards = 0,
    saves = 0, penaltySaves = 0, penaltyMisses = 0, ownGoals = 0,
  } = stats;

  // Minutes played
  if (minutes >= 60) pts += 2;
  else if (minutes > 0) pts += 1;

  // Goals scored
  if (position === 'GK' || position === 'DF')       pts += goals * 6;
  else if (position === 'MF')                        pts += goals * 5;
  else                                               pts += goals * 4;

  // Assists
  pts += assists * 3;

  // Clean sheet (only if played 60+ mins)
  if (cleanSheet && minutes >= 60) {
    if (position === 'GK' || position === 'DF')      pts += 4;
    else if (position === 'MF')                       pts += 1;
  }

  // GK saves
  if (position === 'GK') {
    pts += Math.floor(saves / 3);
    pts += penaltySaves * 5;
  }

  // Cards
  pts -= yellowCards;
  pts -= redCards * 3;

  // Penalty misses / own goals
  pts -= penaltyMisses * 2;
  pts -= ownGoals * 2;

  return Math.max(pts, 0);
}

export function formatPrice(value) {
  const m = value / 1_000_000;
  return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
}

export function formatBudget(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `${(value / 1_000).toFixed(0)}K`;
  return value.toFixed(0);
}
