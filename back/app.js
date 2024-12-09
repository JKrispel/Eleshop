const express = require('express');
const cors = require('cors');
const productsRoutes = require('./routes/products');
const { db } = require('./firebase-config'); 

const app = express(); // Inicjalizacja aplikacji

app.use(express.json()); // Middleware do parsowania JSON
app.use(cors()); // Middleware CORS

// Obsługa routingu produktów
app.use('/api/products', productsRoutes);

// Obsługa nieznalezionych tras
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found ale diala' });
});

// Endpoint: Pobierz użytkowników
app.get('/users', async (req, res) => {
    try {
        const usersSnapshot = await db.collection('Users').get();
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users', details: error.message });
    }
});

// Endpoint: Pobierz wszystkie zamówienia
app.get('/orders', async (req, res) => {
    try {
        const ordersSnapshot = await db.collection('Orders').get();
        const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders', details: error.message });
    }
});

// Endpoint: Pobierz wszystkie produkty
app.get('/products', async (req, res) => {
    try {
        const productsSnapshot = await db.collection('Products').get();
        const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products', details: error.message });
    }
});

// Endpoint: Pobierz produkt po ID lub nazwie
app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const productDoc = await db.collection('Products').doc(productId).get();
        if (productDoc.exists) {
            res.status(200).json({ id: productDoc.id, ...productDoc.data() });
        } else {
            const productsSnapshot = await db.collection('Products')
                .where('name', '==', productId)
                .get();
            if (productsSnapshot.empty) {
                res.status(404).json({ error: 'Product not found' });
            } else {
                const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                res.status(200).json(products);
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product', details: error.message });
    }
});

const PORT = process.env.PORT; 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
