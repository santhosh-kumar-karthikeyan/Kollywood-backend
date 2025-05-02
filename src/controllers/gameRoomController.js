const GameRoom = require("../models/gameRoom.model");
const { activeRooms } = require("../utils/activeRooms");

exports.getRoomCodeToJoin = async(req,res) => {
  console.log("Checking for free rooms...");
  const rooms = Object.entries(activeRooms).find(([roomCode,room]) => {
    return room?.players?.length === 1 && room.winner === null
  });
  if(!rooms) {
    console.log("No free rooms found. Sending notification to create a room");
    return res.status(200).json({roomCode: null});
  }
  console.log("Room: "+rooms[0]);
  return res.status(200).json({roomCode: rooms[0]});
}

exports.getMatchDetails = async (req, res) => {
  const { roomCode } = req.query;
  console.log(`Access requested for roomcode: ${roomCode}`);
  const room = await GameRoom.findOne({ roomCode });
  if (room) return res.status(200).json(room);
  return res.status(404).json({ message: "room not found" });
};

exports.getUserHistory = async (req, res) => {
  const { username } = req.query;
  const rooms = await GameRoom.find();
  if (!rooms)
    return res.status(404).json({ message: "User hasn't played yet" });
  console.log(rooms);
  const roomsWithPlayer = rooms.filter(room => room.players.some(player => player === username)); 
  console.log(roomsWithPlayer)
  const history = roomsWithPlayer.map(room => {
    const playerIndex = room.players.indexOf(username);
    const player = room.players.find(player => player === username );
    const opponent = room.players.find(player => player !== username);
    return {
      "player" : player || "Unknown",
      "playerScore" : room.score[playerIndex] || 0,
      "opponent" : opponent || "Unknown",
      "oppponentScore" : room.score[!playerIndex] || 0,
      "winner" : room.winner ? room.winner : "Unknown",
      "time" : room.createdAt || Date.now()
    }
  });
  return res.status(200).json(history);
};
