
import { useEffect, useState, useRef } from "react";

export default function Home(){
  const [time, setTime] = useState(new Date().toUTCString());
  const [user, setUser] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(()=>{
    const t = setInterval(()=>setTime(new Date().toUTCString()),1000);
    return ()=>clearInterval(t);
  },[]);

  // load mobileNet
  useEffect(()=>{
    let mounted=true;
    import("@tensorflow-models/mobilenet").then(async (mod)=>{
      const tf = await import("@tensorflow/tfjs");
      await tf.ready();
      const model = await mod.load();
      if(!mounted) return;
      window.__mobilenet = model;
      setModelLoaded(true);
    });
    return ()=>{ mounted=false; };
  },[]);

  async function classifyImage(){
    if(!window.__mobilenet || !imgRef.current) return alert("Model or image missing");
    const res = await window.__mobilenet.classify(imgRef.current);
    alert("Top prediction: "+(res[0]?.className||"none")+" — confidence "+(res[0]?.probability?.toFixed(2)||"0"));
  }

  async function askAI(){
    if(!chatInput) return;
    setChatMessages(s=>[...s,{role:"user",text:chatInput}]);
    setChatInput("");
    const res = await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:chatInput})});
    const j = await res.json();
    const reply = j?.choices?.[0]?.message?.content || JSON.stringify(j);
    setChatMessages(s=>[...s,{role:"assistant",text:reply}]);
  }

  return (
    <div style={{padding:24,fontFamily:"Poppins,Segoe UI,Arial"}}>
      <header style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
        <div style={{fontSize:28,color:"#16a34a"}}>EcoQuest</div>
        <div style={{marginLeft:"auto",textAlign:"right"}}>
          <div style={{fontSize:12,color:"#6b7280"}}>Current UTC Time</div>
          <div style={{fontWeight:700}}>{time}</div>
        </div>
      </header>

      <section style={{display:"grid",gridTemplateColumns:"1fr 420px",gap:16}}>
        <div>
          <div style={{background:"#fff",padding:16,borderRadius:12,boxShadow:"0 8px 30px rgba(2,6,23,0.06)"}}>
            <h2>Actions & Challenges</h2>
            <p>Upload photos/videos, take quizzes, and earn points. This frontend speaks to the API endpoints provided in /pages/api/*.js</p>
            <div style={{marginTop:12,display:"flex",gap:8}}>
              <input placeholder="Name" id="name" style={{padding:10,borderRadius:8,border:"1px solid #e5e7eb"}}/>
              <button className="btn" onClick={()=>{
                const name=document.getElementById("name").value||"Guest";
                setUser({name,email:null,points:0});
                alert("Temporarily signed in as "+name);
              }}>Quick Sign</button>
            </div>
          </div>

          <div style={{marginTop:12,background:"#fff",padding:16,borderRadius:12}}>
            <h3>Image ML Demo (Browser)</h3>
            <p className="small">You can drop an image to preview and classify with MobileNet in-browser (no server).</p>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input type="file" accept="image/*" onChange={(e)=>{
                const f=e.target.files[0];
                if(!f) return;
                const url=URL.createObjectURL(f);
                const img=imgRef.current;
                img.src=url;
              }}/>
              <button onClick={classifyImage} disabled={!modelLoaded} style={{padding:10,borderRadius:8,background:modelLoaded?"#16a34a":"#94a3b8",color:"#fff"}}>{modelLoaded?"Classify":"Loading model..."}</button>
            </div>
            <div style={{marginTop:12}}>
              <img ref={imgRef} alt="preview" style={{maxWidth:480,borderRadius:10}} />
            </div>
          </div>
        </div>

        <aside>
          <div style={{background:"#fff",padding:16,borderRadius:12,marginBottom:12}}>
            <h3>AI Assistant (optional)</h3>
            <p className="small">Ask for challenge ideas, learning tips, or generate certificate text. Requires OPENAI_API_KEY in environment for server proxy.</p>
            <div style={{display:"flex",gap:8}}>
              <input value={chatInput} onChange={(e)=>setChatInput(e.target.value)} placeholder="Ask EcoQuest AI..." style={{flex:1,padding:10,borderRadius:8,border:"1px solid #e5e7eb"}}/>
              <button onClick={askAI} style={{padding:10,borderRadius:8,background:"#2563eb",color:"#fff"}}>Ask</button>
            </div>
            <div style={{marginTop:12,maxHeight:320,overflow:"auto"}}>
              {chatMessages.map((m,i)=>(
                <div key={i} style={{marginBottom:8, background: m.role==="user"?"#f1f5f9":"#ecfeff", padding:10,borderRadius:8}}>
                  <b style={{display:"block",fontSize:12}}>{m.role}</b>
                  <div style={{whiteSpace:"pre-wrap"}}>{m.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:"#fff",padding:16,borderRadius:12}}>
            <h3>Quick Leaderboard</h3>
            <button onClick={async ()=>{
              const r = await fetch("/api/leaderboard");
              const j = await r.json();
              alert("Top: "+(j[0]?.name||"n/a")+" — "+(j[0]?.points||0)+" pts");
            }} style={{padding:10,borderRadius:8,background:"#16a34a",color:"#fff"}}>Fetch Top 10</button>
            <div style={{marginTop:12,fontSize:13,color:"#6b7280"}}>This panel is a playground to call the API endpoints (register/login/upload/leaderboard etc.).</div>
          </div>
        </aside>
      </section>

      <footer style={{marginTop:20,textAlign:"center",color:"#94a3b8"}}>EcoQuest — demo frontend with ML & AI assistant (client-side TF.js + server AI proxy)</footer>
    </div>
  );
}
