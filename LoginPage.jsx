import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", role: "parent", childId: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.role, form.childId, form.name);
    } catch {
      setError("Login failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4ff", fontFamily: "system-ui" }}>
      <div style={{ background: "#fff", padding: "2.5rem", borderRadius: "16px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <h1 style={{ margin: "0 0 0.25rem", color: "#1a1a2e", fontSize: "1.75rem", fontWeight: 700 }}>🔗 IEPSync</h1>
        <p style={{ color: "#666", margin: "0 0 2rem" }}>IEP Goals Tracker</p>

        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Name</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />

          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />

          <label style={labelStyle}>Role</label>
          <select style={inputStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
            <option value="parent">Parent / Caregiver</option>
            <option value="therapist">Therapist</option>
            <option value="teacher">Teacher / SPED Coordinator</option>
            <option value="admin">Admin</option>
          </select>

          <label style={labelStyle}>Child ID</label>
          <input style={inputStyle} value={form.childId} onChange={e => setForm(f => ({ ...f, childId: e.target.value }))} placeholder="e.g. child-001" required />

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.85rem", background: "#4361ee", color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: "0.5rem" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#444", marginBottom: "0.35rem", marginTop: "1rem" };
const inputStyle = { width: "100%", padding: "0.65rem 0.85rem", border: "1px solid #ddd", borderRadius: "8px", fontSize: "0.95rem", boxSizing: "border-box" };
