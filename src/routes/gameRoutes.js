const express = require("express");
const router = express.Router();
const { getMatchDetails, getUserHistory } = require("../controllers/gameRoomController");

router.get("/getMatchDetails", getMatchDetails);
router.get("/getUserHistory", getUserHistory);

module.exports = router;