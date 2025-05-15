const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./src/routes/productRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const restockRoutes = require('./src/routes/restockRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const logRoutes = require('./src/routes/logRoutes');

const app = express();
const port = process.env.PORT || 3000;

const frontend_Url = process.env.VITE_API_URL2;

app.use(cors({
  origin: frontend_Url,
  credentials: true
}));

app.use(express.json());

// Use routes
app.use('/api', productRoutes);
app.use('/api', saleRoutes);
app.use('/api', restockRoutes);
app.use('/api', reportRoutes);
app.use('/api', logRoutes);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
