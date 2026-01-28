const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  //  Recommended production settings
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "+00:00"
});

// Optional: test DB connection on startup
const checkDb = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(" Database connected successfully");
    connection.release();
  } catch (error) {
    console.error(" Database connection failed:", error.message);
    process.exit(1);
  }
};

checkDb();

module.exports = pool;
