// Firebase setup for ResumeArchitect AI / CVPilot
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCRc2Tq4ZTIeKpoX5xsj-DeAideMcNGuIg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cvpilot-5d8b9.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cvpilot-5d8b9',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cvpilot-5d8b9.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '147654997977',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:147654997977:web:3096d0b87d89b23d3e8bc8',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-RBYDNJXG2Y'
};

// Initialize Firebase with fallback protection
let app: any;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  console.error("Firebase init error:", e);
}

export const auth = app ? getAuth(app) : ({} as any);
export const db = app ? getFirestore(app) : ({} as any);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Initialize Analytics conditionally
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
};
export type { User };

export default app;
