const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/combined', async (req, res) => {
    try {
        const month = req.query.month;
        const [ statistics, barChart, pieChart] = await Promise.all([
            axios.get(`http://localhost:3000/api/statistics?month=${month}`),
            axios.get(`http://localhost:3000/api/bar-chart?month=${month}`),
            axios.get(`http://localhost:3000/api/pie-chart?month=${month}`)
        ]);
        res.json({
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
