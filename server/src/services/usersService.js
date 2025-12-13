import axios from "axios";
import config from "../config.js";

let usersCache = [];

// Load users from remote API
export const loadUsers = async () => {
  const response = await axios.get(config.USERS_URL);
  usersCache = response.data;
  return usersCache;
};

export const getAllUsers = () => usersCache;

export const getUserByEmail = (email) =>
  usersCache.find((u) => u.email === email);

export const addUser = (user) => {
  usersCache.push(user);
  return user;
};

export const deleteUser = (id) => {
  const index = usersCache.findIndex((u) => u.id == id);
  if (index !== -1) {
    return usersCache.splice(index, 1)[0];
  }
  return null;
};
