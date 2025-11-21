import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  // ✔ Correct settings for localhost development
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,          // ❗ must be false on localhost
    sameSite: "lax",        // ❗ allows cross-site localhost requests
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",              // ✔ ensure cookie works on all routes
  });

  return token;
};
