const express = require("express");
const router = express.Router();
const { getUser, getScore,changePassword } = require("../controllers/userController");

router.get("/getUser",getUser);
router.get("/getScore",getScore);
router.post("/changePassword", changePassword);

module.exports = router;