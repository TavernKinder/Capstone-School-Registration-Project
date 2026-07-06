import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/App.css";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="mtc-dashboard-container" style={{ gridTemplateColumns: '84px 1fr' }}>
      {/* Sidebar Navigation */}
      <Sidebar />

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