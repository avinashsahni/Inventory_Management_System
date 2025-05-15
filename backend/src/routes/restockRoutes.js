const express = require('express');
const router = express.Router();
const restockController = require('../controllers/restockController');

router.post('/restock', restockController.restockProduct);

module.exports = router;
