const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const databaseSQL = require('./config/mySQL');
const databaseNOSQL = require('./config/mongoDB');
const apiRoutes = require('./api/routes/main.routes');
const staticFiles = require('./uploads/staticFiles'); // Import the staticFiles module
const OrderService = require('./api/services/shopping-cart.service')
const app = express();
app.use(express.static("public"));
app.use(cors({orign: true, credentials: true}));
app.use('/uploads', express.static('src/uploads'));

const port = 3000;
const stripe = require("stripe")(secretKey);

databaseSQL.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the mysql database:', err.message);
  } else {
    console.log('Connected to the mysql database!');
    // connection.release();
  }
});

// Webhook route
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = require("stripe")(secretKey);
  const endpointSecret = secretendpoint;
  
  // Retrieve the Stripe signature and payload from the request headers
  const sig = req.headers['stripe-signature'];
  const payload = req.body.toString('utf-8');

  const payloadMeta = JSON.parse(req.body.toString('utf-8'));
  // getting metadata of payment from request body
  console.log("metadata: ", payloadMeta.data.object.metadata);

  const customer_id = payloadMeta.data.object.metadata.customerId;
  console.log("cust_id: ", customer_id);

  
  // Verify the webhook signature
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error('Error verifying webhook signature:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event based on its type
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log("payment successful");
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object);
      break;
      case 'checkout.session.completed':
        // function call to delete shopping cart with customer_id
        databaseSQL.query('INSERT INTO `order` (customer_id, payment_method_no, order_date, shipping_address_no, shipping_type_id, shipping_company_id, subtotal_price, handling_and_fees, total_price, delivery_status_id, delivery_date, payment_status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [customer_id, 1, payloadMeta.data.object.metadata.orderDate, 1, payloadMeta.data.object.metadata.shippingType, 1, payloadMeta.data.object.metadata.subtotal/100, payloadMeta.data.object.metadata.fees, payloadMeta.data.object.metadata.total/100, payloadMeta.data.object.metadata.deliveryStatus, '2024-08-09', payloadMeta.data.object.metadata.paymentStatus], (err, result) => {
            if (err) {
              console.error('Error adding to order:', err);
              return;
            }
            console.log('order updated successfully');
        });
        
        // getting metadata from body of request
        const productsString = payloadMeta.data.object.metadata.cartItems;
        // making metadata into a json object
        const products = JSON.parse(productsString);
        console.log("products: ", products);
        const orderService = new OrderService()
        // inserting into order details after the databaseSQL.query
        orderService.insertOrderDetails(products);
  
        console.log("customer_id in switch: ", customer_id);
        databaseSQL.query('DELETE FROM shopping_cart WHERE customer_id = ?', [customer_id], (err, result) => {
          if (err) {
            console.error('Error deleting shopping cart:', err);
            return;
          }
          console.log('Shopping cart deleted successfully');
        });
      default:
        
      // Handle other event types
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Respond to the webhook event
  res.status(200).end();
});

app.use(bodyParser.json());
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// This is entry point for the node.js application
// To run this file, type node src/index.js in the terminal, or nodemon src/index.js (this updates with every change made)
