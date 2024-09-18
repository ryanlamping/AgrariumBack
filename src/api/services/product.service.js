const { client } = require('../../config/mongoDB');
const { ObjectId } = require('mongodb');

const pool = require('../../config/mySQL');

class ProductService {
    async getProductById(id) {
        console.log("id", id);
        const productId = Object.keys(id)[0];
        console.log("productId", productId);
        try {
            const [mySQLRows] = await pool.query('SELECT * FROM product_info WHERE product_id=?', productId);
            console.log("product: ", mySQLRows[0]);
            const type_id = mySQLRows[0].type_id;
            console.log(type_id);


            const mongoDb = await client.db('products');

            const cacaoCollection = mongoDb.collection(type_id);    // remember to change hardcode
            const mongoDbDocs = await cacaoCollection.find({}).toArray();
            console.log('best rated documents collection:', mongoDbDocs);
            
            const combinedInfo = mySQLRows.map(mysqlProduct => {
                const mongoDbDoc = mongoDbDocs.find(doc => doc._id.toString() === mysqlProduct.object_id);
                return {
                    ...mysqlProduct,
                    mongodbData: mongoDbDoc
                };
            });
            return combinedInfo;
        } catch (error) {
            console.error('Error fetching product by product_id');
            throw error;
        }
    }
    async getCountriesByContinent(continent) {
        console.log("Continent: ", continent);
        try {
            const [rows] = await pool.query('SELECT country_name FROM search_countries WHERE region_name=?', [continent.continent]);
            console.log("countries by continent: ", rows);
            return rows;
        } 
        catch (error) {
            console.error('Error fetching countries:', error.message);
            throw error;
        }
    }

    async getTypeByCountry(country) {
        console.log("Country: ", country);
        try {
            const [rows] = await pool.query('SELECT DISTINCT type_name, type_id FROM product_types WHERE country_name=?', [country.country]);
            console.log('Types by Country: ', rows)
            return rows;
        }
        catch (error) {
            console.error('Error fetching product types: ', error.message);
            throw error;
        }
    }

    async getProductsByCountryType(country, type) {
        console.log('Request Parameters:', { country, type });
        try {
            const [mySQLRows] = await pool.query('SELECT * FROM product_info WHERE country_name=? AND type_id=?', [country, type]);

            const mongoDb = await client.db('products');
            const cacaoCollection = mongoDb.collection(type);    // remember to change hardcode
            const mongoDbDocs = await cacaoCollection.find({}).toArray();
            console.log('All documents in cacao collection:', mongoDbDocs);

            // Combine MySQL and MongoDB data based on the _id
            const combinedInfo = mySQLRows.map(mysqlProduct => {
                const mongoDbDoc = mongoDbDocs.find(doc => doc._id.toString() === mysqlProduct.object_id);
                return {
                    ...mysqlProduct,
                    mongodbData: mongoDbDoc
                };
            });
            return combinedInfo;
        } catch (error) {
            console.error('Error fetching product details:', error.message);
            throw error;
        }
    }
    
    async getProductType() {
        try {
            const [rows] = await pool.query('SELECT DISTINCT type_name, type_id from product_types;');
            console.log('types: ', rows)
            return rows;
        } catch (error) {
            console.error('Error fetching product types: ', error.message);
            throw error;
        }
    }

    async getProductsByType(type_id) {
        const type = JSON.stringify(type_id);
        console.log('type: ', type);


        try {
            const[mySQLRows]= await pool.query('SELECT * FROM product_info WHERE type_id=?;', [type_id.type]);
            console.log ('products by type:', mySQLRows)

            const mongoDb = await client.db('products');
            const cacaoCollection = mongoDb.collection(type_id.type);    // here i would want to pass the parameter of type_id ('ca' for example)

            const mongoDbDocs = await cacaoCollection.find({}).toArray();
            console.log('All documents in cacao collection:', mongoDbDocs);

            // Combine MySQL and MongoDB data based on the _id
            const combinedInfo = mySQLRows.map(mysqlProduct => {
                const mongoDbDoc = mongoDbDocs.find(doc => doc._id.toString() === mysqlProduct.object_id);
                return {
                    ...mysqlProduct,
                    mongodbData: mongoDbDoc
                };
            });
            return combinedInfo;
        } catch (error) {
            console.error('Error fetching product details:', error.message);
            throw error;
        }
    }

    async getProductsByRating() {
        try {
            const [mySQLRows] = await pool.query('SELECT * from product_info where avg_rating > (select avg(avg_rating) from product_info);');
            console.log('products by rating: ', mySQLRows);

            const mongoDb = await client.db('products');

            const cacaoCollection = mongoDb.collection('ca');    // remember to change hardcode
            const mongoDbDocs = await cacaoCollection.find({}).toArray();

            // Combine MySQL and MongoDB data based on the _id
            const combinedInfo = mySQLRows.map(mysqlProduct => {
            const mongoDbDoc = mongoDbDocs.find(doc => doc._id.toString() === mysqlProduct.object_id);
            return {
                ...mysqlProduct,
                mongodbData: mongoDbDoc
            };
          });
          return combinedInfo;
        } catch (error) {
            console.error('Error fetching product details:', error.message);
            throw error;
        }
    }

    async getProductRating(product_id) {
        try {
            const query = 'SELECT product_rating.product_id, product_rating.user_id, product_rating.rating, product_rating.rating_date, product_rating.rating_details FROM product_rating JOIN product ON product_rating.product_id = product.product_id WHERE product_rating.product_id=? ORDER BY product.product_id';
            const [mySQLRows] = await pool.query(query, [product_id]);
            console.log('ratings for product: ', mySQLRows);

            const ratings = [];
            for (let i = 0; i < mySQLRows.length; i++) {
                let rating = mySQLRows[i].rating_details;
                let reviewer = mySQLRows[i].user_id;
                let review = {
                    rating: rating,
                    reviewer: reviewer
                }
                ratings.push(review);
            }

            return ratings;
        } catch (error) {
            console.error('Error fetching reviews for product: ', error.message);
            throw error;
        }
    }
}

module.exports = new ProductService();