const express = require('express');
const {
  createCustomer, 
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  pending,
  aprovePending
} = require('../controllers/customerController');  

const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, restrictTo(['SalesUser']), createCustomer); 
router.get('/', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), getAllCustomers);
router.get('/:id', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), getCustomerById);
router.put('/:id', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), updateCustomer); 
router.delete('/:id', protect, restrictTo(['SalesUser', 'Admin', 'SalesManager']), deleteCustomer); 
router.patch('/:id/status', protect, restrictTo(['SalesUser']), pending);
router.patch('/:id/approve', protect, restrictTo(['SalesManager']), aprovePending);
module.exports = router;
