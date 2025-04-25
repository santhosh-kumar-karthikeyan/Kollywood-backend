// importing libraries
const express = require("express");
const path = require("path");
const cors = require("cors");
const socketIO = require("socket.io");


// importing custom middlewares
const { jwtAuth } = require("./middlewares/auth");

// importing routes
const staticRoutes = require("./routes/staticRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");

// importing utilities
const { connectKollywood } = require("./utils/db");
const manageGameSocket = require("./utils/manageGameSocket");

// server configuration
const app = express()
const http = require("http");
const server = http.createServer(app);
const io = socketIO(server);

//database configuration
connectKollywood();

//middleware configuration
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"./public")));

// route configuration
app.use("/",staticRoutes);
app.use("/auth",authRoutes);
app.use("/user",jwtAuth,userRoutes);
app.use("/game",jwtAuth,gameRoutes);

//gameSocket server configuration
manageGameSocket(io);

module.exports = { app, server };