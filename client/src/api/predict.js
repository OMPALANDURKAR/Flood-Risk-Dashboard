import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔥 PREDICT FUNCTION (FINAL)
export const predictFlood = async (input) => {
  try {
    const res = await API.post("/predict", input);

    // always return clean data
    return res.data;
  } catch (err) {
    console.error("Prediction API Error:", err);

    return {
      success: false,
      message: "Prediction failed",
    };
  }
};