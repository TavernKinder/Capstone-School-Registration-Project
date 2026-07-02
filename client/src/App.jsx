// client/src/App.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "/src/App.css";

// Updated mock data for available courses with prefixed codes and visuals
const COURSE_CATALOG = [
  { id: 101, code: 'TEWP 1010', title: 'Introduction to Web Development', banner: '#701D21', visual: '💻', year: '2024-2025' },
  { id: 102, code: 'TEWP 1020', title: 'JavaScript Programming Fundamentals', banner: '#16a34a', visual: 'IS', year: '2024-2025' },
  { id: 103, code: 'TEWP 1030', title: 'Advanced React.js Patterns', banner: '#10b981', visual: '⚛️', year: '2024-2025' },
  { id: 104, code: 'TEWP 1040', title: 'Backend Programming & APIs', banner: '#059669', visual: '🛡️🐘', year: '2024-2025' },
  { id: 105, code: 'TEWP 1050', title: 'UI/UX Design Fundamentals', banner: '#c2410c', visual: '🎨', year: '2024-2025' },
];

function App() {
  const navigate = useNavigate();
  const [registeredCourses, setRegisteredCourses] = useState([]);

  // Add course to the student's schedule
  const handleRegister = (course) => {
    // Prevent duplicate registrations
    if (!registeredCourses.some((c) => c.id === course.id)) {
      setRegisteredCourses([...registeredCourses, course]);
    }
  };

  // Remove course from the schedule
  const handleDrop = (courseId) => {
    setRegisteredCourses(registeredCourses.filter((c) => c.id !== courseId));
  };

  // Calculate total registered credits (mock data, all courses are 3 for simplicity)
  const totalCredits = registeredCourses.length * 3;

  return (
    <div className="mtc-dashboard-container">
      {/* 1. MTC Left Navigation Sidebar */}
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
          
      {/* 2. Main Dashboard Content */}
      <main className="mtc-main-content">
        <header className="main-header">
          <h1>Dashboard</h1>
          <i className="fas fa-ellipsis-v kebab-menu"></i>
        </header>

        <section className="course-grid">
          {COURSE_CATALOG.map((course) => {
            const isRegistered = registeredCourses.some((c) => c.id === course.id);
            
            return (
              <div key={course.id} className="mtc-course-card">
                <div 
                  className="card-banner" 
                  style={{ backgroundColor: course.banner }}
                >
                  <div className="banner-visual">{course.visual}</div>
                  <i className="fas fa-ellipsis-v banner-kebab"></i>
                </div>
                <div className="card-content">
                  <h3 className="course-title">{course.code} {course.title}</h3>
                  <p className="course-details">{course.code} {course.title.substring(0, 20)}...</p>
                  <p className="academic-year">{course.year}</p>
                </div>
                {/* Embedded functional button */}
                <button 
                  onClick={() => handleRegister(course)} 
                  disabled={isRegistered}
                  className="btn-mtc-register"
                >
                  {isRegistered ? 'Enrolled' : 'Register'}
                </button>
              </div>
            );
          })}
        </section>
      </main>

      {/* 3. MTC Right Info Sidebar */}
      <aside className="mtc-right-sidebar">
        <div className="right-header">
          <img src="https://mtech.edu/wp-content/uploads/2021/08/mtc-logo.png" alt="MTC Logo" className="mtc-full-logo" />
        </div>

        <div className="right-section">
          <h2>To Do</h2>
          <p className="empty-state-text">Nothing for now</p>
        </div>

        <div className="right-section">
          <h2>Recent Feedback</h2>
          <p className="empty-state-text">Nothing for now</p>
        </div>

        <button className="btn-mtc-grades">View Grades</button>

        {/* Integrated My Schedule Section */}
        <div className="right-section my-schedule-section">
          <div className="credit-tracker-header">
            <span>My Schedule (Credits: <strong>{totalCredits}</strong>)</span>
          </div>
          
          {registeredCourses.length === 0 ? (
            <p className="empty-state-text italic">Not registered yet.</p>
          ) : (
            <div className="schedule-list">
              {registeredCourses.map((course) => (
                <div key={course.id} className="schedule-item">
                  <div>
                    <h4>{course.code}</h4>
                    <p>{course.year}</p>
                  </div>
                  <button 
                    onClick={() => handleDrop(course.id)} 
                    className="btn-danger-sm"
                  >
                    Drop
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default App;
