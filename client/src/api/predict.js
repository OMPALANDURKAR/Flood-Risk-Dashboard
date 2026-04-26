import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const predictFlood = async (input) => {
  const res = await API.post('/predict', input);
  return res.data;
};