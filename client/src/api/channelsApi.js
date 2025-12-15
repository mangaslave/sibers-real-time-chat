import axios from "axios";

const API = "http://localhost:5001";

export const fetchChannels = (token) => {
  return axios.get(`${API}/channels`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const createChannel = (token, name) => {
  return axios.post(
    `${API}/channels`,
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
  
export const fetchChannelById = (token, channelId) => {
  return axios.get(`${API}/channels/${channelId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
  
export const joinChannel = (token, channelId, email) => {
  return axios.post(
    `${API}/channels/${channelId}/join`,
    { email },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const fetchChannelMessages = (token, channelId) => {
  return axios.get(`${API}/channels/${channelId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};