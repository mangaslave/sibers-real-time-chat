import axios from "axios";

const API = "http://localhost:5001";

export const fetchChannels = (token) =>
  axios.get(`${API}/channels`, {
    headers: { Authorization: token },
  });

export const createChannel = (token, name) =>
  axios.post(
    `${API}/channels`,
    { name },
    { headers: { Authorization: token } }
  );
