
import connect from "../../utils/mongoose";
import UnionDoc from "../../models/UnionDoc";
export default async function handler(req,res){
  await connect();
  const docs = await UnionDoc.find().sort({created_at:-1}).limit(100);
  res.json(docs.map(d=>({role:d.role,title:d.title,file_url:`/uploads/${d.filename}`,date:d.created_at})));
}
