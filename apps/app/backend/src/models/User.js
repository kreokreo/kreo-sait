import pool from '../config/database.js';
import bcrypt from 'bcrypt';

export class User {
  // Создание пользователя
  static async create({ email, password, name, role = 'user' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, role]
    );
    
    return this.findById(result.insertId);
  }

  // Поиск по ID
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  // Поиск по email
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  // Проверка пароля
  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }

  // Обновление пользователя
  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.name) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.role) {
      fields.push('role = ?');
      values.push(data.role);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }
}

