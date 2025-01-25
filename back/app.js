require('dotenv').config(); // Load environment variables

(async () => {
  const fetchModule = await import('node-fetch');
  global.fetch = fetchModule.default;
  global.Headers = fetchModule.Headers;
  global.Response = fetchModule.Response;

  const express = require('express');
  const cors = require('cors');
  const productsRoutes = require('./routes/products');
  const cartRoutes = require('./routes/cart');
  const authRoutes = require('./routes/auth');
  const { db } = require('./firebase-config');

  const admin = require('firebase-admin');
  const serviceAccount = require('./serviceAccountKey.json'); // Replace with your key file

  // Initialize Firebase Admin SDK
  if (!admin.apps.length) {
      admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
  }

  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use('/api/products', productsRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/auth', authRoutes);

  app.get('/api/external', async (req, res) => {
      try {
          const response = await fetch('https://api.example.com/data');
          const data = await response.json();
          res.json(data);
      } catch (error) {
          res.status(500).json({ error: 'Failed to fetch data' });
      }
  });

  app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
  });
})();
