const fs = require('fs');
const path = require('path');
const axios = require('axios');

const inputPath = path.join(__dirname, '../data/processed/flood_data.json');
const outputPath = path.join(__dirname, '../data/processed/flood_data_with_location.json');
const cachePath = path.join(__dirname, '../data/processed/geocode_cache.json');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// =======================
// LOAD CACHE
// =======================
let cache = {};
if (fs.existsSync(cachePath)) {
  cache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
}

// =======================
// GEOCODER WITH CACHE
// =======================
const getLocation = async (lat, lon) => {
  const key = `${lat},${lon}`;

  if (cache[key]) return cache[key];

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    const res = await axios.get(url, {
      headers: { 'User-Agent': 'FloodSentry-App' }
    });

    const addr = res.data.address;

    const location = {
      city: addr.city || addr.town || addr.village || null,
      state: addr.state || null,
      country: addr.country || null
    };

    cache[key] = location;

    return location;

  } catch (err) {
    console.error('Error:', lat, lon);
    return null;
  }
};

// =======================
// MAIN
// =======================
const run = async () => {
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  let output = [];

  if (fs.existsSync(outputPath)) {
    output = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
  }

  for (let i = output.length; i < data.length; i++) {
    const item = data[i];

    const location = await getLocation(item.latitude, item.longitude);

    output.push({
      ...item,
      location
    });

    // Save progress every 10 records
    if (i % 10 === 0) {
      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
      console.log(`💾 Saved progress at ${i}`);
    }

    console.log(`Processed ${i + 1}/${data.length}`);

    await delay(1100); // ⚠️ IMPORTANT (rate limit safe)
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));

  console.log('✅ COMPLETED');
};

run();