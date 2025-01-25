const express = require('express');
const { db } = require('../firebase-config');
const { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, query, where } = require('firebase-admin/firestore');
const { auth } = require('firebase-admin'); // Firebase Admin Auth
const router = express.Router();

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  try {
    const decodedToken = await auth().verifyIdToken(idToken);
    req.user = decodedToken; // Attach decoded token to the request
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Get all items in the user's cart
router.get('/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const cartRef = db.collection('Users').doc(userId).collection('Cart');
    const cartSnapshot = await cartRef.get();
    if (cartSnapshot.empty) {
      return res.status(404).json({ error: 'Koszyk użytkownika jest pusty' });
    }

    const items = [];
    cartSnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({
      error: 'Nie udało się pobrać produktów z koszyka',
      details: error.message,
    });
  }
});

// Add a product to the cart
router.post('/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;
  if (!productId || typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Invalid input: Product ID and quantity are required' });
  }

  try {
    const itemRef = db.collection('Users').doc(userId).collection('Cart').doc(productId);
    const itemSnapshot = await itemRef.get();

    if (itemSnapshot.exists) {
      const existingData = itemSnapshot.data();
      const newQuantity = existingData.quantity + quantity;
      await itemRef.set({ quantity: newQuantity }, { merge: true });
    } else {
      await itemRef.set({ quantity });
    }

    res.status(201).json({ message: 'Produkt dodany do koszyka' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Nie udało się dodać produktu do koszyka', details: error.message });
  }
});

// Update quantity of a product in the cart
router.put('/:userId/update', verifyToken, async (req, res) => {
  const { userId } = req.params;
  const { productId, delta } = req.body;
  if (!productId || typeof delta !== 'number') {
    return res.status(400).json({ error: 'Invalid input: Product ID and delta are required' });
  }

  try {
    const itemRef = db.collection('Users').doc(userId).collection('Cart').doc(productId);
    const itemSnapshot = await itemRef.get();

    if (!itemSnapshot.exists) {
      return res.status(404).json({ error: 'Produkt nie znaleziony w koszyku' });
    }

    const currentData = itemSnapshot.data();
    const newQuantity = (currentData.quantity || 0) + delta;

    if (newQuantity < 0) {
      return res.status(400).json({ error: 'Ilość nie może być mniejsza niż zero' });
    }

    await itemRef.update({ quantity: newQuantity });
    res.status(200).json({ message: 'Ilość produktu została zaktualizowana' });
  } catch (error) {
    console.error('Error updating product quantity:', error);
    res.status(500).json({
      error: 'Nie udało się zaktualizować ilości produktu',
      details: error.message,
    });
  }
});

// Delete a product from the cart
router.delete('/:userId/:productId', verifyToken, async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const itemRef = db.collection('Users').doc(userId).collection('Cart').doc(productId);
    await itemRef.delete();

    res.status(200).json({ message: 'Produkt usunięty z koszyka' });
  } catch (error) {
    console.error('Error deleting product from cart:', error);
    res.status(500).json({
      error: 'Nie udało się usunąć produktu z koszyka',
      details: error.message,
    });
  }
});

module.exports = router;
