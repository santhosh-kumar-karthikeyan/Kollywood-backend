const mongoose = require("mongoose");
const gameRoomSchema = new mongoose.Schema({
        roomcode: {
            type: String,
            required: true,
            unique: true
        },
        players: [
            {
                socketId: String,
                name: String,
                score : {
                    type: Number,
                    default : 0,
                }
            }
        ],
        isGameStarted: {
            type: Boolean,
            default: false
        },
        winner : {
            type: Number,
            default : 0
        }
    },
    {
        timestamps: true
    }
);

const GameRoom = mongoose.model("GameRoom", gameRoomSchema);
module.exports = GameRoom;