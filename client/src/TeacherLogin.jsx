import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import "/src/App.css";

export default function TeacherLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Teacher Login Attempt:", email);
    // Add authentication logic here
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ backgroundColor: 'var(--card-bg)', padding: '2.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', borderTop: '4px solid var(--mtc-blue)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, color: 'var(--main-text)' }}>Faculty Access</h2>
          <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>MTC Instructor Portal</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Faculty Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
              placeholder="instructor@mtc.edu"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
              required
            />
          </div>
          <button type="submit" className="btn-mtc-register" style={{ width: '100%', margin: '1rem 0 0 0', backgroundColor: 'var(--mtc-blue)' }}>
            Faculty Sign In
          </button>
        </form>
      </div>
    </div>
  );
}