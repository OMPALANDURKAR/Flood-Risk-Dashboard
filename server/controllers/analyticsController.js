const fs = require('fs');
const path = require('path');

const dataPath = path.join(
  __dirname,
  '../data/processed/flood_data_with_district.json'
);

let cachedData = [];

try {
  cachedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
} catch (err) {
  console.error('Failed to load dataset');
}

exports.getDistrictAnalytics = (req, res) => {
  const stats = {};

  for (const item of cachedData) {
    if (!item.district) continue;

    if (!stats[item.district]) {
      stats[item.district] = {
        total: 0,
        floods: 0
      };
    }

    stats[item.district].total++;

    if (item.flood_occurred === 1) {
      stats[item.district].floods++;
    }
  }

  res.json({
    success: true,
    data: stats
  });
};