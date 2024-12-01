const express = require('express');
const cors = require('cors');
const productsRoutes = require('./routes/products');


const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/products', productsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
  
});
