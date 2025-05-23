const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

exports.jwtAuth = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(400).json({ message: "Invalid token"});
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token,secretKey);
        req.username = decoded.username;
        req.email = decoded.email;
        req.role = decoded.role;
        next();
    }
    catch(err) {
        console.error(err);
        res.status(401).json({message: "invalid jwt token"});
    }
}