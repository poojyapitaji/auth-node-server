require('dotenv').config();
const User = require("../models/user");

module.exports.allUsers = async (req, res) => {
    const users = await User.findAll();
    res.status(200).json({ users });
}