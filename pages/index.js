// pages/index.js
import { useEffect, useState, useRef } from "react";
import Router from "next/router";

export default function Home() {
  const [time, setTime] = useState("");
  const [modelLoaded, setModelLoaded] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const imgRef = useRef();

  // clock
  useEffect(() => {
    setTime(new Date().toUTCString());
    const t = setInterval(() => setTime(new Date().toUTCString()), 1000);
    return () => clearInterval(t);
  }, []);

  // mobilenet load
  useEffect(() => {
    let mounted = true;
    import("@tensorflow-models/mobilenet").then(async (mod) => {
      const tf = await import("@tensorflow/tfjs");
      await tf.ready();
      const model = await mod.load();
      if (!mounted) return;
      window.__mobilenet = model;
      setModelLoaded(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // helper to classify
  async function classifyImage() {
    if (!window.__mobilenet || !imgRef.current) return alert("Model or image missing");
    const res = await window.__mobilenet.classify(imgRef.current);
    alert("Top prediction: " + (res[0]?.className || "none") + " — confidence " + (res[0]?.probability?.toFixed(2) || "0"));
  }

  // register
  async function handleRegister(e) {
    e?.preventDefault?.();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const age = document.getElementById("regAge").value;
    const grade = document.getElementById("regClass").value;
    const organization = document.getElementById("regOrg").value;

    if (!name || !email || !password) return alert("Please fill required fields");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, age, grade, organization }),
      });
      const j = await res.json();
      console.log("Register:", j);
      if (res.ok) {
        localStorage.setItem("token", j.token);
        localStorage.setItem("user", JSON.stringify(j.user));
        alert("Registered & logged in");
        Router.push("/profile");
      } else {
        alert("Register error: " + (j.message || j.error || "failed"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  }

  // login
  async function handleLogin(e) {
    e?.preventDefault?.();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    if (!email || !password) return alert("Please enter both");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const j = await res.json();
      console.log("Login:", j);
      if (res.ok) {
        localStorage.setItem("token", j.token);
        localStorage.setItem("user", JSON.stringify(j.user));
        alert("Logged in");
        Router.push("/profile");
      } else {
        alert("Login failed: " + (j.message || j.error || "unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  }

  // ask AI
  async function askAI() {
    if (!chatInput) return;
    setChatMessages(s => [...s, { role: "user", text: chatInput }]);
    setChatInput("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: chatInput }),
      });
      const j = await res.json();
      const reply = j?.choices?.[0]?.message?.content || JSON.stringify(j);
      setChatMessages(s => [...s, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error(err);
      setChatMessages(s => [...s, { role: "assistant", text: "AI error" }]);
    }
  }

  // leaderboard
  async function fetchLeaderboard() {
    try {
      const r = await fetch("/api/leaderboard");
      const j = await r.json();
      console.log("Leaderboard:", j);
      alert("Top: " + (j[0]?.name || "n/a") + " — " + (j[0]?.points || 0) + " pts");
    } catch (err) {
      console.error(err);
      alert("Leaderboard error");
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "Poppins,Segoe UI,Arial" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ fontSize: 28, color: "#16a34a" }}>EcoQuest</div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Current UTC Time</div>
          <div style={{ fontWeight: 700 }}>{time}</div>
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 16 }}>
        <div>
          {/* Register */}
          <div style={{ background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 8px 30px rgba(2,6,23,0.06)" }}>
            <h3>Register (student)</h3>
            <form onSubmit={handleRegister} style={{ display: "grid", gap: 8 }}>
              <input id="regName" placeholder="Full name" />
              <input id="regEmail" placeholder="Email" />
              <input id="regPassword" type="password" placeholder="Password" />
              <input id="regAge" type="number" placeholder="Age" />
              <input id="regClass" placeholder="Class / Grade" />
              <input id="regOrg" placeholder="School / Organization" />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" style={{ padding: 8 }}>Sign Up</button>
                <button type="button" onClick={() => {
                  const name = document.getElementById("regName").value || "Guest";
                  const em = name.toLowerCase().replace(/\s+/g, "") + "@example.com";
                  document.getElementById("regEmail").value = em;
                  document.getElementById("regPassword").value = "test123";
                  handleRegister();
                }}>Quick Sign</button>
              </div>
            </form>
          </div>

          {/* Login */}
          <div style={{ marginTop: 12, background: "#fff", padding: 16, borderRadius: 12 }}>
            <h3>Login</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <input id="loginEmail" placeholder="Email" />
              <input id="loginPassword" type="password" placeholder="Password" />
              <button onClick={handleLogin} style={{ padding: 8 }}>Login</button>
            </div>
          </div>

          {/* Image ML */}
          <div style={{ marginTop: 12, background: "#fff", padding: 16, borderRadius: 12 }}>
            <h3>Image ML Demo (browser)</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files[0]; if (!f) return;
                const url = URL.createObjectURL(f); imgRef.current.src = url;
              }} />
              <button onClick={classifyImage} disabled={!modelLoaded} style={{ padding: 8 }}>
                { modelLoaded ? "Classify" : "Loading..." }
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <img ref={imgRef} alt="preview" style={{ maxWidth: 480, borderRadius: 8 }} />
            </div>
          </div>
        </div>

        <aside>
          <div style={{ background: "#fff", padding: 16, borderRadius: 12, marginBottom: 12 }}>
            <h3>AI Assistant</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask EcoQuest AI..." />
              <button onClick={askAI}>Ask</button>
            </div>
            <div style={{ marginTop: 12, maxHeight: 320, overflow: "auto" }}>
              {chatMessages.map((m, i) => (
                <div key={i} style={{ marginBottom: 8, background: m.role === "user" ? "#f1f5f9" : "#ecfeff", padding: 8, borderRadius: 6 }}>
                  <b style={{ display: "block", fontSize: 12 }}>{m.role}</b>
                  <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", padding: 16, borderRadius: 12 }}>
            <h3>Quick Leaderboard</h3>
            <button onClick={fetchLeaderboard} style={{ padding: 8 }}>Fetch Top 10</button>
          </div>
        </aside>
      </section>
    </div>
  );
}
