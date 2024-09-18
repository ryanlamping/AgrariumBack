const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const supplierTransProfileService = require('../services/supplierTransProfile.service');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/saveSupplierTransProfile', async (req, res) => {
  const { supplier_id, name_on_account, account_number, routing_number } = req.body;
  console.log("input parameters:", supplier_id, name_on_account, account_number, routing_number);

  try {
    const isSaveSuccessful = await supplierTransProfileService.saveSupplierTransProfile(supplier_id, name_on_account, account_number, routing_number);
    console.log("router log : ", supplier_id, name_on_account, account_number, routing_number);

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
