const express = require("express");
const router = express.Router();
const { getMatchDetails, getUserHistory, getRoomCodeToJoin } = require("../controllers/gameRoomController");

router.get("/getMatchDetails", getMatchDetails);
router.get("/getUserHistory", getUserHistory);
router.get("/getRoomCode", getRoomCodeToJoin)
module.exports = router;