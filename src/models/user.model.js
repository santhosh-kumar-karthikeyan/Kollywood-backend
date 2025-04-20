const mongoose = require("../utils/db");

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User",userSchema);

module.exports = User;