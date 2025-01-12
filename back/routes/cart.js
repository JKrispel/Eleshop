const express = require('express');
const { db } = require('../firebase-config');
const { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs } = require('firebase/firestore');

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Reference to the Cart subcollection under the user document
    const cartRef = db.collection('Users').doc(userId).collection('Cart');

    // Get all documents from the Cart subcollection
    const cartSnapshot = await cartRef.get();

    if (cartSnapshot.empty) {
      return res.status(404).json({ error: "Koszyk użytkownika jest pusty" });
    }

    // Fetch and format the cart items
    const items = [];
    cartSnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });

    // Return the cart items as JSON
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({
      error: 'Nie udało się pobrać produktów z koszyka',
      details: error.message,
    });
  }
});

  

// Add product to cart
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body; // Removed 'price' and 'name'

  try {
    // Reference to the Cart subcollection under the user document
    const itemRef = db
      .collection('Users') // Top-level 'Users' collection
      .doc(userId) // Specific user document
      .collection('Cart') // Subcollection 'Cart'
      .doc(productId); // Specific product document in the Cart

    // Get the current document to check if it already exists
    const itemSnapshot = await itemRef.get();
    if (itemSnapshot.exists) {
      const existingData = itemSnapshot.data();
      const newQuantity = existingData.quantity + quantity;

      // Update the cart item with the new quantity
      await itemRef.set({ quantity: newQuantity }, { merge: true });
    } else {
      // Add the product to the cart with the specified quantity
      await itemRef.set({ quantity });
    }

    res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Failed to add product to cart', details: error.message });
  }
});


// Aktualizuj produkt w koszyku
router.put('/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const itemRef = doc(db, 'carts', userId, 'items', productId);
    await updateDoc(itemRef, { quantity });
    res.status(200).json({ message: 'Produkt zaktualizowany' });
  } catch (error) {
    res.status(500).json({ error: 'Nie udało się zaktualizować produktu', details: error.message });
  }
});

// Usuń produkt z koszyka
router.delete('/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const itemRef = doc(db, 'carts', userId, 'items', productId);
    await deleteDoc(itemRef);
    res.status(200).json({ message: 'Produkt usunięty z koszyka' });
  } catch (error) {
    res.status(500).json({ error: 'Nie udało się usunąć produktu', details: error.message });
  }
});

module.exports = router;
