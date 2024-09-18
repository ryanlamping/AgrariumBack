// cart service

const pool = require('../../config/mySQL');

class CartService {
    async addProductToCart(customer_id, product_id, quantity, price) {
        try {
            // Check if the customer already has a shopping cart
            const [cartCheck] = await pool.query('SELECT * FROM shopping_cart WHERE customer_id = ?', [customer_id]);

            if (cartCheck.length > 0) {
                // Customer has a shopping cart, check if the product is already in the cart
                const [productCheck] = await pool.query(
                    'SELECT * FROM shopping_cart_detail WHERE customer_id = ? AND product_id = ?',
                    [customer_id, product_id]
                );

                if (productCheck.length > 0) {
                    // Product is already in the cart, throw an error
                    throw new Error('Product already in cart');
                } else {
                    // Product is not in the cart, add it to shopping_cart_detail
                    const [result2] = await pool.query(
                        'INSERT INTO shopping_cart_detail (customer_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                        [customer_id, product_id, quantity, price]
                    );

                    // Check if the insertion was successful
                    if (result2.affectedRows <= 0) {
                        throw new Error('Failed to add product to cart. No rows affected in shopping_cart_detail.');
                    }
                }
            } else {
                // Customer does not have a shopping cart, create a new one
                const [result] = await pool.query(
                    'INSERT INTO shopping_cart (customer_id, shopping_cart_date) VALUES (?, ?)',
                    [customer_id, '2023-11-12'] // Will be replaced with the current date logic
                );

                // Check if the insertion was successful
                if (result.affectedRows <= 0) {
                    throw new Error('Failed to add product to cart. No rows affected in shopping_cart.');
                }

                // Add the product to shopping_cart_detail
                const [result2] = await pool.query(
                    'INSERT INTO shopping_cart_detail (customer_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [customer_id, product_id, quantity, price]
                );

                // Check if the insertion was successful
                if (result2.affectedRows <= 0) {
                    throw new Error('Failed to add product to cart. No rows affected in shopping_cart_detail.');
                }
            }

            // The insertion was successful
            return { success: true, message: 'Product added to cart successfully' };
        } catch (error) {
            console.error('Error adding product to cart:', error);
            return { success: false, message: `Failed to add product to cart. ${error.message || 'Internal Server Error'}` };
        }
    }

    async getItemsFromCart (customer_id) {
        try {
            // Pause for one second            
            const [items] = await pool.query('SELECT shopping_cart_detail.*, supplier.business_name, product.unit_id FROM shopping_cart_detail JOIN product ON shopping_cart_detail.product_id = product.product_id JOIN supplier ON product.supplier_id = supplier.supplier_id WHERE customer_id= ?', customer_id)
            console.log(items)
            return items
        } catch(error) {
            console.log('Error getting items from cart',error)
            throw error;
        }
    }
    async orderId() {
        console.log("finding most recent order_id");
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const [items] = await pool.query('SELECT order_id FROM `order` ORDER BY order_id DESC LIMIT 1');
            console.log("order_id: ", items);
            return items;
        } catch (error) {
            console.log('Error getting last order_id', error);
            throw error;
        }
    }

    async insertOrderDetails(items) {
        console.log("items: ", items);
        const products = items;
        const orderIdResult = await this.orderId();
        const orderId = orderIdResult[0].order_id;
        console.log('orderId: ', orderId);
        console.log('product length: ', products.length);
        try {
            for(let i = 0; i < products.length; i++) {
                let itemNumber = i + 1;
                console.log("product: ", products[i]);
                let product_id = products[i].product_id;
                let quantity = products[i].quantity;
                let price = products[i].price;
                console.log('orderId: ', orderId);
                console.log("itemNumber: ", itemNumber);
                console.log("product_id: ", product_id);
                console.log("quantity: ", quantity);
                console.log("price: ", price); 

                const [result] = await pool.query('INSERT INTO order_detail (order_id, item_no, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)', [orderId, itemNumber, product_id, quantity, price]);

                // Check if the insertion was successful
                if (result.affectedRows <= 0) {
                    throw new Error('Failed to add order_detail. No rows affected in order_detail.');
                }
                console.log("result: ", result);
            }
            return { success: true, message: 'order added to order detail' };
        } catch(error) {
            console.log("error putting items in order_detail", error)
            return { success: false, message: `Failed to add order to orders. ${error.message || 'Internal Server Error'}` };
        }
    }
}


module.exports = CartService;