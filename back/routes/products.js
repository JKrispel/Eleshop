const express = require('express');
const { db } = require('../firebase-config');
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
        const snapshot = await db.collection('products').limit(1).get();
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

module.exports = router;
