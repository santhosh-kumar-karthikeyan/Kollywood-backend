const User = require("../models/user.model");
exports.getUser = async(req,res) => {
    const { username} = req.query;
    console.log(`Searching for ${username}`);
    const userFound = await User.findOne({username: username});
    console.log("user found");
    if(!userFound)
        return res.status(404).json({ message: "user not found"});
    return res.json(userFound);
}


exports.getScore = async(req,res) => {
    const {username} = req.query;
    console.log(`Score requested for : ${username}`);
    const userFound = await User.findOne({username});
    if(userFound) {
        console.log("User found");
        return res.status(200).json({ score: userFound.totalScore});
    }
    console.log("User not found");
    return res.status(404).json({message: "user not found"});
}
