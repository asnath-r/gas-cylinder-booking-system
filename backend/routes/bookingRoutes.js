const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  placeOrder,
  getBookings,
  cancelOrder,
  manageOrder,
  markDelivered,
} = require('../controllers/bookingController');

const router = express.Router();

// User Routes
router.post('/', protect('user'), placeOrder);
router.get('/', protect(), getBookings);
router.delete('/:booking_id', protect('user'), cancelOrder);

// Admin Routes
router.put('/:booking_id/manage', protect('admin'), manageOrder);

// Mark Delivered
router.post('/:booking_id/delivered', protect('admin'), markDelivered);

module.exports = router;
