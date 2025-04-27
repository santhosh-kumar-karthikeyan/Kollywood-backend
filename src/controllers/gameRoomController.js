const GameRoom = require("../models/gameRoom.model");
const { activeRooms } = require("../utils/activeRooms");

exports.getRoomCodeToJoin = async(req,res) => {
  console.log("Checking for free rooms...");
  const rooms = Object.entries(activeRooms).find(([roomCode,room]) => {
    return room.players.length === 1 && room.winner === 0
  });
  if(!rooms)
    return res.status(200).json({roomCode: null});
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
  const rooms = await GameRoom.find({ "winner" : { $ne : 0} });
  if (!rooms)
    return res.status(404).json({ message: "User hasn't played yet" });
  const roomsWithPlayer = rooms.filter(room => room.players.some(player => player.name === username)); 
  const history = roomsWithPlayer.map(room => {
    const player = room.players.find(player => player.name === username );
    const opponent = room.players.find(player => player.name !== username);
    return {
      "player" : player.name || username,
      "playerScore" : player.score || 0,
      "opponent" : opponent.name || "Unknown",
      "oppponentScore" : opponent.score || 0,
      "winner" : room.winner !== 0 ? room.players[room.winner - 1].name : "Unknown"
    }
  });
  return res.status(200).json(history);
};
