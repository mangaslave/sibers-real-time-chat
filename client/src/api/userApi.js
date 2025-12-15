import axios from "axios";

const API = "http://localhost:5001";

// Fetch all users data
export const fetchUsers = (token) =>
  axios.get(`${API}/users`, {
    headers: { Authorization: token },
  });
