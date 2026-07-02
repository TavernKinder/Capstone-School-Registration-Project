import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/App.css";

export default function StudentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Student Login Attempt:", email);
    // Add authentication logic here
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ backgroundColor: 'var(--card-bg)', padding: '2.5rem', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="mtc-logo" style={{ color: 'var(--mtc-maroon)', fontSize: '3rem', marginBottom: '0.5rem' }}>M</div>
          <h2 style={{ margin: 0, color: 'var(--main-text)' }}>Student Portal</h2>
          <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>Sign in to access your courses</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--main-text)' }}>Student Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
              placeholder="student@mtc.edu"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--main-text)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn-mtc-register" style={{ width: '100%', margin: '1rem 0 0 0' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}