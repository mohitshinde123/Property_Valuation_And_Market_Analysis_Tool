const express = require('express');
const router = express.Router();
const {
  getAllUsers, updateUserRole, deleteUser, saveProperty, getSavedProperties,
  createSavedSearch, getSavedSearches, deleteSavedSearch, getDashboardStats,
} = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, authorize('admin'), getAllUsers);
router.put('/:id/role', auth, authorize('admin'), updateUserRole);
router.delete('/:id', auth, authorize('admin'), deleteUser);
router.post('/save-property/:propertyId', auth, saveProperty);
router.get('/saved-properties', auth, getSavedProperties);
router.post('/saved-searches', auth, createSavedSearch);
router.get('/saved-searches', auth, getSavedSearches);
router.delete('/saved-searches/:id', auth, deleteSavedSearch);
router.get('/dashboard-stats', auth, authorize('admin'), getDashboardStats);

module.exports = router;
