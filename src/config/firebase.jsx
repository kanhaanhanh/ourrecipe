// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getAuth, onAuthStateChanged, updateProfile} from "firebase/auth";
import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {getFirestore} from 'firebase/firestore'
import { getDatabase } from "firebase/database";
// import firebase_credentail from "./credentail";

const firebaseConfig = {
    apiKey: "AIzaSyAR3Lv9Nh7jkaLeca9aWmaVs1yQ8aeGzWA",
    authDomain: "ourrecipe-c7a14.firebaseapp.com",
    projectId: "ourrecipe-c7a14",
    storageBucket: "ourrecipe-c7a14.appspot.com",
    messagingSenderId: "41908839241",
    appId: "1:41908839241:web:f7e59e2628e1832359b098",
    measurementId: "G-00TE7Y24BC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default app;
export const database = getDatabase(app);
export const storage = getStorage(app);
const db = getFirestore(app);

export {auth,db};
// Custom Hook
export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, [])

  return currentUser;
}