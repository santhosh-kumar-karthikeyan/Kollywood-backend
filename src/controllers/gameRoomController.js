const GameRoom = require("../models/gameRoom.model");

exports.getMatchDetails = async(req,res) => {
    const { roomCode } = req.query;
    console.log(`Access requested for roomcode: ${roomCode}`);
    const room = await GameRoom.findOne({roomCode});
    if(room) 
        return res.status(200).json(room);
    return res.status(404).json({message: "room not found"});
}
