const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Auth routes 
router.use('/auth', require('./authRoutes'));

// Protected routes
router.use('/customers', auth, require('./customerRoutes'));
router.use('/cases', auth, require('./caseRoutes'));

module.exports = router;
