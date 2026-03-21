// Import Firebase core
import { initializeApp } from "firebase/app";

// Import services
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your config (keep same)
const firebaseConfig = {
  apiKey: "AIzaSyAQ9TY0CXc3RkXP4D40Sf2huJQehTjpC9g",
  authDomain: "zoecafe-92dde.firebaseapp.com",
  projectId: "zoecafe-92dde",
  storageBucket: "zoecafe-92dde.firebasestorage.app",
  messagingSenderId: "846173910809",
  appId: "1:846173910809:web:dda796d8a296ed003d7788"
};

// Initialize app
const app = initializeApp(firebaseConfig);

// ✅ ADD THESE (VERY IMPORTANT)
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;