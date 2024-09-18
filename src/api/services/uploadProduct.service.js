const { client } = require('../../config/mongoDB');
const pool = require('../../config/mySQL');

class UploadProductService {
    async getProductType(id) {
        try {
            console.log("id", id);
            const mongoDb = await client.db('products');
            const productCollection = mongoDb.collection(id); 

            const mongoDbDocs = await productCollection.find({}).toArray(); 
            console.log("MongoDB Documents:", mongoDbDocs);
        
            const sanitizedDocs = mongoDbDocs.map(doc => {
                const { _id, name, ...rest } = doc;
                return rest;
            });

            //cacao hardcode
            // const mongoDb = await client.db('products');
            // const cacaoCollection = mongoDb.collection('ca'); // currently hardcoded

            // const mongoDbDocs = await cacaoCollection.find({}).toArray(); // currently hardcoded
            // console.log("MongoDB Documents:", mongoDbDocs);
        
            // const sanitizedDocs = mongoDbDocs.map(doc => {
            //     const { _id, name, ...rest } = doc;
            //     return rest;
            // });

            const schemaKeys = sanitizedDocs.length > 0 ? Object.keys(sanitizedDocs[0]) : [];
        
            const typologyKeys = [];
            const physicalEvaluationKeys = [];
            const organolepticEvalKeys = [];
            const organolepticEvalSubKeys = [];

            mongoDbDocs.forEach(doc => {
                if (doc.typology) {
                    Object.keys(doc.typology).forEach(key => {
                        if (!typologyKeys.includes(key)) {
                            typologyKeys.push(key);
                        }
                    });
                }
                if (doc.physicalEvaluation) {
                    Object.keys(doc.physicalEvaluation).forEach(key => {
                        if (!physicalEvaluationKeys.includes(key)) {
                            physicalEvaluationKeys.push(key);
                        }
                    });
                }
                if (doc.organolepticEvaluation) {
                    Object.keys(doc.organolepticEvaluation).forEach(key => {
                        if (!organolepticEvalKeys.includes(key)) {
                            organolepticEvalKeys.push(key);
                            // Push subkeys if organolepticEvaluation[key] is an object
                            if (typeof doc.organolepticEvaluation[key] === 'object') {
                                Object.keys(doc.organolepticEvaluation[key]).forEach(subKey => {
                                    if (!organolepticEvalSubKeys.includes(subKey)) {
                                        organolepticEvalSubKeys.push(subKey);
                                    }
                                });
                            }
                        }
                    });
                }
            });

            return { schemaKeys, typologyKeys, physicalEvaluationKeys, organolepticEvalKeys, organolepticEvalSubKeys };
        } catch (error) {
            console.error('Error fetching product types');
            throw error;
        }
    }

    async saveProduct(productData) {
        try {
            console.log("product data:", productData);
            const name = productData.name;
            console.log('Name:', name);

            // Save to MongoDB
            const mongoDb = await client.db('products');
            const cacaoCollection = mongoDb.collection('ca');
            const result = await cacaoCollection.insertOne(productData);
    
            console.log('Product saved successfully to MongoDB');

            // Save to MySQL

            const insertedId = result.insertedId.toString(); 
            console.log("id", insertedId);
           
            const randomPrice = Math.floor(Math.random() * (500 - 250 + 1)) + 250;
            console.log("random price: ", randomPrice);
            const randomProductId = Math.floor(Math.random() * (500 - 250 + 1)) + 250;
            console.log("random product id: ", randomProductId);

            const saveProductToMySQL = await pool.execute(
                'INSERT INTO product (product_id, type_id,supplier_id,unit_id,price,available_stock,harvest_date,harvest_cycle,object_id) VALUES (?,?,?,?,?,?,?,?,?)',
                [randomProductId.toString(), productData.productType, name, 'kg', '180', randomPrice.toString(), '2023-12-30', '75 days', insertedId] //change hardcode
        
            );
            console.log('Product saved successfully to mysql product database');
            
        

        } catch (error) {
            console.error('Error saving product to MongoDB:', error);
            throw error;
        }
    }
    
    
}

module.exports = new UploadProductService();
