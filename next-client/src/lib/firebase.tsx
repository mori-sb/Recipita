// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCohm2aHMrUzO5ObRev0ZvfRebcmT_M88s",
  authDomain: "recipita-587c3.firebaseapp.com",
  projectId: "recipita-587c3",
  storageBucket: "recipita-587c3.firebasestorage.app",
  messagingSenderId: "1028629425458",
  appId: "1:1028629425458:web:e296ab4732d4d5ba4f7b2b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
