const prisma = require('../utils/prismaClinet');

exports.createSale = async (req, res) => {
  const { product_id, quantity_sold, discount_percentage } = req.body;

  // Validate input types
  if (
    !Number.isInteger(Number(product_id)) ||
    !Number.isInteger(Number(quantity_sold)) ||
    isNaN(Number(discount_percentage))
  ) {
    return res.status(400).json({ error: 'Invalid input types' });
  }

  try {
    const result = await prisma.$queryRawUnsafe(`
      SELECT * FROM calculate_sale(
        ${Number(product_id)}::INTEGER,
        ${Number(quantity_sold)}::INTEGER,
        ${Number(discount_percentage)}::DOUBLE PRECISION
      )
    `);
    res.json(result[0]);
  } catch (err) {
    console.error('Error executing calculate_sale:', err);
    res.status(400).json({ error: err.message });
  }
};
