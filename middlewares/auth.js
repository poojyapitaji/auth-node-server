require('dotenv').config();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
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

module.exports.loginLimiter = rateLimit({
    windowMS: 60 * 1000, // 1 minutes
    max: 5, // Limit each IP to 5 login request per `window` per minute
    handler: (req, res, next, options) => {
        res.sendStatus(options.statusCode);
    },
    standradHeaders: true, //Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable ht `X-RateLimit-*` headers
});

module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return res.sendStatus(403);
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        res.user = user;
        next();
    });
}