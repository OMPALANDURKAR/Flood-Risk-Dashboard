// server/utils/predictor.js

// Simulated ML model (since no real training here)
exports.mlPrediction = (data) => {
  let score = 0;

  score += data.rainfall / 300;
  score += data.discharge / 5000;
  score += data.waterLevel / 10;
  score += data.humidity / 100;
  score -= data.elevation / 2000;
  score += data.history * 0.5;

  // Normalize between 0–1
  const probability = Math.max(0, Math.min(1, score / 5));

  return probability;
};