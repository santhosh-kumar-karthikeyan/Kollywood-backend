const argon = require("argon2");
const path = require("path");
const User = require("../models/user.model");

exports.checkUsername = async (req,res) => {
    console.log("checking username");
    console.log(req.query);
    const {username} = req.query;
    console.log(`Checking for presence of ${username} in DB...`);
    try {
        const user = await User.findOne({username: username});
        if(user) {
            return res.status(400).json({exists: true});
        }
        else {
            return res.status(200).json({exists : false});
        }
    }
    catch(error) {
        return res.status(404).json({exists: false, message: "User can't be fetched"});
    }
}

exports.validateLogin = async (req,res) => {
    console.log("checking login presence..");
    const {username, password} = req.body;
    const foundUser = await User.findOne({username: username});
    if(foundUser) {
        console.log(foundUser.passwordHash);
        if(foundUser.passwordHash.startsWith("$")) {
            try {
                if(await argon.verify(foundUser.passwordHash, password)) {
                    console.log("Correct password!!");
                    return res.status(200).json({message: "correct password"});
                }
                else    
                    console.log("Incorrect password!!");
                    return res.status(400).json({message: "incorrect password"});
            }
            catch(err) {
                return res.status(400).json({message: "can't verify hash"});
            }
        }
        else {
            return res.status(400).json({message: "stored hash invalid"})
        }
    }
    else {
        return res.status(404).json({message: "User doesn't exist"});
    }
}

exports.addUser = async (req,res) => {
    console.log("Entered into website with post request");
    const { username, email, domain, pass1} = req.body;
    let new_email = email;
    if(domain !== "custom") {
        new_email +=  "@" + domain;
    }
    console.log(username);
    console.log(req.body);
    const hash = await argon.hash(pass1);
    const newUser = new User({
        username,
        email: new_email,
        domain,
        passwordHash: hash,
        role: "User"
    });
    await newUser.save();
    console.log("User added");
    return res.status(200).json({message: "User added"});
}