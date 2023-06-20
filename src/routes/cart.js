const express = require("express");
const cart = require("../controllers/cart");
const authMiddleware = require("../middleware/auth");

const router = new express.Router();

// GET ALL USER CART ITEMS
router.get("/cart", authMiddleware, cart.getCartProducts);

// ADD A NEW USER CART ITEM
router.post("/cart", authMiddleware, cart.addProductToCart);

// DELETE A USER CART ITEM
router.delete("/cart/:productId", authMiddleware, cart.deleteCartProduct);

// DELETE ALL CART ITEMS
router.delete("/cart", authMiddleware, cart.emptyCart);

module.exports = router;
