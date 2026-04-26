// server/utils/preprocess.js

exports.preprocess = (input) => {
  return {
    rainfall: Number(input.rainfall),
    waterLevel: Number(input.waterLevel),
    discharge: Number(input.discharge),
    elevation: Number(input.elevation),
    humidity: Number(input.humidity),
    history: Number(input.history),

    // Encode Soil
    soil:
      input.soil === 'Clay' ? 3 :
      input.soil === 'Peat' ? 2 :
      input.soil === 'Loam' ? 1 : 0,

    // Encode Land Cover
    land:
      input.land === 'Water Body' ? 3 :
      input.land === 'Urban' ? 2 :
      (input.land === 'Forest' || input.land === 'Agricultural') ? 1 : 0,

    infrastructure: Number(input.infrastructure || 0),
    populationDensity: Number(input.populationDensity || 0)
  };
};