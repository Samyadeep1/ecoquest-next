
import connect from "../../../../utils/mongoose";
import User from "../../../../models/User";
export default async function handler(req,res){
  await connect();
  const {userId,typeName} = req.query;
  const user = await User.findById(userId);
  if(!user) return res.status(404).json({ok:false});
  res.json({recipient:user.name,org:user.org,type:typeName,date:new Date().toISOString()});
}
