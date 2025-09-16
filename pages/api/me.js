// pages/api/me.js
import connect from "../../utils/mongoose";
import User from "../../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return res.status(401).json({ message: "Missing Authorization header" });

  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ message: "Invalid Authorization format" });

  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    await connect();
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    delete user.hashed_password;
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
}
