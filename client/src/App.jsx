import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails'; // <--- 1. IMPORT THIS

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />

        {/* 2. ADD THIS ROUTE */}
        {/* This tells React: "If the URL matches /project/ID, show the Details page" */}
        <Route 
          path="/project/:id" 
          element={isAuthenticated ? <ProjectDetails /> : <Navigate to="/login" />} 
        />
        
        {/* This is the catch-all that was sending you to login before */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;