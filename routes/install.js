const express = require('express');
const router = express.Router();
const controller = require('../controllers/install');

router.post('/checkdb', controller.checkDbConnection);


module.exports = router