const floodService = require('../services/floodService');

exports.getFloodData = (req, res) => {
    try {
        const data = floodService.getAllDistrictData();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error reading JSON data" });
    }
};

exports.getDashboardAnalytics = (req, res) => {
    try {
        const stats = floodService.getAnalytics();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error generating analytics" });
    }
};