// create http server for stripe api
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const port = 3000;
const Stripe = require('stripe');
const stripeSecretKey = 'secretKey'
const stripe = Stripe(stripeSecretKey);     // instantiate stripe

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
//     next();
// });

router.post('/create-checkout-session', async (req, res, next) => {
    const domain = `http://localhost:${port}`;  // port for failure (optional)
    const cartItems = JSON.parse(req.body.items);
    const cartItemsString = JSON.stringify(cartItems);
    const shippingInfo = req.body.address;
    const amount = req.body.amount;
    console.log("items: ", cartItems);

    const customer_id = req.body.customer_id;

    // creating order date
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const order_date = `${year}-${month}-${day}`;


    
    const shipping_no = 1;
    const shipping_type = 'sta';
    const company_id = 2;
    const fees = 0;
    const subtotal = amount;
    const total = amount + fees;
    const delivery_status = 'pen';
    const delivery_date = '2024-06-01';
    const payment_status = 'com';
    console.log(customer_id);
    console.log(shippingInfo);
    console.log("body", req.body);
    console.log("cartItems: ", cartItems);
    console.log("amount: ", amount);
    console.log("order date: ", order_date);


    try {
        // creating stripe session
        const session = await stripe.checkout.sessions.create({
            metadata: {
                customerId: customer_id,
                orderDate: order_date,
                shippingNo: shipping_no,
                shippingType: shipping_type,
                fees: fees,
                subtotal: amount,
                total: total,
                deliveryStatus: 'pen',
                deliveryDate: delivery_date,
                paymentStatus: 'com',
                cartItems: cartItemsString
            },
            payment_method_types: ['card', 'paypal'],   // find out how to do apple pay?
            line_items: cartItems.map((item) => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.business_name,
                        images: ["https://i.pinimg.com/originals/a5/c0/8e/a5c08ef40c56fdcf1455780468d374b0.png"]
                    },
                    unit_amount: Number(item.quantity) * (Number(item.price)*100)  // convert from cents to whole dollars, charge hold
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: `http://localhost:4200/confirmation`,
            cancel_url: `http://localhost:4200/cancel`,
            expand: ['payment_intent'],
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'ES', 'IT', 'GB']
            },
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'ES', 'IT', 'GB'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                          amount: 500,
                          currency: 'eur',
                        },
                        display_name: 'Standard shipping',
                        delivery_estimate: {
                          minimum: {
                            unit: 'business_day',
                            value: 7,
                          },
                          maximum: {
                            unit: 'business_day',
                            value: 10,
                          },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                          amount: 1000,
                          currency: 'eur',
                        },
                        display_name: 'Premium shipping',
                        delivery_estimate: {
                          minimum: {
                            unit: 'business_day',
                            value: 2,
                          },
                          maximum: {
                            unit: 'business_day',
                            value: 4,
                          },
                        },
                    },
                },
            ],
        });
        return res.status(200).json(session);

    } catch (err) {
        next(err);
        console.log('stripe error', err);
    }
});

// Webhook endpoint to handle payment intent events
// Middleware to parse raw JSON body
app.use(express.json({
    limit: '5mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.buffer();
    }
}));

// Webhook route handler
router.post('/webhook', async (req, res) => {
    console.log("made it to webhook");
    const endpointSecret = 'secretEndPoint';

    // getting headers from stripe request body
    const sig = req.headers['stripe-signature'];

    console.log("signature: ", sig);

    // define stripe event
    let event;
    console.log("raw body: ", req.rawBody)

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        console.log("Webhook event: ", event);
    } catch (err) {
        // Invalid payload
        console.error('Error verifying webhook signature:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("after try catch, check point");
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const [result_order] = await databaseSQL.query(
                'INSERT INTO ⁠ order ⁠ (customer_id, payment_method_no, order_date, shipping_address_no, shipping_type_id, shipping_company_id, subtotal_price, handling_and_fees, total_price, delivery_status_id, delivery_date, payment_status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [customer_id, 1, order_date, 1, shipping_type, company_id, amount, fees, total, delivery_status, delivery_date, payment_status]
            );
            const orderId = result_order.insertId;
            console.log("orderId: ", orderId);


            const [cart] = await pool.query(
                'DELETE FROM shopping_cart WHERE customer_id=?', [customer_id]
            );

            const [cart_detail] = await pool.query(
                'DELETE FROM shopping_cart_detail WHERE customer_id=?', [customer_id]
            );

            // Update your database with transaction details
            // Respond to the event
            console.log("PAYMENT SUCCESS!!! NOW UPDATE DATABASE");
            res.json({ received: true });
            break;
        case 'payment_intent.payment_failed':
            // Handle failed payment
            console.log("Made it in switch, but the payment intent failed")
            res.json({ received: false });
            break;
        default:
            // Unexpected event type
            res.status(400).end();
    }
});


module.exports = router;
