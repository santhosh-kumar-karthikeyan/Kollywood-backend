const express = require("express");
const router = express.Router();

const {checkUsername,validateLogin,addUser} = require("../controllers/authController");
router.get("/checkUsername", checkUsername);
router.post("/login", validateLogin);
router.post("/signup", addUser);


module.exports = router;