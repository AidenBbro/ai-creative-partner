const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const initDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.end();

    await createTables();
    console.log('✅ Database and tables initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  }
};

const createTables = async () => {
  const connection = await pool.getConnection();
  
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        city VARCHAR(50),
        avatar VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ai_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        city VARCHAR(50),
        record_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS photos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        url VARCHAR(255) NOT NULL,
        category VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wallpapers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        url VARCHAR(255) NOT NULL,
        title VARCHAR(100),
        category VARCHAR(50),
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  } finally {
    connection.release();
  }
};

module.exports = { pool, initDatabase };
