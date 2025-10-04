const db = require('../config/db');

// Place an Order
exports.placeOrder = async (req, res) => {
  const { cylinder_id, area, quantity, total_cost, payment_method } = req.body;
  const user_id = req.user.user_id; // Assuming user is authenticated

  try {
    // Validate cylinder availability
    const [cylinder] = await db.query('SELECT * FROM Cylinders WHERE cylinder_id = ?', [cylinder_id]);
    if (!cylinder.length) return res.status(404).json({ message: 'Cylinder not found' });

    const expectedTotalCost = cylinder[0].cost * quantity;
    if (payment_method !== 'Cash on Delivery' && total_cost !== expectedTotalCost) {
      return res.status(400).json({
        message: `Invalid total cost. Expected ${expectedTotalCost} for ${quantity} units.`,
      });
    }

    if (cylinder[0].stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    // Create booking
    await db.query(
      `INSERT INTO Bookings (user_id, cylinder_id, area, quantity, total_cost, payment_method)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, cylinder_id, area, quantity, total_cost, payment_method]
    );

    // Update cylinder stock
    await db.query('UPDATE Cylinders SET stock = stock - ? WHERE cylinder_id = ?', [quantity, cylinder_id]);

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

// Get User Orders
// exports.getUserOrders = async (req, res) => {
//   const user_id = req.user.user_id;

//   try {
//     const [orders] = await db.query(
//       `SELECT b.*, c.type AS cylinder_type
//        FROM Bookings b
//        JOIN Cylinders c ON b.cylinder_id = c.cylinder_id
//        WHERE b.user_id = ?`,
//       [user_id]
//     );

//     res.status(200).json({ orders });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
//   }
// };

exports.getBookings = async (req, res) => {
  try {
    const role = req.user.role;           // From decoded JWT: 'user' or 'admin'
    const userId = req.user.user_id;      // From decoded JWT: user_id or admin_id

    let rows;

    if (role === 'admin') {
      // Admin: Get all bookings
      [rows] = await db.query(
        `SELECT b.*, u.name AS user_name, c.type AS cylinder_type 
         FROM bookings b
         JOIN users u ON b.user_id = u.user_id
         JOIN cylinders c ON b.cylinder_id = c.cylinder_id
         ORDER BY b.booking_date DESC`
      );
    } else {
      // User: Get own bookings only
      [rows] = await db.query(
        `SELECT b.*, c.type AS cylinder_type 
         FROM bookings b
         JOIN cylinders c ON b.cylinder_id = c.cylinder_id
         WHERE b.user_id = ?
         ORDER BY b.booking_date DESC`,
        [userId]
      );
    }

    return res.status(200).json({ data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};


// Cancel Order
exports.cancelOrder = async (req, res) => {
  const { booking_id } = req.params;

  try {
    const [booking] = await db.query('SELECT * FROM Bookings WHERE booking_id = ?', [booking_id]);
    if (!booking.length) return res.status(404).json({ message: 'Booking not found' });

    if (booking[0].status !== 'Pending') {
      return res.status(400).json({ message: 'Order cannot be canceled' });
    }

    // Delete booking and restore stock
    await db.query('DELETE FROM Bookings WHERE booking_id = ?', [booking_id]);
    await db.query('UPDATE Cylinders SET stock = stock + ? WHERE cylinder_id = ?', [
      booking[0].quantity,
      booking[0].cylinder_id,
    ]);

    res.status(200).json({ message: 'Order canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
};

// Admin: Approve or Reject Order
exports.manageOrder = async (req, res) => {
  const { booking_id } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const [booking] = await db.query('SELECT * FROM Bookings WHERE booking_id = ?', [booking_id]);
    if (!booking.length) return res.status(404).json({ message: 'Booking not found' });

    // Set delivery date for approved orders
    const deliveryDate = status === 'Approved' ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : null;

    await db.query(
      'UPDATE Bookings SET status = ?, delivery_date = ? WHERE booking_id = ?',
      [status, deliveryDate, booking_id]
    );

    res.status(200).json({ message: `Order ${status.toLowerCase()}`, deliveryDate });
  } catch (error) {
    res.status(500).json({ message: 'Failed to manage order', error: error.message });
  }
};

// Mark Delivered
// exports.markDelivered = async (req, res) => {
//   const { booking_id } = req.params;

//   try {
//     const [booking] = await db.query('SELECT * FROM Bookings WHERE booking_id = ?', [booking_id]);
//     if (!booking.length) return res.status(404).json({ message: 'Booking not found' });

//     if (booking[0].status !== 'Approved') {
//       return res.status(400).json({ message: 'Order is not approved yet' });
//     }

//     await db.query('UPDATE Bookings SET status = ? WHERE booking_id = ?', ['Delivered', booking_id]);
//     res.status(200).json({ message: 'Order marked as delivered. Please provide feedback.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to mark as delivered', error: error.message });
//   }
// };

// Mark Delivered and Update Actual Delivery Date
exports.markDelivered = async (req, res) => {
  const { booking_id } = req.params;

  try {
    const [booking] = await db.query('SELECT * FROM Bookings WHERE booking_id = ?', [booking_id]);
    if (!booking.length) return res.status(404).json({ message: 'Booking not found' });

    if (booking[0].status !== 'Approved') {
      return res.status(400).json({ message: 'Order is not approved yet' });
    }

    const actualDeliveryDate = new Date(); // current timestamp

    await db.query(
      'UPDATE Bookings SET status = ?, delivery_date = ? WHERE booking_id = ?',
      ['Delivered', actualDeliveryDate, booking_id]
    );

    res.status(200).json({ message: 'Order marked as delivered', deliveryDate: actualDeliveryDate });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark as delivered', error: error.message });
  }
};

