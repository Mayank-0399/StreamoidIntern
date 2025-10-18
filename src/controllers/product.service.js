
const db = require('../db');
const config = require('../config');
const { parseAndValidate } = require('../utils/csvParser');

async function insertProducts(products) {
    if (products.length === 0) return 0;

    let storedCount = 0;
    await db.db.run('BEGIN TRANSACTION');
    try {
        for (const product of products) {
            const insertSql = `
                INSERT OR REPLACE INTO ${config.PRODUCT_TABLE} (sku, name, brand, color, size, mrp, price, quantity) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await db.run(insertSql, [
                product.sku, product.name, product.brand, product.color, 
                product.size, product.mrp, product.price, product.quantity
            ]);
            storedCount++;
        }
        await db.db.run('COMMIT');
    } catch (error) {
        await db.db.run('ROLLBACK');
        console.error('Batch insert failed, rolling back:', error);
        throw new Error('Database insertion failed.');
    }

    return storedCount;
}

async function uploadAndStoreProducts(fileBuffer) {
    try {
        const { validProducts, failedRows } = await parseAndValidate(fileBuffer);
        const storedCount = await insertProducts(validProducts);

        return {
            stored: storedCount,
            failed: failedRows.map(f => ({ sku: f.sku, reason: f.reason }))
        };

    } catch (error) {
        console.error('Error during upload and store process:', error);
        throw new Error(`Processing failed: ${error.message}`);
    }
}

async function listProducts({ page = 1, limit = config.PAGINATION.DEFAULT_LIMIT }) {
    const parsedLimit = Math.min(parseInt(limit), config.PAGINATION.MAX_LIMIT) || config.PAGINATION.DEFAULT_LIMIT;
    const parsedPage = parseInt(page) > 0 ? parseInt(page) : 1;
    const offset = (parsedPage - 1) * parsedLimit;

    const sql = `SELECT * FROM ${config.PRODUCT_TABLE} LIMIT ? OFFSET ?`;
    const products = await db.all(sql, [parsedLimit, offset]);
    
    return products;
}

async function searchProducts(filters) {
    let sql = `SELECT * FROM ${config.PRODUCT_TABLE} WHERE 1=1`;
    const params = [];

    if (filters.brand) {
        sql += ' AND brand = ?';
        params.push(filters.brand);
    }

    if (filters.color) {
        sql += ' AND color = ?';
        params.push(filters.color);
    }

    const minPrice = parseFloat(filters.minPrice);
    const maxPrice = parseFloat(filters.maxPrice);

    if (!isNaN(minPrice) && minPrice >= 0) {
        sql += ' AND price >= ?';
        params.push(minPrice);
    }

    if (!isNaN(maxPrice) && maxPrice >= 0) {
        sql += ' AND price <= ?';
        params.push(maxPrice);
    }
    
    sql += ` LIMIT ${config.PAGINATION.MAX_LIMIT}`;

    const products = await db.all(sql, params);
    return products;
}

module.exports = {
    uploadAndStoreProducts,
    listProducts,
    searchProducts
};