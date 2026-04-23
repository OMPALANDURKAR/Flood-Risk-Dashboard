const fs = require('fs');
const path = require('path');
const { calculateRisk } = require('../utils/riskCalculator');

const dataPath = path.join(__dirname, '../data/flood_data.json');

// Read and parse JSON safely
const getRawData = () => {
    try {
        const rawData = fs.readFileSync(dataPath, 'utf-8'); // FIXED: added encoding
        return JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading flood data file:', error);
        throw new Error('Failed to load flood dataset');
    }
};

// Process district data with risk calculation
const getAllDistrictData = () => {
    const data = getRawData();

    return data.map(district => ({
        ...district,
        rainfall_mm: Number(district.rainfall_mm) || 0, // FIXED: validation
        riskLevel: calculateRisk(Number(district.rainfall_mm) || 0)
    }));
};

// Exported functions
exports.getAllDistrictData = getAllDistrictData;

// Generate analytics summary
exports.getAnalytics = () => {
    const data = getAllDistrictData(); // FIXED: removed `this`

    const analytics = {
        activeHigh: 0,
        activeMedium: 0,
        activeLow: 0
    };

    data.forEach(d => {
        if (d.riskLevel === 'High') analytics.activeHigh++;
        else if (d.riskLevel === 'Medium') analytics.activeMedium++;
        else analytics.activeLow++;
    });

    return analytics;
};