// server/utils/ruleEngine.js

exports.ruleScore = (data) => {
  let score = 0;
  const factors = [];

  if (data.rainfall > 200) {
    score += 2;
    factors.push('High rainfall');
  }

  if (data.discharge > 3000) {
    score += 2;
    factors.push('High river discharge');
  }

  if (data.waterLevel > 7) {
    score += 2;
    factors.push('High water level');
  }

  if (data.elevation < 500) {
    score += 1;
    factors.push('Low elevation');
  }

  if (data.soil === 3) {
    score += 1;
    factors.push('Clay soil');
  }

  if (data.history === 1) {
    score += 1;
    factors.push('Flood history');
  }

  return { score, factors };
};