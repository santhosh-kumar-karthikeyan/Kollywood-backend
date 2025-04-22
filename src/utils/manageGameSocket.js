const GameRoom = require("../models/gameRoom.model");
const { createRoom, addPlayerToRoom, activeRooms, isInRoom } = require("./activeRooms");

async function generateRoomId() {
    const latestRoom = GameRoom.findOne().sort({code: -1}).exec();
    const nextCode = latestRoom ? latestRoom + 1 : 1;
    return nextCode;
}

function manageGameSocket(io) {
    io.on("connection", (socket) => {
        console.log(`New socket connected: ${socket.id}`);
        socket.on("createRoom",async ({playerName} , callback) => {
            const roomCode = generateRoomId();
            const newRoom  = new GameRoom({
                code: roomCode,
                players: [
                    { 
                        socketId: socket.id,
                        name: playerName
                    }
                ]
            });
            await newRoom.save();
            socket.join(roomCode);
            createRoom(roomCode,socket.id);
            callback({
                success : true,
                roomCode
            });
        });
        socket.on("joinRoom", async ({playerName, roomCode}, callback) => {
            const room = await GameRoom.findOne({code: roomCode});
            if(!room || room.players.length >= 2) { 
                callback({
                    success: false,
                    message: "Room full"
                });
            }
            room.players.push({
                socketId: socket.id,
                playerName
            });
            addPlayerToRoom(roomCode,socket.id);
            room.isGameStarted = true;
            await room.save();
            socket.join(roomCode);
            io.to(roomCode).emit('startGame', {
                players: room.players
            });
        });
        // socket.on("won", async)
        socket.on("submitGuess", async ({roomCode, guess} , callback) => {
            if(isInRoom(roomCode,socket.id) && !activeRooms[roomCode].winner) {
                const tempClue = activeRooms[roomCode].clue.verifyClue(guess);
                if(tempClue.allTrue) {
                    activeRooms[roomCode].winner = socket.id;
                    socket.emit("won")
                    console.log(`Game won by: ${socket.id}`);
                }
            }
        });
    
    });
};


module.exports = manageGameSocket;