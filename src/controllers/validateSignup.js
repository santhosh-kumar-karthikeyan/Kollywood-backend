const argon = require("argon2");
const path = require("path");
const { addUser } = require("../../server");

module.exports = async (req,res) => {
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