const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const loginService = require('../services/login.service'); 

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// use jwt.sign to verify the client's priveleges

router.get('/findByUserId', async (req, res) => {
    const { user_id } = req.query; 
    console.log("input parameters:", user_id);
    try {
        const user = await loginService.findByUserId(user_id);
        console.log("Request Parameter: ", user)

        if (user) {
            res.json({ user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    const { user_id, password} = req.body;
  
    try {
      const isLoginSuccessful = await loginService.login(user_id, password);
      console.log("router log : ", user_id, password);
      console.log(isLoginSuccessful);
  
      if (isLoginSuccessful) {
        // Login successful
        const user = await loginService.userInfoToken(user_id);

        // get role so we can restrict access depending on role
        const token = jwt.sign(user, crypto.randomBytes(32).toString('hex'), { expiresIn: '1hr'});
        res.json({ status: true, message: 'Login successful', token: token});
      } else {
        // Invalid credentials
        res.status(401).json({ status: false, message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
});

router.post('/refresh-token', (req, res) => {
  const refreshToken = req.body.refreshToken;

  try {
    // validate the refresh token
    const decoded = jwt.verify(refreshToken, crypto.randomBytes(32).toString('hex'), { expiresIn: '20m'});
    const user = { user_id: decoded.user_id };
    const accessToken = jwt.sign(user, crypto.randomBytes(32).toString('hex'), { expiresIn: '30m'});

    res.json({ accessToken });
  } catch (error) {
    console.error('Error refreshing token', error)
    res.status(403).json({ message: 'Invalid refresh token'});
  }
});

module.exports = router;
