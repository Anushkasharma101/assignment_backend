const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Ensure this path is correct

router.get('/transactions', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month = '' } = req.query;
    const skip = (page - 1) * perPage;

    // Helper function to check if a value is numeric
    const isNumeric = value => !isNaN(value) && isFinite(value);

    try {
        // Build query object
        let query = {};

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

        // Apply month filtering logic
        if (month && isNumeric(month)) {
            // Ensure the month is valid (between 1 and 12)
            const monthNumber = Number(month);
            if (monthNumber >= 1 && monthNumber <= 12) {
                query.$expr = {
                    $eq: [{ $month: '$dateOfSale' }, monthNumber]
                };
            }
        }

        // Debugging: Log the query object to ensure it’s built correctly
        console.log('Query:', JSON.stringify(query, null, 2));

        // Fetch products with pagination, search, and month filter
        let products = await Product.find(query).skip(skip).limit(Number(perPage));
        let count = await Product.countDocuments(query);

        // If no products found with search criteria, fetch based only on month filter
        if (count === 0 && search) {
            console.log('No products found with search criteria. Fetching products for the specified month.');
            query = {}; // Reset query

            if (month && isNumeric(month)) {
                const monthNumber = Number(month);
                if (monthNumber >= 1 && monthNumber <= 12) {
                    query.$expr = {
                        $eq: [{ $month: '$dateOfSale' }, monthNumber]
                    };
                }
            }

            products = await Product.find(query).skip(skip).limit(Number(perPage));
            count = await Product.countDocuments(query); // Count based on month filter
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
