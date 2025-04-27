const GameRoom = require("../models/gameRoom.model");
const { createRoom, addPlayerToRoom, activeRooms, isInRoom } = require("./activeRooms");

async function generateRoomId() {
    let roomCode;
    let isUnique = false;
    const { humanId } = await import("human-id");
    while (!isUnique) {
        roomCode = humanId({ separator: "-", capitalize: false });
        console.log(roomCode);
        const existingRoom = await GameRoom.findOne({ roomcode: roomCode });
        if (!existingRoom) isUnique = true;
    }
    return roomCode;
}

function manageGameSocket(io) {
    io.on("connection", (socket) => {
        console.log(`New socket connected: ${socket.id}`);

        // Create a new room
        socket.on("createRoom", async ({ playerName }, callback) => {
            try {
                const roomCode = await generateRoomId();
                console.log(`Room created with code: ${roomCode}`);

                // Create in-memory room
                await createRoom(roomCode, playerName);

                // Save room to database
                const newRoom = new GameRoom({
                    roomcode: roomCode,
                    players: [ playerName],
                    remainingGuesses: [9, 9],
                    found: [0, 0],
                    winner: null,
                });
                await newRoom.save();

                socket.join(roomCode);
                callback({ success: true, roomCode });
            } catch (error) {
                console.error("Error creating room:", error);
                callback({ success: false, message: "Error creating room" });
            }
        });

        // Join an existing room
        socket.on("joinRoom", async ({ playerName, roomCode }, callback) => {
            const room = activeRooms[roomCode];
            console.log(`Join room called with roomCode: ${roomCode}`);
            if (!room || room.players.length > 2 || room.winner === null) {
                console.log("Room full or does not exist");
                return callback({ success: false, message: "Room full or does not exist" });
            }
            if (room.players.includes(playerName)) {
                console.log(`Player ${playerName} is already in the room. Waiting...`);
                return callback({ success: false, message: "You are already in the room. Please wait." });
            }

            // Add player to in-memory room
            addPlayerToRoom(roomCode, playerName);

            // Update database
            await GameRoom.updateOne(
                { roomcode: roomCode },
                { $push: { players: playerName  } }
            );

            socket.join(roomCode);
            console.log("Event roomCode emitting");
            callback({ success: true, roomCode });
            io.to(roomCode).emit("startGame", {
                message: "Both players have joined.",
                roomCode,
                players: activeRooms[roomCode].players
            });
        });

        // Get movie clue
        socket.on("getMovie", async ({ roomCode }, callback) => {
            if (isInRoom(roomCode, socket.id) && !activeRooms[roomCode].winner) {
                const clueToSend = activeRooms[roomCode].clue;
                callback(clueToSend);
            }
        });

        // Submit a guess
        socket.on("submitGuess", async ({ roomCode, guess }, callback) => {
            const room = activeRooms[roomCode];
            if (!room || room.winner !== null) return;

            const currentPlayerIndex = room.players.findIndex((player) => player.name === guess.playerName);
            if (currentPlayerIndex === -1) return;

            const currentMovie = room.movie;
            if (currentMovie.values[guess.index] === guess.value) {
                room.found[currentPlayerIndex]++;
                if (room.found[currentPlayerIndex] === 4) {
                    room.winner = guess.playerName;

                    // Update database
                    await GameRoom.updateOne({ roomcode: roomCode }, { winner: guess.playerName });
                    return callback({ correctness: true, won: true, lost: false, myFound: room.found[currentPlayerIndex], oppFound : room.found[oppPlayerIndex], myRemaining: room.remainingGuesses[currentPlayerIndex], oppRemaining: room.remainingGuesses[oppPlayerIndex]});
                }
                callback({ correctness: true, won: false, lost: false, myFound: room.found[currentPlayerIndex], oppFound : room.found[oppPlayerIndex], myRemaining: room.remainingGuesses[currentPlayerIndex], oppRemaining: room.remainingGuesses[oppPlayerIndex]});
            } else {
                room.remainingGuesses[currentPlayerIndex]--;
                if (room.remainingGuesses[currentPlayerIndex] === 0) {
                    return callback({ correctness: false, won: false, lost: true, myFound: room.found[currentPlayerIndex], oppFound : room.found[oppPlayerIndex], myRemaining: room.remainingGuesses[currentPlayerIndex], oppRemaining: room.remainingGuesses[oppPlayerIndex]});
                }
                callback({ correctness: false, won: false, lost: false, myFound: room.found[currentPlayerIndex], oppFound : room.found[oppPlayerIndex], myRemaining: room.remainingGuesses[currentPlayerIndex], oppRemaining: room.remainingGuesses[oppPlayerIndex]});
            }

            // Update database
            await GameRoom.updateOne(
                { roomcode: roomCode },
                {
                    remainingGuesses: room.remainingGuesses,
                    found: room.found,
                    winner: room.winner,
                }
            );
        });
        socket.on("invalidateRoom", async({ roomCode, playerName}, callback) => {
            console.log(`Invalidating room ${roomCode} as ${playerName} left`);
            const currentPlayerIndex = activeRooms[roomCode].players.indexOf(playerName);
            const oppPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;


        });
        // Handle disconnection
        socket.on("disconnect", async (reason) => {
            console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);

            const roomCode = Object.keys(activeRooms).find((code) =>
                activeRooms[code].players.some((player) => player.socketId === socket.id)
            );

            if (roomCode) {
                const room = activeRooms[roomCode];
                room.players = room.players.filter((player) => player.socketId !== socket.id);

                if (room.players.length === 0) {
                    console.log(`Room ${roomCode} is now empty and will be deleted.`);
                    delete activeRooms[roomCode];

                    // Remove room from database
                    await GameRoom.deleteOne({ roomcode: roomCode });
                } else {
                    console.log(`Player removed from room ${roomCode}`);
                    await GameRoom.updateOne({ roomcode: roomCode }, { players: room.players });
                }
            }
        });
    });
}

module.exports = manageGameSocket;