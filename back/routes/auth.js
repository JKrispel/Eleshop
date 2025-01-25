const express = require('express');
const { auth } = require('../firebase-config'); // Ensure firebase-config is correct
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    res.status(201).json({
      message: 'User created successfully.',
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      },
    });
  } catch (error) {
    console.error(`Error during signup: ${error.code} - ${error.message}`);
    // Check for specific error
    if (error.code === 'auth/configuration-not-found') {
      return res.status(500).json({
        error: 'Firebase Auth is not properly configured. Please check the Firebase configuration.',
        details: error.message,
      });
    }
    res.status(400).json({
      error: error.message || 'Failed to create user. Please check your input and try again.',
    });
  }
});

// Login route
router.post('/login', validateInput, async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
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
