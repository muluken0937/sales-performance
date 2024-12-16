const express = require('express');
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  pending,
  aprovePending,
  getStatusCounts
} = require('../controllers/customerController');

const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Define /status-counts route before dynamic :id routes
router.get('/status-counts', protect, restrictTo(['Admin', 'SalesUser', 'SalesManager']), getStatusCounts);
router.get('/', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), getAllCustomers);

// Define dynamic routes
router.get('/:id', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), getCustomerById);
router.put('/:id', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), updateCustomer);
router.delete('/:id', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), deleteCustomer);

// Define other routes
router.post('/', protect, restrictTo(['SalesUser']), createCustomer);
router.patch('/:id/status', protect, restrictTo(['SalesUser']), pending);
router.patch('/:id/approve', protect, restrictTo(['SalesManager']), aprovePending);

module.exports = router;
