
import connect from "../../utils/mongoose";
import User from "../../models/User";
import { verifyPassword, createAccessToken } from "./_helpers/auth";
export default async function handler(req,res){
  await connect();
  if(req.method!=="POST") return res.status(405).json({ok:false});
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user || !verifyPassword(password,user.hashed_password)) return res.status(401).json({ok:false,message:"Invalid credentials"});
  const token = createAccessToken(user.email);
  res.json({access_token:token,token_type:"bearer"});
}
