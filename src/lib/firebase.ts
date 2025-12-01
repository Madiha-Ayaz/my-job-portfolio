import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate that the API key is present
if (!firebaseConfig.apiKey) {
  throw new Error('Firebase API key is missing. Please check your .env file and ensure VITE_FIREBASE_API_KEY is set correctly.');
}

// Prevent Next.js from re-initializing Firebase during hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth only in the browser
const auth = typeof window !== "undefined" ? getAuth(app) : null;

export { app, auth };
