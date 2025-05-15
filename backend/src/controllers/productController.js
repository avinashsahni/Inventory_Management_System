const prisma = require('../utils/prismaClinet');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, stock_quantity }
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
