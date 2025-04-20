const path = require("path");
const dotenv = require("dotenv");
dotenv.config({path: path.resolve("../../.env")});
const SPORTIFY_CLIENT_ID = process.env.SPORTIFY_CLIENT_ID;