
const express = require('express');
const bodyParser = require('body-parser');
const CartService = require('../services/shopping-cart.service');

const shoppingCartService0 = new CartService();

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/addProductToCart', async (req, res) => {
    const {customer_id, product_id, quantity, price } = req.body;

    console.log("Received parameters:", customer_id, product_id, quantity, price);

    try {
        const response = await shoppingCartService0.addProductToCart(customer_id, product_id, quantity, price);
        res.json(response);
    } catch (error) {
        console.error("Error adding to cart", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/getCartItems', async (req, res) => {
    const {customer_id} = req.query;

    console.log("Received parameter:", customer_id);

    try {
        const response = await shoppingCartService0.getItemsFromCart(customer_id);
        res.json(response);
    } catch (error) {
        console.error("Error getting items from cart", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
