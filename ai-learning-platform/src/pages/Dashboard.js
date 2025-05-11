import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './Dashboard.css';
import UserProfile from './UserProfile';
import ChatBot from '../components/ChatBot.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);
  const [recommendedResources, setRecommendedResources] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
        // Set up real-time listener for study plans
        const studyPlansQuery = query(
          collection(db, 'studyPlans'), 
          where('userId', '==', auth.currentUser.uid)
        );

        const unsubscribe = onSnapshot(studyPlansQuery, (snapshot) => {
          const studyPlans = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setStudyPlans(studyPlans);

          // Calculate learning progress
          const progress = calculateLearningProgress(studyPlans);
          setLearningProgress(progress);

          // Generate recommended resources
          const resources = generateRecommendedResources(studyPlans);
          setRecommendedResources(resources);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const unsubscribe = fetchUserData();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [navigate]);

  const calculateLearningProgress = (studyPlans) => {
    let total = studyPlans.length;
    let completed = studyPlans.filter(plan => plan.status === 'completed').length;
    let inProgress = studyPlans.filter(plan => plan.status === 'in-progress').length;
    let notStarted = studyPlans.filter(plan => plan.status === 'not-started').length;
    let overdue = studyPlans.filter(plan => plan.status === 'overdue').length;

    // If no plans exist, return 0% progress
    const progressPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      completed: completed,
      inProgress: inProgress,
      notStarted: notStarted,
      overdue: overdue,
      total: total,
      progressPercentage: progressPercentage
    };
  };

  const generateRecommendedResources = (studyPlans) => {
    // Updated resource map with URLs for each resource
    const resourceMap = {
      'Programming': [
        { title: 'JavaScript Advanced Techniques', url: 'https://javascript.info/' },
        { title: 'React.js Complete Guide', url: 'https://reactjs.org/docs/getting-started.html' },
        { title: 'Data Structures Masterclass', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2' }
      ],
      'Web Development': [
        { title: 'Modern Frontend Frameworks', url: 'https://web.dev/learn' },
        { title: 'Full Stack Development Tutorial', url: 'https://www.freecodecamp.org/learn' },
        { title: 'Performance Optimization Techniques', url: 'https://web.dev/performance' }
      ],
      'Default': [
        { title: 'Introduction to Programming', url: 'https://www.w3schools.com/programming/index.php' },
        { title: 'Basic Web Development', url: 'https://web.dev/learn' },
        { title: 'Data Structures & Algorithms', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2' }
      ]
    };
  
    // If no study plans, return default resources
    if (!studyPlans || studyPlans.length === 0) {
      return resourceMap['Default'];
    }
  
    // Collect resources based on subject areas
    const resources = studyPlans.reduce((acc, plan) => {
      // Safely handle undefined or empty subjectAreas
      const subjects = plan.subjectAreas || [];
      
      // Flatten resources for each subject
      subjects.forEach(subject => {
        const subjectResources = resourceMap[subject] || [];
        acc.push(...subjectResources);
      });
  
      return acc;
    }, []);
  
    // If no resources found, return default
    // Use a map-based approach to ensure uniqueness by title
    if (resources.length > 0) {
      const uniqueResources = {};
      resources.forEach(resource => {
        uniqueResources[resource.title] = resource;
      });
      
      return Object.values(uniqueResources).slice(0, 3);
    } else {
      return resourceMap['Default'];
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get status badge class for study plans
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "completed":
        return "status-badge completed";
      case "in-progress":
        return "status-badge in-progress";
      case "overdue":
        return "status-badge overdue";
      default:
        return "status-badge not-started";
    }
  };

  // Get human-readable status
  const getStatusText = (status) => {
    switch(status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "overdue":
        return "Overdue";
      default:
        return "Not Started";
    }
  };

  const progressChartData = {
    labels: ['Completed', 'In Progress', 'Not Started', 'Overdue'],
    datasets: [{
      data: [
        learningProgress?.completed || 0,
        learningProgress?.inProgress || 0,
        learningProgress?.notStarted || 0,
        learningProgress?.overdue || 0
      ],
      backgroundColor: ['#38A169', '#4299E1', '#A0AEC0', '#E53E3E']
    }]
  };

  if (!userProfile) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">StudyMate</div>
        <div className="user-controls">
          <div className="user-info">
            <span className="user-greeting">Hello, {userProfile.name || 'Learner'}</span>
          </div>
          <div className="profile-icon" onClick={() => setIsProfileOpen(true)}>
            <img 
              src={userProfile.profileUrl || "https://via.placeholder.com/40"} 
              alt="Profile" 
            />
          </div>
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </header>
      
      <div className="dashboard-grid">
        {/* Study Plan Section - Now first and takes more space */}
        <div className="card study-plans">
          <div className="card-header">
            <h2>Your Study Plans</h2>
            <button 
              onClick={() => navigate('/create-study-plan')}
              className="add-button"
            >
              Create New Plan
            </button>
          </div>
          
          {studyPlans.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any study plans yet.</p>
              <button 
                onClick={() => navigate('/create-study-plan')}
                className="create-first-plan"
              >
                Create Your First Plan
              </button>
            </div>
          ) : (
            <ul className="plans-list">
              {studyPlans.map((plan, index) => (
                <li key={plan.id || index} className="plan-item">
                  <div className="plan-content">
                    <h3 className="plan-title">{plan.topic}</h3>
                    <div className="plan-meta">
                      <div className="plan-date">
                        <span className="meta-label">Target Date:</span>
                        <span className="meta-value">{plan.targetDate}</span>
                      </div>
                      <div className={getStatusBadgeClass(plan.status)}>
                        {getStatusText(plan.status)}
                      </div>
                    </div>
                    <div className="plan-actions">
                      <button 
                        onClick={() => navigate(`/create-study-plan?edit=${plan.id}`)}
                        className="edit-plan-button"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-sidebar">
          {/* Learning Progress Section */}
          <div className="card learning-progress">
            <h2 className="card-header">Learning Progress</h2>
            {learningProgress && (
              <>
                <div className="progress-chart">
                  <Pie 
                    data={progressChartData} 
                    options={{ 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }} 
                  />
                </div>
                <div className="progress-stats">
                  <div className="progress-percentage">
                    <span className="percentage-number">{learningProgress.progressPercentage}%</span>
                    <span className="percentage-label">Complete</span>
                  </div>
                  <div className="plans-count">
                    <div className="count-item">
                      <span className="count-value">{learningProgress.completed}</span>
                      <span className="count-label">Completed</span>
                    </div>
                    <div className="count-item">
                      <span className="count-value">{learningProgress.total}</span>
                      <span className="count-label">Total Plans</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Recommended Resources Section - Now with hyperlinks */}
          <div className="card recommended-resources">
            <h2 className="card-header">Recommended Resources</h2>
            {recommendedResources.length > 0 ? (
              <ul className="resource-list">
                {recommendedResources.map((resource, index) => (
                  <li 
                    key={index} 
                    className="resource-item"
                  >
                    <div className="resource-icon">📚</div>
                    <div className="resource-content">
                      <div className="resource-title">{resource.title}</div>
                      <a 
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        <button className="explore-button">
                          Explore
                        </button>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <p>No recommendations available yet.</p>
              </div>
            )}
            <button 
              onClick={() => navigate('/contribute')}
              className="contribute-button"
            >
              Contribute Resources
            </button>
          </div>
          <ChatBot />
        </div>
      </div>
      <UserProfile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        userId={auth.currentUser?.uid} 
      />

      {/* Adding roadmap buttons here instead of in header */}
      <div className="roadmap">
        <p> To transform your plans to Structured Roadmaps:</p>
            <button 
              onClick={() => navigate('/roadmaps')} 
              className="roadmap-button"
            >Roadmaps
            </button>
          </div>
          <div className='DSA'>
            <p> To get a Structured plan to learn DSA: </p>
            <button 
              onClick={() => navigate('/roadmap')} 
              className="roadmap-button dsa-button"
            >
              DSA Roadmap
            </button>
          </div>
    </div>
  );
};

export default Dashboard;