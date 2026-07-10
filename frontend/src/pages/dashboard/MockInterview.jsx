import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Video, Mic, MicOff, VideoOff, Play, Square, History, ArrowRight, Star } from "lucide-react";
import api from "../../services/api";
import { Card, CardHead, Badge, Button, ProgressBar } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";

const COMPANIES = ["Google", "Microsoft", "Amazon", "Lenovo", "Infosys", "TCS", "Wipro", "Accenture", "Cognizant", "Capgemini", "Custom"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const DURATIONS = [10, 15, 20, 30];
const QUESTION_COUNT = 5;

const QUESTION_BANK = [
  "Tell me about yourself and why you want to join this company.",
  "Describe a challenging project you led and the impact it had.",
  "How do you handle conflict within a team?",
  "Explain a technical concept you know well to a non-technical person.",
  "Where do you see yourself in five years?",
  "Tell me about a time you failed and what you learned.",
  "How do you prioritize work under tight deadlines?",
  "Describe your experience with the technologies in this role.",
];

function scoreAnswer(transcript = "") {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = transcript.split(/[.!?]+/).filter(Boolean).length;
  const leadershipHits = (transcript.match(/\b(led|lead|managed|mentored|team|owned)\b/gi) || []).length;
  const communication = Math.min(98, 45 + wordCount * 1.2);
  const technical = Math.min(98, 40 + wordCount * 0.9 + (transcript.toLowerCase().includes("system") ? 8 : 0));
  const grammar = Math.min(98, 55 + sentences * 4 - (wordCount / Math.max(1, sentences) > 30 ? 10 : 0));
  const leadership = Math.min(98, 40 + leadershipHits * 10);
  const confidence = Math.min(98, 50 + wordCount * 0.8);
  const overall = Math.round((communication + technical + grammar + leadership + confidence) / 5);
  return {
    communication: Math.round(communication),
    technical: Math.round(technical),
    grammar: Math.round(grammar),
    leadership: Math.round(leadership),
    confidence: Math.round(confidence),
    overall,
  };
}

export default function MockInterview() {
  const { user } = useAuth();
  const [config, setConfig] = useState({ company: "Lenovo", role: "Frontend Developer", difficulty: "Medium", duration: 10 });
  const [phase, setPhase] = useState("config"); // config | live | report
  const [index, setIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState([]);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [session, setSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [viewing, setViewing] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const startRef = useRef(0);

  const questions = QUESTION_BANK.slice(0, QUESTION_COUNT);

  const stopMedia = () => {
    try { streamRef.current?.getTracks().forEach((t) => t.stop()); } catch {}
    try { recognitionRef.current?.stop(); } catch {}
    try { recorderRef.current?.state !== "inactive" && recorderRef.current?.stop(); } catch {}
  };

  useEffect(() => () => stopMedia(), []);

  const speak = (text) => {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch {}
  };

  const askQuestion = (i) => {
    const q = questions[i];
    setTranscript("");
    startRef.current = Date.now();
    speak(q);
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.start();
      recorderRef.current = rec;

      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        const recog = new SR();
        recog.lang = "en-US";
        recog.continuous = true;
        recog.interimResults = true;
        recog.onresult = (e) => {
          let text = "";
          for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
          setTranscript(text);
        };
        recog.start();
        recognitionRef.current = recog;
      } else {
        toast("Speech recognition not supported in this browser — type your answer instead.", { icon: "⚠️" });
      }

      setPhase("live");
      setIndex(0);
      setAnswers([]);
      const greeting = `Hello ${user?.name || "candidate"}. Welcome to ${config.company}. Today I will conduct your ${config.role} interview. This interview will last for ${config.duration} minutes. Let's begin. ${questions[0]}`;
      speak(greeting);
      setTranscript("");
      startRef.current = Date.now();
    } catch (err) {
      toast.error("Camera/microphone permission is required to start the interview.");
    }
  };

  const next = async () => {
    const answer = transcript.trim();
    const time = Math.round((Date.now() - startRef.current) / 1000);
    const scores = scoreAnswer(answer);
    let feedback = "Good answer. Aim to be more specific with measurable outcomes.";
    try {
      const f = await api.post("/interview/feedback", { answer: answer || "No answer provided" });
      feedback = f.feedback;
    } catch {}
    const entry = { question: questions[index], answer, time, ...scores, feedback };
    const updated = [...answers, entry];
    setAnswers(updated);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
      askQuestion(index + 1);
    } else {
      finish(updated);
    }
  };

  const finish = async (finalAnswers) => {
    stopMedia();
    const avg = (k) => Math.round(finalAnswers.reduce((a, x) => a + (x[k] || 0), 0) / Math.max(1, finalAnswers.length));
    const overall = avg("overall");
    const report = `You completed a ${config.duration}-minute ${config.difficulty} interview for ${config.role} at ${config.company}. Overall score: ${overall}/100. ${
      overall >= 75 ? "Strong performance." : "Keep practicing with structured, metric-driven answers."
    }`;
    const payload = {
      company: config.company,
      role: config.role,
      difficulty: config.difficulty,
      duration: config.duration,
      questions: finalAnswers,
      communicationScore: avg("communication"),
      technicalScore: avg("technical"),
      grammarScore: avg("grammar"),
      leadershipScore: avg("leadership"),
      overallScore: overall,
      report,
    };
    try {
      const saved = await api.post("/interview", payload);
      setSession({ ...saved, questions: finalAnswers });
      toast.success("Interview saved to your history");
    } catch {
      setSession({ ...payload, id: "local" });
      toast.error("Could not save interview, but report is shown");
    }
    setPhase("report");
  };

  const loadHistory = async () => {
    try {
      const d = await api.get("/interview");
      setHistory(d.sessions || []);
      setOpenHistory(true);
    } catch {}
  };

  const viewSession = async (id) => {
    try {
      const d = await api.get(`/interview/${id}`);
      setViewing(d.session);
    } catch {}
  };

  // ---------------- Config screen ----------------
  if (phase === "config") {
    return (
      <div>
        <div className="page-header">
          <div><h1>AI Mock Video Interview</h1><p>Practice with a camera + voice AI interviewer.</p></div>
          <Button variant="outline" onClick={loadHistory}><History size={16} /> History</Button>
        </div>
        <div className="grid grid-2">
          <Card>
            <CardHead title="Interview Setup" icon={<Video size={18} />} />
            <Field label="Company">
              <select className="select" value={config.company} onChange={(e) => setConfig({ ...config, company: e.target.value })}>
                {COMPANIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Job Role">
              <input className="input" value={config.role} onChange={(e) => setConfig({ ...config, role: e.target.value })} />
            </Field>
            <Field label="Difficulty">
              <div className="row wrap" style={{ gap: 8 }}>
                {DIFFICULTIES.map((d) => (
                  <button key={d} className={`badge ${config.difficulty === d ? "primary" : ""}`} style={{ cursor: "pointer", border: "none" }} onClick={() => setConfig({ ...config, difficulty: d })}>{d}</button>
                ))}
              </div>
            </Field>
            <Field label="Duration (minutes)">
              <div className="row wrap" style={{ gap: 8 }}>
                {DURATIONS.map((d) => (
                  <button key={d} className={`badge ${config.duration === d ? "primary" : ""}`} style={{ cursor: "pointer", border: "none" }} onClick={() => setConfig({ ...config, duration: d })}>{d} min</button>
                ))}
              </div>
            </Field>
            <Button onClick={start} className="mt-2"><Play size={16} /> Start Interview</Button>
          </Card>
          <Card className="center">
            <Video size={48} color="var(--primary)" />
            <p className="muted" style={{ marginTop: 12, maxWidth: 320 }}>
              When you click Start, the browser will ask for camera and microphone access.
              The AI interviewer will speak, listen to your spoken answers, and score you in real time.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // ---------------- Report screen ----------------
  if (phase === "report" && session) {
    const sc = [
      { label: "Communication", value: session.communicationScore },
      { label: "Technical", value: session.technicalScore },
      { label: "Grammar", value: session.grammarScore },
      { label: "Leadership", value: session.leadershipScore },
    ];
    return (
      <div>
        <div className="page-header">
          <div><h1>Interview Report</h1><p>{session.company} · {session.role}</p></div>
          <Button variant="outline" onClick={() => { setPhase("config"); setSession(null); }}><ArrowRight size={16} /> New Interview</Button>
        </div>
        <div className="grid grid-3">
          <Card className="center">
            <CardHead title="Overall Score" />
            <div style={{ fontSize: 48, fontWeight: 800, color: "var(--primary)" }}>{session.overallScore}/100</div>
          </Card>
          <Card className="span-2">
            <CardHead title="Score Breakdown" icon={<Star size={18} />} />
            {sc.map((s) => (
              <div key={s.label} style={{ marginBottom: 12 }}>
                <div className="row between" style={{ fontSize: 13, marginBottom: 5 }}><span>{s.label}</span><span style={{ fontWeight: 700 }}>{s.value}</span></div>
                <ProgressBar value={s.value} color="var(--primary)" />
              </div>
            ))}
          </Card>
        </div>
        <Card className="mt-3">
          <CardHead title="Report" icon={<Star size={18} />} />
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{session.report}</p>
        </Card>
        <Card className="mt-3">
          <CardHead title="Question-by-Question" />
          {(session.questions || []).map((q, i) => (
            <div key={i} style={{ marginBottom: 16, padding: 14, border: "1px solid var(--border)", borderRadius: 12 }}>
              <div className="row between"><strong>Q{i + 1}. {q.question}</strong><Badge variant="primary">{q.overall}/100</Badge></div>
              <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>Answer: {q.answer || "—"}</p>
              <p className="muted" style={{ fontSize: 13 }}>Feedback: {q.feedback}</p>
              <p className="muted" style={{ fontSize: 12 }}>Time: {q.time}s</p>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  // ---------------- Live screen ----------------
  return (
    <div>
      <div className="page-header">
        <div><h1>Live Interview — {config.company}</h1><p>Question {index + 1} of {questions.length}</p></div>
      </div>
      <div className="grid grid-2">
        <Card>
          <CardHead title="Your Camera" icon={<Video size={18} />} action={
            <div className="row" style={{ gap: 6 }}>
              <button className="icon-btn" style={{ background: "var(--surface-2)" }} onClick={() => { setMicOn((m) => { streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !m)); return !m; }); }}><Mic size={16} /></button>
              <button className="icon-btn" style={{ background: "var(--surface-2)" }} onClick={() => { setVideoOn((v) => { streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !v)); return !v; }); }}><Video size={16} /></button>
            </div>
          } />
          <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", borderRadius: 12, background: "#000", aspectRatio: "16/9" }} />
          <div className="row" style={{ gap: 10, marginTop: 12 }}>
            <Badge variant={micOn ? "success" : "danger"}>{micOn ? <Mic size={12} /> : <MicOff size={12} />} Mic {micOn ? "On" : "Off"}</Badge>
            <Badge variant={videoOn ? "success" : "danger"}>{videoOn ? <Video size={12} /> : <VideoOff size={12} />} Cam {videoOn ? "On" : "Off"}</Badge>
          </div>
        </Card>

        <Card className="chat" style={{ height: 520 }}>
          <CardHead title="AI Interviewer" icon={<Mic size={18} />} />
          <div className="chat-body">
            <div className="msg bot">{questions[index]}</div>
            {transcript && <div className="msg user">{transcript}</div>}
          </div>
          <div className="chat-input">
            <Button onClick={next}>{index + 1 < questions.length ? "Next Question" : "Finish Interview"} <ArrowRight size={16} /></Button>
            <Button variant="outline" onClick={() => { stopMedia(); setPhase("config"); }}><Square size={16} /> End</Button>
          </div>
        </Card>
      </div>
      {viewing && (
        <Card className="mt-3">
          <CardHead title={`Replay: ${viewing.company} · ${viewing.role}`} />
          {(viewing.questions || []).map((q, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <strong>Q{i + 1}. {q.question}</strong>
              <p className="muted" style={{ fontSize: 13 }}>A: {q.answer}</p>
              <Badge variant="primary">{q.overall}/100</Badge>
            </div>
          ))}
        </Card>
      )}
      {openHistory && (
        <Card className="mt-3">
          <CardHead title="Interview History" action={<button className="icon-btn" style={{ background: "var(--surface-2)" }} onClick={() => setOpenHistory(false)}>✕</button>} />
          {(history || []).map((h) => (
            <div key={h.id} className="list-item" style={{ cursor: "pointer" }} onClick={() => viewSession(h.id)}>
              <div className="avatar" style={{ background: "var(--primary-bg)", color: "var(--primary)" }}><History size={16} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{h.company} · {h.role}</div>
                <div className="muted" style={{ fontSize: 12 }}>{new Date(h.createdAt).toLocaleDateString()}</div>
              </div>
              <Badge variant="success">{h.overallScore}/100</Badge>
            </div>
          ))}
          {(history || []).length === 0 && <p className="muted" style={{ fontSize: 13 }}>No past interviews.</p>}
        </Card>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}
