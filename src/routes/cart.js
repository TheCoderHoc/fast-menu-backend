const express = require("express");
const {
    getCartProducts,
    addProductToCart,
    deleteCartProduct,
    emptyCart,
} = require("../controllers/cart");
const authMiddleware = require("../middleware/auth");

const router = new express.Router();

// GET ALL USER CART ITEMS
router.get("/cart", authMiddleware, getCartProducts);

// ADD A NEW USER CART ITEM
router.post("/cart", authMiddleware, addProductToCart);

// DELETE A USER CART ITEM
router.delete("/cart/:productId", authMiddleware, deleteCartProduct);

// EMPTY CART
router.delete("/cart", authMiddleware, emptyCart);

module.exports = router;
