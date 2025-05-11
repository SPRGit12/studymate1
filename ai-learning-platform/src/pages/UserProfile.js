import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../services/firebaseConfig';
import './UserProfile.css';

const UserProfile = ({ isOpen, onClose, userId }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    bio: 'I am learning to code!',
    profileUrl: 'https://via.placeholder.com/120'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({...user});
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setEditedUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchUserProfile();
    }
  }, [userId, isOpen]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };
  
  const uploadProfileImage = async () => {
    if (!profileImage || !userId) return null;
    
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profile-images/${userId}`);
      
      await uploadBytes(storageRef, profileImage);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      return null;
    }
  };
  
  const handleSave = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', userId);
      
      let updatedData = {...editedUser};
      
      // If there's a new profile image, upload it
      if (profileImage) {
        const imageUrl = await uploadProfileImage();
        if (imageUrl) {
          updatedData.profileUrl = imageUrl;
        }
      }
      
      await updateDoc(userDocRef, updatedData);
      setUser(updatedData);
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error updating user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <div className="profile-header">
          <div className="logo-container">
            <img src="/logo.png" alt="StudyMate AI Logo" className="profile-logo" />
          </div>
          <h2>User Profile</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        {isLoading ? (
          <div className="loading-profile">Loading profile data...</div>
        ) : (
          <>
            <div className="profile-content">
              <div className="profile-pic-container">
                <img 
                  src={profileImage ? URL.createObjectURL(profileImage) : user.profileUrl || "https://via.placeholder.com/120"} 
                  alt="Profile" 
                  className="profile-pic" 
                />
                {isEditing && (
                  <label htmlFor="profile-pic-upload" className="change-pic-btn">
                    Change Photo
                    <input 
                      id="profile-pic-upload"
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
              
              <div className="profile-details">
                {isEditing ? (
                  <>
                    <div className="edit-field">
                      <label>Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={editedUser.name || ''} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="edit-field">
                      <label>Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={editedUser.email || ''} 
                        onChange={handleInputChange} 
                        readOnly // Email should not be changed typically
                      />
                    </div>
                    
                    <div className="edit-field">
                      <label>Username</label>
                      <input 
                        type="text" 
                        name="username" 
                        value={editedUser.username || ''} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    
                    <div className="edit-field">
                      <label>Bio</label>
                      <textarea 
                        name="bio" 
                        value={editedUser.bio || ''} 
                        onChange={handleInputChange} 
                        rows="4"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h3>{user.name || 'No name set'}</h3>
                    <p className="username">@{user.username || 'username'}</p>
                    <p className="email">{user.email || 'No email set'}</p>
                    <p className="bio">{user.bio || 'No bio added yet.'}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="profile-footer">
              {isEditing ? (
                <>
                  <button 
                    className="cancel-btn" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUser({...user});
                      setProfileImage(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="save-btn" 
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button 
                  className="edit-btn" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;