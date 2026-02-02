// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  authDomain: "blog-mern-a7a2e.firebaseapp.com",
  projectId: "blog-mern-a7a2e",
  storageBucket: "blog-mern-a7a2e.firebasestorage.app",
  messagingSenderId: "383692616384",
  appId: "1:383692616384:web:36e3c77a3ff30f89057325"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);