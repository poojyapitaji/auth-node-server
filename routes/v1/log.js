const express = require('express');
const router = express.Router();
const controller = require('../../controllers/log');
const middleware = require('../../middlewares/auth');

router.get('/all', middleware.verifyToken, controller.allLogs);

module.exports = router