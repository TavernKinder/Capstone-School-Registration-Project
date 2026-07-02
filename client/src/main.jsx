import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import Profile from './Profile.jsx'
import About from './About.jsx'
import CourseReg from './CourseReg.jsx'
import Administration from './Administration.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* The path is what shows in the URL bar, the element is the .jsx file to load */}
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<App />} />
        <Route path="/courses" element={<CourseReg />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<CourseReg />} />
        <Route path="/administration" element={<Administration />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
