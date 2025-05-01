import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
  } from 'firebase/auth';
  import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc 
  } from 'firebase/firestore';
  import { auth, db } from './firebaseConfig';
  
  export const authService = {
    // Signup method remains the same as in previous version
    signUp: async (email, password, profileData) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        await updateProfile(user, {
          displayName: profileData.name
        });
  
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: profileData.name,
          educationLevel: profileData.educationLevel,
          learningGoals: profileData.learningGoals,
          createdAt: new Date(),
          lastLogin: new Date()
        });
  
        return user;
      } catch (error) {
        console.error("Signup Error:", error);
        throw error;
      }
    },
  
    // Other methods remain the same (login, logout, etc.)
    login: async (email, password) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (error) {
        console.error("Login Error:", error);
        throw error;
      }
    },
  
    logout: async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Logout Error:", error);
        throw error;
      }
    },
  
    // Google Sign-In method
    signInWithGoogle: async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
  
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName,
          createdAt: new Date(),
          lastLogin: new Date()
        }, { merge: true });
  
        return user;
      } catch (error) {
        console.error("Google Sign-In Error:", error);
        throw error;
      }
    }
  };