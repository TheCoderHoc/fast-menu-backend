const path = require("path");
const express = require("express");
const multer = require("multer");

const {
    getAllProducts,
    getSingleProduct,
    getPopularProducts,
    addNewProduct,
    updateProduct,
    deleteProduct,
    getProductImage,
} = require("../controllers/product");

const router = new express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destFolder = path.join(__dirname, "../assets/uploads");

        cb(null, destFolder);
    },

    filename: function (req, file, cb) {
        const fileExtension = file.mimetype.split("/")[1];

        cb(null, `${file.fieldname}-${Date.now()}.${fileExtension}`);
    },
});

const upload = multer({
    // RESTRICT PRODUCT IMAGE FILE SIZE TO 1MB
    limits: {
        fileSize: 1000000,
    },

    // ONLY ACCEPT PNG JPEG AND PNG IMAGE FILE FORMATS
    fileFilter: function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            callback(new Error("Please upload an image file"));
            return;
        }

        callback(undefined, true);
    },

    storage: storage,
});

// GET POPULAR PRODUCTS
router.get("/products/popular", getPopularProducts);

// GET ALL PRODUCTS
router.get("/products", getAllProducts);

// GET A SINGLE PRODUCT
router.get("/products/:id", getSingleProduct);

// ADD A NEW PRODUCT
router.post("/products", upload.single("productImage"), addNewProduct);

// UPDATE A PRODUCT
router.patch("/products/:id", updateProduct);

// DELETE A PRODUCT
router.delete("/products/:id", deleteProduct);

// GET PRODUCT IMAGE
router.get("/products/:id/image", getProductImage);

module.exports = router;
