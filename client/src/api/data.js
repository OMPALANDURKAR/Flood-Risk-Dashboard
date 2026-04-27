const BASE_URL = "http://localhost:5000/api";

export const getFloodData = async (query = "") => {
  const res = await fetch(`${BASE_URL}/data${query}`);
  return res.json();
};

export const getAnalytics = async () => {
  const res = await fetch(`${BASE_URL}/analytics/district`);
  return res.json();
};