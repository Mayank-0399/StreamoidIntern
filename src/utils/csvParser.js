// src/utils/csvParser.js
const csv = require('csv-parser');
const { Readable } = require('stream');
const config = require('../config');

function validateRow(row) {
    for (const field of config.REQUIRED_FIELDS) {
        if (!row[field] || String(row[field]).trim() === '') {
            return { isValid: false, reason: `Missing required field: ${field}` };
        }
    }

    const mrp = parseFloat(row.mrp);
    const price = parseFloat(row.price);
    const quantity = parseInt(row.quantity);

    if (isNaN(mrp) || isNaN(price) || isNaN(quantity)) {
        return { isValid: false, reason: 'MRP, Price, or Quantity is not a valid number' };
    }

    if (price > mrp) {
        return { isValid: false, reason: 'Price cannot be greater than MRP' };
    }

    if (quantity < 0) {
        return { isValid: false, reason: 'Quantity must be non-negative' };
    }

    const validProduct = {
        sku: String(row.sku).trim(),
        name: String(row.name).trim(),
        brand: String(row.brand).trim(),
        color: row.color ? String(row.color).trim() : null,
        size: row.size ? String(row.size).trim() : null,
        mrp: mrp,
        price: price,
        quantity: quantity,
    };

    return { isValid: true, product: validProduct };
}

async function parseAndValidate(buffer) {
    const validProducts = [];
    const failedRows = [];
    let rowIndex = 0;

    const stream = Readable.from(buffer.toString());

    return new Promise((resolve, reject) => {
        stream
            .pipe(csv())
            .on('data', (row) => {
                rowIndex++;
                const result = validateRow(row);

                if (result.isValid) {
                    validProducts.push(result.product);
                } else {
                    failedRows.push({ 
                        row_number: rowIndex,
                        sku: row.sku || 'N/A', 
                        reason: result.reason 
                    });
                }
            })
            .on('end', () => {
                resolve({ validProducts, failedRows });
            })
            .on('error', (error) => {
                reject(new Error(`CSV Parsing failed: ${error.message}`));
            });
    });
}

module.exports = {
    parseAndValidate
};