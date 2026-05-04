const fs = require("fs");
const path = require("path");

const dataPath = path.join(
  __dirname,
  "../data/processed/flood_data_with_district.json"
);

// =======================
// LOAD DATA ONCE
// =======================
let cachedData = [];

try {
  const fileContent = fs.readFileSync(dataPath, "utf-8");
  cachedData = JSON.parse(fileContent);
  console.log(`✅ Loaded dataset: ${cachedData.length} records`);
} catch (err) {
  console.error("❌ Failed to load dataset:", err.message);
}

// =======================
// NORMALIZATION
// =======================
const normalize = (str) =>
  str
    ?.toLowerCase()
    .replace(/district/g, "")
    .replace(/\(.*?\)/g, "")
    .trim();

// =======================
// GET ALL DATA
// =======================
exports.getAllData = (req, res, next) => {
  try {
    let data = [...cachedData];

    const { district } = req.query;

    // =======================
    // FILTER BY DISTRICT
    // =======================
    if (district) {
      const input = normalize(district);

      data = data.filter((item) => {
        const name = normalize(item.district);
        return name === input;
      });
    }

    // =======================
    // CLEAN DATA (IMPORTANT)
    // =======================
    data = data.map((item) => ({
      ...item,
      latitude: Number(item.latitude || item.lat),
      longitude: Number(item.longitude || item.lng),
    }));

    // =======================
    // OPTIONAL PAGINATION
    // =======================
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    let paginatedData = data;

    if (page && limit) {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      paginatedData = data.slice(startIndex, endIndex);
    }

    res.status(200).json({
      success: true,
      total: data.length,
      count: paginatedData.length,
      data: paginatedData,
    });
  } catch (err) {
    next(err);
  }
};