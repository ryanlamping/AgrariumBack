const pool = require('../../config/mySQL');
const bcrypt = require('bcrypt');
const saltRounds = saltRounds;

class SignUpService {

  async signupFindByUserId(user_id) {
    console.log("user_id:", user_id);
    try {
      const [rows] = await pool.execute('SELECT * FROM user_credentials WHERE user_id = ?', [user_id]);
      console.log("find user by user id ", rows);
      return rows.length === 0;
    } catch (error) {
      console.error('Error in findByUserId:', error);
      throw error; 
    }
  }

  async save(user_id, user_role_id, password, verifyPassword) {
    try {
      const isNewUser = await this.signupFindByUserId(user_id);
      console.log(isNewUser);
  
      if (isNewUser) {
        if (password == verifyPassword) {
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          console.log(hashedPassword);
          const result = await pool.execute(
            'INSERT INTO user_credentials (user_id, user_role_id, password) VALUES (?,?,?)',
            [user_id, user_role_id, hashedPassword]
          );
          console.log("user is successfully saved");
          return true;
        } else {
          console.log("Passwords do not match");
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error in save:', error);
      throw error;
    }
  }
}  

module.exports = new SignUpService();
