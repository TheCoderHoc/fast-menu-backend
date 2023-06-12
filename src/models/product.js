const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a product name"],
            unique: [true, "You already have a product with this name."],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Please provide a product price."],
            min: [1, "Please enter a valid product price."],
        },
        rating: {
            type: Number,
            required: [true, "Please enter a rating number between 1 and 5."],
            min: [1, "Please enter a rating number between 1 and 5."],
            max: [5, "Please enter a rating number between 1 and 5."],
        },
        image: {
            type: String,
            required: [true, "Please provide a product image"],
        },
        popular: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = {
    Product,
    productSchema,
};
