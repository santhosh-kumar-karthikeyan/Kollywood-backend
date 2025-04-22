const express = require("express");
const router = express.Router();
const { getUser, getScore } = require("../controllers/userController");

router.get("/getUser",getUser);
router.get("/getScore",getScore);

module.exports = router;