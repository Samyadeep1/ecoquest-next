
import connect from "../../../utils/mongoose";
import User from "../../../models/User";
import { decodeAccessToken } from "../_helpers/auth";
export default async function handler(req,res){
  await connect();
  if(req.method!=="POST") return res.status(405).json({ok:false});
  const answers = req.body.answers || {};
  const KEY = {"0":0,"1":0,"2":1,"3":2,"4":1};
  let correct=0;
  for(const [k,v] of Object.entries(answers)) if(KEY[k]===v) correct++;
  const score = Math.round((correct/Object.keys(KEY).length)*100);
  const token = (req.headers.authorization||"").split(" ")[1];
  const payload = decodeAccessToken(token);
  if(payload){
    const user = await User.findOne({email:payload.sub});
    if(user && score>=60){ user.points = (user.points||0)+150; await user.save(); }
  }
  res.json({score,correct,total:Object.keys(KEY).length});
}
