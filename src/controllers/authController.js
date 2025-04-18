const express = require("express");
const argon = require("argon2");
const path = require("path");

exports.checkUsername = async (req,res) => {
    console.log("checking username");
    const {username} = req.body;
    console.log(`Checking for presence of ${username} in DB...`);
    try {
        const user = await users.findOne({username: username});
        console.log(`Retrieved user: ${user}`);
        if(user) {
            return res.json({exists: true});
        }
        else {
            usernameValidity = true;
            return res.json({exists : false});
        }
    }
    catch(error) {
        console.err("Error fetching usernames");
    }
}

exports.validateLogin = async (req,res) => {
    console.log("checking login presence..");
    const {username, password} = req.body;
    const foundUser = await users.findOne({username: username});
    if(foundUser) {
        console.log(foundUser.pass);
        if(foundUser.pass.startsWith("$")) {
            try {
                if(await argon.verify(foundUser.pass, password)) {
                    console.log("Correct password!!");
                    return res.json({validity: true, userFound: true});
                }
                else    
                    console.log("Incorrect password!!");
                    return res.json({validity: false, userFound: true});
            }
            catch(err) {
                console.error("Can't verify hash...");
            }
        }
        else {
            console.log("Stored hash is invalid");
        }
    }
    else {
        console.log("User doesn't exist");
        return res.json({validity: false, userFound: false});
    }
}

exports.validateSignup = async (req,res) => {
    console.log("Entered into website");
    const { username, email, domain, pass1} = req.body;
    let new_email = email;
    if(domain !== "custom") {
        new_email +=  "@" + domain;
    }
    const hash = await argon.hash(pass1);
    await addUser(username,new_email,hash);
    console.log("User added");
    res.sendFile(path.join(__dirname,"/src/public/index.html"));
}