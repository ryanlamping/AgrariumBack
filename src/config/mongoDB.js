const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/products';

const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true} );
let database; // Variable to store the connected database

// connect to server:
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Base de datos conectada");

        const database = client.db('products');

        module.exports = database;
    } finally {
        await client.close();
    }
}

module.exports = { client, connectToDatabase, database };
