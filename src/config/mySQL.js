const { createPool } = require('mysql2');   // pool helps manage database connections
const { MongoClient, ObjectId } = require('mongodb');

const pool = createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'key',
  database: 'agrarium',
  connectionLimit: 10,
});

module.exports = pool.promise();  // Use the promise() method to enable async/await
