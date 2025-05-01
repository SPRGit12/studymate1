import React, { useState } from 'react';
import { db, storage, auth} from '../services/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const ResourceUploader = () => {
  const [resourceData, setResourceData] = useState({
    title: '',
    description: '',
    type: '', // Video, Document, Course, etc.
    difficulty: '', // Beginner, Intermediate, Advanced
    subject: '',
    tags: []
  });

  const [file, setFile] = useState(null);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    // Optional: Preview file or validate
    const fileExtension = uploadedFile.name.split('.').pop();
    const allowedTypes = ['pdf', 'docx', 'mp4', 'pptx'];

    if (!allowedTypes.includes(fileExtension.toLowerCase())) {
      alert('Unsupported file type');
      return;
    }
  };

  const submitResource = async (e) => {
    e.preventDefault();
    
    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `resources/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save resource metadata to Firestore
      await addDoc(collection(db, 'resources'), {
        ...resourceData,
        fileURL: downloadURL,
        uploadedAt: new Date(),
        uploadedBy: auth.currentUser.uid
      });

      alert('Resource uploaded successfully!');
    } catch (error) {
      console.error('Resource upload failed:', error);
    }
  };

  return (
    <div className="resource-uploader">
      <h2>Upload Learning Resource</h2>
      <form onSubmit={submitResource}>
        <input 
          type="text" 
          placeholder="Resource Title" 
          value={resourceData.title}
          onChange={(e) => setResourceData({
            ...resourceData, 
            title: e.target.value
          })}
        />
        
        <select 
          value={resourceData.type}
          onChange={(e) => setResourceData({
            ...resourceData, 
            type: e.target.value
          })}
        >
          <option>Select Resource Type</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
          <option value="course">Course</option>
        </select>

        <input 
          type="file" 
          onChange={handleFileUpload}
        />

        <button type="submit">Upload Resource</button>
      </form>
    </div>
  );
};

export default ResourceUploader;