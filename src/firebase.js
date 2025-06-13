// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // This imports the Firestore database service

// IMPORTANT: This part depends on whether you created src/firebaseConfig.js
// Option A: If you put your config directly in this file (simpler for now)
const firebaseConfig = {
  apiKey: "AIzaSyAEwIrU4yv0oymia-Q_SwJICrithjgCwiA",
  authDomain: "wedding-album-95efe.firebaseapp.com",
  projectId: "wedding-album-95efe",
  storageBucket: "wedding-album-95efe.firebasestorage.app",
  messagingSenderId: "G-GTFRKJFC3J",
  appId: "1:896111173394:web:87fa72339839f5439b1dcb"
};

// Option B: If you created a separate src/firebaseConfig.js file
// import firebaseConfig from './firebaseConfig'; // Uncomment this line if you use firebaseConfig.js
// And comment out the const firebaseConfig = { ... } block above

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Export the 'db' object so other parts of your app can use it
export { db }; // <--- THIS LINE IS CRITICAL for other files to import 'db'