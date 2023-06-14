const express = require("express");
const {
    getCartProducts,
    addProductToCart,
    deleteCartProduct,
} = require("../controllers/cart");
const authMiddleware = require("../middleware/auth");

const router = new express.Router();

// GET ALL USER CART ITEMS
router.get("/cart", authMiddleware, getCartProducts);

// GET A SINGLE USER CART ITEM
router.get("/cart/:id");

// ADD A NEW USER CART ITEM
router.post("/cart", authMiddleware, addProductToCart);

// UPDATE A USER CART ITEM
router.patch("/cart/:id");

// DELETE A USER CART ITEM
router.delete("/cart/:productId", authMiddleware, deleteCartProduct);

module.exports = router;
