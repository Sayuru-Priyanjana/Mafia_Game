import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
    try {
      const res = await axios.post(`${API_URL}/login`, form);
      // alert(`Login successful! Welcome! ${res.data.user?.firstName || ""}`);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed with some errors");
    }
  };

  return (
    <div className="page-container">
      <div className="glass-card">
        <h1>Login</h1>
        <p style={{ textAlign: "center", marginBottom: "20px", color: "#a0a0a0" }}>
          Welcome back, Boss!!.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.9rem" }}>
          <span style={{ color: "#a0a0a0" }}>New here? </span>
          <Link to="/register" style={{ fontWeight: "600" }}>
            Join the Mafia Family
          </Link>
        </div>
      </div>
    </div>
  );
}
