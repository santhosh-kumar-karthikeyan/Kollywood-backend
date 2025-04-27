const Clue = require("../models/clue.class");

const activeRooms = {};

async function createRoom(roomCode, socketId) {
    const movie = new Clue();
    await movie.populateClue();
    activeRooms[roomCode] = {
            players: [socketId],
            remainingGuesses: [9,9],
            movie: movie,
            clue: movie.dispatchObscureClue(),
            winner: 0
    }
}

function addPlayerToRoom(roomCode,socketId) {
    if(activeRooms[roomCode])
        activeRooms[roomCode].players.push(socketId);
    else
        return { error: 'roomCode not found'};
}

function getRoom(roomCode) {
    return activeRooms[roomCode];
}

function isInRoom(roomCode, socketId) {
    return activeRooms[roomCode].players.some(player => player === socketId);
}

module.exports = { activeRooms, createRoom, addPlayerToRoom, getRoom, isInRoom};