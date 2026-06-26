import { useState } from "react";
import "/src/App.css";

export default function Administration() {
  return (
    <div className="mtc-dashboard-container" style={{ gridTemplateColumns: '84px 1fr' }}>
      {/* Sidebar Navigation */}
      <nav className="mtc-sidebar" style={{ backgroundColor: '#1e293b' }}> {/* Darker sidebar for Admin */}
        <div className="mtc-logo-container">
          <div className="mtc-logo">A</div>
        </div>
        <ul className="nav-links">
          <li className="active"><i className="fas fa-cogs"></i> System</li>
          <li><i className="fas fa-users"></i> Users</li>
          <li><i className="fas fa-book"></i> Catalog</li>
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