const express = require("express");
const multer = require("multer");

const {
    getAllProducts,
    getSingleProduct,
    addNewProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/product");

const router = new express.Router();

const upload = multer({
    // RESTRICT PRODUCT IMAGE FILE SIZE TO 5MB
    limits: {
        fileSize: 5000000,
    },

    // ONLY ACCEPT PNG JPEG AND PNG IMAGE FILE FORMATS
    fileFilter: function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            callback(new Error("Please upload an image file"));
            return;
        }

        callback(undefined, true);
    },
});

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

module.exports = router;
