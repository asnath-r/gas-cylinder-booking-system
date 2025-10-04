const db = require('../config/db');

exports.submitFeedback = async (req, res) => {
  const { booking_id } = req.params;
  const { rating, comments } = req.body;
  const user_id = req.user.user_id;

  console.log('Submitting feedback for booking:', booking_id, 'by user:', user_id);
  console.log('Rating:', rating, 'Comments:', comments);

  if (typeof rating === 'undefined') {
    return res.status(400).json({
      status: 'error',
      message: 'Rating is required.',
    });
  }

  // Allow empty comments by using null if not provided
  const safeComments = comments !== undefined && comments !== null
    ? comments.trim()
    : null;

  try {
    const [booking] = await db.execute(
      'SELECT * FROM bookings WHERE booking_id = ? AND user_id = ? AND status = ?',
      [booking_id, user_id, 'Delivered']
    );

    if (booking.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid booking ID ${booking_id} or not associated with this user.`,
      });
    }

    const [existingFeedback] = await db.execute(
      'SELECT * FROM feedback WHERE booking_id = ?',
      [booking_id]
    );

    if (existingFeedback.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Feedback for this booking has already been submitted.',
      });
    }

    await db.execute(
      'INSERT INTO feedback (user_id, booking_id, rating, comments) VALUES (?, ?, ?, ?)',
      [user_id, booking_id, rating, safeComments]
    );

    res.status(201).json({
      status: 'success',
      message: 'Feedback submitted successfully.',
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit feedback.',
      error: error.message,
    });
  }
};
// // Submit Feedback
// exports.submitFeedback = async (req, res) => {
//   const { booking_id } = req.params;
//   const { rating, comments } = req.body;
//   const user_id = req.user.user_id; // Extracted from JWT token

//   try {
//     // Check if the booking exists and is associated with the user
//     const [booking] = await db.execute(
//       'SELECT * FROM bookings WHERE booking_id = ? AND user_id = ? AND status = ?',
//       [booking_id, user_id, 'Delivered']
//     );

//     if (booking.length === 0) {
//       return res.status(400).json({
//         status: 'error',
//         message: `Invalid booking ID ${booking_id} or not associated with this user.`,
//       });
//     }

//     // Check if feedback for the booking already exists
//     const [existingFeedback] = await db.execute(
//       'SELECT * FROM feedback WHERE booking_id = ?',
//       [booking_id]
//     );

//     if (existingFeedback.length > 0) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Feedback for this booking has already been submitted.',
//       });
//     }

//     // Insert feedback into the Feedback table
//     await db.execute(
//       'INSERT INTO feedback (user_id, booking_id, rating, comments) VALUES (?, ?, ?, ?)',
//       [user_id, booking_id, rating, comments]
//     );

//     res.status(201).json({
//       status: 'success',
//       message: 'Feedback submitted successfully.',
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Failed to submit feedback.',
//       error: error.message,
//     });
//   }
// };


// View Feedback (User)
exports.getUserFeedback = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const [feedback] = await db.execute(`
      SELECT f.feedback_id, f.rating, f.comments, f.booking_id
      FROM feedback f
      WHERE f.user_id = ?
      ORDER BY f.feedback_id DESC
    `, [user_id]);

    res.status(200).json({
      status: 'success',
      data: feedback
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user feedback',
      error: error.message
    });
  }
};


// View Feedback (Admin)
exports.getFeedback = async (req, res) => {
  try {
    const [feedback] = await db.execute(`
      SELECT f.feedback_id, f.rating, f.comments, b.booking_id, u.name as user_name 
      FROM feedback f
      JOIN bookings b ON f.booking_id = b.booking_id
      JOIN Users u ON f.user_id = u.user_id
    `);

    res.status(200).json({
      status: 'success',
      message: 'Feedback fetched successfully',
      data: feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch feedback',
      error: error.message,
    });
  }
};
