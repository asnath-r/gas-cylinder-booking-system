const express = require('express');
const { submitFeedback, getFeedback, getUserFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Submit Feedback (User)

router.post('/:booking_id', protect('user'), submitFeedback);

// View Feedback (Admin)
router.get('/', protect('admin'), getFeedback);

router.get('/user', protect('user'), getUserFeedback);


module.exports = router;
