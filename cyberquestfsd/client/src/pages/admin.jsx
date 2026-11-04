import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Users, BookOpen, Trophy, Trash2, LogOut } from "lucide-react";

function Admin() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const token = localStorage.getItem("token");
  async function load() {
    const response = await fetch("http://localhost:5000/api/admin/overview", { headers:{Authorization:`Bearer ${token}`} });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Could not load admin information");
    setData(result);
  }
  useEffect(() => { if (!token) { navigate("/login"); return; } load().catch(e=>setError(e.message)); }, [token, navigate]);
  async function removeUser(id) {
    if (!window.confirm("Delete this user account and their saved progress?")) return;
    setBusyId(id); setError("");
    try { const r = await fetch(`http://localhost:5000/api/admin/users/${id}`, {method:"DELETE",headers:{Authorization:`Bearer ${token}`}}); const d=await r.json(); if(!r.ok) throw new Error(d.message || "Could not delete user"); await load(); }
    catch(e){setError(e.message);} finally{setBusyId("");}
  }
  function logout(){localStorage.removeItem("token");localStorage.removeItem("user");navigate("/");}
  return <div className="extra-page"><nav className="extra-nav"><div className="logo"><Shield size={27}/>CyberQuest Admin</div><div className="extra-nav-actions"><button className="learn-back" onClick={()=>navigate("/")}><ArrowLeft size={16}/> Home</button><button className="learn-back" onClick={logout}><LogOut size={16}/> Logout</button></div></nav><main className="extra-main"><div className="extra-heading"><span>ADMINISTRATION</span><h1>Admin Panel</h1><p>Review registered users and platform learning activity.</p></div>{error && <p className="error-note">{error}</p>}{!data ? <p>Loading admin information...</p> : <><div className="extra-stats"><article><Users/><strong>{data.totalUsers}</strong><span>Registered users</span></article><article><BookOpen/><strong>{data.totalLessonsCompleted}</strong><span>Lessons completed</span></article><article><Trophy/><strong>{data.totalQuizAttempts}</strong><span>Quiz attempts</span></article></div><section className="extra-panel"><h2>Registered users</h2><p className="notice-note">Deleting a user also deletes their saved progress. Your own administrator account cannot be deleted here.</p><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Action</th></tr></thead><tbody>{data.users.map(user=><tr key={user._id}><td>{user.name}</td><td>{user.email}</td><td>{new Date(user.createdAt).toLocaleDateString()}</td><td>{user.isAdmin ? <span className="completed-label">Administrator</span> : <button className="delete-btn" disabled={busyId===user._id} onClick={()=>removeUser(user._id)}><Trash2 size={15}/> {busyId===user._id ? "Deleting" : "Delete"}</button>}</td></tr>)}</tbody></table></div></section><section className="extra-panel"><h2>Learning content overview</h2><p>CyberQuest currently provides six built-in lessons and cybersecurity quiz questions across phishing, suspicious links, password security, malware, social engineering and web security.</p><button className="secondary-btn" onClick={()=>navigate("/learn")}>View learning hub</button></section></>}</main></div>;
}
export default Admin;
