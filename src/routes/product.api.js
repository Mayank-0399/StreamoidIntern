
const express = require('express');
const multer = require('multer');
const productService = require('../controllers/product.service');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); 

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded. Please send a CSV file named "file".' });
    }

    try {
        const result = await productService.uploadAndStoreProducts(req.file.buffer);
        res.json(result); 
    } catch (error) {
        console.error('Upload Error:', error.message);
        res.status(500).json({ error: error.message || 'Internal server error during processing.' });
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await productService.listProducts(req.query);
        res.json(products);
    } catch (error) {
        console.error('List Error:', error.message);
        res.status(500).json({ error: 'Internal server error while retrieving products.' });
    }
});

router.get('/products/search', async (req, res) => {
    try {
        const products = await productService.searchProducts(req.query);
        res.json(products);
    } catch (error) {
        console.error('Search Error:', error.message);
        res.status(500).json({ error: 'Internal server error during search.' });
    }
});

module.exports = router;