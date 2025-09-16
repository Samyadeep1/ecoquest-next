import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  grade: { type: String },
  organization: { type: String },
  points: { type: Number, default: 0 },
  badges: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
