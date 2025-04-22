const express = require("express");
const router = express.Router();

const {checkUsername,validateLogin,validateSignup} = require("../controllers/authController");
router.get("/checkUsername", checkUsername);
router.post("/validateLogin", validateLogin);
router.post("/validateSignup", validateSignup);


module.exports = router;