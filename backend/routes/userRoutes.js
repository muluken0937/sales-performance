const express = require('express');
const {
  loginUser,
  registerAdmin,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../Controllers/userController.js');

const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../config/upload'); 

const router = express.Router();

router.post('/register-admin', registerAdmin);
router.post('/login', loginUser);
router.post('/', protect, restrictTo(['Admin', 'SalesManager']), upload.single('image'), createUser); // Add file upload
router.get('/', protect, restrictTo(['Admin', 'SalesManager',]), getAllUsers);
router.get('/:id', protect, restrictTo(['Admin', 'SalesManager','SalesUser']), getUserById);
router.put('/:id', protect, restrictTo(['admin', 'SalesManager', 'SalesUser']), upload.single('image'), updateUser);
router.delete('/:id', protect, restrictTo(['Admin']), deleteUser);

module.exports = router;
