import { getUserByEmail } from "../services/usersService.js";

export const login = (req, res) => {
  const { email } = req.body;

  const user = getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = Buffer.from(email).toString("base64");

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
};
