import { getUserByEmail } from "../services/usersService.js";

export const auth = (req, res, next) => {
  
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  
  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.slice(7) 
    : authHeader;
  
  try {
    const email = Buffer.from(token, "base64").toString("ascii");
    
    const user = getUserByEmail(email);
    
    if (!user) return res.status(401).json({ message: "Invalid token" });
    
    req.user = user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token format" });
  }
};