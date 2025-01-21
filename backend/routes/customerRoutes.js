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

router.get('/status-counts', protect, restrictTo(['Admin', 'SalesUser', 'SalesManager']), getStatusCounts);
router.get('/', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), getAllCustomers);
router.get('/:id', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), getCustomerById);
router.put('/:id', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), updateCustomer);
router.delete('/:id', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), deleteCustomer);
router.post('/', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), createCustomer);
router.patch('/:id/status', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), pending);
router.patch('/:id/approve', protect, restrictTo(['SalesManager']), aprovePending);

module.exports = router;
