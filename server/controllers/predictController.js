const { getPrediction } = require('../services/predictionService');

exports.predictFlood = async (req, res, next) => {
  try {
    const { rainfall, riverLevel, soilMoisture } = req.body;

    if (
      rainfall === undefined ||
      riverLevel === undefined ||
      soilMoisture === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: rainfall, riverLevel, soilMoisture'
      });
    }

    const result = await getPrediction({ rainfall, riverLevel, soilMoisture });

    res.status(200).json({
      success: true,
      input: { rainfall, riverLevel, soilMoisture },
      ...result
    });

  } catch (error) {
    next(error);
  }
};