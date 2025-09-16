
import connect from "../../utils/mongoose";
import Submission from "../../models/Submission";
import User from "../../models/User";
import Challenge from "../../models/Challenge";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { decodeAccessToken } from "./_helpers/auth";
export const config = { api: { bodyParser: false } };
async function saveFile(file){
  const uploadDir = path.join(process.cwd(),"/uploads");
  if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
  const data = fs.readFileSync(file.filepath);
  const filename = `${Date.now()}_${file.originalFilename}`;
  fs.writeFileSync(path.join(uploadDir,filename),data);
  return filename;
}
export default async function handler(req,res){
  await connect();
  if(req.method!=="POST") return res.status(405).json({ok:false});
  const token = (req.headers.authorization||"").split(" ")[1];
  const payload = decodeAccessToken(token);
  if(!payload) return res.status(401).json({ok:false});
  const user = await User.findOne({email:payload.sub});
  if(!user) return res.status(401).json({ok:false});
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if(err) return res.status(500).json({ok:false});
    const category = fields.category || "";
    const notes = fields.notes || "";
    const fileObj = files.file || Object.values(files)[0];
    const filename = await saveFile(fileObj);
    const ch = await Challenge.findOne({key:category});
    const pts = ch ? ch.pts : 0;
    const sub = new Submission({user_id:user._id,category,notes,filename,mimetype:fileObj.mimetype||"application/octet-stream",pts});
    await sub.save();
    user.points = (user.points||0)+pts; await user.save();
    res.json({ok:true,points_awarded:pts,submission_id:sub._id,file_url:`/uploads/${filename}`});
  });
}
