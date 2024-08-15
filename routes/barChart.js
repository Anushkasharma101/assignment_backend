const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/bar-chart', async (req, res) => {
    const { month } = req.query;

    // Validate month parameter
    if (!month || !/^(0[1-9]|1[0-2])$/.test(month)) {
        return res.status(400).send('Invalid month parameter. It should be a number between 01 and 12.');
    }

    try {
        const results = await Product.aggregate([
            {
                $project: {
                    price: 1,
                    monthOfSale: {
                        $month: "$dateOfSale" // Extract the month from the date
                    }
                }
            },
            {
                $match: {
                    monthOfSale: parseInt(month) // Match the month
                }
            },
            {
                $bucket: {
                    groupBy: "$price",
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
                    default: "Other",
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);

        // Initialize response with default values
        const response = [
            { range: '0 - 100', count: 0 },
            { range: '101 - 200', count: 0 },
            { range: '201 - 300', count: 0 },
            { range: '301 - 400', count: 0 },
            { range: '401 - 500', count: 0 },
            { range: '501 - 600', count: 0 },
            { range: '601 - 700', count: 0 },
            { range: '701 - 800', count: 0 },
            { range: '801 - 900', count: 0 },
            { range: '901-above', count: 0 }
        ];

        // Update response based on aggregation results
        results.forEach(bucket => {
            if (bucket._id >= 0 && bucket._id <= 100) response[0].count = bucket.count;
            else if (bucket._id >= 101 && bucket._id <= 200) response[1].count = bucket.count;
            else if (bucket._id >= 201 && bucket._id <= 300) response[2].count = bucket.count;
            else if (bucket._id >= 301 && bucket._id <= 400) response[3].count = bucket.count;
            else if (bucket._id >= 401 && bucket._id <= 500) response[4].count = bucket.count;
            else if (bucket._id >= 501 && bucket._id <= 600) response[5].count = bucket.count;
            else if (bucket._id >= 601 && bucket._id <= 700) response[6].count = bucket.count;
            else if (bucket._id >= 701 && bucket._id <= 800) response[7].count = bucket.count;
            else if (bucket._id >= 801 && bucket._id <= 900) response[8].count = bucket.count;
            else if (bucket._id >= 901) response[9].count = bucket.count;
        });

        res.json(response);
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).send('Error fetching bar chart data');
    }
});

module.exports = router;
