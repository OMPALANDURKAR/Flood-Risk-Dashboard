const BASE_URL = "http://localhost:5000/api";

// ✅ SAFE FETCH WRAPPER
const safeFetch = async (url) => {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error("API Error:", res.status, res.statusText);
      return { data: [] };
    }

    const data = await res.json();

    // Ensure consistent shape
    return data || { data: [] };
  } catch (err) {
    console.error("Fetch failed:", err);
    return { data: [] };
  }
};

// ✅ FLOOD DATA
export const getFloodData = async (query = "") => {
  return safeFetch(`${BASE_URL}/data${query}`);
};

// ✅ ANALYTICS
export const getAnalytics = async () => {
  return safeFetch(`${BASE_URL}/analytics/district`);
};