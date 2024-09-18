const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the 'uploads' directory
app.use(express.static(path.join(__dirname, 'uploads')));

// Export the Express app
module.exports = app;
