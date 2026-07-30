const mysql = require("mysql2/promise");
require('dotenv').config();

// Create a connection pool instead of a single connection for stability
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your hosting plan
  queueLimit: 0,
  enableKeepAlive: true, // Keep connections alive
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4' // <--- THIS IS THE FIX for Amharic/special characters
});

// Test the pool connection on startup
pool.getConnection()
  .then(connection => {
    console.log("✅ Successfully connected to the database pool.");
    connection.release(); // Return the connection to the pool
  })
  .catch(error => {
    console.error("❌ DATABASE CONNECTION FAILED:", error);
    process.exit(1); // Exit the process if DB connection is critical
  });

module.exports = pool;