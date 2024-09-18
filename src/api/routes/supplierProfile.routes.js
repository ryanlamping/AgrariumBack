const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const supplierProfileService = require('../services/supplierProfile.service');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/saveSupplierProfile', async (req, res) => {
  const { supplier_id, first_name, last_name, business_name, business_url, business_address, phone_no, region_id, country_id, province_id } = req.body;
  console.log("input parameters:", supplier_id, first_name, last_name, business_name, business_url, business_address, phone_no, region_id, country_id, province_id);

  try {
    const isSaveSuccessful = await supplierProfileService.saveSupplierProfile(supplier_id, first_name, last_name, business_name, business_url, business_address, phone_no, region_id, country_id, province_id);
    console.log("router log : ", supplier_id, first_name, last_name, business_name, business_url, business_address, phone_no, region_id, country_id, province_id);

    console.log(isSaveSuccessful);

    if (isSaveSuccessful) {
      res.json({ status: true, message: 'information saved successfully' });
    } else {
      res.status(401).json({ status: false, message: 'information not saved' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
