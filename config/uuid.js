const uuid = require('node-uuid');

const generateLoggerUUID = (req, res, next) => {
    req.id = uuid.v4();
    next();
}

module.exports = generateLoggerUUID;