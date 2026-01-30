import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ firstname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const res = await axios.post(`${API_URL}/register`, {
        firstname: form.firstname,
        email: form.email,
        password: form.password
      });

      setMessage(res.data.message || "Registration successful!");
      setForm({ firstname: "", email: "", password: "" }); // Clear form
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="glass-card">
        <h1>Register</h1>
        <p style={{ textAlign: "center", marginBottom: "20px", color: "#a0a0a0" }}>
          Join the Syndicate.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            required
          />
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
            minLength="6"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <div style={{ marginTop: "15px", padding: "10px", borderRadius: "5px", textAlign: "center", backgroundColor: message.includes("successful") ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)", border: message.includes("successful") ? "1px solid #28a745" : "1px solid #dc3545", color: "#e0e0e0" }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "0.9rem" }}>
          <span style={{ color: "#a0a0a0" }}>Already initiated? </span>
          <Link to="/login" style={{ fontWeight: "600" }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
