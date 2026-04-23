exports.calculateRisk = (rainfall) => {
    // Ensure valid numeric input
    const rain = Number(rainfall);

    if (isNaN(rain) || rain < 0) {
        return 'Low'; // fallback safety
    }

    if (rain > 300) return 'High';
    if (rain >= 150) return 'Medium';
    return 'Low';
};