const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/",(req,res) => res.sendFile(path.join(__dirname,"../public/index.html")));
router.get("/login", (req,res) => res.sendFile(path.join(__dirname,"../public/login.html")));
router.get("/leaderboard", (req, res) => res.sendFile(path.join(__dirname, "../public/leaderboard.html")));
router.get("/rules", (req, res) => res.sendFile(path.join(__dirname, "../public/rules.html")));
router.get("/signUp", (req, res) => res.sendFile(path.join(__dirname, "../public/signUp.html")));
router.get("/matchUp", (req, res) => res.sendFile(path.join(__dirname, "../public/matchup.html")));

module.exports = router;
