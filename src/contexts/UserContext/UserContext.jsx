// Import necessary functions and modules
import { createContext, useContext, useEffect, useState } from "react";
import { AuthErrorCodes } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { getDoc, doc, setDoc } from 'firebase/firestore';

// Create a context for user authentication
export const userAuthContext = createContext();

// Create a provider for the user authentication context
export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");

  // Function to get user role from Firestore
  async function getUserRole(uid) {
    try {
      const docSnap = await getDoc(doc(db, 'userinformation', uid));
      const userData = docSnap.data();

      if (docSnap.exists()) {
        return userData.role;
      } else {
        console.error("User role not found for UID:", uid);
        return null;
      }
    } catch (error) {
      console.error("Error getting user role:", error.message);
      throw error;
    }
  }

  // Function to log in (now supports Google login)
  async function logIn(email, password, provider = null) {
    try {
      let userCredential;

      if (provider === 'google') {
        const googleProvider = new GoogleAuthProvider();
        userCredential = await signInWithPopup(auth, googleProvider);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;

      // Retrieve the user's role from the database
      const userRole = await getUserRole(user.uid);

      return userRole;
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
  }

  // Function to sign up
  const signUp = async (email, password, firstname, lastname) => {
    setError(""); // Clear any previous errors

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      const ref = doc(db, "userinformation", result.user.uid);
      const docRef = await setDoc(ref, { email, firstname, lastname, role: 'user' });

      alert("Your data has been added!");
    } catch (error) {
      handleAuthError(error);
    }
  };

  // Function to log out
  function logOut() {
    return signOut(auth);
  }

  // Use effect to listen for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Function to check if the user is a guest
  const isGuest = () => {
    return user && signInAnonymously(user);
  };

  // Function to handle authentication errors
  const handleAuthError = (error) => {
    if (error.code === 'auth/email-already-in-use') {
      setError("Email is already in use. Try another email.");
    } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
      setError("Password must be at least 6 characters.");
    } else {
      setError(error.message);
    }
  };

  // Provide the context value to the components
  return (
    <userAuthContext.Provider value={{ user, logIn, signUp, logOut, isGuest }}>
      {children}
    </userAuthContext.Provider>
  );
}

// Function to use the user authentication context
export function useUserAuth() {
  return useContext(userAuthContext);
}
