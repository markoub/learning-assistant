import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBoCa8qB4_7Y-SPtNrqUAvFJToM4LQFt9Y",
    authDomain: "learnify-quest.firebaseapp.com",
    projectId: "learnify-quest",
    storageBucket: "learnify-quest.appspot.com",
    messagingSenderId: "559698079138",
    appId: "1:559698079138:web:98b0d2a79e807a38b716fb",
    measurementId: "G-GEL1PZG7PB"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };