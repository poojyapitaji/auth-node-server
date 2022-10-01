require('dotenv').config();
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');

exports.register = [
    body("name", "In-valid name").not().isEmpty(),
    body("email", "In-valid email").isEmail(),
    body("password", "In-valid password").not().isEmpty().isLength({ min: 5 }),
];

exports.login = [
    body("email", "In-valid email").isEmail(),
    body("password", "In-valid password").not().isEmpty(),
];

module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        res.user = user;
        next();
    })
}