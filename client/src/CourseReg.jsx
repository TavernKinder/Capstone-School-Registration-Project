import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "/src/App.css";

export default function CourseReg() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  return (
    <div className="mtc-dashboard-container">
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
          <h1>Course Registration</h1>
        </header>

        {/* Search & Filter Bar */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search for courses (e.g. TEWP 1010)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flexGrow: 1, padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
          />
          <button className="btn-mtc-register" style={{ width: 'auto', margin: 0, padding: '0 1.5rem' }}>Search</button>
        </div>

        {/* Course List Area */}
        <div className="course-grid">
           {/* You can map over your COURSE_CATALOG here just like in App.jsx */}
           <div className="mtc-course-card" style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--secondary-text)' }}>
             <p>Use the search bar above to find courses for the upcoming semester.</p>
           </div>
        </div>
      </main>

      {/* Right Sidebar - Cart/Schedule Preview */}
      <aside className="mtc-right-sidebar">
        <div className="right-section">
          <h2>Registration Cart</h2>
          <p className="empty-state-text italic">No courses selected yet.</p>
        </div>
        <button className="btn-mtc-register" style={{ width: '100%', margin: '1rem 0' }} disabled>
          Finalize Registration
        </button>
      </aside>
    </div>
  );
}