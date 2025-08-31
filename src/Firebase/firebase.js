
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
const app = initializeApp(firebaseConfig);

// Auth + Providers
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

export default app;
