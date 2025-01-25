const express = require('express');
const { db } = require('../firebase-config');
const { collection, getDocs } = require('firebase/firestore'); // Import Firestore functions
const router = express.Router();


router.get('/test', async (req, res) => {
    try {
        res.status(200).json({ message: "Test route is working!" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
    console.log('Database initialized:', db);

});


//połączenie z bazą danych
router.get('/test_bazy', async (req, res) => {
    try {
        const snapshot = await db.collection('Products').limit(1).get();
        if (snapshot.empty) {
            res.status(200).json({ message: "Connected to database, but no data found." });
        } else {
            res.status(200).json({ message: "Connected to database and data is available." });
        }
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ message: "Failed to connect to database", error: error.message });
    }
});

// Trasa zwracająca listę produktów
router.get('/', async (req, res) => {
    try {
        const productsCollection = collection(db, 'Products'); // Use collection function
        const snapshot = await getDocs(productsCollection); // Use getDocs function

        if (snapshot.empty) {
            return res.status(200).json({ message: "No products found." });
        }

        // Tworzymy listę produktów na podstawie danych z Firestore
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
});


module.exports = router;
