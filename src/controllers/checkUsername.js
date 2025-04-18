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