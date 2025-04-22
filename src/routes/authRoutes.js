const express = require("express");
const router = express.Router();

const {checkUsername,validateLogin,addUser, changePassword} = require("../controllers/authController");
router.get("/checkUsername", checkUsername);
router.post("/login", validateLogin);
router.post("/addUser", addUser);
router.post("/changePassword", changePassword);

module.exports = router;