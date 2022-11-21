const jwt = require("jsonwebtoken");


exports.generateToken = (payload, expired = 30) => {
    return jwt.sign(payload, process.env.TOKEN_SECRETE, {
        expiresIn: expired
    });
};