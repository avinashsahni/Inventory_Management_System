const express = require('express');
const cors = require('cors');
require('dotenv').config();

const prisma = require('./src/utils/prismaClinet');
const port = process.env.PORT || 3000;
const frontend_Url = process.env.VITE_API_URL2;
const app = express();

app.use(cors({
  origin: frontend_Url,
  credentials: true
}));

app.use(express.json());

app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, stock_quantity } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, stock_quantity }
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sales', async (req, res) => {
  const { product_id, quantity_sold, discount_percentage } = req.body;
  try {
    const result = await pool.query(`SELECT * FROM calculate_sale($1, $2, $3)`, [
      product_id,
      quantity_sold,
      discount_percentage
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/restock', async (req, res) => {
  const { product_id, quantity_to_add } = req.body;
  try {
    await pool.query(`SELECT restock_product($1, $2)`, [
      product_id,
      quantity_to_add
    ]);
    res.json({ message: 'Product restocked successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/reports/sales', async (req, res) => {
  try {
    const totalSales = await prisma.sale.aggregate({
      _sum: {
        total_price: true,
        discount_applied: true,
      }
    });

    const topProduct = await prisma.sale.groupBy({
      by: ['product_id'],
      _sum: { quantity_sold: true },
      orderBy: {
        _sum: { quantity_sold: 'desc' }
      },
      take: 1,
    });

    const detailedSales = await prisma.sale.findMany({
      include: { product: true }
    });

    const salesWithProfit = detailedSales.map(sale => {
      const cost_price = sale.product.price * 0.6;
      const profit_margin = ((sale.total_price - (cost_price * sale.quantity_sold)) / sale.total_price) * 100;
      return {
        ...sale,
        profit_margin: profit_margin.toFixed(2) + '%'
      };
    });

    res.json({
      total_sales_amount: totalSales._sum.total_price || 0,
      total_discount_applied: totalSales._sum.discount_applied || 0,
      top_selling_product_id: topProduct[0]?.product_id,
      sales_with_profit_margin: salesWithProfit
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    const logs = await prisma.inventoryLog.findMany();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log("Server Running on port: " + port);
});
