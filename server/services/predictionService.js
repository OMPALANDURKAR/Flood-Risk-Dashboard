const { preprocess } = require('../utils/preprocess');
const { calculateRiskScore } = require('../utils/riskScore');
const { ruleScore } = require('../utils/ruleEngine');
const { mlPrediction } = require('../utils/predictor');

// ================================
// MAIN PREDICTION FUNCTION
// ================================
exports.getPrediction = async (input) => {
  try {
    // ===== STEP 1: PREPROCESS =====
    const data = preprocess(input);

    // ===== STEP 2: RISK SCORE =====
    const riskScore = calculateRiskScore(data);

    // ===== STEP 3: RULE ENGINE =====
    const { score: rule, factors } = ruleScore(data);

    // ===== STEP 4: ML PREDICTION =====
    const ml = mlPrediction(data);

    // ===== STEP 5: FINAL HYBRID SCORE =====
    const finalScore = (ml * 0.7) + ((rule / 10) * 0.3);

    // ===== STEP 6: CLASSIFICATION =====
    let risk = 'LOW';
    if (finalScore >= 0.6) risk = 'HIGH';
    else if (finalScore >= 0.3) risk = 'MEDIUM';

    // ===== STEP 7: RESPONSE =====
    return {
      risk,
      probability: Number(finalScore.toFixed(2)),
      factors,
      debug: {
        mlScore: Number(ml.toFixed(2)),
        ruleScore: rule,
        calculatedRiskScore: Number(riskScore.toFixed(2))
      }
    };

  } catch (error) {
    console.error('❌ Prediction Service Error:', error);
    throw new Error('Prediction failed');
  }
};