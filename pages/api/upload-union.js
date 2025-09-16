
import connect from "../../utils/mongoose";
import UnionDoc from "../../models/UnionDoc";
import formidable from "formidable";
import fs from "fs";
import path from "path";
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
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if(err) return res.status(500).json({ok:false});
    const role = fields.role||""; const title = fields.title||"";
    const fileObj = files.file || Object.values(files)[0];
    const filename = await saveFile(fileObj);
    const doc = new UnionDoc({role,title,filename,mimetype:fileObj.mimetype||"application/octet-stream"});
    await doc.save();
    res.json({ok:true,doc_id:doc._id,file_url:`/uploads/${filename}`});
  });
}
