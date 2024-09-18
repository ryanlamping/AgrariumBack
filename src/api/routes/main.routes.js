// main.routes:

const express = require('express');
const productRoutes = require('./product.routes');
const shoppingCartRoutes = require('./shopping-cart.routes');
//login and signup
const loginRoutes = require('./login.routes');
const signupRoutes = require('./sign-up.routes');

//supplier and customer profile information
const supplierProfileRoutes = require('./supplierProfile.routes');
const customerProfileRoutes = require('./customerProfile.routes');

const customerProfileService = require('../services/customerProfile.service');

// supplier and customer transaction profile information
const supplierTransProfileRoutes = require('./supplierTransProfile.routes');
const supplierTransProfileService = require('../services/supplierTransProfile.service');
const customerTransProfileRoutes = require('./customerTransProfile.routes');
const customerTransProfileService = require('../services/customerTransProfile.service');

// product upload
const uploadProductRoutes = require('./uploadProduct.routes');
const uploadProductService = require('../services/uploadProduct.service');

const userRoutes = require('./user.routes');

const stripeRoutes = require('./stripe.routes');

const dashBoardRoutes = require('./dashboards.routes');


const router = express.Router();

// Use the imported routes
router.use('/products', productRoutes);

router.use('/login', loginRoutes);
router.use('/signup', signupRoutes);

router.use('/supplierProfile', supplierProfileRoutes);
router.use('/customerProfile', customerProfileRoutes);


router.use('/supplierTransProfile', supplierTransProfileRoutes);
router.use('/customerTransProfile', customerTransProfileRoutes);

router.use('/uploadProduct', uploadProductRoutes);


router.use('/shopping-cart', shoppingCartRoutes);
router.use('/user', userRoutes);

router.use('/stripe', stripeRoutes);

router.use('/dashboard', dashBoardRoutes);


module.exports = router;

