const express = require("express");
const auth = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

const router = new express.Router();

router.post("/auth/signup", auth.signup);
router.post("/auth/login", auth.login);
router.post("/auth/logout", authMiddleware, auth.logout);

module.exports = router;
