const prisma = require('../utils/prismaClinet');

exports.getLogs = async (req, res) => {
  try {
    const logs = await prisma.inventoryLog.findMany();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
