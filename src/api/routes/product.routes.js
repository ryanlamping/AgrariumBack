const express = require('express');
const productService = require('../services/product.service');
const router = express.Router();

router.get('/ProductById', async (req, res) => {
  const id = req.query;
  console.log(id);
  try {
    const product = await productService.getProductById(id);
    res.json(product);
  } catch (error) {
    console.error("Error fetching products by id", error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.get('/CountriesByContinent', async (req, res) => {
  const continent = req.query;
  console.log("Request Parameter: ", continent)
  try {
    const countries = await productService.getCountriesByContinent(continent);
    
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/products/TypeByCountry', async (req, res) => {
  const country = req.query;
  console.log('Request parameter: ', country);
  try {
    const products = await productService.getTypeByCountry(country);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/productsByCountryType', async (req, res) => {
  const { country, type } = req.query;
  console.log('Request Parameters:', { country, type });

  try {
    const products = await productService.getProductsByCountryType(country, type);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/productTypes', async (req, res) => {
  try {
    const types = await productService.getProductType();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/productsByType', async (req, res) => {
  const type = req.query;
  console.log('req parameters', req);
  try {
    const products = await productService.getProductsByType(type);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/productsByRating', async (req, res) => {
  try {
    const products = await productService.getProductsByRating();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ratingsOfProduct', async (req, res) => {
  console.log("req ratings: ", req.query.id);
  try {
    const reviews = await productService.getProductRating(req.query.id);
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});

module.exports = router;
