import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC0xcmTRSQ6PH7_eq_zbNUgI8y_dNhOG0Q",
  authDomain: "byte-prep.firebaseapp.com",
  projectId: "byte-prep",
  storageBucket: "byte-prep.firebasestorage.app",
  messagingSenderId: "491174589602",
  appId: "1:491174589602:web:186432e1c2e85c79b053fb",
  measurementId: "G-S8T4DXYXR6"
};


const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
