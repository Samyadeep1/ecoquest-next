import mongoose from "mongoose";
const CompetitionSchema = new mongoose.Schema({
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  type:String, title:String, filename:String, mimetype:String, created_at:{type:Date,default:Date.now}
});
export default mongoose.models.Competition || mongoose.model("Competition",CompetitionSchema);
