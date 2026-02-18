import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDFJee_Ne9gQpEe5rQr8cDuFYQKW-EaArc",
    authDomain: "jlv-disenos.firebaseapp.com",
    projectId: "jlv-disenos",
    storageBucket: "jlv-disenos.firebasestorage.app",
    messagingSenderId: "971569608973",
    appId: "1:971569608973:web:b4bf52c342dfce0aaf5844"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
