const express = require("express");
const router = express.Router();
const { register, login, verifyEmail } = require("../controllers/auth.js");
const auth = require("../middleware/auth.js");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", auth, verifyEmail);

module.exports = router;
