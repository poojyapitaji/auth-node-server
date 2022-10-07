const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const middleware = require('../middlewares/auth');

router.post('/register', middleware.register, controller.register);
router.post('/login', middleware.loginLimiter, middleware.login, controller.login);
router.post('/logout', controller.logout);
router.post('/refresh', controller.refreshToken);

module.exports = router