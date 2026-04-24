const express = require('express');
const router = express.Router();
const {
  getProperties, getProperty, createProperty, updateProperty, deleteProperty,
  getFeaturedProperties, getMyProperties, getCities, getLocalities,
} = require('../controllers/propertyController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/cities', getCities);
router.get('/localities', getLocalities);
router.get('/my', auth, getMyProperties);
router.get('/:id', getProperty);
router.post('/', auth, authorize('seller', 'agent', 'admin'), upload.array('images', 10), createProperty);
router.put('/:id', auth, upload.array('images', 10), updateProperty);
router.delete('/:id', auth, deleteProperty);

module.exports = router;
