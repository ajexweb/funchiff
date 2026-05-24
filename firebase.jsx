import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// DEBUG: चेक करो कि Vercel को कीज़ मिल रही हैं या नहीं
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

if (!apiKey) {
  console.error("❌ CRITICAL ERROR: VITE_FIREBASE_API_KEY is missing! Vercel environment variables not loaded.");
} else {
  console.log("✅ API Key found, initializing Firebase...");
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let auth, db;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getDatabase(app);
  console.log("🔥 Firebase Connection: SUCCESS");
} catch (error) {
  console.error("❌ Firebase Initialization Error: ", error);
}

export { auth, db };
