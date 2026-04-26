// server/scripts/convertCsv.js

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// ===== PATHS =====
const csvFilePath = path.join(__dirname, '../data/raw/dataset.csv');
const jsonFilePath = path.join(__dirname, '../data/processed/flood_data.json');

// ===== HELPERS =====
const toNumber = (val) => {
  const num = Number(val);
  return isNaN(num) ? null : num;
};

const normalizeString = (val, fallback = 'Unknown') => {
  return val && val.trim() !== '' ? val.trim() : fallback;
};

// ===== STORAGE =====
const results = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    try {
      const record = {
        // 📍 Geo
        latitude: toNumber(row['Latitude']),
        longitude: toNumber(row['Longitude']),

        // 🌧 Core Features
        rainfall_mm: toNumber(row['Rainfall (mm)']),
        water_level: toNumber(row['Water Level (m)']),
        river_discharge: toNumber(row['River Discharge (m³/s)']),
        humidity: toNumber(row['Humidity (%)']),
        elevation: toNumber(row['Elevation (m)']),

        // 🌍 Categorical
        land_cover: normalizeString(row['Land Cover']),
        soil_type: normalizeString(row['Soil Type']),

        // 🏙 Optional
        population_density: toNumber(row['Population Density']) || 0,
        infrastructure: toNumber(row['Infrastructure']) || 0,

        // 📊 Target
        historical_floods: toNumber(row['Historical Floods']) || 0,
        flood_occurred: toNumber(row['Flood Occurred']) || 0,
      };

      // ===== VALIDATION (skip bad rows) =====
      if (
        record.latitude === null ||
        record.longitude === null ||
        record.rainfall_mm === null
      ) {
        return; // skip incomplete rows
      }

      // ===== DERIVED FEATURE (OPTIONAL BUT POWERFUL) =====
      record.risk_score =
        (record.rainfall_mm * 0.25) +
        (record.river_discharge * 0.25) +
        (record.water_level * 0.20) +
        (record.humidity * 0.10) -
        (record.elevation * 0.10) +
        (record.historical_floods * 0.05) +
        (record.infrastructure * 0.05);

      results.push(record);

    } catch (err) {
      console.error('❌ Row processing error:', err.message);
    }
  })

  .on('end', () => {
    try {
      fs.writeFileSync(jsonFilePath, JSON.stringify(results, null, 2));

      console.log('✅ CSV → JSON conversion complete');
      console.log(`📊 Total records processed: ${results.length}`);
      console.log(`📁 Saved to: ${jsonFilePath}`);

    } catch (error) {
      console.error('❌ Error writing JSON:', error);
    }
  })

  .on('error', (error) => {
    console.error('❌ Error reading CSV:', error);
  });