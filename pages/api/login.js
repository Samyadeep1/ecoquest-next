// pages/api/login.js
import connect from "../../utils/mongoose";
import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await connect();

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const ok = await bcrypt.compare(password, user.hashed_password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ sub: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    age: user.age,
    class: user.class,
    org: user.org,
    points: user.points,
    badges: user.badges,
  };

  res.status(200).json({ access_token: token, token_type: "bearer", user: safeUser });
}
