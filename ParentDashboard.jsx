import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getGoals, askAgent, analyseProgress } from "../utils/api.js";

const DOMAIN_COLORS = {
  Communication: "#4361ee",
  Motor: "#7209b7",
  Academic: "#f72585",
  "Social-Emotional": "#4cc9f0",
  ADL: "#fb8500",
};

const STATUS_PERCENT = {
  "Not Started": 0,
  Emerging: 25,
  Progressing: 65,
  Mastered: 100,
};

export default function ParentDashboard() {
  const { user, logout } = useAuth();
  const [goals, setGoals] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [question, setQuestion] = useState("");
  const [agentAnswer, setAgentAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getGoals(user.childId),
      analyseProgress(user.childId),
    ]).then(([g, a]) => {
      setGoals(g);
      setAnalysis(a);
    }).finally(() => setLoading(false));
  }, [user.childId]);

  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setAsking(true);
    try {
      const { answer } = await askAgent(question, user.childId, "your child");
      setAgentAnswer(answer);
    } catch {
      setAgentAnswer("Sorry, I couldn't retrieve an answer right now. Please try again.");
    } finally {
      setAsking(false);
    }
  }

  if (loading) return <p style={{ padding: "2rem", fontFamily: "system-ui" }}>Loading dashboard...</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7ff", fontFamily: "system-ui", padding: "2rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#1a1a2e" }}>🌉 GoalBridge</h1>
            <p style={{ margin: "0.25rem 0 0", color: "#666" }}>Welcome, {user.name} · Parent View</p>
          </div>
          <button onClick={logout} style={{ background: "none", border: "1px solid #ddd", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer" }}>Sign out</button>
        </div>

        {/* Analysis Banner */}
        {analysis && analysis.atRisk?.length > 0 && (
          <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
            <strong>⚠️ {analysis.atRisk.length} goal(s) need attention</strong>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", color: "#555" }}>{analysis.recommendations?.[0]}</p>
          </div>
        )}

        {/* Goals Grid */}
        <h2 style={{ fontSize: "1.1rem", color: "#333", marginBottom: "1rem" }}>Active IEP Goals</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {goals.map(goal => (
            <div key={goal.id} style={{ background: "#fff", borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderTop: `4px solid ${DOMAIN_COLORS[goal.domain] || "#4361ee"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: DOMAIN_COLORS[goal.domain] || "#4361ee", textTransform: "uppercase" }}>{goal.domain}</span>
                <span style={{ fontSize: "0.75rem", background: goal.status === "Mastered" ? "#d1fae5" : "#f3f4f6", color: goal.status === "Mastered" ? "#065f46" : "#555", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>{goal.status}</span>
              </div>
              <p style={{ margin: "0 0 0.75rem", fontWeight: 600, color: "#1a1a2e", fontSize: "0.95rem" }}>{goal.plainLanguageSummary || goal.title}</p>
              {/* Progress bar */}
              <div style={{ background: "#f0f0f0", borderRadius: "999px", height: "6px" }}>
                <div style={{ width: `${STATUS_PERCENT[goal.status] || 0}%`, background: DOMAIN_COLORS[goal.domain] || "#4361ee", height: "6px", borderRadius: "999px", transition: "width 0.5s" }} />
              </div>
              <p style={{ margin: "0.4rem 0 0", fontSize: "0.78rem", color: "#999" }}>Last updated: {new Date(goal.lastUpdated).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {/* AI Agent Q&A */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", color: "#1a1a2e" }}>🤖 Ask GoalBridge AI</h2>
          <p style={{ margin: "0 0 1rem", color: "#666", fontSize: "0.9rem" }}>Ask anything about your child's IEP goals in plain language.</p>
          <form onSubmit={handleAsk} style={{ display: "flex", gap: "0.75rem" }}>
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g. How is my child doing with speech this week?"
              style={{ flex: 1, padding: "0.75rem 1rem", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.95rem" }}
            />
            <button type="submit" disabled={asking} style={{ background: "#4361ee", color: "#fff", border: "none", padding: "0.75rem 1.25rem", borderRadius: "8px", fontWeight: 600, cursor: asking ? "not-allowed" : "pointer" }}>
              {asking ? "..." : "Ask"}
            </button>
          </form>
          {agentAnswer && (
            <div style={{ marginTop: "1rem", background: "#f5f7ff", padding: "1rem", borderRadius: "8px", fontSize: "0.95rem", color: "#333", lineHeight: 1.6 }}>
              {agentAnswer}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
