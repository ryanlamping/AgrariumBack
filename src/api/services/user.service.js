const { client } = require('../../config/mongoDB');
const pool = require('../../config/mySQL');

class UserService {
    async getOrders(user_id) {
        console.log('service user_id: ', user_id);
        try {
            // get order_ids of customer who ordered.
            const [orders] = await pool.query('SELECT DISTINCT product_info.*, order.order_date, order_detail.quantity FROM `order` JOIN order_detail ON order.order_id = order_detail.order_id JOIN product_info ON order_detail.product_id = product_info.product_id WHERE customer_id=? ORDER BY order.order_date DESC LIMIT 2', user_id);
            console.log("orders: ", orders);
            return orders;
        } catch (error) {
            console.log('Error getting orders: ', error)
            throw error;
        }
    }

    async getFavorites(user_id) {
        console.log('user_id in service: ', user_id);
        const products = [];
        try {

            // get proudct_id and rating from the product_info table
            const [favProducts] = await pool.query(` SELECT product_info.*, product_rating.rating FROM product_info INNER JOIN product_rating ON product_info.product_id = product_rating.product_id 
            WHERE product_rating.user_id = ? 
            ORDER BY product_rating.rating DESC
            LIMIT 2`, user_id);
            console.log(favProducts);

            return favProducts;
        } catch (error) {
            console.log('Error getting orders: ', error)
            throw error;
        }

    }

    async getShippingDetails(user_id) {
        const userId = user_id;
        console.log("service user_id:", userId);

        try {
            const [details] =  await pool.query(`SELECT customer.first_name, customer.last_name, customer.customer_id, customer.phone_no, country.country_name, province.province_name, shipping_address.address_details, shipping_address.default_address 
            FROM customer 
            INNER JOIN shipping_address ON shipping_address.customer_id = customer.customer_id 
            INNER JOIN country ON country.country_id = customer.country_id 
            INNER JOIN province ON customer.province_id = province.province_id 
            WHERE customer.customer_id =?`, userId)
            return details;
        } catch (error) {
            console.error("error finding shipping details", error);
            throw error;
        }
    }
}

module.exports = new UserService();
