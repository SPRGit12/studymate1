import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import PrivateRoute from './components/PrivateRoute';

// Import pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import ResourceUploader from './pages/ResourceUploader';
import StudyPlanCreator from "./pages/StudyPlanCreator";
import Roadmaps from './pages/Roadmaps.js';
import DsaRoadmap from './pages/DSAroadmap.js';

// Import Firebase auth
import { auth } from './services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f4f4f4'
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif'
  }
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth, 
      (user) => {
        setIsAuthenticated(!!user);
        setIsLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />; 
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/create-study-plan" element={<StudyPlanCreator />} />
          <Route 
          path="/upload-resource" 
          element={
            <PrivateRoute>
              <ResourceUploader />
            </PrivateRoute>
          } 
          />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/roadmap" element={<DsaRoadmap />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;