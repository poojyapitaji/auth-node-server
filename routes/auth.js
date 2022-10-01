const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const middleware = require('../middlewares/auth');

router.post('/register', middleware.register, controller.register);
router.post('/login', middleware.login, controller.login);
router.post('/logout', middleware.verifyToken, controller.logout);
router.post('/refresh-token', controller.refreshToken);
router.get('/test', middleware.verifyToken, (req, res) => {
    res.send(200);
});

module.exports = router