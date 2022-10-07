require('dotenv').config();
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");

module.exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const result = await User.findOne({ where: { email: req.body.email } });
    if (result) return res.sendStatus(409);
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    await User.create({ name: req.body.name, email: req.body.email, password: passwordHash });
    res.sendStatus(200);
}

module.exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const result = await User.scope('withPassword').findOne({ where: { email: req.body.email } });
    if (!result) return res.sendStatus(404);
    if (!await bcrypt.compare(req.body.password, result.password)) return res.sendStatus(401);
    const accessToken = jwt.sign({ email: result.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ email: result.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
    await User.update({ refreshToken }, { where: { email: req.body.email } });
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000 //should be same as the refresh token expiry
    });
    res.status(200).json({ accessToken });
}

module.exports.logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });
    res.sendStatus(200);
}

module.exports.refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
        res.status(200).json({ accessToken });
    } catch (error) {
        res.sendStatus(403);
    }
}