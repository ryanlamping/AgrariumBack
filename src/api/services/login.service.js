const pool = require('../../config/mySQL');
const bcrypt = require('bcrypt');
const saltRounds = saltRounds;

class LoginService {
  async findByUserId(user_id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM user_credentials WHERE user_id = ?', [user_id]);
      console.log("rows: ", rows);
      return rows[0];
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw error;
    }
  }
  async userInfoToken(user_id) {
    try {
      const [rows] = await pool.execute('SELECT user_id, user_role_id FROM user_credentials WHERE user_id = ?', [user_id]);
      console.log("rows: ", rows);
      return rows[0];
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw error;
    }
  }

  async hashPassword(password) {
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  async login(user_id, password) {
    try {
      const user = await this.findByUserId(user_id);
      console.log("User: ", user);
      console.log("input password: ", password);
      console.log("password hashed from database: ", user.password);

      const hashedPassword = await this.hashPassword(password);
      console.log("hashed password: ", hashedPassword);

      const passwordMatch = await this.comparePasswords(password, user.password);

      if (passwordMatch) {
        return true;
      } else {
        return false; 
      }
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }
}

module.exports = new LoginService();
