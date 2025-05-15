const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.post('/sales', saleController.createSale);

module.exports = router;
