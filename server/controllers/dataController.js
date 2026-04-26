const fs = require('fs');
const path = require('path');

const dataPath = path.join(
  __dirname,
  '../data/processed/flood_data_with_district.json'
);

exports.getAllData = (req, res, next) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    next(err);
  }
};