import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate that the API key is present
if (!firebaseConfig.apiKey) {
  throw new Error('Firebase API key is missing. Please check your .env.local file and ensure NEXT_PUBLIC_FIREBASE_API_KEY is set correctly.');
}

// Prevent Next.js from re-initializing Firebase during hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth only in the browser
const auth = typeof window !== "undefined" ? getAuth(app) : null;

export { app, auth };
