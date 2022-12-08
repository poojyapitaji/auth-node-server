const emitter = require('../config/emitter');
const mailService = require('../services/mail');

emitter.on('sendMail', (data) => mailService.sendMail(data));