const express = require("express");
const router = express.Router();
const { getUser, getScore,changePassword, getUsers } = require("../controllers/userController");

router.get("/getUser",getUser);
router.get("/getScore",getScore);
router.post("/changePassword", changePassword);
router.get("/getUsers", getUsers);

module.exports = router;