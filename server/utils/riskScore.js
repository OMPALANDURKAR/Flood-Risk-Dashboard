// server/utils/riskScore.js

exports.calculateRiskScore = (data) => {
  return (
    (data.rainfall * 0.25) +
    (data.discharge * 0.25) +
    (data.waterLevel * 0.20) +
    (data.humidity * 0.10) -
    (data.elevation * 0.10) +
    (data.history * 0.05) +
    (data.infrastructure * 0.05)
  );
};