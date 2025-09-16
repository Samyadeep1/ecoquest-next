import mongoose from "mongoose";
const ResourceSchema = new mongoose.Schema({
  typ:String, title:String, url:String, created_at:{type:Date,default:Date.now}
});
export default mongoose.models.Resource || mongoose.model("Resource",ResourceSchema);
