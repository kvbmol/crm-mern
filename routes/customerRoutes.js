const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Customer CRUD Routes
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

// Protect ALL customer routes with auth middleware
router.use(require('../middleware/auth'));

module.exports = router;
