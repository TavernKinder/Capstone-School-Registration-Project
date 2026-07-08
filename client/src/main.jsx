import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import Profile from './pages/Profile.jsx'
import About from './pages/About.jsx'
import CourseReg from './pages/CourseReg.jsx'
import Administration from './pages/Administration.jsx'
import StudentLayout from './layouts/StudentLayout.jsx'
import StaffLayout from './layouts/StaffLayout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import StudentLogin from './pages/StudentLogin.jsx'
import StaffLogin from './pages/StaffLogin.jsx'
import RoleProtectedRoute from './components/RoleProtectedRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* The path is what shows in the URL bar, the element is the .jsx file to load */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/studentlogin" element={<StudentLogin />} /> 
        <Route path="/stafflogin" element={<StaffLogin />} /> 
        <Route element={<RoleProtectedRoute requiredRole="student" loginPath="/studentlogin" />}>
          <Route path="/student" element={<StudentLayout />} > 
            <Route index element={<App />} />
            <Route path="dashboard" element={<App />} />
            <Route path="courses" element={<CourseReg />} />
            <Route path="profile" element={<Profile />} />
            <Route path="about" element={<About />} />
          </Route>
        </Route>
        <Route element={<RoleProtectedRoute requiredRole="staff" loginPath="/stafflogin" />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<Administration />} />
            <Route path="dashboard" element={<Administration />} />
            <Route path="courses" element={<CourseReg />} />
            <Route path="profile" element={<Profile />} />
            <Route path="about" element={<About />} />
          </Route>
        </Route>
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
