const express = require('express');
const { db } = require('../firebase-config'); // Ensure firebase-config is correct
const router = express.Router();

// Test endpoint
router.get('/test', async (req, res) => {
    try {
        console.log('Database initialized:', db); // Confirm database connection
        res.status(200).json({ message: "Test route is working!" });
    } catch (error) {
        console.error('Test route error:', error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

// Test database connection
router.get('/test_bazy', async (req, res) => {
    try {
        const snapshot = await db.collection('Products').limit(1).get(); // Fetch first document from "Products" collection
        if (snapshot.empty) {
            return res.status(200).json({ message: "Connected to database, but no data found." });
        }

        res.status(200).json({ message: "Connected to database and data is available." });
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ message: "Failed to connect to database", error: error.message });
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('Products').get(); // Fetch all documents from "Products" collection

        if (snapshot.empty) {
            return res.status(200).json([]);
        }

        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(products); // Return list of products
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

module.exports = router;
