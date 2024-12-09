const express = require('express');
const cors = require('cors');
const productsRoutes = require('./routes/products');
const { db } = require('./firebase'); 
app.use(express.json());
const app = express();
app.use(cors());

app.use('/api/products', productsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
  
});

app.get('/users', async (req, res) => {
    try {
        const usersSnapshot = await db.collection('Users').get();
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users', details: error.message });
    }
});

// GET:all orders
app.get('/orders', async (req, res) => {
    try {
        const ordersSnapshot = await db.collection('Orders').get();
        const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders', details: error.message });
    }
});

// GET: all products
app.get('/products', async (req, res) => {
    try {
        const productsSnapshot = await db.collection('Products').get();
        const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products', details: error.message });
    }
});

// GET: Fetch product by ID or name
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
