import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, BookOpen, Trophy, ChartNoAxesColumnIncreasing, Bot, LogOut, ArrowRight } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [progress, setProgress] = useState({ completedLessons: [], quizAttempts: [] });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetch("http://localhost:5000/api/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => { if (!r.ok) throw new Error("Could not load progress"); return r.json(); })
      .then(setProgress).catch((e) => console.error(e)).finally(() => setLoading(false));
  }, [token, navigate]);

  const attempts = progress.quizAttempts || [];
  const best = attempts.length ? Math.max(...attempts.map((a) => Math.round((a.score / a.totalQuestions) * 100))) : 0;
  const avg = attempts.length ? Math.round(attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) / attempts.length) : 0;
  function logout() { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); }

  return <div className="extra-page">
    <nav className="extra-nav"><div className="logo"><Shield size={27}/>CyberQuest</div><div className="extra-nav-actions"><button className="learn-back" onClick={() => navigate("/")}>Home</button><button className="learn-back" onClick={logout}><LogOut size={16}/> Logout</button></div></nav>
    <main className="extra-main">
      <div className="extra-heading"><span>YOUR LEARNING SPACE</span><h1>Welcome, {user.name || "Learner"}!</h1><p>Keep building your cybersecurity knowledge, one step at a time.</p></div>
      {loading ? <p>Loading your progress...</p> : <>
        <div className="extra-stats">
          <article><BookOpen/><strong>{progress.completedLessons?.length || 0}</strong><span>Lessons completed</span></article>
          <article><Trophy/><strong>{attempts.length}</strong><span>Quiz attempts</span></article>
          <article><ChartNoAxesColumnIncreasing/><strong>{best}%</strong><span>Best quiz score</span></article>
          <article><ChartNoAxesColumnIncreasing/><strong>{avg}%</strong><span>Average score</span></article>
        </div>
        <section className="extra-panel"><h2>Learning progress</h2><p>{progress.completedLessons?.length || 0} of 6 lessons completed</p><div className="extra-progress"><span style={{width:`${Math.min(100, ((progress.completedLessons?.length || 0)/6)*100)}%`}}/></div><div className="extra-actions"><button className="primary-btn" onClick={() => navigate("/learn")}>Continue learning <ArrowRight size={17}/></button><button className="secondary-btn" onClick={() => navigate("/challenges")}>Take a quiz</button><button className="secondary-btn" onClick={() => navigate("/assistant")}>Ask AI assistant <Bot size={17}/></button></div></section>
        <section className="extra-panel"><h2>Recent quiz attempts</h2>{attempts.length ? [...attempts].slice(-5).reverse().map((a, i) => <div className="attempt-row" key={`${a.attemptedAt || i}-${i}`}><span>{a.attemptedAt ? new Date(a.attemptedAt).toLocaleString() : "Quiz attempt"}</span><strong>{a.score}/{a.totalQuestions} ({Math.round(a.score/a.totalQuestions*100)}%)</strong></div>) : <p>You have not completed a quiz yet. Your results will appear here.</p>}</section>
      </>}
    </main>
  </div>;
}
export default Dashboard;
