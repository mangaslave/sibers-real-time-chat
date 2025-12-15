import axios from "axios";

const API = "http://localhost:5001";

export const api = (token) =>
  axios.create({
    baseURL: API,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
