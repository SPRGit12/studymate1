import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="landing-header">
          <h1>StudyMate</h1>
          <p className="tagline">Your companion for self learning mastery</p>
        </div>
        
        <div className="features-section">
          <h2>Learn, Practice, and Master with StudyMate</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Personalized Learning Paths</h3>
              <p>Customized roadmaps based on your skill level and goals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>AI-Powered Solutions</h3>
              <p>Get intelligent guidance</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>DSA Mastery</h3>
              <p>Build strong foundations in Data Structures and Algorithms</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Track Progress</h3>
              <p>Monitor your growth with comprehensive analytics</p>
            </div>
          </div>
        </div>
        
        <div className="cta-section">
          <h2>Ready to accelerate your learning journey?</h2>
          <button className="cta-button" onClick={handleLoginClick}>
            Login / Sign Up
          </button>
        </div>
      </div>
      
      <footer className="landing-footer">
        <p>&copy; 2025 StudyMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;