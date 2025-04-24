const argon = require("argon2");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config(path.resolve("../../.env"));
const secretKey = process.env.JWT_SECRET_KET;

exports.checkUsername = async (req, res) => {
  console.log("checking username");
  console.log(req.query);
  const { username } = req.query;
  console.log(`Checking for presence of ${username} in DB...`);
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      return res.status(400).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ exists: false, message: "User can't be fetched" });
  }
};

exports.validateLogin = async (req, res) => {
  console.log("checking login presence..");
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username: username });
  if (foundUser) {
    console.log(foundUser.passwordHash);
    if (foundUser.passwordHash.startsWith("$")) {
      try {
        if (await argon.verify(foundUser.passwordHash, password)) {
          console.log("Correct password!!");
          const token = jwt.sign(
            {
              username: foundUser.username,
              email: foundUser.email,
            },
            secretKey,
            { expiresIn: "1h" }
          );
          return res.status(200).json({ token, message: "correct password" });
        } else console.log("Incorrect password!!");
        return res.status(400).json({ message: "incorrect password" });
      } catch (err) {
        return res.status(400).json({ message: "can't verify hash" });
      }
    } else {
      return res.status(400).json({ message: "stored hash invalid" });
    }
  } else {
    return res.status(404).json({ message: "User doesn't exist" });
  }
};

exports.addUser = async (req, res) => {
  console.log("Entered into website with post request");
  const { username, email, domain, pass1 } = req.body;
  let new_email = email;
  if (domain !== "custom") {
    new_email += "@" + domain;
  }
  console.log(username);
  console.log(req.body);
  const hash = await argon.hash(pass1);
  const newUser = new User({
    username,
    email: new_email,
    domain,
    passwordHash: hash,
    role: "User",
  });
  await newUser.save();
  console.log("User added");
  const token = jwt.sign({
    username: newUser.username,
    email : newUser.email
    },
    secretKey,
    { expiresIn : "1h"}
  );
  return res.status(200).json({ token, message: "User added" });
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
