const GameRoom = require("../models/gameRoom.model");
const { createRoom, addPlayerToRoom, activeRooms, isInRoom } = require("./activeRooms");

async function generateRoomId() {
    let roomCode;
    let isUnique = false;
    const { humanId } =await import('human-id');
    while(!isUnique) {
        roomCode = humanId({separator: '-', capitalize: false});
        console.log(roomCode);
        const existingRoom = await GameRoom.findOne({roomCode: roomCode});
        if(!existingRoom)
            isUnique = true;
    }
    return roomCode;
}

function manageGameSocket(io) {
    io.on("connection", (socket) => {
        console.log(`New socket connected: ${socket.id}`);
        socket.on("createRoom", async ({ playerName }, callback) => {
            try {
                const roomCode = await generateRoomId();
                if (!roomCode) {
                    console.log("Room code not found");
                    return callback({ success: false, message: "Failed to generate room code" });
                }
                console.log(roomCode);
                console.log("player name: " + playerName);
                const existingRoom = await GameRoom.findOne({ roomcode: roomCode });
                if (existingRoom) {
                    return callback({ success: false, message: "Room code already exists" });
                }
                console.log("No existing rooms");
                const newRoom = new GameRoom({
                    roomcode: roomCode,
                    players: [
                        {
                            socketId: socket.id,
                            name: playerName,
                        },
                    ],
                });
                await newRoom.save();
                console.log('Room saved successfully:', newRoom);
                socket.join(roomCode);
                createRoom(roomCode, socket.id);
                callback({
                    success: true,
                    roomCode,
                });
            } catch (error) {
                console.error('Error creating room:', error);
                callback({ success: false, message: 'Error creating room' });
            }
        });
        socket.on("joinRoom", async ({playerName, roomCode}, callback) => {
            const room = await GameRoom.findOne({roomCode: roomCode});
            console.log("Join room called with roomcode: "+roomCode);
            if(!room || room.players.length >= 2) { 
                console.log(room);
                console.log("room full");
                callback({
                    success: false,
                    message: "Room full"
                });
            }
            room.players.push({
                socketId: socket.id,
                name: playerName
            });
            addPlayerToRoom(roomCode,socket.id);
            room.isGameStarted = true;
            await room.save();
            socket.join(roomCode);
            callback({
                success: true,
                roomCode: roomCode
            })
        });
        // socket.on("won", async)
        socket.on("getMovie", async({roomCode}, callback) => {
            if(isInRoom(roomCode,socket.id && !activeRooms[roomCode].winner)) {
                const clueToSend = activeRooms[roomCode].clue;
                callback(clueToSend);
            }
        });
        // socket.on("submitGuess", async ({roomCode, guess} , callback) => {
        //     if(isInRoom(roomCode,socket.id) && activeRooms[roomCode].winner === 0) {
        //         const currentMovie = activeRooms[roomCode].movie;
        //         const currentPlayerIndex = activeRooms[roomCode].players.indexOf(socket.id);
        //         if(activeRooms[roomCode].movie.values[guess.index] === guess.value) {

        //         }
        //     }
        // });
        socket.on("disconnect", (reason) => {
            console.log(`Socket disconnected: ${socket.id}`);
            console.log(reason);
            const roomCode = Object.keys(activeRooms).find((code) =>
                activeRooms[code].players.includes(socket.id)
            );
            if (roomCode) {
                const room = activeRooms[roomCode];
                room.players = room.players.filter((player) => player !== socket.id);
                if (room.players.length === 0) {
                    console.log(`Room ${roomCode} is now empty and will be deleted.`);
                    delete activeRooms[roomCode];
                } else {
                    activeRooms[roomCode].players = activeRooms[roomCode].players.filter(player => player !== socket.id);
                    console.log(activeRooms[roomCode].players);
                    console.log(`Player ${socket.id} removed from room ${roomCode}.`);
                }
            }
        });
    });
};

module.exports = manageGameSocket;