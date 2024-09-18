const pool = require('../../config/mySQL');

class DashboardService {
    async getTotalSales() {
        try {
            const [sales] = await pool.query("SELECT DATE_FORMAT(order_date, '%M %Y') AS month, SUM(total_price) AS total from `order` group by DATE_FORMAT(order_date, '%M %Y')");
            console.log("sales: ", sales);
            return sales;
        } catch (error) {
            console.error('Error fetching total sales');
            throw error;
        }
    }
    async getTotalSalesSup(sup_id) {
        console.log("sup_id: ", sup_id);
        try {
            const [sales] = await pool.query("SELECT DATE_FORMAT(order_date, '%M %Y') AS month, SUM(total_price) AS total from supplier_dashboard WHERE supplier_id=? GROUP BY DATE_FORMAT(order_date, '%M %Y')", [sup_id]);
            console.log("sales: ", sales);
            return sales;
        } catch (error) {
            console.error('Error fetching total sales');
            throw error;
        } 
    }

    async getTotalOrders() {
        try {
            const [orders] = await pool.query("SELECT DATE_FORMAT(order_date, '%M %Y') AS month, COUNT(*) AS total FROM `order` GROUP BY DATE_FORMAT(order_date, '%M %Y')");
            console.log("orders: ", orders)
            return orders;
        } catch (error) {
            console.error('Error fetching total orders');
            throw error;
        }
    }

    async getTotalOrdersSup(sup_id) {
        console.log("sup_id: ", sup_id);
        try {
            const [sales] = await pool.query("SELECT DATE_FORMAT(order_date, '%M %Y') AS month, COUNT(*) AS total FROM supplier_dashboard WHERE supplier_id=? GROUP BY DATE_FORMAT(order_date, '%M %Y')", [sup_id]);
            console.log("sales: ", sales);
            return sales;
        } catch (error) {
            console.error('Error fetching total sales');
            throw error;
        } 
    }

    async getOrdersByProduct() {
        try {
            const [orders] = await pool.query('SELECT product_id, COUNT(product_id) AS total FROM order_detail GROUP BY product_id ORDER BY COUNT(product_id) DESC');
            console.log("Total orders by product: ", orders);
            return orders;
        }
        catch (error) {
            console.error('Error fetching total orders');
            throw error;
        }
    }

    async getOrdersByProductSup(sup_id) {
        try {
            const [orders] = await pool.query('SELECT product_id, COUNT(product_id) AS total FROM supplier_dashboard WHERE supplier_id=? GROUP BY product_id ORDER BY COUNT(product_id) DESC', [sup_id]);
            console.log("Total orders by product: ", orders);
            return orders;
        }
        catch (error) {
            console.error('Error fetching total orders');
            throw error;
        }
    }

    async getOrdersByLocation() {
        try {
            const [orders] = await pool.query('SELECT product_id, COUNT(product_id) AS count FROM order_detail GROUP BY product_id');
            console.log("orders: ", orders);
            // instantiate answer
            let productsWithDetails = [];

            for (let i = 0; i < orders.length; i++) {
                let order = orders[i];
                let productId = order.product_id;
                let totalSales = order.count;

                // Perform SQL lookup to get country for the product
                const [productInfo] = await pool.query('SELECT country_name FROM product_info WHERE product_id = ?', [productId]);
                console.log("country: ", productInfo[0]);
                // Assuming product_info has only one row for each product_id
                let country = productInfo[0].country_name;

                // Create an object with product details
                let productDetails = {
                    product_id: productId,
                    total_sales: totalSales,
                    country: country
                };
                console.log("product details: ", productDetails);
                // Push the product details object into the array
                productsWithDetails.push(productDetails);
            }
            console.log(productsWithDetails);

            return productsWithDetails;
        } catch (error) {
            console.error('Error fetching orders by location');
            throw error;
        }
    }

    async getSalesByProduct() {
        try {
            const [sales] = await pool.query('SELECT product_id, SUM(price) AS total FROM order_detail GROUP BY product_id');
            console.log("sales: ", sales);
            return sales;
        } catch (error) {
            console.error('Error fetching sales by product', error);
            throw error;
        }
    }

    async getSalesByProductSup(sup_id) {
        try {
            const [sales] = await pool.query('SELECT product_id, SUM(total_price) AS total FROM supplier_dashboard WHERE supplier_id=? GROUP BY product_id', [sup_id]);
            console.log("sales: ", sales);
            return sales;
        } catch (error) {
            console.error('Error fetching sales by product', error);
            throw error;
        }
    }

    async getSalesByLocation() {
        try {
            const [sales] = await pool.query('SELECT DISTINCT product_id, SUM(price) AS sum FROM order_detail GROUP BY product_id');
            console.log("sales: ", sales);

            let productsWithDetails = [];

            for (let i = 0; i < sales.length; i++) {
                let sale = sales[i];
                let productId = sale.product_id;
                let totalSales = sale.sum;

                // get country for the product
                const [productInfo] = await pool.query('SELECT country_name FROM product_info WHERE product_id = ?', [productId]);
                console.log("country: ", productInfo[0]);
                let country = productInfo[0].country_name;

                // Create an object with product details
                let productDetails = {
                    product_id: productId,
                    total_sales: totalSales,
                    country: country
                };

                console.log("product details: ", productDetails);
                // Push the product details object into the array
                productsWithDetails.push(productDetails);
            }
            console.log(productsWithDetails);
            return productsWithDetails;
        } catch (error) {
            console.error('Error fetching sales by location', error);
            throw error;
        }
    }

    async getSalesBySupplier() {
        try {
            const [sales] = await pool.query('SELECT product_id, SUM(price) AS sum FROM order_detail GROUP BY product_id');
            console.log("sales: ", sales);

            let productsWithDetails = [];

            for (let i = 0; i < sales.length; i++) {
                let sale = sales[i];
                let productId = sale.product_id;
                let totalSales = sale.sum;

                // get supplier_id for the product
                const [supplierIDs] = await pool.query('SELECT business_name FROM product_info WHERE product_id = ?', [productId]);
                console.log("supplier: ", supplierIDs[0]);
                let supplier = supplierIDs[0].business_name;

                // Create an object with product details
                let productDetails = {
                    product_id: productId,
                    total_sales: totalSales,
                    supplier_id: supplier
                };

                console.log("product details: ", productDetails);
                // Push the product details object into the array
                productsWithDetails.push(productDetails);
            }
            console.log(productsWithDetails);
            return productsWithDetails;
        } catch (error) {
            console.error('Error fetching sales by supplier', error);
            throw error;
        }
    }

    async getOrdersBySupplier() {
        try {
            const [orders] = await pool.query('SELECT product_id, COUNT(product_id) AS count FROM order_detail GROUP BY product_id');
            console.log("orders: ", orders);
            // instantiate answer
            let productsWithDetails = [];

            for (let i = 0; i < orders.length; i++) {
                let order = orders[i];
                let productId = order.product_id;
                let totalSales = order.count;

                // Perform SQL lookup to get country for the product
                const [supplierID] = await pool.query('SELECT business_name FROM product_info WHERE product_id = ?', [productId]);
                console.log("country: ", supplierID[0]);
                // Assuming product_info has only one row for each product_id
                let supplier_id = supplierID[0].business_name;

                // Create an object with product details
                let productDetails = {
                    product_id: productId,
                    total_sales: totalSales,
                    supplier_id: supplier_id
                };
                console.log("product details: ", productDetails);
                // Push the product details object into the array
                productsWithDetails.push(productDetails);
            }
            console.log(productsWithDetails);

            return productsWithDetails;
        } catch (error) {
            console.error('Error fetching orders by supplier');
            throw error;
        }
    }
}

module.exports = new DashboardService();
