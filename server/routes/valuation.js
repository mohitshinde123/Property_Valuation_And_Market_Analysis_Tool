const express = require('express');
const router = express.Router();
const { getValuation } = require('../controllers/valuationController');

router.post('/', getValuation);

module.exports = router;
