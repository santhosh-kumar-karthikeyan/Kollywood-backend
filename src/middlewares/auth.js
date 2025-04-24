const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path : path.resolve("../../.env")});

const secretKey = process.env.JWT_SECRET_KEY;

exports.jwtAuth = (req,res,next) => {
    const token = req.header('x-auth-token');
    if(!token) {
        return res.status(401).json({ message: "no token, access denied"});
    }
    try {
        const decoded = jwt.verify(token,secretKey);
        req.user = decoded.user;
        next();
    }
    catch(err) {
        console.error(err);
        res.status(401).json({message: "invalid jwt token"});
    }
}