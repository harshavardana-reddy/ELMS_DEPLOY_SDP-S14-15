const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken')
const secret_key = process.env.SECRET_KEY


const generateToken = (user) => { // generates token
    return jwt.sign(user, secret_key, { expiresIn: "3h" });
}

const verifytoken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // console.log(authHeader)
    if (!authHeader) {
        return res.status(401).send("Access Denied");
    }
    const token = authHeader.split(' ')[1]; // For Removing 'Bearer' prefix
    // console.log(token)
    jwt.verify(token, secret_key, (err, decoded) => {
        if (err) {
            return res.status(403).send("Invalid Token");
        }
        req.user = decoded;
        next();
    });
}

const authorize = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
        next();
    } 
    else {
        res.status(403).send("Unauthorized");
    }
};

module.exports = {generateToken,authorize,verifytoken}