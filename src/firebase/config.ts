// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADTjdZ8qyvo5D1PzEGl8txmoILAR-n1GE",
  authDomain: "masterhand-f5293.firebaseapp.com",
  projectId: "masterhand-f5293",
  storageBucket: "masterhand-f5293.firebasestorage.app",
  messagingSenderId: "109577543409",
  appId: "1:109577543409:web:9d97587f3daad06adb5350",
  measurementId: "G-KTW4ZDG56N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);