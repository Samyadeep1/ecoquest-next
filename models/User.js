import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  org:{type:String,default:""},
  role:{type:String,default:"Student"},
  hashed_password:{type:String,required:true},
  points:{type:Number,default:0},
  badges:{type:Number,default:0},
  created_at:{type:Date,default:Date.now}
});
export default mongoose.models.User || mongoose.model("User",UserSchema);
