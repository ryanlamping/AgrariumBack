const express = require('express');
const router = express.Router();
const uploadProductService = require('../services/uploadProduct.service'); 
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/product-type', async (req, res) => {
  const { id } = req.query;  
  console.log("id", id);
  
  try {
    const values = await uploadProductService.getProductType(id); 
    res.json(values); 
    console.log("values: ", values)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/save-product', async (req, res) => {
    try {
        const result = await uploadProductService.saveProduct(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' }); 
    }
});

module.exports = router;
