const express = require('express');
const mongoose = require('mongoose');
const { initializeDatabase } = require('./utils/fetchData');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

const PORT = 3000;

mongoose.connect('mongodb+srv://as0846403:8dcmRgx8rQxzFlOb@cluster0.ieqxa.mongodb.net/products-db?retryWrites=true&w=majority', {});

app.use(express.json());
const transactionRoutes = require('./routes/tansactions');
const statisticsRoutes = require('./routes/statistics');
const barChartRoutes = require('./routes/barChart');
const pieChartRoutes = require('./routes/pieChart');
const combinedRoutes = require('./routes/combined');

app.use('/api', transactionRoutes);
app.use('/api', statisticsRoutes);
app.use('/api', barChartRoutes);
app.use('/api', pieChartRoutes);
app.use('/api', combinedRoutes);

// Endpoint to initialize the database
app.post('/initialize', async (req, res) => {
    try {
        await initializeDatabase();
        res.status(200).send('Database initialized with seed data');
    } catch (error) {
        res.status(500).send('Error initializing database');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
