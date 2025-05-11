import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Roadmaps.css';
import RoadMapEditor from '../components/RoadMapEditor';

const roadmaps = [
  { title: "Frontend Developer", url: "https://roadmap.sh/frontend", image: "https://roadmap.sh/roadmaps/frontend.png" },
  { title: "Backend Developer", url: "https://roadmap.sh/backend", image: "https://roadmap.sh/roadmaps/backend.png" },
  //{ title: "Full Stack Developer", url: "https://roadmap.sh/full-stack", image: "https://roadmap.sh/roadmaps/fullstack.png" }
];

const Roadmaps = () => {
  const navigate = useNavigate();
  const [showEditor, setShowEditor] = useState(false);

  // Toggle editor visibility
  const toggleEditor = () => {
    setShowEditor(!showEditor);
  };

  return (
    <div className="roadmaps-container">
      <div className="navigation-controls">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="back-button">
          ⬅ Back to Dashboard
        </button>
        <button 
          onClick={toggleEditor} 
          className="editor-button">
          {showEditor ? "Close Editor" : "Custom Roadmap Editor"}
        </button>
      </div>
      
      {showEditor ? (
        <div className="editor-container">
          <RoadMapEditor />
        </div>
      ) : (
        <>
          <h1>Learn using Structured Roadmaps</h1>
          <p>Create your own custom learning path using the editor provided above.</p>
          <p>Here are few Existing Roadmaps:</p>

          <div className="roadmap-grid">
            {roadmaps.map((roadmap, index) => (
              <a key={index} href={roadmap.url} target="_blank" rel="noopener noreferrer" className="roadmap-card">
                <img src={roadmap.image} alt={`${roadmap.title} roadmap`} />
                <h2>{roadmap.title}</h2>
              </a>
            ))}
          </div>
          <p>For more roadmaps visit: <a href='https://roadmap.sh/roadmaps' target="_blank" rel="noopener noreferrer">Roadmaps.sh</a></p>
        </>
      )}
    </div>
  );
};

export default Roadmaps;