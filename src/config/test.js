const { MongoClient } = require('mongodb');

const mongoConfig = {
  host: '127.0.0.1',
  port: 27017,
  database: 'product'
};

// Connection URI
const uri = `mongodb://${mongoConfig.host}:${mongoConfig.port}`;

// Create a new MongoClient
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function runQuery() {
  try {
    // Connect to MongoDB
    await client.connect();

    // Select the database
    const database = client.db(mongoConfig.database);

    // Select the collection
    const collection = database.collection('cacao');

    // Execute the query
    const result = await collection.find({}, { _id: 0, 'organolepticEvaluation.bitterness': 1, pricePerKilo: 1 }).toArray();

    // Log the result
    console.log(result);
  } finally {
    // Close the connection
    await client.close();
  }
}

// Run the query
runQuery();
