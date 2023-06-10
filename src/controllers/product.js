const sharp = require("sharp");
const { Product } = require("../models/product");

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});

        res.send({ products });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// GET A SINGLE PRODUCT
const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById({ _id: req.params.id });

        if (!product) {
            res.status(404).send({ error: "Product not found" });
            return;
        }

        res.send({ product });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// ADD A NEW PRODUCT
const addNewProduct = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new Error("Please provide a product image.");
        }

        const buffer = await sharp(req.file.buffer)
            .resize({ width: 500, height: 500 })
            .png()
            .toBuffer();

        const product = new Product({
            ...req.body,
            image: buffer,
        });

        await product.save();

        res.status(201).send({ product });
    } catch (error) {
        next(error);
    }
};

// UPDATE A PRODUCT
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            { _id: req.params.id },
            { ...req.body },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            res.status(404).send({ error: "Product not found" });
            return;
        }

        res.send({ product });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// DELETE A PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete({ _id: req.params.id });

        if (!product) {
            res.status(404).send({ error: "Product not found" });
            return;
        }

        res.send({ product });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getSingleProduct,
    addNewProduct,
    updateProduct,
    deleteProduct,
};
