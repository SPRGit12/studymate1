import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYMp3LDznzGJBS08-_vIuM897Ny9JfrFM",
  authDomain: "ai-learning-platform-89896.firebaseapp.com",
  projectId: "ai-learning-platform-89896",
  storageBucket: "ai-learning-platform-89896.appspot.com",
  messagingSenderId: "866455426083",
  appId: "1:866455426083:web:f6110e6550e39ee715cd96",
  measurementId: "G-2DQ8CQR3Y0"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAnalytics = getAnalytics(firebaseApp);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { 
  firebaseApp, 
  firebaseAnalytics, 
  auth, 
  db, 
  storage 
};