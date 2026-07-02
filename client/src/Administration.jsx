import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/App.css";

export default function Administration() {
  const navigate = useNavigate();

  return (
    <div className="mtc-dashboard-container" style={{ gridTemplateColumns: '84px 1fr' }}>
      {/* Sidebar Navigation */}
      <nav className="mtc-sidebar" style={{ backgroundColor: '#1e293b' }}> {/* Darker sidebar for Admin */}
        <div className="mtc-logo-container">
          <div className="mtc-logo">A</div>
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
          <h1>Admin Dashboard</h1>
        </header>

        {/* Metric Cards */}
        <div className="course-grid" style={{ marginBottom: '2rem' }}>
          <div className="mtc-course-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--secondary-text)' }}>Total Students</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--mtc-maroon)' }}>1,248</p>
          </div>
          <div className="mtc-course-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--secondary-text)' }}>Active Courses</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--mtc-blue)' }}>84</p>
          </div>
          <div className="mtc-course-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--secondary-text)' }}>System Status</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.8rem 0 0 0', color: '#16a34a' }}>🟢 Online</p>
          </div>
        </div>

        {/* Recent Activity Table Placeholder */}
        <div className="mtc-course-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>Recent System Activity</h3>
          <p className="empty-state-text">No recent logs to display.</p>
        </div>
      </main>
    </div>
  );
}