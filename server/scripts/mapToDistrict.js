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

// 🔥 Precompute bounding boxes (BIG OPTIMIZATION)
const districts = geoData.features.map((feature) => {
  return {
    feature,
    bbox: turf.bbox(feature) // [minX, minY, maxX, maxY]
  };
});

// Faster lookup
const getDistrict = (lat, lon) => {
  const point = turf.point([lon, lat]);

  for (const d of districts) {
    const [minX, minY, maxX, maxY] = d.bbox;

    // ⚡ Skip most polygons quickly
    if (lon < minX || lon > maxX || lat < minY || lat > maxY) continue;

    if (turf.booleanPointInPolygon(point, d.feature)) {
      return {
        district: d.feature.properties.district || d.feature.properties.DISTRICT || null,
        state: d.feature.properties.state || d.feature.properties.STATE || null
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