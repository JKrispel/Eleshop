const express = require('express');
const { db } = require('../firebase-config');
const { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs } = require('firebase/firestore');

const router = express.Router();

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Pobierz zamówienia użytkownika
      const ordersRef = collection(db, "Orders");
      const ordersSnapshot = await getDocs(ordersRef);
  
      // Filtruj zamówienia, aby znaleźć te z odpowiednim userId
      let orderId = null;
      ordersSnapshot.forEach(orderDoc => {
        const orderData = orderDoc.data();
        if (orderData.userId === userId) {
          orderId = orderDoc.id; // ID zamówienia
        }
      });
  
      if (!orderId) {
        return res.status(404).json({ error: "Nie znaleziono zamówienia dla tego użytkownika" });
      }
  
      // Referencja do podkolekcji OrderedProducts
      const orderedProductsRef = collection(db, "Orders", orderId, "OrderedProducts");
      const orderedProductsSnapshot = await getDocs(orderedProductsRef);
  
      // Pobierz produkty z podkolekcji
      const items = [];
      orderedProductsSnapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
      });
  
      // Zwróć produkty jako JSON
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({
        error: 'Nie udało się pobrać produktów',
        details: error.message
      });
    }
  });
  

// Dodaj produkt do koszyka
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { productId, name, quantity, price } = req.body;

  try {
    const itemRef = doc(db, 'carts', userId, 'items', productId);
    await setDoc(itemRef, { name, quantity, price });
    res.status(201).json({ message: 'Produkt dodany do koszyka' });
  } catch (error) {
    res.status(500).json({ error: 'Nie udało się dodać produktu', details: error.message });
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
