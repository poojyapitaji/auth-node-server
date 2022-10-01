require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.generateAccessToken = async (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

module.exports.generateRefreshToken = async (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

module.exports.verifyToken = async (refreshToken) => {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
}

module.exports.expireToken = async (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1s' });
}
