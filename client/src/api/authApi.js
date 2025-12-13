import axios from "axios";

const API = "http://localhost:5001";

export const login = (email) =>
  axios.post(`${API}/login`, { email });
