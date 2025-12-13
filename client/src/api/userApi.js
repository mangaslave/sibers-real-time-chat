import axios from "axios";

const API = "http://localhost:5001";

export const fetchUsers = (token) =>
  axios.get(`${API}/users`, {
    headers: { Authorization: token },
  });
