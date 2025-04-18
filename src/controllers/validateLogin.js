const argon = require("argon2");
const { users } = require("../../server");

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