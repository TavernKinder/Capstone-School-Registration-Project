import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/App.css";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="mtc-dashboard-container" style={{ gridTemplateColumns: '84px 1fr' }}>
      {/* Sidebar Navigation */}
      <nav className="mtc-sidebar">
        <div className="mtc-logo-container">
          <div className="mtc-logo">M</div>
        </div>
        <ul className="nav-links">
          <li onClick={() => navigate("/profile")} className="active">
            <i className="fas fa-user"></i> Profile
          </li>
          <li onClick={() => navigate("/about")}>
            <i className="fas fa-info-circle"></i> About
          </li>
          <li onClick={() => navigate("/dashboard")}>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </li>
          <li onClick={() => navigate("/courses")}>
            <i className="fas fa-graduation-cap"></i> Courses
          </li>
          <li onClick={() => navigate("/calendar")}>
            <i className="fas fa-calendar-alt"></i> Calendar
          </li>
          <li onClick={() => navigate("/inbox")}>
            <i className="fas fa-inbox"></i> Inbox
          </li>
          <li onClick={() => navigate("/history")}>
            <i className="fas fa-history"></i> History
          </li>
          <li onClick={() => navigate("/resources")}>
            <i className="fas fa-book"></i> Resources
          </li>
          <li onClick={() => navigate("/settings")}>
            <i className="fas fa-cog"></i> Settings
          </li>
          <li onClick={() => navigate("/help")}>
            <i className="fas fa-question-circle"></i> Help
            <span className="badge">4</span>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="mtc-main-content">
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
          <div className="mtc-course-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <img 
              src="https://mtech.edu/wp-content/uploads/2021/08/mtc-logo.png" 
              alt="MTC Logo" 
              style={{ maxWidth: '200px', marginBottom: '2rem' }} 
            />
            <h1 style={{ color: 'var(--main-text)' }}>About the Student Portal</h1>
            <p style={{ color: 'var(--secondary-text)', lineHeight: '1.6', margin: '1.5rem 0' }}>
              Welcome to the MTC Student Registration System. This platform is designed to provide 
              a seamless experience for students to manage their academic journey, explore the course 
              catalog, and handle semester registrations efficiently.
            </p>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
              <p>Version 1.0.0 | Built with React</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}