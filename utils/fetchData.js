const axios = require('axios');
const Product = require('../models/product');

// Function to fetch product data from the third-party API
const fetchProductData = async () => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch product data: ' + error.message);
    }
};

// Function to initialize the database with fetched data
const initializeDatabase = async () => {
    try {
        const productData = await fetchProductData();
        // Clear existing data
        await Product.deleteMany({});
        // Map and insert data into the database
        // {
        //     "id": 1,
        //     "title": "Fjallraven  Foldsack No 1 Backpack Fits 15 Laptops",
        //     "price": 329.85,
        //     "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop up to 15 inches in the padded sleeve your everyday",
        //     "category": "men's clothing",
        //     "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        //     "sold": false,
        //     "dateOfSale": "2021-11-27T20:29:54+05:30"
        // }
        const products = productData.map(item => ({
            productId: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            dateOfSale: new Date(item.dateOfSale),
            image:item.image,
            sold:item.sold,
            category: item.category,
        }));
        await Product.insertMany(products);
        console.log('Database initialized with seed data');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

module.exports = {
    fetchProductData,
    initializeDatabase,
};
