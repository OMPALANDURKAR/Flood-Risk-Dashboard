// server/scripts/convertCsv.js

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// File Paths
const csvFilePath = path.join(__dirname, '../data/raw/dataset.csv');
const jsonFilePath = path.join(__dirname, '../data/flood_data.json');

const results = [];

fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        results.push({
            latitude: Number(row['Latitude']) || 0,
            longitude: Number(row['Longitude']) || 0,
            rainfall_mm: Number(row['Rainfall (mm)']) || 0,
            water_level: Number(row['Water Level (m)']) || 0,
            river_discharge: Number(row['River Discharge (m³/s)']) || 0,
            temperature: Number(row['Temperature (°C)']) || 0,
            humidity: Number(row['Humidity (%)']) || 0,
            elevation: Number(row['Elevation (m)']) || 0,
            land_cover: row['Land Cover'] || 'Unknown',
            soil_type: row['Soil Type'] || 'Unknown',
            population_density: Number(row['Population Density']) || 0,
            infrastructure: Number(row['Infrastructure']) || 0,
            historical_floods: Number(row['Historical Floods']) || 0,
            flood_occurred: Number(row['Flood Occurred']) || 0
        });
    })
    .on('end', () => {
        try {
            fs.writeFileSync(jsonFilePath, JSON.stringify(results, null, 2));
            console.log('✅ CSV converted successfully based on dataset structure');
        } catch (error) {
            console.error('❌ Error writing JSON:', error);
        }
    })
    .on('error', (error) => {
        console.error('❌ Error reading CSV:', error);
    });