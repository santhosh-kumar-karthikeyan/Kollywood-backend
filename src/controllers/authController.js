const argon = require("argon2");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config(path.resolve("../../.env"));
const secretKey = process.env.JWT_SECRET_KEY;

exports.checkUsername = async (req, res) => {
  console.log("checking username");
  console.log(req.query);
  const { username } = req.query;
  console.log(`Checking for presence of ${username} in DB...`);
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      return res.status(200).json({ exists: true });
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
              role: foundUser.role
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
  const { username, email, domain, password } = req.body;
  let new_email = email;
  if (domain !== "custom") {
    new_email += "@" + domain;
  }
  console.log(username);
  const existingUser = await User.findOne({username: username});
  if(existingUser)
    return res.status(300).json({message: "User already exists"});
  console.log(req.body);
  const hash = await argon.hash(password);
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
    email : newUser.email,
    role: newUser.role
    },
    secretKey,
    { expiresIn : "1h"}
  );
  return res.status(200).json({ token, message: "User added" });
};

