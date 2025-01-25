const express = require('express');
const { db } = require('../firebase-config');
const { getFirestore, collection, getDocs, addDoc, query, where } = require('firebase-admin/firestore');
const { auth } = require('firebase-admin');
const router = express.Router();

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decodedToken = await auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error); // Log the error
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Get items in the user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const cartCollection = collection(db, 'Carts');
    const q = query(cartCollection, where('userId', '==', req.user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(200).json({ message: 'No items in cart' });
    }

    const cartItems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error); // Log the error
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Add item to the user's cart
router.post('/', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cartCollection = collection(db, 'Carts');
    await addDoc(cartCollection, {
      userId: req.user.uid,
      productId,
      quantity
    });
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding item to cart:', error); // Log the error
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

module.exports = router;
