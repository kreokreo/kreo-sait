import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Создание пула соединений
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'kreo_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'kreo_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Проверка подключения
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

export default pool;

