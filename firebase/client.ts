// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHOWqAzp9oPI0nNGEh5ceq0oOnGyVBMlA",
  authDomain: "prephub-cba55.firebaseapp.com",
  projectId: "prephub-cba55",
  storageBucket: "prephub-cba55.firebasestorage.app",
  messagingSenderId: "971800434846",
  appId: "1:971800434846:web:518506183d0038c15c438f",
  measurementId: "G-WF5E1RFMR2"
};

// Initialize Firebase
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);