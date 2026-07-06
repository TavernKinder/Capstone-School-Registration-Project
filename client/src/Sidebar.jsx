import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function: if the current URL matches the path, add the "active" class
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="mtc-sidebar">
      <div className="mtc-logo-container">
        <div className="mtc-logo">M</div>
      </div>
      <ul className="nav-links">
        <li onClick={() => navigate("/profile")} className={isActive("/profile")}>
          <i className="fas fa-user"></i> Profile
        </li>
        <li onClick={() => navigate("/about")} className={isActive("/about")}>
          <i className="fas fa-info-circle"></i> About
        </li>
        <li onClick={() => navigate("/dashboard")} className={isActive("/dashboard") || isActive("/")}>
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </li>
        <li onClick={() => navigate("/courses")} className={isActive("/courses")}>
          <i className="fas fa-graduation-cap"></i> Courses
        </li>
        <li onClick={() => navigate("/calendar")} className={isActive("/calendar")}>
          <i className="fas fa-calendar-alt"></i> Calendar
        </li>
        <li onClick={() => navigate("/inbox")} className={isActive("/inbox")}>
          <i className="fas fa-inbox"></i> Inbox
        </li>
        <li onClick={() => navigate("/history")} className={isActive("/history")}>
          <i className="fas fa-history"></i> History
        </li>
        <li onClick={() => navigate("/resources")} className={isActive("/resources")}>
          <i className="fas fa-book"></i> Resources
        </li>
        <li onClick={() => navigate("/settings")} className={isActive("/settings")}>
          <i className="fas fa-cog"></i> Settings
        </li>
        <li onClick={() => navigate("/help")} className={isActive("/help")}>
          <i className="fas fa-question-circle"></i> Help
          <span className="badge">4</span>
        </li>
      </ul>
    </nav>
  );
}