const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    await db.execute('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: null,
    });
  } catch (error) {
    console.error('Error in registerUser:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      errors: error.message,
    });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and password are required' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign(
  { 
    user_id: rows[0].user_id, 
    name: rows[0].name, 
    role: 'user' 
  },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES }
);

    res.status(200).json({
  status: 'success',
  message: 'Login successful',
  data: {
    token,
    user: {
      user_id: user.user_id,
      name: user.name,
      role: 'user',
    },
  },
});

  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and password are required' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM Admins WHERE email = ?', [email]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const admin = rows[0];

    // Direct password comparison (since you don't hash admin passwords)
    if (password !== admin.password) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign(
  { 
    admin_id: rows[0].admin_id, 
    role: 'admin' 
  },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES }
  );


    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
  token,
  user: {
    admin_id: admin.admin_id,
    name: admin.name,
    role: 'admin',
  },
},

    });
  } catch (error) {
    console.error('Error in loginAdmin:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};


