const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

// Paths
const dataPath = path.join(__dirname, '../data/processed/flood_data.json');
const geoPath = path.join(__dirname, '../data/india_districts.geojson');
const outputPath = path.join(__dirname, '../data/processed/flood_data_with_district.json');

// Load data
const floodData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const geoData = JSON.parse(fs.readFileSync(geoPath, 'utf-8'));

// Precompute bounding boxes
const districts = geoData.features.map((feature) => ({
  feature,
  bbox: turf.bbox(feature)
}));

// Get district
const getDistrict = (lat, lon) => {
  const point = turf.point([lon, lat]);

  for (const d of districts) {
    const [minX, minY, maxX, maxY] = d.bbox;

    // Skip quickly using bbox
    if (lon < minX || lon > maxX || lat < minY || lat > maxY) continue;

    if (turf.booleanPointInPolygon(point, d.feature)) {
      return {
        district: d.feature.properties.NAME_2 || null, // ✅ FIXED
        state: d.feature.properties.NAME_1 || null     // ✅ FIXED
      };
    }
  }

  return { district: null, state: null };
};

// Process
const result = [];

for (let i = 0; i < floodData.length; i++) {
  const item = floodData[i];

  const location = getDistrict(item.latitude, item.longitude);

  result.push({
    ...item,
    ...location
  });

  if (i % 100 === 0) {
    console.log(`Processed ${i}/${floodData.length}`);
  }
}

// Save
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log('✅ Done: flood_data_with_district.json created');