const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const Product = require("../models/product");

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
    try {
        // PAGINATION
        const {
            category,
            filter,
            sortBy,
            order,
            page = 1,
            limit = 6,
            search,
        } = req.query;

        // FILTERING AND SORTING
        let match = {
            category,
        };

        if (filter === "popular") {
            match.popular = true;
        }

        if (filter === "all") {
            match = { ...match };
        }

        if (category === "all") {
            delete match.category;
        }

        let sort = {
            [sortBy]: order,
        };

        // SEARCHING
        if (search) {
            match = { ...match, name: { $regex: search, $options: "i" } };
        }

        const products = await Product.find(match)
            .select("-image")
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const totalProducts = await Product.find(match).countDocuments();

        res.send({ products, totalProducts });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// GET A SINGLE PRODUCT
const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById({ _id: req.params.id }).select(
            "-image"
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

// GET POPULAR PRODUCTS
const getPopularProducts = async (req, res) => {
    try {
        const products = await Product.find({ popular: true }).select("-image");

        res.send({ products });
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

        const imagePath =
            path.join(__dirname, "../assets/uploads") +
            `/${req.file.fieldname}-${Date.now()}.png`;

        // RESIZE THE UPLOADED IMAGE AND SAVE TO ASSETS/UPLOADS FOLDER
        await sharp(req.file.path).toFile(imagePath);

        // DELETE THE ORIGINAL UPLOADED IMAGE
        fs.unlinkSync(req.file.path);

        const product = new Product({
            ...req.body,
            image: imagePath,
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

const getProductImage = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);

        res.sendFile(product.image);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getSingleProduct,
    getPopularProducts,
    addNewProduct,
    updateProduct,
    deleteProduct,
    getProductImage,
};
