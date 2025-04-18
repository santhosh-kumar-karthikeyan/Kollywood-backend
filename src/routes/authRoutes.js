const express = require("express");
const app = express();
const router = express.Router();


const {checkUsername,validateLogin,validateSignup} = require("../controllers/authController");
router.post("/validateLogin",validateLogin);
router.post("/validateSignup", validateSignup);
router.post("/checkUsername",checkUsername);


module.exports = router;