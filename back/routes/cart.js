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
router.put('/:userId/update', async (req, res) => {
  const { userId } = req.params;
  const { productId, delta } = req.body;

  try {
    const itemRef = db.collection('Users').doc(userId).collection('Cart').doc(productId);
    const itemSnapshot = await itemRef.get();

    if (!itemSnapshot.exists) {
      return res.status(404).json({ error: "Produkt nie znaleziony w koszyku" });
    }

    const currentData = itemSnapshot.data();
    const currentQuantity = currentData.quantity || 0;
    const newQuantity = currentQuantity + delta;

    if (newQuantity < 0) {
      return res.status(400).json({ error: "Ilość nie może być mniejsza niż zero" });
    }

    await itemRef.update({ quantity: newQuantity });

    // Fetch and return the updated cart
    const cartRef = db.collection('Users').doc(userId).collection('Cart');
    const cartSnapshot = await cartRef.get();
    const updatedCart = [];
    cartSnapshot.forEach((doc) => {
      updatedCart.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(updatedCart); // Return the updated cart as an array
  } catch (error) {
    console.error('Error updating product quantity:', error);
    res.status(500).json({
      error: 'Nie udało się zaktualizować ilości produktu',
      details: error.message,
    });
  }
});




// Usuń produkt z koszyka
router.delete('/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Reference to the specific product in the Cart subcollection
    const itemRef = db.collection('Users').doc(userId).collection('Cart').doc(productId);

    // Delete the product from the cart
    await itemRef.delete();

    res.status(200).json({ message: 'Produkt usunięty z koszyka' });
  } catch (error) {
    console.error('Error deleting product from cart:', error);
    res.status(500).json({
      error: 'Nie udało się usunąć produktu',
      details: error.message,
    });
  }
});


module.exports = router;
