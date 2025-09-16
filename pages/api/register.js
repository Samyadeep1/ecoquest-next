
import connect from "../../utils/mongoose";
import User from "../../models/User";
import { hashPassword, createAccessToken } from "./_helpers/auth";
export default async function handler(req,res){
  await connect();
  if(req.method!=="POST") return res.status(405).json({ok:false});
  const {name,email,org="",role="Student",password} = req.body;
  if(!name||!email||!password) return res.status(400).json({ok:false,message:"Missing fields"});
  const existing = await User.findOne({email});
  if(existing) return res.status(400).json({ok:false,message:"Email already registered"});
  const user = new User({name,email,org,role,hashed_password:hashPassword(password)});
  await user.save();
  const token = createAccessToken(user.email);
  res.status(201).json({access_token:token,token_type:"bearer"});
}
