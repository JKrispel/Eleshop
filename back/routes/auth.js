const express = require('express');
const { db, auth } = require('../firebase-config'); // Import db and auth correctly
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { doc, setDoc } = require('firebase-admin/firestore'); // Use correct imports from admin SDK
const router = express.Router();

// Middleware to validate input
const validateInput = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  next();
};

// Signup route
router.post('/register', validateInput, async (req, res) => {
  const { email, password } = req.body;
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(`User registered successfully: ${userCredential.user.email}`);

    // Generate token for the newly created user
    const token = await userCredential.user.getIdToken();

    // Add user data to Firestore
    const userRef = db.collection('Users').doc(userCredential.user.uid);
    await userRef.set({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'User created successfully.',
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        token, // Include token in the response
      },
    });
  } catch (error) {
    console.error(`Error during signup: ${error.code} - ${error.message}`);
    res.status(400).json({
      error: error.message || 'Failed to create user. Please check your input and try again.',
    });
  }
});


// Login route
router.post('/login', validateInput, async (req, res) => {
  const { email, password } = req.body;
  try {
    // Logowanie użytkownika w Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Pobranie tokenu z Firebase Auth
    const token = await userCredential.user.getIdToken(); // Arrow function ensures correct `this` binding
    console.log(`Generated token for user ${userCredential.user.email}:`, token);

    res.status(200).json({
      message: 'User logged in successfully.',
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        token,
      },
    });
  } catch (error) {
    console.error(`Error during login: ${error.code} - ${error.message}`);
    res.status(400).json({
      error: error.message || 'Failed to login. Please check your credentials and try again.',
    });
  }
});


module.exports = router;
