import { loadUsers, getAllUsers } from "../services/usersService.js";
import sanitizeUser from "../utils/sanitizeUser.js";

export async function getUsers(req, res) {
  await loadUsers();

  const search = req.query.search?.toLowerCase() || "";
  const filtered = getAllUsers(search).map(sanitizeUser);
  
  res.json(filtered);
}
