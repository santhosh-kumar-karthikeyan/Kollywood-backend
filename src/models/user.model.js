const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
        username: { 
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        totalScore: {
            type: Number,
            default: 0
        }
    }, 
    {
        timestamps: true
    }
);

const User = mongoose.model("User",userSchema);

module.exports = User;