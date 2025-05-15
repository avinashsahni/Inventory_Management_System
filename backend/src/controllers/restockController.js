const prisma = require('../utils/prismaClinet');

exports.restockProduct = async (req, res) => {
  const { product_id, quantity_to_add } = req.body;
  try {
    await prisma.$queryRaw`
      SELECT restock_product(${product_id}::integer, ${quantity_to_add}::integer)
    `;
    res.json({ message: 'Product restocked successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
