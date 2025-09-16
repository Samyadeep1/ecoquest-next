import mongoose from "mongoose";
const ChallengeSchema = new mongoose.Schema({
  key:{type:String,unique:true}, pts:{type:Number,default:0}, img:String, desc:String
});
export default mongoose.models.Challenge || mongoose.model("Challenge",ChallengeSchema);
