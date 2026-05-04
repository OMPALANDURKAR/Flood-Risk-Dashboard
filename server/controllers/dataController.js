const fs = require('fs');
const path = require('path');

const dataPath = path.join(
  __dirname,
  '../data/processed/flood_data_with_district.json'
);

// Load once (⚡ performance)
let cachedData = [];

try {
  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  cachedData = JSON.parse(fileContent);
} catch (err) {
  console.error('❌ Failed to load dataset');
}

exports.getAllData = (req, res, next) => {
  try {
    let data = [...cachedData];

    // =======================
    // FILTER BY DISTRICT
    // =======================
    const { district } = req.query;

    if (district) {
      data = data.filter(
        (item) =>
          item.district &&
          item.district.toLowerCase() === district.toLowerCase()
      );
    }

    // =======================
    // PAGINATION
    // =======================
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10000;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedData = data.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      total: data.length,
      page,
      limit,
      count: paginatedData.length,
      data: paginatedData
    });

  } catch (err) {
    next(err);
  }
};