
import connect from "../../utils/mongoose";
import User from "../../models/User";
export default async function handler(req,res){
  await connect();
  await connect();
  const top = await User.find().sort({points:-1}).limit(10);
  res.json(top.map(u=>({name:u.name,org:u.org,points:u.points})));
}
