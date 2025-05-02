const mongoose = require("mongoose");

const gameRoomSchema = new mongoose.Schema({
        roomcode: { type: String, required: true, unique: true },
        players: { type: [String], required: true },
        remainingGuesses: { type: [Number], default: [9, 9] },
        found: { type: [Number], default: [0, 0] },
        score: { type: [Number], default: [0,0] },
        winner: { type:String, default: null },
    },
    {
        timestamps: true    
    }
);

module.exports = mongoose.model("GameRoom", gameRoomSchema);