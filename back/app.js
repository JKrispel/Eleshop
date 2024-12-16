const express = require('express');
const cors = require('cors');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart')
const { db } = require('./firebase-config'); 

const app = express(); // Inicjalizacja aplikacji

app.use(express.json()); // Middleware do parsowania JSON
app.use(cors()); // Middleware CORS

// Obsługa routingu produktów
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
// Obsługa nieznalezionych tras
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found ale diala' });
});


const PORT = process.env.PORT; 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
