const fs = require("fs");
const path = require("path");

const dataPath = path.join(
  __dirname,
  "../data/processed/flood_data_with_district.json"
);

let cachedData = [];

try {
  cachedData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
} catch (err) {
  console.error("❌ Failed to load dataset");
}

// =======================
// 🔥 NORMALIZE DATA
// =======================
const normalizeData = (item) => {
  return {
    rainfall: item.rainfall_mm ?? item.rainfall ?? 0,
    waterLevel: item.water_level ?? item.waterLevel ?? 0,
    discharge: item.river_discharge ?? item.discharge ?? 0,
    humidity: item.humidity ?? 0,
    elevation: item.elevation ?? 0,
    historicalFloods: item.flood_occurred ?? 0,
  };
};

// =======================
// 🔥 RISK LOGIC
// =======================
const getRisk = (item) => {
  if (
    item.rainfall > 220 &&
    item.waterLevel > 7.5 &&
    item.discharge > 3700 &&
    (item.historicalFloods === 1 || item.elevation < 2500)
  ) {
    return "HIGH";
  }

  if (
    item.rainfall >= 100 &&
    item.rainfall <= 220 &&
    item.waterLevel >= 4 &&
    item.waterLevel <= 7.5 &&
    item.discharge >= 2000 &&
    item.discharge <= 3700 &&
    item.humidity > 60
  ) {
    return "MEDIUM";
  }

  return "LOW";
};

exports.getDistrictAnalytics = (req, res) => {
  try {
    const stats = {};
    const districtScores = {};

    let totalRecords = 0;
    let totalFloods = 0;

    let high = 0;
    let medium = 0;
    let low = 0;

    const driverCount = {
      rainfall: 0,
      waterLevel: 0,
      discharge: 0,
    };

    // =======================
    // PROCESS DATA
    // =======================
    for (const item of cachedData) {
      if (!item.district) continue;

      totalRecords++;

      if (item.flood_occurred === 1) {
        totalFloods++;
      }

      const normalized = normalizeData(item);
      const risk = getRisk(normalized);

      // =======================
      // GLOBAL RISK DISTRIBUTION
      // =======================
      if (risk === "HIGH") high++;
      else if (risk === "MEDIUM") medium++;
      else low++;

      // =======================
      // DRIVER TRACKING
      // =======================
      if (normalized.rainfall > 220) driverCount.rainfall++;
      if (normalized.waterLevel > 7.5) driverCount.waterLevel++;
      if (normalized.discharge > 3700) driverCount.discharge++;

      // =======================
      // DISTRICT STATS
      // =======================
      if (!stats[item.district]) {
        stats[item.district] = {
          total: 0,
          floods: 0,
        };
      }

      stats[item.district].total++;

      if (item.flood_occurred === 1) {
        stats[item.district].floods++;
      }

      // =======================
      // 🔥 DISTRICT RISK SCORING (FIXED)
      // =======================
      if (!districtScores[item.district]) {
        districtScores[item.district] = {
          score: 0,
          floods: 0,
        };
      }

      // Risk weight
      if (risk === "HIGH") districtScores[item.district].score += 5;
      else if (risk === "MEDIUM") districtScores[item.district].score += 3;
      else districtScores[item.district].score += 1;

      // Flood boost
      if (item.flood_occurred === 1) {
        districtScores[item.district].score += 2;
        districtScores[item.district].floods++;
      }

      // Optional: add continuous weighting
      districtScores[item.district].score +=
        normalized.rainfall * 0.01 +
        normalized.waterLevel * 1.5 +
        normalized.discharge * 0.0005;
    }

    // =======================
    // 🔥 TOP DISTRICTS (FIXED)
    // =======================
    const topDistricts = Object.entries(districtScores)
      .map(([name, val]) => ({
        name,
        value: Math.round(val.score),
        floods: val.floods,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // =======================
    // PRIMARY DRIVER
    // =======================
    const driverEntries = Object.entries(driverCount).sort(
      (a, b) => b[1] - a[1]
    );

    const primaryDriver = driverEntries[0]?.[0] || "N/A";

    const totalDriverEvents =
      driverCount.rainfall +
      driverCount.waterLevel +
      driverCount.discharge;

    const driverPercent = totalDriverEvents
      ? Math.round((driverEntries[0][1] / totalDriverEvents) * 100)
      : 0;

    // =======================
    // RESPONSE
    // =======================
    res.json({
      success: true,
      data: {
        total: totalRecords,
        floods: totalFloods,

        distribution: {
          high,
          medium,
          low,
        },

        topDistricts,

        driver: {
          type: primaryDriver,
          percent: driverPercent,
        },
      },
    });
  } catch (err) {
    console.error("❌ Analytics Error:", err);
    res.status(500).json({
      success: false,
      message: "Analytics processing failed",
    });
  }
};