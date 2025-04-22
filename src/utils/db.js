const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/Kollywood";

const connectKollywood = () => {
    mongoose.connect(MONGO_URI).then(async () => {
        console.log("Kollywood DB connected");
    });    
}
module.exports = {mongoose, connectKollywood};