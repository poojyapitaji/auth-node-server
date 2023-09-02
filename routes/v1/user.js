const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user');
const middleware = require('../../middlewares/auth');

router.get('/all', middleware.verifyToken, controller.allUsers);

module.exports = router