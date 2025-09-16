
import connect from "../../utils/mongoose";
import Challenge from "../../models/Challenge";
export default async function handler(req,res){
  await connect();
  if(req.method==="GET"){
    const ch=await Challenge.find();
    if(ch.length===0){
      const defaults=[{key:"Tree Plantation",pts:100,img:"/assets/tree-plantation.png",desc:"Plant 1+ saplings and record it."},{key:"Energy Saving",pts:50,img:"/assets/energy-saving.png",desc:"Turn off lights/fans when unused."},{key:"Poster Making",pts:75,img:"/assets/poster-making.png",desc:"Design awareness posters."},{key:"Water Conservation",pts:60,img:"/assets/water.png",desc:"Reduce water wastage daily."}];
      await Challenge.insertMany(defaults);
      return res.json(await Challenge.find());
    }
    return res.json(ch);
  } else return res.status(405).json({ok:false});
}
