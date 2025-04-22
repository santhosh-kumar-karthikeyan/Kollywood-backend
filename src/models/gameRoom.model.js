const mongoose = require("mongoose");
const gameRoomSchema = new mongoose.Schema({
        code: {
            type: String,
            required: true,
            unique: true
        },
        players: [
            {
                socketId: String,
                name: String
            }
        ],
        isGameStarted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const GameRoom = mongoose.model("GameRoom", gameRoomSchema);
module.exports = GameRoom;