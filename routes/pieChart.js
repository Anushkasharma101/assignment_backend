const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/pie-chart', async (req, res) => {
    const { month } = req.query;

    // Validate month parameter
    if (!month || !/^(0[1-9]|1[0-2])$/.test(month)) {
        return res.status(400).send('Invalid month parameter. It should be a number between 01 and 12.');
    }

    try {
        const categories = await Product.aggregate([
            {
                $project: {
                    category: 1,
                    monthOfSale: {
                        $month: "$dateOfSale" // Extract the month from dateOfSale
                    }
                }
            },
            {
                $match: {
                    monthOfSale: parseInt(month) // Match documents where monthOfSale equals the provided month
                }
            },
            {
                $group: {
                    _id: '$category', // Group by category
                    count: { $sum: 1 } // Count documents in each category
                }
            }
        ]);

        res.json(categories);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).send('Error fetching pie chart data');
    }
});

module.exports = router;
