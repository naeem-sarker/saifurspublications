// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDx5H2p2H7K8CBTsqIpL0aUkXaohaAAUpA",
    authDomain: "saifurspublications-auth.firebaseapp.com",
    projectId: "saifurspublications-auth",
    storageBucket: "saifurspublications-auth.firebasestorage.app",
    messagingSenderId: "577546879339",
    appId: "1:577546879339:web:eac819f8c73d7088e24c2e",
    measurementId: "G-L75ZQXVJDQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);