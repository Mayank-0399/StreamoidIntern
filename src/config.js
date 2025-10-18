
const path = require('path');

module.exports = {
    PORT: 8000,
    DB_PATH: path.join(__dirname, '..', 'data', 'catalog.db'),
    PRODUCT_TABLE: 'products',
    REQUIRED_FIELDS: ['sku', 'name', 'brand', 'mrp', 'price'],
    PAGINATION: {
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 50
    }
};