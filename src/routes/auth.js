const express = require("express");
const auth = require("../controllers/auth");

const router = new express.Router();

router.post("/user/signup", auth.signup);
router.post("/user/login", auth.login)

module.exports = router;
