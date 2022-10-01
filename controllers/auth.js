const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const tokenHelper = require("../helpers/token");
const User = require("../models/user");

module.exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const result = await User.findOne({ where: { email: req.body.email } });
    if (result) return res.sendStatus(409);
    const passwordHash = await bcrypt.hash(res.body.password, 10);
    const user = await User.create({ name: req.body.name, email: req.body.email, password: passwordHash });
    res.status(200).json(user);
}

module.exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const result = await User.findOne({ where: { email: req.body.email } });
    if (!result) return res.sendStatus(404);
    if (!await bcrypt.compare(req.body.password, result.password)) return res.sendStatus(401);
    const accessToken = await tokenHelper.generateAccessToken({ email: result.email });
    const refreshToken = await tokenHelper.generateRefreshToken({ email: result.email });
    await User.update({ refreshToken }, { where: { email: req.body.email } });
    res.status(200).json({ accessToken, refreshToken });
}

module.exports.logout = async (req, res) => {
    const accessToken = await tokenHelper.expireToken({ email: res.user.email });
    await User.update({ refreshToken: null }, { where: { email: res.user.email } });
    res.status(200).json({ accessToken });
}

module.exports.refreshToken = async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);
    const result = await User.findOne({ where: { refreshToken } });
    if (!result) return res.sendStatus(403);
    try {
        const user = await tokenHelper.verifyToken(refreshToken);
        const accessToken = await tokenHelper.generateAccessToken({ email: user.email });
        res.status(200).json({ accessToken });
    } catch (error) {
        res.sendStatus(403);
    }
}