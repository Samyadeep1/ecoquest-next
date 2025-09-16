import mongoose from "mongoose";
const UnionDocSchema = new mongoose.Schema({
  role:String, title:String, filename:String, mimetype:String, created_at:{type:Date,default:Date.now}
});
export default mongoose.models.UnionDoc || mongoose.model("UnionDoc",UnionDocSchema);
