const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const signupService = require('../services/signup.service'); 

const nodemailer = require('nodemailer');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/signupFindByUserId', async (req, res) => {
  const { user_id } = req.query; 
  console.log("input parameters:", user_id);
  try {
    const isNewUser = await signupService.signupFindByUserId(user_id);
    console.log("isNewUser: ", isNewUser);
    
    res.json({ isNewUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/save', async (req, res) => {
  const { user_id, user_role_id, password, verifyPassword } = req.body;
  console.log("input parameters:", user_id, user_role_id, password);
  
  try {
    const isSignUpSuccessful = await signupService.save(user_id, user_role_id, password, verifyPassword);
    console.log("router log : ", user_id, user_role_id, password, verifyPassword);
    console.log(isSignUpSuccessful);

    if (isSignUpSuccessful) {
      res.json({ status: true, message: 'User registered successfully' });
    } else {
      res.status(401).json({ status: false, message: 'User already registered' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
