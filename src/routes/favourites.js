const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
    getAllFavourites,
    toggleFavourites,
} = require("../controllers/favourites");

const router = new express.Router();

// GET ALL FAVOURITE MEALS
router.get("/favourites", authMiddleware, getAllFavourites);

// ADD A MEAL TO THE USER FAVOURITES
router.post("/favourites/:productId", authMiddleware, toggleFavourites);

module.exports = router;
