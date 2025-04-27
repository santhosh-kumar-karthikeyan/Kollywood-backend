const Clue = require("../models/clue.class");

const activeRooms = {};

async function createRoom(roomCode, playerName) {
    const movie = new Clue();
    await movie.populateClue();
    activeRooms[roomCode] = {
        players: [ playerName ],
        remainingGuesses: [9, 9],
        found: [0, 0],
        movie: movie,
        clue: movie.dispatchObscureClue(),
        winner: null,
    };
}

function addPlayerToRoom(roomCode, playerName) {
    if (activeRooms[roomCode]) {
        activeRooms[roomCode].players.push(playerName);
    } else {
        throw new Error("Room not found");
    }
}

function getRoom(roomCode) {
    return activeRooms[roomCode];
}

function isInRoom(roomCode, playerName) {
    return activeRooms[roomCode]?.players.includes(playerName);
}

module.exports = { activeRooms, createRoom, addPlayerToRoom, getRoom, isInRoom };