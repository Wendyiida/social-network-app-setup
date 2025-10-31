
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "adema-5f897.firebaseapp.com",
  projectId: "adema-5f897",
  storageBucket: "adema-5f897.firebasestorage.app",
  messagingSenderId: "473798717349",
  appId: "1:473798717349:web:0257fff4a7302e2354824c",
  measurementId: "G-FYCVS9JDFJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;