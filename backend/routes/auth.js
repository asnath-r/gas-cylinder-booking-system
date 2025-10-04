const express = require('express');
const { registerUser, loginUser, loginAdmin } = require('../controllers/authController');
const router = express.Router();

// Routes
router.post('/register', registerUser);
router.post('/user/login', loginUser);
router.post('/admin/login', loginAdmin);

module.exports = router;
