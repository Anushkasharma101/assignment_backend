const mongoose = require('mongoose');

// Define the schema for product transactions

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    dateOfSale: {
        type: Date,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    sold: {
        type: Boolean,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },

}, {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
});

// Create a model from the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
