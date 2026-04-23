exports.calculateRisk = (rainfall) => {
    if (rainfall > 300) return 'High';
    if (rainfall >= 150) return 'Medium';
    return 'Low';
};