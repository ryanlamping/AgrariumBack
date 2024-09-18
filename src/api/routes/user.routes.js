const express = require('express');
const bodyParser = require('body-parser');
const userService = require('../services/user.service');
const router = express.Router();
router.use(bodyParser.json());

router.get('/orders', async (req, res) => {
    const { user_id } = req.query; 
    console.log("user_id (routes): ", req);
    try {
        const response = await userService.getOrders(user_id);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/favorites', async (req, res) => {
    const { user_id } = req.query;
    console.log("user_id (routes)", req.query);
    try {
        const response = await userService.getFavorites(user_id);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

router.get('/address', async (req, res) => {
    const { user_id } = req.query;
    console.log("user_id (routes)", req.query);
    try {
        const response = await userService.getShippingDetails(user_id);
        res.json(response)
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
});

module.exports = router;