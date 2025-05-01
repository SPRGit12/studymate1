import React, { useState, useEffect } from "react";
import { db, auth } from "../services/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./StudyPlanCreator.css";

const StudyPlanCreator = () => {
  const [plans, setPlans] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [status, setStatus] = useState("not-started"); // Added status field
  const [editingId, setEditingId] = useState(null);
  const [updatedTopic, setUpdatedTopic] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState(""); // For editing

  const navigate = useNavigate();

  // Fetch study plans from Firestore
  useEffect(() => {
    const fetchStudyPlans = async () => {
      if (!auth.currentUser) {
        navigate("/login");
        return;
      }
      
      const q = query(collection(db, "studyPlans"), where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const studyPlansData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlans(studyPlansData);
    };

    fetchStudyPlans();
  }, [navigate]);

  // Add a new study plan
  const addStudyPlan = async () => {
    if (!newTopic || !targetDate) return alert("Please enter both topic and target date.");
    
    const studyPlan = {
      topic: newTopic,
      targetDate,
      status: status, // Include status field
      userId: auth.currentUser.uid,
      createdAt: new Date()
    };

    try {
      const docRef = await addDoc(collection(db, "studyPlans"), studyPlan);
      setPlans([...plans, { id: docRef.id, ...studyPlan }]);
      setNewTopic("");
      setTargetDate("");
      setStatus("not-started");
    } catch (error) {
      console.error("Error adding study plan:", error);
    }
  };

  // Delete a study plan
  const deleteStudyPlan = async (id) => {
    try {
      await deleteDoc(doc(db, "studyPlans", id));
      setPlans(plans.filter(plan => plan.id !== id));
    } catch (error) {
      console.error("Error deleting study plan:", error);
    }
  };

  // Enable edit mode
  const startEditing = (id, topic, date, status) => {
    setEditingId(id);
    setUpdatedTopic(topic);
    setUpdatedDate(date);
    setUpdatedStatus(status || "not-started");
  };

  // Update a study plan
  const updateStudyPlan = async () => {
    if (!updatedTopic || !updatedDate) return alert("Fields cannot be empty.");
    
    try {
      const studyPlanRef = doc(db, "studyPlans", editingId);
      await updateDoc(studyPlanRef, { 
        topic: updatedTopic, 
        targetDate: updatedDate,
        status: updatedStatus,
        updatedAt: new Date()
      });

      setPlans(plans.map(plan => (
        plan.id === editingId 
          ? { ...plan, topic: updatedTopic, targetDate: updatedDate, status: updatedStatus } 
          : plan
      )));
      
      setEditingId(null);
      setUpdatedTopic("");
      setUpdatedDate("");
      setUpdatedStatus("");
    } catch (error) {
      console.error("Error updating study plan:", error);
    }
  };

  // Helper function to get status badge class
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

  // Helper function to get human-readable status
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

  return (
    <div className="study-plan-container">
      <div className="study-plan-header">
        <h1>Study Plan Creator</h1>
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {/* Add Study Plan */}
      <div className="add-plan-card">
        <h2>Create New Study Plan</h2>
        <div className="form-group">
          <label>Study Topic</label>
          <input
            type="text"
            placeholder="What do you want to learn?"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Target Completion Date</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        
        <button 
          className="add-plan-button" 
          onClick={addStudyPlan}
        >
          Create Study Plan
        </button>
      </div>

      {/* Study Plan List */}
      <div className="plans-list-card">
        <h2>Your Study Plans</h2>
        {plans.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any study plans yet.</p>
            <p>Create your first plan to start tracking your learning journey!</p>
          </div>
        ) : (
          <ul className="plans-list">
            {plans.map(plan => (
              <li key={plan.id} className="plan-item">
                {editingId === plan.id ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Study Topic</label>
                      <input 
                        type="text" 
                        value={updatedTopic} 
                        onChange={(e) => setUpdatedTopic(e.target.value)} 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Target Date</label>
                      <input 
                        type="date" 
                        value={updatedDate} 
                        onChange={(e) => setUpdatedDate(e.target.value)} 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Status</label>
                      <select 
                        value={updatedStatus}
                        onChange={(e) => setUpdatedStatus(e.target.value)}
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                    
                    <div className="edit-actions">
                      <button onClick={updateStudyPlan} className="save-button">
                        Save Changes
                      </button>
                      <button onClick={() => setEditingId(null)} className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="plan-content">
                    <div className="plan-details">
                      <h3>{plan.topic}</h3>
                      <div className="plan-meta">
                        <span className="date-label">Target Date:</span> 
                        <span className="date-value">{plan.targetDate}</span>
                        <span className={getStatusBadgeClass(plan.status)}>
                          {getStatusText(plan.status)}
                        </span>
                      </div>
                    </div>
                    <div className="plan-actions">
                      <button 
                        onClick={() => startEditing(plan.id, plan.topic, plan.targetDate, plan.status)} 
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteStudyPlan(plan.id)} 
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudyPlanCreator;