import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  sanitizeUser
} from "../models/User.model.js";
import { generateToken } from "../utils/generateToken.js";

export async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      role,
      organisationName,
      city,
      genres,
      venueTypes
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      role,
      organisationName: organisationName || "",
      profile: {
        city: city || "",
        genres: role === "artist" ? genres || [] : [],
        venueTypes: role === "organiser" ? venueTypes || [] : []
      },
      verification: {
        status: "pending"
      }
    });

    return res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user.id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      token: generateToken(user.id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getMe(req, res) {
  return res.json(sanitizeUser(req.user));
}
