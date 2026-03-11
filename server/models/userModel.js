const db = require('../config/db');

class UserModel {
  // Create a new user
  static async create(name, email, hashedPassword) {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [name, email, hashedPassword]);
    return result;
  }

  // Find a user by their email address
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0]; // Returns the user object or undefined if not found
  }

  // Find a user by their ID
  static async findById(id) {
    const query = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }
}

module.exports = UserModel;
