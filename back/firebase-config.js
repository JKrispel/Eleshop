require('dotenv').config(); // Load environment variables

const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth'); // Import getAuth
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./eleshop-94c3b-firebase-adminsdk-xpme7-eb87c79994.json'); // Replace with your key file

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID, // Add measurementId
  authDomain: process.env.FIREBASE_AUTH_DOMAIN, // Ensure this is present
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = getFirestore(admin.app()); // Ensure Firestore is initialized with admin app

// Add logging
console.log('Firebase Configuration:', firebaseConfig); // Log the configuration
console.log('Firebase App initialized:', !!app); // Check if the app is initialized
console.log('Firebase Auth initialized:', !!auth); // Check if Auth is initialized
console.log('Firebase Admin App initialized:', !!admin.apps.length); // Check if the app is initialized
console.log('Firestore DB initialized:', !!db); // Check if Firestore is initialized

module.exports = { db, auth, admin };
