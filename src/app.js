const express = require('express');
const config = require('./config');
const db = require('./db');
const productRoutes = require('./routes/product.api');
const errorHandler = require('./utils/errorHandler');
const path = require('path');

const app = express();

app.use(express.json());


app.use('/', productRoutes); 

app.use(errorHandler); 
// Start Server
const server = app.listen(config.PORT, () => {
    
    console.log(`\n StreamoidIntern Service running at http://localhost:${config.PORT}`);
    
    console.log('Endpoints available:');
    console.log(`  - POST /upload (with file=@products.csv)`);
    console.log(`  - GET /products?page=1&limit=10\n`);
    console.log(`  - GET /products/search?brand=...&minPrice=...\n`);
});


process.on('SIGINT', () => {
    db.db.close(() => {
        console.log('SQLite connection closed. Server shutting down.');
        process.exit(0);
    });
});
