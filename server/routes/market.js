const express = require('express');
const router = express.Router();
const {
  getCityTrends, getLocalityDetail, getTopLocalities, getAllCities, getMarketOverview,
} = require('../controllers/marketController');

router.get('/overview', getMarketOverview);
router.get('/cities', getAllCities);
router.get('/top-localities', getTopLocalities);
router.get('/city/:city', getCityTrends);
router.get('/locality/:city/:locality', getLocalityDetail);

module.exports = router;
