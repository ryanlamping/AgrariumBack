const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const customerTransProfileService = require('../services/customerTransProfile.service');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/saveCustomerTransProfile', async (req, res) => {
  const { customer_id, name_on_account, account_number, routing_number } = req.body;
  console.log("input parameters:", customer_id, name_on_account, account_number, routing_number);

  try {
    const isSaveSuccessful = await customerTransProfileService.saveCustomerTransProfile(customer_id, name_on_account, account_number, routing_number);
    console.log("router log : ", customer_id, name_on_account, account_number, routing_number);

    console.log(isSaveSuccessful);

    if (isSaveSuccessful) {
      res.json({ status: true, message: 'Information saved successfully' });
    } else {
      res.status(401).json({ status: false, message: 'Information not saved' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
