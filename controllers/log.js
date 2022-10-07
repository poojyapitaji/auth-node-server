require('dotenv').config();
const Log = require("../models/log");

module.exports.allLogs = async (req, res) => {
    const logs = await Log.findAll();
    res.status(200).json({ logs });
}