const prisma = require('../utils/prismaClinet');

exports.createSale = async (req, res) => {
  const { product_id, quantity_sold, discount_percentage } = req.body;
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM calculate_sale(${product_id}, ${quantity_sold}, ${discount_percentage})
    `;
    res.json(result[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
