import mongoose from "mongoose";
const SubmissionSchema = new mongoose.Schema({
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  category:String, notes:String, filename:String, mimetype:String, pts:Number, created_at:{type:Date,default:Date.now}
});
export default mongoose.models.Submission || mongoose.model("Submission",SubmissionSchema);
