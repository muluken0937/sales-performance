const express = require('express');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');  // Correct the import path if needed

const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, restrictTo(['Admin', 'SalesManager']), createUser);
router.get('/', protect, restrictTo(['Admin', 'SalesManager']), getAllUsers);
router.get('/:id', protect, restrictTo(['Admin', 'SalesManager']), getUserById);
router.put('/:id', protect, restrictTo(['Admin', 'SalesManager']), updateUser);
router.delete('/:id', protect, restrictTo(['Admin', 'SalesManager']), deleteUser);

module.exports = router;
