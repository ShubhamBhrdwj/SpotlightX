import jwt from "jsonwebtoken";
import { findUserById, sanitizeUser } from "../models/User.model.js";

export async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = sanitizeUser(await findUserById(decoded.userId));

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next();
  } catch (_error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
}
