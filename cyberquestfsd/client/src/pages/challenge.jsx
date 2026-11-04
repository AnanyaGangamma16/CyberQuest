
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Lock,
  Mail,
  Globe,
  AlertTriangle
} from "lucide-react";

const questions = [
  {
    category: "Phishing Awareness",
    icon: Mail,
    question: "You receive an email saying your bank account will be blocked unless you click a link immediately. What should you do?",
    options: [
      "Click the link immediately",
      "Reply with your bank details",
      "Verify the message through the official bank website",
      "Forward the email to friends"
    ],
    answer: 2,
    explanation: "Correct! Urgent messages demanding immediate action are a common phishing technique. Always verify through the bank's official website or phone number."
  },
  {
    category: "Suspicious Links",
    icon: Globe,
    question: "Which of these website addresses looks most suspicious?",
    options: [
      "https://www.google.com",
      "https://www.amazon.com",
      "http://paypa1-security.example.com",
      "https://www.wikipedia.org"
    ],
    answer: 2,
    explanation: "Correct! The address uses a misleading domain and substitutes the number 1 for the letter l. Always inspect the actual domain carefully."
  },
  {
    category: "Password Security",
    icon: Lock,
    question: "Which password practice is the safest?",
    options: [
      "Using your birthday",
      "Using the same password everywhere",
      "Using a long, unique password for every account",
      "Sharing passwords with friends"
    ],
    answer: 2,
    explanation: "Correct! Long, unique passwords reduce the impact of a compromised account. A password manager can help you manage them."
  },
  {
    category: "Malware Awareness",
    icon: AlertTriangle,
    question: "You receive an unexpected email attachment from an unknown sender. What should you do?",
    options: [
      "Download and open it",
      "Forward it to everyone",
      "Avoid opening it and verify the sender",
      "Disable your antivirus"
    ],
    answer: 2,
    explanation: "Correct! Unexpected attachments may contain malware. Verify the sender independently and report suspicious messages."
  },
  {
    category: "Social Engineering",
    icon: Shield,
    question: "Someone calls pretending to be technical support and asks for your OTP. What should you do?",
    options: [
      "Share the OTP",
      "Ask them to wait and send another OTP",
      "Refuse and verify their identity independently",
      "Share your password instead"
    ],
    answer: 2,
    explanation: "Correct! Never share an OTP with anyone. Genuine support staff should not ask you to disclose your authentication codes."
  },
  {
    category: "Web Security",
    icon: Globe,
    question: "What does HTTPS primarily provide when browsing a website?",
    options: [
      "Guaranteed protection from every cyberattack",
      "Encrypted communication between browser and website",
      "Automatic removal of malware",
      "A guarantee that the website is legitimate"
    ],
    answer: 1,
    explanation: "Correct! HTTPS encrypts communication between your browser and the website. However, a malicious website can also use HTTPS."
  },
  {
    category: "Password Security",
    icon: Lock,
    question: "What is the main purpose of two-factor authentication (2FA)?",
    options: [
      "To make passwords shorter",
      "To add another layer of account verification",
      "To remove the need for passwords",
      "To share login details securely"
    ],
    answer: 1,
    explanation: "Correct! 2FA requires an additional verification factor, making unauthorized account access more difficult."
  },
  {
    category: "Phishing Awareness",
    icon: Mail,
    question: "A message offers a free smartphone prize but asks for your bank details to claim it. What is the safest response?",
    options: [
      "Provide your details",
      "Pay a small processing fee",
      "Ignore the offer and verify it independently",
      "Share the message on social media"
    ],
    answer: 2,
    explanation: "Correct! Unexpected prizes requesting sensitive financial information are a common scam warning sign."
  },
  {
    category: "Malware Awareness",
    icon: AlertTriangle,
    question: "What is ransomware?",
    options: [
      "Software that improves computer speed",
      "Malware that locks or encrypts data and demands payment",
      "A type of secure password",
      "A website protection certificate"
    ],
    answer: 1,
    explanation: "Correct! Ransomware restricts access to data or systems and demands payment. Regular offline backups can help reduce its impact."
  },
  {
    category: "Social Engineering",
    icon: Shield,
    question: "An unknown person claims to be your manager and urgently requests confidential company files. What should you do?",
    options: [
      "Send the files immediately",
      "Verify the request through an official channel",
      "Share your login credentials",
      "Ignore company security rules"
    ],
    answer: 1,
    explanation: "Correct! Attackers can impersonate trusted people. Always verify unusual requests before sharing confidential information."
  }
];

function Challenge() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState("All Categories");
  const activeQuestions = category === "All Categories" ? questions : questions.filter((item) => item.category === category);

  const question = activeQuestions[current];
  const Icon = question.icon;

  function checkAnswer() {
    if (selected === null) return;

    if (selected === question.answer) {
      setScore((previous) => previous + 1);
    }

    setAnswered(true);
  }

  
async function nextQuestion() {
  if (current !== activeQuestions.length - 1) {
    setCurrent((previous) => previous + 1);
    setSelected(null);
    setAnswered(false);
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    setSaveStatus("Please log in to save your score.");
    setFinished(true);
    return;
  }

  setSaving(true);
  setSaveStatus("Saving your score...");

  try {
    const response = await fetch("http://localhost:5000/api/progress/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        score,
        totalQuestions: activeQuestions.length
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Could not save quiz score.");
    }

    setSaveStatus("Quiz score saved successfully!");
  } catch (error) {
    console.error("Quiz score save failed:", error);
    setSaveStatus("Your result is ready, but the score could not be saved. Please try again.");
  } finally {
    setSaving(false);
    setFinished(true);
  }
}

function restartQuiz() {
  setCurrent(0);
  setSelected(null);
  setScore(0);
  setAnswered(false);
  setFinished(false);
  setSaveStatus("");
  setSaving(false);
}

  const percentage = Math.round((score / activeQuestions.length) * 100);

  return (
    <div className="challenge-page">

      <nav className="challenge-navbar">
        <div className="logo">
          <Shield size={28} />
          CyberQuest
        </div>

        <button
          className="learn-back"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} /> Home
        </button>
      </nav>

      <main className="challenge-main">

        {!finished ? (
          <>
            <div className="challenge-heading">
              <span>TEST YOUR KNOWLEDGE</span>
              <h1>Cyber Challenges</h1>
              <p>Think smart. Identify threats. Stay secure.</p>
            </div>

            <div className="category-picker"><label htmlFor="quiz-category">Choose a category</label><select id="quiz-category" value={category} onChange={(e) => { setCategory(e.target.value); setCurrent(0); setSelected(null); setScore(0); setAnswered(false); setFinished(false); setSaveStatus(""); }}><option>All Categories</option>{[...new Set(questions.map((item) => item.category))].map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="quiz-card">

              <div className="quiz-top">
                <span>
                  Question {current + 1} of {activeQuestions.length}
                </span>

                <span className="quiz-category">
                  {question.category}
                </span>
              </div>

              <div className="quiz-progress">
                <div
                  className="quiz-progress-fill"
                  style={{
                    width: `${((current + 1) / activeQuestions.length) * 100}%`
                  }}
                />
              </div>

              <div className="question-icon">
                <Icon size={30} />
              </div>

              <h2>{question.question}</h2>

              <div className="answer-options">

                {question.options.map((option, index) => {
                  let className = "answer-option";

                  if (selected === index) {
                    className += " selected";
                  }

                  if (answered && index === question.answer) {
                    className += " correct";
                  } else if (
                    answered &&
                    selected === index &&
                    index !== question.answer
                  ) {
                    className += " incorrect";
                  }

                  return (
                    <button
                      key={index}
                      className={className}
                      onClick={() => !answered && setSelected(index)}
                      disabled={answered}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span>{option}</span>

                      {answered && index === question.answer && (
                        <CheckCircle size={19} />
                      )}

                      {answered &&
                        selected === index &&
                        index !== question.answer && (
                          <XCircle size={19} />
                        )}
                    </button>
                  );
                })}

              </div>

              {answered && (
                <div className="answer-feedback">
                  <strong>
                    {selected === question.answer
                      ? "Correct Answer!"
                      : "Incorrect Answer"}
                  </strong>

                  <p>{question.explanation}</p>
                </div>
              )}

              <div className="quiz-footer">

                <span>Score: {score}/{activeQuestions.length}</span>

                {!answered ? (
                  <button
                    className="primary-btn"
                    onClick={checkAnswer}
                    disabled={selected === null}
                  >
                    Submit Answer <ArrowRight size={17} />
                  </button>
                ) : (
                  <button
                    className="primary-btn"
                    onClick={nextQuestion}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : current === activeQuestions.length - 1
                      ? "View Results"
                      : "Next Question"}
                    <ArrowRight size={17} />
                  </button>
                )}

              </div>

            </div>
          </>
        ) : (

          <div className="result-card">

            <div className="trophy-icon">
              <Trophy size={55} />
            </div>

            <span>CHALLENGE COMPLETED</span>

            <h1>Your Results</h1>
<p className="save-status" role="status">{saveStatus}</p>

            <div className="score-circle">
              <strong>{percentage}%</strong>
              <span>{score} / {activeQuestions.length} correct</span>
            </div>

            <h2>
              {percentage >= 80
                ? "Excellent Work!"
                : percentage >= 50
                ? "Good Effort!"
                : "Keep Practicing!"}
            </h2>

            <p>
              {percentage >= 80
                ? "You have a strong understanding of basic cybersecurity awareness."
                : "Keep learning and practising to improve your cybersecurity knowledge."}
            </p>

            <div className="result-buttons">
              <button className="primary-btn" onClick={restartQuiz}>
                <RotateCcw size={17} /> Try Again
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/learn")}
              >
                Explore Lessons
              </button>
            </div>

            <button
              className="back-home"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>

          </div>

        )}

      </main>
    </div>
  );
}

export default Challenge;
