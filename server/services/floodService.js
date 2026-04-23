const fs = require('fs');
const path = require('path');
const { calculateRisk } = require('../utils/riskCalculator');

const dataPath = path.join(__dirname, '../data/flood_data.json');

const getRawData = () => {
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
};

exports.getAllDistrictData = () => {
    const data = getRawData();
    return data.map(district => ({
        ...district,
        riskLevel: calculateRisk(district.rainfall_mm)
    }));
};

exports.getAnalytics = () => {
    const data = this.getAllDistrictData();
    const analytics = { activeHigh: 0, activeMedium: 0, activeLow: 0 };
    
    data.forEach(d => {
        if (d.riskLevel === 'High') analytics.activeHigh++;
        else if (d.riskLevel === 'Medium') analytics.activeMedium++;
        else analytics.activeLow++;
    });
    
    return analytics;
};