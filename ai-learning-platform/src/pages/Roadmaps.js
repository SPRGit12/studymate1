import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Roadmaps.css';

const roadmaps = [
  { title: "Frontend Developer", url: "https://roadmap.sh/frontend", image: "https://roadmap.sh/roadmaps/frontend.png" },
  { title: "Backend Developer", url: "https://roadmap.sh/backend", image: "https://roadmap.sh/roadmaps/backend.png" },
  //{ title: "Full Stack Developer", url: "https://roadmap.sh/full-stack", image: "https://roadmap.sh/roadmaps/fullstack.png" }
];

const Roadmaps = () => {
    const navigate = useNavigate();

  return (
    <div className="roadmaps-container">
        <button 
        onClick={() => navigate('/dashboard')} 
        className="back-button">
        ⬅ Back to Dashboard
      </button>
      <h1>Roadmaps</h1>
      <h3>Click on a roadmap to explore it.</h3>

      <div className="roadmap-grid">
        {roadmaps.map((roadmap, index) => (
          <a key={index} href={roadmap.url} target="_blank" rel="noopener noreferrer" className="roadmap-card">
            <img src={roadmap.image} alt={`${roadmap.title} roadmap`} />
            <h2>{roadmap.title}</h2>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;