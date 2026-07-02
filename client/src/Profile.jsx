import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/App.css";

export default function Profile() {
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
        <header className="main-header">
          <h1>Student Profile</h1>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Avatar and Basic Info */}
          <div className="mtc-course-card" style={{ padding: '2rem', textAlign: 'center', height: 'fit-content' }}>
            <div style={{ width: '100px', height: '100px', backgroundColor: '#e5e7eb', borderRadius: '50%', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#9ca3af' }}>
              <i className="fas fa-user"></i>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>John Doe</h3>
            <p style={{ margin: 0, color: 'var(--secondary-text)' }}>Student ID: 00123456</p>
            <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold', color: 'var(--mtc-maroon)' }}>Web Development</p>
          </div>

          {/* Detailed Info Form */}
          <div className="mtc-course-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Personal Information</h3>
            <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--secondary-text)' }}>Email</label>
                <p style={{ margin: '0.2rem 0' }}>john.doe@student.mtc.edu</p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--secondary-text)' }}>Phone</label>
                <p style={{ margin: '0.2rem 0' }}>(555) 123-4567</p>
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <button type="button" className="btn-mtc-register" style={{ width: 'auto', margin: 0 }}>Edit Profile</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}