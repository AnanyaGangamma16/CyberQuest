
import { useNavigate, Routes, Route } from "react-router-dom";
import Challenge from "./pages/challenge.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Learn from "./pages/learn.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Admin from "./pages/admin.jsx";
import Assistant from "./pages/assistant.jsx";

import {
  Shield,
  Lock,
  Brain,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const courses = [
    {
      icon: <ShieldCheck size={28} />,
      title: "Phishing Awareness",
      description:
        "Learn to identify fake emails, suspicious links and online scams.",
      level: "Beginner"
    },
    {
      icon: <Lock size={28} />,
      title: "Password Security",
      description:
        "Understand strong passwords and secure authentication.",
      level: "Beginner"
    },
    {
      icon: <Brain size={28} />,
      title: "Social Engineering",
      description:
        "Discover how attackers manipulate people into revealing information.",
      level: "Intermediate"
    }
  ];

  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          <Shield size={30} />
          <span>CyberQuest</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#courses">Learning Hub</a>
          <a href="#challenges">Challenges</a>
          <a href="/dashboard">Dashboard</a>
        </div>

        <button
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">

        <div className="hero-content">

          <span className="tag">
            <Zap size={15} />
            LEARN. PRACTICE. PROTECT.
          </span>

          <h1>
            Master the Art of
            <span> Cybersecurity</span>
          </h1>

          <p>
            Explore cybersecurity concepts, identify online threats
            and develop the skills to stay safe in the digital world.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/learn")}
            >
              Start Learning
              <ArrowRight size={18} />
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/challenges")}
            >
              Explore Challenges
            </button>

          </div>
        </div>

        <div className="hero-visual">
          <div className="shield-circle">
            <ShieldCheck size={115} strokeWidth={1.2} />
          </div>

          <div className="floating-card">
            <Lock size={18} />
            Your Digital World, Protected
          </div>
        </div>

      </section>

      {/* Statistics */}
      <section className="stats">

        <div>
          <h2>06+</h2>
          <p>Learning Topics</p>
        </div>

        <div>
          <h2>10+</h2>
          <p>Cyber Challenges</p>
        </div>

        <div>
          <h2>100%</h2>
          <p>Interactive Learning</p>
        </div>

      </section>

      {/* Courses */}
      <section className="courses" id="courses">

        <div className="section-heading">
          <span>EXPLORE AND LEARN</span>

          <h2>Cybersecurity Learning Hub</h2>

          <p>
            Build your cybersecurity knowledge one lesson at a time.
          </p>
        </div>

        <div className="course-grid">

          {courses.map((course, index) => (
            <div className="course-card" key={index}>

              <div className="course-icon">
                {course.icon}
              </div>

              <span className="level">
                {course.level}
              </span>

              <h3>{course.title}</h3>

              <p>{course.description}</p>

              <button onClick={() => navigate("/learn")}>
                Explore Lesson
                <ArrowRight size={16} />
              </button>

            </div>
          ))}

        </div>
      </section>

      {/* Challenges */}
      <section className="challenge-banner" id="challenges">

        <BookOpen size={40} />

        <h2>Think You Can Spot a Cyber Threat?</h2>

        <p>
          Test your knowledge with interactive cybersecurity challenges.
        </p>

        <button
          className="primary-btn"
          onClick={() => navigate("/challenges")}
        >
          Take a Challenge
          <ArrowRight size={18} />
        </button>

      </section>

      {/* Footer */}
      <footer>

        <div className="logo">
          <Shield size={24} />
          CyberQuest
        </div>

        <p>Learn Smart. Stay Secure. Think Cyber.</p>

      </footer>

    </div>
  );
}

// Main Application Routes
function App() {

  return (
    <Routes>

      <Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/learn" element={<Learn />} />
<Route path="/challenges" element={<Challenge />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/assistant" element={<Assistant />} />

    </Routes>
  );
}

export default App;
