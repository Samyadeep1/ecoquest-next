
import connect from "../../utils/mongoose";
import Resource from "../../models/Resource";
export default async function handler(req,res){
  await connect();
  if(req.method==="GET"){ const items=await Resource.find().sort({created_at:-1}); return res.json(items); }
  else if(req.method==="POST"){ const {typ,title,url}=req.body; if(!typ||!title||!url) return res.status(400).json({ok:false}); const r=new Resource({typ,title,url}); await r.save(); return res.status(201).json({ok:true,resource:r}); }
  else return res.status(405).json({ok:false});
}
