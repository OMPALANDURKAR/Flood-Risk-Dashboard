const predictionService = require('../services/predictionService');

// ================================
// POST /api/predict
// ================================
exports.predictFloodRisk = async (req, res, next) => {
  try {
    const {
      rainfall,
      waterLevel,
      discharge,
      soil,
      land,
      elevation,
      humidity,
      history,
      populationDensity,
      infrastructure
    } = req.body;

    // ===== VALIDATION =====
    if (
      rainfall == null ||
      waterLevel == null ||
      discharge == null ||
      soil == null ||
      land == null ||
      elevation == null ||
      humidity == null ||
      history == null
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required input parameters'
      });
    }

    // ===== CALL SERVICE =====
    const result = await predictionService.predict({
      rainfall,
      waterLevel,
      discharge,
      soil,
      land,
      elevation,
      humidity,
      history,
      populationDensity,
      infrastructure
    });

    // ===== RESPONSE =====
    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Error in predictFloodRisk:', error);
    next(error);
  }
};