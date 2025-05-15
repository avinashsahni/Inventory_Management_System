const prisma = require('../utils/prismaClinet');

exports.getSalesReport = async (req, res) => {
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
};
