const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Ensure this path is correct

router.get('/transactions', async (req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;
    const skip = (page - 1) * perPage;

    // Helper function to check if a value is numeric
    const isNumeric = value => !isNaN(value) && isFinite(value);

    try {
        // Build query object
        const query = {};

        if (search) {
            if (isNumeric(search)) {
                // Numeric search - apply to price field
                query.price = Number(search);
            } else {
                // String search - apply regex to title or description
                query.$or = [
                    { title: { $regex: new RegExp(search, 'i') } }, // Search in title
                    { description: { $regex: new RegExp(search, 'i') } } // Search in description
                ];
            }
        }

        // Debugging: Log the query object to ensure it’s built correctly
        console.log('Query:', JSON.stringify(query, null, 2));

        // Fetch products with pagination and search
        let products = await Product.find(query).skip(skip).limit(Number(perPage));
        let count = await Product.countDocuments(query);

        // If no products found, fetch all products for the page
        if (count === 0 && search) {
            console.log('No products found with search criteria. Fetching all products for the page.');
            products = await Product.find().skip(skip).limit(Number(perPage));
            count = await Product.countDocuments(); // Total number of products
        }

        // Debugging: Log the number of products found
        console.log('Number of products found:', count);

        res.json({ products, total: count });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send('Error fetching transactions');
    }
});

module.exports = router;
