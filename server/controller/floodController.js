const floodService = require('../services/floodService');

// GET /api/floods
exports.getFloodData = async (req, res, next) => {
    try {
        const data = await floodService.getAllDistrictData();

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        console.error('Error in getFloodData:', error);
        next(error); // pass to global error handler
    }
};

// GET /api/floods/analytics
exports.getDashboardAnalytics = async (req, res, next) => {
    try {
        const stats = await floodService.getAnalytics();

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Error in getDashboardAnalytics:', error);
        next(error); // pass to global error handler
    }
};