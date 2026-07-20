import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXc1V3Iil4vwLFv00Z3khfFCFu6osF6sU",
  authDomain: "ai-study-8a0ff.firebaseapp.com",
  projectId: "ai-study-8a0ff",
  storageBucket: "ai-study-8a0ff.firebasestorage.app",
  messagingSenderId: "915940058603",
  appId: "1:915940058603:web:efb0fc286bff1e6c6fa5ae",
  measurementId: "G-0XQBPQXLFC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
