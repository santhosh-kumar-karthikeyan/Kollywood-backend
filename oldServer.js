const express = require("express");
const app = express();
const path = require("path");
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
const argon = require("argon2");
const cors = require("cors");
// const {Server} = require("socket.io");
const http = require("http");
const httpServer = http.createServer(app);
// const io = new Server(httpServer);
app.use(cors());
// let waitingPlayer = null;
let users;
exports.users = users;
let sessions;
// let loggedIn = false;
// let userId = "";

//     if(highestGameId) 
//         newGameId = highestGameId + 1;
//     return newGameId;
// }
// io.on("connection",async (socket) => {   
//     console.log("Player connected");
//     if(waitingPlayer === null) {
//         waitingPlayer = socket;
//         socket.emit("waiting","Players connected 1/2. Waiting for another player...");
//     }
//     else {
//         const player1 = waitingPlayer;
//         const player2 = socket;
//         waitingPlayer = null;
//         const gameId = await nextGameId();
//         console.log(`Game ID created. Game ID: ${gameId}`);
//         sessions.insertOne({gameId: gameId, player1Id : player1, player2Id : player2});
//         console.log(`DB updated with gameId: ${gameId}`);
//         const room = `game-${gameId}`;
//         console.log(`Created room: ${room}`);
//         player1.join(room);
//         player2.join(room);
//         player1.emit("matched",{
//             self: player1,
//             opponent : player2,
//             gameId : gameId
//         });
//         player2.emit("matched", {
//             self: player2,
//             opponent : player1,
//             gameId : gameId
//         });
//         console.log(`Match created between ${player1} vs ${player2}`);
//     }
// });
async function fetchCollection(dbName, colName) {
    try {
        const db = await client.db(dbName);
        const users = db.collection(colName);
        return users;
    }
    catch(err) {
        console.error("Can't fetch collection: "+err);
    }
}

async function addUser(username,email, pass_hash) {
    await users.insertOne({username: username, email: email, pass: pass_hash});
}
exports.addUser = addUser;

app.use(express.static(path.join(__dirname,"/src/public")));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.get("/",function(req,res) {
    res.sendFile(path.join(__dirname,"/src/public/index.html"));
});
app.get("/login",function(req,res) {
    res.sendFile(path.join(__dirname,"/src/public/login.html"));
});
app.get("/leaderboard",function(req,res) {
    res.sendFile(path.join(__dirname,"/src/public/leaderboard.html"));
});
app.get("/rules",function(req,res) {
    res.sendFile(path.join(__dirname,"/src/public/rules.html"))
}); 
app.get("/signUp",(req,res) => {
    res.sendFile(path.join(__dirname,"/src/public/signUp.html"));
})
app.get("/matchUp",(req,res)=> {
    res.sendFile(path.join(__dirname,"/src/public/matchup.html"));
});
app.post("/validateSignup",async (req,res) => {
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
});
app.post("/validateLogin",async (req,res) => {
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
});
app.post("/checkUsername",async (req,res) => {
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
});
app.listen("5000", async () => {
    await client.connect();
    console.log("Connected to Kollywood database...");
    users = await fetchCollection("Kollywood","Users");
    sessions = await fetchCollection("Kollywood","Sessions");
    console.log("User database ready...");
});
console.log("Server listening at port 5000");