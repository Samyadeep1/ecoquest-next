
import fetch from "node-fetch";
export default async function handler(req,res){
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if(!OPENAI_KEY) return res.status(501).json({ok:false,message:"OpenAI key not configured. See README."});
  if(req.method !== "POST") return res.status(405).json({ok:false});
  const prompt = req.body.prompt || "Hello";
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model:"gpt-4o-mini", messages:[{role:"user",content:prompt}], max_tokens:300 })
  });
  const j = await r.json();
  res.json(j);
}
