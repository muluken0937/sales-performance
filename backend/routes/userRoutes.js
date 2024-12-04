const express = require('express');
const {
  loginUser,
  registerAdmin,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register-admin', registerAdmin); 
router.post('/login', loginUser);
router.post('/', protect, restrictTo(['Admin', 'SalesManager']), createUser);
router.get('/', protect, restrictTo(['Admin', 'SalesManager']), getAllUsers);
router.get('/:id', protect, restrictTo(['Admin', 'SalesManager']), getUserById);
router.put('/:id', protect, restrictTo(['Admin', 'SalesManager']), updateUser);
router.delete('/:id', protect, restrictTo(['Admin']), deleteUser);

module.exports = router;
