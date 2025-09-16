// pages/api/leaderboard.js
import connect from "../../utils/mongoose";
import User from "../../models/User";

export default async function handler(req, res) {
  await connect();
  const users = await User.find({}, { hashed_password: 0 }).sort({ points: -1 }).limit(10).lean();
  res.status(200).json(users);
}
