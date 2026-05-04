export const evaluateFloodRisk = (data) => {
  let score = 0;
  const factors = [];

  const {
    rainfall,
    waterLevel,
    discharge,
    humidity,
    elevation,
    historicalFloods,
  } = data;

  // =========================
  // 🔴 HIGH RISK
  // =========================
  if (
    rainfall > 220 &&
    waterLevel > 7.5 &&
    discharge > 3700 &&
    (historicalFloods === 1 || elevation < 2500)
  ) {
    return {
      risk: "HIGH",
      score: 10,
      factors: [
        "Extreme rainfall",
        "Critical water level",
        "High discharge",
        "Flood-prone terrain",
      ],
    };
  }

  // =========================
  // 🟡 MEDIUM RISK
  // =========================
  if (
    rainfall >= 100 && rainfall <= 220 &&
    waterLevel >= 4 && waterLevel <= 7.5 &&
    discharge >= 2000 && discharge <= 3700 &&
    humidity > 60
  ) {
    return {
      risk: "MEDIUM",
      score: 6,
      factors: [
        "Moderate rainfall",
        "Elevated water level",
        "Moderate discharge",
        "High humidity",
      ],
    };
  }

  // =========================
  // 🟢 LOW RISK
  // =========================
  if (
    rainfall < 100 &&
    waterLevel < 4 &&
    discharge < 2000 &&
    (elevation >= 2500 || historicalFloods === 0)
  ) {
    return {
      risk: "LOW",
      score: 2,
      factors: [
        "Low rainfall",
        "Stable water level",
        "Low discharge",
        "Safe terrain",
      ],
    };
  }

  // =========================
  // ⚠️ FALLBACK LOGIC (SCORING)
  // =========================

  if (rainfall > 200) {
    score += 2;
    factors.push("High rainfall");
  }

  if (discharge > 3000) {
    score += 2;
    factors.push("High discharge");
  }

  if (waterLevel > 7) {
    score += 2;
    factors.push("High water level");
  }

  if (elevation < 500) {
    score += 1;
    factors.push("Low elevation");
  }

  if (humidity > 60) {
    score += 1;
    factors.push("High humidity");
  }

  if (historicalFloods === 1) {
    score += 1;
    factors.push("Flood history");
  }

  let risk = "LOW";
  if (score >= 6) risk = "HIGH";
  else if (score >= 3) risk = "MEDIUM";

  return { risk, score, factors };
};