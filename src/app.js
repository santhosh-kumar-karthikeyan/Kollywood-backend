const express = require("express");
const staticRoutes = require("./routes/staticRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require("path");
const cors = require("cors");
const { mongoose, connectKollywood} = require("./utils/db");
const app = express()
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const manageGameSocket = require("./utils/manageGameSocket");
const io = socketIO(server);

//database
connectKollywood();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"./public")));

//routes
app.use("/",staticRoutes);
app.use("/auth",authRoutes);

//gameSocket server
manageGameSocket(io);

module.exports = { app, server };