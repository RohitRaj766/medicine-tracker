// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBZQ7PTzmR0EFhNF9YlHt3qS-XVKldhsQ",
  authDomain: "sanjeevani-176a1.firebaseapp.com",
  projectId: "sanjeevani-176a1",
  storageBucket: "sanjeevani-176a1.firebasestorage.app",
  messagingSenderId: "213731760507",
  appId: "1:213731760507:web:26219dc062d48885aa85de",
  measurementId: "G-6X5XE3C4MK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);