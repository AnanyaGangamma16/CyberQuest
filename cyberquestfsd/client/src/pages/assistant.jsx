import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Bot, Send } from "lucide-react";

function Assistant() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function ask(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    if (!message.trim()) return;
    setBusy(true); setError(""); setReply("");
    try {
      const response = await fetch("http://localhost:5000/api/assistant", { method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`}, body:JSON.stringify({message}) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Assistant request failed");
      setReply(data.reply);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className="extra-page"><nav className="extra-nav"><div className="logo"><Shield size={27}/>CyberQuest</div><button className="learn-back" onClick={() => navigate("/dashboard")}><ArrowLeft size={16}/> Dashboard</button></nav><main className="extra-main"><div className="extra-heading"><span>AI-ASSISTED LEARNING</span><h1><Bot/> Security Assistant</h1><p>Ask cybersecurity questions or paste a suspicious message to understand possible warning signs.</p></div><section className="extra-panel"><form onSubmit={ask}><label htmlFor="assistant-message">Your question or message</label><textarea id="assistant-message" rows="6" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Example: I received a message saying my bank account will be blocked unless I click a link..."/><button className="primary-btn" type="submit" disabled={busy || !message.trim()}>{busy ? "Thinking..." : "Ask assistant"} <Send size={16}/></button></form>{error && <p className="error-note">{error}</p>}{reply && <div className="assistant-reply"><h2>Assistant response</h2><p>{reply}</p></div>}<p className="notice-note">This assistant provides general educational guidance. Do not paste passwords, OTPs, bank details or other private information. It cannot confirm whether a message or link is safe.</p></section></main></div>;
}
export default Assistant;
