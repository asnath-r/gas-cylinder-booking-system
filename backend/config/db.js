require('dotenv').config();
const mysql = require('mysql2/promise'); // Use the appropriate library for your database

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Asnathr29@gmail.com',
  database: 'gasbooking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to the database.');
  }
});

module.exports = db;
