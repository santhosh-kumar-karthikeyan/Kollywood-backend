const User = require("../models/user.model");

exports.getUser = async (req, res) => {
  const { username } = req.query;
  console.log(`Searching for ${username}`); 
  const userFound = await User.findOne({ username: username }).select('-passwordHash');
  console.log("user found");
  if (!userFound) return res.status(404).json({ message: "user not found" });
  return res.json(userFound);
};

exports.getUsers = async(req,res) => {
  console.log("Access requested to display all users..");
  if(req.role === "Admin") {
    const users = await User.find().select('-passwordHash');
    return res.status(200).json(users);
  }
  else {
    return res.status(300).json({message: 'Elevation required'});
  }
}

exports.getScore = async (req, res) => {
  const { username } = req.query;
  console.log(`Score requested for : ${username}`);
  const userFound = await User.findOne({ username });
  if (userFound) {
    console.log("User found");
    return res.status(200).json({ score: userFound.totalScore });
  }
  console.log("User not found");
  return res.status(404).json({ message: "user not found" });
};

exports.changePassword = async (req, res) => {
  const { username, oldPass, newPass } = req.body;
  console.log(`Requested password change for: ${username}`);
  const userFound = await User.findOne({ username });
  if (!userFound) return res.status(404).json({ message: "user not found" });
  const oldHash = userFound.passwordHash;
  console.log(oldHash);
  console.log(typeof oldHash);
  console.log(oldPass);
  console.log(typeof oldPass);
  const validity = await argon.verify(oldHash, oldPass);
  if (!validity) {
    console.log("Incorrect old password");
    return res.status(400).json({ message: "incorrect old password" });
  }
  //old password has been validated, time to update new password
  console.log("Correct old password. Changing password...");
  try {
    userFound.passwordHash = await argon.hash(newPass);
    await userFound.save();
    console.log("Password changed");
    return res.status(200).json({ message: "password updated" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "hashing error" });
  }
};
