
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Lock, Bug, Mail, Brain, Globe,
  ArrowLeft, ArrowRight, CheckCircle, BookOpen
} from "lucide-react";

const lessons = [
  {
    id: 1,
    title: "Introduction to Cybersecurity",
    category: "Fundamentals",
    level: "Beginner",
    icon: Shield,
    duration: "5 min",
    description: "Understand cybersecurity and why it matters in today's digital world.",
    content: [
      {
        heading: "What is Cybersecurity?",
        text: "Cybersecurity is the practice of protecting computers, networks, applications and data from unauthorized access, attacks and damage."
      },
      {
        heading: "Why is it important?",
        text: "We use the internet for banking, communication, shopping and education. Cybersecurity helps protect our personal information and digital identity."
      },
      {
        heading: "Common security practices",
        text: "Use strong passwords, enable two-factor authentication, update your software regularly and avoid suspicious links."
      }
    ]
  },
  {
    id: 2,
    title: "Phishing Awareness",
    category: "Online Threats",
    level: "Beginner",
    icon: Mail,
    duration: "7 min",
    description: "Learn how to recognize fraudulent emails, messages and websites.",
    content: [
      {
        heading: "What is Phishing?",
        text: "Phishing is a cyberattack in which attackers impersonate trusted organizations or individuals to trick people into revealing sensitive information."
      },
      {
        heading: "Warning signs",
        text: "Look for urgent messages, unexpected attachments, suspicious sender addresses, spelling mistakes and links that do not match the claimed website."
      },
      {
        heading: "How to stay safe",
        text: "Never share passwords or OTPs through suspicious links. Verify the sender independently and visit official websites directly."
      }
    ]
  },
  {
    id: 3,
    title: "Password Security",
    category: "Account Protection",
    level: "Beginner",
    icon: Lock,
    duration: "5 min",
    description: "Discover how to create strong passwords and protect your accounts.",
    content: [
      {
        heading: "Why are passwords important?",
        text: "Passwords help prevent unauthorized people from accessing your accounts, personal information and online services."
      },
      {
        heading: "Creating strong passwords",
        text: "Use long, unique passwords or passphrases. Avoid names, birthdays and commonly used password combinations."
      },
      {
        heading: "Additional protection",
        text: "Use a password manager and enable multi-factor authentication wherever available. Never reuse important passwords."
      }
    ]
  },
  {
    id: 4,
    title: "Malware Awareness",
    category: "Online Threats",
    level: "Intermediate",
    icon: Bug,
    duration: "8 min",
    description: "Understand viruses, ransomware, spyware and other malicious software.",
    content: [
      {
        heading: "What is Malware?",
        text: "Malware is software designed to damage devices, steal information, disrupt operations or gain unauthorized access."
      },
      {
        heading: "Types of Malware",
        text: "Viruses attach to files, ransomware locks or encrypts data, spyware secretly collects information and trojans disguise themselves as legitimate software."
      },
      {
        heading: "Prevention",
        text: "Install software from trusted sources, keep systems updated, use reputable security software and avoid unknown attachments."
      }
    ]
  },
  {
    id: 5,
    title: "Social Engineering",
    category: "Human Security",
    level: "Intermediate",
    icon: Brain,
    duration: "7 min",
    description: "Understand how attackers manipulate people into sharing confidential information.",
    content: [
      {
        heading: "What is Social Engineering?",
        text: "Social engineering uses psychological manipulation to persuade people to reveal confidential information or perform unsafe actions."
      },
      {
        heading: "Common techniques",
        text: "Attackers may impersonate technical support, create fake emergencies, pretend to be authority figures or offer rewards to manipulate victims."
      },
      {
        heading: "How to protect yourself",
        text: "Verify unusual requests through trusted channels. Do not let urgency or pressure make you share sensitive information."
      }
    ]
  },
  {
    id: 6,
    title: "Web Security Basics",
    category: "Web Protection",
    level: "Beginner",
    icon: Globe,
    duration: "6 min",
    description: "Learn about HTTPS, secure browsing and common website security risks.",
    content: [
      {
        heading: "What is Web Security?",
        text: "Web security involves protecting websites, browsers and online communication from threats and unauthorized access."
      },
      {
        heading: "Understanding HTTPS",
        text: "HTTPS uses encryption to protect data exchanged between your browser and a website. However, HTTPS alone does not guarantee that a website is trustworthy."
      },
      {
        heading: "Safe browsing",
        text: "Check website addresses carefully, keep your browser updated and avoid entering sensitive information on suspicious websites."
      }
    ]
  }
];

function Learn() {
  const navigate = useNavigate();

 const [selectedLesson, setSelectedLesson] = useState(null);
const [completed, setCompleted] = useState([]);
const [loadingProgress, setLoadingProgress] = useState(true);
useEffect(() => {
  async function loadProgress() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoadingProgress(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/progress",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Could not load learning progress");
      }

      const data = await response.json();

      setCompleted(
        (data.completedLessons || []).map(Number)
      );

    } catch (error) {
      console.error("Progress loading error:", error);
    } finally {
      setLoadingProgress(false);
    }
  }

  loadProgress();
}, []);
  const progress = Math.round((completed.length / lessons.length) * 100);

  async function markComplete(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in to save your learning progress.");
    navigate("/login");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/progress/lesson",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          lessonId: String(id)
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not save progress");
    }

    setCompleted((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );

    setSelectedLesson(null);

  } catch (error) {
    alert(error.message);
  }
}

  if (selectedLesson) {
    const lesson = lessons.find(
      (item) => item.id === selectedLesson
    );
    const Icon = lesson.icon;

    return (
      <div className="learn-page">
        <nav className="learn-navbar">
          <div className="logo">
            <Shield size={27} />
            CyberQuest
          </div>
          <button className="learn-back" onClick={() => setSelectedLesson(null)}>
            <ArrowLeft size={17} /> All Lessons
          </button>
        </nav>

        <main className="lesson-content">
          <span className="lesson-category">{lesson.category}</span>
          <div className="lesson-title-icon">
            <Icon size={35} />
          </div>
          <h1>{lesson.title}</h1>
          <p className="lesson-description">{lesson.description}</p>

          <div className="lesson-meta">
            <span>{lesson.level}</span>
            <span>{lesson.duration} read</span>
          </div>

          {lesson.content.map((section, index) => (
            <article className="lesson-section" key={index}>
              <h2>{index + 1}. {section.heading}</h2>
              <p>{section.text}</p>
            </article>
          ))}

          <div className="lesson-finish">
            {completed.includes(lesson.id) ? (
              <p><CheckCircle size={20} /> You have completed this lesson!</p>
            ) : (
              <button
                className="primary-btn"
                onClick={() => markComplete(lesson.id)}
              >
                Mark as Completed <CheckCircle size={18} />
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="learn-page">
      <nav className="learn-navbar">
        <div className="logo">
          <Shield size={27} />
          CyberQuest
        </div>
        <button className="learn-back" onClick={() => navigate("/")}>
          <ArrowLeft size={17} /> Home
        </button>
      </nav>

      <main className="learn-main">
        <div className="learn-heading">
          <span>YOUR CYBERSECURITY JOURNEY</span>
          <h1>Learning Hub</h1>
          <p>Build your knowledge. Recognize threats. Stay protected.</p>
        </div>

        <div className="learning-progress">
          <div className="progress-top">
            <div>
              <h3><BookOpen size={20} /> Your Learning Progress</h3>
              <p>{completed.length} of {lessons.length} lessons completed</p>
            </div>
            <strong>{progress}%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="learn-section-title">
          <h2>Explore Lessons</h2>
          <span>{lessons.length} available lessons</span>
        </div>

        <div className="learn-grid">
          {lessons.map((lesson) => {
            const Icon = lesson.icon;
            const isCompleted = completed.includes(lesson.id);

            return (
              <div className="learn-card" key={lesson.id}>
                <div className="learn-card-top">
                  <div className="learn-icon">
                    <Icon size={25} />
                  </div>
                  {isCompleted && (
                    <span className="completed-label">
                      <CheckCircle size={14} /> Completed
                    </span>
                  )}
                </div>

                <span className="learn-category">{lesson.category}</span>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>

                <div className="learn-card-bottom">
                  <span>{lesson.level} · {lesson.duration}</span>
                  <button onClick={() => setSelectedLesson(lesson.id)}>
                    {isCompleted ? "Review Lesson" : "Start Lesson"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Learn;
