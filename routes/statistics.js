const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/statistics', async (req, res) => {
    const { month } = req.query;

    // Validate month parameter
    if (!month || !/^(0[1-9]|1[0-2])$/.test(month)) {
        return res.status(400).send('Invalid month parameter. It should be a number between 01 and 12.');
    }

    try {
        // Aggregate statistics for the given month irrespective of the year
        const totalSales = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$price' },
                    totalItemsSold: { $sum: { $cond: [{ $eq: ['$sold', true] }, 1, 0] } },
                    totalItemsNotSold: { $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] } }
                }
            }
        ]);

        // Log the result of aggregation for debugging
        console.log('Total Sales:', JSON.stringify(totalSales, null, 2));

        // Format the response
        const response = {
            month: month,
            totalAmount: (totalSales[0] && totalSales[0].totalAmount) || 0,
            totalItemsSold: (totalSales[0] && totalSales[0].totalItemsSold) || 0,
            totalItemsNotSold: (totalSales[0] && totalSales[0].totalItemsNotSold) || 0
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).send('Error fetching statistics');
    }
});

module.exports = router;
