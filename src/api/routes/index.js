const express = require('express');

const loginService = require('../services/login.service');

const router = express.Router();


router.post('/login', async (req, res) => {
  const { user_id, password } = req.body;

  try {
    const user = await loginService.login(user_id, password);

    if (user) {
      // Login successful
      res.json({ user });
    } else {
      // Invalid credentials
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in /login route:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;

