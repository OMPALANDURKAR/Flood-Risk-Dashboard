module.exports = (req, res, next) => {
  const { rainfall, riverLevel, soilMoisture } = req.body;

  // Check missing fields
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

  // Check data types
  if (
    typeof rainfall !== 'number' ||
    typeof riverLevel !== 'number' ||
    typeof soilMoisture !== 'number'
  ) {
    return res.status(400).json({
      success: false,
      message: 'All fields must be numbers'
    });
  }

  // Optional: range validation
  if (
    rainfall < 0 ||
    riverLevel < 0 ||
    soilMoisture < 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'Values must be non-negative'
    });
  }

  next();
};