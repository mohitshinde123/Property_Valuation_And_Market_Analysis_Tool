const express = require('express');
const router = express.Router();
const { createLead, getMyLeads, updateLead, getAllLeads } = require('../controllers/leadController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, createLead);
router.get('/my', auth, getMyLeads);
router.put('/:id', auth, updateLead);
router.get('/all', auth, authorize('admin'), getAllLeads);

module.exports = router;
