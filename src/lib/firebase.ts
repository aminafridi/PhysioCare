import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB38HM_J98x4G743lrikQ0-MAoImppHtqQ",
    authDomain: "physiocare-62510.firebaseapp.com",
    projectId: "physiocare-62510",
    storageBucket: "physiocare-62510.firebasestorage.app",
    messagingSenderId: "1077226368631",
    appId: "1:1077226368631:web:69f6d6e245fdb5753b2072",
    measurementId: "G-PRFYLEG9YD"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;

