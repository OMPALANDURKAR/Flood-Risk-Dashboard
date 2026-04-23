// server/scripts/convertCsv.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// File Paths
const csvFilePath = path.join(__dirname, '../data/raw/dataset.csv');
const jsonFilePath = path.join(__dirname, '../data/flood_data.json');

const results =