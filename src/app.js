const express = require("express");
const staticRoutes = require("./routes/staticRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express()

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"./public")));

//routes
app.use("/",staticRoutes);
app.use("/auth",authRoutes);



module.exports = app;