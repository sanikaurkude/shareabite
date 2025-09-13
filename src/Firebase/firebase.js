// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // ✅ ADD THIS



// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAro1z8geSRTLYK0w5VqIYv3nz52tmQPSU",
  authDomain: "shareabite-85322.firebaseapp.com",
  projectId: "shareabite-85322",
  storageBucket: "shareabite-85322.firebasestorage.app",
  messagingSenderId: "211493624960",
  appId: "1:211493624960:web:3839b71eef408e67cb5a65",
  measurementId: "G-KGJ7JMD3PB"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ ADD THIS

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User Info:", result.user);
    return result.user;
  } catch (error) {
    console.error("Google Sign-in Error:", error);
    throw error;
  }
};

export { auth, db, storage, signInWithGoogle }; // ✅ EXPORT STORAGE


